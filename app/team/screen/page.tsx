import type { Metadata } from 'next'
import { Countdown } from '@/components/build/Countdown'
import { Brand } from '@/components/shell/Brand'
import { Avatar } from '@/components/ui/Avatar'
import { Refresh } from '@/components/ui/Refresh'
import { consoleCopy, meta } from '@/content/copy'
import { clock, dueOf, phaseAt, STAGE_IDS, type StepId } from '@/lib/hackathon'
import { requireTeam } from '@/lib/session'
import { founderRows, type FounderRow } from '@/lib/team-rows'

export const metadata: Metadata = {
  title: meta.pages.screen,
  robots: { index: false, follow: false },
}

const copy = consoleCopy.screen

/** Whether a founder has done a step: an approved problem, or a stage submitted. */
const did = (row: FounderRow, step: StepId) =>
  step === 'problem' ? row.status === 'building' || row.status === 'done' : Boolean(row.sentAt[step])

/**
 * For the projector: the step everyone is on now, how many have done it, how
 * long is left, and the faces of those who have. Only those who have done it
 * appear, so the screen cheers people on and never points at who is behind.
 */
export default async function ScreenPage() {
  await requireTeam()
  const rows = await founderRows()
  const now = clock()
  const phase = phaseAt(now)
  const step: StepId =
    (['problem', ...STAGE_IDS] as StepId[]).find((item) => !phase.closed[item]) ?? 'pitch'
  const done = rows.filter((row) => did(row, step))
  const building = rows.filter((row) => row.status === 'building').length
  const review = rows.filter((row) => row.status === 'review').length

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] gap-10 px-6 py-6 md:px-12 md:py-10">
      <Refresh />
      <header className="flex items-center justify-between gap-6">
        <Brand href="/team" />
        <p className="meta m-0 flex gap-4">
          <span>{copy.review(review)}</span>
          <span>{copy.building(building)}</span>
        </p>
      </header>
      <main className="grid content-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
        <div className="grid gap-8">
          <div className="grid gap-2">
            <p className="meta m-0">{copy.titles[step]}</p>
            <p className="display m-0 text-[clamp(120px,22vw,340px)] leading-[0.8]">
              {done.length}
              <span className="text-ink-3 ml-5 font-mono text-[clamp(18px,2vw,32px)] tracking-normal">
                {copy.of(rows.length)}
              </span>
            </p>
          </div>
          <div className="bg-s3 h-3 overflow-hidden rounded-full" aria-hidden="true">
            <span
              className="bg-violet block h-full rounded-full transition-[width] duration-700"
              style={{ width: `${(done.length / Math.max(1, rows.length)) * 100}%` }}
            />
          </div>
          <p className="display text-violet-ink m-0 text-[clamp(40px,6vw,96px)] leading-none" role="timer">
            {phase.closed[step] ? (
              copy.closed
            ) : (
              <>
                <Countdown closes={dueOf(step)} now={now.toISOString()} bare />{' '}
                <span className="text-ink-2 font-mono text-[clamp(14px,1.4vw,22px)] tracking-normal">
                  {copy.left}
                </span>
              </>
            )}
          </p>
        </div>
        <ul className="m-0 flex list-none flex-wrap content-start gap-3 p-0" aria-label={copy.faces}>
          {done.map((row) => (
            <li key={row.slug} className="rise grid w-[84px] justify-items-center gap-1.5">
              <Avatar src={row.photo} size={72} />
              <span className="text-ink-2 w-full truncate text-center text-[12px]">
                {row.name.split(' ')[0]}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
