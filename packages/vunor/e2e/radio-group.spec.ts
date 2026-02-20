import { test, expect } from '@playwright/test'
import { navigateTo } from './utils'

test.describe('RadioGroup Component', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'Radiobuttons')
  })

  test('renders radio group with label and items', async ({ page }) => {
    const groupLabel = page.locator('label.rb-label').first()
    await expect(groupLabel).toBeVisible()
    await expect(groupLabel).toHaveText('Test rb-group')

    // First group should have 4 radio items
    const firstGroup = page.locator('.rb-root').first()
    const items = firstGroup.locator('button.rb-item')
    expect(await items.count()).toBe(4)
  })

  test('clicking a radio item selects it', async ({ page }) => {
    const firstGroup = page.locator('.rb-root').first()
    const items = firstGroup.locator('button.rb-item')

    // "item 1" starts selected (v-model="v1" where v1 = 'item 1')
    await expect(items.nth(0)).toHaveAttribute('data-state', 'checked')
    await expect(items.nth(1)).toHaveAttribute('data-state', 'unchecked')

    // Click "item 2"
    const item2Label = firstGroup.locator('label.rb-item-label').filter({ hasText: 'item 2' })
    await item2Label.click()

    await expect(items.nth(0)).toHaveAttribute('data-state', 'unchecked')
    await expect(items.nth(1)).toHaveAttribute('data-state', 'checked')
  })

  test('disabled item cannot be selected', async ({ page }) => {
    const firstGroup = page.locator('.rb-root').first()
    const item3 = firstGroup.locator('button.rb-item').nth(2) // "item 3" is 3rd (0-indexed: 2)

    await expect(item3).toBeDisabled()
  })

  test('fully disabled group has all items disabled', async ({ page }) => {
    // The "Row, Disabled" group
    const disabledGroup = page.locator('.rb-root[data-disabled]').first()
    const items = disabledGroup.locator('button.rb-item')

    const count = await items.count()
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toBeDisabled()
    }
  })

  test('error text is displayed', async ({ page }) => {
    const errorText = page.getByText('Error text')
    await expect(errorText.first()).toBeVisible()
  })
})
