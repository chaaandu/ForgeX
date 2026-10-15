import { z } from 'zod'
import { normaliseWorkLink } from '@/lib/links'
import { INDUSTRY_IDS } from '@/lib/taxonomy'

/**
 * A founder's own problem, as they send it for review: the industry, a short
 * name, the 3Ps (the Person who has it, the Problem they live with, the
 * Promise of what changes for them), why they are the one to solve it, the
 * plan, and the research behind it.
 */
const text = (min: number, max: number) => z.string().trim().min(min).max(max)

/**
 * The most words each written field may have. Only words count, never the
 * spaces or blank lines between them. The research lives in the linked docs,
 * so these stay short. The title is under 10 words.
 */
export const WORD_LIMITS = {
  title: 9,
  person: 40,
  problem: 80,
  promise: 40,
  why: 60,
  plan: 100,
} as const
export type WordField = keyof typeof WORD_LIMITS

export const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length

/** A written field: present, and within its word limit. The issue reads `words` when it is too long. */
const written = (field: WordField, min: number) =>
  text(min, 3000).refine((value) => wordCount(value) <= WORD_LIMITS[field], 'words')

export const ownProblemSchema = z
  .object({
    industry: z.enum([...INDUSTRY_IDS, 'other']),
    /** The industry in their words, when none of ours fits. */
    industryOther: z.string().trim().max(40).default(''),
    title: written('title', 3),
    person: written('person', 10),
    problem: written('problem', 20),
    promise: written('promise', 10),
    /** Why they are the right person to solve it. */
    why: written('why', 10),
    plan: written('plan', 10),
    primary: text(4, 400),
    secondary: text(4, 400),
  })
  .refine((value) => value.industry !== 'other' || value.industryOther.length > 1, {
    path: ['industryOther'],
    message: 'Name the industry',
  })

export type OwnProblem = z.infer<typeof ownProblemSchema>

export const OWN_FIELDS = ['title', 'person', 'problem', 'promise', 'why', 'plan'] as const
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
