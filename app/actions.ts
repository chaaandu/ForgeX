'use server'

import { getBets, getChangesLeft, placeBetOnBackend, releaseBetOnBackend } from '@/lib/backend'
import { problemIdSchema, type ActionResult } from '@/lib/schema'
import { requireViewer } from '@/lib/session'
import { studentByEmail } from '@/lib/students'
import { isClosed } from '@/lib/time'
import { visibleBets } from '@/lib/visibility'

/**
 * Identity comes from the session and nowhere else. The client sends a problem
 * ID and nothing more.
 */
async function student() {
  const viewer = await requireViewer()
  if (viewer.role !== 'student') return null
  const roster = studentByEmail(viewer.email)
  return {
    email: viewer.email,
    name: viewer.name || roster?.name || viewer.email,
    photo: viewer.photo || roster?.photo || '',
  }
}

export async function placeBet(rawProblemId: string): Promise<ActionResult> {
  const who = await student()
  if (!who) return { ok: false, error: 'forbidden' }
  if (isClosed()) return { ok: false, error: 'closed' }

  const parsed = problemIdSchema.safeParse(rawProblemId)
  if (!parsed.success) return { ok: false, error: 'not_found' }

  const result = await placeBetOnBackend({ ...who, problemId: parsed.data })
  if (!result.ok) return result
  return {
    ok: true,
    bets: visibleBets('student', who.email, result.bets),
    changesLeft: result.changesLeft ?? (await getChangesLeft(who.email)),
  }
}

export async function releaseBet(): Promise<ActionResult> {
  const who = await student()
  if (!who) return { ok: false, error: 'forbidden' }
  if (isClosed()) return { ok: false, error: 'closed' }

  const { bets } = await getBets()
  const held = Object.keys(bets).find((id) => bets[id]?.email === who.email)
  if (!held) {
    return {
      ok: true,
      bets: visibleBets('student', who.email, bets),
      changesLeft: await getChangesLeft(who.email),
    }
  }

  const result = await releaseBetOnBackend({ email: who.email, problemId: held })
  if (!result.ok) return result
  return {
    ok: true,
    bets: visibleBets('student', who.email, result.bets),
    changesLeft: result.changesLeft ?? (await getChangesLeft(who.email)),
  }
}
