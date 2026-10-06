'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { submitPick } from '@/app/actions/founder'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { Lines } from '@/components/ui/Lines'
import { why as copy } from '@/content/copy'
import type { CustomProblem } from '@/lib/data/picks'
import { nudgeFor, wordCount, type WhyField } from '@/lib/nudges'
import type { Problem } from '@/lib/problem'

type Fields = Record<WhyField | 'contact', string>
const FIELDS: WhyField[] = ['whyProblem', 'whyUser', 'whyPay']

/**
 * Level 6. Three short answers in the order a founder should think them:
 * why the problem, who has it, who pays. Guidance appears under each as they
 * type and never blocks sending. Sending is the achievement: the card takes
 * the problem's finish, and the page becomes their home.
 */
export function Why({
  problem,
  custom,
  card,
  slug,
  closesAt,
  onBack,
}: {
  problem: Problem | null
  custom: CustomProblem | null
  card: FounderCardData
  slug: string
  /** When picks close, already formatted, for the closed message. */
  closesAt: string
  onBack?: () => void
}) {
  const [fields, setFields] = useState<Fields>({
    whyProblem: '',
    whyUser: '',
    whyPay: '',
    contact: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [pending, start] = useTransition()
  const title = problem?.title ?? custom?.title ?? ''
  const ready = FIELDS.every((field) => fields[field].trim().length >= 20)

  function send() {
    start(async () => {
      setError(null)
      const result = await submitPick({
        problemId: problem?.id ?? null,
        custom: custom ?? null,
        ...fields,
      })
      if (result.ok) setSent(true)
      else
        setError(
          result.error === 'closed'
            ? copy.closed(closesAt)
            : result.error === 'locked'
              ? copy.locked
              : copy.failed,
        )
    })
  }

  if (sent) {
    return (
      <div
        className="bg-ground fixed inset-0 z-40 grid overflow-y-auto px-5 py-12 md:place-items-center md:px-10"
        role="status"
      >
        <div className="mx-auto grid w-full max-w-[1040px] items-center gap-12 md:grid-cols-[minmax(0,380px)_1fr]">
          <div className="sent-card justify-self-center">
            <FounderCard
              data={{ ...card, problemTitle: title, finish: problem ? problem.rarity : 'original' }}
              size="lg"
              tilt
            />
          </div>
          <div className="rise grid gap-5 [animation-delay:900ms]">
            <h1 className="display m-0 text-[clamp(56px,8vw,104px)] leading-none">
              {copy.sent.title}
            </h1>
            <p className="text-lead text-ink-2 m-0 max-w-[40ch]">{copy.sent.lead}</p>
            <div>
              <Link
                href={`/f/${slug}`}
                className="btn btn-primary press min-h-[52px] px-9 text-[16px]"
              >
                {copy.sent.go}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid max-w-[760px] gap-10">
      <div className="grid gap-5">
        <h1 className="display rise m-0 text-[clamp(32px,4.4vw,52px)] leading-[1.04]">
          <Lines text={copy.heading} />
        </h1>
        <div className="border-line flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y py-4">
          <span className="meta">{copy.for}</span>
          <span className="display text-[22px] leading-tight">{title}</span>
          {onBack ? (
            <button
              type="button"
              className="btn btn-quiet press ml-auto min-h-9 px-2 text-[13px]"
              onClick={onBack}
            >
              {copy.change}
            </button>
          ) : (
            <Link href="/matches" className="btn btn-quiet press ml-auto min-h-9 px-2 text-[13px]">
              {copy.change}
            </Link>
          )}
        </div>
      </div>

      {FIELDS.map((field, index) => {
        const nudge = nudgeFor(field, fields[field])
        const id = `why-${field}`
        return (
          <div key={field} className="grid gap-3">
            <label htmlFor={id} className="flex items-baseline gap-3">
              <span className="text-pink-ink font-mono text-[12px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="display text-[clamp(22px,2.4vw,28px)] leading-tight">
                {copy.prompts[field].label}
              </span>
            </label>
            <textarea
              id={id}
              className="field min-h-[132px] text-[16px]"
              value={fields[field]}
              maxLength={1500}
              placeholder={copy.prompts[field].placeholder}
              aria-describedby={`${id}-hint`}
              onChange={(event) =>
                setFields((current) => ({ ...current, [field]: event.target.value }))
              }
            />
            <div
              id={`${id}-hint`}
              className="flex min-h-5 items-start justify-between gap-4 text-[13px]"
              aria-live="polite"
            >
              <span className={nudge ? 'text-pink-ink' : ''}>
                {nudge ? copy.nudges[nudge] : ''}
              </span>
              <span className="meta shrink-0">{copy.words(wordCount(fields[field]))}</span>
            </div>
          </div>
        )
      })}

      <div className="grid gap-3">
        <label htmlFor="why-contact" className="flex flex-wrap items-baseline gap-3">
          <span className="display text-ink-2 text-[clamp(20px,2.2vw,24px)] leading-tight">
            {copy.prompts.contact.label}
          </span>
          <span className="meta">{copy.prompts.contact.optional}</span>
        </label>
        <textarea
          id="why-contact"
          className="field min-h-[88px]"
          value={fields.contact}
          maxLength={600}
          placeholder={copy.prompts.contact.placeholder}
          onChange={(event) =>
            setFields((current) => ({ ...current, contact: event.target.value }))
          }
        />
      </div>

      <div className="border-line flex flex-wrap items-center gap-4 border-t pt-6">
        <button
          type="button"
          className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
          disabled={!ready || pending}
          onClick={send}
        >
          {pending ? copy.sending : copy.send}
        </button>
        {error ? (
          <p role="alert" className="text-pink-ink m-0 text-[14px]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
