import type { Component } from 'vue'
import type { H3Event } from 'h3'
import type { ModuleOptions, RenderOptions, SendPDFOptions } from '../../types'
import { useRuntimeConfig } from '#imports'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { polyfill } from '#sidebase-pdf/pagedjs'
import { setResponseHeaders } from 'h3'
import { PDFError } from '../../errors'
import { closeBrowser, closeRenderContext, configure, createRenderContext } from '../browser'
import { getCssForMarkup } from '../css'
import { assembleDocument } from '../html'
import { renderComponent } from '../render'

let configured = false

function ensureConfigured(): ModuleOptions {
  const config = useRuntimeConfig()
  const options = (config.pdf ?? {}) as ModuleOptions

  if (!configured) {
    configure(options)
    configured = true
  }

  return options
}

async function render<P extends Record<string, unknown>>(
  component: Component,
  props?: P,
  options?: RenderOptions,
): Promise<Uint8Array> {
  const moduleOptions = ensureConfigured()

  const html = await renderComponent(component, props)
  const css = await getCssForMarkup(html)
  const document = assembleDocument(html, css)

  const renderCtx = await createRenderContext()
  try {
    await renderCtx.page.setContent(document, { waitUntil: 'domcontentloaded' })

    const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
    if (usePagedJS) {
      await renderCtx.page.addScriptTag({ content: polyfill as string })
      await renderCtx.page.waitForSelector('.pagedjs_pages', {
        timeout: options?.timeout ?? 30000,
      }).catch((error: unknown) => {
        throw new PDFError(
          'RENDER_TIMEOUT',
          `Paged.js did not finish within ${options?.timeout ?? 30000}ms`,
          { cause: error instanceof Error ? error : undefined },
        )
      })
    }

    if (options?.waitForSelector) {
      await renderCtx.page.waitForSelector(options.waitForSelector, {
        timeout: options?.timeout ?? 30000,
      }).catch((error: unknown) => {
        throw new PDFError(
          'RENDER_TIMEOUT',
          `Selector "${options.waitForSelector}" not found within ${options?.timeout ?? 30000}ms`,
          { cause: error instanceof Error ? error : undefined },
        )
      })
    }

    return await renderCtx.page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      ...options?.pdfOptions,
    })
  }
  finally {
    await closeRenderContext(renderCtx)
  }
}

async function sendPDF<P extends Record<string, unknown>>(
  event: H3Event,
  component: Component,
  props?: P,
  options?: SendPDFOptions,
): Promise<Uint8Array> {
  const buffer = await render(component, props, options)

  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${options?.disposition ?? 'inline'}; filename="${options?.filename ?? 'document.pdf'}"`,
  })

  return buffer
}

async function cleanup(): Promise<void> {
  await closeBrowser()
}

export function usePDF() {
  ensureConfigured()

  return {
    render,
    sendPDF,
    cleanup,
  }
}
