import { defineNitroPlugin } from 'nitropack/runtime'
import { closeBrowser } from '../browser'

async function cleanup() {
  await closeBrowser()
}

async function cleanupAndExit() {
  await closeBrowser()
  process.exit(0)
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', cleanup)

  process.once('SIGTERM', cleanupAndExit)
  process.once('SIGINT', cleanupAndExit)
})
