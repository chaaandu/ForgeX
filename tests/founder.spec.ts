import { expect, test } from '@playwright/test'
import {
  AADISHWAR,
  AARAV,
  DIYA,
  RESEARCH,
  reset,
  signIn,
  throughArchetype,
  throughChallenge,
  throughProfile,
  toToday,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('a founder placed in Hackathon 1 walks from arriving to their first day', async ({ page }) => {
  await signIn(page, AARAV)
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter' }).click()
  await page.waitForURL('**/arrive', { waitUntil: 'commit' })
  await expect(page.getByRole('heading', { name: 'Hi, Aarav.' })).toBeVisible()
  await page.getByRole('link', { name: 'Find my archetype' }).click()
  await expect(page.getByText(/Hackathon 1 placed you as a Cartographer/)).toBeVisible()
  await page.getByRole('button', { name: "That's me" }).click()
  await page.waitForURL('**/profile')
  await throughProfile(page)
  await throughChallenge(page)

  // The 3 weeks are open, but the build days wait for the research.
  await expect(page.getByRole('heading', { name: 'Day 6 of 22' })).toBeVisible()
  await page.getByRole('checkbox', { name: 'Mark done: Go live on Vercel' }).click()
  await expect(page.getByText('Opens when you send your research.').first()).toBeVisible()
  await expect(page.getByText('Your build days open when you send your research.')).toBeVisible()
  // A circle that can't be ticked by hand opens its step and says why.
  await page.getByRole('checkbox', { name: /Get your mentor/ }).click()
  await expect(page.getByText('This ticks itself when you send your research.')).toBeVisible()
  await page.getByRole('link', { name: /Your build days open/ }).click()
  await page.waitForURL('**/research')

  // Research can't be sent half done, and saving a draft keeps it.
  await expect(page.getByRole('button', { name: 'Send my research' })).toBeDisabled()
  await page.getByLabel('Who exactly are you building for?').fill(RESEARCH.forWho)
  await page.getByRole('button', { name: 'Save for later' }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Who exactly are you building for?')).toHaveValue(RESEARCH.forWho)
})

test('a founder cannot leave the profile without GitHub and LinkedIn', async ({ page }) => {
  await signIn(page, AARAV)
  await throughArchetype(page, false)
  await page.getByRole('button', { name: 'Add one line about you' }).click()
  await page.keyboard.type('I run the counter at my family shop on weekends.')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Saved')).toBeVisible()
  await expect(page.getByText('(required)')).toHaveCount(2)
  await page.getByRole('button', { name: 'Looks like me' }).click()
  await expect(page.getByText('Add your GitHub and LinkedIn to carry on.')).toBeVisible()
  await expect(page).toHaveURL(/\/profile$/)
})

test('a founder without an archetype sits the quiz, and the server decides the result', async ({
  page,
}) => {
  await signIn(page, DIYA)
  await throughArchetype(page, true)
  await expect(page).toHaveURL(/\/profile$/)
  await page.goto('/archetype')
  await expect(page.getByRole('link', { name: 'Retake the quiz' })).toBeVisible()
})

test('levels cannot be skipped', async ({ page }) => {
  await signIn(page, DIYA)
  for (const path of ['/challenge', '/start', '/research', '/today', '/plan', '/phases/1']) {
    await page.goto(path)
    // Visiting /arrive numbers them, so the furthest they can be is the archetype.
    await expect(page).toHaveURL(/\/(arrive|archetype)$/)
  }
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

/**
 * One smoke test per track, on a 390px phone, on 14 Oct (day 6). Each founder
 * sends research, ticks a step, and sends stop 1 with their own track's
 * fields. None of them ever reads a track's name.
 */
const TRACK_RUNS = [
  {
    name: 'guided',
    who: AARAV,
    quiz: false,
    today: 'Go live on Vercel',
    fill: async (page: import('@playwright/test').Page) => {
      await page
        .getByLabel('Which screen did you build first, and why that one?')
        .fill('The order list, because orders get lost first.')
    },
  },
  {
    name: 'structured',
    who: DIYA,
    quiz: true,
    today: 'Go live on Vercel',
    fill: async (page: import('@playwright/test').Page) => {
      await page.getByLabel('How many of your 10 real cases work?').fill('8')
    },
  },
  {
    name: 'autonomous',
    who: AADISHWAR,
    quiz: false,
    today: 'AI does its one job on real input',
    fill: async (page: import('@playwright/test').Page) => {
      await page
        .getByLabel('Your architecture note')
        .fill('github.com/aadishwar/orders/blob/main/ARCHITECTURE.md')
      await page
        .getByLabel('Your 2 stretch features, and why')
        .fill(
          '1. A reorder nudge: owners lose regulars at month end. 2. Hindi voice: owners asked for it.',
        )
    },
  },
] as const

for (const run of TRACK_RUNS) {
  test(`a ${run.name} founder builds from Today and sends stop 1 @phone`, async ({ page }) => {
    await signIn(page, run.who)
    await toToday(page, run.quiz)
    await expect(page.getByRole('heading', { name: 'Day 6 of 22' })).toBeVisible()
    await expect(page.getByText('Phase 1 due')).toBeVisible()
    await expect(page.getByRole('button', { name: `Show more: ${run.today}` })).toBeVisible()

    const tick = page.getByRole('checkbox', { name: 'Mark done: Sketch every screen' })
    await tick.click()
    await expect(
      page.getByRole('checkbox', { name: 'Mark not done: Sketch every screen' }),
    ).toHaveAttribute('aria-checked', 'true')

    // A step that asks for a link won't tick without one.
    const repoStep = page.getByRole('checkbox', {
      name: /^Mark done: (Make your own copy of the starter|Create your repo|Repo, database and tables)$/,
    })
    await repoStep.click()
    await expect(page.getByText('Add this first, then tick it.')).toBeVisible()

    // Phases go in order: phase 2 waits for phase 1.
    await page.goto('/phases/2')
    await expect(page.getByText('Send phase 1 first. This one opens after it.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send phase 2' })).toHaveCount(0)

    await page.goto('/phases/1')
    await expect(page.getByRole('heading', { name: 'Phase 1 · MVP version 1' })).toBeVisible()
    await page.getByLabel('Your repo').fill('github.com/founder/orders')
    await page.getByLabel('Your live link').fill('orders-demo.vercel.app')
    await page.getByLabel('Your website: the problem and your solution').fill('kirana-keep.in')
    await page
      .getByLabel('What makes your solution different?')
      .fill('Most will build delivery. Mine keeps the khata the regulars already trust.')
    await run.fill(page)
    await page.getByRole('button', { name: 'Send phase 1' }).click()
    await expect(page.getByText('Sent. The team will review it.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send changes' })).toBeVisible()

    const text = (await page.content()).toLowerCase()
    for (const word of ['guided', 'structured', 'autonomous', 'level 1', 'level 2', 'level 3'])
      expect(text.includes(word), word).toBe(false)
  })
}
