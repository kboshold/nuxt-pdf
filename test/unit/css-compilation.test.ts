import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

// Mock virtual modules before importing getCssForMarkup
const tailwindCss = readFileSync(require.resolve('tailwindcss/index.css'), 'utf-8')
vi.mock('#sidebase-pdf/tailwind', () => ({
  tailwindCss,
}))
vi.mock('#sidebase-pdf/user-css', () => ({ userCss: '' }))

const { getCssForMarkup } = await import('../../src/runtime/server/css')

describe('getCssForMarkup', () => {
  it('compiles Tailwind classes from HTML into valid CSS', async () => {
    const html = '<div class="flex gap-4 text-red-500">test</div>'
    const css = await getCssForMarkup(html)

    expect(css).toBeTruthy()
    expect(css.length).toBeGreaterThan(0)
    expect(css).toContain('.flex')
    expect(css).toContain('.gap-4')
    expect(css).toContain('.text-red-500')
  })

  it('includes custom styles from .custom-style elements', async () => {
    const html = '<div class="flex">test</div><div class="custom-style">@page { size: A4 landscape }</div>'
    const css = await getCssForMarkup(html)

    expect(css).toContain('.flex')
    expect(css).toContain('@page')
  })

  it('accepts additional custom CSS parameter', async () => {
    const html = '<div class="p-4">test</div>'
    const css = await getCssForMarkup(html, '.custom { color: red }')

    expect(css).toContain('.p-4')
    expect(css).toContain('.custom')
  })

  it('returns CSS even with no matching classes', async () => {
    const html = '<div>no classes here</div>'
    const css = await getCssForMarkup(html)

    // Should still return base CSS (reset, preflight, etc.)
    expect(typeof css).toBe('string')
  })
})
