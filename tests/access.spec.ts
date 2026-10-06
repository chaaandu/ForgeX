import { expect, test } from '@playwright/test'
import { AARAV, DIYA, reset, signIn } from './helpers'

test.beforeEach(async ({ page }) => {
  await reset(page)
})

test('an account outside Mesa is refused, calmly', async ({ page }) => {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  const response = await page.request.post('/api/auth/callback/mock', {
    form: { email: 'someone@gmail.com', csrfToken: csrf.csrfToken, callbackUrl: '/' },
    maxRedirects: 0,
  })
  expect(response.headers()['location']).toContain('error=domain')
  await page.goto('/login?error=domain')
  await expect(page.getByText("That account isn't on the ForgeX list. Use your forge27 Mesa account.")).toBeVisible()
  await expect(page.getByRole('button', { name: 'Use another account' })).toBeVisible()
})

test('a founder-domain account off the roster is refused with its own message', async ({ page }) => {
  await page.goto('/login?error=roster')
  await expect(page.getByText(/isn't in the ForgeX 2.0 cohort/)).toBeVisible()
})

test("a founder cannot see another founder's page, card or the console", async ({ page }) => {
  await signIn(page, DIYA)
  expect((await page.goto('/f/aarav-shrivastava'))?.status()).toBe(404)
  expect((await page.request.get('/api/card/aarav-shrivastava')).status()).toBe(404)
  expect((await page.goto('/team'))?.status()).toBe(404)
  expect((await page.request.get('/api/team/export.csv')).status()).toBe(404)
})

test('signed out, everything but the door asks you to sign in', async ({ page }) => {
  for (const path of ['/arrive', '/matches', '/f/aarav-shrivastava', '/team']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/login$/)
  }
  expect((await page.goto('/'))?.status()).toBe(200)
})

test('static images are never sent to the login screen', async ({ page }) => {
  for (const path of ['/art/alchemist.webp', '/relics/scout.webp', '/brand/mesa-logo.png', '/students/aarav.webp']) {
    const response = await page.request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
  }
})

test('a founder can download their own card', async ({ page }) => {
  await signIn(page, AARAV)
  const response = await page.request.get('/api/card/aarav-shrivastava')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('image/png')
})
