import { expect, type Page } from '@playwright/test'

export const AARAV = 'aarav_shrivastava@forge27.mesaschool.co' // placed in Hackathon 1
export const DIYA = 'diya_agrawal@forge27.mesaschool.co' // sits the quiz
export const CHANDU = 'chandu@mesaschool.co' // the super admin
export const SAURABH = 'saurabh@mesaschool.co' // a reviewer
export const PARAM = 'param@mesaschool.co' // a reviewer, by his mock email
export const TEAM = 'team@mesaschool.co' // anyone else at Mesa: watches, never acts

/** Moments of the event to stand on. The suite starts on 17 Oct, with the problem window open. */
export const WHEN = {
  beforeOpen: '2026-10-14T17:00:00+05:30',
  during: '2026-10-17T12:00:00+05:30',
  /** The problem window has shut, and the bank is not open yet. */
  shut: '2026-10-20T23:59:30+05:30',
  /** The window has shut; the extra time for new and rejected problems runs. */
  extra: '2026-10-21T10:00:00+05:30',
  bank: '2026-10-21T13:00:00+05:30',
  afterPrototype: '2026-10-22T13:05:00+05:30',
  over: '2026-10-23T13:05:00+05:30',
}

/** Puts the in-memory Sheet back to its seed and the clock back to 17 Oct. */
export async function reset(page: Page, demo = false) {
  const response = await page.request.post(`/api/mock/reset${demo ? '?demo=1' : ''}`)
  expect(response.ok()).toBeTruthy()
}

/** Moves the clock, keeping everything founders have done so far. */
export async function setClock(page: Page, iso: string) {
  const response = await page.request.post(`/api/mock/reset?now=${encodeURIComponent(iso)}`)
  expect(response.ok()).toBeTruthy()
}

/** Signs in through the mock provider with any email, the way the login buttons do. */
export async function signIn(page: Page, email: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const csrf = await (await page.request.get('/api/auth/csrf')).json()
    await page.request.post('/api/auth/callback/mock', {
      form: { email, csrfToken: csrf.csrfToken, callbackUrl: '/' },
      maxRedirects: 0,
    })
    const session = await (await page.request.get('/api/auth/session')).json()
    if (session?.user?.email === email) return
  }
  throw new Error(`could not sign in as ${email}`)
}

/** The first two levels, quickly, for tests that start further in. */
export async function throughArchetype(page: Page, quiz: boolean) {
  await page.goto('/arrive')
  await expect(page.getByText(/^#\d{3} \/ 117$/).first()).toBeVisible()
  await page.getByRole('link', { name: 'Find my archetype' }).click()
  if (quiz) {
    await page.getByRole('button', { name: 'Find out' }).click()
    for (let index = 0; index < 7; index += 1) {
      await page.getByRole('radio').first().click()
      await page.waitForTimeout(260)
    }
    await expect(page.locator('#rv-name')).toBeVisible()
    await page.getByRole('link', { name: 'Next: your profile' }).click()
  } else {
    await page.getByRole('button', { name: "That's me" }).click()
  }
  await page.waitForURL('**/profile')
}

export async function throughProfile(page: Page) {
  // The one line about them is optional, so it is left empty here.
  // GitHub and LinkedIn are required: the step will not finish without them.
  for (const [name, value] of [
    ['Add your GitHub', 'github.com/forgex-founder'],
    ['Add your LinkedIn', 'linkedin.com/in/forgex-founder'],
  ] as const) {
    await page.getByRole('button', { name }).click()
    await page.keyboard.type(value)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name })).toHaveCount(0)
  }
  await page.getByRole('button', { name: 'Next: my problem' }).click()
  await page.waitForURL('**/problem')
}

