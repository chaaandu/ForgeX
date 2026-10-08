/**
 * Archetypes: three families from Hackathon 1, each split in two.
 *
 * Hackathon 1 scored every founder on three instincts — understand,
 * experiment, structure — and named them by the strongest. That family is
 * kept exactly, with its portrait. The second-strongest instinct splits each
 * family in two, which gives six archetypes without inventing a new test:
 * every one of the 110 placed founders maps from the scores they already have.
 *
 * The rubric below was recovered, not invented. Its weights reproduce every
 * Hackathon 1 founder's axis scores and class exactly, and
 * `pnpm test:archetype` fails if that ever drifts. Each option keeps the exact
 * wording of the original form as `source`, which is what that check matches
 * on; what a founder reads lives in `content/copy.ts`.
 */

export const AXES = ['u', 'e', 's'] as const
export type Axis = (typeof AXES)[number]
export type Scores = Record<Axis, number>

export const FAMILY_IDS = ['cartographer', 'alchemist', 'architect'] as const
export type FamilyId = (typeof FAMILY_IDS)[number]

export const ARCHETYPE_IDS = [
  'surveyor',
  'scout',
  'inventor',
  'tinkerer',
  'strategist',
  'builder',
] as const
export type ArchetypeId = (typeof ARCHETYPE_IDS)[number]

export type Family = {
  id: FamilyId
  axis: Axis
  /** Full-body portrait. The three that exist; every archetype in a family shares it. */
  art: string
  /** The same portrait cropped to head and shoulders, for badges. */
  head: string
  /** The family's ground and its light. */
  ground: string
  tint: string
}

export const FAMILIES: Record<FamilyId, Family> = {
  cartographer: {
    id: 'cartographer',
    axis: 'u',
    art: '/art/cartographer.webp',
    head: '/art/heads/cartographer.webp',
    ground: '#052624',
    tint: '#19B3B0',
  },
  alchemist: {
    id: 'alchemist',
    axis: 'e',
    art: '/art/alchemist.webp',
    head: '/art/heads/alchemist.webp',
    ground: '#2E1A08',
    tint: '#F0A526',
  },
  architect: {
    id: 'architect',
    axis: 's',
    art: '/art/architect.webp',
    head: '/art/heads/architect.webp',
    ground: '#071A3D',
    tint: '#3B82F6',
  },
}

export type Archetype = {
  id: ArchetypeId
  family: FamilyId
  /** The instinct that leads, then the one that follows. */
  lead: Axis
  then: Axis
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  surveyor: { id: 'surveyor', family: 'cartographer', lead: 'u', then: 's' },
  scout: { id: 'scout', family: 'cartographer', lead: 'u', then: 'e' },
  inventor: { id: 'inventor', family: 'alchemist', lead: 'e', then: 'u' },
  tinkerer: { id: 'tinkerer', family: 'alchemist', lead: 'e', then: 's' },
  strategist: { id: 'strategist', family: 'architect', lead: 's', then: 'u' },
  builder: { id: 'builder', family: 'architect', lead: 's', then: 'e' },
}

/** Ties break this way, recovered from the six tied founders in the source. */
const TIE_ORDER: Axis[] = ['e', 'u', 's']

export const FAMILY_OF_AXIS: Record<Axis, FamilyId> = {
  u: 'cartographer',
  e: 'alchemist',
  s: 'architect',
}

/** The axes, strongest first, ties broken the way the cohort's were. */
export function rank(scores: Scores): [Axis, Axis, Axis] {
  const sorted = [...TIE_ORDER].sort((a, b) => scores[b] - scores[a])
  return sorted as [Axis, Axis, Axis]
}

/** The Hackathon 1 class: the strongest instinct alone. */
export function classify(scores: Scores): FamilyId {
  return FAMILY_OF_AXIS[rank(scores)[0]]
}

/** The archetype: the strongest instinct, then the next. */
export function archetypeOf(scores: Scores): ArchetypeId {
  const [lead, then] = rank(scores)
  const found = ARCHETYPE_IDS.find(
    (id) => ARCHETYPES[id].lead === lead && ARCHETYPES[id].then === then,
  )
  if (!found) throw new Error(`no archetype for ${lead}→${then}`)
  return found
}

/** How far clear the winner was. The original calls this the margin. */
export function marginOf(scores: Scores): number {
  const sorted = AXES.map((axis) => scores[axis]).sort((a, b) => b - a)
  return (sorted[0] ?? 0) - (sorted[1] ?? 0)
}

