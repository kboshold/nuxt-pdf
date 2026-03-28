export type PDFErrorCode
  = | 'CHROME_NOT_FOUND'
    | 'RENDER_TIMEOUT'
    | 'SSR_FAILED'
    | 'BROWSER_CRASHED'
    | 'RESPONSE_SENT'

export class PDFError extends Error {
  code: PDFErrorCode

  constructor(code: PDFErrorCode, message: string, options?: { cause?: Error }) {
    super(message, options)
    this.name = 'PDFError'
    this.code = code
  }
}
