import { defineVitestProject } from '@nuxt/test-utils/config'
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
      // E2E tests (Nuxt test utils)
      defineVitestProject({
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.test.ts'],
          setupTimeout: 120000,
        },
      }),
    ],
  },
})
