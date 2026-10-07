import type { Metadata } from 'next'
import { BuildShell } from '@/components/build/BuildShell'
import { Avatar } from '@/components/ui/Avatar'
import { consoleCopy, meta } from '@/content/copy'
import { progressOf } from '@/lib/build'
import { requireBuilding } from '@/lib/require-building'
import { ago } from '@/lib/dates'
import { allFounders } from '@/lib/data/founders'
import { seats } from '@/lib/data/pods'
import { allTicks } from '@/lib/data/steps'
import { stepsFor } from '@/lib/steps'
import { trackOf } from '@/lib/tracks'

export const metadata: Metadata = { title: meta.pages.pod }

const copy = consoleCopy.mentor

/**
 * A peer mentor's view of their pod: who, today's steps, and how far behind.
 * Never a rating, a message or anything the team wrote: that stays with the
 * team. Anyone who isn't a mentor sees that they aren't.
 */
export default async function PodPage() {
  const { founder, context, today, mentorOf } = await requireBuilding()
  const [founders, seatMap, ticks] = await Promise.all([allFounders(), seats(), allTicks()])
  const members =
    mentorOf === null
      ? []
      : founders
          .filter((item) => {
            const seat = seatMap.get(item.email)
            return seat?.pod === mentorOf && seat.role === 'member'
          })
          .map((item) => {
            const steps = stepsFor(trackOf(item.track))
            const mine = ticks.get(item.email) ?? {}
            const todays = steps.filter((step) => step.day === today)
            return {
              slug: item.slug,
              name: item.name,
              photo: item.photo,
              today: `${todays.filter((step) => mine[step.id]?.done).length} / ${todays.length}`,
              behind: progressOf(steps, mine, today).behind,
              active: item.lastActive ? ago(item.lastActive) : '—',
            }
          })
          .sort((a, b) => b.behind - a.behind || a.name.localeCompare(b.name))

  return (
    <BuildShell card={context.card} slug={founder.slug} pod={mentorOf !== null}>
      <div className="grid max-w-[760px] gap-8">
        <div className="grid gap-3">
          <h1 className="display m-0 text-[clamp(40px,5vw,60px)] leading-none">
            {mentorOf === null ? meta.pages.pod : copy.title(String(mentorOf))}
          </h1>
          <p className="text-lead text-ink-2 m-0 max-w-[48ch]">
            {mentorOf === null ? copy.none : copy.lead}
          </p>
        </div>
        {members.length ? (
          <table className="w-full border-collapse text-[15px]">
            <thead className="border-line border-b">
              <tr>
                <th scope="col" className="meta py-3 pr-4 text-left font-normal">
                  {consoleCopy.founders.columns.name}
                </th>
                <th scope="col" className="meta py-3 pr-4 text-left font-normal">
                  {copy.today}
                </th>
                <th scope="col" className="meta py-3 pr-4 text-left font-normal">
                  {copy.behind}
                </th>
                <th scope="col" className="meta hidden py-3 text-left font-normal sm:table-cell">
                  {copy.active}
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.slug} className="border-line border-b">
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-3">
                      <Avatar src={member.photo} size={36} />
                      <span className="truncate">{member.name}</span>
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[13px]">{member.today}</td>
                  <td
                    className={`py-2.5 pr-4 font-mono text-[13px] ${member.behind >= 2 ? 'text-violet-ink' : 'text-ink-2'}`}
                  >
                    {member.behind}
                  </td>
                  <td className="text-ink-3 hidden py-2.5 font-mono text-[13px] sm:table-cell">
                    {member.active}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </BuildShell>
  )
}
