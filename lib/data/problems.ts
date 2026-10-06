import 'server-only'
import { problemSchema, type Problem } from '@/lib/problem'
import { rows, updateRow } from '@/lib/store'
import type { Header, Row } from '@/lib/sheet/tabs'

/**
 * The bank. Founders only ever see approved rows; anything the script does not
 * recognise as a status reads as a draft, so a typo cannot publish a problem.
 */
export type ProblemStatus = 'draft' | 'approved' | 'rejected'

export type BankProblem = Problem & {
  status: ProblemStatus
  row: number
  editedBy: string
  editedAt: string
}

const split = (cell: string) =>
  cell
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

function toProblem({ row, cells }: Row<'problems'>): BankProblem | null {
  const status =
    (['approved', 'rejected'] as const).find(
      (value) => value === cells.Status.trim().toLowerCase(),
    ) ?? 'draft'
  const parsed = problemSchema.safeParse({
    id: cells.ID.trim(),
    title: cells.Title.trim(),
    problem: cells.Problem.trim(),
    challenge: cells.Challenge.trim(),
    difficulty: cells.Difficulty.trim().toLowerCase(),
    industries: split(cells.Industries),
    side: cells.Side.trim(),
    learn: split(cells.Learn),
    geo: cells.Geo.trim() || 'global',
    signal: {
      count: Number(cells['Signal count']) || 1,
      strength: Math.min(5, Math.max(1, Number(cells['Signal strength']) || 1)),
      line: cells['Signal line'].trim() || 'Seen in recent posts',
    },
  })
  if (!parsed.success) return null
  return { ...parsed.data, status, row, editedBy: cells['Edited by'], editedAt: cells['Edited at'] }
}

/** Every problem the Sheet holds, with rows that fail validation left out. */
export async function bank(): Promise<BankProblem[]> {
  return (await rows('problems'))
    .map(toProblem)
    .filter((item): item is BankProblem => item !== null)
}

/**
 * Approved problems, for the matcher. Still carries difficulty and signal, so
 * it stays on the server: anything bound for a browser goes through
 * `forFounder` first.
 */
export async function openProblems(): Promise<Problem[]> {
  return (await bank())
    .filter((item) => item.status === 'approved')
    .map((item) => ({
      id: item.id,
      title: item.title,
      problem: item.problem,
      challenge: item.challenge,
      difficulty: item.difficulty,
      industries: item.industries,
      side: item.side,
      learn: item.learn,
      geo: item.geo,
      signal: item.signal,
    }))
}

export async function problemById(id: string): Promise<BankProblem | null> {
  return (await bank()).find((item) => item.id === id) ?? null
}

export async function setProblem(
  item: BankProblem,
  patch: Partial<Record<Header<'problems'>, string>>,
  editor: string,
): Promise<void> {
  await updateRow('problems', item.row, {
    ...patch,
    'Edited by': editor,
    'Edited at': new Date().toISOString(),
  })
}

export async function internalFor(id: string) {
  const found = (await rows('internal')).find(({ cells }) => cells.ID.trim() === id)
  if (!found) return null
  const parse = (cell: string): unknown => {
    try {
      return JSON.parse(cell)
    } catch {
      return null
    }
  }
  return {
    evidence: (parse(found.cells.Evidence) ?? []) as {
      source: string
      url: string
      date: string
      paraphrase: string
    }[],
    sources: (parse(found.cells.Sources) ?? {}) as Record<string, number>,
    whyNow: found.cells['Why now'],
    players: (parse(found.cells.Players) ?? []) as { name: string; gap: string }[],
    scores: (parse(found.cells.Scores) ?? {}) as Record<string, { value: number; note: string }>,
    total: Number(found.cells.Total) || 0,
  }
}
