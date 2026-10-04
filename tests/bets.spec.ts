import { expect, test, type Browser, type BrowserContext } from '@playwright/test'
import { copy } from '../lib/copy'
import students from '../data/students.json'
import { card, openProblem, resetBoard, signIn, STUDENT_A, STUDENT_B, TEAM } from './helpers'

const own = (page: import('@playwright/test').Page) => page.getByTestId('footer-own')
const betButton = (page: import('@playwright/test').Page) => page.getByTestId('bet-button')
const taken = (page: import('@playwright/test').Page) => page.getByTestId('footer-taken')

const nameA = students[0]!.name
const nameB = students[1]!.name

async function asUser(browser: Browser, email: string): Promise<BrowserContext> {
  const context = await browser.newContext()
  await signIn(context, email)
  return context
}

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext()
  await resetBoard(context)
  await context.close()
})

test('a bet by one student shows as taken to another, who cannot take it', async ({ browser }) => {
  const a = await asUser(browser, STUDENT_A)
  const b = await asUser(browser, STUDENT_B)

  const pageA = await a.newPage()
  await openProblem(pageA, 'P001')
  await betButton(pageA).click()
  await expect(own(pageA)).toBeVisible()

  const pageB = await b.newPage()
  await openProblem(pageB, 'P001')
  await expect(taken(pageB)).toBeDisabled()
  await expect(taken(pageB)).toHaveText(copy.modal.takenByOther(nameA))

  await pageB.goto('/')
  await expect(card(pageB, 'P001').getByText(copy.card.taken(nameA))).toBeVisible()

  await a.close()
  await b.close()
})

test('moving a bet frees the old problem', async ({ browser }) => {
  const a = await asUser(browser, STUDENT_A)
  const b = await asUser(browser, STUDENT_B)

  const pageA = await a.newPage()
  await openProblem(pageA, 'P001')
  await betButton(pageA).click()
  await expect(own(pageA)).toBeVisible()

  await openProblem(pageA, 'P002')
  await expect(pageA.getByTestId('footer-open')).toContainText('This frees up P001')
  await betButton(pageA).click()
  await expect(own(pageA)).toBeVisible()

  const pageB = await b.newPage()
  await openProblem(pageB, 'P001')
  await expect(pageB.getByRole('button', { name: copy.modal.cta, exact: true })).toBeEnabled()
  await openProblem(pageB, 'P002')
  await expect(taken(pageB)).toBeDisabled()
  await expect(taken(pageB)).toHaveText(copy.modal.takenByOther(nameA))

  await a.close()
  await b.close()
})

test('taking a bet back opens the problem up again', async ({ browser }) => {
  const a = await asUser(browser, STUDENT_A)
  const b = await asUser(browser, STUDENT_B)

  const pageA = await a.newPage()
  await openProblem(pageA, 'P002')
  await betButton(pageA).click()
  await expect(own(pageA)).toBeVisible()
  await pageA.getByRole('button', { name: copy.modal.undo }).click()
  await expect(betButton(pageA)).toBeEnabled()

  const pageB = await b.newPage()
  await openProblem(pageB, 'P002')
  await expect(betButton(pageB)).toBeEnabled()

  await a.close()
  await b.close()
})

test('two students betting at once produce one winner and one race toast', async ({ browser }) => {
  const a = await asUser(browser, STUDENT_A)
  const b = await asUser(browser, STUDENT_B)

  const pageA = await a.newPage()
  const pageB = await b.newPage()
  await openProblem(pageA, 'P003')
  await openProblem(pageB, 'P003')

  await Promise.all([betButton(pageA).click(), betButton(pageB).click()])

  await expect
    .poll(async () => {
      const owned = [await own(pageA).isVisible(), await own(pageB).isVisible()]
      return owned.filter(Boolean).length
    })
    .toBe(1)

  const aWon = await own(pageA).isVisible()
  const loser = aWon ? pageB : pageA
  const winnerName = aWon ? nameA : nameB
  await expect(loser.getByText(copy.toast.race(winnerName))).toBeVisible()

  await a.close()
  await b.close()
})

test('the team view shows the bettor email and cannot bet', async ({ browser }) => {
  const a = await asUser(browser, STUDENT_A)
  const team = await asUser(browser, TEAM)

  const pageA = await a.newPage()
  await openProblem(pageA, 'P004')
  await betButton(pageA).click()
  await expect(own(pageA)).toBeVisible()

  const pageT = await team.newPage()
  await openProblem(pageT, 'P004')
  await expect(pageT.getByTestId('footer-team')).toContainText(STUDENT_A)
  await expect(betButton(pageT)).toHaveCount(0)

  await openProblem(pageT, 'P005')
  await expect(pageT.getByTestId('footer-team')).toHaveText(copy.modal.teamNobody)

  await a.close()
  await team.close()
})
