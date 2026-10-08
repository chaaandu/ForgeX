'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { page } from '@/content/copy'
import type { DayCell } from '@/lib/build'

const copy = page.grid

/** Four steps of violet, as GitHub has four of green: none, some, most, all. */
const LEVELS = [
  'rgb(255 255 255 / 0.07)',
  'color-mix(in oklab, var(--color-violet) 32%, var(--color-s2))',
  'color-mix(in oklab, var(--color-violet) 62%, var(--color-s2))',
  'var(--color-violet)',
]

function level(cell: DayCell): number {
  const total = cell.steps.length
  const done = cell.steps.filter((step) => step.done).length
  if (!total || !done) return 0
  if (done === total) return 3
  return done / total >= 0.5 ? 2 : 1
}

function describe(cell: DayCell): string {
  const total = cell.steps.length
  const done = cell.steps.filter((step) => step.done).length
  if (!total) return copy.rest(cell.label)
  if (cell.future && !done) return copy.planned(cell.label, String(total))
  return copy.day(cell.label, String(done), String(total))
}

/**
 * The month at a glance, the way GitHub shows a year: a square per day, full
 * violet when every step that day is done, lighter when some are, grey when
 * none are. Point at a day, or tap it, to see its steps.
 */
export function ProgressGrid({ weeks, today }: { weeks: DayCell[][]; today: string }) {
  const days = weeks.flat()
  const fallback =
    days.find((cell) => cell.day === today && cell.inMonth) ??
    [...days].reverse().find((cell) => cell.inMonth && !cell.future && cell.steps.length) ??
    days.find((cell) => cell.inMonth)
  const [active, setActive] = useState<DayCell | undefined>(fallback)
  const shown = active ?? fallback
  const done = shown ? shown.steps.filter((step) => step.done).length : 0

  return (
    <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
      <div className="grid w-fit gap-3">
        <div
          className="grid grid-cols-[auto_repeat(var(--weeks),auto)] gap-1"
          style={{ ['--weeks' as string]: weeks.length }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((row) => (
            <Row
              key={row}
              row={row}
              weeks={weeks}
              today={today}
              active={shown}
              onPick={setActive}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-1 text-[11px]">
          <span className="text-ink-3 mr-1">{copy.less}</span>
          {LEVELS.map((background) => (
            <span
              key={background}
              className="inline-block size-2.5 rounded-[3px]"
              style={{ background }}
              aria-hidden="true"
            />
          ))}
          <span className="text-ink-3 ml-1">{copy.more}</span>
        </div>
      </div>

      {shown ? (
        <div className="grid content-start gap-3" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-ink-1 text-[14px] font-semibold">{shown.label}</span>
            {shown.steps.length ? (
              <span className="text-ink-3 font-mono text-[12px]">
                {shown.future && !done
                  ? copy.plannedOf(String(shown.steps.length))
                  : copy.doneOf(String(done), String(shown.steps.length))}
              </span>
            ) : null}
          </div>
          {shown.steps.length ? (
            <ul className="m-0 grid list-none gap-2 p-0">
              {shown.steps.map((step) => (
                <li key={step.title} className="flex items-start gap-2.5 text-[14px]">
                  <span
                    className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${step.done ? 'bg-violet text-on-violet' : 'shadow-[inset_0_0_0_1.5px_var(--color-line-2)]'}`}
                    aria-hidden="true"
                  >
                    {step.done ? <Check size={12} strokeWidth={2} /> : null}
                  </span>
                  <span className={step.done ? 'text-ink-1' : 'text-ink-3'}>{step.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-3 m-0 text-[14px]">{copy.none}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

function Row({
  row,
  weeks,
  today,
  active,
  onPick,
}: {
  row: number
  weeks: DayCell[][]
  today: string
  active: DayCell | undefined
  onPick: (cell: DayCell) => void
}) {
  const name =
    row === 0 ? copy.days.mon : row === 2 ? copy.days.wed : row === 4 ? copy.days.fri : ''
  return (
    <>
      <span className="text-ink-3 self-center pr-1.5 font-mono text-[10px] leading-none">
        {name}
      </span>
      {weeks.map((week) => {
        const cell = week[row]
        if (!cell || !cell.inMonth) return <span key={cell?.day ?? row} aria-hidden="true" />
        const future = cell.future && !cell.steps.some((step) => step.done)
        return (
          <button
            key={cell.day}
            type="button"
            aria-label={describe(cell)}
            aria-pressed={active?.day === cell.day}
            onMouseEnter={() => onPick(cell)}
            onFocus={() => onPick(cell)}
            onClick={() => onPick(cell)}
            className="size-[18px] cursor-pointer rounded-[4px] border-0 p-0 transition-[box-shadow] duration-150 sm:size-5"
            style={{
              background: future ? 'transparent' : LEVELS[level(cell)],
              boxShadow:
                active?.day === cell.day
                  ? 'inset 0 0 0 1.5px var(--color-ink-2)'
                  : cell.day === today
                    ? 'inset 0 0 0 1px var(--color-violet-ink)'
                    : future
                      ? 'inset 0 0 0 1px var(--color-line-2)'
                      : undefined,
            }}
          />
        )
      })}
    </>
  )
}
