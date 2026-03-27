import type { CheerioAPI } from 'cheerio'
import * as cheerio from 'cheerio'
import { compile } from 'tailwindcss'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { tailwindCss } from '#sidebase-pdf/tailwind'

function extractClasses(dom: CheerioAPI): string[] {
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

function extractCustomStyles(dom: CheerioAPI): string {
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

  const compiler = await compile(
    `@import "tailwindcss";\n${customStyles}\n${customCss ?? ''}`,
    {
      base: '/',
      loadStylesheet: async (_id: string, base: string) => ({
        path: 'virtual:tailwindcss',
        base,
        content: tailwindCss as string,
      }),
    },
  )

  return compiler.build(classes)
}
