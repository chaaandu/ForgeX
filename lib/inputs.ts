import 'server-only'
import { STRETCH_IDS, type FounderStopField, type StepInput } from '@/lib/steps'
import { normaliseWorkLink } from '@/lib/links'

/**
 * Checks an answer against what a step or a stop field asked for, on the
 * server. Returns the value to store, or null if it won't do. An empty answer
 * is always allowed here; whether it may be empty is the caller's question.
 */

export const MAX_TEXT = 400

export type Stretch = { picked: string[]; own: string }

export function parseStretch(value: string): Stretch {
  try {
    const raw = JSON.parse(value) as Partial<Stretch>
    return {
      picked: Array.isArray(raw.picked) ? raw.picked.filter((id) => typeof id === 'string') : [],
      own: typeof raw.own === 'string' ? raw.own : '',
    }
  } catch {
    return { picked: [], own: '' }
  }
}

/** 2 stretch features: from the list, or 1 from the list and 1 of their own. */
export function stretchComplete(stretch: Stretch): boolean {
  return stretch.picked.length + (stretch.own.trim() ? 1 : 0) === 2
}

function cleanStretch(raw: string): string | null {
  const stretch = parseStretch(raw)
  const picked = [...new Set(stretch.picked)]
  if (picked.some((id) => !STRETCH_IDS.includes(id as (typeof STRETCH_IDS)[number]))) return null
  const own = stretch.own.trim().slice(0, 200)
  if (picked.length + (own ? 1 : 0) > 2) return null
  return JSON.stringify({ picked, own })
}

type Kind =
  | { kind: 'link'; link: Parameters<typeof normaliseWorkLink>[0] }
  | { kind: 'number' }
  | { kind: 'text' }
  | { kind: 'check' }
  | { kind: 'stretch' }

export function cleanValue(kind: Kind, raw: string): string | null {
  const value = raw.trim()
  if (!value) return ''
  switch (kind.kind) {
    case 'link':
      return normaliseWorkLink(kind.link, value)
    case 'number':
      return /^\d{1,6}$/.test(value) ? String(Number(value)) : null
    case 'text':
      return value.length <= MAX_TEXT ? value : null
    case 'check':
      return value === 'yes' ? 'yes' : null
    case 'stretch':
      return cleanStretch(value)
  }
}

/** A step's answer, or null. Stop steps take no answer: sending the stop ticks them. */
export function cleanStepValue(input: StepInput | undefined, raw: string): string | null {
  if (!input || input.kind === 'stop' || input.kind === 'research') return raw.trim() ? null : ''
  return cleanValue(input, raw)
}

/** Whether a step can be ticked with this stored answer. */
export function stepComplete(input: StepInput | undefined, value: string): boolean {
  if (!input) return true
  if (input.kind === 'link' && input.optional) return true
  if (input.kind === 'stretch') return stretchComplete(parseStretch(value))
  if (input.kind === 'stop' || input.kind === 'research') return false
  return value.length > 0
}

export function cleanStopValue(field: FounderStopField, raw: string): string | null {
  return cleanValue(field, raw)
}

export function stopFieldComplete(field: FounderStopField, value: string): boolean {
  if (field.optional) return true
  if (field.kind === 'stretch') return stretchComplete(parseStretch(value))
  return value.length > 0
}
