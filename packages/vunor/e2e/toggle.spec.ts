import { POPUP_SELECTOR, TOGGLE, toggleCases } from '../test-dist/contract.mjs'
import { test, expect } from './test'

import type { Page } from '@playwright/test'

// One gesture, one toggle, in a real browser: every case of contract.mjs `toggleCases`
// (the list the dist test discovers and requires) opens on the first click on its append
// icon / trigger and closes on the second, with one `update:open` per click (none on mount).
interface TExpected {
  shown: boolean[]
  emitted: unknown[][]
}
const cases = toggleCases as Record<
  string,
  { component: string; icon: string; emits: boolean; keys?: boolean; expected?: TExpected }
>

const popupShown = (page: Page) =>
  page.evaluate(selector => !!document.querySelector(selector), POPUP_SELECTOR as string)
const takeLog = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __log: unknown[] }
    return w.__log.splice(0)
  })

for (const [name, fixture] of Object.entries(cases)) {
  test.describe(`one toggle per gesture: ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/e2e/fixtures/toggle.html')
      await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready)
      await page.evaluate(
        n => (window as unknown as { __mount: (n: string) => void }).__mount(n),
        name
      )
      await page.waitForTimeout(150)
    })

    test('two clicks: open, then close (or as the case expects)', async ({ page }) => {
      const icon = page.locator('#app').locator(fixture.icon).last()
      // mounting is not a user gesture: nothing may be emitted for it
      const mountEmitted = await takeLog(page)
      const steps = []
      for (let i = 0; i < 2; i++) {
        await icon.click({ force: true })
        await page.waitForTimeout(300)
        steps.push({ shown: await popupShown(page), emitted: await takeLog(page) })
      }
      const expected = fixture.expected ?? (TOGGLE as TExpected)
      expect(steps.map(step => step.shown)).toEqual(expected.shown)
      if (fixture.emits) {
        expect(mountEmitted).toEqual([])
        expect(steps.map(step => step.emitted)).toEqual(expected.emitted)
      }
    })

    test('Escape closes what a click opened (one update:open)', async ({ page }) => {
      const icon = page.locator('#app').locator(fixture.icon).last()
      await icon.click({ force: true })
      await page.waitForTimeout(300)
      const opened = { shown: await popupShown(page), emitted: await takeLog(page) }
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
      const closed = { shown: await popupShown(page), emitted: await takeLog(page) }
      expect([opened.shown, closed.shown]).toEqual([true, false])
      if (fixture.emits) {
        expect([opened.emitted, closed.emitted]).toEqual([[true], [false]])
      }
    })

    if (fixture.keys) {
      test('Enter opens, Space closes', async ({ page }) => {
        const icon = page.locator('#app').locator(fixture.icon).last()
        const steps = []
        for (const key of ['Enter', 'Space']) {
          await icon.focus()
          await page.keyboard.press(key)
          await page.waitForTimeout(300)
          steps.push({ shown: await popupShown(page), emitted: await takeLog(page) })
        }
        expect(steps.map(step => step.shown)).toEqual([true, false])
        expect(steps.map(step => step.emitted)).toEqual([[true], [false]])
      })
    }
  })
}
