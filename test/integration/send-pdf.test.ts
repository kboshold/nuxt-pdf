import { describe, expect, it } from 'vitest'
import { PDFError } from '../../src/runtime/errors'

describe('sendPDF response headers', () => {
  it('pDFError RESPONSE_SENT has correct code', () => {
    const error = new PDFError('RESPONSE_SENT', 'Cannot send PDF — response was already sent')
    expect(error.code).toBe('RESPONSE_SENT')
    expect(error.message).toContain('response was already sent')
  })
})

// Full sendPDF integration tests — require Chrome + Nitro context.
// These tests verify HTTP response headers and body streaming.
describe.skip('sendPDF HTTP streaming (requires Chrome)', () => {
  it('sets Content-Type: application/pdf', () => {
    // Mock H3 event, call sendPDF, verify:
    // - Content-Type header is 'application/pdf'
  })

  it('sets Content-Disposition with filename', () => {
    // sendPDF(event, Component, {}, { filename: 'test.pdf', disposition: 'attachment' })
    // Verify: Content-Disposition: attachment; filename="test.pdf"
  })

  it('defaults to inline disposition and document.pdf filename', () => {
    // sendPDF(event, Component, {})
    // Verify: Content-Disposition: inline; filename="document.pdf"
  })

  it('throws RESPONSE_SENT when event.handled is true', () => {
    // const event = createMockEvent({ handled: true })
    // await expect(sendPDF(event, Component)).rejects.toThrow(PDFError)
    // expect(error.code).toBe('RESPONSE_SENT')
  })

  it('returns Uint8Array buffer (H3 response body pattern)', () => {
    // const result = await sendPDF(event, Component, {})
    // expect(result).toBeInstanceOf(Uint8Array)
  })
})
