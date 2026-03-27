import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import PDFWrapper from '../../src/runtime/components/PDFWrapper.vue'

function renderWithSlots(props: Record<string, any>, slots: Record<string, () => any>) {
  const wrapper = defineComponent({
    render() {
      return h(PDFWrapper, props, slots)
    },
  })
  return renderToString(createSSRApp(wrapper))
}

describe('PDFWrapper SSR output', () => {
  it('renders .custom-style div with @page rule', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('custom-style')
    expect(html).toContain('@page')
  })

  it('default A4 size and 20mm margins', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('size: A4')
    expect(html).toContain('margin: 20mm 20mm 20mm 20mm')
  })

  it('A4 landscape size', async () => {
    const app = createSSRApp(PDFWrapper, { size: 'A4 landscape' }, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('size: A4 landscape')
  })

  it('custom mm size', async () => {
    const app = createSSRApp(PDFWrapper, { size: '100mm 200mm' }, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('size: 100mm 200mm')
  })

  it('A3 size', async () => {
    const app = createSSRApp(PDFWrapper, { size: 'A3' }, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('size: A3')
  })

  it('custom margins reflected in @page rule', async () => {
    const app = createSSRApp(PDFWrapper, {
      marginTop: 25,
      marginRight: 15,
      marginBottom: 30,
      marginLeft: 10,
    }, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('margin: 25mm 15mm 30mm 10mm')
  })

  it('includes paged.js utility classes', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('.footerRunning')
    expect(html).toContain('.page-break')
    expect(html).toContain('.avoid-break')
  })

  it('includes @bottom-center footer rule', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('@bottom-center')
    expect(html).toContain('element(footerRunning)')
  })

  it('renders default slot content', async () => {
    const html = await renderWithSlots({}, { default: () => h('div', 'my-slot-content') })
    expect(html).toContain('my-slot-content')
  })

  it('custom-style div uses inline display:none', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'x') })
    const html = await renderToString(app)

    expect(html).toContain('style="display:none;"')
    expect(html).toContain('class="custom-style"')
  })
})
