import 'server-only'
import { cardFor } from '@/lib/card'
import { allFounders, type Founder } from '@/lib/data/founders'
import { threadFor } from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'
import type { Problem } from '@/lib/problem'

/**
 * Everything a founder's screens need about them in one read: their card, their
 * picks and our answers, and the one pick that is current.
 */
export async function founderContext(founder: Founder) {
  const [founders, thread, problems] = await Promise.all([
    allFounders(),
    threadFor(founder.email),
    bank(),
  ])
  const of = founders.length
  const byId = new Map(problems.map((item) => [item.id, item]))
  const entries = thread.map((entry) => {
    const problem = entry.pick.problemId ? (byId.get(entry.pick.problemId) ?? null) : null
    const title = problem?.title ?? entry.pick.custom?.title ?? ''
    return { ...entry, problem: problem as Problem | null, title }
  })
  const current = [...entries].reverse().find((entry) => !entry.pick.withdrawnAt) ?? null
  const live = current && current.status !== 'another' ? current : null
  return {
    of,
    entries,
    current: live,
    card: cardFor(
      founder,
      of,
      live ? { title: live.title, problem: live.problem, status: live.status } : null,
    ),
    tried: entries
      .filter((entry) => entry.pick.problemId)
      .map((entry) => entry.pick.problemId as string),
    suggested: current?.status === 'another' ? (current.responses.at(-1)?.suggested ?? []) : [],
    /**
     * The tweak being answered, while a founder is revising: the current pick
     * if it was told Needs a tweak, or the one before it if the change has just
     * been sent and is waiting. Null otherwise.
     */
    tweak: (() => {
      if (!current) return null
      if (current.status === 'tweak')
        return { entry: current, note: current.responses.at(-1)?.note ?? '' }
      if (current.status !== 'waiting') return null
      const before = entries.filter((entry) => !entry.pick.withdrawnAt && entry !== current).at(-1)
      return before?.status === 'tweak'
        ? { entry: before, note: before.responses.at(-1)?.note ?? '' }
        : null
    })(),
  }
}
