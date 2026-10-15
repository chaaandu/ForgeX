'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { pickFromBank } from '@/app/actions/founder'
import { ProblemCard } from '@/components/problem/ProblemCard'
import { ProblemSheet } from '@/components/problem/ProblemSheet'
import { matches as copy, problem as problemCopy } from '@/content/copy'
import type { FounderProblem } from '@/lib/problem'

export type FounderMatch = { problem: FounderProblem; gentle: boolean; others: number }

/**
 * The bank, for a founder without an approved problem of their own. Opening a
 * problem shows what we expect in 2 days; one button makes it theirs, with no
 * way to swap, which the sheet says before they press it.
 */
export function Matches({
  list,
  set,
  sets,
}: {
  list: FounderMatch[]
  /** Which set of 4 this is, from 1, and how many there are. */
  set: number
  sets: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState<FounderMatch | null>(null)
  const [error, setError] = useState<'failed' | 'locked' | 'closed' | null>(null)
  const [pending, start] = useTransition()
  const gentle = list.length > 0 && list.every((match) => match.gentle)

  function pick(problemId: string) {
    start(async () => {
      setError(null)
      const result = await pickFromBank(problemId)
      if (result.ok) router.push('/build')
      else
        setError(result.error === 'locked' || result.error === 'closed' ? result.error : 'failed')
    })
  }

  return (
    <div className="grid gap-10">
      <div className="grid gap-3">
        <h1 className="display rise m-0 text-[clamp(40px,5.4vw,68px)] leading-[0.98]">
          {gentle
            ? copy.gentleTitle
            : list.length
              ? set > 1
                ? copy.moreTitle
                : copy.title
              : copy.empty.title}
        </h1>
        <p className="rise text-lead text-ink-2 m-0 max-w-[52ch] [animation-delay:80ms]">
          {gentle ? copy.gentleLead : list.length ? copy.lead : copy.empty.lead}
        </p>
      </div>

      {list.length ? (
        <ul className="m-0 list-none columns-1 gap-4 p-0 lg:columns-2" aria-label={copy.title}>
          {list.map((match, index) => (
            <li
              key={match.problem.id}
              className="rise mb-4 grid break-inside-avoid"
              style={{ animationDelay: `${120 + index * 70}ms` }}
            >
              <ProblemCard
                problem={match.problem}
                others={match.others}
                onOpen={() => setOpen(match)}
              />
            </li>
          ))}
        </ul>
      ) : null}


      <div className="flex flex-wrap items-center gap-2">
        {set < sets ? (
          <Link href={`/matches?set=${set + 1}`} className="btn btn-secondary press">
            {copy.next}
          </Link>
        ) : null}
        {set > 1 ? (
          <Link
            href={set === 2 ? '/matches' : `/matches?set=${set - 1}`}
            className="btn btn-quiet press"
          >
            {copy.previous}
          </Link>
        ) : null}
        <Link href="/world" className="btn btn-quiet press">
          {copy.changeAnswers}
        </Link>
      </div>

      <ProblemSheet
        problem={open?.problem ?? null}
        others={open?.others ?? 0}
        open={open !== null}
        onOpenChange={(next) => {
          if (next || pending) return
          setOpen(null)
          setError(null)
        }}
        action={
          open ? (
            <div className="grid gap-3">
              <p
                role={error ? 'alert' : undefined}
                className={`m-0 text-[14px] ${error ? 'text-error' : 'text-ink-2'}`}
              >
                {error ? problemCopy[error] : problemCopy.final}
              </p>
              <button
                type="button"
                className="btn btn-primary press min-h-[52px] w-full text-[16px]"
                disabled={pending}
                onClick={() => pick(open.problem.id)}
              >
                {pending ? problemCopy.picking : problemCopy.build}
              </button>
            </div>
          ) : null
        }
      />
    </div>
  )
}