/** The three questions. */
export async function throughWorld(page: Page) {
  // Answering again starts from the last answers, so only press what is not pressed yet.
  const press = async (name: string) => {
    const chip = page.getByRole('button', { name })
    if ((await chip.getAttribute('aria-pressed')) !== 'true') await chip.click()
  }
  await press('Retail and local shops')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('radio', { name: /^Businesses/ }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await press('AI agents')
  await page.getByRole('button', { name: 'Show my problems' }).click()
  await page.waitForURL('**/matches')
}

export const problems = (page: Page) =>
  page.getByRole('list', { name: '4 problems picked for you.' }).locator(':scope > li')

/** From sign-in to the problem form, through the three onboarding steps. */
export async function toProblem(page: Page, email = AARAV) {
  await signIn(page, email)
  await throughArchetype(page, email !== AARAV)
  await throughProfile(page)
}

export const OWN = {
  title: 'Weekend markets lose their regulars',
  person: 'Stall owners at the Sunday market in Pune, who sell the same goods every week.',
  problem: 'Regulars cannot tell where a stall will be next week, so sales depend on luck.',
  promise: 'Their regulars always know where to find them.',
  why: 'My family runs a stall at the Sunday market, and I help there every weekend.',
  plan: 'Spoke to 6 stall owners. Next, a page where a stall posts its next market.',
  primary: 'drive.google.com/drive/folders/interviews',
  secondary: 'docs.google.com/document/d/reading',
}

/** Fills the problem form, in whole or in part. The industry is pressed only on a blank form. */
export async function fillProblem(page: Page, values: Partial<typeof OWN> = OWN) {
  const labels: Record<keyof typeof OWN, RegExp> = {
    title: /^Title of your problem/,
    person: /^Person: who has this problem/,
    problem: /^Problem: what's broken/,
    promise: /^Promise: what changes/,
    why: /^Why you: why are you the right person/,
    plan: /^Your plan/,
    primary: /^Primary research/,
    secondary: /^Secondary research/,
  }
  const retail = page.getByRole('radio', { name: 'Retail and local shops' })
  if ((await retail.getAttribute('aria-checked')) !== 'true') await retail.click()
  for (const [key, value] of Object.entries(values) as [keyof typeof OWN, string][])
    await page.getByLabel(labels[key]).fill(value)
}

/** Sends the whole problem for review, from the problem page. */
export async function sendProblem(page: Page, values: Partial<typeof OWN> = OWN, again = false) {
  await fillProblem(page, values)
  await page.getByRole('button', { name: again ? 'Send it again' : 'Send for review' }).click()
  await expect(page.getByRole('heading', { name: 'In review.' })).toBeVisible()
}

/** Answers a founder's newest version from the Reviews page, as whoever is signed in. */
export async function answer(
  page: Page,
  name: string,
  decision: 'Approve' | 'Approve with changes' | 'Reject',
  note = '',
) {
  await page.goto('/team/reviews')
  const item = page.getByRole('article', { name })
  await item.getByRole('radio', { name: decision, exact: true }).click()
  if (note) await item.getByLabel('Note to the student').fill(note)
  await item.getByRole('button', { name: 'Send answer' }).click()
  await expect(page.getByRole('article', { name })).toHaveCount(0)
}

/** Aarav, from sign-in to an approved problem, back on his home. */
export async function approved(page: Page) {
  await toProblem(page)
  await sendProblem(page)
  await page.context().clearCookies()
  await signIn(page, CHANDU)
  await answer(page, 'Aarav Shrivastava', 'Approve')
  await page.context().clearCookies()
  await signIn(page, AARAV)
  await page.goto('/build')
}

export const STAGE = {
  scope: 'docs.google.com/document/d/market-day-scope',
  github: 'github.com/aarav/market-day',
  prototype: 'market-day.vercel.app',
  proof: 'drive.google.com/drive/folders/market-day-proof',
  linkedin: 'linkedin.com/posts/aarav_forgex-activity-1',
  live: 'market-day.vercel.app',
  docs: 'docs.google.com/document/d/market-day',
  deck: 'docs.google.com/presentation/d/1AbC/edit',
  video: 'loom.com/share/1a2b3c',
}

const STAGE_FIELDS = {
  scope: ['scope'],
  prototype: ['github', 'prototype', 'proof'],
  launch: ['linkedin', 'live', 'docs'],
  pitch: ['deck', 'video'],
} as const

const STAGE_LABELS: Record<keyof typeof STAGE, RegExp> = {
  scope: /^MVP scope document/,
  github: /^GitHub repo/,
  prototype: /^Prototype link/,
  proof: /^Proof of progress/,
  linkedin: /^LinkedIn post/,
  live: /^Live link on Vercel/,
  docs: /^Documentation/,
  deck: /^Pitch deck/,
  video: /^Loom video/,
}

/** Fills a stage's required links and submits it. */
export async function sendStage(page: Page, stage: keyof typeof STAGE_FIELDS) {
  await page.goto(`/submit/${stage}`)
  for (const field of STAGE_FIELDS[stage]) await page.getByLabel(STAGE_LABELS[field]).fill(STAGE[field])
  await page.getByRole('button', { name: `Submit my ${stage === 'scope' ? 'MVP scope' : stage}` }).click()
  await expect(page.getByRole('heading', { name: 'Submitted.' })).toBeVisible()
}

/** From the bank: the three questions, then the first of the 4. Returns the problem's title. */
export async function pickFromBank(page: Page): Promise<string> {
  await page.goto('/world')
  await throughWorld(page)
  const first = problems(page).first()
  const title = (await first.getByRole('heading').innerText()).replace(/\s+/g, ' ').trim()
  await first.getByRole('button').click()
  await page.getByRole('button', { name: "I'll build this" }).click()
  await page.waitForURL('**/build')
  return title
}
