import { Check, Lock } from 'lucide-react'
import { GoLink } from '@/components/ui/GoLink'
import { home as copy } from '@/content/copy'
import { closeLabel } from '@/lib/dates'
import { SOFT_STAGES, type StageId } from '@/lib/hackathon'
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

/**
 * The four steps, in order, each with where it stands, when it is due and the
 * one thing to press. The step to do now carries the violet: nothing else on
 * the page competes with it.
 */
export function Timeline({ steps, bank }: { steps: StepView[]; bank: boolean }) {
  return (
    <ol className="m-0 grid list-none gap-3 p-0" aria-label={copy.next}>
      {steps.map((step, index) => {
        const finished =
          step.state === 'done' ||
          step.state === 'approved' ||
          step.state === 'changes' ||
          (step.state === 'bank' && !step.action)
        const words =
          step.id !== 'problem'
            ? copy.steps[step.id]
            : bank
              ? copy.steps[finished ? 'bankDone' : 'bank']
              : copy.steps.problem
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
                <h3 className="display m-0 text-[22px] leading-tight">{words.name}</h3>
                <span className={`text-[13px] font-medium ${tone[step.state]}`}>
                  {copy.states[step.state]}
                </span>
              </div>
              <p className="text-ink-2 m-0 text-[14px]">{words.line}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* A bank pick never had the problem deadline to meet. */}
                <span className="text-ink-3 font-mono text-[12px]">
                  {step.state === 'bank'
                    ? null
                    : step.id === 'problem'
                      ? copy.approveBy(closeLabel(step.due))
                      : SOFT_STAGES.includes(step.id as StageId)
                        ? copy.addBy(closeLabel(step.due))
                        : copy.due(closeLabel(step.due))}
                </span>
                {step.href && step.action ? (
                  <GoLink
                    href={step.href}
                    pending={copy.opening}
                    className={`btn press min-h-10 ${step.current ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {copy.actions[step.action]}
                  </GoLink>
                ) : null}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
