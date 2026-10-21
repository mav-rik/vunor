import { defineConfig } from 'vitest/config'

// Checks of the built dist/ (run by `pnpm test:dist`, the last step of `pnpm build`).
export default defineConfig({
  test: {
    include: ['test-dist/**/*.spec.ts'],
    maxWorkers: 1,
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
