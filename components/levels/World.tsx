'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { saveWorld } from '@/app/actions/founder'
import { setLevelProgress } from '@/components/shell/progress'
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

export function World({
  initial,
  familyBusiness,
  ownOnly = false,
}: {
  initial: WorldAnswers | null
  familyBusiness: boolean
  /** An autonomous founder: no matches follow, so the last button says what does. */
  ownOnly?: boolean
}) {
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

  useEffect(() => {
    setLevelProgress(step / STEPS.length)
  }, [step])

  // The founder's own industries come first wherever a list of worlds appears.
  const ordered = [
    ...INDUSTRIES.filter((industry) => draft.industries.includes(industry.id)),
    ...INDUSTRIES.filter((industry) => !draft.industries.includes(industry.id)),
  ]

  // A way in counts once it says where: until then it is only half chosen.
  const complete = (entry: Draft['access'][number]) =>
    (entry.kind !== 'other' || (entry.other ?? '').trim().length > 1) &&
    entry.worlds.length > 0 &&
    (!entry.worlds.includes('elsewhere') || (entry.elsewhere ?? '').trim().length > 1)

  const ready: Record<(typeof STEPS)[number], boolean> = {
    industries:
      draft.industries.length > 0 &&
      (!draft.industries.includes('other') || draft.industryOther.trim().length > 1),
    side: draft.side !== null,
    access: draft.nobody || (draft.access.length > 0 && draft.access.every(complete)),
    learn:
      draft.learn.length > 0 &&
      (!draft.learn.includes('other') || draft.learnOther.trim().length > 1),
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
      if (patch === null)
        return { ...current, access: current.access.filter((entry) => entry.kind !== kind) }
      if (!existing)
        return {
          ...current,
          nobody: false,
          access: [...current.access, { kind, worlds: [], ...patch }],
        }
      return {
        ...current,
        access: current.access.map((entry) =>
          entry.kind === kind ? { ...entry, ...patch } : entry,
        ),
      }
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
                      aria-pressed={entry ? (complete(entry) ? true : 'mixed') : false}
                      onClick={() => setAccess(option.id, entry ? null : {})}
                    >
                      {option.label}
                      {entry && !complete(entry) ? (
                        <span aria-hidden="true" className="text-ink-3 ml-auto text-[13px]">
                          {copy.access.pickBelow}
                        </span>
                      ) : null}
                    </button>
                    {entry ? (
                      <div className="rise grid gap-3 pb-2 pl-4 shadow-[inset_2px_0_0_var(--color-violet)]">
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
                        <p className="text-ink-2 m-0 text-[15px]">
                          {copy.access.worlds(copy.access.whoLabel[option.id])}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ordered.map((industry) => (
                            <button
                              key={industry.id}
                              type="button"
                              className="chip press min-h-9 text-[13px]"
                              aria-pressed={entry.worlds.includes(industry.id)}
                              onClick={() =>
                                setAccess(option.id, {
                                  worlds: toggle(entry.worlds, industry.id, 3),
                                })
                              }
                            >
                              {industry.short}
                            </button>
                          ))}
                          <OtherField
                            label={copy.access.elsewhere}
                            on={entry.worlds.includes('elsewhere')}
                            onToggle={() =>
                              setAccess(option.id, { worlds: toggle(entry.worlds, 'elsewhere', 3) })
                            }
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
                onClick={() =>
                  set({ nobody: !draft.nobody, access: draft.nobody ? draft.access : [] })
                }
              >
                {copy.access.none}
              </button>
            </div>
          </>
        ) : null}

        {name === 'learn' ? (
          <>
            <Ask text={copy.learn.ask} count={[draft.learn.length, 3]} />
            <div className="flex flex-wrap gap-2">
              {LEARN.map((learn) => (
                <button
                  key={learn.id}
                  type="button"
                  className="chip press"
                  aria-pressed={draft.learn.includes(learn.id)}
                  aria-disabled={!draft.learn.includes(learn.id) && draft.learn.length >= 3}
                  onClick={() => set({ learn: toggle(draft.learn, learn.id, 3) })}
                >
                  {learn.label}
                </button>
              ))}
              <OtherField
                label={copy.learn.other}
                on={draft.learn.includes('other')}
                full={draft.learn.length >= 3}
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
            <div
              className="grid gap-2.5 sm:grid-cols-2"
              role="radiogroup"
              aria-label={copy.intent.ask}
            >
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
          <p role="alert" className="text-violet-ink m-0 text-[14px]">
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
            disabled={pending}
            onClick={finish}
          >
            {pending ? copy.saving : ownOnly ? copy.doneOwn : copy.done}
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
