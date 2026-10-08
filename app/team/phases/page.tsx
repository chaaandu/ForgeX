import { redirect } from 'next/navigation'
import { nextStop, planNow } from '@/lib/plan'

/** The stop most worth looking at: the next to close, or stop 3 once all have. */
export default function TeamStopsPage() {
  redirect(`/team/phases/${nextStop(planNow()) ?? 3}`)
}
