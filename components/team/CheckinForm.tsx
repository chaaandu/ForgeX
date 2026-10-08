'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addCheckin } from '@/app/actions/team'
import { page } from '@/content/copy'

const copy = page.checkins

/** A note from a 1:1 check-in. The team's alone. */
export function CheckinForm({ email }: { email: string }) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()
  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        start(async () => {
          setFailed(false)
          const result = await addCheckin({ email, notes })
          if (result.ok) {
            setNotes('')
            router.refresh()
          } else setFailed(true)
        })
      }}
    >
      <label htmlFor="checkin" className="meta">
        {copy.label}
      </label>
      <textarea
        id="checkin"
        className="field min-h-[96px]"
        value={notes}
        maxLength={2000}
        placeholder={copy.placeholder}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="btn btn-secondary press"
          disabled={pending || !notes.trim()}
        >
          {copy.add}
        </button>
        {failed ? (
          <p role="alert" className="text-error m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </form>
  )
}
