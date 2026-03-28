import { defineNitroPlugin } from 'nitropack/runtime'
import { closeBrowser } from '../browser'
import { getLogger } from '../logger'

async function cleanup() {
  getLogger().info('Cleanup: closing browser')
  await closeBrowser()
}

async function cleanupAndExit() {
  getLogger().info('Cleanup: closing browser (signal)')
  await closeBrowser()
  process.exit(0)
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', cleanup)

  process.once('SIGTERM', cleanupAndExit)
  process.once('SIGINT', cleanupAndExit)
})
