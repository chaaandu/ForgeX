'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ProblemCard } from '@/components/problem/ProblemCard'
import { ProblemSheet } from '@/components/problem/ProblemSheet'
import { matches as copy, problem as problemCopy } from '@/content/copy'
import type { Match } from '@/lib/match'

export function Matches({ list, waitingFor, again }: { list: Match[]; waitingFor: string | null; again: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState<Match | null>(null)
  const gentle = list.length > 0 && list.every((match) => match.gentle)

  return (
    <div className="grid gap-10">
      <div className="grid gap-3">
        <h1 className="display rise m-0 text-[clamp(40px,5.4vw,68px)] leading-[0.98]">{gentle ? copy.gentleTitle : list.length ? copy.title : copy.empty.title}</h1>
        <p className="rise m-0 max-w-[52ch] text-lead text-ink-2 [animation-delay:80ms]">
          {gentle ? copy.gentleLead : list.length ? copy.lead : copy.empty.lead}
        </p>
        {again && list.length ? <p className="meta m-0 text-pink-ink">{copy.again}</p> : null}
        {waitingFor ? (
          <p className="m-0 rounded-xl px-4 py-3 text-[14px] text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-2)]">
            {copy.waiting(waitingFor)}
          </p>
        ) : null}
      </div>

      {list.length ? (
        <ul className="m-0 grid list-none gap-4 p-0 lg:grid-cols-2" aria-label={copy.title}>
          {list.map((match, index) => (
            <li key={match.problem.id} className="rise grid" style={{ animationDelay: `${120 + index * 70}ms` }}>
              <ProblemCard problem={match.problem} chips={match.chips} onOpen={() => setOpen(match)} />
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href="/matches/new"
        className="press group grid gap-1 rounded-[var(--radius-card)] p-6 text-left no-underline shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-white/[0.03]"
      >
        <span className="display text-[clamp(24px,2.6vw,32px)] leading-tight text-ink-1">
          {copy.writeOwn} <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
        <span className="text-[15px] text-ink-2">{copy.writeOwnLead}</span>
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
