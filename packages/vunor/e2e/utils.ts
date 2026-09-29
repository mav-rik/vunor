import type { Locator, Page } from '@playwright/test'

export async function navigateTo(page: Page, section: string) {
  await page.goto('/')
  await page.locator(`text=${section}`).first().click()
  // Wait for the content area to update
  await page.waitForTimeout(300)
}

export function bg(locator: Locator) {
  return locator.evaluate(el => getComputedStyle(el).backgroundColor)
}

/** Background with the pointer parked on a neutral spot, then while hovering. */
export async function restAndHover(page: Page, locator: Locator) {
  await page.mouse.move(0, 0)
  const rest = await bg(locator)
  await locator.hover({ force: true })
  const hover = await bg(locator)
  return { rest, hover }
}
