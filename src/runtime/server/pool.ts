import type { Browser, Page } from 'puppeteer-core'
import { PDFError } from '../errors'
import { getLogger } from './logger'

export interface PagePool {
  acquire: () => Promise<Page>
  release: (page: Page) => Promise<void>
  warmup: (browser: Browser) => Promise<void>
  drain: () => Promise<void>
  requestRecycle: () => Promise<void>
  clearRecycle: (browser: Browser) => Promise<void>
  stats: () => { idle: number, active: number, totalCreated: number }
}

interface PoolOptions {
  poolSize: number
  maxConcurrency: number
  maxPageRenderCount: number
}

const DRAIN_TIMEOUT_MS = 30_000

export function createPagePool(options: PoolOptions): PagePool {
  const { poolSize, maxConcurrency, maxPageRenderCount } = options

  let currentBrowser: Browser | null = null
  const idlePages: Page[] = []
  let activeCount = 0
  let totalCreated = 0
  let recycleRequested = false

  const pageRenderCounts = new Map<Page, number>()

  // Semaphore wait queue
  let waitQueue: Array<{ resolve: () => void, reject: (error: Error) => void }> = []

  // Drain promise coordination
  let drainResolve: (() => void) | null = null

  function acquireSlot(): Promise<void> {
    if (activeCount < maxConcurrency) {
      activeCount++
      getLogger().debug('Pool slot acquired', { activeCount, maxConcurrency, queueDepth: waitQueue.length })
      return Promise.resolve()
    }

    getLogger().debug('Pool queued for slot', { activeCount, maxConcurrency, queueDepth: waitQueue.length })
    return new Promise<void>((resolve, reject) => {
      waitQueue.push({
        resolve: () => {
          getLogger().debug('Pool slot acquired (from queue)', { activeCount, maxConcurrency, queueDepth: waitQueue.length })
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
      activeCount--
    }
    getLogger().debug('Pool slot released', { activeCount, queueDepth: waitQueue.length })

    if (activeCount === 0 && drainResolve) {
      drainResolve()
      drainResolve = null
    }
  }

  async function createPage(): Promise<Page> {
    if (!currentBrowser?.connected) {
      throw new PDFError('BROWSER_CRASHED', 'Cannot create page — browser not available')
    }
    const page = await currentBrowser.newPage()
    totalCreated++
    pageRenderCounts.set(page, 0)
    getLogger().debug('Page created', { totalCreated })
    return page
  }

  async function closePage(page: Page): Promise<void> {
    pageRenderCounts.delete(page)
    try {
      if (!page.isClosed()) {
        await page.close()
      }
    } catch {
      // Page may already be closed
    }
  }

  async function acquire(): Promise<Page> {
    await acquireSlot()

    try {
      // If recycle is in progress, we still got past the semaphore but shouldn't hand out pages
      if (recycleRequested) {
        getLogger().debug('Acquire blocked — recycle in progress')
        releaseSlot()
        // Re-queue: wait for recycle to complete then try again
        return new Promise<Page>((resolve, reject) => {
          waitQueue.push({
            resolve: () => {
              // Slot inherited from releaser — no increment needed
              acquireInner().then(resolve, reject)
            },
            reject,
          })
        })
      }

      return await acquireInner()
    } catch (error) {
      releaseSlot()
      throw error
    }
  }

  async function acquireInner(): Promise<Page> {
    // Try idle pool first
    const page = takeUsablePage()
    if (page) {
      getLogger().debug('Page acquired from pool', { idle: idlePages.length, active: activeCount })
      return page
    }

    // Create new page
    getLogger().debug('Page acquired (new)', { idle: idlePages.length, active: activeCount })
    return await createPage()
  }

  function takeUsablePage(): Page | null {
    while (idlePages.length > 0) {
      const page = idlePages.pop() as Page
      if (page.isClosed()) {
        getLogger().debug('Discarded closed idle page')
        pageRenderCounts.delete(page)
        continue
      }

      const renderCount = pageRenderCounts.get(page) ?? 0
      if (renderCount >= maxPageRenderCount) {
        getLogger().debug('Discarding idle page — max render count reached', { renderCount, maxPageRenderCount })
        pageRenderCounts.delete(page)
        // Close async, don't block acquire
        page.close().catch(() => {})
        continue
      }

      return page
    }
    return null
  }

  async function release(page: Page): Promise<void> {
    try {
      // Increment per-page render count
      const renderCount = (pageRenderCounts.get(page) ?? 0) + 1
      pageRenderCounts.set(page, renderCount)

      // Check if page should be destroyed
      if (page.isClosed() || renderCount >= maxPageRenderCount) {
        getLogger().debug('Page destroyed after release', {
          reason: page.isClosed() ? 'closed' : 'maxPageRenderCount',
          renderCount,
          maxPageRenderCount,
        })
        await closePage(page)
        return
      }

      // Reset page state — CRITICAL for performance
      try {
        await page.goto('about:blank')
      } catch {
        getLogger().debug('Page reset failed — destroying page')
        await closePage(page)
        return
      }

      // Return to pool or destroy excess
      if (idlePages.length < poolSize) {
        idlePages.push(page)
        getLogger().debug('Page returned to pool', { idle: idlePages.length, poolSize })
      } else {
        getLogger().debug('Page destroyed (pool full)', { idle: idlePages.length, poolSize })
        await closePage(page)
      }
    } finally {
      releaseSlot()
    }
  }

  async function warmup(browser: Browser): Promise<void> {
    currentBrowser = browser
    getLogger().info('Pool warming up', { poolSize })

    const results = await Promise.allSettled(
      Array.from({ length: poolSize }, async () => {
        const page = await createPage()
        await page.goto('about:blank')
        return page
      }),
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        idlePages.push(result.value)
      } else {
        getLogger().error('Failed to warm page', { error: result.reason instanceof Error ? result.reason.message : String(result.reason) })
      }
    }

    getLogger().debug('Pool warmup complete', { idle: idlePages.length })
  }

  async function drain(): Promise<void> {
    getLogger().info('Pool draining', { idle: idlePages.length, active: activeCount })

    // Close all idle pages
    const pagesToClose = idlePages.splice(0)
    await Promise.all(pagesToClose.map(p => closePage(p)))

    // Wait for active renders to complete
    if (activeCount > 0) {
      await new Promise<void>((resolve, reject) => {
        drainResolve = resolve
        setTimeout(() => {
          if (drainResolve) {
            drainResolve = null
            // Reject remaining waiters
            const pending = waitQueue
            waitQueue = []
            for (const waiter of pending) {
              waiter.reject(new PDFError('BROWSER_CRASHED', 'Drain timeout'))
            }
            reject(new PDFError('BROWSER_CRASHED', `Drain timeout after ${DRAIN_TIMEOUT_MS}ms — ${activeCount} renders still active`))
          }
        }, DRAIN_TIMEOUT_MS)
      })
    }

    getLogger().debug('Pool drain complete')
  }

  async function requestRecycle(): Promise<void> {
    recycleRequested = true
    getLogger().info('Pool recycle requested')
    await drain()
  }

  async function clearRecycle(browser: Browser): Promise<void> {
    recycleRequested = false
    await warmup(browser)
    getLogger().info('Pool recycle cleared — pool re-warmed')
  }

  function stats(): { idle: number, active: number, totalCreated: number } {
    return { idle: idlePages.length, active: activeCount, totalCreated }
  }

  return {
    acquire,
    release,
    warmup,
    drain,
    requestRecycle,
    clearRecycle,
    stats,
  }
}
