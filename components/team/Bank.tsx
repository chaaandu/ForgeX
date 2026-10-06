'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { approveAll, editProblem, setProblemStatus } from '@/app/actions/team'
import { DifficultyTag } from '@/components/ui/DifficultyTag'
import { Signal } from '@/components/ui/Signal'
import { consoleCopy } from '@/content/copy'
import { DIFFICULTY_LABEL } from '@/lib/problem'
import { shortDate } from '@/lib/dates'
import { nameOf } from '@/lib/team-name'
import { DIFFICULTIES, type Difficulty } from '@/lib/taxonomy'

const copy = consoleCopy.bank
type Status = 'draft' | 'approved' | 'rejected'

export type BankItem = {
  id: string
  status: Status
  title: string
  problem: string
  challenge: string
  difficulty: Difficulty
  tags: string[]
  signal: string
  strength: number
  /** Who last approved, rejected or reworded it, and when. Empty until someone does. */
  editedBy: string
  editedAt: string
  internal: {
    evidence: { source: string; url: string; date: string; paraphrase: string }[]
    sources: Record<string, number>
    whyNow: string
    players: { name: string; gap: string }[]
    scores: Record<string, { value: number; note: string }>
    total: number
  } | null
}

/**
 * Nothing reaches a founder until it is approved here. One problem at a time
 * with its evidence and scores beside it; Y, R and E on the keyboard.
 */
