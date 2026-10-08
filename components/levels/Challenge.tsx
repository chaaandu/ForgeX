'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { startResearch } from '@/app/actions/founder'
import { challenge as copy } from '@/content/copy'

/**
 * Level 4, the last step of onboarding. Only the problem: the headline, three
 * numbers read as one chain of cause and effect, the stakes, the challenge in
 * large type, and where the numbers come from. No solution anywhere. One way
 * forward: take it, and the 3 weeks open.
 */
export function Challenge({ started }: { started: boolean }) {
  const router = useRouter()
  const [error, setError] = useState(false)
  const [pending, start] = useTransition()

  function go() {
    if (started) {
      router.push('/start')
      return
    }
    start(async () => {
      setError(false)
      const result = await startResearch()
      if (result.ok) router.push('/start')
      else setError(true)
    })
  }

  return (
    <div className="grid max-w-[820px] gap-10">
      <div className="grid gap-4">
        <p className="meta rise m-0">{copy.kicker}</p>
        <h1 className="page-title rise m-0 max-w-[22ch] [animation-delay:60ms]">{copy.title}</h1>
      </div>

      {/* One chain: closures, then why, then what a kirana can't match. */}
      <ol
        className="m-0 grid list-none items-stretch gap-2 p-0 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"
        aria-label={copy.factsLabel}
      >
        {copy.facts.map((fact, index) => (
          <li key={fact.figure} className="contents">
            {index > 0 ? (
              <span className="text-ink-3 grid place-items-center py-0.5" aria-hidden="true">
                <ArrowDown size={16} strokeWidth={1.5} className="sm:hidden" />
                <ArrowRight size={16} strokeWidth={1.5} className="hidden sm:block" />
              </span>
            ) : null}
            <div
              className="panel rise grid content-start gap-2 p-5"
              style={{ animationDelay: `${160 + index * 90}ms` }}
            >
              <span className="display text-violet-ink text-[clamp(32px,3.6vw,42px)] leading-none">
                {fact.figure}
              </span>
              <span className="text-ink-2 text-[14px] leading-snug">
                {fact.line}
                <sup className="text-ink-3 ml-0.5 font-mono text-[10px]">{fact.source}</sup>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-lead text-ink-1 rise m-0 max-w-[48ch] [animation-delay:440ms]">
        {copy.body}
      </p>

      <p className="display rise m-0 max-w-[32ch] text-[clamp(28px,3.4vw,40px)] leading-[1.1] [animation-delay:520ms]">
        {copy.question.lead} <em>{copy.question.em}</em>
      </p>

      <div className="border-line grid gap-2 border-t pt-4">
        <span className="meta text-[11px]">{copy.sources.label}</span>
        <ol className="m-0 grid list-none gap-1.5 p-0">
          {copy.sources.links.map((source, index) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                aria-label={copy.sources.opens(source.name)}
                className="text-ink-3 hover:text-ink-1 inline-flex items-center gap-2 text-[13px] no-underline transition-colors duration-150"
              >
                <span className="font-mono text-[11px]">{index + 1}</span>
                {source.name}
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="dock md:pt-2">
        <button
          type="button"
          className="btn btn-primary press min-h-[52px] px-9 text-[16px]"
          disabled={pending}
          onClick={go}
        >
          {pending ? copy.starting : copy.start}
        </button>
        {error ? (
          <p role="alert" className="text-error m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </div>
  )
}
