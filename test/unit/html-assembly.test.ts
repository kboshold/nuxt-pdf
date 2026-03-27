import { describe, expect, it } from 'vitest'
import { assembleDocument } from '../../src/runtime/server/html'

describe('assembleDocument', () => {
  it('produces valid HTML5 document structure', () => {
    const doc = assembleDocument('<div>content</div>', '.flex{display:flex}')

    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<html>')
    expect(doc).toContain('</html>')
    expect(doc).toContain('<head>')
    expect(doc).toContain('</head>')
    expect(doc).toContain('<body>')
    expect(doc).toContain('</body>')
  })

  it('includes meta charset utf-8', () => {
    const doc = assembleDocument('<p>test</p>', '')
    expect(doc).toContain('<meta charset="utf-8">')
  })

  it('embeds CSS in style tag', () => {
    const css = '.text-red-500{color:red}'
    const doc = assembleDocument('<p>test</p>', css)
    expect(doc).toContain(`<style>${css}</style>`)
  })

  it('places HTML in body', () => {
    const html = '<div class="p-4"><h1>Title</h1></div>'
    const doc = assembleDocument(html, '')
    expect(doc).toContain(`<body>${html}</body>`)
  })

  it('handles empty HTML and CSS', () => {
    const doc = assembleDocument('', '')
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<style></style>')
    expect(doc).toContain('<body></body>')
  })

  it('preserves special characters in HTML', () => {
    const html = '<p>Price: &lt;$100&gt; &amp; more</p>'
    const doc = assembleDocument(html, '')
    expect(doc).toContain(html)
  })

  it('preserves @page rules in CSS', () => {
    const css = '@page { size: A4; margin: 20mm; } .flex { display: flex; }'
    const doc = assembleDocument('<div>test</div>', css)
    expect(doc).toContain('@page { size: A4; margin: 20mm; }')
  })
})
