import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
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

describe('LetterA', () => {
  it('renders all 6 named slots', async () => {
    const html = await renderWithSlots(LetterA, {}, {
      letterhead: () => h('div', 'LETTERHEAD_A'),
      logo: () => h('div', 'LOGO_A'),
      'address-note': () => h('div', 'ADDR_NOTE_A'),
      address: () => h('div', 'ADDRESS_A'),
      reference: () => h('div', 'REFERENCE_A'),
      content: () => h('div', 'CONTENT_A'),
    })

    expect(html).toContain('LETTERHEAD_A')
    expect(html).toContain('LOGO_A')
    expect(html).toContain('ADDR_NOTE_A')
    expect(html).toContain('ADDRESS_A')
    expect(html).toContain('REFERENCE_A')
    expect(html).toContain('CONTENT_A')
  })

  it('uses 27mm letterhead height (Form A)', async () => {
    const html = await renderWithSlots(LetterA, {}, { content: () => h('div', 'x') })
    expect(html).toContain('height: 27mm')
  })

  it('uses default 25mm left margin', async () => {
    const html = await renderWithSlots(LetterA, {}, { content: () => h('div', 'x') })
    expect(html).toContain('margin: 20mm 20mm 20mm 25mm')
  })

  it('contains DIN 676 zone dimensions', async () => {
    const html = await renderWithSlots(LetterA, {}, { content: () => h('div', 'x') })
    expect(html).toContain('w-[85mm]')
    expect(html).toContain('h-[45mm]')
    expect(html).toContain('h-[17.7mm]')
    expect(html).toContain('h-[27.3mm]')
  })

  it('passes foldMark prop as letterA to PDFWrapper', async () => {
    const html = await renderWithSlots(LetterA, { foldMark: true }, { content: () => h('div', 'x') })
    // FoldMarksA renders fixed position marks
    expect(html).toContain('fixed')
    expect(html).toContain('105mm')
  })
})

describe('LetterB', () => {
  it('renders all 6 named slots', async () => {
    const html = await renderWithSlots(LetterB, {}, {
      letterhead: () => h('div', 'LETTERHEAD_B'),
      logo: () => h('div', 'LOGO_B'),
      'address-note': () => h('div', 'ADDR_NOTE_B'),
      address: () => h('div', 'ADDRESS_B'),
      reference: () => h('div', 'REFERENCE_B'),
      content: () => h('div', 'CONTENT_B'),
    })

    expect(html).toContain('LETTERHEAD_B')
    expect(html).toContain('LOGO_B')
    expect(html).toContain('ADDR_NOTE_B')
    expect(html).toContain('ADDRESS_B')
    expect(html).toContain('REFERENCE_B')
    expect(html).toContain('CONTENT_B')
  })

  it('uses 45mm letterhead height (Form B)', async () => {
    const html = await renderWithSlots(LetterB, {}, { content: () => h('div', 'x') })
    expect(html).toContain('height: 45mm')
  })

  it('uses 75mm logo width (Form B)', async () => {
    const html = await renderWithSlots(LetterB, {}, { content: () => h('div', 'x') })
    expect(html).toContain('w-[75mm]')
  })
})
