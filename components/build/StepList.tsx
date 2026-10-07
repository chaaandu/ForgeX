'use client'

import Link from 'next/link'
import { useId, useState, useTransition } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { tickStep } from '@/app/actions/founder'
import { messages as messagesCopy, plan as copy } from '@/content/copy'
import type { FounderStep } from '@/lib/steps'

export type StepView = FounderStep & {
  ticked: boolean
  value: string
  overdue: boolean
  /** Ticked or changed in the last 12 hours. */
  recent: boolean
  dayLabel: string
}

export type FixView = { id: string; text: string; done: boolean }

export type StretchOption = { id: string; label: string }

type Stretch = { picked: string[]; own: string }

function readStretch(value: string): Stretch {
  try {
    const raw = JSON.parse(value) as Partial<Stretch>
    return { picked: Array.isArray(raw.picked) ? raw.picked : [], own: raw.own ?? '' }
  } catch {
    return { picked: [], own: '' }
  }
}

/** A list of plan steps, each one a tick, a title, and what done means behind it. */
export function StepList({
  steps,
  stretch = [],
  label,
}: {
  steps: StepView[]
  stretch?: StretchOption[]
  label: string
}) {
  return (
    <ul className="m-0 grid list-none p-0" aria-label={label}>
      {steps.map((step) => (
        <StepItem key={step.id} step={step} stretch={stretch} />
      ))}
    </ul>
  )
}