export type TrialOption = { key: string; source: string; u: number; e: number; s: number }
export type TrialQuestion = { id: string; options: TrialOption[] }

/** The seven that decide the class, scored exactly as Hackathon 1 scored them. */
export const TRIAL: TrialQuestion[] = [
  {
    id: 'new-city',
    options: [
      { key: 'read', source: 'Read up on it before I go', u: 2, e: 0, s: 0 },
      { key: 'walk', source: 'Walk out and see what I find', u: 0, e: 2, s: 0 },
      { key: 'plan', source: 'Plan the three days out first', u: 1, e: 0, s: 2 },
    ],
  },
  {
    id: 'new-tool',
    options: [
      { key: 'read', source: 'I read up on how it worked first', u: 3, e: 0, s: 0 },
      { key: 'use', source: 'I opened it and used it till it clicked', u: 1, e: 3, s: 0 },
      { key: 'tutorial', source: 'I followed a tutorial through', u: 0, e: 0, s: 3 },
    ],
  },
  {
    id: 'first-prompt',
    options: [
      { key: 'everything', source: "Here's everything. What do you think?", u: 0, e: 3, s: 0 },
      { key: 'steps', source: 'Break this into steps', u: 0, e: 0, s: 3 },
      { key: 'explain', source: 'Explain this to me first', u: 3, e: 0, s: 0 },
    ],
  },
  {
    id: 'in-a-team',
    options: [
      { key: 'agree', source: "Making sure we all agree on what we're building", u: 2, e: 0, s: 0 },
      { key: 'rough', source: 'Making the first rough version', u: 0, e: 2, s: 0 },
      { key: 'split', source: 'Working out who does which part', u: 0, e: 0, s: 2 },
    ],
  },
  {
    id: 'bad-instructions',
    options: [
      { key: 'why', source: "Work out why they're wrong", u: 2, e: 0, s: 0 },
      { key: 'own', source: 'Try it my own way first', u: 0, e: 2, s: 0 },
      { key: 'follow', source: 'Follow them, then say something', u: 0, e: 0, s: 2 },
    ],
  },
  {
    id: 'it-broke',
    options: [
      { key: 'changed', source: 'Work out what changed since it last worked', u: 3, e: 0, s: 0 },
      { key: 'tweak', source: 'Start changing things until it works again', u: 0, e: 3, s: 0 },
      { key: 'rollback', source: 'Go back to the last version that worked', u: 0, e: 1, s: 3 },
    ],
  },
  {
    id: 'better-way',
    options: [
      { key: 'finish', source: "Finish the part I'm on, then decide", u: 0, e: 0, s: 3 },
      { key: 'think', source: 'Stop and think the new way through', u: 3, e: 0, s: 0 },
      { key: 'scrap', source: 'Scrap what I have and build it the new way', u: 0, e: 3, s: 0 },
    ],
  },
]

/** The most any one axis can reach, so a meter has something to fill towards. */
export const TRIAL_MAX: Scores = TRIAL.reduce(
  (total, question) => {
    for (const axis of AXES)
      total[axis] += Math.max(...question.options.map((option) => option[axis]))
    return total
  },
  { u: 0, e: 0, s: 0 },
)

/** Answers are question ID to option key. Unknown keys score nothing. */
export function scoreTrial(answers: Record<string, string>): Scores {
  const scores: Scores = { u: 0, e: 0, s: 0 }
  for (const question of TRIAL) {
    const chosen = question.options.find((option) => option.key === answers[question.id])
    if (!chosen) continue
    for (const axis of AXES) scores[axis] += chosen[axis]
  }
  return scores
}

/** True only if every question has a valid answer. A partial trial places nobody. */
export function isCompleteTrial(answers: Record<string, string>): boolean {
  return TRIAL.every((question) =>
    question.options.some((option) => option.key === answers[question.id]),
  )
}

/**
 * The original form's wording, mapped to option keys, for the check against the
 * Hackathon 1 export. Curly quotes in the source are normalised away.
 */
export function keyForSource(questionId: string, text: string): string | undefined {
  const clean = (value: string) => value.replace(/[“”"]/g, '').trim().toLowerCase()
  const question = TRIAL.find((item) => item.id === questionId)
  return question?.options.find((option) => clean(option.source) === clean(text))?.key
}
