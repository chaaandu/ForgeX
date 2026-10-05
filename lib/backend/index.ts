import 'server-only'
import fallbackProblems from '@/data/problems.json'
import type { ActionResult } from '@/lib/schema'
import { fetchBets, fetchData, sheetBet, sheetRelease, SheetUnreachable } from '@/lib/sheet'
import { studentByEmail, studentByName } from '@/lib/students'
import type { BetMap, Problem } from '@/lib/types'
import { mockBet, mockBets, mockChangesLeft, mockProblems, mockRelease } from './mock'

/**
 * The only module the app talks to. It picks mock mode or the Sheet, keeps the
 * problems list cached for five minutes and bet state for ten seconds, and
 * degrades to data/problems.json when Apps Script cannot be reached.
 */

export function isMock(): boolean {
  return process.env.MOCK_BACKEND === 'true'
}

/**
 * The Sheet stores the bettor's name and nothing else, so the email and the
 * face are filled in here from the roster. A bet placed by hand in the Sheet,
 * with no matching log row, still gets both.
 */
function enrich(bets: BetMap): BetMap {
  const out: BetMap = {}
  for (const [id, bet] of Object.entries(bets)) {
    const student = bet.email ? studentByEmail(bet.email) : studentByName(bet.name)
    out[id] = {
      name: bet.name,
      email: bet.email || student?.email || '',
      photo: bet.photo || student?.photo || '',
      at: bet.at,
    }
  }
  return out
}

const PROBLEMS_TTL_MS = 5 * 60_000
const BETS_TTL_MS = 10_000

type Cache = {
  problems: { value: Problem[]; at: number } | null
  bets: { value: BetMap; at: number } | null
  /** Picks per email, so changes left can be worked out without another call. */
  picks: Record<string, number>
  maxChanges: number
  degraded: boolean
}

const cache: Cache = ((globalThis as { __forgexCache?: Cache }).__forgexCache ??= {
  problems: null,
  bets: null,
  picks: {},
  maxChanges: 3,
  degraded: false,
})

/** After a write, the next read must not serve the state from before it. */
function invalidateBets() {
  cache.bets = null
}

export type Snapshot = {
  problems: Problem[]
  bets: BetMap
  /** True when we are serving the local snapshot because the Sheet is unreachable. */
  degraded: boolean
}

/**
 * The problem list changes when somebody edits the Sheet, which is rare, while
 * a call to Apps Script costs about three seconds and 227KB. So a request is
 * never made to wait for one: it gets whatever we already have, starting with
 * the snapshot that ships with the build, and a refresh runs behind it.
 */
/**
 * Apps Script takes about three seconds per call however small the answer, and
 * two overlapping calls can stall for the best part of a minute. Background
 * reads therefore queue behind each other. Writes are never queued: a student
 * tapping a button must not wait on a refresh.
 */
let readQueue: Promise<unknown> = Promise.resolve()

function queued<T>(work: () => Promise<T>): Promise<T> {
  const next = readQueue.then(work, work)
  readQueue = next.then(
    () => undefined,
    () => undefined,
  )
  return next
}

let refreshing: Promise<void> | null = null

function refreshProblems(): void {
  if (refreshing) return
  refreshing = queued(() => fetchData())
    .then(({ problems, picks, maxChanges }) => {
      cache.problems = { value: problems, at: Date.now() }
      cache.picks = picks
      cache.maxChanges = maxChanges
      cache.degraded = false
    })
    .catch(() => {
      cache.degraded = true
    })
    .finally(() => {
      refreshing = null
    })
}

function problemsNow(): Problem[] {
  const held = cache.problems
  if (!held || Date.now() - held.at > PROBLEMS_TTL_MS) refreshProblems()
  return held?.value ?? (fallbackProblems as Problem[])
}

export async function getSnapshot(): Promise<Snapshot> {
  if (isMock()) return { problems: mockProblems(), bets: mockBets(), degraded: false }
  const { bets, degraded } = await getBets()
  return { problems: problemsNow(), bets, degraded }
}

let pollingBets: Promise<void> | null = null

function refreshBets(): Promise<void> {
  if (pollingBets) return pollingBets
  pollingBets = queued(() => fetchBets())
    .then((state) => {
      cache.bets = { value: enrich(state.bets), at: Date.now() }
      cache.picks = state.picks
      cache.maxChanges = state.maxChanges
      cache.degraded = false
    })
    .catch(() => {
      cache.degraded = true
    })
    .finally(() => {
      pollingBets = null
    })
  return pollingBets
}

/**
 * Who holds what. Fresh within ten seconds, and only ever blocking on the very
 * first request a server handles: after that a stale answer goes out at once
 * while the refresh runs behind it. Serving bet state a few seconds old is safe
 * because the Sheet, not this cache, decides who actually gets a problem.
 */
export async function getBets(): Promise<{ bets: BetMap; degraded: boolean }> {
  if (isMock()) return { bets: mockBets(), degraded: false }

  const held = cache.bets
  if (!held) {
    await refreshBets()
    return { bets: cache.bets?.value ?? {}, degraded: cache.degraded }
  }

  if (Date.now() - held.at >= BETS_TTL_MS) void refreshBets()
  return { bets: held.value, degraded: cache.degraded }
}

/** The first pick is free, so changes used is one less than problems picked. */
function left(email: string, picks: Record<string, number>, maxChanges: number): number {
  const used = Math.max(0, (picks[email.trim().toLowerCase()] ?? 0) - 1)
  return Math.max(0, maxChanges - used)
}

/** How many changes this student has left. */
export async function getChangesLeft(email: string): Promise<number> {
  if (isMock()) return mockChangesLeft(email)
  await getBets()
  return left(email, cache.picks, cache.maxChanges)
}

/** Problem detail, straight from memory. Never waits on Apps Script. */
export function getProblem(problemId: string): Problem | undefined {
  const problems = isMock() ? mockProblems() : problemsNow()
  return problems.find((problem) => problem.id === problemId)
}

export async function placeBetOnBackend(input: {
  email: string
  name: string
  photo: string
  problemId: string
}): Promise<ActionResult> {
  if (isMock()) return mockBet(input)
  try {
    const { result, picks, maxChanges } = await sheetBet({
      email: input.email,
      name: input.name,
      problemId: input.problemId,
    })
    invalidateBets()
    cache.picks = picks
    cache.maxChanges = maxChanges
    return result.ok
      ? { ok: true, bets: enrich(result.bets), changesLeft: left(input.email, picks, maxChanges) }
      : result
  } catch (error) {
    if (error instanceof SheetUnreachable) return { ok: false, error: 'unreachable' }
    throw error
  }
}

export async function releaseBetOnBackend(input: {
  email: string
  problemId: string
}): Promise<ActionResult> {
  if (isMock()) return mockRelease(input)
  try {
    const { result, picks, maxChanges } = await sheetRelease(input)
    invalidateBets()
    cache.picks = picks
    cache.maxChanges = maxChanges
    return result.ok
      ? { ok: true, bets: enrich(result.bets), changesLeft: left(input.email, picks, maxChanges) }
      : result
  } catch (error) {
    if (error instanceof SheetUnreachable) return { ok: false, error: 'unreachable' }
    throw error
  }
}
