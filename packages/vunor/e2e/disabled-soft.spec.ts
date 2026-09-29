import { test, expect } from '@playwright/test'

import { navigateTo, restAndHover } from './utils'

/**
 * `disabled-soft` written as a literal class, not composed inside a shortcut.
 * UnoCSS reads the bare token as the `disabled-` variant plus `soft` unless the
 * preset's literal variant claims it (src/theme/preset-vunor.ts), in which case
 * the class used to render with no CSS at all.
 */

test.describe('disabled-soft literal class', () => {
  test('paints each disabled convention in the Tokens demo', async ({ page }) => {
    await navigateTo(page, 'Tokens')
    for (const selector of [
      'main button.disabled-soft[disabled]',
      'main button.disabled-soft[aria-disabled="true"]',
      'main a.disabled-soft[data-disabled]',
    ]) {
      const el = page.locator(selector).first()
      await expect(el).toHaveCSS('opacity', '0.4')
      await expect(el).toHaveCSS('cursor', 'not-allowed')
    }
  })

  test('Pagination: disabled arrow is soft and ignores hover, enabled arrow is not', async ({
    page,
  }) => {
    await navigateTo(page, 'Pagination')
    // page 1: Reka disables Previous and leaves Next enabled
    const prev = page.locator('main button[aria-label="Previous Page"]').first()
    const next = page.locator('main button[aria-label="Next Page"]').first()
    await expect(prev).toBeDisabled()
    await expect(next).toBeEnabled()

    await expect(prev).toHaveCSS('opacity', '0.4')
    await expect(prev).toHaveCSS('cursor', 'not-allowed')
    await expect(next).toHaveCSS('opacity', '1')

    const prevBg = await restAndHover(page, prev)
    expect(prevBg.hover).toBe(prevBg.rest)
    const nextBg = await restAndHover(page, next)
    expect(nextBg.hover).not.toBe(nextBg.rest)
  })
})
