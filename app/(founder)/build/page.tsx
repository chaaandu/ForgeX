import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { PersonCard } from '@/components/build/PersonCard'
import { ProgressTrack } from '@/components/build/ProgressTrack'
import { ResearchForm } from '@/components/build/ResearchForm'
import { Timeline } from '@/components/build/Timeline'
import { Bullets } from '@/components/problem/Bullets'
import { Answers } from '@/components/problem/OwnProblemView'
import { Refresh } from '@/components/ui/Refresh'
import { home as copy, meta, ownProblem, page, problem as problemCopy } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { researchDone } from '@/lib/data/hackathon'
import { clock, phaseAt } from '@/lib/hackathon'
import { currentPath } from '@/lib/journey'
import { requireFounder } from '@/lib/session'
import { stampToIso } from '@/lib/stamp'
import { nextDue, stepsFor } from '@/lib/steps'

export const metadata: Metadata = { title: meta.pages.home }

/**
 * A founder's home for the whole hackathon: how far they have got, the four
 * steps with what to press and when each is due, the problem they are
 * building once they have one, and who to go to.
 */
export default async function HomePage() {
  const { founder } = await requireFounder()
  if (founder.level < 3) redirect(currentPath(founder))
  const context = await founderContext(founder)
  const entry = context.entry
  const state = entry?.state ?? 'none'
  const now = clock()
  const phase = phaseAt(now)
  const steps = stepsFor(
    {
      state,
      sentAt: entry?.sentAt ?? { scope: '', prototype: '', launch: '', pitch: '' },
      fields: entry?.fields ?? {},
      reopened: entry ? [...entry.reopened] : [],
      researchDone: entry ? researchDone(entry) : false,
      answered: Boolean(founder.world),
      latestSent: entry?.latest ? stampToIso(entry.latest.time) : undefined,
    },
    phase,
  )
  const building = context.building
  const scope = building?.problem?.scope ?? null
  const own = building?.own ?? null
  const bank = state === 'bank'
  const missed = steps.some((step) => step.state === 'missed')
  const done =
    steps.every((step) => step.state === 'done' || step.id === 'problem') &&
    Boolean(entry?.sentAt.pitch)

  return (
    <BuildShell
      slug={founder.slug}
      next={nextDue(steps, phase)}
      now={now.toISOString()}
      ownProblem={!bank}
    >
      {state === 'waiting' ? <Refresh /> : null}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <div className="grid min-w-0 content-start gap-12">
          <div className="grid gap-3">
            <h1 className="page-title m-0">{copy.title(founder.first)}</h1>
            <p className="text-lead text-ink-2 m-0">
              {done ? copy.allDone : state === 'waiting' ? copy.inReview : copy.next}
            </p>
            {/* On a phone the side column falls to the bottom, so how far they have got sits here. */}
            <div className="pt-4 lg:hidden">
              <ProgressTrack value={context.progress} parts={context.parts} />
            </div>
          </div>

          <Timeline
            steps={steps}
            reviewer={entry?.reviewer ?? ''}
            answeredBy={entry?.answer?.by ?? ''}
            sentAt={entry?.sentAt ?? { scope: '', prototype: '', launch: '', pitch: '' }}
            phase={phase}
          />

          {bank && entry ? <ResearchForm initial={entry.research} /> : null}

          {building ? (
            <section className="grid gap-6" aria-labelledby="building-title">
              <div className="grid gap-3">
                <p className="meta m-0">{copy.kicker}</p>
                <h2
                  id="building-title"
                  className="display user-text m-0 text-[clamp(28px,3.4vw,42px)] leading-[1.06]"
                >
                  {building.title}
                </h2>
                <p className="user-text text-ink-2 m-0 max-w-[62ch] text-[16px] leading-relaxed">
                  {building.problem?.problem ?? own?.problem}
                </p>
              </div>

              {own ? (
                <dl className="m-0 grid gap-4">
                  {(['person', 'promise'] as const).map((key) => (
                    <div key={key} className="grid gap-1">
                      <dt className="meta text-[11px]">{page.threeP[key]}</dt>
                      <dd className="user-text text-ink-1 m-0 text-[15px] leading-relaxed">
                        {own[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {state === 'changes' && entry?.answer ? (
                <div className="grid gap-2">
                  <p className="meta m-0">{ownProblem.note(entry.answer.by)}</p>
                  <Answers items={[entry.answer]} />
                </div>
              ) : null}

              {scope ? (
                <div className="grid gap-3">
                  <h3 className="meta m-0">{problemCopy.expect}</h3>
                  <Bullets items={scope.expect} label={problemCopy.expect} />
                </div>
              ) : null}

              <div className="grid gap-3">
                <h3 className="meta m-0">{copy.floor}</h3>
                <Bullets items={problemCopy.everyone.list} label={problemCopy.everyone.title} />
                <p className="text-ink-2 m-0 text-[14px]">{problemCopy.everyone.beyond}</p>
              </div>

              {scope?.further.length ? (
                <div className="grid gap-3">
                  <h3 className="meta m-0">{problemCopy.further}</h3>
                  <Bullets items={scope.further} label={problemCopy.further} tone="quiet" />
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="grid content-start gap-5 lg:sticky lg:top-24 lg:self-start">
          <section className="panel hidden p-5 lg:block" aria-label={copy.progressLabel}>
            <ProgressTrack value={context.progress} parts={context.parts} />
          </section>
          {!building && !bank ? (
            <PersonCard name={entry?.reviewer ?? ''} kicker={copy.reviewerKicker}>
              {copy.reviewerLead}
            </PersonCard>
          ) : null}
          <PersonCard name={entry?.poc ?? ''}>{copy.pocLead}</PersonCard>
          {missed ? <p className="text-ink-2 m-0 text-[14px]">{copy.missed}</p> : null}
          {building ? <p className="text-ink-3 m-0 text-[13px]">{copy.n8n}</p> : null}
        </aside>
      </div>
    </BuildShell>
  )
}
