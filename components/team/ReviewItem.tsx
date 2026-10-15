'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { review } from '@/app/actions/team'
import { OwnProblemView } from '@/components/problem/OwnProblemView'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy } from '@/content/copy'
import { DECISIONS, needsNote, type Decision } from '@/lib/own-problem'
import { labelOf } from '@/lib/taxonomy'

const copy = consoleCopy.reviews

type Version = {
  version: number
  time: string
  industry: string
  /** Their own word, when the industry is Other. */
  industryOther?: string
  title: string
  person: string
  problem: string
  promise: string
  why: string
  plan: string
  primary: string
  secondary: string
}
type Answer = { version: number; time: string; decision: Decision; by: string; notes: string }

export type ReviewEntry = {
  slug: string
  name: string
  photo: string
  reviewer: string
  latest: Version
  versions: Version[]
  reviews: Answer[]
  /** The answer the newest version has, if any. */
  answer: Answer | null
  /** This viewer may answer: their reviewer, any reviewer if none is set, or the super admin. */
  canDecide: boolean
}

/**
 * One founder's problem as a reviewer reads it: who sent it, every version
 * and answer so far, and three answers to choose from. Approve with changes
 * and reject both need a note, because the founder acts on it. Someone who
 * may not answer sees the same page, read only.
 */
export function ReviewItem({ item, readOnlyNote }: { item: ReviewEntry; readOnlyNote: string }) {
  const router = useRouter()
  const [decision, setDecision] = useState<Decision | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<'note' | 'failed' | null>(null)
  const [changing, setChanging] = useState(!item.answer)
  const [pending, start] = useTransition()

  function send() {
    if (!decision) return
    if (needsNote(decision) && !notes.trim()) {
      setError('note')
      return
    }
    start(async () => {
      setError(null)
      const result = await review({
        slug: item.slug,
        version: item.latest.version,
        decision,
        notes: notes.trim(),
      })
      if (result.ok) {
        setDecision(null)
        setNotes('')
        router.refresh()
      } else setError('failed')
    })
  }

  return (
    <article className="panel grid gap-6 p-6 md:p-8" aria-labelledby={`review-${item.slug}`}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href={`/f/${item.slug}`} className="text-ink-1 hover:text-violet-ink flex items-center gap-3 no-underline">
          <Avatar src={item.photo} size={44} />
          <span id={`review-${item.slug}`} className="display text-[24px] leading-tight">
            {item.name}
          </span>
        </Link>
        <span className="meta flex flex-wrap gap-3 text-[11px]">
          <span>{item.latest.industryOther || labelOf.industryShort(item.latest.industry)}</span>
          {item.reviewer ? <span>{item.reviewer}</span> : null}
        </span>
      </header>

      <OwnProblemView latest={item.latest} versions={item.versions} reviews={item.reviews} />

      {item.canDecide ? (
        changing ? (
          <div className="border-line grid gap-4 border-t pt-6">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={copy.decision}>
              {DECISIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={decision === value}
                  className="chip press"
                  onClick={() => {
                    setDecision(value)
                    setError(null)
                  }}
                >
                  {copy.decisions[value]}
                </button>
              ))}
            </div>
            <label className="grid gap-2">
              <span className="text-ink-1 text-[14px] font-medium">{copy.note}</span>
              <textarea
                className="field min-h-[110px]"
                value={notes}
                maxLength={3000}
                placeholder={copy.notePlaceholder}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-primary press"
                disabled={!decision || pending}
                onClick={send}
              >
                {pending ? copy.sending : copy.send}
              </button>
              {error ? (
                <span role="alert" className="text-error text-[14px]">
                  {error === 'note' ? copy.noteNeeded : copy.failed}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="border-line border-t pt-5">
            <button type="button" className="btn btn-secondary press" onClick={() => setChanging(true)}>
              {copy.change}
            </button>
          </div>
        )
      ) : (
        <p className="border-line text-ink-3 m-0 border-t pt-5 text-[14px]">{readOnlyNote}</p>
      )}
    </article>
  )
}
