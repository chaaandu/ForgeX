'use client'

import { Pencil } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { profile as copy } from '@/content/copy'

export type SaveResult = { ok: true } | { ok: false; message: string }

/**
 * Text that becomes an input when you touch it, and saves when you leave it.
 * Enter saves a single line, Escape puts it back. The read state is the
 * design; the edit state is a quiet underline, so a profile reads like a
 * page rather than a form.
 */
export function InlineField({
  label,
  value,
  placeholder,
  multiline = false,
  maxLength,
  display,
  className = '',
  onSave,
  error: outerError,
  inputRef,
  emptyLabel,
  openKey = 0,
}: {
  label: string
  value: string
  placeholder: string
  multiline?: boolean
  maxLength?: number
  display?: (value: string) => string
  className?: string
  onSave: (value: string) => Promise<SaveResult>
  error?: string | null
  inputRef?: React.RefObject<HTMLButtonElement | null>
  /** An invitation instead of "Not added yet": one tap and the field is open. */
  emptyLabel?: string
  /** Bump to open the field from outside, for example when it is required. */
  openKey?: number
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const id = useId()

  useEffect(() => setDraft(value), [value])
  useEffect(() => {
    if (openKey > 0) setEditing(true)
  }, [openKey])
  useEffect(() => {
    if (editing) field.current?.focus()
  }, [editing])

  async function commit() {
    const next = draft.trim()
    if (next === value.trim()) {
      setEditing(false)
      return
    }
    setState('saving')
    const result = await onSave(next)
    if (result.ok) {
      setError(null)
      setEditing(false)
      setState('saved')
      window.setTimeout(() => setState('idle'), 1400)
    } else {
      setError(result.message)
      setState('idle')
      field.current?.focus()
    }
  }

  const shown = error ?? outerError
  const status = state === 'saving' ? copy.saving : state === 'saved' ? copy.saved : null

  return (
    <div className={`group grid gap-1 ${className}`}>
      {editing ? (
        multiline ? (
          <textarea
            id={id}
            ref={field}
            aria-label={label}
            className="inline-edit min-h-[3.2em] resize-none"
            value={draft}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void commit()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDraft(value)
                setEditing(false)
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void commit()
              }
            }}
            rows={3}
          />
        ) : (
          <input
            id={id}
            ref={field}
            aria-label={label}
            className="inline-edit"
            value={draft}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => void commit()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDraft(value)
                setEditing(false)
              }
              if (event.key === 'Enter') void commit()
            }}
          />
        )
      ) : (
        <button
          type="button"
          ref={inputRef}
          className="inline-read press text-left"
          aria-label={
            !value && emptyLabel ? emptyLabel : copy.fieldEdit(label, value || placeholder)
          }
          onClick={() => setEditing(true)}
        >
          {!value && emptyLabel ? (
            <span className="text-violet-ink font-sans text-[16px] not-italic underline decoration-1 underline-offset-4">
              {emptyLabel}
            </span>
          ) : (
            <>
              <span className={value ? '' : 'text-ink-3'}>
                {value ? (display ? display(value) : value) : copy.empty}
              </span>
              <Pencil size={14} strokeWidth={1.5} className="inline-pen" aria-hidden="true" />
            </>
          )}
        </button>
      )}
      <span className="min-h-[18px] font-sans text-[13px] not-italic" aria-live="polite">
        {shown ? (
          <span className="text-violet-ink">{shown}</span>
        ) : status ? (
          <span className="meta">{status}</span>
        ) : null}
      </span>
    </div>
  )
}
