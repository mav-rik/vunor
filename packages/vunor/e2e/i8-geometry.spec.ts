import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

import type { Locator, Page } from '@playwright/test'

/**
 * Computed-style regression gate for the `i8` shortcut family
 * (src/theme/shortcuts/i8.ts).
 *
 * The padding/visibility rules are currently emitted as descendant-combinator
 * selectors driven by the `group/i8` wrapper (`.group\/i8.i8-filled
 * .i8-input:not([data-has-prepend=true]) { padding-left: … }`). A refactor onto
 * inherited custom properties must render identically — hence computed styles,
 * not CSS text.
 *
 * Numbers are the values observed in chromium at root font-size 16px, where
 * `$m` is 16px, `--v-fingertip` is `3em` (= 48px) and `--v-fingertip-half` is
 * `1.5em` (= 24px).
 *
 * Note on `design="round"`: <VuInput>/<VuInputBase> put BOTH `i8-filled` and
 * `i8-round` on the element, so the round design also inherits every
 * `.i8-filled` rule — including the one that hides `.i8-underline`. That is the
 * behaviour pinned below.
 */

const DESIGN = {
  flat: '.i8-flat',
  filled: '.i8-filled:not(.i8-round)',
  round: '.i8-round',
} as const

/**
 * inputs.vue renders, per state, three rows of <VuInput> (flat / filled /
 * round). Row 0 is `{ placeholder }`, row 1 is `{ label }`, row 2 is both.
 */
function stateRow(page: Page, index: number) {
  return page.getByText('Normal State').first().locator('~ div').nth(index)
}

function parts(page: Page, design: keyof typeof DESIGN, rowIndex = 1) {
  const row = stateRow(page, rowIndex)
  const sel = DESIGN[design]
  // <VuInput> root (holds the hint wrapper) vs. <VuInputBase> root (the .i8 box)
  const outer = row.locator(`${sel}:not(.i8)`)
  const inner = row.locator(`.i8${sel}`)
  return {
    outer,
    inner,
    input: inner.locator('input.i8-input'),
    label: inner.locator('.i8-label'),
    labelWrapper: inner.locator('.i8-label-wrapper'),
    underline: inner.locator('.i8-underline'),
    hintWrapper: outer.locator('.i8-hint-wrapper'),
  }
}

/** Resolves an `em`-authored theme token (e.g. `1.5em`) to px on that element. */
function cssVarPx(locator: Locator, name: string) {
  return locator.evaluate((el, varName) => {
    const cs = getComputedStyle(el)
    return Number.parseFloat(cs.getPropertyValue(varName)) * Number.parseFloat(cs.fontSize)
  }, name)
}

