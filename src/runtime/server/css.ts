import type { CheerioAPI } from 'cheerio'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { tailwindCss } from '#sidebase-pdf/tailwind'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { userCss } from '#sidebase-pdf/user-css'
import * as cheerio from 'cheerio'
import { compile } from 'tailwindcss'

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

export async function getCssForMarkup(html: string, customCss?: string): Promise<string> {
  const dom = cheerio.load(html)
  const classes = extractClasses(dom)
  const customStyles = extractCustomStyles(dom)

  // Use user CSS file as base if provided, otherwise default to @import "tailwindcss"
  const baseCss = (userCss as string) || '@import "tailwindcss";'
  const compilationInput = `${baseCss}\n${customStyles}\n${customCss ?? ''}`

  const compiler = await compile(compilationInput, {
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

  return compiler.build(classes)
}
