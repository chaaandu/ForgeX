import 'server-only'
import { archetypes, families } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { allFounders } from '@/lib/data/founders'
import { allPicks, allResponses, statusOf } from '@/lib/data/picks'
import { bank } from '@/lib/data/problems'

export type FounderRow = {
  slug: string
  name: string
  email: string
  photo: string
  number: number | null
  archetype: string
  family: string
  level: number
  pick: string
  status: 'none' | 'waiting' | 'go' | 'tweak' | 'talk' | 'another'
  lastActive: string
  track: string
}

/** One row per founder for the console and the CSV, built from the Sheet. */
export async function founderRows(): Promise<FounderRow[]> {
  const [founders, picks, responses, problems] = await Promise.all([allFounders(), allPicks(), allResponses(), bank()])
  const titles = new Map(problems.map((item) => [item.id, item.title]))
  return founders.map((founder) => {
    const latest = picks.filter((pick) => pick.email === founder.email && !pick.withdrawnAt).at(-1)
    const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
    return {
      slug: founder.slug,
      name: founder.name,
      email: founder.email,
      photo: founder.photo,
      number: founder.number,
      archetype: kind ? archetypes[kind.id].name : '',
      family: kind ? families[kind.family].name : '',
      level: founder.level,
      pick: latest ? (latest.problemId ? (titles.get(latest.problemId) ?? latest.problemId) : (latest.custom?.title ?? '')) : '',
      status: latest ? statusOf(latest, responses) : 'none',
      lastActive: founder.lastActive,
      track: founder.track,
    }
  })
}
