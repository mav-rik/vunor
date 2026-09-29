import { test, expect } from '@playwright/test'

import { bg, navigateTo, restAndHover } from './utils'

import type { Page } from '@playwright/test'

/**
 * Computed-style gate for the c8 hover / press wash on disabled elements
 * (src/theme/shortcuts/c8.ts, src/theme/utils/disabled.ts).
 *
 * Every c8 family gates `:hover`, `[data-highlighted]`, `:active` and
 * `[data-active]` on "not disabled", where disabled is `:disabled`,
 * `[disabled]`, `[aria-disabled=true]` or `[data-disabled]` — the same list
 * `disabled-soft` paints. `:focus-visible` is deliberately not gated: an
 * `aria-disabled` element stays focusable and the wash is its focus indicator.
 *
 * Runs against the `Tokens` preview, which renders one row per c8 variant with
 * an enabled, a `disabled`, an `aria-disabled` and a `data-disabled` button.
 */

const VARIANTS = ['c8-filled', 'c8-flat', 'c8-outlined', 'c8-light', 'c8-chrome'] as const
const DISABLED_KINDS = ['disabled', 'aria-disabled', 'data-disabled'] as const

function button(page: Page, variant: string, kind: string) {
  return page.locator(
    `main .c8-gate-row[data-variant="${variant}"] button[data-state-kind="${kind}"]`
  )
}

test.describe('c8 disabled gate', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Tokens')
  })

  for (const variant of VARIANTS) {
    test(`${variant}: hover repaints the enabled button`, async ({ page }) => {
      const { rest, hover } = await restAndHover(page, button(page, variant, 'enabled'))
      expect(hover).not.toBe(rest)
    })

    for (const kind of DISABLED_KINDS) {
      test(`${variant}: hover leaves a ${kind} button unpainted`, async ({ page }) => {
        const { rest, hover } = await restAndHover(page, button(page, variant, kind))
        expect(hover).toBe(rest)
      })
    }

    test(`${variant}: data-active paints only when enabled`, async ({ page }) => {
      const enabled = button(page, variant, 'enabled')
      const disabled = button(page, variant, 'aria-disabled')
      await page.mouse.move(0, 0)
      const enabledRest = await bg(enabled)
      const disabledRest = await bg(disabled)
      for (const el of [enabled, disabled]) {
        await el.evaluate(node => {
          node.dataset.active = ''
        })
      }
      expect(await bg(enabled)).not.toBe(enabledRest)
      expect(await bg(disabled)).toBe(disabledRest)
    })
  }

  test('focus-visible still paints an aria-disabled button', async ({ page }) => {
    const el = button(page, 'c8-flat', 'aria-disabled')
    await page.mouse.move(0, 0)
    const rest = await bg(el)
    // keyboard focus, so :focus-visible matches
    await button(page, 'c8-flat', 'enabled').focus()
    await page.keyboard.press('Tab')
    await expect(el).toBeFocused()
    expect(await bg(el)).not.toBe(rest)
  })

  test('btn paints the same three disabled conventions', async ({ page }) => {
    for (const kind of DISABLED_KINDS) {
      await expect(button(page, 'c8-flat', kind)).toHaveCSS('opacity', '0.8')
    }
    await expect(button(page, 'c8-flat', 'enabled')).toHaveCSS('opacity', '1')
  })
})
