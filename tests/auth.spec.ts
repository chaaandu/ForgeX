import { expect, test } from '@playwright/test'
import { copy } from '../lib/copy'
import { OUTSIDER, signIn, STUDENT_A } from './helpers'

test('an address outside the Mesa domains is refused', async ({ browser }) => {
  const context = await browser.newContext()
  await signIn(context, OUTSIDER)

  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByText(copy.login.line)).toBeVisible()

  await context.close()
})

test('a signed out visitor is sent to the login screen', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('/?p=P001')
  await expect(page).toHaveURL(/\/login/)
  await context.close()
})

test('a student lands on the grid with all 212 problems', async ({ browser }) => {
  const context = await browser.newContext()
  await signIn(context, STUDENT_A)
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('[data-card-id]')).toHaveCount(212)
  await context.close()
})
