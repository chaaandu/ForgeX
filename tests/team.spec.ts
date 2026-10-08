import { expect, test, type Page } from '@playwright/test'
import { AADISHWAR, AARAV, DIYA, RESEARCH, reset, signIn, TEAM, toToday } from './helpers'

/** Aarav sends research and stop 1, then signs out. */
async function aaravSendsStop1(page: Page) {
  await signIn(page, AARAV)
  await toToday(page)
  await page.goto('/phases/1')
  await page.getByLabel('Your repo').fill('github.com/aarav/cake-orders')
  await page.getByLabel('Your live link').fill('cake-orders.vercel.app')
  await page.getByLabel('Your website: the problem and your solution').fill('kirana-keep.in')
  await page.getByLabel('What makes your solution different?').fill('It starts from the regulars.')
  await page
    .getByLabel('Which screen did you build first, and why that one?')
    .fill('The order list, because orders get lost first.')
  await page.getByRole('button', { name: 'Send phase 1' }).click()
  await expect(page.getByText('Sent. The team will review it.')).toBeVisible()
  await page.context().clearCookies()
}

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('the team rates a stop amber with fixes, and the founder sees them on Today', async ({
  page,
}) => {
  await aaravSendsStop1(page)
  await signIn(page, TEAM)
  await expect(page.goto('/team/phases/1?rating=unrated')).resolves.toBeTruthy()
  await expect(page.getByRole('link', { name: 'To review 1' })).toBeVisible()
  await page.goto('/team/phases/1')
  const row = page.locator('details', { hasText: 'Aarav Shrivastava' })
  await row.locator('summary').click()
  await expect(row.getByText('github.com/aarav/cake-orders')).toBeVisible()
  await row.getByRole('radio', { name: 'Amber' }).click()
  await row.getByLabel('Notes to the founder').fill('Good start. Fix sign-in first.')
  await row.getByLabel('Fix list').fill('Sign-in fails on the live link\nAdd a second screen')
  await row.getByRole('button', { name: 'Save review' }).click()
  await expect(row.locator('summary').getByText('Amber')).toBeVisible()

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/phases/1')
  await expect(page.getByText('A few fixes')).toBeVisible()
  await expect(page.getByText('Good start. Fix sign-in first.')).toBeVisible()
  await page.goto('/today')
  const fixes = page.getByRole('list', { name: 'Fixes from the team' })
  await expect(fixes.getByText('Sign-in fails on the live link')).toBeVisible()
  await fixes.getByRole('checkbox', { name: 'Mark done: Sign-in fails on the live link' }).click()
  await expect(
    fixes.getByRole('checkbox', { name: 'Mark not done: Sign-in fails on the live link' }),
  ).toBeVisible()
})

test('the cohort sees a building founder, without ratings or the team block', async ({ page }) => {
  // Before research, nobody else can open the page.
  await signIn(page, DIYA)
  expect((await page.goto('/f/aarav-shrivastava'))?.status()).toBe(404)
  await page.context().clearCookies()

  await aaravSendsStop1(page)
  await page.goto('/')
  const building = page.getByRole('region', { name: "What they're building" })
  await expect(building.getByText(RESEARCH.forWho)).toBeVisible()

  await signIn(page, DIYA)
  await page.goto('/f/aarav-shrivastava')
  await expect(page.getByRole('heading', { name: 'Aarav Shrivastava' })).toBeVisible()
  await expect(page.getByText(RESEARCH.forWho)).toBeVisible()
  await expect(page.getByText('Team only')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Sign out|^Account:/ })).toHaveCount(0)
})

test('the team seats a pod and a mentor, and the mentor sees their pod', async ({ page }) => {
  await signIn(page, TEAM)
  await page.goto('/team/pods')
  await page.getByLabel('Pod for Aarav Shrivastava').selectOption('3')
  await expect(
    page.getByRole('region', { name: 'Pod 3' }).getByText('Aarav Shrivastava'),
  ).toBeVisible()
  await page.getByLabel('Add a mentor to pod 3').selectOption({ label: 'Aadishwar R' })
  await expect(page.getByRole('region', { name: 'Pod 3' }).getByText('Aadishwar R')).toBeVisible()
  await page.context().clearCookies()

  await signIn(page, AADISHWAR)
  await toToday(page)
  await page.getByRole('link', { name: 'Pod', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Pod 3' })).toBeVisible()
  await expect(page.getByText('Aarav Shrivastava')).toBeVisible()
})

test('the console lists every founder with track, steps and stops', async ({ page }) => {
  await signIn(page, TEAM)
  await page.goto('/team')
  await expect(page.getByRole('heading', { name: /Founders/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /^Guided/ })).toBeVisible()
  await page.getByRole('button', { name: /^Autonomous/ }).click()
  await expect(page.getByText('Aadishwar R')).toBeVisible()
  await expect(page.getByText('Aarav Shrivastava')).toHaveCount(0)
  expect((await page.goto('/team/bank'))?.status()).toBe(404)
})
