'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ProblemCard } from '@/components/problem/ProblemCard'
import { ProblemSheet } from '@/components/problem/ProblemSheet'
import { matches as copy, problem as problemCopy } from '@/content/copy'
import type { FounderProblem } from '@/lib/problem'

export type FounderMatch = { problem: FounderProblem; gentle: boolean; suggested: boolean }

export function Matches({
  list,
  waitingFor,
  again,
}: {
  list: FounderMatch[]
  waitingFor: string | null
  again: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState<FounderMatch | null>(null)
  const gentle = list.length > 0 && list.every((match) => match.gentle)

  return (
    <div className="grid gap-10">
      <div className="grid gap-3">
        <h1 className="display rise m-0 text-[clamp(40px,5.4vw,68px)] leading-[0.98]">
          {gentle ? copy.gentleTitle : list.length ? copy.title : copy.empty.title}
        </h1>
        <p className="rise text-lead text-ink-2 m-0 max-w-[52ch] [animation-delay:80ms]">
          {gentle ? copy.gentleLead : list.length ? copy.lead : copy.empty.lead}
        </p>
        {again && list.length ? <p className="meta text-violet-ink m-0">{copy.again}</p> : null}
        {waitingFor ? (
          <p className="text-ink-2 m-0 rounded-xl px-4 py-3 text-[14px] shadow-[inset_0_0_0_1px_var(--color-line-2)]">
            {copy.waiting(waitingFor)}
          </p>
        ) : null}
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
                note={match.suggested ? copy.suggestedNote : undefined}
                onOpen={() => setOpen(match)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href="/matches/new"
        className="press group grid gap-1 rounded-[var(--radius-card)] p-6 text-left no-underline shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-white/[0.03]"
      >
        <span className="display text-ink-1 text-[clamp(24px,2.6vw,32px)] leading-tight">
          {copy.writeOwn}{' '}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
        <span className="text-ink-2 text-[15px]">{copy.writeOwnLead}</span>
      </Link>

      <div>
        <Link href="/world" className="btn btn-quiet press -ml-3">
          {copy.changeAnswers}
        </Link>
      </div>

      <ProblemSheet
        problem={open?.problem ?? null}
        open={open !== null}
        onOpenChange={(next) => !next && setOpen(null)}
        action={
          open ? (
            <button
              type="button"
              className="btn btn-primary press min-h-[52px] w-full text-[16px]"
              onClick={() => router.push(`/why?p=${open.problem.id}`)}
            >
              {problemCopy.build}
            </button>
          ) : null
        }
      />
    </div>
  )
}
