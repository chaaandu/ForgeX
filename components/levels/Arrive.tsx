'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { arrive as arriveAction } from '@/app/actions/founder'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { arrive as copy } from '@/content/copy'

/**
 * Level 1. The first thing a founder gets is something, not a question: their
 * own card, dropping into place, and a number stamped on it by the order they
 * arrived in. Then the path ahead, and one button.
 */
export function Arrive({
  first,
  card,
  numbered,
  ownOnly = false,
}: {
  first: string
  card: FounderCardData
  numbered: boolean
  ownOnly?: boolean
}) {
  const [number, setNumber] = useState<number | null>(card.number)

  useEffect(() => {
    if (numbered) return
    let live = true
    arriveAction().then((result) => {
      if (live && result.ok) setNumber(result.number)
    })
    return () => {
      live = false
    }
  }, [numbered])

  return (
    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-20">
      <div className="grid gap-8">
        <div className="grid gap-4">
          <h1 className="display rise m-0 text-[clamp(56px,9vw,120px)] leading-[0.92]">
            {copy.hi(first)}
          </h1>
          <p className="rise text-lead text-ink-2 m-0 max-w-[34ch] [animation-delay:120ms]">
            {copy.lead.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <ol className="m-0 grid list-none gap-0 p-0" aria-label={copy.steps}>
          {copy.path.map((raw, index) => {
            const step = ownOnly && 'own' in raw && raw.own ? raw.own : raw
            return (
              <li
                key={step.name}
                className="rise border-line grid grid-cols-[32px_1fr] items-baseline gap-3 border-t py-3.5"
                style={{ animationDelay: `${220 + index * 60}ms` }}
              >
                <span
                  className={`font-mono text-[12px] ${index === 0 ? 'text-violet-ink' : 'text-ink-3'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span
                    className={`display text-[22px] leading-tight ${index === 0 ? 'text-ink-1' : 'text-ink-1/80'}`}
                  >
                    {step.name}
                  </span>
                  <span className="text-ink-3 text-[14px]">{step.line}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <div className="dock rise [animation-delay:640ms]">
          <Link href="/archetype" className="btn btn-primary press min-h-[52px] px-9 text-[16px]">
            {copy.go}
          </Link>
        </div>
      </div>
      <div className="arrive-card order-first justify-self-center md:order-none" aria-live="polite">
        <FounderCard data={{ ...card, number }} size="lg" tilt priority />
        {number === null ? <p className="meta mt-4 text-center">{copy.numbering}</p> : null}
      </div>
    </div>
  )
}
