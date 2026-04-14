import { describe, expect, it } from 'vitest'
import { PDFError } from '../../src/runtime/errors'

describe('pDFError', () => {
  it('has correct code and message', () => {
    const error = new PDFError('CHROME_NOT_FOUND', 'Chrome missing')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(PDFError)
    expect(error.name).toBe('PDFError')
    expect(error.code).toBe('CHROME_NOT_FOUND')
    expect(error.message).toBe('Chrome missing')
  })

  it('supports cause option', () => {
    const cause = new Error('underlying')
    const error = new PDFError('SSR_FAILED', 'render failed', { cause })
    expect(error.cause).toBe(cause)
  })

  it('supports all error codes', () => {
    const codes = ['CHROME_NOT_FOUND', 'RENDER_TIMEOUT', 'SSR_FAILED', 'BROWSER_CRASHED', 'RESPONSE_SENT'] as const
    for (const code of codes) {
      const error = new PDFError(code, `test ${code}`)
      expect(error.code).toBe(code)
    }
  })
})
