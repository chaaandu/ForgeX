import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Matches } from '@/components/levels/Matches'
import { LevelShell } from '@/components/shell/LevelShell'
import { meta } from '@/content/copy'
import { mayUseBank } from '@/lib/bank-access'
import { founderContext } from '@/lib/context'
import { countByProblem } from '@/lib/data/hackathon'
import { openProblems } from '@/lib/data/problems'
import { clock, phaseAt } from '@/lib/hackathon'
import { currentPath, mayEnter } from '@/lib/journey'
import { matchSets } from '@/lib/match'
import { forFounder } from '@/lib/problem'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.matches }

/** The bank: 4 problems at a time, for a founder without an approved problem of their own. */
export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>
}) {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'world')) redirect(currentPath(founder))
  const [{ set }, context, problems] = await Promise.all([
    searchParams,
    founderContext(founder),
    openProblems(),
  ])
  // The bank is never shown to anyone who may not use it, whatever the layout does.
  if (!mayUseBank(context.entry, phaseAt(clock()))) redirect('/build')
  if (!founder.world) redirect('/world')

  const sets = matchSets(problems, { world: founder.world, archetype: founder.archetype })
  const at = Math.min(Math.max(1, Number(set) || 1), Math.max(1, sets.length))
  const items = sets[at - 1] ?? []
  const counts = countByProblem(context.all.values())
  const list = items.map((match) => ({
    problem: forFounder(match.problem),
    gentle: match.gentle,
    others: counts.get(match.problem.id) ?? 0,
  }))
  return (
    <LevelShell level="matches" card={context.card}>
      <Matches list={list} set={at} sets={sets.length} />
    </LevelShell>
  )
}
