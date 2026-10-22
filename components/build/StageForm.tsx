'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { saveStage, submitStage } from '@/app/actions/founder'
import { Checklist } from '@/components/build/Checklist'
import { Hint } from '@/components/ui/Hint'
import { submit as copy } from '@/content/copy'
import { SOFT_STAGES, type StageId } from '@/lib/hackathon'
import type { LinkHealth } from '@/lib/link-check'
import { workLabel } from '@/lib/links'
import { fieldsOf, requiredOf, type SubmissionField, type SubmissionFields } from '@/lib/submission'

type Errors = Partial<Record<SubmissionField, 'link' | 'required'>>

/**
 * One stage's links, on one screen. Each field saves when it is left, so
 * nothing is lost to a closed tab, and is checked for whether it opens for
 * anyone; one button submits the stage. Once submitted, the screen becomes a
 * record of what we have, with one way back in until the deadline. After the
 * deadline there is no way back, unless the team has reopened it.
 */
export function StageForm({
  stage,
  initial,
  sent,
  locked,
  reopened,
  closesAt,
}: {
  stage: StageId
  initial: SubmissionFields
  sent: boolean
  locked: boolean
  reopened: boolean
  closesAt: string
}) {
  // Due on a date but never locked: the MVP scope.
  const soft = SOFT_STAGES.includes(stage)
  const router = useRouter()
  const fields = fieldsOf(stage)
  const required = requiredOf(stage)
  const [values, setValues] = useState<SubmissionFields>(initial)
  const saved = useRef<SubmissionFields>(initial)
  const [kept, setKept] = useState<SubmissionFields>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [warnings, setWarnings] = useState<Partial<Record<SubmissionField, LinkHealth>>>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const [isSent, setSent] = useState(sent)
  const [editing, setEditing] = useState(!sent)
  const [sending, start] = useTransition()

  if (locked || (isSent && !editing)) {
    const shown = locked ? initial : values
    return (
      <div className="grid max-w-[720px] gap-8">
        <div className="grid gap-3">
          <h1 className="page-title m-0">{isSent ? copy.sent.title : copy.titles[stage]}</h1>
          <p className="text-lead text-ink-2 m-0">
            {!locked
              ? soft
                ? copy.sent.leadSoft
                : copy.sent.lead(closesAt)
              : isSent
                ? copy.locked
                : copy.lockedEmpty}
          </p>
        </div>
        {isSent ? (
          <dl className="m-0 grid gap-0">
            {fields
              .filter((field) => shown[field.id])
              .map((field) => (
                <div key={field.id} className="border-line grid gap-1 border-t py-3.5">
                  <dt className="meta text-[11px]">{copy.fields[field.id].label}</dt>
                  <dd className="user-text text-ink-1 m-0 grid gap-1 text-[15px]">
                    {(shown[field.id] ?? '').split('\n').map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-ink"
                      >
                        {workLabel(url)}
                      </a>
                    ))}
                  </dd>
                </div>
              ))}
          </dl>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Link href="/build" className="btn btn-primary press">
            {copy.back}
          </Link>
          {locked ? null : (
            <button
              type="button"
              className="btn btn-secondary press"
              onClick={() => setEditing(true)}
            >
              {copy.change}
            </button>
          )}
        </div>
      </div>
    )
  }

  const noteWarnings = (found: Partial<Record<string, LinkHealth>>) =>
    setWarnings((current) => ({
      ...current,
      ...(found as Partial<Record<SubmissionField, LinkHealth>>),
    }))

  async function save(id: SubmissionField) {
    const value = (values[id] ?? '').trim()
    if (value === (saved.current[id] ?? '')) return
    setStatus('saving')
    const result = await saveStage({ stage, fields: { [id]: value } })
    if (result.ok) {
      saved.current = result.fields
      setKept(result.fields)
      setValues((current) => ({ ...current, [id]: result.fields[id] ?? '' }))
      setErrors((current) => ({ ...current, [id]: undefined }))
      setWarnings((current) => ({ ...current, [id]: undefined }))
      noteWarnings(result.warnings)
      setStatus('saved')
      return
    }
    if (result.error === 'invalid' && result.fields?.[id]) {
      const reason = result.fields[id] === 'required' ? 'required' : 'link'
      setErrors((current) => ({ ...current, [id]: reason }))
      setStatus('idle')
      return
    }
    if (result.error === 'locked') router.refresh()
    setStatus('failed')
  }

  function send() {
    start(async () => {
      const own = Object.fromEntries(fields.map((field) => [field.id, values[field.id] ?? '']))
      const result = await submitStage({ stage, fields: own })
      if (result.ok) {
        saved.current = result.fields
        setKept(result.fields)
        setValues(result.fields)
        setErrors({})
        noteWarnings(result.warnings)
        setSent(true)
        setEditing(false)
        setStatus('idle')
        window.scrollTo({ top: 0 })
        router.refresh()
        return
      }
      if (result.error === 'invalid' && result.fields) {
        setErrors(result.fields as Errors)
        setStatus('idle')
        return
      }
      if (result.error === 'locked') router.refresh()
      setStatus('failed')
    })
  }

  const wrong = Object.values(errors).some(Boolean)
  const added = required.filter((id) => kept[id]).length

  function jumpTo(id: SubmissionField) {
    const field = document.getElementById(`submit-${id}`)
    field?.scrollIntoView({ block: 'center' })
    field?.focus({ preventScroll: true })
  }

  const helpOf = (field: (typeof fields)[number]) => {
    const error = errors[field.id]
    if (error === 'required') return { text: copy.errors.required, bad: true }
    if (error === 'link') return { text: copy.errors[field.id], bad: true }
    const warning = warnings[field.id]
    if (warning === 'private')
      return { text: field.id === 'github' ? copy.warnings.repo : copy.warnings.private, bad: true }
    if (warning === 'broken') return { text: copy.warnings.broken, bad: true }
    return { text: copy.fields[field.id].help, bad: false }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,720px)_minmax(0,340px)] lg:justify-between lg:gap-16">
      <div className="grid min-w-0 gap-9">
        <div className="grid gap-3">
          <h1 className="page-title m-0">{copy.titles[stage]}</h1>
          <p className="text-lead text-ink-2 m-0">{copy.leads[stage]}</p>
          <p className="text-ink-2 m-0 text-[15px]">{soft ? copy.saves : copy.due(closesAt)}</p>
          {reopened ? <p className="text-violet-ink m-0 text-[15px]">{copy.reopened}</p> : null}
        </div>

        <div className="grid gap-7">
          {fields.map((field) => {
            const id = `submit-${field.id}`
            const note = helpOf(field)
            const shared = {
              id,
              className: 'field',
              value: values[field.id] ?? '',
              placeholder: copy.fields[field.id].placeholder,
              'aria-describedby': `${id}-help`,
              'aria-invalid': note.bad ? true : undefined,
              onBlur: () => void save(field.id),
            }
            return (
              <div key={field.id} className="grid gap-2">
                <label htmlFor={id} className="text-ink-1 text-[15px] font-medium">
                  {copy.fields[field.id].label}{' '}
                  {field.required ? (
                    <span className="text-ink-3 font-normal">{copy.required}</span>
                  ) : null}
                </label>
                {field.id === 'deck' ? <Hint>{copy.deckHint}</Hint> : null}
                {field.kind === 'posts' ? (
                  <textarea
                    {...shared}
                    rows={2}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.id]: event.target.value }))
                    }
                  />
                ) : (
                  <input
                    {...shared}
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={400}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.id]: event.target.value }))
                    }
                  />
                )}
                <p
                  id={`${id}-help`}
                  className={`m-0 text-[13px] ${note.bad ? 'text-error' : 'text-ink-3'}`}
                  role={note.bad ? 'alert' : undefined}
                >
                  {note.text}
                </p>
              </div>
            )
          })}
        </div>

        <div className="dock md:border-line items-center justify-between md:border-t md:pt-6">
          <p
            className={`m-0 basis-full text-[13px] md:min-h-5 md:basis-auto ${status === 'failed' || wrong ? 'text-error' : 'text-ink-3'}`}
            aria-live="polite"
          >
            {status === 'failed'
              ? copy.failed
              : wrong
                ? copy.fix
                : status === 'saving'
                  ? copy.saving
                  : status === 'saved'
                    ? copy.saved
                    : copy.added(added, required.length)}
          </p>
          <button
            type="button"
            className="btn btn-primary press w-full min-w-[180px] md:w-auto"
            disabled={sending}
            onClick={send}
          >
            {sending ? copy.sending : isSent ? copy.sendAgain : copy.send[stage]}
          </button>
        </div>
      </div>
      {/* Beside the form on a wide screen: what is in, what is not, and a way to each. */}
      <aside className="hidden lg:block">
        <div className="panel sticky top-24 p-6">
          <Checklist ids={required} fields={kept} onPick={jumpTo} />
        </div>
      </aside>
    </div>
  )
}
