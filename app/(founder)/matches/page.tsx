import type { Metadata } from 'next'
import { meta } from '@/content/copy'
import { redirect } from 'next/navigation'
import { Matches } from '@/components/levels/Matches'
import { LevelShell } from '@/components/shell/LevelShell'
import { founderContext } from '@/lib/context'
import { openProblems } from '@/lib/data/problems'
import { currentPath, mayEnter } from '@/lib/journey'
import { topMatches } from '@/lib/match'
import { forFounder } from '@/lib/problem'
import { seesBank, trackOf, TRACK_DIFFICULTIES } from '@/lib/tracks'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.matches }

export default async function MatchesPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'matches') || !founder.world) redirect(currentPath(founder))
  const track = trackOf(founder.track)
  // Autonomous founders bring their own problem: no bank, straight to writing it.
  if (!seesBank(track)) redirect('/matches/new')
  const [context, problems] = await Promise.all([founderContext(founder), openProblems()])
  // A pick the team has settled is final; only a waiting one may be replaced.
  if (context.current && context.current.status !== 'waiting') redirect(`/f/${founder.slug}`)
  const list = topMatches(problems, {
    world: founder.world,
    archetype: founder.archetype,
    exclude: context.tried,
    suggested: context.suggested,
    allowed: TRACK_DIFFICULTIES[track],
  }).map((match) => ({
    problem: forFounder(match.problem),
    gentle: match.gentle,
    suggested: match.suggested,
  }))
  return (
    <LevelShell level="matches" card={context.card}>
      <Matches
        list={list}
        waitingFor={context.current?.status === 'waiting' ? context.current.title : null}
        again={context.suggested.length > 0 || context.tried.length > 0}
      />
    </LevelShell>
  )
}
