import { dueOf, HACKATHON, STAGE_IDS, type Phase, type StageId, type StepId } from '@/lib/hackathon'
import { mayBuild, type ProblemState } from '@/lib/own-problem'
import { fieldsOf, type SubmissionFields } from '@/lib/submission'

/**
 * A founder's four steps as their home shows them: where each stands, when it
 * is due, and the one thing to press. Worked out from their state and the
 * clock alone, so the home, the nav and the tests all agree.
 */
export type StepState =
  | 'todo'
  | 'locked'
  | 'waiting'
  | 'approved'
  | 'changes'
  | 'rejected'
  | 'bank'
  | 'started'
  | 'done'
  | 'missed'

export type StepAction = 'write' | 'view' | 'fix' | 'pick' | 'add' | 'resume' | 'change' | 'view2'

export type StepView = {
  id: StepId
  state: StepState
  due: string
  href: string | null
  action: StepAction | null
  /** The step a founder should do now. */
  current: boolean
}

export type StepInput = {
  state: ProblemState
  sentAt: Record<StageId, string>
  fields: SubmissionFields
  reopened: readonly StepId[]
  researchDone: boolean
  /** They have answered the three questions the bank needs. */
  answered: boolean
  /** When their newest version was sent, as an ISO time, if they have sent one. */
  latestSent?: string
}

/**
 * Whether a founder may still send their problem, and by when. The window
 * itself; then the extra time for anyone with nothing sent or a rejected
 * problem, which also covers a problem sent in that time; then a reopen.
 */
export function problemWindow(
  input: Pick<StepInput, 'state' | 'reopened' | 'latestSent'>,
  phase: Phase,
): { open: boolean; due: string } {
  if (phase.problemsOpen) return { open: true, due: HACKATHON.problemsClose }
  const sentLate =
    Boolean(input.latestSent) &&
    Date.parse(input.latestSent ?? '') >= Date.parse(HACKATHON.problemsClose)
  const extended =
    input.state === 'none' || input.state === 'rejected' || (input.state === 'waiting' && sentLate)
  if (phase.extended && extended) return { open: true, due: HACKATHON.problemsExtended }
  return { open: input.reopened.includes('problem'), due: HACKATHON.problemsClose }
}

function problemStep(input: StepInput, phase: Phase): Omit<StepView, 'current'> {
  const window = problemWindow(input, phase)
  const due = window.due
  const mayWrite = window.open
  const toBank = phase.bankOpen ? (input.answered ? '/matches' : '/world') : null
  switch (input.state) {
    case 'none':
      return mayWrite
        ? { id: 'problem', state: 'todo', due, href: '/problem', action: 'write' }
        : { id: 'problem', state: 'missed', due, href: toBank, action: toBank ? 'pick' : null }
    case 'waiting':
      return { id: 'problem', state: 'waiting', due, href: '/problem', action: 'view' }
    case 'rejected':
      return mayWrite
        ? { id: 'problem', state: 'rejected', due, href: '/problem', action: 'fix' }
        : { id: 'problem', state: 'rejected', due, href: toBank, action: toBank ? 'pick' : null }
    case 'bank':
      return {
        id: 'problem',
        state: 'bank',
        due,
        href: input.researchDone ? null : '#research',
        action: input.researchDone ? null : 'add',
      }
    default:
      return { id: 'problem', state: input.state, due, href: '/problem', action: 'view' }
  }
}

function stageStep(stage: StageId, input: StepInput, phase: Phase): Omit<StepView, 'current'> {
  const due = dueOf(stage)
  const href = `/submit/${stage}`
  if (!mayBuild(input.state)) return { id: stage, state: 'locked', due, href: null, action: null }
  const open = !phase.locked[stage] || input.reopened.includes(stage)
  if (input.sentAt[stage])
    return { id: stage, state: 'done', due, href, action: open ? 'change' : 'view2' }
  if (!open) return { id: stage, state: 'missed', due, href, action: null }
  const started = fieldsOf(stage).some((field) => input.fields[field.id])
  return {
    id: stage,
    state: started ? 'started' : 'todo',
    due,
    href,
    action: started ? 'resume' : 'add',
  }
}

export function stepsFor(input: StepInput, phase: Phase): StepView[] {
  const steps = [
    problemStep(input, phase),
    ...STAGE_IDS.map((stage) => stageStep(stage, input, phase)),
  ]
  // The step to do now: the first one that still needs the founder.
  const needs = (step: Omit<StepView, 'current'>) =>
    step.action === 'write' ||
    step.action === 'fix' ||
    step.action === 'pick' ||
    step.action === 'add' ||
    step.action === 'resume'
  const now = steps.findIndex(needs)
  return steps.map((step, index) => ({ ...step, current: index === now }))
}

/** The deadline worth counting down to in the header: the next one still open for this founder. */
export function nextDue(steps: StepView[], phase: Phase): { step: StepId; at: string } | null {
  // A problem that is approved or picked is finished, like a submitted stage.
  const finished = ['done', 'approved', 'changes', 'bank']
  // A problem in the extra time is still open, though the window has shut.
  const live = (step: StepView) =>
    !phase.closed[step.id] ||
    (step.id === 'problem' && phase.extended && step.due === HACKATHON.problemsExtended)
  const open = steps.find(
    (step) => live(step) && step.state !== 'locked' && !finished.includes(step.state),
  )
  if (open) return { step: open.id, at: open.due }
  const fallback = (['problem', ...STAGE_IDS] as StepId[]).find((step) => !phase.closed[step])
  return fallback ? { step: fallback, at: dueOf(fallback) } : null
}