function StepItem({ step, stretch }: { step: StepView; stretch: StretchOption[] }) {
  const panel = useId()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(step.ticked)
  const [value, setValue] = useState(step.value)
  const [saved, setSaved] = useState(step.value)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const input = step.input
  const isStop = input?.kind === 'stop'

  const errorFor = (field?: string) => {
    if (field === 'required') return copy.needed
    if (field === 'format') {
      if (input?.kind === 'link') return copy.badLink[input.link]
      if (input?.kind === 'number') return copy.badNumber
    }
    return copy.failed
  }

  function send(nextDone: boolean, nextValue: string) {
    start(async () => {
      setError(null)
      const result = await tickStep({ stepId: step.id, done: nextDone, value: nextValue })
      // No refresh: a ticked step stays where it is until they leave the
      // page, rather than jumping out of the list under their thumb.
      if (result.ok) {
        setDone(nextDone)
        setValue(result.value)
        setSaved(result.value)
      } else {
        setError(errorFor(result.fields?.value))
        setOpen(true)
      }
    })
  }

  function toggle() {
    if (isStop) return
    send(!done, saved)
  }

  const stretchValue = input?.kind === 'stretch' ? readStretch(value) : null

  return (
    <li className="border-line border-t py-3 first:border-t-0">
      <div className="flex items-start gap-3">
        {isStop ? (
          <span
            className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full ${done ? 'bg-violet text-on-violet' : 'shadow-[inset_0_0_0_1.5px_var(--color-violet)]'}`}
            aria-hidden="true"
          >
            {done ? <Check size={16} strokeWidth={1.5} /> : null}
          </span>
        ) : (
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            aria-label={done ? copy.untick(step.title) : copy.tick(step.title)}
            disabled={pending}
            onClick={toggle}
            className={`press mt-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 p-0 ${done ? 'bg-violet text-on-violet' : 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--color-line-2)] hover:shadow-[inset_0_0_0_1.5px_var(--color-violet)]'}`}
          >
            {done ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
          </button>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          aria-label={copy.more(step.title)}
          onClick={() => setOpen((value) => !value)}
          className="grid min-w-0 flex-1 cursor-pointer gap-1 border-0 bg-transparent p-0 py-1 text-left"
        >
          <span
            className={`text-[16px] leading-snug font-medium ${done ? 'text-ink-3 line-through decoration-1' : 'text-ink-1'}`}
          >
            {step.title}
          </span>
          <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
            {step.overdue ? (
              <span className="text-violet-ink">{copy.due(step.dayLabel)}</span>
            ) : null}
            {step.tool ? <span className="text-ink-3">{copy.tools.names[step.tool]}</span> : null}
          </span>
        </button>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`text-ink-3 mt-2.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open ? (
        <div id={panel} className="grid gap-4 pt-3 pb-2 pl-10">
          <p className="text-ink-1 m-0 max-w-[56ch] text-[15px] leading-relaxed">{step.what}</p>
          <div className="grid gap-1">
            <span className="meta">{copy.doneMeans}</span>
            <p className="text-ink-2 m-0 max-w-[56ch] text-[15px]">{step.done}</p>
          </div>
          {step.example ? (
            <div className="grid gap-1">
              <span className="meta">{copy.example}</span>
              <p className="text-ink-2 m-0 max-w-[56ch] text-[15px] italic">{step.example}</p>
            </div>
          ) : null}

          {step.guide && step.card ? (
            <a
              href={step.guide}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary press min-h-10 w-fit text-[14px]"
            >
              {copy.openCard(String(step.card))}
            </a>
          ) : null}

          {input?.kind === 'stop' ? (
            <Link
              href={`/stops/${input.stop}`}
              className="btn btn-primary press min-h-11 w-fit text-[15px]"
            >
              {copy.openStop(String(input.stop))}
            </Link>
          ) : null}

          {input?.kind === 'link' || input?.kind === 'number' || input?.kind === 'text' ? (
            <form
              className="grid gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                send(Boolean(value.trim()) || done, value)
              }}
            >
              <label htmlFor={`${panel}-value`} className="text-ink-2 text-[14px]">
                {input.label}
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id={`${panel}-value`}
                  className="field min-w-0 flex-1 basis-[220px]"
                  inputMode={
                    input.kind === 'number' ? 'numeric' : input.kind === 'link' ? 'url' : 'text'
                  }
                  value={value}
                  maxLength={input.kind === 'text' ? 400 : 600}
                  placeholder={input.kind === 'text' ? input.placeholder : undefined}
                  onChange={(event) => {
                    setError(null)
                    setValue(event.target.value)
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary press min-h-12"
                  disabled={pending || value === saved}
                >
                  {pending ? copy.saving : value === saved && saved ? copy.saved : copy.save}
                </button>
              </div>
            </form>
          ) : null}

          {input?.kind === 'stretch' && stretchValue ? (
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                send(stretchValue.picked.length + (stretchValue.own.trim() ? 1 : 0) === 2, value)
              }}
            >
              <span className="text-ink-2 text-[14px]">
                {copy.stretch.chosen(
                  String(stretchValue.picked.length + (stretchValue.own.trim() ? 1 : 0)),
                )}
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label={copy.stretch.pick}>
                {stretch.map((option) => {
                  const on = stretchValue.picked.includes(option.id)
                  const full = stretchValue.picked.length + (stretchValue.own.trim() ? 1 : 0) >= 2
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="chip press text-[14px]"
                      aria-pressed={on}
                      aria-disabled={!on && full}
                      onClick={() => {
                        if (!on && full) return
                        setValue(
                          JSON.stringify({
                            ...stretchValue,
                            picked: on
                              ? stretchValue.picked.filter((id) => id !== option.id)
                              : [...stretchValue.picked, option.id],
                          }),
                        )
                      }}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <label htmlFor={`${panel}-own`} className="text-ink-2 text-[14px]">
                {copy.stretch.own}
              </label>
              <input
                id={`${panel}-own`}
                className="field"
                value={stretchValue.own}
                maxLength={200}
                placeholder={copy.stretch.ownPlaceholder}
                onChange={(event) =>
                  setValue(JSON.stringify({ ...stretchValue, own: event.target.value }))
                }
              />
              <button
                type="submit"
                className="btn btn-secondary press min-h-11 w-fit"
                disabled={pending || value === saved}
              >
                {pending ? copy.saving : value === saved && saved ? copy.saved : copy.save}
              </button>
            </form>
          ) : null}

          {error ? (
            <p role="alert" className="text-violet-ink m-0 text-[14px]">
              {error}
            </p>
          ) : null}

          <Link
            href={`/messages?step=${encodeURIComponent(step.id)}`}
            className="btn btn-quiet press w-fit px-0 text-[14px]"
          >
            {messagesCopy.open}
          </Link>
        </div>
      ) : null}
    </li>
  )
}

/** The team's fix list from a review: ticks, nothing more. */
export function FixList({ fixes, label }: { fixes: FixView[]; label: string }) {
  return (
    <ul className="m-0 grid list-none p-0" aria-label={label}>
      {fixes.map((fix) => (
        <FixItem key={fix.id} fix={fix} />
      ))}
    </ul>
  )
}

function FixItem({ fix }: { fix: FixView }) {
  const [done, setDone] = useState(fix.done)
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()
  return (
    <li className="border-line flex items-start gap-3 border-t py-3 first:border-t-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? copy.untick(fix.text) : copy.tick(fix.text)}
        disabled={pending}
        onClick={() =>
          start(async () => {
            setFailed(false)
            const result = await tickStep({ stepId: fix.id, done: !done, value: '' })
            if (result.ok) setDone(!done)
            else setFailed(true)
          })
        }
        className={`press mt-0.5 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 p-0 ${done ? 'bg-violet text-on-violet' : 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--color-line-2)] hover:shadow-[inset_0_0_0_1.5px_var(--color-violet)]'}`}
      >
        {done ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
      </button>
      <span className={`pt-1 text-[16px] ${done ? 'text-ink-3 line-through' : 'text-ink-1'}`}>
        {fix.text}
      </span>
      {failed ? (
        <span role="alert" className="text-violet-ink ml-auto pt-1 text-[13px]">
          {copy.failed}
        </span>
      ) : null}
    </li>
  )
}
