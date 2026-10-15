import 'server-only'
import { cardFor } from '@/lib/card'
import { allFounders, type Founder } from '@/lib/data/founders'
import {
  entries,
  hasProblem,
  progress,
  progressParts,
  type Entry,
  type Version,
} from '@/lib/data/hackathon'
import { bank, type BankProblem } from '@/lib/data/problems'
import { labelOf } from '@/lib/taxonomy'

/** What a founder is building, whichever way they came to it. */
export type Build = {
  entry: Entry
  /** The bank problem, or null when the problem is their own. */
  problem: BankProblem | null
  /** Their own problem as approved: the newest version they sent. */
  own: Version | null
  /** The headline: a bank problem's 2-day challenge, or their own problem's name. */
  title: string
  /** The first industry the problem sits in, for the console's filters. */
  industry: string
  /** That industry as a person reads it, in the founder's own word when it is Other. */
  industryName: string
  reviewer: string
  poc: string
}

/** What a founder is building, once they have a problem to build: approved, or picked from the bank. */
export function buildingOf(
  entry: Entry | null | undefined,
  problems: Map<string, BankProblem>,
): Build | null {
  if (!entry || !hasProblem(entry)) return null
  const problem = entry.problemId ? (problems.get(entry.problemId) ?? null) : null
  if (entry.problemId && !problem) return null
  const own = problem ? null : entry.latest
  return {
    entry,
    problem,
    own,
    title: problem?.scope?.task ?? problem?.title ?? own?.title ?? entry.title,
    industry: problem?.industries[0] ?? own?.industry ?? '',
    industryName: problem
      ? labelOf.industryShort(problem.industries[0] ?? '')
      : own?.industryOther || (own ? labelOf.industryShort(own.industry) : ''),
    reviewer: entry.reviewer,
    poc: entry.poc,
  }
}

/**
 * Everything a founder's screens need about them in one read: their card,
 * their row in the hackathon, how far they have got, and the problem they are
 * building if they have one.
 */
export async function founderContext(founder: Founder) {
  const [founders, all, problems] = await Promise.all([allFounders(), entries(), bank()])
  const of = founders.length
  const entry = all.get(founder.email) ?? null
  const building = buildingOf(entry, new Map(problems.map((item) => [item.id, item])))
  return {
    of,
    entry,
    building,
    all,
    progress: entry ? progress(entry) : 0,
    parts: entry ? progressParts(entry) : { problem: 0, scope: 0, prototype: 0, launch: 0, pitch: 0 },
    card: cardFor(founder, of, building?.title),
  }
}
