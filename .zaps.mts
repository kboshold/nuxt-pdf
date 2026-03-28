import type { Library } from 'zaps'

export function config({ defineProject }: Library) {
  return defineProject({
    name: 'nuxt-pdf',
    services: {
      dev: {
        start: 'pnpm dev',
        ready: { port: 3000 },
        url: 'http://localhost:3000',
      },
    },
    tasks: {
      lint: { name: 'Lint', commands: 'pnpm lint', shortcut: 'l' },
      typecheck: { name: 'Typecheck', commands: 'pnpm typecheck', shortcut: 't' },
      build: { name: 'Build', commands: 'pnpm build', shortcut: 'b' },
      test: { name: 'Test', commands: 'pnpm test --run', shortcut: 'e' },
    },
  })
}
