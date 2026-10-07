import type { Metadata } from 'next'
import Link from 'next/link'
import { ReplyBox } from '@/components/team/ReplyBox'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy, meta, page } from '@/content/copy'
import { ago, shortDate } from '@/lib/dates'
import { allFounders } from '@/lib/data/founders'
import { allMessages, threads, waitingOnTeam } from '@/lib/data/messages'
import { seats } from '@/lib/data/pods'
import { stepById } from '@/lib/steps'
import { nameOf } from '@/lib/team-name'
import { TRACK_LABELS, trackOf } from '@/lib/tracks'

export const metadata: Metadata = { title: meta.pages.messages }

const copy = consoleCopy.messages

/**
 * Every founder's thread with the team. Waiting on us first, oldest first,
 * so nobody waits longest; answered threads newest first. `?f=<slug>` opens
 * one founder's thread on its own.
 */
export default async function TeamMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; f?: string }>
}) {
  const params = await searchParams
  const view = params.view === 'answered' ? 'answered' : 'waiting'
  const [messages, founders, seatMap] = await Promise.all([allMessages(), allFounders(), seats()])
  const byEmail = new Map(founders.map((founder) => [founder.email, founder]))
  const all = [...threads(messages).entries()].flatMap(([email, thread]) => {
    const founder = byEmail.get(email)
    return founder ? [{ founder, thread, waiting: waitingOnTeam(thread) }] : []
  })
  const one = params.f ? all.filter((item) => item.founder.slug === params.f) : null
  const list = (
    one ??
    all
      .filter((item) => (view === 'waiting' ? item.waiting : !item.waiting))
      .sort((a, b) =>
        view === 'waiting'
          ? (a.thread.at(-1)?.at ?? '').localeCompare(b.thread.at(-1)?.at ?? '')
          : (b.thread.at(-1)?.at ?? '').localeCompare(a.thread.at(-1)?.at ?? ''),
      )
  ).map((item) => ({ ...item, seat: seatMap.get(item.founder.email) }))
  const counts = {
    waiting: all.filter((item) => item.waiting).length,
    answered: all.filter((item) => !item.waiting).length,
  }

  return (
    <div className="grid gap-6">
      <h1 className="display m-0 text-[40px] leading-none">{copy.title}</h1>
      <nav className="flex flex-wrap gap-2" aria-label={copy.views.label}>
        {(['waiting', 'answered'] as const).map((key) => (
          <Link
            key={key}
            href={key === 'waiting' ? '/team/messages' : '/team/messages?view=answered'}
            aria-current={!one && view === key ? 'page' : undefined}
            className="chip press min-h-9 text-[13px] no-underline"
          >
            {copy.views[key]} <span className="font-mono text-[11px]">{counts[key]}</span>
          </Link>
        ))}
      </nav>
      {list.length === 0 ? (
        <p className="text-ink-3 py-10 text-center">{copy.empty[view]}</p>
      ) : (
        <ol className="m-0 grid list-none gap-6 p-0">
          {list.map(({ founder, thread, waiting, seat }) => (
            <li key={founder.email} className="panel grid gap-5 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Avatar src={founder.photo} size={40} />
                <div className="grid min-w-0">
                  <Link
                    href={`/f/${founder.slug}`}
                    className="text-ink-1 font-semibold no-underline"
                  >
                    {founder.name}
                  </Link>
                  <span className="text-ink-3 text-[13px]">
                    {TRACK_LABELS[trackOf(founder.track)]}
                    {seat ? ` · ${page.podOf(String(seat.pod))}` : ''}
                  </span>
                </div>
                {waiting ? (
                  <span className="text-violet-ink ml-auto font-mono text-[12px]">
                    {copy.waitingFor(ago(thread.at(-1)?.at ?? ''))}
                  </span>
                ) : null}
              </div>
              <ol className="m-0 grid list-none gap-3 p-0">
                {thread.map((line) => {
                  const mine = line.from === founder.email
                  const step = line.stepId ? stepById(line.stepId) : undefined
                  return (
                    <li
                      key={line.id}
                      className={`grid gap-1 rounded-xl px-4 py-3 ${mine ? 'bg-white/[0.04]' : 'shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]'}`}
                    >
                      <span className="text-ink-3 font-mono text-[12px]">
                        {mine ? founder.first : nameOf(line.from)} · {shortDate(line.at)}
                      </span>
                      {step ? <span className="meta">{copy.about(step.title)}</span> : null}
                      <p className="m-0 text-[15px] whitespace-pre-line">{line.text}</p>
                      {line.screenshot ? (
                        <a
                          href={line.screenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-ink w-fit text-[14px]"
                        >
                          {copy.screenshot}
                        </a>
                      ) : null}
                    </li>
                  )
                })}
              </ol>
              <ReplyBox founder={founder.email} name={founder.name} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
