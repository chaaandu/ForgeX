import { expect, test, type Page } from '@playwright/test'
import { AARAV, reset, signIn, TEAM, throughArchetype, throughProfile, throughWorld, WHY } from './helpers'

async function sendWhy(page: Page) {
  await signIn(page, AARAV)
  await throughArchetype(page, false)
  await throughProfile(page)
  await throughWorld(page)
  await page.getByRole('list', { name: '4 problems picked for you.' }).getByRole('button').first().click()
  await page.getByRole('button', { name: "I'll build this" }).click()
  await page.getByLabel('Why this problem?').fill(WHY.whyProblem)
  await page.getByLabel('Who would use what you build, and why?').fill(WHY.whyUser)
  await page.getByLabel('Why would they pay for it, or how would it make money?').fill(WHY.whyPay)
  await page.getByRole('button', { name: 'Send my why' }).click()
  await expect(page.getByRole('heading', { name: 'Sent.' })).toBeVisible()
  await page.context().clearCookies()
}

test.beforeEach(async ({ page }) => {
  await reset(page)
})

for (const [key, label, stamp] of [
  ['g', 'Go', 'Go'],
  ['w', 'Go, with a tweak', 'Go, with a tweak'],
  ['l', "Let's talk", "Let's talk"],
] as const) {
  test(`the team answers ${label} from the keyboard and the founder sees it`, async ({ page }) => {
    await sendWhy(page)
    await signIn(page, TEAM)
    await page.goto('/team/queue')
    await expect(page.getByRole('heading', { name: 'Aarav Shrivastava' })).toBeVisible()
    await page.keyboard.press(key)
    await page.keyboard.press('n')
    await page.keyboard.type('Talk to three shop owners before you build anything.')
    await page.keyboard.press('Meta+Enter')
    await expect(page.getByText('No one is waiting. Every why has a reply.')).toBeVisible()

    await page.context().clearCookies()
    await signIn(page, AARAV)
    await page.goto('/f/aarav-shrivastava')
    await expect(page.getByText(stamp, { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Talk to three shop owners before you build anything.').first()).toBeVisible()
  })
}

test('Try another sends the founder back to fresh matches with suggestions first', async ({ page }) => {
  await sendWhy(page)
  await signIn(page, TEAM)
  await page.goto('/team/queue')
  await page.keyboard.press('a')
  await page.getByPlaceholder('kirana').fill('a')
  await page.getByRole('list', { name: 'Matching problems' }).getByRole('button').first().click()
  await page.getByPlaceholder('kirana').press('Meta+Enter')
  await expect(page.getByText('No one is waiting. Every why has a reply.')).toBeVisible()

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/f/aarav-shrivastava')
  await page.getByRole('link', { name: 'Back to matches' }).click()
  await expect(page.getByText('The team suggested this').first()).toBeVisible()
})

test('a tweak without a note is held back', async ({ page }) => {
  await sendWhy(page)
  await signIn(page, TEAM)
  await page.goto('/team/queue')
  await page.keyboard.press('w')
  await page.getByRole('button', { name: /^Send/ }).click()
  await expect(page.getByRole('status')).toHaveText('A tweak needs a note.')
})

test('the bank approves and the founders table exports', async ({ page }) => {
  await signIn(page, TEAM)
  await page.goto('/team/bank')
  await page.getByRole('button', { name: /^Approved/ }).click()
  await page.keyboard.press('r')
  await page.getByRole('button', { name: /^Rejected/ }).click()
  await expect(page.getByText('Rejected', { exact: true }).first()).toBeVisible()
  await page.goto('/team')
  await expect(page.getByRole('table')).toBeVisible()
  const csv = await page.request.get('/api/team/export.csv')
  expect(csv.headers()['content-type']).toContain('text/csv')
  expect((await csv.text()).split('\n')).toHaveLength(118)
})
