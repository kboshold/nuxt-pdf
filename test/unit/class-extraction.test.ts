import * as cheerio from 'cheerio'
import { describe, expect, it, vi } from 'vitest'

// Mock virtual modules so css.ts can be imported
vi.mock('#sidebase-pdf/tailwind', () => ({ tailwindCss: '' }))
vi.mock('#sidebase-pdf/user-css', () => ({ userCss: '' }))

const { extractClasses, extractCustomStyles } = await import('../../src/runtime/server/css')

describe('extractClasses', () => {
  it('extracts all Tailwind classes from HTML', () => {
    const dom = cheerio.load('<div class="flex gap-4 text-red-500"><span class="font-bold">test</span></div>')
    const classes = extractClasses(dom)
    expect(classes).toContain('flex')
    expect(classes).toContain('gap-4')
    expect(classes).toContain('text-red-500')
    expect(classes).toContain('font-bold')
  })

  it('deduplicates classes', () => {
    const dom = cheerio.load('<div class="flex"><span class="flex">test</span></div>')
    const classes = extractClasses(dom)
    const flexCount = classes.filter(c => c === 'flex').length
    expect(flexCount).toBe(1)
  })

  it('handles empty class attributes', () => {
    const dom = cheerio.load('<div class="">test</div>')
    const classes = extractClasses(dom)
    expect(classes).toHaveLength(0)
  })

  it('handles elements without classes', () => {
    const dom = cheerio.load('<div>no classes</div>')
    const classes = extractClasses(dom)
    expect(classes).toHaveLength(0)
  })

  it('handles extra whitespace in class attribute', () => {
    const dom = cheerio.load('<div class="  flex   gap-4  ">test</div>')
    const classes = extractClasses(dom)
    expect(classes).toContain('flex')
    expect(classes).toContain('gap-4')
    expect(classes).toHaveLength(2)
  })

  it('extracts arbitrary value classes like w-[55mm]', () => {
    const dom = cheerio.load('<div class="w-[55mm] h-[20mm] top-[5mm]">test</div>')
    const classes = extractClasses(dom)
    expect(classes).toContain('w-[55mm]')
    expect(classes).toContain('h-[20mm]')
    expect(classes).toContain('top-[5mm]')
    expect(classes).toHaveLength(3)
  })

  it('extracts nested element classes', () => {
    const dom = cheerio.load('<div class="flex"><span class="text-sm"><a class="underline">link</a></span></div>')
    const classes = extractClasses(dom)
    expect(classes).toContain('flex')
    expect(classes).toContain('text-sm')
    expect(classes).toContain('underline')
    expect(classes).toHaveLength(3)
  })
})

describe('extractCustomStyles', () => {
  it('extracts content from .custom-style elements', () => {
    const dom = cheerio.load('<div class="custom-style">@page { size: A4 }</div><div>content</div>')
    const styles = extractCustomStyles(dom)
    expect(styles).toContain('@page { size: A4 }')
  })

  it('concatenates multiple custom-style elements', () => {
    const dom = cheerio.load('<div class="custom-style">a{}</div><div class="custom-style">b{}</div>')
    const styles = extractCustomStyles(dom)
    expect(styles).toContain('a{}')
    expect(styles).toContain('b{}')
  })

  it('returns empty string when no custom styles', () => {
    const dom = cheerio.load('<div>no styles</div>')
    const styles = extractCustomStyles(dom)
    expect(styles).toBe('')
  })
})
