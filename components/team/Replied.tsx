import Image from 'next/image'
import Link from 'next/link'
import { consoleCopy, page as pageCopy } from '@/content/copy'
import type { ResponseType } from '@/lib/data/picks'
import { RESPONSE_TYPES } from '@/lib/data/picks'
import { shortDate } from '@/lib/dates'
import { nameOf } from '@/lib/team-name'

const copy = consoleCopy.queue

export type RepliedItem = {
  pickId: string
  name: string
  slug: string
  photo: string
  archetype: string
  title: string
  own: boolean
  type: ResponseType
  note: string
  author: string
  sentAt: string
}

const TONE: Record<ResponseType, string> = {
  go: 'var(--color-ok)',
  tweak: 'var(--color-legendary)',
  talk: 'var(--color-violet-ink)',
  another: 'var(--color-ink-3)',
}

/** Every pick we have answered, newest first, filterable by the answer. */
export function Replied({ items, filter }: { items: RepliedItem[]; filter: ResponseType | null }) {
  const shown = filter ? items.filter((item) => item.type === filter) : items
  return (
    <div className="grid gap-5">
      <nav className="flex flex-wrap gap-2" aria-label={copy.byAnswer}>
        {([null, ...RESPONSE_TYPES] as const).map((type) => (
          <Link
            key={type ?? 'all'}
            href={type ? `/team/queue?view=replied&type=${type}` : '/team/queue?view=replied'}
            className="chip press min-h-8 text-[12px] no-underline"
            aria-current={filter === type ? 'page' : undefined}
          >
            {type ? pageCopy.status[type] : copy.allAnswers}{' '}
            <span className="font-mono text-[11px]">
              {type ? items.filter((item) => item.type === type).length : items.length}
            </span>
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <ul className="m-0 grid list-none gap-2 p-0">
          {shown.map((item) => (
            <li
              key={item.pickId}
              className="panel grid gap-3 p-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto] md:items-center md:gap-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={item.photo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-xl object-cover"
                />
                <span className="grid min-w-0">
                  <span className="text-ink-1 truncate text-[15px]">{item.name}</span>
                  <span className="text-ink-3 truncate text-[12px]">{item.archetype}</span>
                </span>
              </div>
              <div className="grid min-w-0 gap-1">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: TONE[item.type] }}
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full"
                      style={{ background: TONE[item.type] }}
                    />
                    {pageCopy.status[item.type]}
                  </span>
                  <span className="text-ink-1 min-w-0 text-[15px]">
                    {item.title}
                    {item.own ? <span className="text-ink-3"> · {copy.theirOwn}</span> : null}
                  </span>
                </span>
                {item.note ? (
                  <p className="text-ink-2 clamp-3 m-0 text-[14px]">{item.note}</p>
                ) : null}
                <span className="text-ink-3 font-mono text-[12px]">
                  {copy.repliedBy(item.author ? nameOf(item.author) : '—', shortDate(item.sentAt))}
                </span>
              </div>
              <Link
                href={`/f/${item.slug}`}
                className="btn btn-secondary press min-h-10 px-4 text-[13px]"
              >
                {copy.open}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-3 py-16 text-center">{copy.noneReplied}</p>
      )}
    </div>
  )
}
