import { describe, expect, it } from 'vitest'

describe('paged.js toggle logic', () => {
  // Test the resolution logic: options.usePagedJS ?? moduleOptions.usePagedJS ?? true

  it('defaults to true when no options provided', () => {
    const options = undefined
    const moduleOptions = {}
    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    expect(usePagedJS).toBe(true)
  })

  it('respects module-level usePagedJS: false', () => {
    const options = undefined
    const moduleOptions = { usePagedJS: false }
    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    expect(usePagedJS).toBe(false)
  })

  it('respects module-level usePagedJS: true', () => {
    const options = undefined
    const moduleOptions = { usePagedJS: true }
    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    expect(usePagedJS).toBe(true)
  })

  it('per-render override takes precedence over module option', () => {
    const options = { usePagedJS: false }
    const moduleOptions = { usePagedJS: true }
    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    expect(usePagedJS).toBe(false)
  })

  it('per-render true overrides module false', () => {
    const options = { usePagedJS: true }
    const moduleOptions = { usePagedJS: false }
    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    expect(usePagedJS).toBe(true)
  })
})

// Integration tests — require Chrome and full Nitro context
describe.skip('render() paged.js injection (integration)', () => {
  // NOTE: Skipped — requires Chrome, Nitro runtime, and virtual modules.
  // These tests verify that:
  // 1. When usePagedJS: false, page.addScriptTag is NOT called and
  //    page.waitForSelector('.pagedjs_pages') is NOT called.
  // 2. When usePagedJS: true (default), page.addScriptTag IS called
  //    with the paged.js polyfill content, and waitForSelector('.pagedjs_pages')
  //    IS called with the configured timeout.
  //
  // To run manually: set SIDEBASE_PDF_CHROME_PATH, start with full Nuxt context.

  it('usePagedJS: false — skips polyfill injection', () => {
    // const { render, cleanup } = usePDF()
    // Render with { usePagedJS: false }
    // Verify PDF generated without .pagedjs_pages in DOM
    // await cleanup()
  })

  it('usePagedJS: true — injects polyfill and waits for .pagedjs_pages', () => {
    // const { render, cleanup } = usePDF()
    // Render with { usePagedJS: true }
    // Verify PDF generated with paged.js processed content
    // await cleanup()
  })
})
