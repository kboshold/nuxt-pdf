import type { PDFOptions } from 'puppeteer-core'
import type { Component, VNodeProps } from 'vue'

export interface ModuleOptions {
  /**
   * Whether the module is enabled at all
   * @default true
   */
  isEnabled?: boolean

  /**
   * Whether to automatically cleanup the browser instance on server shutdown
   * @default true
   */
  isCleanupEnabled?: boolean

  /**
   * Custom path to Chrome/Chromium executable.
   * Also configurable via `SIDEBASE_PDF_CHROME_PATH` env var.
   * @default undefined
   */
  chromePath?: string

  /**
   * Enable paged.js polyfill for CSS Paged Media support
   * @default true
   */
  usePagedJS?: boolean

  /**
   * Path to user CSS file for Tailwind theme customization
   * @example '~/assets/pdf.css'
   * @default undefined
   */
  cssFile?: string

  /**
   * Max parallel renders per browser instance
   * @default 5
   */
  maxConcurrency?: number

  /**
   * Recycle browser after N renders to prevent memory creep
   * @default 500
   */
  maxRenderCount?: number

  /**
   * Controls verbosity of consola output
   * @default 'error'
   */
  logLevel?: 'error' | 'info' | 'debug'

  /**
   * Pre-warmed pages kept alive in pool (0 = no pre-warming)
   * @default 2
   */
  poolSize?: number

  /**
   * Destroy and recreate a page after N renders to prevent heap creep
   * @default 50
   */
  maxPageRenderCount?: number
}

export interface RenderOptions {
  /** Override module-level paged.js setting per render */
  usePagedJS?: boolean
  /** Override Puppeteer page.pdf() options */
  pdfOptions?: PDFOptions
  /** Custom selector to wait for before PDF capture */
  waitForSelector?: string
  /** Render timeout in ms */
  timeout?: number
}

export interface SendPDFOptions extends RenderOptions {
  /** Download filename */
  filename?: string
  /** Content-Disposition type */
  disposition?: 'inline' | 'attachment'
}

/**
 * Utility type to extract component props from a Vue component, excluding VNodeProps.
 */
export type ComponentProps<C extends Component> = C extends new (...args: any) => unknown
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps>
  : never
