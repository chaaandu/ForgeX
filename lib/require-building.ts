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
 * Every screen of the 3 weeks: a founder who has seen the challenge. Anyone
 * earlier in onboarding goes back to where they are. Research is part of the
 * plan; until it is sent, the build days show but stay locked.
 */
export async function requireBuilding() {
  const { viewer, founder } = await requireFounder()
  if (!mayEnter(founder, 'today')) redirect(currentPath(founder))
  const [context, ticks, seatMap] = await Promise.all([
    founderContext(founder),
    ticksOf(founder.email),
    seats(),
  ])
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
    researchSent: Boolean(context.research?.sent),
    mentorOf: seat?.role === 'mentor' ? seat.pod : null,
  }
}
