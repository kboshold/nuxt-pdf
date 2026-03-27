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
}

/**
 * Utility type to extract component props from a Vue component, excluding VNodeProps.
 */
export type ComponentProps<C extends Component> = C extends new (...args: any) => unknown
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps>
  : never
