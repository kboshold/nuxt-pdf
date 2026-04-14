import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // Unit + component tests (plain vitest, no Nuxt env)
      {
        plugins: [vue()],
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts', 'test/components/**/*.test.ts', 'test/integration/**/*.test.ts'],
        },
      },
      // E2E tests — plain node environment (not Nuxt vitest env)
      // Uses @nuxt/test-utils/e2e setup() which runs buildNuxt() in-process.
      // Must NOT use defineVitestProject() as it triggers CJS interop issues
      // with @vue/compiler-sfc in vitest 4's module runner (nuxt/nuxt#34645).
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.test.ts'],
          setupTimeout: 120000,
        },
      },
    ],
  },
})
