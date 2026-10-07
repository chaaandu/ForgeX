'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FounderCardData } from '@/components/card/FounderCard'
import { composer as copy, why as whyCopy, world as worldCopy } from '@/content/copy'
import type { CustomProblem } from '@/lib/data/picks'
import { composerNudge, wordCount } from '@/lib/nudges'
import { INDUSTRIES, SIDES } from '@/lib/taxonomy'
import { AskedNote } from '@/components/founder/AskedNote'
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
  revision = null,
}: {
  card: FounderCardData
  slug: string
  closesAt: string
  ownOnly?: boolean
  /** Revising their own problem after Needs a tweak: what they sent, and our note. */
  revision?: {
    note: string
    custom: CustomProblem
    answers: { whyProblem: string; whyUser: string; whyPay: string; contact: string }
  } | null
}) {
  const [draft, setDraft] = useState<CustomProblem>(
    revision?.custom ?? {
      title: '',
      problem: '',
      challenge: '',
      industry: 'retail',
      side: 'business',
    },
  )
  const [picked, setPicked] = useState(Boolean(revision))
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
        initial={revision?.answers}
        revision={revision ? { note: revision.note } : null}
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
        <span className="text-violet-ink min-h-5 text-[13px]" aria-live="polite">
          {nudge ? whyCopy.nudges[nudge] : ''}
        </span>
      </div>
    )
  }

  return (
    <div className="grid max-w-[760px] gap-8">
      <div className="grid gap-3">
        <h1 className="display rise m-0 text-[clamp(40px,5.4vw,64px)] leading-none">
          {revision ? whyCopy.revise.title : ownOnly ? copy.ownTitle : copy.title}
        </h1>
        <p className="rise text-lead text-ink-2 m-0 [animation-delay:80ms]">
          {revision ? whyCopy.revise.lead : ownOnly ? copy.ownLead : copy.lead}
        </p>
        {revision ? <AskedNote note={revision.note} /> : null}
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
        {/* The same words as Your world, so a founder never meets two names for one group. */}
        <div className="grid gap-2.5" role="radiogroup" aria-labelledby="own-side">
          {SIDES.map((side) => (
            <button
              key={side.id}
              type="button"
              role="radio"
              aria-checked={draft.side === side.id}
              className="choice press min-h-[72px]"
              onClick={() => setDraft((current) => ({ ...current, side: side.id }))}
            >
              <span className="grid gap-0.5 text-left">
                <span>{worldCopy.side.options[side.id].label}</span>
                <span className="text-ink-3 text-[14px]">
                  {worldCopy.side.options[side.id].sub}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="dock md:border-line justify-between md:border-t md:pt-6">
        {revision ? (
          <Link href={`/f/${slug}`} className="btn btn-quiet press -ml-3">
            {copy.backToProfile}
          </Link>
        ) : ownOnly ? (
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
