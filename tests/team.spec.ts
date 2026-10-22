import { expect, test } from '@playwright/test'
import {
  AARAV,
  answer,
  approved,
  CHANDU,
  DIYA,
  PARAM,
  reset,
  SAURABH,
  sendProblem,
  sendStage,
  setClock,
  signIn,
  TEAM,
  toProblem,
  WHEN,
  fillProblem,
  pickFromBank,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('only the reviewers and the super admin can answer; everyone else at Mesa watches', async ({
  page,
}) => {
  await toProblem(page)
  await sendProblem(page)
  const reviewer = (
    await page
      .getByText(/will review it\.$|will reply here/)
      .first()
      .innerText()
  ).split(' ')[0]

  await page.context().clearCookies()
  await signIn(page, TEAM)
  await page.goto('/team/reviews')
  const item = page.getByRole('article', { name: 'Aarav Shrivastava' })
  await expect(item).toBeVisible()
  await expect(item.getByRole('button', { name: 'Send answer' })).toHaveCount(0)
  await expect(item.getByText('Only the reviewers and the super admin can answer.')).toBeVisible()

  // A reviewer answers only their own group; the other may read it.
  const [mine, theirs] = reviewer === 'Param' ? [PARAM, SAURABH] : [SAURABH, PARAM]
  await page.context().clearCookies()
  await signIn(page, theirs)
  await page.goto('/team/reviews?scope=all')
  await expect(
    page
      .getByRole('article', { name: 'Aarav Shrivastava' })
      .getByRole('button', { name: 'Send answer' }),
  ).toHaveCount(0)
  if (reviewer === 'Saurabh' || reviewer === 'Param') {
    await page.context().clearCookies()
    await signIn(page, mine)
    await answer(page, 'Aarav Shrivastava', 'Approve')
  }
})

test('a POC opens on the students they look after, and a reviewer on theirs', async ({ page }) => {
  await signIn(page, 'akshita@mesaschool.co')
  await page.goto('/team')
  await expect(page.getByRole('combobox', { name: 'POC' })).toHaveValue('Akshita')
  await expect(page.getByText('of 15', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Reviewer' })).toHaveValue('')

  await page.context().clearCookies()
  await signIn(page, SAURABH)
  await page.goto('/team')
  await expect(page.getByRole('combobox', { name: 'Reviewer' })).toHaveValue('Saurabh')
  await expect(page.getByRole('combobox', { name: 'POC' })).toHaveValue('')

  // The super admin sees everyone, though he looks after a group too.
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team')
  await expect(page.getByRole('combobox', { name: 'POC' })).toHaveValue('')
  await expect(page.getByText('of 117', { exact: true }).first()).toBeVisible()
})

test('approve with changes and reject both need a note', async ({ page }) => {
  await toProblem(page)
  await sendProblem(page)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team/reviews')
  const item = page.getByRole('article', { name: 'Aarav Shrivastava' })
  await item.getByRole('radio', { name: 'Reject', exact: true }).click()
  await item.getByRole('button', { name: 'Send answer' }).click()
  await expect(item.getByText('Add a note for this answer.')).toBeVisible()
})

test('every version and answer is in the history, newest first, and sorts by name', async ({
  page,
}) => {
  await toProblem(page)
  await sendProblem(page)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Reject', 'Too broad.')
  await page.goto('/team/history')
  const rows = page.getByRole('row')
  await expect(rows.nth(1)).toContainText('Rejected')
  await expect(rows.nth(2)).toContainText('Submitted')
  await expect(page.getByText('Too broad.')).toBeVisible()
})

test('the progress board counts each status, and a stage is never shut to reopen', async ({
  page,
}) => {
  await approved(page)
  await sendStage(page, 'prototype')
  await page.context().clearCookies()

  await signIn(page, SAURABH)
  await page.goto('/f/aarav-shrivastava')
  await expect(page.getByRole('button', { name: /^Reopen/ })).toHaveCount(0)

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team')
  await expect(page.getByRole('link', { name: /Aarav Shrivastava/ }).first()).toBeVisible()
  await setClock(page, WHEN.over)
  // Only the problem locks, so it is the only step there is to reopen.
  await page.goto('/f/aarav-shrivastava')
  await expect(page.getByRole('button', { name: 'Reopen Problem' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: /^Reopen (Prototype|Launch|Pitch|MVP)/ }),
  ).toHaveCount(0)

  // Long after every date, Aarav still submits the launch and the pitch.
  await page.context().clearCookies()
  await signIn(page, AARAV)
  await sendStage(page, 'launch')
  await sendStage(page, 'pitch')
})

test('a founder who is building shows on the landing with their progress, and the cohort sees only the live link and repo', async ({
  page,
}) => {
  await approved(page)
  await sendStage(page, 'prototype')
  await sendStage(page, 'launch')
  await page.context().clearCookies()

  await page.goto('/')
  const card = page.getByRole('link', { name: "Open Aarav Shrivastava's profile" })
  await expect(card).toContainText('Weekend markets lose their regulars')
  await expect(card.getByRole('img', { name: '70% done' })).toBeVisible()

  await signIn(page, DIYA)
  await page.goto('/f/aarav-shrivastava')
  await expect(page.getByRole('link', { name: 'market-day.vercel.app' }).first()).toBeVisible()
  await expect(page.getByText('Pitch deck')).toHaveCount(0)
  await expect(page.getByText('Team view only')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Reopen/ })).toHaveCount(0)
})

test('a founder with nothing approved has no page for the cohort', async ({ page }) => {
  await toProblem(page)
  await sendProblem(page)
  await page.context().clearCookies()
  await signIn(page, DIYA)
  expect((await page.goto('/f/aarav-shrivastava'))?.status()).toBe(404)
})

test('the demo cohort fills the console, and the export lists every founder', async ({ page }) => {
  await reset(page, true)
  await setClock(page, '2026-10-19T12:00:00+05:30')
  await signIn(page, CHANDU)
  await page.goto('/team/reviews')
  await expect(page.getByRole('article').first()).toBeVisible()
  const csv = await (await page.request.get('/api/team/export.csv')).text()
  expect(csv.trim().split('\n').length).toBeGreaterThanOrEqual(118)
})

test('the bank shows each 2-day version and level, only Chandu edits it, and the team signs out', async ({
  page,
}) => {
  for (const email of [TEAM, SAURABH]) {
    await page.context().clearCookies()
    await signIn(page, email)
    await page.goto('/team/bank')
    await page.getByRole('button', { name: /^Live/ }).click()
    await expect(page.getByRole('button', { name: 'Take down' })).toHaveCount(0)
  }

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team/bank')
  await page.getByRole('button', { name: /^Live/ }).click()
  for (const level of ['Easy', 'Medium', 'Hard']) {
    await page.getByRole('button', { name: new RegExp(`^${level}`) }).click()
    await expect(page.getByRole('list', { name: 'What we expect' })).toBeVisible()
  }
  await page.getByRole('button', { name: 'Take down' }).click()
  await page.getByRole('button', { name: /^Drafts 1/ }).click()
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeVisible()

  await page.getByRole('button', { name: /^Account:/ }).click()
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
})

test('a problem the super admin reopens for an approved founder is approved on arrival, in his name', async ({
  page,
}) => {
  await approved(page)
  await setClock(page, WHEN.bank)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/f/aarav-shrivastava')
  await page.getByRole('button', { name: 'Reopen Problem' }).click()
  await expect(page.getByText('Reopened: Problem.')).toBeVisible()

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/build')
  await expect(page.getByText(/^Reopened for you\./)).toBeVisible()
  await page.goto('/problem')
  await page.getByRole('button', { name: 'Edit and send again' }).click()
  await page.getByLabel(/^Title of your problem/).fill('Sunday markets lose their regulars')
  await page.getByRole('button', { name: 'Send it again' }).click()
  await expect(page.getByRole('heading', { name: 'Approved.' })).toBeVisible()
  await expect(page.getByText('Sunday markets lose their regulars').first()).toBeVisible()
  // The reopen closes with it: no second change.
  await expect(page.getByRole('button', { name: 'Edit and send again' })).toHaveCount(0)

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team/history')
  await expect(page.getByRole('row').nth(1)).toContainText('Approved')
  await expect(page.getByRole('row').nth(1)).toContainText('Chandu')
})

test('a bank pick the super admin reopens can be replaced by an own problem, approved on arrival', async ({
  page,
}) => {
  await toProblem(page)
  await setClock(page, WHEN.bank)
  await pickFromBank(page)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/f/aarav-shrivastava')
  await page.getByRole('button', { name: 'Reopen Problem' }).click()
  await expect(page.getByText('Reopened: Problem.')).toBeVisible()

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/build')
  await page.getByRole('link', { name: 'Write my problem' }).click()
  await page.waitForURL('**/problem')
  await fillProblem(page)
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'Approved.' })).toBeVisible()
  await page.goto('/build')
  await expect(page.getByText(/^Approved by Chandu\./)).toBeVisible()
})

test('a rejected problem the super admin reopens after the window is approved on arrival', async ({
  page,
}) => {
  await toProblem(page)
  await sendProblem(page)
  await setClock(page, WHEN.bank)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Reject', 'Too broad.')
  await page.goto('/f/aarav-shrivastava')
  await page.getByRole('button', { name: 'Reopen Problem' }).click()
  await expect(page.getByText('Reopened: Problem.')).toBeVisible()

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/build')
  await expect(page.getByText(/^Reopened for you\./)).toBeVisible()
  await page.goto('/problem')
  await page.getByLabel(/^Title of your problem/).fill('Sunday markets lose their regulars')
  await page.getByRole('button', { name: 'Send it again' }).click()
  await expect(page.getByRole('heading', { name: 'Approved.' })).toBeVisible()
})
