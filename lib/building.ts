import 'server-only'
import type { FounderCardData } from '@/components/card/FounderCard'
import { cardFor } from '@/lib/card'
import { allFounders } from '@/lib/data/founders'
import { allResearch } from '@/lib/data/research'
import { latestBy, allReviews } from '@/lib/data/reviews'
import { allSubmissions } from '@/lib/data/submissions'

export type Building = { slug: string; card: FounderCardData; forWho: string; live: string | null }

/**
 * Founders who have sent their research, newest first: what the landing
 * shows under the wall. Only who they're building for travels, plus their
 * live link once the team rates stop 2 green. Never their research, a
 * rating, or anything the team wrote. Anyone who asked to be left off the
 * wall is left off here too.
 */
export async function building(): Promise<Building[]> {
  const [founders, research, submissions, reviews] = await Promise.all([
    allFounders(),
    allResearch(),
    allSubmissions(),
    allReviews(),
  ])
  const green = latestBy(reviews, '2')
  const of = founders.length
  return founders
    .flatMap((founder) => {
      const mine = research.get(founder.email)
      if (!founder.wall || !mine?.sent || !mine.forWho) return []
      const live =
        green.get(founder.email)?.rating === 'green'
          ? (submissions
              .filter(
                (item) => item.email === founder.email && item.stop === 2 && item.status === 'sent',
              )
              .at(-1)?.fields.live ?? null)
          : null
      return [
        {
          slug: founder.slug,
          card: cardFor(founder, of, true),
          forWho: mine.forWho,
          live: live || null,
          at: mine.at,
        },
      ]
    })
    .sort((a, b) => b.at.localeCompare(a.at))
    .map(({ at: _at, ...item }) => item)
}

/** Whether a founder's page is open to the rest of the cohort: the same rule as above. */
export async function isBuilding(slug: string): Promise<boolean> {
  return (await building()).some((item) => item.slug === slug)
}
