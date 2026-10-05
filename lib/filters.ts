import { TAGS, type Problem, type Tag, type BetMap } from './types'

export type Filters = {
  tags: Tag[]
  cluster: string
  mechanic: string
  q: string
  openOnly: boolean
}

export const EMPTY_FILTERS: Filters = {
  tags: [],
  cluster: '',
  mechanic: '',
  q: '',
  openOnly: false,
}

export type SearchParams = Record<string, string | string[] | undefined>

const one = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? ''

export function parseFilters(params: SearchParams): Filters {
  const tags = one(params.tag)
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter((value): value is Tag => (TAGS as readonly string[]).includes(value))

  return {
    tags,
    cluster: one(params.cluster).trim(),
    mechanic: one(params.mechanic).trim(),
    q: one(params.q).trim(),
    openOnly: one(params.open) === '1',
  }
}

export function isFiltering(filters: Filters): boolean {
  return filters.tags.length > 0 || filters.cluster !== '' || filters.q !== '' || filters.openOnly
}

/** Turns filters back into a query string, leaving any other params alone. */
export function toQuery(filters: Filters, extra: Record<string, string> = {}): string {
  const query = new URLSearchParams()
  if (filters.tags.length) query.set('tag', filters.tags.join(','))
  if (filters.cluster) query.set('cluster', filters.cluster)
  if (filters.mechanic) query.set('mechanic', filters.mechanic)
  if (filters.q) query.set('q', filters.q)
  if (filters.openOnly) query.set('open', '1')
  for (const [key, value] of Object.entries(extra)) {
    if (value) query.set(key, value)
  }
  const text = query.toString()
  return text ? `?${text}` : ''
}

export function applyFilters(problems: Problem[], filters: Filters, bets: BetMap): Problem[] {
  const needle = filters.q.toLowerCase()
  return problems.filter((problem) => {
    if (filters.tags.length && !filters.tags.includes(problem.tag)) return false
    if (filters.cluster && problem.cluster !== filters.cluster) return false
    if (filters.mechanic && problem.mechanic !== filters.mechanic) return false
    if (filters.openOnly && bets[problem.id]) return false
    if (needle) {
      const haystack = `${problem.title} ${problem.problem} ${problem.who}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}

export function clustersOf(problems: Problem[]): string[] {
  return [...new Set(problems.map((problem) => problem.cluster))].filter(Boolean).sort()
}

export function mechanicsOf(problems: Problem[]): string[] {
  return [...new Set(problems.map((problem) => problem.mechanic))].filter(Boolean).sort()
}
