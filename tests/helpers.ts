import { expect, type Page } from '@playwright/test'

export const AARAV = 'aarav_shrivastava@forge27.mesaschool.co' // placed in Hackathon 1
export const DIYA = 'diya_agrawal@forge27.mesaschool.co' // sits the quiz
export const AADISHWAR = 'aadishwar_r@forge27.mesaschool.co' // autonomous, placed in Hackathon 1: no bank
export const TEAM = 'team@mesaschool.co'

export async function reset(page: Page) {
  const response = await page.request.post('/api/mock/reset')
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
  // One tap opens the field, focused, right where the invitation was.
  await page.getByRole('button', { name: 'Add one line about you' }).click()
  await page.keyboard.type('I run the counter at my family shop on weekends.')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Saved')).toBeVisible()
  await page.getByRole('button', { name: 'Looks like me' }).click()
  await page.waitForURL('**/challenge')
}

export async function throughChallenge(page: Page) {
  await expect(page.getByRole('heading', { name: /Small shops run on WhatsApp/ })).toBeVisible()
  await page.getByRole('button', { name: 'Start your research' }).click()
  await page.waitForURL('**/research')
}

export const RESEARCH = {
  apps: [
    ['Khatabook', 'Owners use it for credit, but orders still live in WhatsApp.'],
    ['WhatsApp Business', 'Orders arrive here, but nothing turns them into a list.'],
    ['A paper notebook', 'The record everyone trusts, and nobody can search.'],
  ],
  forWho: 'Home bakers who take cake orders on WhatsApp',
  problem:
    'Orders arrive on WhatsApp, Instagram and calls. Bakers write them on paper and miss some every week.',
  moment: "Saturday night, when Sunday's orders are spread across 3 apps",
}

/** Fills the research and sends it, landing on Today. */
export async function sendResearch(page: Page) {
  for (const [index, [name, note]] of RESEARCH.apps.entries()) {
    await page.getByLabel('App or tool').nth(index).fill(name!)
    await page.getByLabel('What it gets wrong for owners').nth(index).fill(note!)
  }
  await page.getByLabel('Who are you building for?').fill(RESEARCH.forWho)
  await page.getByLabel('The problem, in 3 lines').fill(RESEARCH.problem)
  await page.getByLabel('The moment it breaks').fill(RESEARCH.moment)
  await page.getByRole('button', { name: 'Send my research' }).click()
  await expect(page.getByRole('heading', { name: "You're building." })).toBeVisible()
  await page.getByRole('link', { name: "See today's steps" }).click()
  await page.waitForURL('**/today')
}

/** Onboarding to Today, quickly, for tests that start further in. */
export async function toToday(page: Page, quiz = false) {
  await throughArchetype(page, quiz)
  await throughProfile(page)
  await throughChallenge(page)
  await sendResearch(page)
}
