'use client'

import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'
import { useState } from 'react'
import { DifficultyTag } from '@/components/ui/DifficultyTag'
import { FounderBrief, type Brief } from './FounderBrief'
import { ReplyForm } from './ReplyForm'
import { consoleCopy, why as whyCopy } from '@/content/copy'
import { ago, shortDate } from '@/lib/dates'
import { nameOf } from '@/lib/team-name'
import type { Difficulty } from '@/lib/taxonomy'

const copy = consoleCopy.queue

export type QueueItem = {
  pickId: string
  submittedAt: string
  founder: {
    name: string
    slug: string
    photo: string
    archetype: string
    previous: number
    brief: Brief
  }
  problem: {
    title: string
    problem: string
    challenge: string
    difficulty: Difficulty | null
    own: boolean
  }
  whyProblem: string
  whyUser: string
  whyPay: string
  contact: string
  /** Set when this is their change after Needs a tweak: what we asked, and who asked. */
  revision: { note: string; author: string; sentAt: string } | null
}

/**
 * Oldest first. One why on screen at a time, with everything needed to judge
 * the fit beside it, and four plain buttons for the answer.
 */
export function Queue({
  items,
  bank,
}: {
  items: QueueItem[]
  bank: { id: string; title: string }[]
}) {
  const [index, setIndex] = useState(0)
  const item = items[Math.min(index, items.length - 1)]

  if (!item) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <p className="display text-ink-2 m-0 text-[32px]">{copy.empty}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="grid content-start gap-2">
        <p className="meta m-0">
          {copy.oldest} · {items.length}
        </p>
        <ol className="m-0 grid max-h-[70vh] list-none gap-1 overflow-y-auto p-0">
          {items.map((entry, position) => (
            <li key={entry.pickId}>
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-current={position === index ? 'true' : undefined}
                className={`press flex w-full items-center gap-3 rounded-xl border-0 p-2 text-left ${position === index ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
              >
                <Avatar src={entry.founder.photo} size={36} />
                <span className="grid min-w-0">
                  <span className="text-ink-1 truncate text-[14px]">{entry.founder.name}</span>
                  <span className="text-ink-3 truncate text-[12px]">
                    {entry.revision ? `${copy.revisedShort} · ` : ''}
                    {ago(entry.submittedAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <article
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
        aria-label={item.founder.name}
      >
        <div className="grid content-start gap-6">
          <header className="flex flex-wrap items-center gap-4">
            <Avatar src={item.founder.photo} size={64} />
            <div className="grid gap-1">
              <h1 className="display m-0 text-[32px] leading-none">{item.founder.name}</h1>
              <p className="text-ink-2 m-0 text-[14px]">
                {item.founder.archetype} · {copy.waitingFor(ago(item.submittedAt))}
                {item.revision ? <span className="text-violet-ink"> · {copy.revised}</span> : null}
                {item.founder.previous && !item.revision
                  ? ` · ${copy.pickNumber(item.founder.previous + 1)}`
                  : ''}
              </p>
            </div>
            <Link
              href={`/f/${item.founder.slug}`}
              className="btn btn-quiet press ml-auto text-[13px]"
              target="_blank"
            >
              {copy.open}
            </Link>
          </header>

          <section className="panel grid gap-3 p-5">
            <div className="flex items-center justify-between">
              {item.problem.difficulty ? (
                <DifficultyTag difficulty={item.problem.difficulty} />
              ) : (
                <span className="meta">{copy.theirOwn}</span>
              )}
            </div>
            <h2 className="display m-0 text-[26px] leading-tight">{item.problem.title}</h2>
            <p className="text-ink-2 m-0 text-[14px] leading-relaxed">{item.problem.problem}</p>
            <p className="m-0 text-[15px]">{item.problem.challenge}</p>
          </section>

          {item.revision ? (
            <aside
              className="grid gap-2 rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]"
              style={{ background: 'color-mix(in oklab, var(--color-violet) 9%, transparent)' }}
              aria-label={copy.youAsked}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="meta text-violet-ink">{copy.youAsked}</span>
                <span className="text-ink-3 font-mono text-[12px]">
                  {copy.askedBy(nameOf(item.revision.author), shortDate(item.revision.sentAt))}
                </span>
              </span>
              <p className="m-0 text-[16px] leading-relaxed whitespace-pre-line">
                {item.revision.note}
              </p>
            </aside>
          ) : null}

          <dl className="m-0 grid gap-5">
            {(['whyProblem', 'whyUser', 'whyPay', 'contact'] as const).map((field) =>
              item[field] ? (
                <div key={field} className="grid gap-1.5">
                  <dt className="meta">{whyCopy.prompts[field].label}</dt>
                  <dd className="m-0 text-[16px] leading-relaxed whitespace-pre-line">
                    {item[field]}
                  </dd>
                </div>
              ) : null,
            )}
          </dl>

          <div className="border-line border-t pt-6">
            <ReplyForm key={item.pickId} pickId={item.pickId} bank={bank} />
          </div>
        </div>

        <aside className="grid content-start gap-5 xl:sticky xl:top-24">
          <FounderBrief brief={item.founder.brief} />
        </aside>
      </article>
    </div>
  )
}