test.describe('i8 geometry — single inputs', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Inputs')
  })

  test('i8-filled: $m padding on input, label wrapper and hint wrapper', async ({ page }) => {
    const { inner, input, labelWrapper, hintWrapper } = parts(page, 'filled')
    await expect(inner).toBeVisible()
    await expect(input).toHaveCSS('padding-left', '16px')
    await expect(input).toHaveCSS('padding-right', '16px')
    await expect(labelWrapper).toHaveCSS('padding-left', '16px')
    await expect(labelWrapper).toHaveCSS('padding-right', '16px')
    await expect(hintWrapper).toHaveCSS('padding-left', '16px')
    await expect(hintWrapper).toHaveCSS('padding-right', '16px')
    await expect(inner).toHaveCSS('border-radius', '8px')
  })

  test('i8-filled: .i8-underline is display:none', async ({ page }) => {
    const { underline } = parts(page, 'filled')
    await expect(underline).toHaveCSS('display', 'none')
    await expect(underline).toBeHidden()
  })

  test('i8-round: fingertip-half padding on input, label wrapper and hint wrapper', async ({
    page,
  }) => {
    const { inner, input, labelWrapper, hintWrapper } = parts(page, 'round')
    await expect(inner).toBeVisible()
    await expect(input).toHaveCSS('padding-left', '24px')
    await expect(input).toHaveCSS('padding-right', '24px')
    await expect(labelWrapper).toHaveCSS('padding-left', '24px')
    await expect(labelWrapper).toHaveCSS('padding-right', '24px')
    await expect(hintWrapper).toHaveCSS('padding-left', '24px')
    await expect(hintWrapper).toHaveCSS('padding-right', '24px')
    await expect(inner).toHaveCSS('border-radius', '24px')

    const fingertipHalf = await cssVarPx(input, '--v-fingertip-half')
    expect(fingertipHalf).toBe(24)
    await expect(input).toHaveCSS('padding-left', `${fingertipHalf}px`)
  })

  test('i8-round: .i8-underline is hidden (i8-filled is applied too)', async ({ page }) => {
    const { inner, underline } = parts(page, 'round')
    await expect(inner).toHaveClass(/i8-filled/)
    await expect(underline).toHaveCSS('display', 'none')
    await expect(underline).toBeHidden()
  })

  test('i8-flat: 1px bottom border, no horizontal padding, visible underline', async ({ page }) => {
    const { inner, input, labelWrapper, hintWrapper, underline } = parts(page, 'flat')
    await expect(inner).toBeVisible()
    await expect(inner).toHaveCSS('border-bottom-width', '1px')
    await expect(inner).toHaveCSS('border-bottom-style', 'solid')
    await expect(input).toHaveCSS('padding-left', '0px')
    await expect(input).toHaveCSS('padding-right', '0px')
    await expect(labelWrapper).toHaveCSS('padding-left', '0px')
    await expect(labelWrapper).toHaveCSS('padding-right', '0px')
    await expect(hintWrapper).toHaveCSS('padding-left', '0px')
    await expect(hintWrapper).toHaveCSS('padding-right', '0px')
    await expect(underline).toHaveCSS('display', 'block')
    await expect(underline).toHaveCSS('height', '2px')
  })

  test('i8-label: floats to 0.7em when the group has a placeholder', async ({ page }) => {
    // row 1 = label only -> resting state; row 2 = label + placeholder -> floated
    const resting = parts(page, 'filled', 1).label
    await expect(resting).toHaveCSS('font-size', '16px')
    await expect(resting).toHaveCSS('line-height', '48px')

    const floated = parts(page, 'filled', 2).label
    await expect(floated).toHaveCSS('font-size', '11.2px')
    await expect(floated).toHaveCSS('line-height', '22.4px')
  })

  test('segmented i8-round: positional padding overrides', async ({ page }) => {
    // Only the "Groupped Inputs" section renders `.segmented`; the first three
    // round segments are the Normal-State / placeholder group.
    const segments = page.locator('main .i8.i8-round.segmented')
    const first = segments.nth(0).locator('input.i8-input')
    const middle = segments.nth(1).locator('input.i8-input')
    const last = segments.nth(2).locator('input.i8-input')

    // first-child keeps the round padding on the outer edge only
    await expect(first).toHaveCSS('padding-left', '24px')
    await expect(first).toHaveCSS('padding-right', '16px')
    // middle item: both sides fall back to $m
    await expect(middle).toHaveCSS('padding-left', '16px')
    await expect(middle).toHaveCSS('padding-right', '16px')
    // last-child keeps the round padding on the outer edge only
    await expect(last).toHaveCSS('padding-left', '16px')
    await expect(last).toHaveCSS('padding-right', '24px')
  })
})

test.describe('i8 geometry — prepend / append collapse', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Selects')
  })

  test('prepend collapses padding-left (scope-good row has icon-prepend)', async ({ page }) => {
    const row = page.locator('main div.scope-good').first()

    const filled = row.locator(`.i8${DESIGN.filled} input.i8-input`).first()
    await expect(filled).toHaveAttribute('data-has-prepend', 'true')
    await expect(filled).toHaveCSS('padding-left', '0px')
    await expect(filled).toHaveCSS('padding-right', '16px')

    const round = row.locator(`.i8${DESIGN.round} input.i8-input`).first()
    await expect(round).toHaveAttribute('data-has-prepend', 'true')
    await expect(round).toHaveCSS('padding-left', '0px')
    await expect(round).toHaveCSS('padding-right', '24px')
  })

  test('append collapses padding-right (scope-warn row has icon-append)', async ({ page }) => {
    const row = page.locator('main div.scope-warn').first()

    const filled = row.locator(`.i8${DESIGN.filled} input.i8-input`).first()
    await expect(filled).toHaveAttribute('data-has-append', 'true')
    await expect(filled).toHaveCSS('padding-left', '16px')
    await expect(filled).toHaveCSS('padding-right', '0px')

    const round = row.locator(`.i8${DESIGN.round} input.i8-input`).first()
    await expect(round).toHaveAttribute('data-has-append', 'true')
    await expect(round).toHaveCSS('padding-left', '24px')
    await expect(round).toHaveCSS('padding-right', '0px')
  })

  test('segmented i8-round selects: prepend wins over the positional override', async ({
    page,
  }) => {
    // "Groupped Selects": day + month carry icon-prepend, year does not; all
    // three carry the select chevron as append.
    const segments = page.locator('main .i8.i8-round.segmented')
    await expect(segments).toHaveCount(3)

    const first = segments.nth(0).locator('input.i8-input')
    await expect(first).toHaveAttribute('data-has-prepend', 'true')
    await expect(first).toHaveCSS('padding-left', '0px')
    await expect(first).toHaveCSS('padding-right', '0px')

    const last = segments.nth(2).locator('input.i8-input')
    await expect(last).toHaveAttribute('data-has-prepend', 'false')
    // not-first-child -> $m, append still collapses the right side
    await expect(last).toHaveCSS('padding-left', '16px')
    await expect(last).toHaveCSS('padding-right', '0px')
  })
})
