import { test, expect } from '@playwright/test'
import { navigateTo } from './utils'

test.describe('Input Component', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Inputs')
  })

  test('renders inputs with labels', async ({ page }) => {
    const labels = page.locator('label.i8-label')
    await expect(labels.first()).toBeVisible()
    expect(await labels.count()).toBeGreaterThan(0)
  })

  test('typing into input updates value', async ({ page }) => {
    // Find a normal-state input with placeholder (under "Normal State" heading)
    const input = page.locator('main input.i8-input[placeholder="Placeholder"]').first()
    await expect(input).toHaveValue('')

    await input.fill('Hello World')
    await expect(input).toHaveValue('Hello World')
  })

  test('placeholder is visible', async ({ page }) => {
    const input = page.locator('input.i8-input[placeholder="Placeholder"]').first()
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('placeholder', 'Placeholder')
  })

  test('disabled input has aria-disabled', async ({ page }) => {
    const disabledHeading = page.getByText('Disabled State').first()
    const inputWrapper = disabledHeading.locator('~ div').first()
    const i8 = inputWrapper.locator('.i8').first()
    await expect(i8).toHaveAttribute('aria-disabled', 'true')
  })

  test('readonly input has readonly attribute', async ({ page }) => {
    const readonlyHeading = page.getByText('Readonly State').first()
    const inputWrapper = readonlyHeading.locator('~ div').first()
    const input = inputWrapper.locator('input.i8-input').first()
    await expect(input).toHaveAttribute('readonly', '')
  })

  test('error state shows error message', async ({ page }) => {
    const errorMessage = page.getByText('Error Message')
    await expect(errorMessage.first()).toBeVisible()
  })
})
