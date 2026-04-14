import { defineNitroPlugin } from 'nitropack/runtime'
import { closeBrowser } from '../browser'
import { getPool } from '../composables/usePDF'
import { getLogger } from '../logger'

async function cleanup() {
  getLogger().info('Shutdown: draining pool and closing browser')
  await closeBrowser(getPool())
  getLogger().info('Shutdown: browser closed')
}

async function cleanupAndExit() {
  getLogger().info('Shutdown: draining pool and closing browser (signal)')
  await closeBrowser(getPool())
  getLogger().info('Shutdown: browser closed')
  process.exit(0)
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', cleanup)

  process.once('SIGTERM', cleanupAndExit)
  process.once('SIGINT', cleanupAndExit)
})
