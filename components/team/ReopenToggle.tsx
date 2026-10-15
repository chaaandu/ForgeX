'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { reopen } from '@/app/actions/team'
import { page } from '@/content/copy'
import type { StepId } from '@/lib/hackathon'

const copy = page.reopen
const STEPS: StepId[] = ['problem', 'prototype', 'launch', 'pitch']

/**
 * Opens one deadline again for one founder, or closes it. Super admin only,
 * and only for a deadline that has passed. The same switches are the Reopened
 * cell on their row, which lists the steps in words.
 */
export function ReopenToggle({
  slug,
  open,
  passed,
}: {
  slug: string
  open: StepId[]
  /** The deadlines that have passed: only these can be reopened. */
  passed: StepId[]
}) {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()
  return (
    <div className="border-line grid gap-3 border-t pt-5">
      <p className="text-ink-1 m-0 text-[15px] font-medium">{copy.title}</p>
      <div className="flex flex-wrap gap-2">
        {STEPS.filter((step) => passed.includes(step) || open.includes(step)).map((step) => {
          const on = open.includes(step)
          return (
            <button
              key={step}
              type="button"
              className="btn btn-secondary press min-h-10"
              disabled={pending}
              aria-pressed={on}
              onClick={() =>
                start(async () => {
                  const result = await reopen({ slug, step, open: !on })
                  setFailed(!result.ok)
                  if (result.ok) router.refresh()
                })
              }
            >
              {on ? copy.close(copy.steps[step]) : copy.open(copy.steps[step])}
            </button>
          )
        })}
      </div>
      <p className={`m-0 text-[14px] ${failed ? 'text-error' : 'text-ink-2'}`} aria-live="polite">
        {failed
          ? copy.failed
          : open.length
            ? copy.on(open.map((step) => copy.steps[step]).join(', '))
            : null}
      </p>
    </div>
  )
}
