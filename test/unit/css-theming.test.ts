import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'

const tailwindCss = readFileSync(require.resolve('tailwindcss/index.css'), 'utf-8')

beforeEach(() => {
  vi.resetModules()
})

async function importCssWithUserCss(userCss: string) {
  vi.doMock('#sidebase-pdf/tailwind', () => ({ tailwindCss }))
  vi.doMock('#sidebase-pdf/user-css', () => ({ userCss }))
  const mod = await import('../../src/runtime/server/css')
  return mod.getCssForMarkup
}

describe('@theme compilation', () => {
  it('compiles custom theme color into CSS output', async () => {
    const getCssForMarkup = await importCssWithUserCss(
      '@import "tailwindcss";\n@theme { --color-brand: #ff0000; }',
    )
    const css = await getCssForMarkup('<div class="text-brand">test</div>')

    expect(css).toContain('.text-brand')
    expect(css).toContain('#ff0000')
  })
})

describe('@plugin support', () => {
  it('resolves @tailwindcss/typography and compiles prose styles', async () => {
    const getCssForMarkup = await importCssWithUserCss(
      '@import "tailwindcss";\n@plugin "@tailwindcss/typography";',
    )
    const css = await getCssForMarkup('<div class="prose"><h1>Title</h1><p>Paragraph</p></div>')

    expect(css).toContain('.prose')
  })

  it('throws with install instruction when plugin not found', async () => {
    const getCssForMarkup = await importCssWithUserCss(
      '@import "tailwindcss";\n@plugin "nonexistent-plugin";',
    )

    await expect(getCssForMarkup('<div class="foo">test</div>'))
      .rejects.toThrow(/pnpm add nonexistent-plugin/)
  })
})
