import { expect, type BrowserContext, type Page } from '@playwright/test'
import students from '../data/students.json'

export const STUDENT_A = students[0]!.email
export const STUDENT_B = students[1]!.email
export const TEAM = 'team@mesaschool.co'
export const OUTSIDER = 'someone@evilmesaschool.co'

/** Signs in through the mock credentials provider, cookies and all. */
export async function signIn(context: BrowserContext, email: string) {
  const csrf = await context.request.get('/api/auth/csrf')
  const { csrfToken } = (await csrf.json()) as { csrfToken: string }
  return context.request.post('/api/auth/callback/mock', {
    form: { csrfToken, email, callbackUrl: '/' },
    maxRedirects: 0,
  })
}

export async function resetBoard(context: BrowserContext) {
  await context.request.post('/api/mock/reset', { data: {} })
}

export async function openProblem(page: Page, id: string) {
  await page.goto(`/?p=${id}`)
  await expect(page.locator('#problem-title')).toBeVisible()
}

export function card(page: Page, id: string) {
  return page.locator(`[data-card-id="${id}"]`)
}
