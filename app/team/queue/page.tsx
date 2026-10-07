import type { Metadata } from 'next'
import Link from 'next/link'
import { Queue, type QueueItem } from '@/components/team/Queue'
import { Replied, type RepliedItem } from '@/components/team/Replied'
import { archetypes, consoleCopy, families, meta } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { allFounders, type Founder } from '@/lib/data/founders'
import {
  allPicks,
  allResponses,
  RESPONSE_TYPES,
  revisionOf,
  statusOf,
  type ResponseType,
} from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'
import { briefFor } from '@/lib/team-brief'

export const metadata: Metadata = { title: meta.pages.queue }

const copy = consoleCopy.queue

const archetypeLine = (founder: Founder) => {
  const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
  return kind ? `${families[kind.family].name} · ${archetypes[kind.id].name}` : '—'
}

/**
 * Two views of the same picks: what is waiting on us, oldest first, and what
 * we have already answered, newest first, so anyone on the team can see who
 * was approved, who needs a tweak and who is talking to a mentor.
 */
export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; type?: string }>
}) {
  const params = await searchParams
  const view = params.view === 'replied' ? 'replied' : 'waiting'
  const filter = RESPONSE_TYPES.find((type) => type === params.type) ?? null

  const [picks, responses, founders, problems] = await Promise.all([
    allPicks(),
    allResponses(),
    allFounders(),
    bank(),
  ])
  const byEmail = new Map(founders.map((founder) => [founder.email, founder]))
  const byId = new Map(problems.map((item) => [item.id, item]))
  const live = picks.filter((pick) => !pick.withdrawnAt)
  const waitingPicks = live.filter((pick) => statusOf(pick, responses) === 'waiting')
  // Only each founder's latest pick: an old tweak they have since revised is
  // history, kept on their profile, not something to answer again.
  const latestOf = new Map(live.map((pick) => [pick.email, pick.id]))
  const repliedPicks = live.filter(
    (pick) => latestOf.get(pick.email) === pick.id && statusOf(pick, responses) !== 'waiting',
  )

  const tabs = (
    <nav className="flex flex-wrap gap-2" aria-label={copy.views.label}>
      {(['waiting', 'replied'] as const).map((key) => (
        <Link
          key={key}
          href={key === 'waiting' ? '/team/queue' : '/team/queue?view=replied'}
          aria-current={view === key ? 'page' : undefined}
          className="chip press min-h-9 text-[13px] no-underline"
        >
          {copy.views[key]}{' '}
          <span className="font-mono text-[11px]">
            {key === 'waiting' ? waitingPicks.length : repliedPicks.length}
          </span>
        </Link>
      ))}
    </nav>
  )

  const bankList = problems
    .filter((item) => item.status === 'approved')
    .map((item) => ({ id: item.id, title: item.title }))

  if (view === 'replied') {
    const items: RepliedItem[] = repliedPicks
      .flatMap((pick) => {
        const founder = byEmail.get(pick.email)
        const last = responses.filter((response) => response.pickId === pick.id).at(-1)
        if (!founder || !last) return []
        const problem = pick.problemId ? byId.get(pick.problemId) : null
        return [
          {
            pickId: pick.id,
            name: founder.name,
            slug: founder.slug,
            photo: founder.photo,
            archetype: archetypeLine(founder),
            title: problem?.title ?? pick.custom?.title ?? '',
            own: !problem,
            type: last.type as ResponseType,
            note: last.note,
            author: last.author,
            sentAt: last.sentAt,
          },
        ]
      })
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
    return (
      <div className="grid gap-6">
        {tabs}
        <Replied items={items} filter={filter} bank={bankList} />
      </div>
    )
  }

  const items: QueueItem[] = waitingPicks
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
    .flatMap((pick) => {
      const founder = byEmail.get(pick.email)
      if (!founder) return []
      const problem = pick.problemId ? byId.get(pick.problemId) : null
      const previous = picks.filter(
        (item) => item.email === pick.email && item.id !== pick.id,
      ).length
      return [
        {
          pickId: pick.id,
          submittedAt: pick.submittedAt,
          founder: {
            name: founder.name,
            slug: founder.slug,
            photo: founder.photo,
            archetype: archetypeLine(founder),
            previous,
            brief: briefFor(founder),
          },
          problem: problem
            ? {
                title: problem.title,
                problem: problem.problem,
                challenge: problem.challenge,
                difficulty: problem.difficulty,
                own: false,
              }
            : {
                title: pick.custom?.title ?? '',
                problem: pick.custom?.problem ?? '',
                challenge: pick.custom?.challenge ?? '',
                difficulty: null,
                own: true,
              },
          whyProblem: pick.whyProblem,
          whyUser: pick.whyUser,
          whyPay: pick.whyPay,
          contact: pick.contact,
          revision: revisionOf(pick, picks, responses),
        },
      ]
    })
  return (
    <div className="grid gap-6">
      {tabs}
      <Queue items={items} bank={bankList} />
    </div>
  )
}
