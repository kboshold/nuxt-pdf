import { describe, expect, it } from 'vitest'
import { extname } from 'node:path'

// Image component uses Nitro's useStorage('assets:server') which is not
// available outside Nitro context. We test the core logic independently:
// MIME detection, base64 encoding, and data URI assembly.

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

function buildDataUri(src: string, data: Buffer): string {
  const ext = extname(src)
  const contentType = mimeTypes[ext] || 'image/jpeg'
  const base64Data = data.toString('base64')
  return `data:${contentType};base64,${base64Data}`
}

describe('Image MIME type detection', () => {
  it.each([
    ['photo.jpg', 'image/jpeg'],
    ['photo.jpeg', 'image/jpeg'],
    ['logo.png', 'image/png'],
    ['anim.gif', 'image/gif'],
    ['modern.webp', 'image/webp'],
    ['icon.svg', 'image/svg+xml'],
    ['old.bmp', 'image/bmp'],
    ['fav.ico', 'image/x-icon'],
  ])('detects %s as %s', (filename, expectedMime) => {
    const ext = extname(filename)
    const mime = mimeTypes[ext] || 'image/jpeg'
    expect(mime).toBe(expectedMime)
  })

  it('falls back to image/jpeg for unknown extensions', () => {
    const ext = extname('file.xyz')
    const mime = mimeTypes[ext] || 'image/jpeg'
    expect(mime).toBe('image/jpeg')
  })
})

describe('Image base64 data URI assembly', () => {
  it('produces valid data URI for PNG', () => {
    const data = Buffer.from([0x89, 0x50, 0x4e, 0x47]) // PNG magic bytes
    const uri = buildDataUri('test.png', data)
    expect(uri).toBe(`data:image/png;base64,${data.toString('base64')}`)
  })

  it('produces valid data URI for JPEG', () => {
    const data = Buffer.from([0xFF, 0xD8, 0xFF])
    const uri = buildDataUri('photo.jpg', data)
    expect(uri).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('produces valid data URI for SVG', () => {
    const data = Buffer.from('<svg></svg>')
    const uri = buildDataUri('icon.svg', data)
    expect(uri).toMatch(/^data:image\/svg\+xml;base64,/)
  })

  it('handles paths with directories', () => {
    const data = Buffer.from('test')
    const uri = buildDataUri('images/nested/logo.png', data)
    expect(uri).toMatch(/^data:image\/png;base64,/)
  })

  it('encodes binary data correctly', () => {
    const data = Buffer.from([0x00, 0xFF, 0x80, 0x7F])
    const uri = buildDataUri('test.png', data)
    const base64Part = uri.split(',')[1]
    const decoded = Buffer.from(base64Part, 'base64')
    expect(decoded).toEqual(data)
  })
})
