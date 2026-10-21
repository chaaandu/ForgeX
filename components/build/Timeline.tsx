import { Check, Lock } from 'lucide-react'
import { GoLink } from '@/components/ui/GoLink'
import { home as copy } from '@/content/copy'
import { closeLabel } from '@/lib/dates'
import { HACKATHON, SOFT_STAGES, type Phase, type StageId } from '@/lib/hackathon'
import { stampToIso } from '@/lib/stamp'
import type { StepView } from '@/lib/steps'

const tone: Record<StepView['state'], string> = {
  todo: 'text-ink-2',
  locked: 'text-ink-3',
  waiting: 'text-violet-ink',
  approved: 'text-ok',
  changes: 'text-ok',
  rejected: 'text-error',
  bank: 'text-ok',
  started: 'text-violet-ink',
  done: 'text-ok',
  missed: 'text-error',
}

/** The label at the top right of a step. A problem never sent is "Not sent", not "Missed". */
function label(step: StepView): string {
  if (step.id === 'problem' && step.state === 'missed') return copy.states.notSent
  return copy.states[step.state]
}

/**
 * The line under a step: what is happening, and what to do next. It changes
 * with where the founder stands, so a problem in review never reads as approved.
 */
function line(
  step: StepView,
  reviewer: string,
  answeredBy: string,
  sentAt: Record<StageId, string>,
  phase: Phase,
) {
  const words = copy.lines
  if (step.id === 'problem') {
    const closed = phase.bankOpen
      ? words.problem.closed
      : words.problem.closedSoon(closeLabel(HACKATHON.bankOpens))
    // Reopened by the super admin for a change already agreed.
    if ((step.state === 'bank' && step.action === 'write') || step.action === 'change')
      return words.problem.reopened
    switch (step.state) {
      case 'todo':
        return words.problem.todo
      case 'waiting':
        return words.problem.waiting(reviewer)
      case 'approved':
        return words.problem.approved(answeredBy)
      case 'changes':
        return words.problem.changes(answeredBy)
      case 'rejected':
        return step.action === 'fix' ? words.problem.rejected(answeredBy) : closed
      case 'bank':
        return step.action ? words.problem.bank : words.problem.bankDone
      default:
        return closed
    }
  }
  const stage = step.id
  if (step.state === 'locked') return words.locked
  if (step.state === 'missed') return words.missed
  if (step.state === 'done') {
    const when = closeLabel(stampToIso(sentAt[stage]))
    if (step.action !== 'change') return words.sent(when)
    return SOFT_STAGES.includes(stage)
      ? words.sentSoft(when)
      : words.sentOpen(when, closeLabel(step.due))
  }
  return copy.steps[stage].line
}

/** The deadline under a step, only while it still asks something of the founder. */
function dateLine(step: StepView): string | null {
  if (step.id === 'problem') {
    const open = step.state === 'todo' || step.state === 'waiting' || step.action === 'fix'
    return open ? copy.approveBy(closeLabel(step.due)) : null
  }
  const open = step.state === 'locked' || step.state === 'todo' || step.state === 'started'
  return open ? copy.due(closeLabel(step.due)) : null
}

/**
 * The five steps, in order, each with where it stands, what to do and when,
 * and the one thing to press. The step to do now carries the violet: nothing
 * else on the page competes with it.
 */
export function Timeline({
  steps,
  reviewer,
  answeredBy,
  sentAt,
  phase,
}: {
  steps: StepView[]
  /** Their reviewer's name, or empty until the team names one. */
  reviewer: string
  /** Who gave the newest answer, which may not be their reviewer. */
  answeredBy?: string
  sentAt: Record<StageId, string>
  phase: Phase
}) {
  const who = reviewer || copy.lines.reviewer
  return (
    <ol className="m-0 grid list-none gap-3 p-0" aria-label={copy.next}>
      {steps.map((step, index) => {
        const finished =
          step.state === 'done' ||
          step.state === 'approved' ||
          step.state === 'changes' ||
          (step.state === 'bank' && !step.action)
        const date = dateLine(step)
        return (
          <li
            key={step.id}
            aria-current={step.current ? 'step' : undefined}
            className={`grid grid-cols-[36px_minmax(0,1fr)] gap-4 rounded-[var(--radius-card)] p-5 ${step.current ? 'bg-violet/10 shadow-[inset_0_0_0_1px_var(--color-violet)]' : 'shadow-[inset_0_0_0_1px_var(--color-line)]'}`}
          >
            <span
              aria-hidden="true"
              className={`grid size-9 place-items-center rounded-full font-mono text-[13px] ${finished ? 'bg-ok/15 text-ok' : step.state === 'locked' ? 'text-ink-3 bg-white/[0.04]' : 'bg-violet/20 text-violet-ink'}`}
            >
              {finished ? (
                <Check size={16} strokeWidth={2} />
              ) : step.state === 'locked' ? (
                <Lock size={14} strokeWidth={1.5} />
              ) : (
                index + 1
              )}
            </span>
            <div className="grid min-w-0 gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="display m-0 text-[22px] leading-tight">
                  {copy.steps[step.id].name}
                </h3>
                <span className={`text-[13px] font-medium ${tone[step.state]}`}>{label(step)}</span>
              </div>
              <p className="text-ink-2 m-0 text-[14px]">
                {line(step, who, answeredBy || who, sentAt, phase)}
              </p>
              {date || (step.href && step.action) ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-ink-3 font-mono text-[12px]">{date}</span>
                  {step.href && step.action ? (
                    <GoLink
                      href={step.href}
                      pending={copy.opening}
                      className={`btn press min-h-10 ${step.current ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {step.id === 'problem' && step.action === 'add'
                        ? copy.actions.research
                        : copy.actions[step.action]}
                    </GoLink>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
