'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { saveTrial } from '@/app/actions/founder'
import { setLevelProgress } from '@/components/shell/progress'
import { archetypeFlow as copy, trial as trialCopy } from '@/content/copy'
import { TRIAL, type ArchetypeId } from '@/lib/archetype'
import { Lines } from '@/components/ui/Lines'

/**
 * Seven questions, one card at a time. Tap an answer and the next card slides
 * in; 1, 2 and 3 answer from the keyboard; Back, the left arrow or a swipe
 * right goes back one. Nothing is sent until the seventh answer, and the
 * server works out the archetype itself.
 */
export function Quiz({ retake, onPlaced }: { retake: boolean; onPlaced: (archetype: ArchetypeId) => void }) {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const touch = useRef<number | null>(null)

  const question = step >= 0 ? TRIAL[step] : undefined

  useEffect(() => {
    setLevelProgress(Math.max(0, step) / TRIAL.length)
  }, [step])

  const send = useCallback(
    async (final: Record<string, string>) => {
      setSaving(true)
      setError(false)
      const result = await saveTrial(final)
      setSaving(false)
      if (result.ok) onPlaced(result.archetype as ArchetypeId)
      else setError(true)
    },
    [onPlaced],
  )

  const choose = useCallback(
    (key: string) => {
      if (!question || saving) return
      const next = { ...answers, [question.id]: key }
      setAnswers(next)
      window.setTimeout(() => {
        if (step < TRIAL.length - 1) setStep(step + 1)
        else void send(next)
      }, 180)
    },
    [answers, question, saving, send, step],
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!question || event.metaKey || event.ctrlKey || event.altKey) return
      const index = Number(event.key) - 1
      const option = question.options[index]
      if (option) {
        event.preventDefault()
        choose(option.key)
      }
      if (event.key === 'ArrowLeft' && step > 0) setStep(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose, question, step])

  if (step < 0) {
    return (
      <div className="rise grid max-w-[640px] gap-8">
        <div className="grid gap-4">
          <h1 className="display m-0 text-[clamp(44px,7vw,88px)] leading-[0.95]">
            {retake ? copy.intro.retakeTitle : copy.intro.title}
          </h1>
          <p className="m-0 max-w-[40ch] text-lead text-ink-2">{retake ? copy.intro.retakeLead : copy.intro.lead}</p>
        </div>
        <div>
          <button type="button" className="btn btn-primary press min-h-[52px] px-9 text-[16px]" onClick={() => setStep(0)}>
            {copy.intro.start}
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null
  const text = trialCopy[question.id]

  return (
    <div
      className="grid max-w-[720px] gap-8"
      onTouchStart={(event) => {
        touch.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touch.current
        const end = event.changedTouches[0]?.clientX
        if (start !== null && end !== undefined && end - start > 80 && step > 0) setStep(step - 1)
        touch.current = null
      }}
    >
      <p className="sr-only" aria-live="polite">
        {copy.question(step + 1, TRIAL.length)}
      </p>

      <div key={question.id} className="quiz-card grid gap-6">
        <h2 className="ask m-0" id={`q-${question.id}`}>
          <Lines text={text?.prompt ?? ''} />
        </h2>
        <div className="grid gap-2.5" role="radiogroup" aria-labelledby={`q-${question.id}`}>
          {question.options.map((option, index) => (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={answers[question.id] === option.key}
              className="choice press min-h-[68px] text-[17px]"
              onClick={() => choose(option.key)}
              disabled={saving}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] text-ink-3 shadow-[inset_0_0_0_1px_var(--color-line-2)]">
                {index + 1}
              </span>
              {text?.options[option.key]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-12 items-center justify-between gap-4">
        <button
          type="button"
          className="btn btn-quiet press -ml-3"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || saving}
        >
          {copy.back}
        </button>
        {saving ? <p className="meta m-0">{copy.placing}</p> : <p className="meta m-0 hidden md:block">{copy.keys}</p>}
        {error ? (
          <div className="flex items-center gap-3" role="alert">
            <p className="m-0 text-[14px] text-ink-2">{copy.error}</p>
            <button type="button" className="btn btn-secondary press" onClick={() => void send(answers)}>
              {copy.retry}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
