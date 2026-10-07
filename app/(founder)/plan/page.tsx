import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { BuildShell } from '@/components/build/BuildShell'
import { StepList, type StepView } from '@/components/build/StepList'
import { meta, plan as copy } from '@/content/copy'
import { progressOf, stretchFor, viewSteps } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { dayLabel, shortDate } from '@/lib/dates'
import { RESEARCH_DAYS, STOPS, WORKSHOP_IDS, WORKSHOPS } from '@/lib/plan'
import { TOOLS } from '@/lib/steps'

export const metadata: Metadata = { title: meta.pages.plan }

const PHASES = [
  { key: 'week1', until: STOPS[1].day },
  { key: 'week2', until: STOPS[2].day },
  { key: 'week3', until: STOPS[3].day },
  { key: 'after', until: '9999-12-31' },
] as const

/**
 * The whole sprint, day by day, for this founder's plan only. Every step is
 * open from the start, so anyone ahead can keep going; workshops are marked,
 * and pass to done on their own.
 */
export default async function PlanPage() {
  const { founder, context, ticks, today, steps, mentorOf } = await requireBuilding()
  const views = viewSteps(steps, ticks, today)
  const progress = progressOf(steps, ticks, today)
  const stretch = stretchFor(steps)

  let from = ''
  const phases = PHASES.map((phase) => {
    const inPhase = views.filter((step) => step.day > from && step.day <= phase.until)
    from = phase.until
    const days = [...new Set(inPhase.map((step) => step.day))]
    return {
      key: phase.key,
      days: days.map((day) => ({
        day,
        steps: inPhase.filter((step) => step.day === day),
        workshop: WORKSHOP_IDS.find((id) => WORKSHOPS[id].day === day) ?? null,
      })),
    }
  })

  return (
    <BuildShell card={context.card} slug={founder.slug} pod={mentorOf !== null}>
      <div className="grid max-w-[760px] gap-12">
        <div className="grid gap-3">
          <h1 className="display m-0 text-[clamp(40px,5vw,60px)] leading-none">{copy.title}</h1>
          <p className="text-lead text-ink-2 m-0">{copy.lead}</p>
          <p className="text-violet-ink m-0 font-mono text-[13px]">
            {copy.progress(String(progress.done), String(progress.total))}
          </p>
        </div>

        <section className="grid gap-3" aria-labelledby="research">
          <h2 id="research" className="display m-0 text-[28px] leading-none">
            {copy.phases.research}
          </h2>
          <p className="text-ink-3 m-0 font-mono text-[12px]">
            {RESEARCH_DAYS.map(dayLabel).join(' · ')}
          </p>
          <div className="border-line flex flex-wrap items-center gap-3 border-t pt-3">
            <span className="bg-violet text-on-violet grid size-7 place-items-center rounded-full">
              <Check size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="text-ink-1 text-[16px] font-medium">{copy.researchStep}</span>
            <span className="text-ink-3 text-[13px]">
              {copy.researchSent} · {shortDate(context.research?.at ?? '')}
            </span>
            <Link href="/research" className="btn btn-quiet press ml-auto min-h-9 px-2 text-[14px]">
              {copy.researchEdit}
            </Link>
          </div>
        </section>

        {phases.map((phase) => (
          <section key={phase.key} className="grid gap-6" aria-labelledby={`phase-${phase.key}`}>
            <h2 id={`phase-${phase.key}`} className="display m-0 text-[28px] leading-none">
              {copy.phases[phase.key]}
            </h2>
            {phase.days.map(({ day, steps: daySteps, workshop }) => (
              <Day
                key={day}
                day={day}
                today={day === today}
                workshop={workshop ? copy.workshopOn(copy.workshops[workshop]) : null}
                steps={daySteps}
                stretch={stretch}
              />
            ))}
          </section>
        ))}

        <section className="grid gap-4" aria-labelledby="workshops">
          <h2 id="workshops" className="meta m-0">
            {copy.workshopsTitle}
          </h2>
          <ul className="m-0 grid list-none gap-2 p-0">
            {WORKSHOP_IDS.map((id) => {
              const done = WORKSHOPS[id].day < today
              return (
                <li key={id} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-ink-3 w-[96px] font-mono text-[13px]">
                    {dayLabel(WORKSHOPS[id].day)}
                  </span>
                  <span className={done ? 'text-ink-3' : 'text-ink-1'}>{copy.workshops[id]}</span>
                  {done ? <span className="meta">{copy.workshopDone}</span> : null}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="grid gap-4" aria-labelledby="tools">
          <h2 id="tools" className="meta m-0">
            {copy.tools.title}
          </h2>
          <dl className="m-0 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <div key={tool} className="grid gap-0.5">
                <dt className="text-ink-1 text-[15px] font-medium">{copy.tools.names[tool]}</dt>
                <dd className="text-ink-2 m-0 text-[14px]">{copy.tools.lines[tool]}</dd>
              </div>
            ))}
          </dl>
          <p className="text-ink-3 m-0 text-[14px]">{copy.helpRule}</p>
        </section>
      </div>
    </BuildShell>
  )
}

function Day({
  day,
  today,
  workshop,
  steps,
  stretch,
}: {
  day: string
  today: boolean
  workshop: string | null
  steps: StepView[]
  stretch: { id: string; label: string }[]
}) {
  return (
    <div className="grid gap-1" id={`day-${day}`}>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 className={`m-0 font-mono text-[13px] ${today ? 'text-violet-ink' : 'text-ink-3'}`}>
          {dayLabel(day)}
        </h3>
        {workshop ? <span className="text-violet-ink text-[13px]">{workshop}</span> : null}
      </div>
      <StepList steps={steps} stretch={stretch} label={dayLabel(day)} />
    </div>
  )
}
