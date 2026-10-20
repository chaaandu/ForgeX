import { expect, test } from '@playwright/test'
import {
  AARAV,
  answer,
  approved,
  CHANDU,
  DIYA,
  fillProblem,
  OWN,
  pickFromBank,
  problems,
  reset,
  sendProblem,
  sendStage,
  setClock,
  signIn,
  throughArchetype,
  throughWorld,
  toProblem,
  WHEN,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('a founder sends their problem, is told why it was rejected, sends it again and builds', async ({
  page,
}) => {
  await toProblem(page)
  await expect(page.getByRole('heading', { name: 'Your problem' })).toBeVisible()
  await expect(page.getByText(/frame the 3Ps or research them\? Mihirr's session recording on Nexus/)).toBeVisible()

  // Nothing goes until every field is in.
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByText('This one is required.').first()).toBeVisible()
  await sendProblem(page)

  // Waiting: the stages stay shut, and the home says what is pending.
  await page.goto('/build')
  await expect(page.getByText('In review').first()).toBeVisible()
  await expect(page.getByText('Opens once your problem is approved').first()).toBeVisible()
  await expect(page.getByRole('img', { name: /^10% done/ }).first()).toBeAttached()
  await page.goto('/submit/prototype')
  await page.waitForURL('**/build')

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Reject', 'Talk to 5 stall owners first.')

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/problem')
  await expect(page.getByRole('heading', { name: 'Not approved yet.' })).toBeVisible()
  await expect(page.getByText('Talk to 5 stall owners first.')).toBeVisible()
  // Rejected inside the window, the form is already open.
  await sendProblem(page, { title: 'Sunday markets lose their regulars' }, true)

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Approve with changes', 'Start with one market.')

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/build')
  await expect(page.getByRole('img', { name: /^20% done/ }).first()).toBeAttached()
  await sendStage(page, 'scope')
  await sendStage(page, 'prototype')
  await sendStage(page, 'launch')
  await sendStage(page, 'pitch')
  await page.goto('/build')
  await expect(page.getByText('All 5 steps are in. Well done.')).toBeVisible()
  await expect(page.getByRole('img', { name: /^100% done/ }).first()).toBeAttached()
})

test('primary research is optional, and secondary research is required', async ({ page }) => {
  await toProblem(page)
  await fillProblem(page, { ...OWN, primary: '', secondary: '' })
  await expect(page.getByText('(optional)')).toBeVisible()
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByLabel(/^Secondary research/)).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel(/^Primary research/)).not.toHaveAttribute('aria-invalid', 'true')
  await page.getByLabel(/^Secondary research/).fill(OWN.secondary)
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'In review.' })).toBeVisible()
})

test('a problem in review can still be changed and sent again', async ({ page }) => {
  await toProblem(page)
  await sendProblem(page)
  await page.getByRole('button', { name: 'Edit and send again' }).click()
  await expect(page.getByLabel(/^Title of your problem/)).toHaveValue(OWN.title)
  await sendProblem(page, { title: 'Sunday markets lose their regulars' }, true)
  await expect(page.getByText('Sunday markets lose their regulars').first()).toBeVisible()
  await expect(page.getByText('Version 2').first()).toBeVisible()
})

test('an industry outside our list is named in their own words', async ({ page }) => {
  await toProblem(page)
  await fillProblem(page)
  await page.getByRole('radio', { name: 'Other' }).click()
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByLabel(/^Which industry is it\?/)).toHaveAttribute('aria-invalid', 'true')
  await page.getByLabel(/^Which industry is it\?/).fill('Sports')
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'In review.' })).toBeVisible()
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await page.goto('/team/reviews')
  await expect(page.getByRole('article', { name: 'Aarav Shrivastava' }).getByText('Sports', { exact: true })).toBeVisible()
})

test('each written field shows its word count, and nothing goes over the limit', async ({ page }) => {
  await toProblem(page)
  await fillProblem(page)
  await expect(page.getByText(`${OWN.person.split(' ').length} / 40 words`)).toBeVisible()
  // Spaces and blank lines never count, only words.
  await page.getByLabel(/^Promise: what changes/).fill('  Their   regulars\n\n find them.  ')
  await expect(page.getByText('4 / 40 words')).toBeVisible()
  await page.getByLabel(/^Your plan/).fill(Array.from({ length: 101 }, () => 'word').join(' '))
  await expect(page.getByText('101 / 100 words')).toBeVisible()
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByText('Keep it to 100 words.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your problem' })).toBeVisible()
  // Trimming it back clears the message, and it sends.
  await page.getByLabel(/^Your plan/).fill(OWN.plan)
  await expect(page.getByText('Keep it to 100 words.')).toHaveCount(0)
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'In review.' })).toBeVisible()
})

