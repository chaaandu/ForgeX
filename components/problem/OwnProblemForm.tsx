'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { checkResearch, submitProblem } from '@/app/actions/founder'
import { Hint } from '@/components/ui/Hint'
import { ownProblem as copy, submit as submitCopy, world as worldCopy } from '@/content/copy'
import type { LinkHealth } from '@/lib/link-check'
import {
  OWN_FIELDS,
  RESEARCH_FIELDS,
  WORD_LIMITS,
  wordCount,
  type OwnProblem,
  type WordField,
} from '@/lib/own-problem'
import { INDUSTRIES } from '@/lib/taxonomy'

type Field = (typeof OWN_FIELDS)[number] | (typeof RESEARCH_FIELDS)[number]

const isWordField = (field: Field): field is WordField => field in WORD_LIMITS
type Draft = Omit<OwnProblem, 'industry'> & { industry: OwnProblem['industry'] | '' }

const EMPTY: Draft = {
  industry: '',
  industryOther: '',
  title: '',
  person: '',
  problem: '',
  promise: '',
  why: '',
  plan: '',
  primary: '',
  secondary: '',
}

/**
 * A founder's own problem, sent for review: the industry, a name for it, the
 * 3Ps, the plan, and the two research links. One screen, in the order a
 * founder thinks it through. Research links are checked as they are pasted,
 * so a doc nobody else can open is fixed before it reaches the reviewer.
 */
