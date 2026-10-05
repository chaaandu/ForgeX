import { expect, test } from '@playwright/test'
import { copy } from '../lib/copy'
import { card, resetBoard, signIn, STUDENT_A } from './helpers'

test.beforeEach(async ({ context }) => {
  await resetBoard(context)
  await signIn(context, STUDENT_A)
})

test('filters sync to the URL and can be cleared', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Mythic', exact: true }).click()
  await expect(page).toHaveURL(/tag=mythic/)
  await expect(page.locator('[data-card-id]')).toHaveCount(11)

  await page.getByRole('searchbox').fill('zzzzzznothing')
  await expect(page.getByText(copy.empty.line)).toBeVisible()
  await page.getByRole('button', { name: copy.empty.link }).click()
  await expect(page.locator('[data-card-id]')).toHaveCount(212)
})

test('a deep link opens the modal, and escape closes it', async ({ page }) => {
  await page.goto('/?p=P042')
  await expect(page.locator('#problem-title')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#problem-title')).toHaveCount(0)
  await expect(page).not.toHaveURL(/p=P042/)
})

test('the arrow keys move through the filtered list', async ({ page }) => {
  await page.goto('/?p=P001')
  await expect(page.locator('#problem-title')).toBeVisible()
  await expect(page.getByTestId('bet-button')).toBeEnabled()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/p=P002/)
  await expect(page.locator('#problem-title')).toHaveText('Stock that ages in the back room')
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/p=P001/)
})

test('a card opens the modal and the back button closes it', async ({ page }) => {
  await page.goto('/')
  await card(page, 'P010').click()
  await expect(page.locator('#problem-title')).toBeVisible()
  await page.goBack()
  await expect(page.locator('#problem-title')).toHaveCount(0)
})
