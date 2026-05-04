import { test, expect } from '@playwright/test'

import { navigateTo } from './utils'

test.describe('Dialog Component', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Dialog')
  })

  test('opens basic dialog and renders VuCard (not raw <vucard> tag)', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()

    // Dialog should be visible — the dialog role element IS the VuCard (as-child)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // VuCard must render as a proper <div> with class "card", not a raw <vucard> tag
    await expect(dialog).toHaveClass(/\bcard\b/)
    const tagName = await dialog.evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('div')
  })

  test('displays dialog title', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: 'Basic Dialog' })).toBeVisible()
  })

  test('close button closes the dialog', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.locator('.dialog-close').click()
    await expect(dialog).not.toBeVisible()
  })

  test('footer buttons are rendered', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()
    const dialog = page.getByRole('dialog')

    await expect(dialog.locator('button', { hasText: 'OK' })).toBeVisible()
    await expect(dialog.locator('button', { hasText: 'Cancel' })).toBeVisible()
  })

  test('Cancel button closes the dialog', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    await dialog.locator('button', { hasText: 'Cancel' }).click()
    await expect(dialog).not.toBeVisible()
  })

  test('autofocuses input when dialog opens', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Basic Dialog' }).click()
    const dialog = page.getByRole('dialog')
    const input = dialog.locator('input')
    await expect(input).toBeFocused()
  })

  test('dialog without footer has no footer section', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Dialog without Footer' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.dialog-footer')).toHaveCount(0)
  })

  test('dialog with custom footer renders custom content', async ({ page }) => {
    await page.locator('main button', { hasText: 'Open Dialog with Custom Footer' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('button', { hasText: 'Save' })).toBeVisible()
    await expect(dialog.locator('button', { hasText: 'Close' })).toBeVisible()
  })
})
