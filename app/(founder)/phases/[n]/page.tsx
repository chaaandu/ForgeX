import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BuildShell } from '@/components/build/BuildShell'
import { StopForm } from '@/components/build/StopForm'
import { meta, plan as planCopy, stops as copy } from '@/content/copy'
import { reviewsFor, stretchFor } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { shortDate, stopLabel } from '@/lib/dates'
import { historyOf } from '@/lib/data/submissions'
import { STOP_NUMBERS, STOPS, type StopNumber } from '@/lib/plan'
import { stopFieldsFor } from '@/lib/steps'
import { phaseOpen, stopState } from '@/lib/stops'
import { trackOf } from '@/lib/tracks'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>
}): Promise<Metadata> {
  return { title: meta.pages.stop((await params).n) }
}

/**
 * One stop. The fields start from the newest save, or failing that from the
 * links and answers already given in the plan's steps. The team's review
 * sits on top once it's in.
 */
export default async function StopPage({ params }: { params: Promise<{ n: string }> }) {
  const n = Number((await params).n) as StopNumber
  if (!STOP_NUMBERS.includes(n)) notFound()
  const { founder, context, ticks, now, steps, mentorOf, researchSent } = await requireBuilding()
  const [history, reviews, before] = await Promise.all([
    historyOf(founder.email, n),
    reviewsFor(founder),
    n > 1 ? historyOf(founder.email, (n - 1) as 1 | 2) : Promise.resolve([]),
  ])
  const open = phaseOpen(n, new Set(before.some((item) => item.status === 'sent') ? [n - 1] : []))
  const state = stopState(history, STOPS[n].closes, now)
  const fields = stopFieldsFor(trackOf(founder.track), n)
  const initial = Object.fromEntries(
    fields.map((field) => {
      const saved = state.current?.fields[field.id]
      const fromStep = (field.from ?? []).map((id) => ticks[id]?.value ?? '').find(Boolean)
      return [field.id, saved ?? fromStep ?? '']
    }),
  )
  const review = reviews[n]
  const name = copy.names[String(n) as '1']
  const sentAt = [...history].reverse().find((item) => item.status === 'sent')?.savedAt ?? ''

  return (
    <BuildShell card={context.card} slug={founder.slug} pod={mentorOf !== null}>
      <div className="grid max-w-[680px] gap-10">
        <div className="grid gap-3">
          <Link href="/phases" className="meta no-underline">
            {copy.title}
          </Link>
          <h1 className="page-title m-0">{copy.heading(String(n), name)}</h1>
          <p className="text-ink-3 m-0 font-mono text-[13px]">
            {state.closed
              ? copy.closed(stopLabel(STOPS[n].closes))
              : copy.closes(stopLabel(STOPS[n].closes))}
          </p>
          <p className="text-ink-2 m-0 text-[15px]">
            {state.locked
              ? state.late
                ? copy.lateNote(shortDate(sentAt))
                : copy.lockedNote
              : state.sent
                ? copy.sentNote(shortDate(sentAt))
                : state.closed
                  ? copy.closedNote
                  : null}
          </p>
        </div>

        {review?.rating ? (
          <section
            className="grid gap-3 rounded-2xl p-5 shadow-[inset_0_0_0_1px_rgb(124_77_204/0.45)]"
            style={{ background: 'color-mix(in oklab, var(--color-violet) 7%, transparent)' }}
            aria-labelledby="review"
          >
            <h2 id="review" className="meta m-0">
              {copy.review.title}
            </h2>
            <p className="text-violet-ink m-0 text-[20px] font-semibold">
              {copy.review.ratings[review.rating]}
            </p>
            <p className="text-ink-2 m-0 text-[15px]">{copy.review.lines[review.rating]}</p>
            {review.notes ? (
              <p className="m-0 text-[16px] leading-relaxed whitespace-pre-line">{review.notes}</p>
            ) : null}
            {review.fixes.length ? (
              <div className="grid gap-2">
                <span className="meta">{copy.review.fixes}</span>
                <ul className="m-0 grid gap-1 pl-5">
                  {review.fixes.map((fix) => (
                    <li key={fix} className="text-[15px]">
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : state.sent && state.closed ? (
          <p className="text-ink-3 m-0 text-[14px]">{copy.review.waiting}</p>
        ) : null}

        {n === 1 ? (
          <div className="border-line flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y py-4">
            <span className="text-ink-1 text-[16px] font-medium">{copy.researchTitle}</span>
            <span className="text-ink-3 text-[14px]">{copy.researchNote}</span>
          </div>
        ) : null}

        {!researchSent ? (
          <p className="text-ink-1 m-0 text-[15px] font-medium">{planCopy.locked}</p>
        ) : !open ? (
          <p className="text-ink-1 m-0 text-[15px] font-medium">{copy.order(String(n - 1))}</p>
        ) : null}
        <StopForm
          stop={n}
          fields={fields}
          initial={initial}
          stretch={stretchFor(steps)}
          sent={state.sent}
          locked={state.locked || !researchSent || !open}
        />
      </div>
    </BuildShell>
  )
}
