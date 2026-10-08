import 'server-only'
import { PLAN_STEPS, STOP_FIELDS, STRETCH } from '@/content/plan'
import { STOPS, type StopNumber } from '@/lib/plan'
import type { WorkLinkKind } from '@/lib/links'
import type { Track } from '@/lib/tracks'

/**
 * The plan's shape. The words are in `content/plan.ts`; this file decides who
 * gets which step. Server only: each founder's browser receives their own
 * track's steps with the track stripped off, never the whole plan, so nobody
 * can read which track they are on or what another track was given.
 */

export const TOOLS = [
  'claude',
  'figma',
  'cursor',
  'copilot',
  'github',
  'supabase',
  'gcloud',
  'vercel',
  'owners',
] as const
export type Tool = (typeof TOOLS)[number]

export type StepInput =
  | { kind: 'link'; link: WorkLinkKind; label: string; optional?: boolean }
  | { kind: 'number'; label: string }
  | { kind: 'text'; label: string; placeholder: string }
  | { kind: 'stretch' }
  | { kind: 'stop'; stop: StopNumber }
  /** Sending the research form ticks it. */
  | { kind: 'research' }

export type PlanStep = {
  /** Frozen once founders can tick it: ticks are stored against this. */
  id: string
  /** The IST day it's due. */
  day: string
  tracks: readonly Track[]
  title: string
  what: string
  done: string
  example?: string
  tool?: Tool
  /** A starter build card, by number. */
  card?: number
  input?: StepInput
}

/** What a founder's browser gets: one step, without the track. */
export type FounderStep = Omit<PlanStep, 'tracks'> & { guide: string | null }

export type StopFieldKind =
  | { kind: 'link'; link: WorkLinkKind }
  | { kind: 'number' }
  | { kind: 'text' }
  | { kind: 'check' }
  | { kind: 'stretch' }

export type StopField = StopFieldKind & {
  id: string
  stop: StopNumber
  tracks: readonly Track[]
  label: string
  hint?: string
  optional?: boolean
  /** Steps whose answer fills this field in before the founder types anything. */
  from?: readonly string[]
}

/** Omit that keeps a union a union, so each field keeps its own kind. */
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type FounderStopField = OmitEach<StopField, 'tracks'>

/** The ForgeX starter on GitHub: its build cards, frameworks and prompts. */
export const STARTER_BASE = 'https://github.com/chaaandu/forgex-starter/blob/main'
export const CARDS_BASE = `${STARTER_BASE}/cards`
export const RESEARCH_TEMPLATE = `${STARTER_BASE}/frameworks/01-research-doc.md`
export const WEBSITE_PROMPT = `${STARTER_BASE}/prompts/build-my-website.md`
export const CARD_FILES: Record<number, string> = {
  1: '01-make-your-copy.md',
  2: '02-run-it-in-cursor.md',
  3: '03-go-live-on-vercel.md',
  4: '04-make-it-yours.md',
  5: '05-first-screen-phase-1.md',
  6: '06-your-data.md',
  7: '07-core-flow-part-1.md',
  8: '08-core-flow-part-2.md',
  9: '09-daily-screen.md',
  10: '10-connect-supabase.md',
  11: '11-real-data.md',
  12: '12-phone-check-phase-2.md',
  13: '13-real-owner.md',
  14: '14-readme-case-study.md',
  15: '15-loom-demo-phase-3.md',
}

export function cardHref(n: number): string {
  const file = CARD_FILES[n]
  return file ? `${CARDS_BASE}/${file}` : `${CARDS_BASE}/README.md`
}

/** Website steps link to the starter's website prompt. */
const isSite = (id: string) => /(^|-)site-|^a-landing$/.test(id)

const strip = ({ tracks: _tracks, ...step }: PlanStep): FounderStep => ({
  ...step,
  guide: step.card
    ? cardHref(step.card)
    : isSite(step.id)
      ? WEBSITE_PROMPT
      : step.id === 'r-talk'
        ? RESEARCH_TEMPLATE
        : null,
})

/** A track's steps, oldest day first. */
export function stepsFor(track: Track): FounderStep[] {
  return PLAN_STEPS.filter((step) => step.tracks.includes(track))
    .sort((a, b) => a.day.localeCompare(b.day))
    .map(strip)
}

export function stepById(id: string): PlanStep | undefined {
  return PLAN_STEPS.find((step) => step.id === id)
}

/** The fields a track sends at a stop, without the track. */
export function stopFieldsFor(track: Track, stop: StopNumber): FounderStopField[] {
  return STOP_FIELDS.filter((field) => field.stop === stop && field.tracks.includes(track)).map(
    ({ tracks: _tracks, ...field }) => field as FounderStopField,
  )
}

export function stopStepId(stop: StopNumber): string {
  return `stop-${stop}`
}

export const STRETCH_IDS = STRETCH.map((item) => item.id)

export { STOPS }
