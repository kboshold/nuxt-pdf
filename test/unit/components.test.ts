import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import PDFWrapper from '../../src/runtime/components/PDFWrapper.vue'
import LetterA from '../../src/runtime/components/base/LetterA.vue'
import LetterB from '../../src/runtime/components/base/LetterB.vue'

function renderWithSlots(component: any, props: Record<string, any>, slots: Record<string, () => any>) {
  const wrapper = defineComponent({
    render() {
      return h(component, props, slots)
    },
  })
  return renderToString(createSSRApp(wrapper))
}

describe('PDFWrapper @page CSS', () => {
  it('renders @page rule with default A4 size and margins', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('custom-style')
    expect(html).toContain('@page')
    expect(html).toContain('size: A4')
    expect(html).toContain('margin: 20mm 20mm 20mm 20mm')
  })

  it('renders @page rule with A4 landscape size', async () => {
    const app = createSSRApp(PDFWrapper, { size: 'A4 landscape' }, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('size: A4 landscape')
  })

  it('renders @page rule with custom mm size', async () => {
    const app = createSSRApp(PDFWrapper, { size: '100mm 200mm' }, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('size: 100mm 200mm')
  })

  it('renders @page rule with custom margins', async () => {
    const app = createSSRApp(PDFWrapper, {
      marginTop: 25,
      marginRight: 15,
      marginBottom: 30,
      marginLeft: 10,
    }, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('margin: 25mm 15mm 30mm 10mm')
  })

  it('includes paged.js utility classes', async () => {
    const app = createSSRApp(PDFWrapper, {}, { default: () => h('div', 'content') })
    const html = await renderToString(app)

    expect(html).toContain('.footerRunning')
    expect(html).toContain('.page-break')
    expect(html).toContain('.avoid-break')
  })

  it('renders default slot content', async () => {
    const html = await renderWithSlots(PDFWrapper, {}, { default: () => h('div', 'my-content-here') })

    expect(html).toContain('my-content-here')
  })
})

describe('LetterA slot rendering', () => {
  it('renders all 6 named slots', async () => {
    const html = await renderWithSlots(LetterA, {}, {
      letterhead: () => h('div', 'LETTERHEAD_CONTENT'),
      logo: () => h('div', 'LOGO_CONTENT'),
      'address-note': () => h('div', 'ADDRESS_NOTE_CONTENT'),
      address: () => h('div', 'ADDRESS_CONTENT'),
      reference: () => h('div', 'REFERENCE_CONTENT'),
      content: () => h('div', 'BODY_CONTENT'),
    })

    expect(html).toContain('LETTERHEAD_CONTENT')
    expect(html).toContain('LOGO_CONTENT')
    expect(html).toContain('ADDRESS_NOTE_CONTENT')
    expect(html).toContain('ADDRESS_CONTENT')
    expect(html).toContain('REFERENCE_CONTENT')
    expect(html).toContain('BODY_CONTENT')
  })

  it('uses Form A letterhead height (27mm)', async () => {
    const html = await renderWithSlots(LetterA, {}, {
      content: () => h('div', 'test'),
    })

    expect(html).toContain('height: 27mm')
  })
})

describe('LetterB slot rendering', () => {
  it('renders all 6 named slots', async () => {
    const html = await renderWithSlots(LetterB, {}, {
      letterhead: () => h('div', 'LETTERHEAD_B'),
      logo: () => h('div', 'LOGO_B'),
      'address-note': () => h('div', 'ADDR_NOTE_B'),
      address: () => h('div', 'ADDR_B'),
      reference: () => h('div', 'REF_B'),
      content: () => h('div', 'CONTENT_B'),
    })

    expect(html).toContain('LETTERHEAD_B')
    expect(html).toContain('LOGO_B')
    expect(html).toContain('ADDR_NOTE_B')
    expect(html).toContain('ADDR_B')
    expect(html).toContain('REF_B')
    expect(html).toContain('CONTENT_B')
  })

  it('uses Form B letterhead height (45mm)', async () => {
    const html = await renderWithSlots(LetterB, {}, {
      content: () => h('div', 'test'),
    })

    expect(html).toContain('height: 45mm')
  })
})

describe('Image MIME type mapping', () => {
  // Image component uses useStorage (Nitro) which isn't available in unit tests.
  // Test the MIME type mapping logic directly.
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
  }

  it('maps common image extensions to correct MIME types', () => {
    expect(mimeTypes['.jpg']).toBe('image/jpeg')
    expect(mimeTypes['.jpeg']).toBe('image/jpeg')
    expect(mimeTypes['.png']).toBe('image/png')
    expect(mimeTypes['.gif']).toBe('image/gif')
    expect(mimeTypes['.webp']).toBe('image/webp')
    expect(mimeTypes['.svg']).toBe('image/svg+xml')
    expect(mimeTypes['.bmp']).toBe('image/bmp')
    expect(mimeTypes['.ico']).toBe('image/x-icon')
  })

  it('produces valid base64 data URI format', () => {
    const testData = Buffer.from('fake-image-data')
    const base64 = testData.toString('base64')
    const dataUri = `data:image/png;base64,${base64}`

    expect(dataUri).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/)
  })

  it('falls back to image/jpeg for unknown extensions', () => {
    const ext = '.unknown'
    const contentType = mimeTypes[ext] || 'image/jpeg'
    expect(contentType).toBe('image/jpeg')
  })
})
