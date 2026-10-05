import { TAGS, type Problem, type Tag, type ToolKit } from './types'

/** Header names in row 1 of the Problems tab. Columns A to N. */
export const PROBLEM_HEADERS = [
  'ID',
  'Title',
  'Tag',
  'Cluster',
  'Region',
  'Problem',
  'Who experiences it',
  'Why it matters',
  'Challenge',
  'North star metric',
  'Potential directions (examples only)',
  'Constraints',
  'Build expectation',
  'Tools to use',
] as const

/** Written by the app's editing pass, not part of the original bank. */
export const EXTRA_HEADERS = ['Mechanic', 'Status'] as const

/** The one column the app writes, after N. */
export const BET_HEADERS = ['Bet by'] as const

/** `🟣 Epic` to `epic`. Returns null for anything unrecognised. */
export function normaliseTag(raw: string): Tag | null {
  const word = raw
    .replace(/[^\p{L}]/gu, '')
    .trim()
    .toLowerCase()
  return (TAGS as readonly string[]).includes(word) ? (word as Tag) : null
}

/** `A. SMB, commerce and retail` to `SMB, commerce and retail`. */
export function stripClusterPrefix(raw: string): string {
  return raw.replace(/^[A-Z]\.\s+/, '').trim()
}

/** `a; b; c` to `['a', 'b', 'c']`. */
export function parseDirections(raw: string): string[] {
  return raw
    .split(/;\s+/)
    .map((part) => part.trim().replace(/[.;]$/, ''))
    .filter(Boolean)
}

/** `Docs: Claude, Textract; Data: Sheets` to `[{ kit: 'Docs', tools: '...' }, ...]`. */
export function parseTools(raw: string): ToolKit[] {
  return raw
    .split(/;\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const at = chunk.indexOf(': ')
      if (at === -1) return { kit: '', tools: chunk }
      return { kit: chunk.slice(0, at).trim(), tools: chunk.slice(at + 2).trim() }
    })
    .filter((row) => row.tools.length > 0)
}

type RawRow = Record<string, string>

/** Builds a Problem from a row keyed by header name. Returns null for blank or untagged rows. */
export function toProblem(row: RawRow): Problem | null {
  const get = (header: string) => (row[header] ?? '').toString().trim()
  const id = get('ID')
  const tag = normaliseTag(get('Tag'))
  if (!id || !tag) return null
  return {
    id,
    title: get('Title'),
    tag,
    cluster: stripClusterPrefix(get('Cluster')),
    region: get('Region'),
    problem: get('Problem'),
    who: get('Who experiences it'),
    whyItMatters: get('Why it matters'),
    challenge: get('Challenge'),
    northStar: get('North star metric'),
    directions: parseDirections(get('Potential directions (examples only)')),
    constraints: get('Constraints'),
    buildExpectation: get('Build expectation'),
    tools: parseTools(get('Tools to use')),
    mechanic: get('Mechanic'),
  }
}
