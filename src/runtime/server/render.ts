import type { Component } from 'vue'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { PDFError } from '../errors'
import { getLogger } from './logger'

export async function renderComponent<P extends Record<string, unknown>>(
  component: Component,
  props?: P,
): Promise<string> {
  const start = performance.now()
  try {
    const app = createSSRApp(component, props)
    const html = await renderToString(app)
    const renderTime = Math.round(performance.now() - start)
    getLogger().debug('Component rendered (SSR)', { renderTime, htmlSize: html.length })
    return html
  } catch (error) {
    throw new PDFError(
      'SSR_FAILED',
      `Failed to render component: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    )
  }
}
