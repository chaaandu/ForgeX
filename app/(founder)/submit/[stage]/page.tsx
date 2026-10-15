import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { StageForm } from '@/components/build/StageForm'
import { submit as copy } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { researchDone } from '@/lib/data/hackathon'
import { closeLabel } from '@/lib/dates'
import { clock, dueOf, phaseAt, STAGE_IDS, type StageId } from '@/lib/hackathon'
import { currentPath } from '@/lib/journey'
import { mayBuild } from '@/lib/own-problem'
import { requireFounder } from '@/lib/session'
import { nextDue, stepsFor } from '@/lib/steps'

const isStage = (value: string): value is StageId => (STAGE_IDS as readonly string[]).includes(value)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>
}): Promise<Metadata> {
  const { stage } = await params
  return { title: isStage(stage) ? copy.titles[stage] : undefined }
}

/** One of the three submissions after the problem: the prototype, the launch, the pitch. */
export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params
  if (!isStage(stage)) notFound()
  const { founder } = await requireFounder()
  if (founder.level < 3) redirect(currentPath(founder))
  const context = await founderContext(founder)
  const entry = context.entry
  // Nothing to submit until there is a problem to build.
  if (!entry || !mayBuild(entry.state)) redirect('/build')
  const now = clock()
  const phase = phaseAt(now)
  const reopened = entry.reopened.has(stage)
  const steps = stepsFor(
    {
      state: entry.state,
      sentAt: entry.sentAt,
      fields: entry.fields,
      reopened: [...entry.reopened],
      researchDone: researchDone(entry),
      answered: Boolean(founder.world),
    },
    phase,
  )
  return (
    <BuildShell
      slug={founder.slug}
      next={nextDue(steps, phase)}
      now={now.toISOString()}
      ownProblem={entry.state !== 'bank'}
    >
      <StageForm
        key={stage}
        stage={stage}
        initial={entry.fields}
        sent={Boolean(entry.sentAt[stage])}
        locked={phase.locked[stage] && !reopened}
        reopened={reopened && phase.locked[stage]}
        closesAt={closeLabel(dueOf(stage))}
      />
    </BuildShell>
  )
}
