import 'server-only'
import type { FounderCardData } from '@/components/card/FounderCard'
import { cardFor } from '@/lib/card'
import { allFounders } from '@/lib/data/founders'
import { allPicks, allResponses, statusOf } from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'

export type Building = { slug: string; card: FounderCardData; title: string }

/**
 * Founders whose pick the team has approved, newest first: what the landing
 * shows under the wall. Only the title travels, never their why or our note,
 * and anyone who asked to be left off the wall is left off here too.
 */
export async function building(): Promise<Building[]> {
  const [founders, picks, responses, problems] = await Promise.all([
    allFounders(),
    allPicks(),
    allResponses(),
    bank(),
  ])
  const byId = new Map(problems.map((item) => [item.id, item]))
  const of = founders.length
  return founders
    .flatMap((founder) => {
      if (!founder.wall || !founder.pickId) return []
      const pick = picks.find((item) => item.id === founder.pickId && !item.withdrawnAt)
      if (!pick) return []
      const status = statusOf(pick, responses)
      // Approved only: a tweak is still a conversation, not a yes.
      if (status !== 'go') return []
      const problem = pick.problemId ? (byId.get(pick.problemId) ?? null) : null
      const title = problem?.title ?? pick.custom?.title ?? ''
      if (!title) return []
      const at = responses.filter((response) => response.pickId === pick.id).at(-1)?.sentAt ?? ''
      return [
        { slug: founder.slug, card: cardFor(founder, of, { title, problem, status }), title, at },
      ]
    })
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((item) => ({ slug: item.slug, card: item.card, title: item.title }))
}

/** Whether a founder's page is open to the rest of the cohort: the same rule as above. */
export async function isBuilding(slug: string): Promise<boolean> {
  return (await building()).some((item) => item.slug === slug)
}
