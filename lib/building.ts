import 'server-only'
import type { FounderCardData } from '@/components/card/FounderCard'
import { cardFor } from '@/lib/card'
import { buildingOf } from '@/lib/context'
import { allFounders } from '@/lib/data/founders'
import { entries, progress } from '@/lib/data/hackathon'
import { bank } from '@/lib/data/problems'

export type Building = { slug: string; card: FounderCardData; title: string; progress: number }

/**
 * Founders who have a problem to build, in roster order, each with how far
 * they have got: what the landing shows under the wall. Never sorted by
 * progress, so it reads as a cohort, not a race. Only the headline travels,
 * and anyone who asked to be left off the wall is left off here too.
 */
export async function building(): Promise<Building[]> {
  const [founders, all, problems] = await Promise.all([allFounders(), entries(), bank()])
  const byId = new Map(problems.map((item) => [item.id, item]))
  const of = founders.length
  return founders.flatMap((founder) => {
    if (!founder.wall) return []
    const entry = all.get(founder.email)
    const found = buildingOf(entry, byId)
    if (!entry || !found?.title) return []
    return [
      {
        slug: founder.slug,
        card: cardFor(founder, of, found.title),
        title: found.title,
        progress: progress(entry),
      },
    ]
  })
}

/** Whether a founder's page is open to the rest of the cohort: the same rule as above. */
export async function isBuilding(slug: string): Promise<boolean> {
  return (await building()).some((item) => item.slug === slug)
}
