import type { ModuleOptions } from './runtime/types'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, join } from 'node:path'
import { addImportsDir, addServerPlugin, addTemplate, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import vue from '@vitejs/plugin-vue'
import jsesc from 'jsesc'

const _require = createRequire(import.meta.url)
const PACKAGE_NAME = '@sidebase/nuxt-pdf'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: PACKAGE_NAME,
    configKey: 'pdf',
  },
  defaults: {
    isEnabled: true,
    isCleanupEnabled: true,
    usePagedJS: true,
    chromePath: undefined,
    cssFile: undefined,
    maxConcurrency: 5,
    maxRenderCount: 500,
  },
  setup(options, nuxt) {
    const logger = useLogger(PACKAGE_NAME)

    if (!options.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }

    // Resolve chromePath from env var
    options.chromePath = process.env.SIDEBASE_PDF_CHROME_PATH || options.chromePath

    // Store options in runtime config
    nuxt.options.runtimeConfig.pdf = options as Required<ModuleOptions>

    const { resolve } = createResolver(import.meta.url)

    // --- Virtual module: Tailwind CSS ---
    const tailwindInput = _require.resolve('tailwindcss/index.css')
    const tailwindContent = readFileSync(tailwindInput, 'utf-8')

    const { dst: tailwindOutput } = addTemplate({
      filename: join('sidebase-pdf', 'tailwind-css.mjs'),
      write: true,
      getContents: () => `export const tailwindCss = ${JSON.stringify(tailwindContent)};`,
    })

    // --- Virtual module: Paged.js polyfill ---
    const pagedPkgPath = _require.resolve('pagedjs')
    const pagedDir = dirname(dirname(pagedPkgPath))
    const pagedContent = readFileSync(join(pagedDir, 'dist', 'paged.polyfill.js'), 'utf-8')
    const escapedContent = jsesc(pagedContent, { es6: true, quotes: 'backtick' })

    const { dst: pagedOutput } = addTemplate({
      filename: join('sidebase-pdf', 'paged-polyfill.mjs'),
      write: true,
      getContents: () => `export const polyfill = \`${escapedContent}\`;`,
    })

    // --- Virtual module: User CSS file ---
    let userCssContent = ''
    if (options.cssFile) {
      // Resolve ~ alias to srcDir
      let cssFilePath = options.cssFile
      if (cssFilePath.startsWith('~') || cssFilePath.startsWith('@')) {
        cssFilePath = cssFilePath.replace(/^[~@]\//, `${nuxt.options.srcDir}/`)
      }
      if (!isAbsolute(cssFilePath)) {
        cssFilePath = join(nuxt.options.rootDir, cssFilePath)
      }

      if (!existsSync(cssFilePath)) {
        throw new Error(
          `[${PACKAGE_NAME}] CSS file not found: "${cssFilePath}" `
          + `(configured as pdf.cssFile: "${options.cssFile}"). `
          + `Ensure the file exists and the path is correct.`,
        )
      }

      userCssContent = readFileSync(cssFilePath, 'utf-8')
      logger.info(`Using custom CSS file: ${cssFilePath}`)
    }

    const { dst: userCssOutput } = addTemplate({
      filename: join('sidebase-pdf', 'user-css.mjs'),
      write: true,
      getContents: () => `export const userCss = ${JSON.stringify(userCssContent)};`,
    })

    // --- Nitro config ---
    nuxt.hook('nitro:config', (nitroConfig) => {
      // Aliases for virtual modules
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#sidebase-pdf/tailwind'] = tailwindOutput
      nitroConfig.alias['#sidebase-pdf/pagedjs'] = pagedOutput
      nitroConfig.alias['#sidebase-pdf/user-css'] = userCssOutput
      nitroConfig.alias['#pdf'] = resolve('./runtime/server')
      nitroConfig.alias['#pdf/components'] = resolve('./runtime/components')

      // Enable Vue SFC imports in server routes (for PDF templates)
      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {}
      nitroConfig.rollupConfig.plugins = nitroConfig.rollupConfig.plugins || []
      ;(nitroConfig.rollupConfig.plugins as unknown[]).push(vue())
    })

    // --- Cleanup plugin ---
    if (options.isCleanupEnabled) {
      addServerPlugin(resolve('./runtime/server/plugins/cleanup'))
    }

    // --- Auto-imports ---
    addImportsDir(resolve('./runtime/composables'))

    // --- Type declarations ---
    addTypeTemplate({
      filename: 'types/sidebase-pdf.d.ts',
      src: resolve('./runtime/types.d.ts'),
    })

    logger.success(`${PACKAGE_NAME} setup completed`)
  },
})

// Used by nuxt/module-builder for `types.d.ts` generation
export type { ModuleOptions }

export interface ModulePublicRuntimeConfig {
  pdf: ModuleOptions
}
