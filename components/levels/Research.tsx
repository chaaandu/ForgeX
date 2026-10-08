'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { saveResearch } from '@/app/actions/founder'
import { Lines } from '@/components/ui/Lines'
import { research as copy } from '@/content/copy'

export type ResearchDraft = { forWho: string; problem: string; doc: string; mentor: boolean }

/** Mirrors MIN in lib/data/research.ts; the server checks again before it saves. */
const MIN = { forWho: 3, problem: 40 }

/**
 * Sending the research, at the end of days 1 and 2. By now the work is done:
 * the doc exists and the mentor has been through it (the template lives on
 * the step before, where the work happens). Here it takes four things: who
 * it's for, what they found, the doc, and the mentor's yes.
 */
export function Research({
  initial,
  sent: alreadySent,
}: {
  initial: ResearchDraft | null
  sent: boolean
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<ResearchDraft>(
    () => initial ?? { forWho: '', problem: '', doc: '', mentor: false },
  )
  const [status, setStatus] = useState<'idle' | 'saved' | 'failed' | 'badDoc'>('idle')
  const [pending, start] = useTransition()

  const set = (patch: Partial<ResearchDraft>) => {
    setStatus('idle')
    setDraft((current) => ({ ...current, ...patch }))
  }

  const parts = [
    draft.forWho.trim().length >= MIN.forWho,
    draft.problem.trim().length >= MIN.problem,
    draft.doc.trim().length > 0,
    draft.mentor,
  ]
  const ready = parts.every(Boolean)

  function save(send: boolean) {
    start(async () => {
      setStatus('idle')
      const result = await saveResearch({ research: draft, send })
      if (result.ok) {
        // The first send unlocks the build days: back to Today, where they open.
        if (send && !alreadySent) router.push('/today')
        else {
          setStatus('saved')
          router.refresh()
        }
      } else setStatus(result.fields?.doc ? 'badDoc' : 'failed')
    })
  }

  return (
    <div className="grid max-w-[680px] gap-10 pb-16 md:pb-0">
      <div className="grid gap-4">
        <h1 className="page-title rise m-0">
          <Lines text={copy.title} />
        </h1>
        <p className="text-lead text-ink-2 m-0 max-w-[48ch]">{copy.lead}</p>
      </div>

      <div className="grid gap-7">
        <Field id="for-who" label={copy.forWho} hint={copy.forWhoHint}>
          <input
            id="for-who"
            className="field"
            value={draft.forWho}
            maxLength={120}
            placeholder={copy.forWhoPlaceholder}
            onChange={(event) => set({ forWho: event.target.value })}
          />
        </Field>
        <Field id="problem" label={copy.problem}>
          <textarea
            id="problem"
            className="field min-h-[112px]"
            value={draft.problem}
            maxLength={500}
            placeholder={copy.problemPlaceholder}
            onChange={(event) => set({ problem: event.target.value })}
          />
        </Field>
        <Field id="doc" label={copy.doc} hint={copy.docHint}>
          <input
            id="doc"
            className="field"
            inputMode="url"
            value={draft.doc}
            maxLength={600}
            placeholder={copy.docPlaceholder}
            onChange={(event) => set({ doc: event.target.value })}
          />
          {status === 'badDoc' ? (
            <p role="alert" className="text-error m-0 text-[14px]">
              {copy.badDoc}
            </p>
          ) : null}
        </Field>
        <button
          type="button"
          role="checkbox"
          aria-checked={draft.mentor}
          onClick={() => set({ mentor: !draft.mentor })}
          className="choice press"
        >
          <span
            className={`grid size-6 shrink-0 place-items-center rounded-md ${draft.mentor ? 'bg-violet text-on-violet' : 'shadow-[inset_0_0_0_1.5px_var(--color-line-2)]'}`}
            aria-hidden="true"
          >
            {draft.mentor ? <Check size={16} strokeWidth={1.5} /> : null}
          </span>
          {copy.mentor}
        </button>
      </div>

      <div className="dock md:border-line md:border-t md:pt-6">
        {alreadySent ? (
          <button
            type="button"
            className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
            disabled={pending || !ready}
            onClick={() => save(false)}
          >
            {pending ? copy.saving : copy.update}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
              disabled={pending || !ready}
              onClick={() => save(true)}
            >
              {pending ? copy.sending : copy.send}
            </button>
            <button
              type="button"
              className="btn btn-secondary press min-h-[52px]"
              disabled={pending}
              onClick={() => save(false)}
            >
              {copy.save}
            </button>
          </>
        )}
        {status === 'failed' ? (
          <p role="alert" className="text-error m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : status === 'saved' ? (
          <p role="status" className="text-ink-2 m-0 text-[14px]">
            {copy.saved}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-ink-1 text-[15px] font-medium">
        {label}
      </label>
      {hint ? <span className="text-ink-3 -mt-1 text-[13px]">{hint}</span> : null}
      {children}
    </div>
  )
}
