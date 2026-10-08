import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FounderCard } from '@/components/card/FounderCard'
import { Calendar } from '@/components/levels/Calendar'
import { kickoff as copy, meta } from '@/content/copy'
import { founderContext } from '@/lib/context'
import { currentPath, mayEnter } from '@/lib/journey'
import { dayOf, planNow } from '@/lib/plan'
import { requireFounder } from '@/lib/session'

export const metadata: Metadata = { title: meta.pages.start }

/**
 * The moment onboarding ends and the 3 weeks begin: their card, one line to
 * send them out of the door, what they'll do, and the 3 weeks as a calendar.
 * One way on: today.
 */
export default async function StartPage() {
  const { founder } = await requireFounder()
  if (!mayEnter(founder, 'today')) redirect(currentPath(founder))
  const context = await founderContext(founder)
  const today = dayOf(planNow())

  return (
    <main className="mx-auto grid max-w-[1040px] gap-20 px-5 pt-12 pb-36 md:px-10 md:pt-20 md:pb-24">
      <section className="grid items-center gap-12 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
        <div className="w-full max-w-[340px] justify-self-center">
          <FounderCard data={context.card} size="lg" tilt priority glow="always" />
        </div>
        <div className="grid gap-5">
          <h1 className="display rise m-0 text-[clamp(48px,7vw,92px)] leading-[0.95]">
            {copy.title}
          </h1>
          <p className="text-lead text-ink-2 rise m-0 [animation-delay:120ms]">
            {copy.lead.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="dock rise [animation-delay:200ms]">
            <Link href="/today" className="btn btn-primary press min-h-[52px] px-9 text-[16px]">
              {copy.go}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6" aria-labelledby="do">
        <h2 id="do" className="meta m-0">
          {copy.askTitle}
        </h2>
        <ol className="m-0 grid list-none gap-0 p-0">
          {copy.asks.map((line, index) => (
            <li
              key={line}
              className="border-line grid grid-cols-[36px_1fr] items-baseline gap-3 border-t py-4"
            >
              <span className="text-violet-ink font-mono text-[13px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="display text-[clamp(24px,3vw,32px)] leading-tight">{line}</span>
            </li>
          ))}
        </ol>
        <p className="text-ink-1 m-0 max-w-[52ch] text-[17px] leading-relaxed">{copy.depth}</p>
      </section>

      <section className="grid gap-6" aria-labelledby="weeks">
        <h2 id="weeks" className="section-title m-0">
          {copy.calendar.title}
        </h2>
        <Calendar today={today} />
      </section>
    </main>
  )
}
