'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { saveWorld } from '@/app/actions/founder'
import { setLevelProgress } from '@/components/shell/progress'
import { OtherField } from '@/components/ui/OtherField'
import { world as copy } from '@/content/copy'
import { BUILD_WITH, INDUSTRIES } from '@/lib/taxonomy'
import type { World as WorldAnswers } from '@/lib/world'

/**
 * Three questions, one per screen, about a minute. Every list has a way out,
 * and nothing is saved until the last answer is in, because half a set of
 * answers would skew every match made from them.
 */

type Draft = {
  industries: string[]
  industryOther: string
  side: WorldAnswers['side'] | null
  learn: string[]
}

const STEPS = ['industries', 'side', 'learn'] as const

function toggle<T>(list: T[], item: T, max: number): T[] {
  if (list.includes(item)) return list.filter((value) => value !== item)
  return list.length >= max ? list : [...list, item]
}

export function World({ initial }: { initial: WorldAnswers | null }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState(false)
  const [pending, start] = useTransition()
  const [draft, setDraft] = useState<Draft>(() => ({
    industries: initial?.industries ?? [],
    industryOther: initial?.industryOther ?? '',
    side: initial?.side ?? null,
    learn: initial?.learn ?? [],
  }))

  const set = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }))
  const name = STEPS[step]!

  useEffect(() => {
    setLevelProgress(step / STEPS.length)
  }, [step])

  const ready: Record<(typeof STEPS)[number], boolean> = {
    industries:
      draft.industries.length > 0 &&
      (!draft.industries.includes('other') || draft.industryOther.trim().length > 1),
    side: draft.side !== null,
    learn: draft.learn.length > 0,
  }

  function finish() {
    const answers = {
      v: 2 as const,
      industries: draft.industries,
      industryOther: draft.industries.includes('other') ? draft.industryOther.trim() : undefined,
      side: draft.side,
      learn: draft.learn,
    }
    start(async () => {
      setError(false)
      const result = await saveWorld(answers)
      if (result.ok) router.push('/matches')
      else setError(true)
    })
  }

  return (
    <div className="grid max-w-[760px] gap-8">
      <p className="sr-only" aria-live="polite">
        {copy.of(step + 1, STEPS.length)}
      </p>

      <div key={name} className="quiz-card grid gap-6">
        {name === 'industries' ? (
          <>
            <Ask text={copy.industries.ask} count={[draft.industries.length, 3]} />
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry.id}
                  type="button"
                  className="chip press"
                  aria-pressed={draft.industries.includes(industry.id)}
                  aria-disabled={
                    !draft.industries.includes(industry.id) && draft.industries.length >= 3
                  }
                  onClick={() => set({ industries: toggle(draft.industries, industry.id, 3) })}
                >
                  {industry.label}
                </button>
              ))}
              <OtherField
                label={copy.industries.other}
                on={draft.industries.includes('other')}
                full={draft.industries.length >= 3}
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
            <div
              className="grid gap-2.5 sm:grid-cols-2"
              role="radiogroup"
              aria-label={copy.side.ask}
            >
              {(Object.keys(copy.side.options) as (keyof typeof copy.side.options)[]).map(
                (side) => (
                  <button
                    key={side}
                    type="button"
                    role="radio"
                    aria-checked={draft.side === side}
                    className="choice press min-h-[76px] text-[17px]"
                    onClick={() => set({ side })}
                  >
                    <span className="grid gap-0.5 text-left">
                      <span>{copy.side.options[side].label}</span>
                      <span className="text-ink-3 text-[14px]">{copy.side.options[side].sub}</span>
                    </span>
                  </button>
                ),
              )}
            </div>
          </>
        ) : null}

        {name === 'learn' ? (
          <>
            <Ask text={copy.learn.ask} hint={copy.learn.hint} count={[draft.learn.length, 3]} />
            <div className="flex flex-wrap gap-2">
              {BUILD_WITH.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="chip press"
                  aria-pressed={draft.learn.includes(item.id)}
                  aria-disabled={!draft.learn.includes(item.id) && draft.learn.length >= 3}
                  onClick={() => set({ learn: toggle(draft.learn, item.id, 3) })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="dock md:border-line justify-between md:border-t md:pt-6">
        <button
          type="button"
          className="btn btn-quiet press -ml-3"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || pending}
        >
          {copy.back}
        </button>
        {error ? (
          <p role="alert" className="text-error m-0 text-[14px]">
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
          <button
            type="button"
            className="btn btn-primary press min-w-[180px]"
            disabled={pending || !ready[name]}
            onClick={finish}
          >
            {pending ? copy.saving : copy.done}
          </button>
        )}
      </div>
    </div>
  )
}

function Ask({ text, hint, count }: { text: string; hint?: string; count?: [number, number] }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-4">
        <h1 className="ask m-0">{text}</h1>
        {count ? (
          <span
            className={`mt-2 shrink-0 rounded-full px-2.5 py-1 font-mono text-[12px] ${count[0] >= count[1] ? 'bg-violet text-on-violet' : 'text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-2)]'}`}
            aria-label={copy.picked(count[0], count[1])}
          >
            {count[0]} / {count[1]}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-ink-2 m-0 text-[15px]">{hint}</p> : null}
    </div>
  )
}
