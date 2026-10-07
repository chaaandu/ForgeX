import { expect, test } from '@playwright/test'
import {
  AARAV,
  AADISHWAR,
  DIYA,
  reset,
  signIn,
  throughArchetype,
  throughProfile,
  throughWorld,
  WHY,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('a founder placed in Hackathon 1 keeps their archetype and walks to a sent why', async ({
  page,
}) => {
  await signIn(page, AARAV)
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter' }).click()
  await page.waitForURL('**/arrive', { waitUntil: 'commit' })
  await expect(page.getByRole('heading', { name: 'Hi, Aarav.' })).toBeVisible()

  await page.getByRole('link', { name: 'Find my archetype' }).click()
  await expect(page.getByText(/Hackathon 1 placed you as a Cartographer/)).toBeVisible()
  await page.getByRole('button', { name: "That's me" }).click()
  await page.waitForURL('**/profile')
  await expect(page.getByRole('heading', { name: /This is you so far/ })).toBeVisible()

  await throughProfile(page)
  await throughWorld(page)

  const cards = page
    .getByRole('list', { name: '4 problems picked for you.' })
    .locator(':scope > li')
  await expect(cards).toHaveCount(4)
  await expect(page.getByText('None of these? Write your own.')).toBeVisible()
  // Nothing on a founder's card ranks it: no difficulty, no signal, no chips.
  await expect(page.getByRole('list', { name: 'Why this fits you' })).toHaveCount(0)
  expect(await page.content()).not.toContain('"difficulty"')

  await cards.first().getByRole('button').click()
  await page.getByRole('button', { name: "I'll build this" }).click()
  await page.waitForURL('**/why?p=*')
  await expect(
    page.getByRole('heading', { name: /Tell us why you want to build this/ }),
  ).toBeVisible()

  await page
    .getByLabel('Why this problem?')
    .fill('I will build an app that tracks stock for small shops in my area')
  await expect(page.getByText("That's a solution. What's broken before it exists?")).toBeVisible()
  await page.getByLabel('Why this problem?').fill(WHY.whyProblem)
  await page.getByLabel('Who would use what you build, and why?').fill(WHY.whyUser)
  await page.getByLabel('Why would they pay for it, or how would it make money?').fill(WHY.whyPay)
  await page.getByRole('button', { name: 'Send my why' }).click()
  await expect(page.getByRole('heading', { name: 'Sent.' })).toBeVisible()

  await page.getByRole('link', { name: 'See my profile' }).click()
  await page.waitForURL('**/f/aarav-shrivastava')
  await expect(page.getByText("You'll see our response here.")).toBeVisible()
})

test('a founder without an archetype sits the quiz, and the server decides the result', async ({
  page,
}) => {
  await signIn(page, DIYA)
  await throughArchetype(page, true)
  await expect(page).toHaveURL(/\/profile$/)
  // One retake is offered after the first placement.
  await page.goto('/archetype')
  await expect(page.getByRole('link', { name: 'Retake the quiz' })).toBeVisible()
})

test('an autonomous founder gets no matches, only their own problem', async ({ page }) => {
  await signIn(page, AADISHWAR)
  await throughArchetype(page, false)
  await throughProfile(page)
  await throughWorld(page, '**/matches/new')
  await expect(page.getByRole('heading', { name: 'What problem will you solve?' })).toBeVisible()
  await page.goto('/matches')
  await page.waitForURL('**/matches/new')
})

test('levels cannot be skipped', async ({ page }) => {
  await signIn(page, DIYA)
  await page.goto('/matches')
  await page.waitForURL('**/arrive')
})

test('a founder can write their own problem and send a why for it', async ({ page }) => {
  await signIn(page, AARAV)
  await throughArchetype(page, false)
  await throughProfile(page)
  await throughWorld(page)
  await page.getByRole('link', { name: /None of these\? Write your own/ }).click()
  await page.getByLabel('Title').fill('Weekend markets lose half their regulars')
  await page
    .getByLabel('The problem')
    .fill(
      'Stall owners at weekend markets cannot tell their regulars when or where they will be next, so footfall depends on luck and weather.',
    )
  await page.getByLabel('The challenge').fill('Help a stall keep its regulars between markets.')
  await page.getByRole('radio', { name: 'Retail and local shops' }).click()
  await page.getByRole('button', { name: 'Next: your why' }).click()
  await page.getByLabel('Why this problem?').fill(WHY.whyProblem)
  await page.getByLabel('Who would use what you build, and why?').fill(WHY.whyUser)
  await page.getByLabel('Why would they pay for it, or how would it make money?').fill(WHY.whyPay)
  await page.getByRole('button', { name: 'Send my why' }).click()
  await expect(page.getByRole('heading', { name: 'Sent.' })).toBeVisible()
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
