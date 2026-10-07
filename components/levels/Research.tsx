'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { saveResearch } from '@/app/actions/founder'
import { FounderCard, type FounderCardData } from '@/components/card/FounderCard'
import { setLevelProgress } from '@/components/shell/progress'
import { Lines } from '@/components/ui/Lines'
import { messages as messagesCopy, research as copy } from '@/content/copy'

type App = { name: string; note: string }
type Talk = { who: string; breaks: string; said: string }

export type ResearchDraft = {
  forWho: string
  problem: string
  moment: string
  apps: App[]
  talks: Talk[]
  reading: string[]
}

/** Mirrors MIN in lib/data/research.ts; the server checks again before it saves. */
const MIN = { forWho: 3, problem: 40, moment: 10, apps: 3 }

const blankApp = (): App => ({ name: '', note: '' })
const blankTalk = (): Talk => ({ who: '', breaks: '', said: '' })

function padded<T>(list: T[], length: number, blank: () => T): T[] {
  return [...list, ...Array.from({ length: Math.max(0, length - list.length) }, blank)]
}

/**
 * Level 5, days 1 and 2. Three parts in the order a founder should do them:
 * read what's out there, talk to owners if they can, then say it in their own
 * words. Sending opens the plan; nobody approves it, and it stays editable.
 */
