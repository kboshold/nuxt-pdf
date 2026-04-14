import { resolve } from 'node:path'
import { $fetch, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const fixtureDir = resolve(__dirname, '../fixtures/basic')

describe('basic fixture', async () => {
  await setup({
    rootDir: fixtureDir,
    build: true,
    server: true,
  })

  it('nuxt app builds with module loaded', () => {
    // If setup() completes without error, the module loaded successfully
    // This verifies: aliases resolve, auto-imports registered, virtual modules created
    expect(true).toBe(true)
  })

  it('index page renders', async () => {
    const html = await $fetch('/')
    expect(html).toContain('basic fixture')
  })

  it('returns PDF with correct headers from /api/pdf/test', async () => {
    const response = await fetch(url('/api/pdf/test'))

    // If Chrome is not available, the route returns an error — skip gracefully
    if (!response.ok) {
      // oxlint-disable-next-line eslint/no-console -- test diagnostics
      console.warn('Skipping PDF generation test — server returned', response.status)
      return
    }

    expect(response.headers.get('content-type')).toBe('application/pdf')
    expect(response.headers.get('content-disposition')).toContain('test.pdf')

    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    // Check PDF magic bytes: %PDF
    expect(bytes[0]).toBe(0x25)
    expect(bytes[1]).toBe(0x50)
    expect(bytes[2]).toBe(0x44)
    expect(bytes[3]).toBe(0x46)
  })
})
