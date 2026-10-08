'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveStop } from '@/app/actions/founder'
import { plan as planCopy, stops as copy } from '@/content/copy'
import type { FounderStopField } from '@/lib/steps'
import type { StretchOption } from './StepList'

type Stretch = { picked: string[]; own: string }

function readStretch(value: string): Stretch {
  try {
    const raw = JSON.parse(value) as Partial<Stretch>
    return { picked: Array.isArray(raw.picked) ? raw.picked : [], own: raw.own ?? '' }
  } catch {
    return { picked: [], own: '' }
  }
}

const count = (stretch: Stretch) => stretch.picked.length + (stretch.own.trim() ? 1 : 0)

function complete(field: FounderStopField, value: string): boolean {
  if (field.optional) return true
  if (field.kind === 'stretch') return count(readStretch(value)) === 2
  return value.trim().length > 0
}

/**
 * One stop's form: exactly the fields this founder's plan asks for, started
 * from what they already gave in their steps. Save a draft any time; send
 * before 6 pm. Once locked, it shows what the team sees and nothing to press.
 */
export function StopForm({
  stop,
  fields,
  initial,
  stretch,
  sent,
  locked,
}: {
  stop: 1 | 2 | 3
  fields: FounderStopField[]
  initial: Record<string, string>
  stretch: StretchOption[]
  sent: boolean
  locked: boolean
}) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'saved' | 'sent' | 'failed' | 'locked' | 'order'>(
    'idle',
  )
  const [pending, start] = useTransition()
  const ready = fields.every((field) => complete(field, values[field.id] ?? ''))

  const set = (id: string, value: string) => {
    setStatus('idle')
    setErrors((current) => ({ ...current, [id]: '' }))
    setValues((current) => ({ ...current, [id]: value }))
  }

  function message(field: FounderStopField, problem: string): string {
    if (problem === 'required') return copy.required
    if (field.kind === 'link') return planCopy.badLink[field.link]
    if (field.kind === 'number') return planCopy.badNumber
    return copy.failed
  }

  function save(send: boolean) {
    start(async () => {
      setStatus('idle')
      const result = await saveStop({ stop, fields: values, send })
      if (result.ok) {
        setValues((current) => ({ ...current, ...result.fields }))
        setErrors({})
        setStatus(send || sent ? 'sent' : 'saved')
        router.refresh()
      } else if (result.error === 'locked') setStatus('locked')
      else if (result.error === 'order') setStatus('order')
      else {
        setErrors(result.fields ?? {})
        setStatus('failed')
      }
    })
  }

  return (
    <form
      className="grid gap-8"
      onSubmit={(event) => {
        event.preventDefault()
        save(true)
      }}
    >
      {fields.map((field) => {
        const id = `stop-${stop}-${field.id}`
        const value = values[field.id] ?? ''
        const problem = errors[field.id]
        return (
          <div key={field.id} className="grid gap-2">
            <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-ink-1 text-[16px] font-medium">{field.label}</span>
              {field.optional ? <span className="meta">{copy.optional}</span> : null}
            </label>
            {field.hint ? <span className="text-ink-3 -mt-1 text-[13px]">{field.hint}</span> : null}
            {field.kind === 'text' ? (
              <textarea
                id={id}
                className="field min-h-[96px]"
                value={value}
                maxLength={400}
                disabled={locked}
                onChange={(event) => set(field.id, event.target.value)}
              />
            ) : field.kind === 'check' ? (
              <button
                id={id}
                type="button"
                role="checkbox"
                aria-checked={value === 'yes'}
                disabled={locked}
                className="chip press w-fit"
                onClick={() => set(field.id, value === 'yes' ? '' : 'yes')}
              >
                {copy.yes}
              </button>
            ) : field.kind === 'stretch' ? (
              <StretchPicker
                id={id}
                value={value}
                options={stretch}
                disabled={locked}
                onChange={(next) => set(field.id, next)}
              />
            ) : (
              <input
                id={id}
                className="field"
                inputMode={field.kind === 'number' ? 'numeric' : 'url'}
                value={value}
                maxLength={600}
                disabled={locked}
                onChange={(event) => set(field.id, event.target.value)}
              />
            )}
            {problem ? (
              <p role="alert" className="text-error m-0 text-[14px]">
                {message(field, problem)}
              </p>
            ) : null}
          </div>
        )
      })}

      {locked ? null : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
            disabled={pending || !ready}
          >
            {pending ? copy.sending : sent ? copy.sendChanges : copy.send(String(stop))}
          </button>
          {sent ? null : (
            <button
              type="button"
              className="btn btn-secondary press min-h-[52px]"
              disabled={pending}
              onClick={() => save(false)}
            >
              {pending ? copy.saving : copy.save}
            </button>
          )}
          {status === 'saved' ? (
            <p role="status" className="text-ink-2 m-0 text-[14px]">
              {copy.saved}
            </p>
          ) : status === 'sent' ? (
            <p role="status" className="text-ink-2 m-0 text-[14px]">
              {copy.sentNow}
            </p>
          ) : status === 'failed' || status === 'locked' || status === 'order' ? (
            <p role="alert" className="text-error m-0 basis-full text-[14px]">
              {status === 'locked'
                ? copy.locked
                : status === 'order'
                  ? copy.order(String(stop - 1))
                  : copy.failed}
            </p>
          ) : null}
        </div>
      )}
    </form>
  )
}

function StretchPicker({
  id,
  value,
  options,
  disabled,
  onChange,
}: {
  id: string
  value: string
  options: StretchOption[]
  disabled: boolean
  onChange: (value: string) => void
}) {
  const stretch = readStretch(value)
  const full = count(stretch) >= 2
  return (
    <div className="grid gap-3" id={id}>
      <span className="text-ink-2 text-[14px]">
        {planCopy.stretch.chosen(String(count(stretch)))}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={planCopy.stretch.pick}>
        {options.map((option) => {
          const on = stretch.picked.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              className="chip press text-[14px]"
              aria-pressed={on}
              aria-disabled={disabled || (!on && full)}
              onClick={() => {
                if (disabled || (!on && full)) return
                onChange(
                  JSON.stringify({
                    ...stretch,
                    picked: on
                      ? stretch.picked.filter((item) => item !== option.id)
                      : [...stretch.picked, option.id],
                  }),
                )
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      <input
        className="field"
        aria-label={planCopy.stretch.own}
        value={stretch.own}
        maxLength={200}
        disabled={disabled}
        placeholder={planCopy.stretch.ownPlaceholder}
        onChange={(event) => onChange(JSON.stringify({ ...stretch, own: event.target.value }))}
      />
    </div>
  )
}
