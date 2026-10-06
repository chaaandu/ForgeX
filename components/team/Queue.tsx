'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { respond } from '@/app/actions/team'
import { RarityTag } from '@/components/ui/RarityTag'
import { consoleCopy, why as whyCopy } from '@/content/copy'
import { ago } from '@/lib/dates'
import type { Rarity } from '@/lib/taxonomy'

const copy = consoleCopy.queue
const TYPES = ['go', 'tweak', 'talk', 'another'] as const
type Type = (typeof TYPES)[number]
const KEY_TO_TYPE: Record<string, Type> = { g: 'go', w: 'tweak', l: 'talk', a: 'another' }

export type QueueItem = {
  pickId: string
  submittedAt: string
  founder: { name: string; slug: string; photo: string; archetype: string; bio: string; facts: string[]; world: string[]; previous: number }
  problem: { title: string; problem: string; challenge: string; rarity: Rarity | null; own: boolean }
  whyProblem: string
  whyUser: string
  whyPay: string
  contact: string
}

/**
 * Oldest first. One why on screen at a time with everything needed to judge
 * the fit beside it, and the four answers on single keys so a careful review
 * is still a quick one.
 */
export function Queue({ items, bank }: { items: QueueItem[]; bank: { id: string; title: string }[] }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [type, setType] = useState<Type | null>(null)
  const [note, setNote] = useState('')
  const [suggested, setSuggested] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const item = items[Math.min(index, items.length - 1)]

  useEffect(() => {
    setType(null)
    setNote('')
    setSuggested([])
    setSearch('')
    setMessage(null)
  }, [item?.pickId])

  const send = useCallback(() => {
    if (!item || !type) return
    if (type === 'tweak' && !note.trim()) {
      setMessage(copy.noteNeeded)
      noteRef.current?.focus()
      return
    }
    start(async () => {
      const result = await respond({ pickId: item.pickId, type, note, suggested: type === 'another' ? suggested : [] })
      if (result.ok) {
        setMessage(copy.sent)
        router.refresh()
      } else setMessage(copy.failed)
    })
  }, [item, note, router, suggested, type])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const typing = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT'
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        send()
        return
      }
      if (typing) {
        if (event.key === 'Escape') target.blur()
        return
      }
      const key = event.key.toLowerCase()
      if (key === 'j') setIndex((value) => Math.min(items.length - 1, value + 1))
      else if (key === 'k') setIndex((value) => Math.max(0, value - 1))
      else if (key === 'n') {
        event.preventDefault()
        noteRef.current?.focus()
      } else if (KEY_TO_TYPE[key]) setType(KEY_TO_TYPE[key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length, send])

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return bank.filter((problem) => problem.title.toLowerCase().includes(q) && !suggested.includes(problem.id)).slice(0, 6)
  }, [bank, search, suggested])

  if (!item) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <p className="display m-0 text-[32px] text-ink-2">{copy.empty}</p>
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
                <Image src={entry.founder.photo} alt="" width={32} height={32} className="size-8 rounded-lg object-cover" />
                <span className="grid min-w-0">
                  <span className="truncate text-[14px] text-ink-1">{entry.founder.name}</span>
                  <span className="truncate text-[12px] text-ink-3">{ago(entry.submittedAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-3">{copy.help}</p>
      </aside>

      <article className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]" aria-label={item.founder.name}>
        <div className="grid content-start gap-6">
          <header className="flex flex-wrap items-center gap-4">
            <Image src={item.founder.photo} alt="" width={64} height={64} className="size-16 rounded-2xl object-cover" />
            <div className="grid gap-1">
              <h1 className="display m-0 text-[32px] leading-none">{item.founder.name}</h1>
              <p className="m-0 text-[14px] text-ink-2">
                {item.founder.archetype} · {copy.waitingFor(ago(item.submittedAt))}
                {item.founder.previous ? ` · pick ${item.founder.previous + 1}` : ''}
              </p>
            </div>
            <Link href={`/f/${item.founder.slug}`} className="btn btn-quiet press ml-auto text-[13px]" target="_blank">
              {copy.open}
            </Link>
          </header>

          <section className="panel grid gap-3 p-5">
            <div className="flex items-center justify-between">
              {item.problem.rarity ? <RarityTag rarity={item.problem.rarity} /> : <span className="meta">Their own</span>}
            </div>
            <h2 className="display m-0 text-[26px] leading-tight">{item.problem.title}</h2>
            <p className="m-0 text-[14px] leading-relaxed text-ink-2">{item.problem.problem}</p>
            <p className="m-0 text-[15px]">{item.problem.challenge}</p>
          </section>

          <dl className="m-0 grid gap-5">
            {(['whyProblem', 'whyUser', 'whyPay', 'contact'] as const).map((field) =>
              item[field] ? (
                <div key={field} className="grid gap-1.5">
                  <dt className="meta">{whyCopy.prompts[field].label}</dt>
                  <dd className="m-0 text-[16px] leading-relaxed whitespace-pre-line">{item[field]}</dd>
                </div>
              ) : null,
            )}
          </dl>

          <section className="grid gap-4 border-t border-line pt-6" aria-label="Respond">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Response">
              {TYPES.map((value) => (
                <button key={value} type="button" role="radio" aria-checked={type === value} className="chip press" onClick={() => setType(value)}>
                  <span className="font-mono text-[11px]">{copy.keys[value]}</span>
                  {copy.types[value]}
                </button>
              ))}
            </div>
            <label className="grid gap-2">
              <span className="meta">{copy.note}</span>
              <textarea ref={noteRef} className="field min-h-[120px]" value={note} maxLength={2000} placeholder={copy.notePlaceholder} onChange={(event) => setNote(event.target.value)} />
            </label>
            {type === 'another' ? (
              <div className="grid gap-2">
                <span className="meta">{copy.suggest}</span>
                <div className="flex flex-wrap gap-2">
                  {suggested.map((id) => (
                    <button key={id} type="button" className="chip press" aria-pressed="true" onClick={() => setSuggested((list) => list.filter((value) => value !== id))}>
                      {bank.find((problem) => problem.id === id)?.title ?? id} ×
                    </button>
                  ))}
                </div>
                <input className="field" placeholder={copy.suggestPlaceholder} aria-label={copy.suggestPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
                {matches.length ? (
                  <ul className="m-0 grid list-none gap-1 p-0" aria-label="Matching problems">
                    {matches.map((problem) => (
                      <li key={problem.id}>
                        <button type="button" className="press w-full rounded-lg border-0 bg-white/5 px-3 py-2 text-left text-[14px] text-ink-1 hover:bg-white/10" onClick={() => setSuggested((list) => [...list, problem.id].slice(0, 6))}>
                          {problem.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="btn btn-primary press min-w-[140px]" disabled={!type || pending} onClick={send}>
                {copy.send} <span className="font-mono text-[11px]">⌘↵</span>
              </button>
              {message ? <p className="m-0 text-[14px] text-ink-2" role="status">{message}</p> : null}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5 xl:sticky xl:top-24">
          {item.founder.bio ? <p className="display m-0 text-[20px] leading-snug italic">{item.founder.bio}</p> : null}
          <div className="grid gap-2">
            <p className="meta m-0">{copy.their}</p>
            <ul className="m-0 grid list-none gap-1.5 p-0 text-[14px] text-ink-2">
              {item.founder.world.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          {item.founder.facts.length ? (
            <div className="grid gap-2">
              <p className="meta m-0">{copy.profile}</p>
              <ul className="m-0 grid list-none gap-1.5 p-0 text-[14px] text-ink-2">
                {item.founder.facts.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </div>
  )
}
