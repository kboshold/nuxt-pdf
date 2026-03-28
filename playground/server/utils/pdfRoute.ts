import type { H3Event } from 'h3'
import type { Component } from 'vue'
import { usePDF } from '#pdf'
import { setResponseHeaders } from 'h3'

interface SendPDFWithMetricsOptions {
  filename?: string
  disposition?: 'inline' | 'attachment'
  usePagedJS?: boolean
  pdfOptions?: Record<string, unknown>
  timeout?: number
}

export async function sendPDFWithMetrics<P extends Record<string, unknown>>(
  event: H3Event,
  component: Component,
  props?: P,
  options?: SendPDFWithMetricsOptions,
): Promise<Uint8Array> {
  const { render } = usePDF()

  const start = Date.now()
  const buffer = await render(component, props, options)
  const renderTime = Date.now() - start

  setResponseHeaders(event, {
    'X-Render-Time-Ms': String(renderTime),
    'Access-Control-Expose-Headers': 'X-Render-Time-Ms',
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${options?.disposition ?? 'inline'}; filename="${options?.filename ?? 'document.pdf'}"`,
  })

  return buffer
}
