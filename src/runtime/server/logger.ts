import type { ConsolaInstance } from 'consola'
import { consola } from 'consola'

export const LOG_LEVEL_MAP = {
  error: 0,
  info: 3,
  debug: 4,
} as const satisfies Record<string, number>

let logger: ConsolaInstance | null = null

export function configureLogger(logLevel: 'error' | 'info' | 'debug'): void {
  logger = consola.create({
    level: LOG_LEVEL_MAP[logLevel],
    defaults: { tag: '@sidebase/nuxt-pdf' },
  })
}

export function getLogger(): ConsolaInstance {
  if (!logger) {
    logger = consola.create({
      level: LOG_LEVEL_MAP.error,
      defaults: { tag: '@sidebase/nuxt-pdf' },
    })
  }
  return logger
}