test('a name of 10 words or more is refused before it is sent', async ({ page }) => {
  await toProblem(page)
  await fillProblem(page, { ...OWN, title: 'one two three four five six seven eight nine ten' })
  await page.getByRole('button', { name: 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'Your problem' })).toBeVisible()
  await expect(page.getByLabel(/^Title of your problem/)).toHaveAttribute('aria-invalid', 'true')
})

test('a founder without an archetype sits the quiz, and the server decides the result', async ({
  page,
}) => {
  await signIn(page, DIYA)
  // No archetype yet, so her card keeps the question mark until she takes the test.
  await page.goto('/arrive')
  await expect(page.getByText('Archetype to come').first()).toBeVisible()
  await throughArchetype(page, true)
  await expect(page).toHaveURL(/\/profile$/)
  // One retake is offered after the first placement.
  await page.goto('/archetype')
  await expect(page.getByRole('link', { name: 'Retake the test' })).toBeVisible()
})

test('a founder placed in Hackathon 1 sees their archetype from the first step', async ({ page }) => {
  await signIn(page, AARAV)
  await page.goto('/arrive')
  await expect(page.getByText(/^#\d{3} \/ 117$/).first()).toBeVisible()
  await expect(page.getByText('Archetype to come')).toHaveCount(0)
})

test('steps cannot be skipped', async ({ page }) => {
  await signIn(page, DIYA)
  // Landing on Arrive counts as arriving, so after the first try the way back is the next step.
  for (const path of ['/problem', '/matches', '/build', '/submit/prototype']) {
    await page.goto(path)
    await page.waitForURL(/\/(arrive|archetype)$/)
  }
})

test('before the announcement the portal is shut, and opens by itself', async ({ page }) => {
  await setClock(page, WHEN.beforeOpen)
  await signIn(page, AARAV)
  for (const path of ['/arrive', '/problem', '/build', '/submit/prototype']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: 'Not open yet.' })).toBeVisible()
    // The day, and no hour.
    await expect(page.getByText(/^ForgeX opens on 15 Oct\.$/)).toBeVisible()
  }
  // Nobody was numbered, and nothing was written: the first to arrive after it opens is #001.
  await setClock(page, '2026-10-15T00:00:00+05:30')
  await page.goto('/arrive')
  await expect(page.getByText('#001 / 117').first()).toBeVisible()
})

test('the bank stays shut while the problem window is open', async ({ page }) => {
  await toProblem(page)
  await page.goto('/matches')
  await page.waitForURL(/\/(build|problem)$/)
})

test('after 20 Oct nobody can send a problem; a pending one is still answered', async ({ page }) => {
  await toProblem(page)
  await sendProblem(page)
  await setClock(page, WHEN.shut)
  await page.goto('/problem')
  await expect(page.getByRole('button', { name: 'Edit and send again' })).toHaveCount(0)

  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Approve')
  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/submit/prototype')
  await expect(page.getByRole('button', { name: 'Submit my prototype' })).toBeVisible()
})

