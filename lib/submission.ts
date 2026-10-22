import { STAGE_IDS, type StageId } from '@/lib/hackathon'
import { normaliseWorkLink, type WorkLinkKind } from '@/lib/links'

/**
 * What a founder submits after their problem, stage by stage. Each link is
 * checked for the place it should live, so a GitHub profile cannot stand in
 * for a repo or a file on a laptop for a deck. Shared by the forms, the
 * actions and the console, so all three agree on what done means.
 */
export const SUBMISSION_FIELDS = [
  { id: 'scope', stage: 'scope', kind: 'doc', required: true },
  { id: 'github', stage: 'prototype', kind: 'github', required: true },
  { id: 'prototype', stage: 'prototype', kind: 'proof', required: true },
  { id: 'proof', stage: 'prototype', kind: 'proof', required: true },
  { id: 'live', stage: 'launch', kind: 'live', required: true },
  { id: 'deck', stage: 'pitch', kind: 'deck', required: true },
  { id: 'video', stage: 'pitch', kind: 'video', required: true },
  { id: 'linkedin', stage: 'pitch', kind: 'post', required: true },
  { id: 'linkedinMore', stage: 'pitch', kind: 'posts', required: false },
  { id: 'docs', stage: 'pitch', kind: 'doc', required: true },
] as const satisfies readonly {
  id: string
  stage: StageId
  kind: WorkLinkKind | 'posts'
  required: boolean
}[]

export type SubmissionField = (typeof SUBMISSION_FIELDS)[number]['id']
export type SubmissionFields = Partial<Record<SubmissionField, string>>

export const SUBMISSION_IDS = SUBMISSION_FIELDS.map((field) => field.id) as SubmissionField[]

export const fieldsOf = (stage: StageId) =>
  SUBMISSION_FIELDS.filter((field) => field.stage === stage)

export const requiredOf = (stage: StageId): SubmissionField[] =>
  fieldsOf(stage)
    .filter((field) => field.required)
    .map((field) => field.id)

/** The links the console ticks off, one a stage that matters most to a judge. */
export const TICKS = [
  'scope',
  'github',
  'prototype',
  'proof',
  'live',
  'docs',
  'deck',
  'video',
] as const satisfies readonly SubmissionField[]

const MORE_MAX = 4

/**
 * One field, cleaned. A string is the value to store (empty clears it); null
 * means what was typed cannot be used as it is.
 */
export function cleanField(id: SubmissionField, raw: string): string | null {
  const value = raw.trim()
  if (!value) return ''
  const field = SUBMISSION_FIELDS.find((item) => item.id === id)
  if (!field) return null
  if (field.kind === 'posts') {
    const links = value.split(/\s+/).filter(Boolean).slice(0, MORE_MAX)
    const clean = links.map((link) => normaliseWorkLink('post', link))
    return clean.every((link): link is string => link !== null) ? clean.join('\n') : null
  }
  return normaliseWorkLink(field.kind, value)
}

export function missingIn(stage: StageId, fields: SubmissionFields): SubmissionField[] {
  return requiredOf(stage).filter((id) => !fields[id])
}

export const isStageComplete = (stage: StageId, fields: SubmissionFields) =>
  missingIn(stage, fields).length === 0

/**
 * How far a founder has come, out of 100: sending a problem is 10, an
 * approved one 20, then the MVP scope, the prototype, the launch and the
 * pitch take it to 30, 55, 80 and 100. Each part counts on its own, so a
 * stage sent out of order still adds what it is worth.
 */
export const WEIGHTS = {
  sent: 10,
  approved: 10,
  scope: 10,
  prototype: 25,
  launch: 25,
  pitch: 20,
} as const satisfies Record<'sent' | 'approved' | StageId, number>

type ProgressInput = { sent: boolean; approved: boolean; submitted: Record<StageId, boolean> }

export function progressOf(input: ProgressInput): number {
  return (
    (input.sent || input.approved ? WEIGHTS.sent : 0) +
    (input.approved ? WEIGHTS.approved : 0) +
    STAGE_IDS.reduce((sum, stage) => sum + (input.submitted[stage] ? WEIGHTS[stage] : 0), 0)
  )
}

/** The parts of progress, each filled from 0 to 1, in the order they are done. */
export type ProgressPart = 'problem' | StageId
export const PROGRESS_PARTS: { id: ProgressPart; weight: number }[] = [
  { id: 'problem', weight: WEIGHTS.sent + WEIGHTS.approved },
  ...STAGE_IDS.map((stage) => ({ id: stage, weight: WEIGHTS[stage] })),
]

/** How full each part is: the problem half full once sent, full once approved. */
export function partsOf(input: ProgressInput): Record<ProgressPart, number> {
  return {
    problem: input.approved ? 1 : input.sent ? WEIGHTS.sent / (WEIGHTS.sent + WEIGHTS.approved) : 0,
    scope: input.submitted.scope ? 1 : 0,
    prototype: input.submitted.prototype ? 1 : 0,
    launch: input.submitted.launch ? 1 : 0,
    pitch: input.submitted.pitch ? 1 : 0,
  }
}
