import { kickoff } from '@/content/copy'
import { dayLabel } from '@/lib/dates'
import { dayOf, PLAN_EVENTS, RESEARCH_DAYS, STOPS, type PlanEvent } from '@/lib/plan'

const copy = kickoff.calendar

type Cell = {
  day: string
  date: number
  phase: 'off' | 'research' | 'build' | 'checkin' | 'venture'
  stop: string | null
  pitch: boolean
  workshop: PlanEvent['id'] | null
  short: string | null
}

/** Mondays from the week of launch to the week venture building starts. */
function weeks(): Cell[][] {
  const first = new Date(`${RESEARCH_DAYS[0]}T12:00:00+05:30`)
  first.setUTCDate(first.getUTCDate() - ((first.getUTCDay() + 6) % 7))
  const last = PLAN_EVENTS.at(-1)!.to
  const rows: Cell[][] = []
  const at = new Date(first)
  while (dayOf(at) <= last) {
    const row: Cell[] = []
    for (let index = 0; index < 7; index += 1) {
      const day = dayOf(at)
      const on = PLAN_EVENTS.filter((event) => day >= event.from && day <= event.to)
      const stop = on.find((event) => event.kind === 'stop')
      const workshop = on.find((event) => event.kind === 'workshop')
      const pitch = on.some((event) => event.kind === 'pitch')
      const phase = on.some((event) => event.kind === 'research')
        ? 'research'
        : on.some((event) => event.kind === 'checkin')
          ? 'checkin'
          : on.some((event) => event.kind === 'venture')
            ? 'venture'
            : day > RESEARCH_DAYS[1] && day <= STOPS[3].day
              ? 'build'
              : 'off'
      const short = stop
        ? copy.short.stop(stop.id.slice(-1))
        : pitch
          ? copy.short.pitch
          : workshop
            ? copy.short[workshop.id as 'figma' | 'cursor' | 'cloud' | 'vercel']
            : phase === 'research' && day === RESEARCH_DAYS[0]
              ? copy.short.research
              : phase === 'checkin' && on[0]?.from === day
                ? copy.short.checkin
                : phase === 'venture'
                  ? copy.short.venture
                  : null
      row.push({
        day,
        date: Number(day.slice(8)),
        phase,
        stop: stop ? stop.id.slice(-1) : null,
        pitch,
        workshop: workshop?.id ?? null,
        short,
      })
      at.setUTCDate(at.getUTCDate() + 1)
    }
    rows.push(row)
  }
  return rows
}

const PHASE: Record<Cell['phase'], string> = {
  off: 'text-ink-3/60',
  research: 'bg-[color-mix(in_oklab,var(--color-violet)_24%,transparent)] text-ink-1',
  build: 'bg-white/[0.045] text-ink-1',
  checkin: 'text-ink-1 shadow-[inset_0_0_0_1px_var(--color-line-2)]',
  venture: 'text-violet-ink shadow-[inset_0_0_0_1px_var(--color-violet-ink)]',
}

function when(event: PlanEvent): string {
  if (event.kind === 'stop') return copy.at6(dayLabel(event.from))
  if (event.from === event.to) return dayLabel(event.from)
  return copy.range(dayLabel(event.from), dayLabel(event.to))
}

/**
 * The sprint as a month: research shaded violet, the build weeks grey, each
 * hard stop a filled violet date, each workshop a dot. Under it, every date
 * that matters, in order. All of it from lib/plan.ts, so a moved date moves
 * here too.
 */
export function Calendar({ today }: { today: string }) {
  const rows = weeks()
  return (
    <div className="grid gap-10">
      <div className="grid content-start gap-3">
        <p className="meta m-0">{copy.month}</p>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="table" aria-label={copy.month}>
          <div role="row" className="contents">
            {copy.weekdays.map((name) => (
              <span
                key={name}
                role="columnheader"
                className="text-ink-3 pb-1 text-center font-mono text-[11px]"
              >
                {name}
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <div role="row" className="contents" key={row[0]?.day}>
              {row.map((cell) => (
                <div
                  role="cell"
                  key={cell.day}
                  aria-label={[dayLabel(cell.day), cell.short].filter(Boolean).join(', ')}
                  className={`relative grid min-h-[48px] content-between rounded-lg p-1.5 sm:min-h-[76px] sm:p-2 ${PHASE[cell.phase]} ${cell.day === today ? 'outline-ink-1 outline-2 -outline-offset-2 outline-solid' : ''}`}
                >
                  <span className="flex items-start justify-between gap-1">
                    <span
                      className={`grid size-6 place-items-center rounded-full font-mono text-[12px] ${cell.stop ? 'bg-violet text-on-violet font-semibold' : cell.pitch ? 'text-violet-ink font-semibold shadow-[inset_0_0_0_1.5px_var(--color-violet)]' : ''}`}
                    >
                      {cell.date}
                    </span>
                    {cell.workshop ? (
                      <span className="bg-ink-1 mt-1.5 size-1.5 rounded-full" aria-hidden="true" />
                    ) : null}
                  </span>
                  {cell.short ? (
                    <span
                      className={`hidden truncate text-[11px] leading-tight font-medium sm:block ${cell.stop || cell.pitch ? 'text-violet-ink' : ''}`}
                    >
                      {cell.short}
                    </span>
                  ) : null}
                  {cell.day === today ? <span className="sr-only">{copy.today}</span> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <ul className="text-ink-2 m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 pt-1 text-[12px]">
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-[3px] bg-[color-mix(in_oklab,var(--color-violet)_24%,transparent)]" />
            {copy.legend.research}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-[3px] bg-white/[0.09]" />
            {copy.legend.build}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="bg-violet inline-block size-3 rounded-full" />
            {copy.legend.stop}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full shadow-[inset_0_0_0_1.5px_var(--color-violet)]" />
            {copy.legend.pitch}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="bg-ink-1 inline-block size-1.5 rounded-full" />
            {copy.legend.workshop}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-[3px] shadow-[inset_0_0_0_1px_var(--color-line-2)]" />
            {copy.legend.checkin}
          </li>
        </ul>
      </div>

      <ol className="m-0 grid list-none content-start gap-x-10 gap-y-0 p-0 md:grid-cols-2">
        {PLAN_EVENTS.map((event) => {
          const past = event.to < today
          const words = copy.agenda[event.id]
          return (
            <li
              key={event.id}
              className={`border-line grid grid-cols-[14px_1fr] gap-x-3 border-t py-3 ${past ? 'opacity-50' : ''}`}
            >
              <span
                className={`mt-1.5 inline-block size-2.5 rounded-full ${event.kind === 'stop' ? 'bg-violet' : event.kind === 'workshop' ? 'bg-ink-1 ml-0.5 size-1.5' : 'shadow-[inset_0_0_0_1.5px_var(--color-ink-3)]'}`}
                aria-hidden="true"
              />
              <span className="grid gap-0.5">
                <span className="text-ink-3 font-mono text-[12px]">{when(event)}</span>
                <span
                  className={`text-[15px] font-medium ${event.kind === 'stop' || event.kind === 'pitch' ? 'text-violet-ink' : 'text-ink-1'}`}
                >
                  {words.title}
                </span>
                <span className="text-ink-2 text-[14px]">{words.what}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
