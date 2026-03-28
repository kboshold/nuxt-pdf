import type { H3Event } from 'h3'
import type { Component } from 'vue'
import type { ModuleOptions, RenderOptions, SendPDFOptions } from '../../types'
import { useRuntimeConfig } from '#imports'
// @ts-expect-error — virtual module resolved at build time via Nitro alias
import { polyfill } from '#sidebase-pdf/pagedjs'
import { setResponseHeaders } from 'h3'
import { PDFError } from '../../errors'
import { closeBrowser, configure, getBrowser, incrementRenderCount } from '../browser'
import { getCssForMarkup } from '../css'
import { assembleDocument } from '../html'
import { configureLogger, getLogger } from '../logger'
import { createPagePool } from '../pool'
import { renderComponent } from '../render'

let configured = false
let pool: ReturnType<typeof createPagePool> | undefined

/** Access the pool singleton for cleanup/shutdown */
export function getPool(): ReturnType<typeof createPagePool> | undefined {
  return pool
}

function ensureConfigured(): ModuleOptions {
  const config = useRuntimeConfig()
  const options = (config.pdf ?? {}) as ModuleOptions

  if (!configured) {
    configureLogger(options.logLevel ?? 'error')
    configure(options)
    pool = createPagePool({
      poolSize: options.poolSize ?? 2,
      maxConcurrency: options.maxConcurrency ?? 5,
      maxPageRenderCount: options.maxPageRenderCount ?? 50,
    })
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
  const logger = getLogger()
  const totalStart = performance.now()

  try {
    const ssrStart = performance.now()
    const html = await renderComponent(component, props)
    const ssrMs = Math.round(performance.now() - ssrStart)

    const cssStart = performance.now()
    const css = await getCssForMarkup(html)
    const cssMs = Math.round(performance.now() - cssStart)

    const doc = assembleDocument(html, css)
    logger.debug('Document assembled', { htmlSize: doc.length })

    // Lazy warmup: ensure browser + pool are ready on first render
    if (!pool.stats().totalCreated) {
      const browser = await getBrowser()
      await pool.warmup(browser)
    }

    const acquireStart = performance.now()
    const page = await pool.acquire()
    const acquireMs = Math.round(performance.now() - acquireStart)

    try {
      await page.setContent(doc, { waitUntil: 'domcontentloaded' })

      let pagedJsMs = 0
      const usePagedJS = options?.usePagedJS ?? moduleOptions.usePagedJS ?? true
      if (usePagedJS) {
        const pagedJsStart = performance.now()
        await page.addScriptTag({ content: polyfill as string })
        // Wait for paged.js to fully complete rendering (not just start).
        // Paged.js sets --pagedjs-page-count on .pagedjs_pages when done.
        await page.waitForFunction(
          () => {
            const el = document.querySelector('.pagedjs_pages') as HTMLElement | null
            return el?.style.getPropertyValue('--pagedjs-page-count') !== ''
          },
          { timeout: options?.timeout ?? 30000 },
        ).catch((error: unknown) => {
          throw new PDFError(
            'RENDER_TIMEOUT',
            `Paged.js did not finish within ${options?.timeout ?? 30000}ms`,
            { cause: error instanceof Error ? error : undefined },
          )
        })
        pagedJsMs = Math.round(performance.now() - pagedJsStart)
      }

      if (options?.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, {
          timeout: options?.timeout ?? 30000,
        }).catch((error: unknown) => {
          throw new PDFError(
            'RENDER_TIMEOUT',
            `Selector "${options.waitForSelector}" not found within ${options?.timeout ?? 30000}ms`,
            { cause: error instanceof Error ? error : undefined },
          )
        })
      }

      const pdfStart = performance.now()
      const pdfBuffer = await page.pdf({
        preferCSSPageSize: true,
        printBackground: true,
        // When paged.js handles layout, it renders margins as DOM elements —
        // Puppeteer margins must be zero to avoid double margins and clipped footers
        ...(usePagedJS ? { margin: { top: '0', right: '0', bottom: '0', left: '0' } } : {}),
        ...options?.pdfOptions,
      })
      const pdfMs = Math.round(performance.now() - pdfStart)

      const totalTime = Math.round(performance.now() - totalStart)
      logger.info('Render complete', { totalTime })
      logger.debug('Render breakdown', { ssrMs, cssMs, acquireMs, pagedJsMs, pdfMs, htmlSize: doc.length, pdfSize: pdfBuffer.length })
      logger.debug('Pool stats', pool.stats())

      return pdfBuffer
    } finally {
      await pool.release(page)
      await incrementRenderCount(pool)
    }
  } catch (error) {
    logger.error('Render failed', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Render a Vue component to PDF and send as HTTP response.
 * Returns the PDF buffer — H3 uses the return value as the response body.
 */
async function sendPDF<P extends Record<string, unknown>>(
  event: H3Event,
  component: Component,
  props?: P,
  options?: SendPDFOptions,
): Promise<Uint8Array> {
  if (event.handled) {
    throw new PDFError('RESPONSE_SENT', 'Cannot send PDF — response was already sent')
  }

  const buffer = await render(component, props, options)

  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${options?.disposition ?? 'inline'}; filename="${options?.filename ?? 'document.pdf'}"`,
  })

  return buffer
}

async function cleanup(): Promise<void> {
  await closeBrowser(pool)
}

export function usePDF() {
  return {
    render,
    sendPDF,
    cleanup,
  }
}
