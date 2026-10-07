import 'server-only'
import { redirect } from 'next/navigation'
import { stepsOf } from '@/lib/build'
import { founderContext } from '@/lib/context'
import { seats } from '@/lib/data/pods'
import { ticksOf } from '@/lib/data/steps'
import { currentPath, mayEnter } from '@/lib/journey'
import { dayOf, planNow } from '@/lib/plan'
import { requireFounder } from '@/lib/session'

/**
 * Every screen of the build: a founder who has sent their research. Anyone
 * earlier in onboarding goes back to where they are; a row from the old flow
 * with a high level but no research goes to research.
 */
export async function requireBuilding() {
  const { viewer, founder } = await requireFounder()
  if (!mayEnter(founder, 'today')) redirect(currentPath(founder))
  const [context, ticks, seatMap] = await Promise.all([
    founderContext(founder),
    ticksOf(founder.email),
    seats(),
  ])
  if (!context.research?.sent) redirect('/research')
  const now = planNow()
  const seat = seatMap.get(founder.email)
  return {
    viewer,
    founder,
    context,
    ticks,
    now,
    today: dayOf(now),
    steps: stepsOf(founder),
    mentorOf: seat?.role === 'mentor' ? seat.pod : null,
  }
}
