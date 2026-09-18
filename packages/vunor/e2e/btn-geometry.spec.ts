import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

import type { Locator, Page } from '@playwright/test'

/**
 * Computed-style regression gate for the `btn` shortcut family
 * (src/theme/shortcuts/btn.ts).
 *
 * The label/icon rules used to be descendant-combinator selectors
 * (`.group\/btn.btn-square .btn-label { display: none }`). In 0.3.0 they became
 * inherited custom properties (`--btn-label-display`, `--btn-icon-fs`,
 * `--btn-icon-pull`) set by the modifier and read by the child. Every number
 * here was pinned against the old form and still holds for the new one — which
 * a CSS-text diff could not have shown, and a computed style can.
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
  roundWithIconRight: 'main button.btn.btn-round:not(.btn-square):has(.btn-icon-right)',
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

  test('btn-round: right icon is pulled by -0.5em', async ({ page }) => {
    const icon = btn(page, 'roundWithIconRight').locator('.btn-icon-right').first()
    // mirror of the left-icon case: -0.5em of the icon's own 1.25em (20px)
    await expect(icon).toHaveCSS('font-size', '20px')
    await expect(icon).toHaveCSS('margin-right', '-10px')
    await expect(icon).toHaveCSS('margin-left', '0px')
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

/**
 * The `Primitives` preview hand-rolls its buttons: `class="btn btn-square"` with
 * no `group/btn`. The descendant-combinator rules could never reach those icons
 * (measured before the refactor: square icon 20px, round left icon margin 0) —
 * the documented markup for a hand-rolled square button silently did nothing.
 * An inherited custom property does not need the marker on a `group/btn`
 * ancestor, so this is the documented behaviour finally working. These two
 * tests fail on the pre-refactor code by design.
 */
test.describe('btn geometry — hand-rolled buttons without group/btn', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Primitives')
  })

  test('btn-square enlarges its icon with no group/btn on the button', async ({ page }) => {
    const el = page.locator('main button.btn.btn-square').first()
    await expect(el).toBeVisible()
    // premise of the test: nothing here marks the button as a group
    await expect(el).not.toHaveClass(/group\/btn/)
    await expect(el.locator('.btn-icon').first()).toHaveCSS('font-size', '24px')
  })

  test('btn-round pulls its left icon with no group/btn on the button', async ({ page }) => {
    const el = page.locator('main button.btn.btn-round').first()
    await expect(el).toBeVisible()
    await expect(el).not.toHaveClass(/group\/btn/)

    const icon = el.locator('.btn-icon-left').first()
    await expect(icon).toHaveCSS('font-size', '20px')
    await expect(icon).toHaveCSS('margin-left', '-10px')
  })
})
