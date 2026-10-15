import 'server-only'
import type { Entry } from '@/lib/data/hackathon'
import { hasProblem } from '@/lib/data/hackathon'
import type { Phase } from '@/lib/hackathon'

/**
 * Whether a founder may pick from the bank: only once it opens, only while the
 * hackathon runs, and only with no problem to build and none in review. A
 * problem in review waits for its answer; to move a founder to the bank
 * anyway, the team rejects it in the console.
 */
export const mayUseBank = (entry: Entry | null, phase: Phase) =>
  phase.bankOpen && !phase.over && !hasProblem(entry) && entry?.state !== 'waiting'
