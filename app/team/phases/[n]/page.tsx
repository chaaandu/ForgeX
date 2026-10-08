import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/team/ReviewForm'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy, meta, page, stops as stopsCopy } from '@/content/copy'
import { shortDate, stopLabel } from '@/lib/dates'
import { allFounders } from '@/lib/data/founders'
import { POD_COUNT, seats } from '@/lib/data/pods'
import { allResearch } from '@/lib/data/research'
import { allReviews, latestBy } from '@/lib/data/reviews'
import { allSubmissions } from '@/lib/data/submissions'
import { parseStretch } from '@/lib/inputs'
import { workLabel } from '@/lib/links'
import { planNow, STOP_NUMBERS, STOPS, type StopNumber } from '@/lib/plan'
import { STRETCH } from '@/content/plan'
import { stopFieldsFor } from '@/lib/steps'
import { stopState } from '@/lib/stops'
import { nameOf } from '@/lib/team-name'
import { TRACK_LABELS, TRACKS, trackOf } from '@/lib/tracks'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>
}): Promise<Metadata> {
  return { title: meta.pages.stop((await params).n) }
}

const copy = consoleCopy.stops
const FILTERS = ['all', 'unrated', 'notSent', 'green', 'amber', 'red'] as const
type Filter = (typeof FILTERS)[number]

const stretchLabel = (value: string) => {
  const stretch = parseStretch(value)
  return [
    ...stretch.picked.map((id) => STRETCH.find((item) => item.id === id)?.label ?? id),
    ...(stretch.own ? [stopsCopy.stretchOwn(stretch.own)] : []),
  ].join(' · ')
}

/**
 * One stop, every founder: what they sent, against their own track's fields,
 * and a review form beside it. Filter by track, pod and rating; the reviewer
 * and the time go into Reviews and the events log.
 */