export function OwnProblemForm({
  initial,
  again,
  onSent,
  onCancel,
}: {
  /** What they sent last time, when they are sending it again. */
  initial: OwnProblem | null
  again: boolean
  /** Called once it has gone, so whatever opened the form can close it. */
  onSent?: () => void
  onCancel?: () => void
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(initial ?? EMPTY)
  const [errors, setErrors] = useState<
    Partial<Record<Field | 'industry' | 'industryOther', string>>
  >({})
  const [warnings, setWarnings] = useState<Partial<Record<Field, LinkHealth>>>({})
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()

  const set = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }))

  async function check(field: (typeof RESEARCH_FIELDS)[number]) {
    const value = draft[field].trim()
    if (!value) return
    const result = await checkResearch({ [field]: value })
    if (!result.ok) return
    setErrors((current) => ({
      ...current,
      [field]: result.bad.includes(field) ? 'link' : undefined,
    }))
    setWarnings((current) => ({ ...current, [field]: result.warnings[field] }))
  }

  function send() {
    const missing: Partial<Record<Field | 'industry' | 'industryOther', string>> = {}
    if (!draft.industry) missing.industry = 'required'
    if (draft.industry === 'other' && draft.industryOther.trim().length < 2)
      missing.industryOther = 'required'
    for (const field of [...OWN_FIELDS, ...RESEARCH_FIELDS]) {
      if (!draft[field].trim()) missing[field] = 'required'
    }
    for (const field of OWN_FIELDS) {
      if (draft[field].trim() && wordCount(draft[field]) > WORD_LIMITS[field])
        missing[field] = 'words'
    }
    if (Object.keys(missing).length) {
      setErrors(missing)
      document.getElementById(`own-${Object.keys(missing)[0]}`)?.scrollIntoView({ block: 'center' })
      return
    }
    start(async () => {
      setFailed(false)
      const result = await submitProblem(draft)
      if (result.ok) {
        window.scrollTo({ top: 0 })
        onSent?.()
        router.refresh()
        return
      }
      if (result.error === 'invalid' && result.fields) {
        setErrors(result.fields as Partial<Record<Field, string>>)
        return
      }
      setFailed(true)
    })
  }

  const message = (field: Field) => {
    const error = errors[field]
    if (error === 'required') return { text: copy.errors.required, bad: true }
    if (error === 'link') return { text: copy.errors.link, bad: true }
    if (error === 'words' && isWordField(field))
      return { text: copy.errors.words(WORD_LIMITS[field]), bad: true }
    const warning = warnings[field]
    if (warning === 'private') return { text: submitCopy.warnings.private, bad: true }
    if (warning === 'broken') return { text: submitCopy.warnings.broken, bad: true }
    return { text: copy.fields[field].help, bad: false }
  }

  // Typing clears what was wrong with this field; the counter keeps the score.
  const change = (field: Field, value: string) => {
    set({ [field]: value } as Partial<Draft>)
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const input = (field: Field, rows: number) => {
    const id = `own-${field}`
    const note = message(field)
    const link = field === 'primary' || field === 'secondary'
    return (
      <div key={field} className="grid gap-2">
        <label htmlFor={id} className="text-ink-1 text-[15px] font-medium">
          {copy.fields[field].label} <span className="text-ink-3 font-normal">{copy.required}</span>
        </label>
        {rows === 1 ? (
          <input
            id={id}
            className="field"
            type="text"
            inputMode={link ? 'url' : 'text'}
            autoCapitalize={link ? 'none' : 'sentences'}
            value={draft[field]}
            maxLength={link ? 400 : 200}
            placeholder={copy.fields[field].placeholder}
            aria-describedby={`${id}-help`}
            aria-invalid={note.bad || undefined}
            onChange={(event) => change(field, event.target.value)}
            onBlur={link ? () => void check(field) : undefined}
          />
        ) : (
          <textarea
            id={id}
            className="field min-h-0"
            rows={rows}
            value={draft[field]}
            maxLength={3000}
            placeholder={copy.fields[field].placeholder}
            aria-describedby={`${id}-help`}
            aria-invalid={note.bad || undefined}
            onChange={(event) => change(field, event.target.value)}
          />
        )}
        <p
          id={`${id}-help`}
          className={`m-0 flex justify-between gap-4 text-[13px] ${note.bad ? 'text-error' : 'text-ink-3'}`}
          role={note.bad ? 'alert' : undefined}
        >
          <span>{note.text}</span>
          {isWordField(field) ? (
            <span
              className={`shrink-0 font-mono text-[12px] ${wordCount(draft[field]) > WORD_LIMITS[field] ? 'text-error' : ''}`}
            >
              {copy.words(wordCount(draft[field]), WORD_LIMITS[field])}
            </span>
          ) : null}
        </p>
      </div>
    )
  }

  return (
    <div className="grid max-w-[760px] gap-10">
      {/* One hint for the whole form: the session covers the 3Ps and the research. */}
      <Hint>{copy.hint}</Hint>
      <div className="grid gap-3">
        <p className="meta m-0" id="own-industry">
          {copy.fields.industry.label}{' '}
          <span className="text-ink-3 normal-case">{copy.required}</span>
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="own-industry">
          {[...INDUSTRIES, { id: 'other' as const, label: worldCopy.industries.other }].map(
            (industry) => (
              <button
                key={industry.id}
                type="button"
                role="radio"
                aria-checked={draft.industry === industry.id}
                className="chip press"
                onClick={() => {
                  set({ industry: industry.id })
                  setErrors((current) => ({ ...current, industry: undefined }))
                }}
              >
                {industry.label}
              </button>
            ),
          )}
        </div>
        {errors.industry ? (
          <p role="alert" className="text-error m-0 text-[13px]">
            {copy.errors.required}
          </p>
        ) : null}
        {draft.industry === 'other' ? (
          <div className="grid max-w-[360px] gap-2 pt-2">
            <label htmlFor="own-industryOther" className="text-ink-1 text-[15px] font-medium">
              {copy.fields.industryOther.label}{' '}
              <span className="text-ink-3 font-normal">{copy.required}</span>
            </label>
            <input
              id="own-industryOther"
              className="field"
              value={draft.industryOther}
              maxLength={40}
              placeholder={worldCopy.industries.otherPlaceholder}
              aria-invalid={errors.industryOther ? true : undefined}
              onChange={(event) => {
                set({ industryOther: event.target.value })
                setErrors((current) => ({ ...current, industryOther: undefined }))
              }}
            />
            {errors.industryOther ? (
              <p role="alert" className="text-error m-0 text-[13px]">
                {copy.errors.required}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {input('title', 1)}

      <section className="grid gap-7" aria-labelledby="three-p">
        <h2 id="three-p" className="section-title m-0">
          {copy.threeP}
        </h2>
        {input('person', 3)}
        {input('problem', 4)}
        {input('promise', 3)}
        {input('why', 3)}
        {input('plan', 4)}
      </section>

      <section className="grid gap-7" aria-labelledby="research">
        <h2 id="research" className="section-title m-0">
          {copy.research}
        </h2>
        {input('primary', 1)}
        {input('secondary', 1)}
      </section>

      <div className="dock md:border-line items-center justify-between md:border-t md:pt-6">
        {failed ? (
          <p role="alert" className="text-error m-0 basis-full text-[13px] md:basis-auto">
            {copy.failed}
          </p>
        ) : onCancel ? (
          <button type="button" className="btn btn-quiet press -ml-3" onClick={onCancel}>
            {copy.cancel}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="btn btn-primary press w-full min-w-[200px] md:w-auto"
          disabled={pending}
          onClick={send}
        >
          {pending ? copy.sending : again ? copy.sendAgain : copy.send}
        </button>
      </div>
    </div>
  )
}
