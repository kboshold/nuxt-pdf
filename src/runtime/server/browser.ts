import type { Browser, BrowserContext, Page } from 'puppeteer-core'
import type { ModuleOptions } from '../types'
import puppeteer from 'puppeteer-core'
import { PDFError } from '../errors'

const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--font-render-hinting=none',
] as const

export interface RenderContext {
  context: BrowserContext
  page: Page
}

let browser: Browser | null = null
let renderCount = 0
let maxRenderCount = 500
let maxConcurrency = 5
let chromePath: string | undefined

// Semaphore state
let activeSlots = 0
let waitQueue: Array<{ resolve: () => void, reject: (error: Error) => void }> = []

export function configure(options: ModuleOptions): void {
  chromePath = options.chromePath
  maxRenderCount = options.maxRenderCount ?? 500
  maxConcurrency = options.maxConcurrency ?? 5
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

  throw new PDFError(
    'CHROME_NOT_FOUND',
    'Chrome not found. Options: '
    + '(a) set SIDEBASE_PDF_CHROME_PATH env var, '
    + '(b) set pdf.chromePath in nuxt.config.ts, '
    + '(c) install \'puppeteer\' package for auto-download: pnpm add -D puppeteer',
  )
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
    browser = null
  })

  return browser
}

export async function createRenderContext(): Promise<RenderContext> {
  await acquireSlot()

  try {
    const instance = await getBrowser()
    const context = await instance.createBrowserContext()
    const page = await context.newPage()
    return { context, page }
  } catch (error) {
    releaseSlot()
    if (error instanceof PDFError) {
      throw error
    }
    throw new PDFError(
      'BROWSER_CRASHED',
      `Failed to create render context: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    )
  }
}

export async function closeRenderContext(ctx: RenderContext): Promise<void> {
  try {
    await ctx.context.close()
  } catch {
    // Context may already be closed if browser crashed
  } finally {
    releaseSlot()
    renderCount++

    if (renderCount >= maxRenderCount) {
      await recycleBrowser()
    }
  }
}

export async function recycleBrowser(): Promise<void> {
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
}

export async function closeBrowser(): Promise<void> {
  const instance = browser
  browser = null
  renderCount = 0

  // Reject pending waiters
  const pending = waitQueue
  waitQueue = []
  activeSlots = 0
  for (const waiter of pending) {
    waiter.reject(new PDFError('BROWSER_CRASHED', 'Browser shutting down'))
  }

  if (instance) {
    try {
      await instance.close()
    } catch {
      // Best-effort cleanup
    }
  }
}

function acquireSlot(): Promise<void> {
  if (activeSlots < maxConcurrency) {
    activeSlots++
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    waitQueue.push({
      resolve: () => {
        activeSlots++
        resolve()
      },
      reject,
    })
  })
}

function releaseSlot(): void {
  const next = waitQueue.shift()
  if (next) {
    next.resolve()
  } else {
    activeSlots--
  }
}
