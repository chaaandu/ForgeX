'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveResearch } from '@/app/actions/founder'
import { Hint } from '@/components/ui/Hint'
import { home as copy, ownProblem, submit as submitCopy } from '@/content/copy'
import type { LinkHealth } from '@/lib/link-check'

type Key = 'primary' | 'secondary'

/**
 * The research behind a problem picked from the bank: the same two links a
 * founder with their own problem sends. Even with our problem, a founder
 * should know the people they are building for.
 */
export function ResearchForm({ initial }: { initial: Record<Key, string> }) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [warnings, setWarnings] = useState<Partial<Record<Key, LinkHealth>>>({})
  const [saved, setSaved] = useState(false)
  const [pending, start] = useTransition()

  function save() {
    start(async () => {
      setSaved(false)
      const result = await saveResearch(values)
      if (result.ok) {
        setErrors({})
        setWarnings(result.warnings as Partial<Record<Key, LinkHealth>>)
        setSaved(true)
        router.refresh()
      } else if (result.fields) setErrors(result.fields as Partial<Record<Key, string>>)
    })
  }

  return (
    <section id="research" className="panel grid gap-6 p-6" aria-labelledby="research-title">
      <div className="grid gap-2">
        <h2 id="research-title" className="section-title m-0">
          {copy.research.title}
        </h2>
        <p className="text-ink-2 m-0 text-[15px]">{copy.research.lead}</p>
        <Hint>{ownProblem.hint}</Hint>
      </div>
      {(['primary', 'secondary'] as const).map((key) => {
        const id = `research-${key}`
        const note = errors[key]
          ? ownProblem.errors.link
          : warnings[key] === 'private'
            ? submitCopy.warnings.private
            : warnings[key] === 'broken'
              ? submitCopy.warnings.broken
              : ownProblem.fields[key].help
        const bad = Boolean(errors[key] || warnings[key])
        return (
          <div key={key} className="grid gap-2">
            <label htmlFor={id} className="text-ink-1 text-[15px] font-medium">
              {ownProblem.fields[key].label}{' '}
              <span className="text-ink-3 font-normal">
                {key === 'primary' ? ownProblem.optional : ownProblem.required}
              </span>
            </label>
            <input
              id={id}
              className="field"
              inputMode="url"
              autoCapitalize="none"
              value={values[key]}
              placeholder={ownProblem.fields[key].placeholder}
              aria-describedby={`${id}-help`}
              aria-invalid={bad || undefined}
              onChange={(event) =>
                setValues((current) => ({ ...current, [key]: event.target.value }))
              }
            />
            <p id={`${id}-help`} className={`m-0 text-[13px] ${bad ? 'text-error' : 'text-ink-3'}`}>
              {note}
            </p>
          </div>
        )
      })}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary press" disabled={pending} onClick={save}>
          {copy.research.save}
        </button>
        {saved ? (
          <span className="text-ok text-[14px]" role="status">
            {copy.research.saved}
          </span>
        ) : null}
      </div>
    </section>
  )
}
