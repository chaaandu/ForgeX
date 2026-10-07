'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { reviewStop } from '@/app/actions/team'
import { consoleCopy } from '@/content/copy'

const copy = consoleCopy.stops
const RATINGS = ['green', 'amber', 'red'] as const
type Rating = (typeof RATINGS)[number]

const COLOUR: Record<Rating, string> = {
  green: 'var(--color-ok)',
  amber: 'var(--color-legendary)',
  red: 'var(--color-mythic)',
}

/** Green, amber or red, notes, and a fix list, one fix per line. */
export function ReviewForm({
  email,
  stop,
  initial,
}: {
  email: string
  stop: '1' | '2' | '3'
  initial: { rating: Rating | null; notes: string; fixes: string[] } | null
}) {
  const router = useRouter()
  const [rating, setRating] = useState<Rating | null>(initial?.rating ?? null)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [fixes, setFixes] = useState((initial?.fixes ?? []).join('\n'))
  const [status, setStatus] = useState<'idle' | 'saved' | 'failed'>('idle')
  const [pending, start] = useTransition()
  const id = `review-${stop}-${email}`
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!rating) return
        start(async () => {
          setStatus('idle')
          const result = await reviewStop({
            email,
            stop,
            rating,
            notes,
            fixes: fixes
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
          })
          if (result.ok) {
            setStatus('saved')
            router.refresh()
          } else setStatus('failed')
        })
      }}
    >
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={copy.rating}>
        {RATINGS.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={rating === item}
            className="chip press min-h-9 text-[13px]"
            onClick={() => {
              setStatus('idle')
              setRating(item)
            }}
          >
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ background: COLOUR[item] }}
              aria-hidden="true"
            />
            {copy.ratings[item]}
          </button>
        ))}
      </div>
      <label htmlFor={`${id}-notes`} className="meta">
        {copy.notes}
      </label>
      <textarea
        id={`${id}-notes`}
        className="field min-h-[88px] text-[15px]"
        value={notes}
        maxLength={2000}
        placeholder={copy.notesPlaceholder}
        onChange={(event) => setNotes(event.target.value)}
      />
      <label htmlFor={`${id}-fixes`} className="meta">
        {copy.fixes}
      </label>
      <span className="text-ink-3 -mt-2 text-[13px]">{copy.fixesHint}</span>
      <textarea
        id={`${id}-fixes`}
        className="field min-h-[88px] text-[15px]"
        value={fixes}
        maxLength={2400}
        placeholder={copy.fixesPlaceholder}
        onChange={(event) => setFixes(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary press" disabled={pending || !rating}>
          {pending ? copy.saving : copy.save}
        </button>
        {status === 'saved' ? (
          <p role="status" className="text-ink-2 m-0 text-[14px]">
            {copy.saved}
          </p>
        ) : status === 'failed' ? (
          <p role="alert" className="text-violet-ink m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </form>
  )
}
