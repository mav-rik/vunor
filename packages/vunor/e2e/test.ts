import { test as base, expect } from '@playwright/test'

/**
 * Every e2e spec imports `test` from here (e2e/warnings.spec.ts checks it): a test fails
 * when the page logs a Vue or Vue Router warning, so the demo app and the fixtures stay
 * free of them.
 */
export const test = base.extend<{ vueWarnings: string[] }>({
  vueWarnings: [
    async ({ page }, use) => {
      const warnings: string[] = []
      page.on('console', message => {
        const text = message.text()
        if (/\[Vue( Router)? warn\]/.test(text)) {
          warnings.push(text.split('\n')[0])
        }
      })
      await use(warnings)
      expect(warnings, 'Vue warnings logged by the page').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
