import type { Browser, BrowserContext, Page } from 'puppeteer-core'
import type { ModuleOptions } from '../types'
import type { PagePool } from './pool'
import puppeteer from 'puppeteer-core'
import { PDFError } from '../errors'
import { getLogger } from './logger'

const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--font-render-hinting=none',
] as const

let browser: Browser | null = null
let renderCount = 0
let maxRenderCount = 500
let chromePath: string | undefined

export function configure(options: ModuleOptions): void {
  chromePath = options.chromePath
  maxRenderCount = options.maxRenderCount ?? 500
}

async function resolveChromePath(): Promise<string> {
  if (chromePath) {
    return chromePath
  }

  // Try optional peer dep `puppeteer` for auto-downloaded Chrome
  try {
    const mod = await import('puppeteer')
    const execPath = mod.default?.executablePath?.() ?? mod.executablePath?.()
    if (execPath) {
      return execPath
    }
  } catch {
    // puppeteer not installed — expected
  }

  const error = new PDFError(
    'CHROME_NOT_FOUND',
    'Chrome not found. Options: '
    + '(a) set SIDEBASE_PDF_CHROME_PATH env var, '
    + '(b) set pdf.chromePath in nuxt.config.ts, '
    + '(c) install \'puppeteer\' package for auto-download: pnpm add -D puppeteer',
  )
  getLogger().error(error.message)
  throw error
}

export async function getBrowser(): Promise<Browser> {
  if (browser?.connected) {
    return browser
  }

  const executablePath = await resolveChromePath()

  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [...CHROME_ARGS],
    })
  } catch (error) {
    getLogger().error('Failed to launch Chrome', { executablePath })
    throw new PDFError(
      'CHROME_NOT_FOUND',
      `Failed to launch Chrome at "${executablePath}": ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    )
  }

  // Reset render count on fresh browser
  renderCount = 0

  // Handle unexpected browser disconnect
  browser.on('disconnected', () => {
    getLogger().error('Browser disconnected unexpectedly')
    browser = null
  })

  getLogger().info('Browser launched', { executablePath })

  return browser
}

export async function incrementRenderCount(pool: PagePool): Promise<void> {
  renderCount++
  getLogger().debug('Render count incremented', { renderCount, maxRenderCount })

  if (renderCount >= maxRenderCount) {
    await recycleBrowser(pool)
  }
}

export async function recycleBrowser(pool: PagePool): Promise<void> {
  getLogger().info('Recycling browser', { renderCount, maxRenderCount })

  // 1. Drain pool — waits for active renders, closes idle pages
  await pool.requestRecycle()

  // 2. Close old browser
  const old = browser
  browser = null
  renderCount = 0

  if (old) {
    try {
      await old.close()
    } catch {
      // Browser may already be closed
    }
  }

  // 3. Launch new browser
  const newBrowser = await getBrowser()

  // 4. Re-warm pool on new browser
  await pool.clearRecycle(newBrowser)

  getLogger().info('Browser recycle complete')
}

export async function closeBrowser(pool?: PagePool): Promise<void> {
  getLogger().info('Closing browser')

  // Drain pool if available
  if (pool) {
    try {
      await pool.drain()
    } catch {
      // Best-effort drain — continue to close browser
    }
  }

  const instance = browser
  browser = null
  renderCount = 0

  if (instance) {
    try {
      await instance.close()
    } catch {
      // Best-effort cleanup
    }
  }

  getLogger().info('Browser closed')
}

// --- Temporary shims: removed in P03-T03 when usePDF.ts switches to pool ---

export interface RenderContext {
  context: BrowserContext
  page: Page
}

/** @deprecated Use pool.acquire() instead — will be removed in P03-T03 */
export async function createRenderContext(): Promise<RenderContext> {
  const instance = await getBrowser()
  const context = await instance.createBrowserContext()
  const page = await context.newPage()
  return { context, page }
}

/** @deprecated Use pool.release() instead — will be removed in P03-T03 */
export async function closeRenderContext(ctx: RenderContext): Promise<void> {
  try {
    await ctx.context.close()
  } catch {
    // Context may already be closed if browser crashed
  }
}
