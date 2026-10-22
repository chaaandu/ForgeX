import type { ReactNode } from 'react'
import { Brand } from '@/components/shell/Brand'
import { home as copy, submit as submitCopy } from '@/content/copy'
import type { StepId } from '@/lib/hackathon'
import { BuildNav } from './BuildNav'
import { Countdown } from './Countdown'

/**
 * The frame for everything after onboarding: where a founder is, and how long
 * is left until their next deadline. The clock is the only thing in the
 * header that changes, so it is the only thing in violet. No sign out: a
 * founder mid-build has nowhere better to be.
 */
/** Founders see no dates or countdowns any more; kept off rather than removed. */
const showClock = false

export function BuildShell({
  slug,
  next,
  now,
  ownProblem = true,
  children,
}: {
  slug: string
  /** The next deadline still open for this founder, or null once all have passed. */
  next: { step: StepId; at: string } | null
  now: string
  /** Show My problem in the nav: not for a founder who picked from the bank. */
  ownProblem?: boolean
  children: ReactNode
}) {
  const label =
    next?.step === 'problem' ? copy.steps.problem.name : next ? submitCopy.titles[next.step] : ''
  return (
    <div className="min-h-dvh">
      <header className="border-line bg-ground/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:flex-nowrap md:px-10">
          <Brand />
          <div className="order-last -mx-1 w-full md:order-none md:mx-0 md:mr-auto md:w-auto">
            <BuildNav slug={slug} ownProblem={ownProblem} />
          </div>
          {/* No countdown: no step has a deadline a founder sees. */}
          {showClock && next ? (
            <p className="m-0 flex items-baseline gap-2 font-mono text-[13px]" role="timer">
              <span className="text-ink-3">{label}</span>
              <span className="text-violet-ink">
                <Countdown closes={next.at} now={now} />
              </span>
            </p>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 pt-10 pb-28 md:px-10 md:pt-14">{children}</main>
    </div>
  )
}
