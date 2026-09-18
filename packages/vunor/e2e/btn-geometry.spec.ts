import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

import type { Locator, Page } from '@playwright/test'

/**
 * Computed-style regression gate for the `btn` shortcut family
 * (src/theme/shortcuts/btn.ts).
 *
 * Today the modifier geometry is emitted as descendant-combinator selectors
 * (`.group\/btn.btn-square .btn-label { display: none }`). Any refactor that
 * re-expresses the same behaviour through inherited custom properties must keep
 * every rendered value below identical — a CSS-text diff cannot show that, a
 * computed style can.
 *
 * Numbers are the values observed in chromium against the `Buttons` preview at
 * root font-size 16px, where `--v-fingertip` is `3em` (= 48px) and
 * `--v-fingertip-half` is `1.5em` (= 24px).
 */

const BTN = {
  plain: 'main button.btn:not(.btn-round):not(.btn-square)',
  plainWithIcon: 'main button.btn:not(.btn-round):not(.btn-square):has(.btn-icon)',
  square: 'main button.btn.btn-square:not(.btn-round)',
  round: 'main button.btn.btn-round:not(.btn-square)',
  roundWithIcon: 'main button.btn.btn-round:not(.btn-square):has(.btn-icon-left)',
  roundSquare: 'main button.btn.btn-round.btn-square',
} as const

function btn(page: Page, kind: keyof typeof BTN) {
  return page.locator(BTN[kind]).first()
}

/** Resolves an `em`-authored theme token (e.g. `3em`) to px on that element. */
function cssVarPx(locator: Locator, name: string) {
  return locator.evaluate((el, varName) => {
    const cs = getComputedStyle(el)
    return Number.parseFloat(cs.getPropertyValue(varName)) * Number.parseFloat(cs.fontSize)
  }, name)
}

test.describe('btn geometry', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Buttons')
  })

  test('plain btn: $m horizontal padding, fingertip height', async ({ page }) => {
    const el = btn(page, 'plain')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('padding-left', '16px')
    await expect(el).toHaveCSS('padding-right', '16px')
    await expect(el).toHaveCSS('height', '48px')
    // no modifier applies: the label keeps its own display
    await expect(el.locator('.btn-label')).toHaveCSS('display', 'block')
  })

  test('plain btn: .btn-icon is 1.25em with no pull margins', async ({ page }) => {
    const icon = btn(page, 'plainWithIcon').locator('.btn-icon').first()
    await expect(icon).toHaveCSS('font-size', '20px')
    await expect(icon).toHaveCSS('margin-left', '0px')
    await expect(icon).toHaveCSS('margin-right', '0px')
  })

  test('btn-square: fingertip square, zero horizontal padding', async ({ page }) => {
    const el = btn(page, 'square')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('width', '48px')
    await expect(el).toHaveCSS('height', '48px')
    await expect(el).toHaveCSS('padding-left', '0px')
    await expect(el).toHaveCSS('padding-right', '0px')
  })

  test('btn-square: size tracks --v-fingertip', async ({ page }) => {
    const el = btn(page, 'square')
    const fingertip = await cssVarPx(el, '--v-fingertip')
    expect(fingertip).toBe(48)
    await expect(el).toHaveCSS('width', `${fingertip}px`)
    await expect(el).toHaveCSS('height', `${fingertip}px`)
  })

  test('btn-square: .btn-label is display:none', async ({ page }) => {
    const label = btn(page, 'square').locator('.btn-label')
    await expect(label).toHaveCSS('display', 'none')
    await expect(label).toBeHidden()
  })

  test('btn-square: .btn-icon is enlarged to 1.5em with zeroed margins', async ({ page }) => {
    const icon = btn(page, 'square').locator('.btn-icon').first()
    await expect(icon).toHaveCSS('font-size', '24px')
    await expect(icon).toHaveCSS('width', '24px')
    await expect(icon).toHaveCSS('height', '24px')
    await expect(icon).toHaveCSS('margin-left', '0px')
    await expect(icon).toHaveCSS('margin-right', '0px')
  })

  test('btn-round: fingertip-half radius and horizontal padding', async ({ page }) => {
    const el = btn(page, 'round')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('border-radius', '24px')
    await expect(el).toHaveCSS('padding-left', '24px')
    await expect(el).toHaveCSS('padding-right', '24px')
    await expect(el).toHaveCSS('height', '48px')

    const fingertipHalf = await cssVarPx(el, '--v-fingertip-half')
    expect(fingertipHalf).toBe(24)
    await expect(el).toHaveCSS('padding-left', `${fingertipHalf}px`)
  })

  test('btn-round: left icon is pulled by -0.5em', async ({ page }) => {
    const icon = btn(page, 'roundWithIcon').locator('.btn-icon-left').first()
    // .btn-icon is font-size 1.25em (20px), so -0.5em resolves to -10px
    await expect(icon).toHaveCSS('font-size', '20px')
    await expect(icon).toHaveCSS('margin-left', '-10px')
    await expect(icon).toHaveCSS('margin-right', '0px')
  })

  test('btn-round + btn-square: zero padding and zero icon margins', async ({ page }) => {
    const el = btn(page, 'roundSquare')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('padding-left', '0px')
    await expect(el).toHaveCSS('padding-right', '0px')
    await expect(el).toHaveCSS('border-radius', '24px')
    await expect(el).toHaveCSS('width', '48px')
    await expect(el).toHaveCSS('height', '48px')

    const icon = el.locator('.btn-icon').first()
    await expect(icon).toHaveCSS('margin-left', '0px')
    await expect(icon).toHaveCSS('margin-right', '0px')
    await expect(icon).toHaveCSS('font-size', '24px')
    await expect(el.locator('.btn-label')).toHaveCSS('display', 'none')
  })
})