export function Research({
  initial,
  sent: alreadySent,
  card,
}: {
  initial: ResearchDraft | null
  sent: boolean
  card: FounderCardData
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<ResearchDraft>(() => ({
    forWho: initial?.forWho ?? '',
    problem: initial?.problem ?? '',
    moment: initial?.moment ?? '',
    apps: padded(initial?.apps ?? [], 3, blankApp),
    talks: padded(initial?.talks ?? [], 1, blankTalk),
    reading: initial?.reading ?? [],
  }))
  const [status, setStatus] = useState<'idle' | 'saved' | 'failed' | 'badLink'>('idle')
  const [justSent, setJustSent] = useState(false)
  const [pending, start] = useTransition()

  const set = (patch: Partial<ResearchDraft>) => {
    setStatus('idle')
    setDraft((current) => ({ ...current, ...patch }))
  }

  const appsDone = draft.apps.filter((app) => app.name.trim() && app.note.trim()).length
  const parts = [
    Math.min(appsDone, MIN.apps) / MIN.apps,
    draft.forWho.trim().length >= MIN.forWho ? 1 : 0,
    draft.problem.trim().length >= MIN.problem ? 1 : 0,
    draft.moment.trim().length >= MIN.moment ? 1 : 0,
  ]
  const ready = parts.every((part) => part === 1)

  useEffect(() => {
    if (!alreadySent) setLevelProgress(parts.reduce((sum, part) => sum + part, 0) / parts.length)
  })

  function save(send: boolean) {
    start(async () => {
      setStatus('idle')
      const result = await saveResearch({ research: draft, send })
      if (result.ok) {
        if (send && !alreadySent) setJustSent(true)
        else {
          setStatus('saved')
          router.refresh()
        }
      } else setStatus(result.fields?.reading ? 'badLink' : 'failed')
    })
  }

  if (justSent) {
    return (
      <div
        className="bg-ground fixed inset-0 z-40 grid overflow-y-auto px-5 py-12 md:place-items-center md:px-10"
        role="status"
      >
        <div className="mx-auto grid w-full max-w-[1040px] items-center gap-12 md:grid-cols-[minmax(0,380px)_1fr]">
          <div className="sent-card justify-self-center">
            <FounderCard data={{ ...card, finish: 'picked' }} size="lg" tilt glow="always" />
          </div>
          <div className="grid gap-5">
            <h1 className="display rise m-0 text-[clamp(48px,7vw,96px)] leading-none [animation-delay:900ms]">
              {copy.sent.title}
            </h1>
            <p className="text-lead text-ink-2 rise m-0 max-w-[40ch] [animation-delay:960ms]">
              {copy.sent.lead}
            </p>
            <div className="dock">
              <Link href="/today" className="btn btn-primary press min-h-[52px] px-9 text-[16px]">
                {copy.sent.go}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid max-w-[760px] gap-14">
      <div className="grid gap-4">
        <h1 className="display rise m-0 text-[clamp(36px,5vw,60px)] leading-[1.02]">
          <Lines text={copy.title} />
        </h1>
        <p className="text-lead text-ink-2 m-0 max-w-[48ch]">{copy.lead}</p>
      </div>

      <Part
        n={1}
        kicker={copy.secondary.kicker}
        title={copy.secondary.title}
        lead={copy.secondary.lead}
      >
        <ol className="m-0 grid list-none gap-6 p-0">
          {draft.apps.map((app, index) => (
            <li key={index} className="grid gap-2">
              <span className="meta">{copy.secondary.app(index + 1)}</span>
              <label className="sr-only" htmlFor={`app-${index}-name`}>
                {copy.secondary.name}
              </label>
              <input
                id={`app-${index}-name`}
                className="field"
                value={app.name}
                maxLength={60}
                placeholder={copy.secondary.namePlaceholder}
                onChange={(event) =>
                  set({
                    apps: draft.apps.map((item, at) =>
                      at === index ? { ...item, name: event.target.value } : item,
                    ),
                  })
                }
              />
              <label className="text-ink-2 text-[14px]" htmlFor={`app-${index}-note`}>
                {copy.secondary.note}
              </label>
              <textarea
                id={`app-${index}-note`}
                className="field min-h-[88px]"
                value={app.note}
                maxLength={280}
                placeholder={copy.secondary.notePlaceholder}
                onChange={(event) =>
                  set({
                    apps: draft.apps.map((item, at) =>
                      at === index ? { ...item, note: event.target.value } : item,
                    ),
                  })
                }
              />
            </li>
          ))}
        </ol>
        <div className="grid gap-2">
          <span className="text-ink-1 text-[15px] font-medium">{copy.secondary.reading}</span>
          <span className="text-ink-3 text-[13px]">{copy.secondary.readingHint}</span>
          {draft.reading.map((link, index) => (
            <input
              key={index}
              className="field"
              inputMode="url"
              value={link}
              maxLength={400}
              aria-label={copy.secondary.reading}
              placeholder={copy.secondary.readingPlaceholder}
              onChange={(event) =>
                set({
                  reading: draft.reading.map((item, at) =>
                    at === index ? event.target.value : item,
                  ),
                })
              }
            />
          ))}
          {draft.reading.length < 5 ? (
            <button
              type="button"
              className="btn btn-quiet press w-fit px-0"
              onClick={() => set({ reading: [...draft.reading, ''] })}
            >
              {copy.secondary.addReading}
            </button>
          ) : null}
        </div>
      </Part>

      <Part n={2} kicker={copy.primary.kicker} title={copy.primary.title} lead={copy.primary.lead}>
        <ol className="m-0 grid list-none gap-6 p-0">
          {draft.talks.map((talk, index) => {
            const update = (patch: Partial<Talk>) =>
              set({
                talks: draft.talks.map((item, at) => (at === index ? { ...item, ...patch } : item)),
              })
            return (
              <li key={index} className="grid gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="meta">{copy.primary.owner(index + 1)}</span>
                  {draft.talks.length > 1 ? (
                    <button
                      type="button"
                      className="btn btn-quiet press min-h-8 px-2 text-[13px]"
                      onClick={() => set({ talks: draft.talks.filter((_, at) => at !== index) })}
                    >
                      {copy.primary.remove}
                    </button>
                  ) : null}
                </div>
                <label className="text-ink-2 text-[14px]" htmlFor={`talk-${index}-who`}>
                  {copy.primary.who}
                </label>
                <input
                  id={`talk-${index}-who`}
                  className="field"
                  value={talk.who}
                  maxLength={120}
                  placeholder={copy.primary.whoPlaceholder}
                  onChange={(event) => update({ who: event.target.value })}
                />
                <label className="text-ink-2 text-[14px]" htmlFor={`talk-${index}-breaks`}>
                  {copy.primary.breaks}
                </label>
                <textarea
                  id={`talk-${index}-breaks`}
                  className="field min-h-[88px]"
                  value={talk.breaks}
                  maxLength={400}
                  placeholder={copy.primary.breaksPlaceholder}
                  onChange={(event) => update({ breaks: event.target.value })}
                />
                <label className="text-ink-2 text-[14px]" htmlFor={`talk-${index}-said`}>
                  {copy.primary.said}
                </label>
                <input
                  id={`talk-${index}-said`}
                  className="field"
                  value={talk.said}
                  maxLength={280}
                  placeholder={copy.primary.saidPlaceholder}
                  onChange={(event) => update({ said: event.target.value })}
                />
              </li>
            )
          })}
        </ol>
        {draft.talks.length < 5 ? (
          <button
            type="button"
            className="btn btn-quiet press w-fit px-0"
            onClick={() => set({ talks: [...draft.talks, blankTalk()] })}
          >
            {copy.primary.add}
          </button>
        ) : null}
      </Part>

      <Part n={3} kicker={copy.yours.kicker} title={copy.yours.title}>
        <Field id="for-who" label={copy.yours.forWho} hint={copy.yours.forWhoHint}>
          <input
            id="for-who"
            className="field"
            value={draft.forWho}
            maxLength={120}
            placeholder={copy.yours.forWhoPlaceholder}
            onChange={(event) => set({ forWho: event.target.value })}
          />
        </Field>
        <Field id="problem" label={copy.yours.problem}>
          <textarea
            id="problem"
            className="field min-h-[120px]"
            value={draft.problem}
            maxLength={500}
            placeholder={copy.yours.problemPlaceholder}
            onChange={(event) => set({ problem: event.target.value })}
          />
        </Field>
        <Field id="moment" label={copy.yours.moment}>
          <textarea
            id="moment"
            className="field min-h-[88px]"
            value={draft.moment}
            maxLength={300}
            placeholder={copy.yours.momentPlaceholder}
            onChange={(event) => set({ moment: event.target.value })}
          />
        </Field>
      </Part>

      <div className="grid gap-3">
        {!alreadySent && !ready ? <p className="text-ink-3 m-0 text-[14px]">{copy.needs}</p> : null}
        {alreadySent ? <p className="text-ink-3 m-0 text-[14px]">{copy.sentNote}</p> : null}
        <div className="dock md:border-line md:border-t md:pt-6">
          {alreadySent ? (
            <button
              type="button"
              className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
              disabled={pending || !ready}
              onClick={() => save(false)}
            >
              {pending ? copy.saving : copy.update}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary press min-h-[52px] min-w-[180px] text-[16px]"
                disabled={pending || !ready}
                onClick={() => save(true)}
              >
                {pending ? copy.sending : copy.send}
              </button>
              <button
                type="button"
                className="btn btn-secondary press min-h-[52px]"
                disabled={pending}
                onClick={() => save(false)}
              >
                {copy.save}
              </button>
            </>
          )}
          {status === 'failed' || status === 'badLink' ? (
            <p role="alert" className="text-violet-ink m-0 text-[14px]">
              {status === 'badLink' ? copy.badLink : copy.failed}
            </p>
          ) : status === 'saved' ? (
            <p role="status" className="text-ink-2 m-0 text-[14px]">
              {copy.saved}
            </p>
          ) : null}
        </div>
        <Link href="/messages" className="btn btn-quiet press w-fit px-0 text-[14px]">
          {messagesCopy.open}
        </Link>
      </div>
    </div>
  )
}

function Part({
  n,
  kicker,
  title,
  lead,
  children,
}: {
  n: number
  kicker: string
  title: string
  lead?: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-6" aria-labelledby={`part-${n}`}>
      <div className="grid gap-2">
        <span className="flex items-baseline gap-3">
          <span className="text-violet-ink font-mono text-[12px]">
            {String(n).padStart(2, '0')}
          </span>
          <span className="meta">{kicker}</span>
        </span>
        <h2 id={`part-${n}`} className="display m-0 text-[clamp(26px,3vw,34px)] leading-tight">
          {title}
        </h2>
        {lead ? <p className="text-ink-2 m-0 max-w-[52ch] text-[15px]">{lead}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-ink-1 text-[15px] font-medium">
        {label}
      </label>
      {hint ? <span className="text-ink-3 -mt-1 text-[13px]">{hint}</span> : null}
      {children}
    </div>
  )
}
