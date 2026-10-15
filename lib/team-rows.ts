import 'server-only'
import { archetypes, families } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import { buildingOf } from '@/lib/context'
import { allFounders } from '@/lib/data/founders'
import { entries, progress, stampToIso, statusWord } from '@/lib/data/hackathon'
import { bank } from '@/lib/data/problems'
import type { StageId, StepId } from '@/lib/hackathon'
import type { ProblemState } from '@/lib/own-problem'
import type { SubmissionFields } from '@/lib/submission'

/**
 * Where a founder stands, in the board's four words: no problem sent yet, a
 * problem in review, building, or done (the pitch is in).
 */
export type BoardStatus = 'none' | 'review' | 'building' | 'done'

export type FounderRow = {
  slug: string
  name: string
  email: string
  photo: string
  number: number | null
  archetype: string
  family: string
  level: number
  reviewer: string
  group: string
  poc: string
  /** The headline: their problem's name, or a bank problem's challenge. Empty until they send one. */
  title: string
  state: ProblemState
  status: BoardStatus
  /** The word the Sheet shows. */
  word: string
  progress: number
  /** Their own problem rather than one from the bank. */
  own: boolean
  industry: string
  fields: SubmissionFields
  research: { primary: string; secondary: string }
  /** When each stage was submitted, as an ISO time, or empty. */
  sentAt: Record<StageId, string>
  reopened: StepId[]
  /** How many times they have sent their problem. */
  versions: number
  /** When the newest version was sent, as an ISO time, for a queue that runs oldest first. */
  sentProblemAt: string
  lastActive: string
}

const boardStatus = (state: ProblemState, done: boolean): BoardStatus =>
  done
    ? 'done'
    : state === 'none'
      ? 'none'
      : state === 'waiting' || state === 'rejected'
        ? 'review'
        : 'building'

/** One row per founder for the console and the CSV, built from the Sheet. */
export async function founderRows(): Promise<FounderRow[]> {
  const [founders, all, problems] = await Promise.all([allFounders(), entries(), bank()])
  const byId = new Map(problems.map((item) => [item.id, item]))
  return founders.map((founder) => {
    const entry = all.get(founder.email)
    const building = buildingOf(entry, byId)
    const kind = founder.archetype ? ARCHETYPES[founder.archetype] : null
    const state = entry?.state ?? 'none'
    return {
      slug: founder.slug,
      name: founder.name,
      email: founder.email,
      photo: founder.photo,
      number: founder.number,
      archetype: kind ? archetypes[kind.id].name : '',
      family: kind ? families[kind.family].name : '',
      level: founder.level,
      reviewer: entry?.reviewer ?? '',
      group: entry?.group ?? '',
      poc: entry?.poc ?? '',
      title: building?.title ?? entry?.latest?.title ?? entry?.title ?? '',
      state,
      status: boardStatus(state, Boolean(entry?.sentAt.pitch)),
      word: entry ? statusWord(entry) : '',
      progress: entry ? progress(entry) : 0,
      own: state !== 'bank' && state !== 'none',
      industry: building?.industry ?? '',
      fields: entry?.fields ?? {},
      research: entry?.research ?? { primary: '', secondary: '' },
      sentAt: {
        scope: stampToIso(entry?.sentAt.scope ?? ''),
        prototype: stampToIso(entry?.sentAt.prototype ?? ''),
        launch: stampToIso(entry?.sentAt.launch ?? ''),
        pitch: stampToIso(entry?.sentAt.pitch ?? ''),
      },
      reopened: entry ? [...entry.reopened] : [],
      versions: entry?.versions.length ?? 0,
      sentProblemAt: stampToIso(entry?.latest?.time ?? ''),
      lastActive: founder.lastActive,
    }
  })
}
