import { describe, expect, it } from 'vitest'
import { renderComponent } from '../../src/runtime/server/render'
import { assembleDocument } from '../../src/runtime/server/html'
import { defineComponent, h } from 'vue'

const SimpleComponent = defineComponent({
  props: { title: { type: String, default: 'Hello' } },
  setup(props) {
    return () => h('div', { class: 'p-4' }, [
      h('h1', { class: 'text-xl font-bold' }, props.title),
    ])
  },
})

describe('renderComponent', () => {
  it('renders a Vue component to HTML string', async () => {
    const html = await renderComponent(SimpleComponent, { title: 'Test PDF' })
    expect(html).toContain('Test PDF')
    expect(html).toContain('class="')
    expect(html).toContain('text-xl')
  })

  it('uses default props when none provided', async () => {
    const html = await renderComponent(SimpleComponent)
    expect(html).toContain('Hello')
  })
})

describe('assembleDocument', () => {
  it('wraps HTML and CSS into a complete document', () => {
    const doc = assembleDocument('<div>content</div>', '.flex{display:flex}')
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<meta charset="utf-8">')
    expect(doc).toContain('<style>.flex{display:flex}</style>')
    expect(doc).toContain('<body><div>content</div></body>')
  })
})

// Full render-to-PDF integration test — requires Chrome
describe.skip('render() produces valid PDF', () => {
  // NOTE: Skipped — requires Chrome/Chromium available in the environment.
  // To run: set SIDEBASE_PDF_CHROME_PATH or install `puppeteer` package.
  it('produces a Uint8Array starting with %PDF-', async () => {
    // This would test the full pipeline:
    // const { usePDF } = await import('../../src/runtime/server/composables/usePDF')
    // const { render, cleanup } = usePDF()
    // const pdf = await render(SimpleComponent, { title: 'Integration Test' })
    // expect(pdf).toBeInstanceOf(Uint8Array)
    // const header = new TextDecoder().decode(pdf.slice(0, 5))
    // expect(header).toBe('%PDF-')
    // await cleanup()
  })
})
