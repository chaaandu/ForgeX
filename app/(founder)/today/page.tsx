import type { Metadata } from 'next'
import Link from 'next/link'
import { BuildShell } from '@/components/build/BuildShell'
import { Countdown } from '@/components/build/Countdown'
import { FixList, StepList } from '@/components/build/StepList'
import { meta, plan as copy, stops as stopsCopy } from '@/content/copy'
import { fixesOf, stretchFor, viewSteps } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { allReviews } from '@/lib/data/reviews'
import { dayLabel, stopLabel } from '@/lib/dates'
import {
  CHECKINS,
  dayNumber,
  LAUNCH,
  PITCH_DAY,
  nextStop,
  sprintDays,
  STOPS,
  WORKSHOP_IDS,
  WORKSHOPS,
} from '@/lib/plan'

export const metadata: Metadata = { title: meta.pages.today }

/**
 * Home, once building. The next stop counting down, the team's fixes, then
 * one list: anything still open from before, marked with when it was due,
 * and today's steps. If today has nothing, the next day with steps shows
 * instead, so the screen is never empty.
 */
export default async function TodayPage() {
  const { founder, context, ticks, now, today, steps, mentorOf, researchSent } =
    await requireBuilding()
  const views = viewSteps(steps, ticks, today, researchSent)
  const reviews = await allReviews()
  // Done ones stay for a while, ticked, so nothing jumps out of the list as it's ticked.
  const fixes = fixesOf(founder.email, reviews, ticks).filter((fix) => !fix.done || fix.recent)
  const open = views.filter((step) => step.day < today && (!step.ticked || step.recent))
  const todays = views.filter((step) => step.day === today)
  const nextDay = views.find((step) => step.day > today)?.day
  // Overdue first, each marked with when it was due, then today's.
  const list = [...open, ...todays]
  const upNext = list.length === 0 && nextDay ? views.filter((step) => step.day === nextDay) : []
  const stop = nextStop(now)
  const workshop = WORKSHOP_IDS.find((id) => WORKSHOPS[id].day === today)
  const n = dayNumber(today)
  const total = sprintDays().length
  const checkinWeek = today >= CHECKINS.from && today <= CHECKINS.to
  const allDoneToday = list.length > 0 && list.every((step) => step.ticked)
  const stretch = stretchFor(steps)

  return (
    <BuildShell card={context.card} slug={founder.slug} pod={mentorOf !== null}>
      <div className="grid max-w-[760px] gap-10">
        <div className="grid gap-4">
          <p className="meta m-0">{today < LAUNCH ? copy.before : dayLabel(today)}</p>
          <h1 className="page-title m-0">{copy.day(String(Math.max(1, n)), String(total))}</h1>
          {stop ? (
            <Link
              href={`/phases/${stop}`}
              className="panel press flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4 no-underline"
            >
              <span className="text-ink-1 text-[16px] font-semibold">
                {copy.nextStop(String(stop))}
              </span>
              <span className="text-violet-ink text-[16px] font-semibold">
                <Countdown closes={STOPS[stop].closes} now={now.toISOString()} />
              </span>
              <span className="text-ink-3 basis-full font-mono text-[12px]">
                {stopsCopy.heading(String(stop), stopsCopy.names[String(stop) as '1'])} ·{' '}
                {stopLabel(STOPS[stop].closes)}
              </span>
            </Link>
          ) : (
            <p className="text-ink-2 m-0">{copy.allStopsDone}</p>
          )}
          {today === PITCH_DAY ? (
            <p className="text-violet-ink m-0 text-[15px] font-medium">{copy.pitchToday}</p>
          ) : null}
          {workshop ? (
            <p className="text-violet-ink m-0 text-[15px] font-medium">
              {copy.workshopToday(copy.workshops[workshop])}
            </p>
          ) : null}
          {checkinWeek ? <p className="text-ink-1 m-0 text-[15px]">{copy.checkins}</p> : null}
        </div>

        {fixes.length ? (
          <section className="grid gap-2" aria-labelledby="fixes">
            <h2 id="fixes" className="meta text-violet-ink m-0">
              {copy.fixes}
            </h2>
            <FixList fixes={fixes} label={copy.fixes} />
          </section>
        ) : null}

        {researchSent ? null : (
          <Link
            href="/research"
            className="panel press text-ink-1 flex items-center justify-between gap-3 px-5 py-4 text-[15px] no-underline"
          >
            {copy.lockedNote}
            <span className="text-violet-ink font-medium">{copy.openResearch}</span>
          </Link>
        )}

        <section className="grid gap-2" aria-labelledby="today">
          <h2 id="today" className="meta m-0">
            {list.length || !nextDay ? copy.today : `${copy.upNext} · ${dayLabel(nextDay)}`}
          </h2>
          {list.length ? (
            <StepList steps={list} stretch={stretch} label={copy.today} />
          ) : upNext.length ? (
            <StepList steps={upNext} stretch={stretch} label={copy.upNext} />
          ) : (
            <p className="text-ink-2 m-0 text-[15px]">{copy.over}</p>
          )}
          {allDoneToday ? <p className="text-ink-2 m-0 pt-2 text-[15px]">{copy.allDone}</p> : null}
        </section>

        <p className="border-line text-ink-3 m-0 border-t pt-6 text-[14px]">{copy.commit}</p>
      </div>
    </BuildShell>
  )
}
