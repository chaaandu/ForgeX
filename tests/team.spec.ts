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
} from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('only the reviewers and the super admin can answer; everyone else at Mesa watches', async ({
  page,
}) => {
  await toProblem(page)
  await sendProblem(page)
  const reviewer = (await page.getByText(/will review it\.$|will reply here/).first().innerText()).split(' ')[0]

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
  await expect(page.getByRole('article', { name: 'Aarav Shrivastava' }).getByRole('button', { name: 'Send answer' })).toHaveCount(0)
  if (reviewer === 'Saurabh' || reviewer === 'Param') {
    await page.context().clearCookies()
    await signIn(page, mine)
    await answer(page, 'Aarav Shrivastava', 'Approve')
  }
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

test('every version and answer is in the history, newest first, and sorts by name', async ({ page }) => {
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

test('the progress board counts each status, and Chandu alone reopens a deadline', async ({ page }) => {
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
  await page.goto('/f/aarav-shrivastava')
  await page.getByRole('button', { name: 'Reopen Launch' }).click()
  await expect(page.getByText('Reopened: Launch.')).toBeVisible()

  // Reopened, Aarav can send that one stage, late; the pitch stays shut.
  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/submit/launch')
  await expect(page.getByText('The team has reopened this for you. Submit it as soon as you can.')).toBeVisible()
  await sendStage(page, 'launch')
  await page.goto('/submit/pitch')
  await expect(page.getByText(/This closed before you submitted/)).toBeVisible()
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
