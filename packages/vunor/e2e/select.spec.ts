import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

import type { Page } from '@playwright/test'

// Helper to get the Select popup container (portaled to body)
function selectPopup(page: Page) {
  return page.locator('.select-content')
}

test.describe('Select Component', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Selects')
  })

  test('renders select with placeholder', async ({ page }) => {
    const placeholder = page.locator('main').getByPlaceholder('Pick an item').first()
    await expect(placeholder).toBeVisible()
  })

  test('renders select with label', async ({ page }) => {
    const label = page.locator('main').getByText('A fruit or Vegetable').first()
    await expect(label).toBeVisible()
  })

  test('opens dropdown and shows items', async ({ page }) => {
    // Click the first select trigger inside main content
    const trigger = page.locator('main [role="combobox"]').first()
    await trigger.click()

    // Wait for the select popup to appear
    const popup = selectPopup(page)
    await expect(popup).toBeVisible()

    // Verify fruit and vegetable items are visible (scoped to popup div, not native selects)
    await expect(popup.locator('div[role="option"]', { hasText: '🍏 Apple' })).toBeVisible()
    await expect(popup.locator('div[role="option"]', { hasText: '🥦 Broccoli' })).toBeVisible()
  })

  test('selects an item and closes dropdown', async ({ page }) => {
    const trigger = page.locator('main [role="combobox"]').first()
    await trigger.click()

    const popup = selectPopup(page)
    await expect(popup).toBeVisible()

    // Click on Apple
    await popup.locator('div[role="option"]', { hasText: '🍏 Apple' }).click()

    // Popup should close
    await expect(popup).not.toBeVisible()
  })

  test('disabled item in dropdown', async ({ page }) => {
    const trigger = page.locator('main [role="combobox"]').first()
    await trigger.click()

    const popup = selectPopup(page)
    await expect(popup).toBeVisible()

    // Courgette is in the disabled list
    const courgette = popup.locator('div[role="option"]', { hasText: 'Courgette' })
    await expect(courgette).toBeVisible()
    await expect(courgette).toHaveAttribute('aria-disabled', 'true')
  })
})
