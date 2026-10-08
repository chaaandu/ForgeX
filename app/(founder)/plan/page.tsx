import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { BuildShell } from '@/components/build/BuildShell'
import { StepList, type StepView } from '@/components/build/StepList'
import { meta, plan as copy } from '@/content/copy'
import { progressOf, stretchFor, viewSteps } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { dayLabel } from '@/lib/dates'
import { PITCH_DAY, RESEARCH_DAYS, STOPS, WORKSHOP_IDS, WORKSHOPS } from '@/lib/plan'

export const metadata: Metadata = { title: meta.pages.plan }

const PHASES = [
  { key: 'research', until: RESEARCH_DAYS[1] },
  { key: 'week1', until: STOPS[1].day },
  { key: 'week2', until: STOPS[2].day },
  { key: 'week3', until: STOPS[3].day },
  { key: 'after', until: '9999-12-31' },
] as const

/**
 * The whole sprint, day by day, for this founder's plan only, a week at a
 * time. The current week is open; the others fold away but are never locked,
 * so anyone ahead can keep going. Workshops are marked on their day.
 */
export default async function PlanPage() {
  const { founder, context, ticks, today, steps, mentorOf, researchSent } = await requireBuilding()
  const views = viewSteps(steps, ticks, today, researchSent)
  const progress = progressOf(steps, ticks, today)
  const stretch = stretchFor(steps)

  // The first week not yet behind them opens; the rest stay folded.
  const opened = new Set<string>()
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
          <h1 className="page-title m-0">{copy.title}</h1>
          <p className="text-lead text-ink-2 m-0">{copy.lead}</p>
          <p className="text-violet-ink m-0 font-mono text-[13px]">
            {copy.progress(String(progress.done), String(progress.total))}
          </p>
        </div>

        {phases.map((phase) => {
          const all = phase.days.flatMap((day) => day.steps)
          const done = all.filter((step) => step.ticked).length
          const current = phase.days.some((day) => day.day >= today) && !opened.has('done')
          if (current) opened.add('done')
          return (
            <details
              key={phase.key}
              open={current}
              className="group border-line border-t pt-6"
              aria-labelledby={`phase-${phase.key}`}
            >
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4">
                <h2 id={`phase-${phase.key}`} className="section-title m-0">
                  {copy.phases[phase.key]}
                </h2>
                <span className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[13px] ${done === all.length ? 'text-violet-ink' : 'text-ink-3'}`}
                  >
                    {copy.progress(String(done), String(all.length))}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-ink-3 transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>
              <div className="grid gap-6 pt-6">
                {phase.days.map(({ day, steps: daySteps, workshop }) => (
                  <Day
                    key={day}
                    day={day}
                    today={day === today}
                    workshop={
                      day === PITCH_DAY
                        ? copy.pitchOn
                        : workshop
                          ? copy.workshopOn(copy.workshops[workshop])
                          : null
                    }
                    steps={daySteps}
                    stretch={stretch}
                  />
                ))}
              </div>
            </details>
          )
        })}
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
