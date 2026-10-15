import { z } from 'zod'
import { normaliseWorkLink } from '@/lib/links'
import { INDUSTRY_IDS } from '@/lib/taxonomy'

/**
 * A founder's own problem, as they send it for review: the industry, a short
 * name, the 3Ps (the Person who has it, the Problem they live with, the
 * Promise of what changes for them), the plan, and the research behind it.
 */
const text = (min: number, max: number) => z.string().trim().min(min).max(max)

export const ownProblemSchema = z
  .object({
    industry: z.enum([...INDUSTRY_IDS, 'other']),
    /** The industry in their words, when none of ours fits. */
    industryOther: z.string().trim().max(40).default(''),
    title: text(3, 80).refine((value) => value.split(/\s+/).length < 10, 'Under ten words'),
    person: text(10, 600),
    problem: text(20, 900),
    promise: text(10, 600),
    plan: text(10, 900),
    primary: text(4, 400),
    secondary: text(4, 400),
  })
  .refine((value) => value.industry !== 'other' || value.industryOther.length > 1, {
    path: ['industryOther'],
    message: 'Name the industry',
  })

export type OwnProblem = z.infer<typeof ownProblemSchema>

export const OWN_FIELDS = ['title', 'person', 'problem', 'promise', 'plan'] as const
export const RESEARCH_FIELDS = ['primary', 'secondary'] as const
export type ResearchField = (typeof RESEARCH_FIELDS)[number]

/** A research link, cleaned: any page that opens, never a script. */
export const cleanResearch = (raw: string) => normaliseWorkLink('research', raw)

/** What a reviewer can answer. Every answer but a plain yes carries a note. */
export const DECISIONS = ['approved', 'changes', 'rejected'] as const
export type Decision = (typeof DECISIONS)[number]

export const needsNote = (decision: Decision) => decision !== 'approved'

/**
 * Where a founder's problem stands. `waiting` has been sent and not answered;
 * `approved` and `changes` both let them build, `changes` with notes to act on;
 * `rejected` means send it again, or after the window, pick from the bank;
 * `bank` means they picked one of ours.
 */
export type ProblemState = 'none' | 'waiting' | 'approved' | 'changes' | 'rejected' | 'bank'

export const mayBuild = (state: ProblemState) =>
  state === 'approved' || state === 'changes' || state === 'bank'
