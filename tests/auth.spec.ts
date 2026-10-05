import { expect, test } from '@playwright/test'
import { copy } from '../lib/copy'
import { LOOKALIKE, OUTSIDER, signIn, STUDENT_A } from './helpers'

test('an address outside the Mesa domains gets the refused screen', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('/login')
  await page.locator(`[data-mock-signin="${OUTSIDER}"]`).click()

  await expect(page).toHaveURL(/error=domain/)
  await expect(page.getByText(copy.refused.line)).toBeVisible()
  await expect(page.getByRole('button', { name: copy.refused.button })).toBeVisible()

  // Nothing was signed in, so the grid is still out of reach.
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)

  await context.close()
})

test('a domain that merely looks like Mesa is refused too', async ({ browser }) => {
  const context = await browser.newContext()
  await signIn(context, LOOKALIKE)

  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)

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
