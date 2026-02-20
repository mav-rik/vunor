import type { Page } from '@playwright/test'

export async function navigateTo(page: Page, section: string) {
  await page.goto('/')
  await page.locator('text=' + section).first().click()
  // Wait for the content area to update
  await page.waitForTimeout(300)
}
