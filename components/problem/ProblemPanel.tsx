'use client'

import { useState, type ReactNode } from 'react'
import { ownProblem as copy } from '@/content/copy'
import type { OwnProblem } from '@/lib/own-problem'
import { OwnProblemForm } from './OwnProblemForm'

/**
 * A problem that has been sent, with the way back into the form when it can
 * still change: while it waits for review, or after a rejection before the
 * window closes.
 */
export function ProblemPanel({
  view,
  notice,
  initial,
  editable,
  startEditing,
}: {
  view: ReactNode
  /** Shown above the form when it opens by itself: the note that asked for the change. */
  notice?: ReactNode
  initial: OwnProblem
  editable: boolean
  /** Open on the form: a rejected problem, which needs changing. */
  startEditing: boolean
}) {
  const [editing, setEditing] = useState(editable && startEditing)
  if (editing)
    return (
      <div className="grid gap-8">
        {startEditing ? notice : null}
        <OwnProblemForm
          initial={initial}
          again
          onSent={() => setEditing(false)}
          onCancel={startEditing ? undefined : () => setEditing(false)}
        />
      </div>
    )
  return (
    <div className="grid gap-8">
      {editable ? (
        <div>
          <button type="button" className="btn btn-secondary press" onClick={() => setEditing(true)}>
            {copy.edit}
          </button>
        </div>
      ) : null}
      {view}
    </div>
  )
}