test('rejected after the window, a founder picks from the bank, adds research, and that is final', async ({
  page,
}) => {
  await toProblem(page)
  await sendProblem(page)
  await setClock(page, WHEN.bank)
  // Still in review once the bank opens: they wait, with no way into the bank.
  await page.goto('/problem')
  await expect(page.getByRole('heading', { name: 'In review.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Pick from the bank' })).toHaveCount(0)
  await page.goto('/build')
  await expect(page.getByRole('link', { name: 'Pick from the bank' })).toHaveCount(0)
  for (const path of ['/world', '/matches']) {
    await page.goto(path)
    await page.waitForURL('**/build')
  }
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Reject', 'Too broad.')

  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/problem')
  await expect(page.getByRole('heading', { name: 'Not approved.' })).toBeVisible()
  const title = await pickFromBank(page)
  await expect(page.getByText(title).first()).toBeVisible()

  // No own idea from the bank, and no way back to it.
  await expect(page.getByRole('link', { name: /own idea/i })).toHaveCount(0)
  await page.goto('/matches')
  await page.waitForURL('**/build')

  // A bank pick still shows the research behind it.
  await page.getByLabel(/^Primary research/).fill('drive.google.com/drive/folders/interviews')
  await page.getByLabel(/^Secondary research/).fill('docs.google.com/document/d/reading')
  await page.getByRole('button', { name: 'Save my research' }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
})

test('a founder who sent nothing is sent to the bank once it opens', async ({ page }) => {
  await toProblem(page)
  await setClock(page, WHEN.shut)
  await page.goto('/problem')
  await expect(page.getByRole('heading', { name: 'The window has closed.' })).toBeVisible()
  await expect(page.getByText(/The bank opens on/)).toBeVisible()
  await setClock(page, WHEN.bank)
  await page.goto('/build')
  await page.getByRole('link', { name: 'Pick from the bank' }).first().click()
  await page.waitForURL('**/world')
})

test('Show 4 others gives 2 more sets, never repeats a problem, and then stops', async ({
  page,
}) => {
  await toProblem(page)
  await setClock(page, WHEN.bank)
  await page.goto('/world')
  await throughWorld(page)
  const titles = async () =>
    (await problems(page).getByRole('heading').allInnerTexts()).map((title) =>
      title.replace(/\s+/g, ' ').trim(),
    )
  const first = await titles()
  expect(first).toHaveLength(4)
  await page.getByRole('link', { name: 'Show 4 others' }).click()
  await page.waitForURL('**/matches?set=2')
  const second = await titles()
  await page.getByRole('link', { name: 'Show 4 others' }).click()
  await page.waitForURL('**/matches?set=3')
  const third = await titles()
  expect(new Set([...first, ...second, ...third]).size).toBe(12)
  await expect(page.getByRole('link', { name: 'Show 4 others' })).toHaveCount(0)
})

test('each stage locks at its hour; what was sent stays, what was not is missed', async ({ page }) => {
  await approved(page)
  await sendStage(page, 'prototype')
  await setClock(page, WHEN.afterPrototype)
  await page.goto('/submit/prototype')
  await expect(page.getByText('This step is closed. What you submitted is what we have.')).toBeVisible()
  await expect(page.getByRole('button', { name: /Submit|Save changes/ })).toHaveCount(0)
  // The launch is still open.
  await sendStage(page, 'launch')

  await setClock(page, WHEN.over)
  await page.goto('/submit/pitch')
  await expect(page.getByText(/This closed before you submitted. Talk to Pragati/)).toBeVisible()
  await expect(page.getByRole('textbox')).toHaveCount(0)
  await page.goto('/build')
  // Prototype and launch, without the MVP scope: 20 + 25 + 25.
  await expect(page.getByRole('img', { name: /^70% done/ }).first()).toBeAttached()
})

test('the MVP scope is still taken after its date, because it never locks', async ({ page }) => {
  await approved(page)
  await setClock(page, '2026-10-22T09:00:00+05:30')
  await page.goto('/submit/scope')
  await expect(page.getByText(/^It saves as you go\. Add it by 21 Oct/)).toBeVisible()
  await sendStage(page, 'scope')
  await expect(page.getByText('We have it. You can still change it.')).toBeVisible()
})

test('a submitted stage can be changed before its hour, but a required link cannot be emptied', async ({
  page,
}) => {
  await approved(page)
  await sendStage(page, 'prototype')
  await page.getByRole('button', { name: 'Change something' }).click()
  await page.getByLabel(/^GitHub repo/).fill('')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('This one is required.')).toBeVisible()
})

test('the whole way works on a phone @phone', async ({ page }) => {
  const fits = async () =>
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  await toProblem(page)
  await fits()
  await sendProblem(page)
  await fits()
  await page.goto('/build')
  await fits()
})

test('the landing works on a phone @phone', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Start with a problem/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Enter' })).toBeInViewport()
  const face = page
    .getByRole('list', { name: /founders of ForgeX/ })
    .getByRole('button')
    .first()
  await face.tap()
  await expect(face).toHaveAttribute('aria-pressed', 'true')
})
