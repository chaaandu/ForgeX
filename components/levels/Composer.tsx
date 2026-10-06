'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FounderCardData } from '@/components/card/FounderCard'
import { composer as copy, why as whyCopy, world as worldCopy } from '@/content/copy'
import type { CustomProblem } from '@/lib/data/picks'
import { composerNudge, wordCount } from '@/lib/nudges'
import { INDUSTRIES, SIDES } from '@/lib/taxonomy'
import { Why } from './Why'

/**
 * A founder's own problem, in the same shape as ours, then the same why.
 * It is held in the browser until the why is sent, so a half-written problem
 * never reaches the team.
 */
export function Composer({
  card,
  slug,
  closesAt,
  ownOnly = false,
}: {
  card: FounderCardData
  slug: string
  closesAt: string
  ownOnly?: boolean
}) {
  const [draft, setDraft] = useState<CustomProblem>({
    title: '',
    problem: '',
    challenge: '',
    industry: 'retail',
    side: 'business',
  })
  const [picked, setPicked] = useState(false)
  const [ready, setReady] = useState(false)

  if (ready)
    return (
      <Why
        problem={null}
        custom={draft}
        card={card}
        slug={slug}
        closesAt={closesAt}
        onBack={() => setReady(false)}
      />
    )

  const valid =
    draft.title.trim().length >= 3 &&
    wordCount(draft.title) < 10 &&
    draft.problem.trim().length >= 40 &&
    draft.challenge.trim().length >= 10 &&
    picked

  const field = (name: 'title' | 'problem' | 'challenge', multiline: boolean, max: number) => {
    const nudge = composerNudge(name, draft[name])
    const id = `own-${name}`
    return (
      <div className="grid gap-2.5">
        <label htmlFor={id} className="meta">
          {copy.fields[name].label}
        </label>
        {multiline ? (
          <textarea
            id={id}
            className="field min-h-[120px]"
            value={draft[name]}
            maxLength={max}
            placeholder={copy.fields[name].placeholder}
            onChange={(event) =>
              setDraft((current) => ({ ...current, [name]: event.target.value }))
            }
          />
        ) : (
          <textarea
            id={id}
            rows={2}
            className={`field min-h-0 resize-none ${name === 'title' ? 'display text-[22px] leading-tight' : ''}`}
            value={draft[name]}
            maxLength={max}
            placeholder={copy.fields[name].placeholder}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                [name]: event.target.value.replace(/\n/g, ' '),
              }))
            }
          />
        )}
        <span className="text-pink-ink min-h-5 text-[13px]" aria-live="polite">
          {nudge ? whyCopy.nudges[nudge] : ''}
        </span>
      </div>
    )
  }

  return (
    <div className="grid max-w-[760px] gap-8">
      <div className="grid gap-3">
        <h1 className="display rise m-0 text-[clamp(40px,5.4vw,64px)] leading-none">
          {ownOnly ? copy.ownTitle : copy.title}
        </h1>
        <p className="rise text-lead text-ink-2 m-0 [animation-delay:80ms]">
          {ownOnly ? copy.ownLead : copy.lead}
        </p>
      </div>
      {field('title', false, 80)}
      {field('problem', true, 700)}
      {field('challenge', false, 200)}
      <div className="grid gap-3">
        <p className="meta m-0" id="own-industry">
          {copy.fields.industry}
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="own-industry">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry.id}
              type="button"
              role="radio"
              aria-checked={picked && draft.industry === industry.id}
              className="chip press"
              onClick={() => {
                setPicked(true)
                setDraft((current) => ({ ...current, industry: industry.id }))
              }}
            >
              {industry.label}
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={picked && draft.industry === 'other'}
            className="chip press"
            onClick={() => {
              setPicked(true)
              setDraft((current) => ({ ...current, industry: 'other' }))
            }}
          >
            {worldCopy.industries.other}
          </button>
        </div>
      </div>
      <div className="grid gap-3">
        <p className="meta m-0" id="own-side">
          {copy.fields.side}
        </p>
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-labelledby="own-side">
          {SIDES.map((side) => (
            <button
              key={side.id}
              type="button"
              role="radio"
              aria-checked={draft.side === side.id}
              className="choice press"
              onClick={() => setDraft((current) => ({ ...current, side: side.id }))}
            >
              {side.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dock md:border-line justify-between md:border-t md:pt-6">
        {ownOnly ? (
          <Link href="/world" className="btn btn-quiet press -ml-3">
            {worldCopy.back}
          </Link>
        ) : (
          <Link href="/matches" className="btn btn-quiet press -ml-3">
            {copy.back}
          </Link>
        )}
        <button
          type="button"
          className="btn btn-primary press min-w-[180px]"
          disabled={!valid}
          onClick={() => setReady(true)}
        >
          {copy.next}
        </button>
      </div>
    </div>
  )
}