export function Bank({ items }: { items: BankItem[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Status | 'all'>(() =>
    items.some((item) => item.status === 'draft') ? 'draft' : 'all',
  )
  const [index, setIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    title: '',
    problem: '',
    challenge: '',
    difficulty: 'medium' as Difficulty,
  })
  const [pending, start] = useTransition()

  const list = useMemo(
    () => items.filter((item) => filter === 'all' || item.status === filter),
    [filter, items],
  )
  const item = list[Math.min(index, Math.max(0, list.length - 1))]
  const drafts = items.filter((entry) => entry.status === 'draft')

  useEffect(() => setEditing(false), [item?.id])

  const mark = useCallback(
    (status: Status) => {
      if (!item) return
      start(async () => {
        const result = await setProblemStatus({ id: item.id, status })
        if (result.ok) router.refresh()
      })
    },
    [item, router],
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        event.metaKey ||
        event.ctrlKey
      )
        return
      const key = event.key.toLowerCase()
      if (key === 'j') setIndex((value) => Math.min(list.length - 1, value + 1))
      else if (key === 'k') setIndex((value) => Math.max(0, value - 1))
      else if (key === 'y') mark('approved')
      else if (key === 'r') mark('rejected')
      else if (key === 'e' && item) {
        setDraft({
          title: item.title,
          problem: item.problem,
          challenge: item.challenge,
          difficulty: item.difficulty,
        })
        setEditing(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, list.length, mark])

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display m-0 text-[40px] leading-none">
          {copy.title} <span className="text-ink-3 font-mono text-[14px]">{items.length}</span>
        </h1>
        {drafts.length ? (
          <button
            type="button"
            className="btn btn-secondary press"
            disabled={pending}
            onClick={() =>
              start(async () => {
                if (!window.confirm(copy.approveAll(drafts.length))) return
                const result = await approveAll(drafts.map((entry) => entry.id))
                if (result.ok) router.refresh()
              })
            }
          >
            {copy.approveAll(drafts.length)}
          </button>
        ) : null}
      </div>
      <div className="quiet-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {(['draft', 'approved', 'rejected', 'all'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className="chip press min-h-9 shrink-0 text-[13px]"
            aria-pressed={filter === key}
            onClick={() => {
              setFilter(key)
              setIndex(0)
            }}
          >
            {copy.filters[key]}{' '}
            <span className="font-mono text-[11px]">
              {key === 'all' ? items.length : items.filter((entry) => entry.status === key).length}
            </span>
          </button>
        ))}
        <p className="text-ink-3 m-0 ml-auto hidden self-center text-[12px] md:block">
          {copy.help}
        </p>
      </div>

      {!item ? (
        <p className="text-ink-3 py-16 text-center">{copy.empty}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ol className="m-0 grid max-h-[72vh] list-none content-start gap-1 overflow-y-auto p-0">
            {list.map((entry, position) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-current={entry.id === item.id ? 'true' : undefined}
                  className={`press grid w-full gap-1 rounded-xl border-0 p-2.5 text-left ${entry.id === item.id ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-ink-3 font-mono text-[11px]">{entry.id}</span>
                    <DifficultyTag difficulty={entry.difficulty} />
                  </span>
                  <span className="text-ink-1 text-[14px] leading-snug">{entry.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <article className="grid content-start gap-6">
            {editing ? (
              <div className="panel grid gap-4 p-6">
                <input
                  className="field display h-14 text-[22px]"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  aria-label={copy.fields.title}
                />
                <textarea
                  className="field"
                  value={draft.problem}
                  onChange={(event) => setDraft({ ...draft, problem: event.target.value })}
                  aria-label={copy.fields.problem}
                />
                <input
                  className="field"
                  value={draft.challenge}
                  onChange={(event) => setDraft({ ...draft, challenge: event.target.value })}
                  aria-label={copy.fields.challenge}
                />
                <select
                  className="field"
                  value={draft.difficulty}
                  onChange={(event) =>
                    setDraft({ ...draft, difficulty: event.target.value as Difficulty })
                  }
                  aria-label={copy.fields.difficulty}
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {DIFFICULTY_LABEL[difficulty]}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary press"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        const result = await editProblem({ id: item.id, ...draft })
                        if (result.ok) {
                          setEditing(false)
                          router.refresh()
                        }
                      })
                    }
                  >
                    {copy.save}
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet press"
                    onClick={() => setEditing(false)}
                  >
                    {copy.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="panel grid gap-4 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <DifficultyTag difficulty={item.difficulty} />
                  <span className="flex flex-wrap items-baseline gap-3">
                    {item.editedBy ? (
                      <span className="text-ink-3 font-mono text-[12px]">
                        {copy.editedBy(nameOf(item.editedBy), shortDate(item.editedAt))}
                      </span>
                    ) : null}
                    <span
                      className={`meta ${item.status === 'approved' ? 'text-ok' : item.status === 'rejected' ? 'text-pink-ink' : ''}`}
                    >
                      {copy.status[item.status]}
                    </span>
                  </span>
                </div>
                <h2 className="display m-0 text-[clamp(28px,3vw,40px)] leading-[1.05]">
                  {item.title}
                </h2>
                <p className="text-ink-2 m-0 text-[16px] leading-relaxed">{item.problem}</p>
                <p className="m-0 rounded-xl bg-black/25 px-4 py-3 text-[16px] shadow-[inset_0_0_0_1px_var(--color-line)]">
                  {item.challenge}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-ink-2 m-0 flex items-center gap-3 text-[14px]">
                  <Signal strength={item.strength} label={copy.strength(item.strength)} />
                  {item.signal}
                </p>
                <div className="border-line flex flex-wrap gap-2 border-t pt-4">
                  <button
                    type="button"
                    className="btn btn-primary press"
                    disabled={pending}
                    onClick={() => mark('approved')}
                  >
                    {copy.approve}{' '}
                    <span className="font-mono text-[11px]">{copy.keys.approve}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary press"
                    disabled={pending}
                    onClick={() => mark('rejected')}
                  >
                    {copy.reject} <span className="font-mono text-[11px]">{copy.keys.reject}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet press"
                    onClick={() => {
                      setDraft({
                        title: item.title,
                        problem: item.problem,
                        challenge: item.challenge,
                        difficulty: item.difficulty,
                      })
                      setEditing(true)
                    }}
                  >
                    {copy.edit} <span className="font-mono text-[11px]">{copy.keys.edit}</span>
                  </button>
                  {item.status !== 'draft' ? (
                    <button
                      type="button"
                      className="btn btn-quiet press"
                      disabled={pending}
                      onClick={() => mark('draft')}
                    >
                      {copy.draft}
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {item.internal ? (
              <div className="grid gap-6 md:grid-cols-2">
                <section className="grid content-start gap-3">
                  <h3 className="meta m-0">
                    {copy.scores} · {item.internal.total}
                  </h3>
                  <dl className="m-0 grid gap-2">
                    {Object.entries(item.internal.scores).map(([name, score]) => (
                      <div
                        key={name}
                        className="grid grid-cols-[110px_28px_1fr] items-baseline gap-2 text-[13px]"
                      >
                        <dt className="text-ink-3 capitalize">{name}</dt>
                        <dd className="text-ink-1 m-0 font-mono">{score.value}</dd>
                        <dd className="text-ink-2 m-0">{score.note}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="meta m-0 mt-3">{copy.whyNow}</h3>
                  <p className="text-ink-2 m-0 text-[14px]">{item.internal.whyNow}</p>
                  {item.internal.players.length ? (
                    <>
                      <h3 className="meta m-0 mt-3">{copy.players}</h3>
                      <ul className="text-ink-2 m-0 grid list-none gap-1.5 p-0 text-[14px]">
                        {item.internal.players.map((player) => (
                          <li key={player.name}>
                            <span className="text-ink-1">{player.name}</span>: {player.gap}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </section>
                <section className="grid content-start gap-3">
                  <h3 className="meta m-0">
                    {copy.evidence} · {item.internal.evidence.length}
                  </h3>
                  <ul className="m-0 grid max-h-[460px] list-none gap-3 overflow-y-auto p-0">
                    {item.internal.evidence.map((entry) => (
                      <li key={entry.url} className="grid gap-0.5 text-[13px]">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-1 decoration-line-2 hover:decoration-pink underline underline-offset-4"
                        >
                          {entry.paraphrase}
                        </a>
                        <span className="text-ink-3">
                          {entry.source} · {entry.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}
          </article>
        </div>
      )}
    </div>
  )
}
