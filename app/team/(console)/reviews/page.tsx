import type { Metadata } from 'next'
import Link from 'next/link'
import { ReviewItem, type ReviewEntry } from '@/components/team/ReviewItem'
import { consoleCopy, meta } from '@/content/copy'
import { allFounders } from '@/lib/data/founders'
import { allEntries } from '@/lib/data/hackathon'
import { requireTeam } from '@/lib/session'
import { mayDecide, staffOf } from '@/lib/staff'

export const metadata: Metadata = { title: meta.pages.reviews }

const copy = consoleCopy.reviews

/**
 * The review queue. Waiting runs oldest first, so nobody sits unanswered;
 * Answered runs newest first. A reviewer starts on their own students and can
 * look at everyone; the super admin and the rest of the team start on everyone.
 */
export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; scope?: string }>
}) {
  const viewer = await requireTeam()
  const staff = staffOf(viewer.email)
  const params = await searchParams
  const view = params.view === 'answered' ? 'answered' : 'waiting'
  const mine = staff.reviewer !== null && params.scope !== 'all'
  const [entries, founders] = await Promise.all([allEntries(), allFounders()])
  const people = new Map(founders.map((founder) => [founder.email, founder]))

  const inScope = entries.filter(
    (entry) =>
      entry.latest &&
      entry.state !== 'bank' &&
      (!mine || entry.reviewer.toLowerCase() === staff.reviewer?.toLowerCase()),
  )
  const waiting = inScope
    .filter((entry) => entry.state === 'waiting')
    .sort((a, b) => (a.latest?.time ?? '').localeCompare(b.latest?.time ?? ''))
  const answered = inScope
    .filter((entry) => entry.answer)
    .sort((a, b) => (b.answer?.time ?? '').localeCompare(a.answer?.time ?? ''))
  const list = view === 'waiting' ? waiting : answered

  const items: ReviewEntry[] = list.flatMap((entry) => {
    const founder = people.get(entry.email)
    if (!founder || !entry.latest) return []
    return [
      {
        slug: founder.slug,
        name: founder.name,
        photo: founder.photo,
        reviewer: entry.reviewer,
        latest: entry.latest,
        versions: entry.versions,
        reviews: entry.reviews,
        answer: entry.answer,
        canDecide: mayDecide(staff, entry.reviewer),
      },
    ]
  })

  const href = (next: { view?: string; scope?: string }) => {
    const query = new URLSearchParams()
    const v = next.view ?? view
    const s = next.scope ?? (mine ? 'mine' : 'all')
    if (v === 'answered') query.set('view', 'answered')
    if (s === 'all' && staff.reviewer) query.set('scope', 'all')
    const text = query.toString()
    return text ? `/team/reviews?${text}` : '/team/reviews'
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="display m-0 text-[40px] leading-none">{copy.title}</h1>
        <p className="text-ink-2 m-0">{view === 'waiting' ? copy.lead : copy.leadAnswered}</p>
      </div>
      <div className="tabs items-end justify-between">
        <nav className="flex gap-7" aria-label={copy.views.label}>
          {(['waiting', 'answered'] as const).map((key) => (
            <Link
              key={key}
              href={href({ view: key })}
              aria-current={view === key ? 'page' : undefined}
              className="tab"
            >
              {copy.views[key]}
              <span className="tab-count">
                {key === 'waiting' ? waiting.length : answered.length}
              </span>
            </Link>
          ))}
        </nav>
        {staff.reviewer ? (
          <div className="flex items-center gap-3 pb-2">
            <span className="meta text-[11px]">{copy.scope.label}</span>
            <nav className="segmented" aria-label={copy.scope.label}>
              {(['mine', 'all'] as const).map((key) => (
                <Link
                  key={key}
                  href={href({ scope: key })}
                  aria-current={(key === 'mine') === mine ? 'page' : undefined}
                  className="segment"
                >
                  {copy.scope[key]}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
      {items.length ? (
        <div className="grid gap-5">
          {items.map((item) => (
            <ReviewItem
              key={`${item.slug}-${item.latest.version}`}
              item={item}
              readOnlyNote={
                staff.admin || staff.reviewer ? copy.notYours(item.reviewer) : copy.readOnly
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-ink-3 py-16 text-center">
          {view === 'waiting' ? copy.empty : copy.emptyAnswered}
        </p>
      )}
    </div>
  )
}
