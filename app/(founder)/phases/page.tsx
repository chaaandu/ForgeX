import type { Metadata } from 'next'
import Link from 'next/link'
import { BuildShell } from '@/components/build/BuildShell'
import { meta, stops as copy } from '@/content/copy'
import { reviewsFor } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { stopLabel } from '@/lib/dates'
import { allSubmissions } from '@/lib/data/submissions'
import { STOP_NUMBERS, STOPS } from '@/lib/plan'
import { phaseOpen, stopState } from '@/lib/stops'

export const metadata: Metadata = { title: meta.pages.stops }

/** The 3 stops, each with where it stands and the team's word once it's in. */
export default async function StopsPage() {
  const { founder, context, now, mentorOf } = await requireBuilding()
  const [submissions, reviews] = await Promise.all([allSubmissions(), reviewsFor(founder)])
  return (
    <BuildShell card={context.card} slug={founder.slug} pod={mentorOf !== null}>
      <div className="grid max-w-[760px] gap-10">
        <div className="grid gap-3">
          <h1 className="page-title m-0">{copy.title}</h1>
          <p className="text-lead text-ink-2 m-0 max-w-[48ch]">{copy.lead}</p>
        </div>
        <ol className="m-0 grid list-none gap-3 p-0">
          {STOP_NUMBERS.map((n) => {
            const history = submissions.filter(
              (item) => item.email === founder.email && item.stop === n,
            )
            const state = stopState(history, STOPS[n].closes, now)
            const word = state.locked
              ? copy.state.locked
              : state.late
                ? copy.state.late
                : state.sent
                  ? copy.state.sent
                  : state.current
                    ? copy.state.draft
                    : copy.state.none
            const review = reviews[n]
            const sentBefore = new Set(
              submissions
                .filter((item) => item.email === founder.email && item.status === 'sent')
                .map((item) => item.stop),
            )
            const open = phaseOpen(n, sentBefore)
            return (
              <li key={n}>
                <Link
                  href={`/phases/${n}`}
                  className="panel press grid gap-2 p-5 no-underline md:grid-cols-[1fr_auto] md:items-center"
                >
                  <span className="grid gap-1">
                    <span className="display text-ink-1 text-[26px] leading-tight">
                      {copy.heading(String(n), copy.names[String(n) as '1'])}
                    </span>
                    <span className="text-ink-3 font-mono text-[12px]">
                      {state.closed
                        ? copy.closed(stopLabel(STOPS[n].closes))
                        : copy.closes(stopLabel(STOPS[n].closes))}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="tag">{open ? word : copy.opensAfter(String(n - 1))}</span>
                    {review?.rating ? (
                      <span className="tag text-violet-ink">
                        {copy.review.ratings[review.rating]}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </BuildShell>
  )
}