export default async function TeamStopPage({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>
  searchParams: Promise<{ track?: string; pod?: string; rating?: string }>
}) {
  const n = Number((await params).n) as StopNumber
  if (!STOP_NUMBERS.includes(n)) notFound()
  const query = await searchParams
  const filter: Filter = FILTERS.find((item) => item === query.rating) ?? 'all'
  const track = TRACKS.find((item) => item === query.track) ?? null
  const pod = query.pod === 'none' ? 'none' : Number(query.pod) || null
  const now = planNow()
  const [founders, submissions, reviews, seatMap, research] = await Promise.all([
    allFounders(),
    allSubmissions(),
    allReviews(),
    seats(),
    allResearch(),
  ])
  const latest = latestBy(reviews, String(n) as '1')

  const rows = founders.map((founder) => {
    const history = submissions.filter((item) => item.email === founder.email && item.stop === n)
    const state = stopState(history, STOPS[n].closes, now)
    const sent = [...history].reverse().find((item) => item.status === 'sent') ?? null
    return {
      founder,
      track: trackOf(founder.track),
      seat: seatMap.get(founder.email) ?? null,
      state,
      shown: sent ?? state.current,
      review: latest.get(founder.email) ?? null,
    }
  })
  const scoped = rows.filter(
    (row) =>
      (!track || row.track === track) &&
      (pod === null || (pod === 'none' ? !row.seat : row.seat?.pod === pod)),
  )
  const matches = (row: (typeof rows)[number], key: Filter) =>
    key === 'all'
      ? true
      : key === 'notSent'
        ? !row.state.sent
        : key === 'unrated'
          ? row.state.sent && !row.review
          : row.review?.rating === key
  const list = scoped
    .filter((row) => matches(row, filter))
    .sort(
      (a, b) =>
        Number(b.state.sent) - Number(a.state.sent) ||
        (a.shown?.savedAt ?? '').localeCompare(b.shown?.savedAt ?? ''),
    )

  const href = (patch: Partial<{ track: string; pod: string; rating: string }>) => {
    const next = new URLSearchParams()
    const merged = {
      track: track ?? '',
      pod: pod === null ? '' : String(pod),
      rating: filter,
      ...patch,
    }
    for (const [key, value] of Object.entries(merged))
      if (value && value !== 'all') next.set(key, value)
    const qs = next.toString()
    return `/team/phases/${n}${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="display m-0 text-[40px] leading-none">
            {copy.title(String(n), stopsCopy.names[String(n) as '1'])}
          </h1>
          <p className="text-ink-3 m-0 font-mono text-[13px]">
            {copy.closes(stopLabel(STOPS[n].closes))} ·{' '}
            {copy.counts(
              String(scoped.filter((row) => row.state.sent).length),
              String(scoped.length),
            )}
          </p>
        </div>
        <nav className="flex gap-2" aria-label={copy.pick}>
          {STOP_NUMBERS.map((stop) => (
            <Link
              key={stop}
              href={`/team/phases/${stop}`}
              aria-current={stop === n ? 'page' : undefined}
              className="chip press min-h-9 text-[13px] no-underline"
            >
              {meta.pages.stop(String(stop))}
            </Link>
          ))}
        </nav>
      </div>

      <div className="quiet-scroll -mx-5 flex flex-wrap items-center gap-2 px-5 md:mx-0 md:px-0">
        {FILTERS.map((key) => (
          <Link
            key={key}
            href={href({ rating: key })}
            aria-current={filter === key ? 'page' : undefined}
            className="chip press min-h-9 text-[13px] no-underline"
          >
            {copy.filters[key]}{' '}
            <span className="font-mono text-[11px]">
              {scoped.filter((row) => matches(row, key)).length}
            </span>
          </Link>
        ))}
        <span className="bg-line-2 mx-1 h-6 w-px" aria-hidden="true" />
        <Link
          href={href({ track: '' })}
          aria-current={!track ? 'page' : undefined}
          className="chip press min-h-9 text-[13px] no-underline"
        >
          {consoleCopy.founders.allTracks}
        </Link>
        {TRACKS.map((item) => (
          <Link
            key={item}
            href={href({ track: item })}
            aria-current={track === item ? 'page' : undefined}
            className="chip press min-h-9 text-[13px] no-underline"
          >
            {TRACK_LABELS[item]}
          </Link>
        ))}
        <span className="bg-line-2 mx-1 h-6 w-px" aria-hidden="true" />
        <Link
          href={href({ pod: '' })}
          aria-current={pod === null ? 'page' : undefined}
          className="chip press min-h-9 text-[13px] no-underline"
        >
          {consoleCopy.founders.allPods}
        </Link>
        {Array.from({ length: POD_COUNT }, (_, index) => index + 1).map((item) => (
          <Link
            key={item}
            href={href({ pod: String(item) })}
            aria-current={pod === item ? 'page' : undefined}
            className="chip press min-h-9 text-[13px] no-underline"
          >
            {consoleCopy.pods.pod(String(item))}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-ink-3 py-10 text-center">{copy.none}</p>
      ) : (
        <ol className="m-0 grid list-none gap-3 p-0">
          {list.map(({ founder, track: rowTrack, seat, state, shown, review }) => {
            const fields = stopFieldsFor(rowTrack, n)
            const mine = research.get(founder.email)
            return (
              <li key={founder.email}>
                <details className="panel group p-4 md:p-5">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3">
                    <Avatar src={founder.photo} size={40} />
                    <span className="grid min-w-0 flex-1">
                      <span className="text-ink-1 truncate font-semibold">{founder.name}</span>
                      <span className="text-ink-3 truncate text-[13px]">
                        {TRACK_LABELS[rowTrack]}
                        {seat ? ` · ${page.podOf(String(seat.pod))}` : ''}
                        {mine?.forWho ? ` · ${mine.forWho}` : ''}
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-[13px]">
                      {state.late ? <span className="tag text-violet-ink">{copy.late}</span> : null}
                      {state.sent ? (
                        <span className="text-ink-3 font-mono text-[12px]">
                          {copy.sentAt(shortDate(shown?.savedAt ?? ''))}
                        </span>
                      ) : state.current ? (
                        <span className="tag">{copy.draft}</span>
                      ) : (
                        <span className="text-ink-3">{copy.empty}</span>
                      )}
                      {review?.rating ? (
                        <span className="tag">{copy.ratings[review.rating]}</span>
                      ) : null}
                    </span>
                  </summary>
                  <div className="grid gap-6 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
                    <dl className="m-0 grid content-start gap-4">
                      {n === 1 && mine?.sent ? (
                        <div className="grid gap-1">
                          <dt className="meta">{copy.research}</dt>
                          <dd className="m-0 text-[15px]">{mine.problem}</dd>
                        </div>
                      ) : null}
                      {fields.map((field) => {
                        const value = shown?.fields[field.id] ?? ''
                        return (
                          <div key={field.id} className="grid gap-1">
                            <dt className="meta">{field.label}</dt>
                            <dd className="m-0 text-[15px] break-words whitespace-pre-line">
                              {!value ? (
                                consoleCopy.founders.dash
                              ) : field.kind === 'link' ? (
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-ink-1"
                                >
                                  {workLabel(value)}
                                </a>
                              ) : field.kind === 'check' ? (
                                stopsCopy.yes
                              ) : field.kind === 'stretch' ? (
                                stretchLabel(value)
                              ) : (
                                value
                              )}
                            </dd>
                          </div>
                        )
                      })}
                    </dl>
                    <div className="grid content-start gap-3">
                      {review ? (
                        <p className="text-ink-3 m-0 font-mono text-[12px]">
                          {copy.reviewedBy(nameOf(review.author), shortDate(review.at))}
                        </p>
                      ) : null}
                      <ReviewForm
                        email={founder.email}
                        stop={String(n) as '1'}
                        initial={
                          review
                            ? { rating: review.rating, notes: review.notes, fixes: review.fixes }
                            : null
                        }
                      />
                    </div>
                  </div>
                </details>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
