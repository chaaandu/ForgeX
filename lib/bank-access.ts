import 'server-only'
import type { Entry } from '@/lib/data/hackathon'
import { hasProblem } from '@/lib/data/hackathon'
import type { Phase } from '@/lib/hackathon'

/**
 * Whether a founder may pick from the bank: only once it opens, only while the
 * hackathon runs, and only without a problem to build. A problem still in
 * review may be given up for one of ours; a rejected one, or none, must be.
 */
export const mayUseBank = (entry: Entry | null, phase: Phase) =>
  phase.bankOpen && !phase.over && !hasProblem(entry)
