import { describe, expect, it } from 'vitest'
import { PDFError } from '../../src/runtime/errors'

describe('browser pool error types', () => {
  it('CHROME_NOT_FOUND error has actionable message', () => {
    const error = new PDFError(
      'CHROME_NOT_FOUND',
      'Chrome not found. Options: (a) set SIDEBASE_PDF_CHROME_PATH env var, (b) set pdf.chromePath in nuxt.config.ts, (c) install \'puppeteer\' package for auto-download: pnpm add -D puppeteer',
    )
    expect(error.code).toBe('CHROME_NOT_FOUND')
    expect(error.message).toContain('SIDEBASE_PDF_CHROME_PATH')
    expect(error.message).toContain('pnpm add -D puppeteer')
  })

  it('BROWSER_CRASHED error supports cause', () => {
    const cause = new Error('Connection closed')
    const error = new PDFError('BROWSER_CRASHED', 'Browser crashed', { cause })
    expect(error.code).toBe('BROWSER_CRASHED')
    expect(error.cause).toBe(cause)
  })
})

// Browser pool integration tests — require Chrome.
// These tests verify Chrome lifecycle management.
describe.skip('browser pool lifecycle (requires Chrome)', () => {
  // afterAll: ensure closeBrowser() called to prevent zombie processes

  it('lazy init: getBrowser() launches Chrome on first call', () => {
    // const browser = await getBrowser()
    // expect(browser.connected).toBe(true)
    // await closeBrowser()
  })

  it('shared instance: multiple getBrowser() calls return same instance', () => {
    // const b1 = await getBrowser()
    // const b2 = await getBrowser()
    // expect(b1).toBe(b2)
    // await closeBrowser()
  })

  it('cleanup: closeBrowser() terminates Chrome process', () => {
    // await getBrowser()
    // await closeBrowser()
    // Verify no Chrome process remains (platform-specific check)
  })

  it('recycling: browser restarts after maxRenderCount renders', () => {
    // configure({ maxRenderCount: 3 })
    // Perform 3 renders
    // Verify browser instance changed (new PID or new connected state)
    // await closeBrowser()
  })

  it('concurrency: semaphore limits parallel renders', () => {
    // configure({ maxConcurrency: 2 })
    // Start 3 concurrent renders
    // Verify only 2 execute simultaneously (third waits)
    // await closeBrowser()
  })

  it('disconnect recovery: getBrowser() relaunches after crash', () => {
    // const browser = await getBrowser()
    // Simulate disconnect: browser.close() without closeBrowser()
    // const newBrowser = await getBrowser()
    // expect(newBrowser.connected).toBe(true)
    // await closeBrowser()
  })
})
