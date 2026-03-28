import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { assembleDocument } from '../../src/runtime/server/html'
import { renderComponent } from '../../src/runtime/server/render'

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

// Full render-to-PDF integration tests — require Chrome + Nitro context.
// To run: set SIDEBASE_PDF_CHROME_PATH or install `puppeteer` package,
// then run with a Nuxt test context that provides runtimeConfig and virtual modules.
describe.skip('render() full pipeline (requires Chrome)', () => {
  // afterAll: cleanup browser to prevent zombie processes

  it('produces a Uint8Array starting with %PDF- magic bytes', () => {
    // const { render, cleanup } = usePDF()
    // const pdf = await render(SimpleComponent, { title: 'Test' })
    // expect(pdf).toBeInstanceOf(Uint8Array)
    // expect(pdf.length).toBeGreaterThan(0)
    // const header = new TextDecoder().decode(pdf.slice(0, 5))
    // expect(header).toBe('%PDF-')
    // await cleanup()
  })

  it('concurrent renders do not interfere', () => {
    // const { render, cleanup } = usePDF()
    // const [pdf1, pdf2, pdf3] = await Promise.all([
    //   render(SimpleComponent, { title: 'Doc 1' }),
    //   render(SimpleComponent, { title: 'Doc 2' }),
    //   render(SimpleComponent, { title: 'Doc 3' }),
    // ])
    // expect(pdf1.length).toBeGreaterThan(0)
    // expect(pdf2.length).toBeGreaterThan(0)
    // expect(pdf3.length).toBeGreaterThan(0)
    // await cleanup()
  })
})
