import type { ModuleOptions } from './runtime/types'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { addImportsDir, addTemplate, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import jsesc from 'jsesc'

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
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.pdf = options

    const { resolve } = createResolver(import.meta.url)

    // --- Virtual module: Tailwind CSS ---
    const tailwindInput = require.resolve('tailwindcss/index.css')
    const tailwindContent = readFileSync(tailwindInput, 'utf-8')

    const { dst: tailwindOutput } = addTemplate({
      filename: join('sidebase-pdf', 'tailwind-css.mjs'),
      write: true,
      getContents: () => `export const tailwindCss = ${JSON.stringify(tailwindContent)};`,
    })

    // --- Virtual module: Paged.js polyfill ---
    const pagedInput = require.resolve('pagedjs')
    const pagedContent = readFileSync(join(pagedInput, '../../dist/paged.polyfill.js'), 'utf-8')
    const escapedContent = jsesc(pagedContent, { es6: true, quotes: 'backtick' })

    const { dst: pagedOutput } = addTemplate({
      filename: join('sidebase-pdf', 'paged-polyfill.mjs'),
      write: true,
      getContents: () => `export const polyfill = \`${escapedContent}\`;`,
    })

    // --- Nitro aliases ---
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      nitroConfig.alias['#sidebase-pdf/tailwind'] = tailwindOutput
      nitroConfig.alias['#sidebase-pdf/pagedjs'] = pagedOutput
      nitroConfig.alias['#pdf'] = resolve('./runtime/server')
      nitroConfig.alias['#pdf/components'] = resolve('./runtime/components')
    })

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

declare module '@nuxt/schema' {
  interface NuxtConfig { pdf?: ModuleOptions }
  interface NuxtOptions { pdf?: ModuleOptions }
}
