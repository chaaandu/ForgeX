'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveWorld } from '@/app/actions/founder'
import { ComfortSlider } from '@/components/ui/ComfortSlider'
import { OtherField } from '@/components/ui/OtherField'
import { world as copy } from '@/content/copy'
import { ACCESS, INDUSTRIES, INTENTS, LEARN, type AccessId, type IntentId } from '@/lib/taxonomy'
import type { Access, World as WorldAnswers } from '@/lib/world'

/**
 * Level 4. Six questions, one per screen, about two minutes. Every list has a
 * way out, and nothing is saved until the last answer is in, because half a
 * set of answers would skew every match made from them.
 */

type Draft = {
  industries: string[]
  industryOther: string
  side: WorldAnswers['side'] | null
  access: Access[]
  nobody: boolean
  learn: string[]
  learnOther: string
  intent: IntentId | null
  comfort: number
}

const STEPS = ['industries', 'side', 'access', 'learn', 'intent', 'comfort'] as const

function toggle<T>(list: T[], item: T, max: number): T[] {
  if (list.includes(item)) return list.filter((value) => value !== item)
  return list.length >= max ? list : [...list, item]
}

export function World({ initial, familyBusiness }: { initial: WorldAnswers | null; familyBusiness: boolean }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState(false)
  const [pending, start] = useTransition()
  const [draft, setDraft] = useState<Draft>(() => ({
    industries: initial?.industries ?? [],
    industryOther: initial?.industryOther ?? '',
    side: initial?.side ?? null,
    access: initial?.access ?? (familyBusiness ? [{ kind: 'family', worlds: [] }] : []),
    nobody: initial ? initial.access.length === 0 : false,
    learn: initial?.learn ?? [],
    learnOther: initial?.learnOther ?? '',
    intent: initial?.intent ?? null,
    comfort: initial?.comfort ?? 3,
  }))

  const set = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }))
  const name = STEPS[step]!

  const ready: Record<(typeof STEPS)[number], boolean> = {
    industries:
      draft.industries.length > 0 && (!draft.industries.includes('other') || draft.industryOther.trim().length > 1),
    side: draft.side !== null,
    access:
      draft.nobody ||
      (draft.access.length > 0 &&
        draft.access.every(
          (entry) =>
            (entry.kind !== 'other' || (entry.other ?? '').trim().length > 1) &&
            entry.worlds.length > 0 &&
            (!entry.worlds.includes('elsewhere') || (entry.elsewhere ?? '').trim().length > 1),
        )),
    learn: draft.learn.length > 0 && (!draft.learn.includes('other') || draft.learnOther.trim().length > 1),
    intent: draft.intent !== null,
    comfort: true,
  }

  function finish() {
    const answers = {
      v: 1 as const,
      industries: draft.industries,
      industryOther: draft.industries.includes('other') ? draft.industryOther.trim() : undefined,
      side: draft.side,
      access: draft.nobody ? [] : draft.access,
      learn: draft.learn,
      learnOther: draft.learn.includes('other') ? draft.learnOther.trim() : undefined,
      intent: draft.intent,
      comfort: draft.comfort,
    }
    start(async () => {
      setError(false)
      const result = await saveWorld(answers)
      if (result.ok) router.push('/matches')
      else setError(true)
    })
  }

  function setAccess(kind: AccessId | 'other', patch: Partial<Access> | null) {
    setDraft((current) => {
      const existing = current.access.find((entry) => entry.kind === kind)
      if (patch === null) return { ...current, access: current.access.filter((entry) => entry.kind !== kind) }
      if (!existing) return { ...current, nobody: false, access: [...current.access, { kind, worlds: [], ...patch }] }
      return { ...current, access: current.access.map((entry) => (entry.kind === kind ? { ...entry, ...patch } : entry)) }
    })
  }

  return (
    <div className="grid max-w-[760px] gap-8">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="meta m-0" aria-live="polite">
            {step + 1} / {STEPS.length}
          </p>
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span
              key={item}
              className="h-[3px] flex-1 rounded-full transition-colors duration-200"
              style={{ background: index < step ? 'var(--color-ink-1)' : index === step ? 'var(--color-pink)' : 'var(--color-s3)' }}
            />
          ))}
        </div>
      </div>

      <div key={name} className="quiz-card grid gap-6">
        {name === 'industries' ? (
          <>
            <Ask text={copy.industries.ask} hint={copy.industries.hint} />
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry.id}
                  type="button"
                  className="chip press"
                  aria-pressed={draft.industries.includes(industry.id)}
                  onClick={() => set({ industries: toggle(draft.industries, industry.id, 3) })}
                >
                  {industry.label}
                </button>
              ))}
              <OtherField
                label={copy.industries.other}
                on={draft.industries.includes('other')}
                onToggle={() => set({ industries: toggle(draft.industries, 'other', 3) })}
                value={draft.industryOther}
                onChange={(industryOther) => set({ industryOther })}
                placeholder={copy.industries.otherPlaceholder}
              />
            </div>
          </>
        ) : null}

        {name === 'side' ? (
          <>
            <Ask text={copy.side.ask} />
            <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={copy.side.ask}>
              {(Object.keys(copy.side.options) as (keyof typeof copy.side.options)[]).map((side) => (
                <button
                  key={side}
                  type="button"
                  role="radio"
                  aria-checked={draft.side === side}
                  className="choice press min-h-[68px] text-[17px]"
                  onClick={() => set({ side })}
                >
                  {copy.side.options[side]}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {name === 'access' ? (
          <>
            <Ask text={copy.access.ask} hint={copy.access.hint} />
            <div className="grid gap-2.5">
              {[...ACCESS, { id: 'other' as const, label: copy.access.other }].map((option) => {
                const entry = draft.access.find((item) => item.kind === option.id)
                return (
                  <div key={option.id} className="grid gap-3">
                    <button
                      type="button"
                      className="choice press"
                      aria-pressed={Boolean(entry)}
                      onClick={() => setAccess(option.id, entry ? null : {})}
                    >
                      {option.label}
                    </button>
                    {entry ? (
                      <div className="rise grid gap-3 pb-2 pl-4 shadow-[inset_2px_0_0_var(--color-pink)]">
                        {option.id === 'other' ? (
                          <input
                            className="field"
                            value={entry.other ?? ''}
                            maxLength={80}
                            placeholder={copy.access.otherPlaceholder}
                            aria-label={copy.access.otherPlaceholder}
                            onChange={(event) => setAccess('other', { other: event.target.value })}
                          />
                        ) : null}
                        <p className="m-0 text-[15px] text-ink-2">{copy.access.worlds(copy.access.whoLabel[option.id])}</p>
                        <div className="flex flex-wrap gap-2">
                          {INDUSTRIES.map((industry) => (
                            <button
                              key={industry.id}
                              type="button"
                              className="chip press min-h-9 text-[13px]"
                              aria-pressed={entry.worlds.includes(industry.id)}
                              onClick={() => setAccess(option.id, { worlds: toggle(entry.worlds, industry.id, 3) })}
                            >
                              {industry.short}
                            </button>
                          ))}
                          <OtherField
                            label={copy.access.elsewhere}
                            on={entry.worlds.includes('elsewhere')}
                            onToggle={() => setAccess(option.id, { worlds: toggle(entry.worlds, 'elsewhere', 3) })}
                            value={entry.elsewhere ?? ''}
                            onChange={(elsewhere) => setAccess(option.id, { elsewhere })}
                            placeholder={copy.access.elsewherePlaceholder}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
              <button
                type="button"
                className="choice press"
                aria-pressed={draft.nobody}
                onClick={() => set({ nobody: !draft.nobody, access: draft.nobody ? draft.access : [] })}
              >
                {copy.access.none}
              </button>
            </div>
          </>
        ) : null}

        {name === 'learn' ? (
          <>
            <Ask text={copy.learn.ask} hint={copy.learn.hint} />
            <div className="flex flex-wrap gap-2">
              {LEARN.map((learn) => (
                <button
                  key={learn.id}
                  type="button"
                  className="chip press"
                  aria-pressed={draft.learn.includes(learn.id)}
                  onClick={() => set({ learn: toggle(draft.learn, learn.id, 3) })}
                >
                  {learn.label}
                </button>
              ))}
              <OtherField
                label={copy.learn.other}
                on={draft.learn.includes('other')}
                onToggle={() => set({ learn: toggle(draft.learn, 'other', 3) })}
                value={draft.learnOther}
                onChange={(learnOther) => set({ learnOther })}
                placeholder={copy.learn.otherPlaceholder}
              />
            </div>
          </>
        ) : null}

        {name === 'intent' ? (
          <>
            <Ask text={copy.intent.ask} />
            <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={copy.intent.ask}>
              {INTENTS.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  role="radio"
                  aria-checked={draft.intent === intent.id}
                  className="choice press min-h-[68px] text-[17px]"
                  onClick={() => set({ intent: intent.id })}
                >
                  {intent.label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {name === 'comfort' ? (
          <>
            <Ask text={copy.comfort.ask} hint={copy.comfort.hint} />
            <ComfortSlider value={draft.comfort} onChange={(comfort) => set({ comfort })} />
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <button
          type="button"
          className="btn btn-quiet press -ml-3"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || pending}
        >
          {copy.back}
        </button>
        {error ? (
          <p role="alert" className="m-0 text-[14px] text-pink-ink">
            {copy.error}
          </p>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="btn btn-primary press min-w-[140px]"
            disabled={!ready[name]}
            onClick={() => setStep(step + 1)}
          >
            {copy.next}
          </button>
        ) : (
          <button type="button" className="btn btn-primary press min-w-[180px]" disabled={pending} onClick={finish}>
            {pending ? copy.saving : copy.done}
          </button>
        )}
      </div>
    </div>
  )
}

function Ask({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="grid gap-2">
      <h1 className="ask m-0">{text}</h1>
      {hint ? <p className="m-0 text-[15px] text-ink-2">{hint}</p> : null}
    </div>
  )
}
