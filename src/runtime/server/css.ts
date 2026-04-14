import type { CheerioAPI } from 'cheerio'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { tailwindCss } from '#sidebase-pdf/tailwind'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { userCss } from '#sidebase-pdf/user-css'
import * as cheerio from 'cheerio'
import { compile } from 'tailwindcss'
import { getLogger } from './logger'

export function extractClasses(dom: CheerioAPI): string[] {
  const classes = new Set<string>()

  dom('[class]').each((_, element) => {
    const classAttr = dom(element).attr('class')
    if (classAttr) {
      for (const cls of classAttr.split(/\s+/)) {
        if (cls) {
          classes.add(cls)
        }
      }
    }
  })

  return [...classes]
}

export function extractCustomStyles(dom: CheerioAPI): string {
  let styles = ''

  dom('.custom-style').each((_, element) => {
    styles += dom(element).html() ?? ''
  })

  return styles
}

// Single-slot compiler cache state
let cachedInput: string | null = null
let cachedCompiler: Awaited<ReturnType<typeof compile>> | null = null
let hitCount = 0
let missCount = 0

export async function getCssForMarkup(html: string, customCss?: string): Promise<string> {
  const logger = getLogger()
  const dom = cheerio.load(html)
  const classes = extractClasses(dom)
  const customStyles = extractCustomStyles(dom)

  // Use user CSS file as base if provided, otherwise default to @import "tailwindcss"
  const baseCss = (userCss as string) || '@import "tailwindcss";'
  const compilationInput = `${baseCss}\n${customStyles}\n${customCss ?? ''}`

  let compiler: Awaited<ReturnType<typeof compile>>

  if (cachedCompiler && cachedInput === compilationInput) {
    compiler = cachedCompiler
    hitCount++
    logger.debug('CSS compiler cache hit', { hitCount, missCount })
  } else {
    const compileStart = performance.now()
    compiler = await compile(compilationInput, {
      base: '/',
      loadStylesheet: (_id: string, base: string) => ({
        path: 'virtual:tailwindcss',
        base,
        content: tailwindCss as string,
      }),
      loadModule: async (id: string, base: string, resourceHint?: string) => {
        try {
          const mod = await import(id)
          return { path: id, base, module: mod.default ?? mod }
        } catch {
          throw new Error(
            `Failed to load Tailwind ${resourceHint ?? 'module'} "${id}". Is it installed? Run: pnpm add ${id}`,
          )
        }
      },
    })
    cachedInput = compilationInput
    cachedCompiler = compiler
    missCount++
    const compileTime = Math.round(performance.now() - compileStart)
    logger.debug('CSS compiler cache miss', { hitCount, missCount, compileTime })
  }

  const buildStart = performance.now()
  const css = compiler.build(classes)
  const buildTime = Math.round(performance.now() - buildStart)
  logger.debug('CSS built', { classCount: classes.length, buildTime, cssSize: css.length })
  return css
}
