import { expect, type Page } from '@playwright/test'

export const AARAV = 'aarav_shrivastava@forge27.mesaschool.co' // placed in Hackathon 1
export const DIYA = 'diya_agrawal@forge27.mesaschool.co' // sits the quiz
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
  await page.getByRole('link', { name: "Let's go" }).click()
  if (quiz) {
    await page.getByRole('button', { name: 'Start' }).click()
    for (let index = 0; index < 7; index += 1) {
      await page.getByRole('radio').first().click()
      await page.waitForTimeout(260)
    }
    await expect(page.locator('#rv-name')).toBeVisible()
    await page.getByRole('link', { name: 'Next' }).click()
  } else {
    await page.getByRole('button', { name: "That's me" }).click()
  }
  await page.waitForURL('**/profile')
}

export async function throughProfile(page: Page) {
  await page.getByRole('button', { name: 'Add one line about you' }).click()
  await page.getByRole('button', { name: /^One line about you/ }).click()
  await page.keyboard.type('I run the counter at my family shop on weekends.')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Saved')).toBeVisible()
  await page.getByRole('button', { name: 'Looks like me' }).click()
  await page.waitForURL('**/world')
}

export async function throughWorld(page: Page) {
  await page.getByRole('button', { name: 'Retail and local shops' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('radio', { name: 'Businesses' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Family business', exact: true }).click()
  await page.getByRole('button', { name: 'Retail', exact: true }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Data and dashboards' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('radio', { name: 'Both' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Show my matches' }).click()
  await page.waitForURL('**/matches')
}

export const WHY = {
  whyProblem:
    'My uncle runs a hardware shop and still reorders from memory, so he runs out of the things people ask for most and overstocks the rest every season.',
  whyUser:
    'Shop owners like my uncle, who stand at the counter all day and have no time to count stock, would use it because they lose sales every week.',
  whyPay:
    'They already pay for a billing app every month, and a few lost sales a week cost far more than a small monthly fee would.',
}
