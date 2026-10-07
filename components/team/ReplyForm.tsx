'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState, useTransition } from 'react'
import { respond } from '@/app/actions/team'
import { consoleCopy } from '@/content/copy'

const copy = consoleCopy.queue
const TYPES = ['go', 'tweak', 'talk', 'another'] as const
type Type = (typeof TYPES)[number]

/**
 * The four answers, a note and Send reply. The same form answers a waiting
 * why in the queue and sends a new reply to one already answered, so the
 * team only ever learns one way to reply.
 */
export function ReplyForm({
  pickId,
  bank,
  onCancel,
  onSent,
}: {
  pickId: string
  bank: { id: string; title: string }[]
  onCancel?: () => void
  onSent?: () => void
}) {
  const router = useRouter()
  const [type, setType] = useState<Type | null>(null)
  const [note, setNote] = useState('')
  const [suggested, setSuggested] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const noteRef = useRef<HTMLTextAreaElement>(null)

  function send() {
    if (!type) return
    if (type === 'tweak' && !note.trim()) {
      setMessage(copy.noteNeeded)
      noteRef.current?.focus()
      return
    }
    start(async () => {
      const result = await respond({
        pickId,
        type,
        note,
        suggested: type === 'another' ? suggested : [],
      })
      if (result.ok) {
        setMessage(copy.sent)
        onSent?.()
        router.refresh()
      } else setMessage(copy.failed)
    })
  }

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return bank
      .filter(
        (problem) => problem.title.toLowerCase().includes(q) && !suggested.includes(problem.id),
      )
      .slice(0, 6)
  }, [bank, search, suggested])

  return (
    <section className="grid gap-4" aria-label={copy.respond}>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={copy.responseType}>
        {TYPES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={type === value}
            className="chip press"
            onClick={() => setType(value)}
          >
            {copy.types[value]}
          </button>
        ))}
      </div>
      <label className="grid gap-2">
        <span className="meta">{copy.note}</span>
        <textarea
          ref={noteRef}
          className="field min-h-[120px]"
          value={note}
          maxLength={2000}
          placeholder={copy.notePlaceholder}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      {type === 'another' ? (
        <div className="grid gap-2">
          <span className="meta">{copy.suggest}</span>
          <div className="flex flex-wrap gap-2">
            {suggested.map((id) => (
              <button
                key={id}
                type="button"
                className="chip press"
                aria-pressed="true"
                onClick={() => setSuggested((list) => list.filter((value) => value !== id))}
              >
                {bank.find((problem) => problem.id === id)?.title ?? id} ×
              </button>
            ))}
          </div>
          <input
            className="field"
            placeholder={copy.suggestPlaceholder}
            aria-label={copy.suggestPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {matches.length ? (
            <ul className="m-0 grid list-none gap-1 p-0" aria-label={copy.suggestResults}>
              {matches.map((problem) => (
                <li key={problem.id}>
                  <button
                    type="button"
                    className="press text-ink-1 w-full rounded-lg border-0 bg-white/5 px-3 py-2 text-left text-[14px] hover:bg-white/10"
                    onClick={() => setSuggested((list) => [...list, problem.id].slice(0, 6))}
                  >
                    {problem.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="btn btn-primary press min-w-[140px]"
          disabled={!type || pending}
          onClick={send}
        >
          {copy.send}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn-quiet press" onClick={onCancel}>
            {copy.cancel}
          </button>
        ) : null}
        {message ? (
          <p className="text-ink-2 m-0 text-[14px]" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  )
}
