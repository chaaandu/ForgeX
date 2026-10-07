'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { startResearch } from '@/app/actions/founder'
import { challenge as copy } from '@/content/copy'

/**
 * Level 4. One problem, for everyone, set to land on a phone: the mess in two
 * short lines, what we ask in three, how far it can go, and the dates. One
 * way forward.
 */
export function Challenge({ started }: { started: boolean }) {
  const router = useRouter()
  const [error, setError] = useState(false)
  const [pending, start] = useTransition()

  function go() {
    if (started) {
      router.push('/research')
      return
    }
    start(async () => {
      setError(false)
      const result = await startResearch()
      if (result.ok) router.push('/research')
      else setError(true)
    })
  }

  return (
    <div className="grid max-w-[760px] gap-12">
      <div className="grid gap-6">
        <p className="meta rise m-0">{copy.kicker}</p>
        <h1 className="display rise m-0 text-[clamp(40px,6.4vw,80px)] leading-[0.98] [animation-delay:60ms]">
          {copy.title}
        </h1>
        <div className="rise grid gap-1 [animation-delay:140ms]">
          {copy.body.map((line) => (
            <p key={line} className="text-lead text-ink-2 m-0 max-w-[42ch]">
              {line}
            </p>
          ))}
        </div>
      </div>

      <ol className="m-0 grid list-none gap-0 p-0">
        {copy.asks.map((line, index) => (
          <li
            key={line}
            className="rise border-line grid grid-cols-[32px_1fr] items-baseline gap-3 border-t py-4"
            style={{ animationDelay: `${240 + index * 80}ms` }}
          >
            <span className="text-violet-ink font-mono text-[12px]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="display text-[clamp(24px,3vw,32px)] leading-tight">{line}</span>
          </li>
        ))}
      </ol>

      <p className="rise text-ink-1 m-0 max-w-[48ch] text-[17px] leading-relaxed [animation-delay:520ms]">
        {copy.depth}
      </p>

      <section className="rise grid gap-4 [animation-delay:600ms]" aria-labelledby="next">
        <h2 id="next" className="meta m-0">
          {copy.next}
        </h2>
        <dl className="m-0 grid gap-3">
          {copy.timeline.map((item) => (
            <div key={item.when} className="grid gap-0.5 sm:grid-cols-[200px_1fr] sm:gap-4">
              <dt className="text-ink-3 font-mono text-[13px]">{item.when}</dt>
              <dd className="m-0 text-[15px]">{item.what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="dock md:border-line md:border-t md:pt-6">
        <button
          type="button"
          className="btn btn-primary press min-h-[52px] px-9 text-[16px]"
          disabled={pending}
          onClick={go}
        >
          {pending ? copy.starting : copy.start}
        </button>
        {error ? (
          <p role="alert" className="text-violet-ink m-0 text-[14px]">
            {copy.failed}
          </p>
        ) : null}
      </div>
    </div>
  )
}
