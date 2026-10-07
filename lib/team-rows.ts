import 'server-only'
import { archetypes, families } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { progressOf, stepsOf } from '@/lib/build'
import { allFounders } from '@/lib/data/founders'
import { allMessages, threads, waitingOnTeam } from '@/lib/data/messages'
import { seats } from '@/lib/data/pods'
import { allResearch } from '@/lib/data/research'
import { allReviews, latestBy, type Rating } from '@/lib/data/reviews'
import { allTicks } from '@/lib/data/steps'
import { allSubmissions } from '@/lib/data/submissions'
import { dayOf, planNow, STOP_NUMBERS, STOPS } from '@/lib/plan'
import { stopState } from '@/lib/stops'
import { TRACK_LABELS, trackOf } from '@/lib/tracks'

export type StopCell = { state: 'none' | 'draft' | 'sent' | 'late'; rating: Rating | null }

export type FounderRow = {
  slug: string
  name: string
  email: string
  photo: string
  number: number | null
  track: string
  trackLabel: string
  pod: number | null
  mentor: boolean
  archetype: string
  family: string
  level: number
  forWho: string
  done: number
  due: number
  behind: number
  stops: StopCell[]
  waiting: boolean
  lastActive: string
}

/** One row per founder for the console and the CSV, built from the Sheet. Team only. */
export async function founderRows(): Promise<FounderRow[]> {
  const [founders, research, ticks, submissions, reviews, seatMap, messages] = await Promise.all([
    allFounders(),
    allResearch(),
    allTicks(),
    allSubmissions(),
    allReviews(),
    seats(),
    allMessages(),
  ])
  const now = planNow()
  const today = dayOf(now)
  const byThread = threads(messages)
  const latest = Object.fromEntries(
    STOP_NUMBERS.map((n) => [n, latestBy(reviews, String(n) as '1')]),
  ) as Record<1 | 2 | 3, ReturnType<typeof latestBy>>
  return founders.map((founder) => {
    const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
    const track = trackOf(founder.track)
    const mine = ticks.get(founder.email) ?? {}
    const progress = progressOf(stepsOf(founder), mine, today)
    const seat = seatMap.get(founder.email)
    const mineResearch = research.get(founder.email)
    return {
      slug: founder.slug,
      name: founder.name,
      email: founder.email,
      photo: founder.photo,
      number: founder.number,
      track,
      trackLabel: TRACK_LABELS[track],
      pod: seat?.pod ?? null,
      mentor: seat?.role === 'mentor',
      archetype: kind ? archetypes[kind.id].name : '',
      family: kind ? families[kind.family].name : '',
      level: founder.level,
      forWho: mineResearch?.sent ? mineResearch.forWho : '',
      done: progress.done,
      due: progress.due,
      behind: progress.behind,
      stops: STOP_NUMBERS.map((n) => {
        const history = submissions.filter(
          (item) => item.email === founder.email && item.stop === n,
        )
        const state = stopState(history, STOPS[n].closes, now)
        return {
          state: state.late ? 'late' : state.sent ? 'sent' : state.current ? 'draft' : 'none',
          rating: latest[n].get(founder.email)?.rating ?? null,
        }
      }),
      waiting: waitingOnTeam(byThread.get(founder.email) ?? []),
      lastActive: founder.lastActive,
    }
  })
}

/** The tracks with how many founders sit in each, for the console's filters. */
export function trackOptions(rows: FounderRow[]) {
  return Object.entries(TRACK_LABELS).map(([id, label]) => ({
    id,
    label,
    count: rows.filter((row) => row.track === id).length,
  }))
}
