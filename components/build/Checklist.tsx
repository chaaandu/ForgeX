'use client'

import { Check, ChevronRight } from 'lucide-react'
import { submit as copy } from '@/content/copy'
import type { SubmissionField, SubmissionFields } from '@/lib/submission'

/**
 * What a stage needs, and what is in so far. Every row jumps to its field, so
 * the list is the way in, not a row of boxes that look tickable and are not.
 */
export function Checklist({
  ids,
  fields,
  closesAt,
  onPick,
}: {
  ids: SubmissionField[]
  fields: SubmissionFields
  closesAt: string
  onPick: (id: SubmissionField) => void
}) {
  const added = ids.filter((id) => fields[id]).length
  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h2 id="to-submit" className="display m-0 text-[24px] leading-tight">
          {copy.list}
        </h2>
        <p className="text-ink-2 m-0 text-[15px]">
          {copy.listLead(ids.length, closesAt)}{' '}
          <span className="text-ink-1">{copy.added(added, ids.length)}</span>
        </p>
      </div>
      <ul className="m-0 grid list-none gap-0 p-0" aria-labelledby="to-submit">
        {ids.map((id) => {
          const done = Boolean(fields[id])
          return (
            <li key={id}>
              <button
                type="button"
                className="press border-line text-ink-1 grid w-full cursor-pointer grid-cols-[22px_1fr_auto] items-center gap-3 border-0 border-t bg-transparent py-3 text-left text-[15px] hover:bg-white/[0.03]"
                onClick={() => onPick(id)}
              >
                <span
                  className={`grid h-[22px] w-[22px] place-items-center rounded-full ${done ? 'bg-violet text-on-violet' : 'shadow-[inset_0_0_0_1px_var(--color-line-2)]'}`}
                  aria-hidden="true"
                >
                  {done ? <Check size={13} strokeWidth={2.5} /> : null}
                </span>
                <span className={done ? 'text-ink-2' : 'text-ink-1'}>{copy.fields[id].label}</span>
                <span
                  className={`flex items-center gap-1 text-[13px] ${done ? 'text-ink-3' : 'text-violet-ink'}`}
                >
                  {done ? copy.done : copy.todo}
                  <ChevronRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
