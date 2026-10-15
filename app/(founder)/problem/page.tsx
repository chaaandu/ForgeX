import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { OwnProblemForm } from '@/components/problem/OwnProblemForm'
import { Answers, OwnProblemView } from '@/components/problem/OwnProblemView'
import { ProblemPanel } from '@/components/problem/ProblemPanel'
import { Refresh } from '@/components/ui/Refresh'
import { meta, ownProblem as copy } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { researchDone } from '@/lib/data/hackathon'
import { closeLabel } from '@/lib/dates'
import { clock, HACKATHON, phaseAt } from '@/lib/hackathon'
import { currentPath } from '@/lib/journey'
import { requireFounder } from '@/lib/session'
import { nextDue, stepsFor } from '@/lib/steps'

export const metadata: Metadata = { title: meta.pages.problem }

/**
 * A founder's own problem: the form to send it, where it stands once sent,
 * every answer it has had, and the way back in while it can still change.
 * When the window has closed without an approved problem, the way to the bank.
 */
export default async function ProblemPage() {
  const { founder } = await requireFounder()
  if (founder.level < 3) redirect(currentPath(founder))
  const context = await founderContext(founder)
  const entry = context.entry
  const state = entry?.state ?? 'none'
  if (state === 'bank') redirect('/build')

  const now = clock()
  const phase = phaseAt(now)
  const mayWrite = phase.problemsOpen || Boolean(entry?.reopened.has('problem'))
  const reviewer = entry?.reviewer || copy.someone
  const steps = stepsFor(
    {
      state,
      sentAt: entry?.sentAt ?? { scope: '', prototype: '', launch: '', pitch: '' },
      fields: entry?.fields ?? {},
      reopened: entry ? [...entry.reopened] : [],
      researchDone: entry ? researchDone(entry) : false,
      answered: Boolean(founder.world),
    },
    phase,
  )
  const toBank = phase.bankOpen ? (founder.world ? '/matches' : '/world') : null

  const banner = (() => {
    if (state === 'waiting') return { ...copy.states.waiting, lead: copy.states.waiting.lead(reviewer) }
    if (state === 'approved') return copy.states.approved
    if (state === 'changes') return copy.states.changes
    if (state === 'rejected') return mayWrite ? copy.states.rejected : copy.states.rejectedClosed
    if (!mayWrite) return copy.states.closed
    return null
  })()
  const latest = entry?.latest ?? null
  const initial = {
    industry: latest?.industry ?? ('other' as const),
    industryOther: latest?.industryOther ?? '',
    title: latest?.title ?? '',
    person: latest?.person ?? '',
    problem: latest?.problem ?? '',
    promise: latest?.promise ?? '',
    plan: latest?.plan ?? '',
    primary: latest?.primary ?? '',
    secondary: latest?.secondary ?? '',
  }

  return (
    <BuildShell slug={founder.slug} next={nextDue(steps, phase)} now={now.toISOString()}>
      {state === 'waiting' ? <Refresh /> : null}
      <div className="grid max-w-[760px] gap-10">
        <div className="grid gap-3">
          <h1 className="page-title m-0">{banner?.title ?? copy.title}</h1>
          <p className="text-lead text-ink-2 m-0">{banner?.lead ?? copy.lead}</p>
          {mayWrite && (state === 'none' || state === 'waiting' || state === 'rejected') ? (
            <p className="text-ink-2 m-0 text-[15px]">
              {copy.due(closeLabel(HACKATHON.problemsClose))}{' '}
              {entry?.reviewer ? (
                <strong className="text-ink-1 font-semibold italic">
                  {copy.reviewer(entry.reviewer)}
                </strong>
              ) : null}
            </p>
          ) : null}
          {!mayWrite && (state === 'none' || state === 'rejected') ? (
            <div className="pt-2">
              {toBank ? (
                <Link href={toBank} className="btn btn-primary press">
                  {copy.bank}
                </Link>
              ) : (
                <p className="text-ink-2 m-0">{copy.bankSoon(closeLabel(HACKATHON.bankOpens))}</p>
              )}
            </div>
          ) : null}
        </div>

        {latest && entry ? (
          <ProblemPanel
            initial={initial}
            editable={mayWrite && (state === 'waiting' || state === 'rejected')}
            startEditing={state === 'rejected'}
            notice={<Answers items={entry.reviews.filter((item) => item.version === latest.version)} />}
            view={
              <OwnProblemView latest={latest} versions={entry.versions} reviews={entry.reviews} />
            }
          />
        ) : mayWrite ? (
          <OwnProblemForm initial={null} again={false} />
        ) : null}
      </div>
    </BuildShell>
  )
}
