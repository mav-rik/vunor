import { test, expect } from '@playwright/test'

import { navigateTo, restAndHover } from './utils'

/**
 * `disabled-soft` written as a literal class, not composed inside a shortcut.
 * UnoCSS reads the bare token as the `disabled-` variant plus `soft` unless the
 * preset's literal variant claims it (src/theme/preset-vunor.ts), in which case
 * the class used to render with no CSS at all. Also covers how it and a
 * consumer's `disabled:opacity-*` override btn's default disabled opacity.
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

  // btn's opacity-80 is a zero-specificity default (src/theme/shortcuts/btn.ts),
  // so any explicit disabled opacity replaces it — also inside an alias, where
  // both rules land on the alias class and UnoCSS, not the body, picks the order.
  for (const [kind, opacity] of [
    ['plain', '0.8'],
    ['literal-soft', '0.4'],
    ['alias-soft-after', '0.4'],
    ['alias-soft-before', '0.4'],
    ['consumer-opacity', '0.5'],
  ] as const) {
    test(`btn disabled paint, ${kind}: opacity ${opacity}`, async ({ page }) => {
      await navigateTo(page, 'Tokens')
      const el = page.locator(`main .btn-disabled-row button[data-case="${kind}"]`)
      await expect(el).toBeDisabled()
      await expect(el).toHaveCSS('opacity', opacity)
      await expect(el).toHaveCSS('cursor', 'not-allowed')
    })
  }

  test('btn cursor-pointer still shows not-allowed once disabled', async ({ page }) => {
    await navigateTo(page, 'Tokens')
    const el = page.locator('main .btn-disabled-row button[data-case="cursor"]')
    await expect(el).toHaveCSS('cursor', 'not-allowed')
    await expect(el).toHaveCSS('opacity', '0.8')
  })
})
