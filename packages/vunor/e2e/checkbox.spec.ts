import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

test.describe('Checkbox Component', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Checkboxes')
  })

  test('renders multiple checkboxes', async ({ page }) => {
    const checkboxes = page.locator('button.checkbox')
    await expect(checkboxes.first()).toBeVisible()
    expect(await checkboxes.count()).toBeGreaterThan(5)
  })

  test('toggle checkbox changes state', async ({ page }) => {
    // The scope-secondary checkbox (second in the list) starts unchecked
    const checkbox = page
      .locator('label.checkbox-root')
      .filter({ hasText: 'Checkbox (scope-secondary)' })
      .first()
    const button = checkbox.locator('button.checkbox')

    await expect(button).toHaveAttribute('data-state', 'unchecked')
    await checkbox.click()
    await expect(button).toHaveAttribute('data-state', 'checked')
    await checkbox.click()
    await expect(button).toHaveAttribute('data-state', 'unchecked')
  })

  test('indeterminate state', async ({ page }) => {
    // First checkbox starts as indeterminate (v-model="c" where c = 'indeterminate')
    const firstCheckbox = page.locator('button.checkbox').first()
    await expect(firstCheckbox).toHaveAttribute('data-state', 'indeterminate')

    // Click to toggle out of indeterminate
    await firstCheckbox.click()
    const newState = await firstCheckbox.getAttribute('data-state')
    expect(newState).not.toBe('indeterminate')
  })

  test('disabled checkbox cannot be toggled', async ({ page }) => {
    const disabledLabel = page
      .locator('label.checkbox-root')
      .filter({ hasText: /^Checkbox Disabled$/ })
      .first()
    const button = disabledLabel.locator('button.checkbox')

    const stateBefore = (await button.getAttribute('data-state')) ?? ''
    // Clicking a disabled checkbox should not change state
    await disabledLabel.click({ force: true })
    await expect(button).toHaveAttribute('data-state', stateBefore)
  })

  test('error message is displayed', async ({ page }) => {
    const errorText = page.getByText('Has Error')
    await expect(errorText.first()).toBeVisible()
  })

  test('required checkbox has required attribute', async ({ page }) => {
    const requiredLabel = page
      .locator('label.checkbox-root')
      .filter({ hasText: 'Checkbox 1 (required)' })
      .first()
    const button = requiredLabel.locator('button.checkbox')
    await expect(button).toHaveAttribute('aria-required', 'true')
  })
})
