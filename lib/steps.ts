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

/** The starter's build cards, read on GitHub. Filenames are in the starter's cards/ folder. */
export const CARDS_BASE = 'https://github.com/chaaandu/mesa-starter/blob/main/cards'
export const CARD_FILES: Record<number, string> = {
  1: '01-make-your-copy.md',
  2: '02-run-it-in-cursor.md',
  3: '03-go-live-on-vercel.md',
  4: '04-name-and-colours.md',
  5: '05-first-screen-stop-1.md',
  6: '06-your-products.md',
  7: '07-order-from-whatsapp.md',
  8: '08-order-status.md',
  9: '09-today-and-total.md',
  10: '10-connect-supabase.md',
  11: '11-real-data.md',
  12: '12-phone-check-stop-2.md',
  13: '13-real-orders.md',
  14: '14-readme-case-study.md',
  15: '15-demo-video-stop-3.md',
}

export function cardHref(n: number): string {
  const file = CARD_FILES[n]
  return file ? `${CARDS_BASE}/${file}` : `${CARDS_BASE}/README.md`
}

const strip = ({ tracks: _tracks, ...step }: PlanStep): FounderStep => ({
  ...step,
  guide: step.card ? cardHref(step.card) : null,
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
