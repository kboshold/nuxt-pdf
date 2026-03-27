import type { Component } from 'vue'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { PDFError } from '../errors'

export async function renderComponent<P extends Record<string, unknown>>(
  component: Component,
  props?: P,
): Promise<string> {
  try {
    const app = createSSRApp(component, props)
    return await renderToString(app)
  }
  catch (error) {
    throw new PDFError(
      'SSR_FAILED',
      `Failed to render component: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    )
  }
}
