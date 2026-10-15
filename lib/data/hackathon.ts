import 'server-only'
import { STAGE_IDS, type StageId, type StepId } from '@/lib/hackathon'
import {
  DECISIONS,
  type Decision,
  type OwnProblem,
  type ProblemState,
  type ResearchField,
} from '@/lib/own-problem'
import { problemIdSchema } from '@/lib/problem'
import { TABS, type Header } from '@/lib/sheet/tabs'
import { EVENT_WORDS, STATUS_WORDS } from '@/lib/status-words'
import { appendRows, rows, updateRow } from '@/lib/store'
import {
  partsOf,
  progressOf,
  SUBMISSION_IDS,
  type SubmissionField,
  type SubmissionFields,
} from '@/lib/submission'
import { INDUSTRIES, INDUSTRY_IDS } from '@/lib/taxonomy'

/**
 * The hackathon in the Sheet, in two tabs a person can read. The Hackathon
 * tab has one row a founder, written in place by that founder and by their
 * reviewer: where they stand and every link they have submitted. The Problem
 * history tab keeps every problem a founder sent and every answer it got, one
 * row each, never changed: it is where a problem's state comes from, so
 * sorting it by hand can never confuse the site.
 */

/** One problem as a founder sent it. */
export type Version = OwnProblem & { version: number; time: string }

/** One answer from a reviewer, to one version. */
export type Review = {
  version: number
  time: string
  decision: Decision
  by: string
  notes: string
}

export type Entry = {
  /** Their row in the Hackathon tab, and in the Submissions tab (0 until they have one). */
  row: number
  subRow: number
  email: string
  name: string
  /** Their group, reviewer and POC at Mesa, by name: the team writes all three. */
  group: string
  reviewer: string
  poc: string
  /** A problem picked from the bank, by its number. */
  problemId: string | null
  /** What the Problem cell says: the headline a person reads in the Sheet. */
  title: string
  research: Record<ResearchField, string>
  fields: SubmissionFields
  /** When each stage was submitted, as a stamp, or empty. */
  sentAt: Record<StageId, string>
  /** Deadlines the team has opened again for this founder, by step. */
  reopened: Set<StepId>
  versions: Version[]
  reviews: Review[]
  state: ProblemState
  /** The newest version they sent, and the answer to it if there is one. */
  latest: Version | null
  answer: Review | null
}

const STEP_WORDS: Record<StepId, string> = {
  problem: 'Problem',
  scope: 'MVP scope',
  prototype: 'Prototype',
  launch: 'Launch',
  pitch: 'Pitch',
}

/** Each field has a column of its own, so the tab reads as a list of links. */
const COLUMN: Record<SubmissionField, Header<'submissions'>> = {
  scope: 'MVP scope',
  github: 'GitHub',
  prototype: 'Prototype',
  proof: 'Proof of progress',
  linkedin: 'LinkedIn post',
  linkedinMore: 'More posts',
  live: 'Live link',
  docs: 'Documentation',
  deck: 'Pitch deck',
  video: 'Loom',
}

const SENT_AT: Record<StageId, Header<'submissions'>> = {
  scope: 'Scope at',
  prototype: 'Prototype at',
  launch: 'Launch at',
  pitch: 'Pitch at',
}

/** `2026-10-23 12:41:05` in India time: readable in the Sheet, and it sorts as text. */
export function stamp(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}

export { stampToIso } from '@/lib/stamp'

/** The industry as a person reads it, and back again. */
export const industryWord = (id: string) =>
  INDUSTRIES.find((item) => item.id === id)?.short ?? 'Other'
const industryId = (word: string) => {
  const key = word.trim().toLowerCase()
  return (
    INDUSTRIES.find((item) => item.short.toLowerCase() === key || item.id === key)?.id ?? 'other'
  )
}

const decisionOf = (word: string): Decision | null => {
  const key = word.trim().toLowerCase()
  if (key === EVENT_WORDS.approved.toLowerCase()) return 'approved'
  if (key === EVENT_WORDS.changes.toLowerCase()) return 'changes'
  if (key === EVENT_WORDS.rejected.toLowerCase()) return 'rejected'
  return null
}

/**
 * Where a problem stands, from its history alone: the newest version, and the
 * newest answer to that version. An answer to an older version is history,
 * shown but not counted.
 */
export function stateOf(input: {
  problemId: string | null
  versions: Version[]
  reviews: Review[]
}): { state: ProblemState; latest: Version | null; answer: Review | null } {
  if (input.problemId) return { state: 'bank', latest: null, answer: null }
  const latest = input.versions.reduce<Version | null>(
    (best, item) => (!best || item.version > best.version ? item : best),
    null,
  )
  if (!latest) return { state: 'none', latest: null, answer: null }
  const answer =
    input.reviews
      .filter((item) => item.version === latest.version)
      .sort((a, b) => a.time.localeCompare(b.time))
      .at(-1) ?? null
  return { state: answer ? answer.decision : 'waiting', latest, answer }
}

export const hasProblem = (entry: Entry | null | undefined) =>
  Boolean(
    entry && (entry.state === 'approved' || entry.state === 'changes' || entry.state === 'bank'),
  )

/** Research is in for a bank pick once both links are. Their own problem carries it when sent. */
export const researchDone = (entry: Entry) =>
  Boolean(entry.research.primary && entry.research.secondary)

function progressInput(entry: Entry) {
  return {
    sent: entry.state !== 'none',
    approved:
      entry.state === 'approved' ||
      entry.state === 'changes' ||
      (entry.state === 'bank' && researchDone(entry)),
    submitted: {
      scope: Boolean(entry.sentAt.scope),
      prototype: Boolean(entry.sentAt.prototype),
      launch: Boolean(entry.sentAt.launch),
      pitch: Boolean(entry.sentAt.pitch),
    },
  }
}

export const progress = (entry: Entry): number => progressOf(progressInput(entry))

/** The same, part by part, for the track on a founder's home and page. */
export const progressParts = (entry: Entry) => partsOf(progressInput(entry))

/** The one word a person filtering the Sheet needs: how far this founder has got. */
export function statusWord(entry: Entry): string {
  if (entry.sentAt.pitch) return STATUS_WORDS.pitch
  if (entry.sentAt.launch) return STATUS_WORDS.launch
  if (entry.sentAt.prototype) return STATUS_WORDS.prototype
  if (entry.sentAt.scope) return STATUS_WORDS.scope
  return STATUS_WORDS[entry.state]
}

async function readHistory() {
  const versions = new Map<string, Version[]>()
  const reviews = new Map<string, Review[]>()
  for (const { cells } of await rows('history')) {
    const email = cells.Email.trim().toLowerCase()
    const version = Number(cells.Version) || 0
    if (!email || !version) continue
    const event = cells.Event.trim()
    if (event.toLowerCase() === EVENT_WORDS.submitted.toLowerCase()) {
      const list = versions.get(email) ?? []
      list.push({
        version,
        time: cells.Time.trim(),
        industry: industryId(cells.Industry) as OwnProblem['industry'],
        industryOther:
          industryId(cells.Industry) === 'other' && cells.Industry.trim() !== 'Other'
            ? cells.Industry.trim()
            : '',
        title: cells.Title,
        person: cells.Person,
        problem: cells.Problem,
        promise: cells.Promise,
        why: cells['Why you'],
        plan: cells.Plan,
        primary: cells['Primary research'].trim(),
        secondary: cells['Secondary research'].trim(),
      })
      versions.set(email, list)
      continue
    }
    const decision = decisionOf(event)
    if (!decision) continue
    const list = reviews.get(email) ?? []
    list.push({
      version,
      time: cells.Time.trim(),
      decision,
      by: cells.By.trim(),
      notes: cells.Notes,
    })
    reviews.set(email, list)
  }
  return { versions, reviews }
}

export async function allEntries(): Promise<Entry[]> {
  const [grid, handedIn, history] = await Promise.all([
    rows('hackathon'),
    rows('submissions'),
    readHistory(),
  ])
  const submitted = new Map(
    handedIn.map((item) => [item.cells.Email.trim().toLowerCase(), item] as const),
  )
  return grid.flatMap(({ row, cells }) => {
    const email = cells.Email.trim().toLowerCase()
    if (!email) return []
    const sub = submitted.get(email)
    const own = (header: Header<'submissions'>) => sub?.cells[header].trim() ?? ''
    const problemId = problemIdSchema.safeParse(cells['Problem no.'].trim())
    const fields: SubmissionFields = {}
    for (const id of SUBMISSION_IDS) {
      const value = own(COLUMN[id])
      if (value) fields[id] = value
    }
    const versions = (history.versions.get(email) ?? []).sort((a, b) => a.version - b.version)
    const reviews = (history.reviews.get(email) ?? []).sort((a, b) => a.time.localeCompare(b.time))
    const picked = problemId.success ? problemId.data : null
    const reopened = new Set<StepId>(
      (Object.keys(STEP_WORDS) as StepId[]).filter((step) =>
        cells.Reopened.toLowerCase().includes(STEP_WORDS[step].toLowerCase()),
      ),
    )
    return [
      {
        row,
        subRow: sub?.row ?? 0,
        email,
        name: cells.Name.trim(),
        reviewer: cells.Reviewer.trim(),
        group: cells.Group.trim(),
        poc: cells.POC.trim(),
        problemId: picked,
        title: cells.Problem.trim(),
        research: { primary: own('Primary research'), secondary: own('Secondary research') },
        fields,
        sentAt: {
          scope: own('Scope at'),
          prototype: own('Prototype at'),
          launch: own('Launch at'),
          pitch: own('Pitch at'),
        },
        reopened,
        versions,
        reviews,
        ...stateOf({ problemId: picked, versions, reviews }),
      } satisfies Entry,
    ]
  })
}

/** Every founder's row, by email. */
export async function entries(): Promise<Map<string, Entry>> {
  return new Map((await allEntries()).map((entry) => [entry.email, entry]))
}

export async function entryOf(email: string): Promise<Entry | null> {
  return (await entries()).get(email.trim().toLowerCase()) ?? null
}

/** How many founders are building each bank problem right now. */
export function countByProblem(all: Iterable<Entry>): Map<string, number> {
  const counts = new Map<string, number>()
  for (const entry of all) {
    if (entry.problemId) counts.set(entry.problemId, (counts.get(entry.problemId) ?? 0) + 1)
  }
  return counts
}

type Main = Partial<Record<Header<'hackathon'>, string>>
type Handed = Partial<Record<Header<'submissions'>, string>>
type Cells = Main & Handed
type Who = { email: string; name: string }

const MAIN = new Set<string>(TABS.hackathon.headers)
const HANDED = new Set<string>(TABS.submissions.headers)

/**
 * Writes some of a founder's cells, each to the tab it belongs to, and the
 * Status and Progress that follow from them. The problem's name goes to both
 * tabs, so each reads on its own. Starts a row in a tab that does not list
 * them yet.
 */
async function write(who: Who, entry: Entry | null, cells: Cells, next: Entry | null) {
  const summary: Main = next ? { Status: statusWord(next), Progress: `${progress(next)}%` } : {}
  const pick = (keep: Set<string>) =>
    Object.fromEntries(Object.entries(cells).filter(([key]) => keep.has(key)))
  const main: Main = { ...pick(MAIN), ...summary }
  const handed: Handed = pick(HANDED)
  if (entry) await updateRow('hackathon', entry.row, main)
  else await appendRows('hackathon', [{ Name: who.name, Email: who.email, ...main }])
  if (!Object.keys(handed).length) return
  if (entry?.subRow) await updateRow('submissions', entry.subRow, handed)
  else
    await appendRows('submissions', [
      { Name: who.name, Email: who.email, Group: entry?.group ?? '', ...handed },
    ])
}

/** What an entry looks like once some of it changes, for the summary cells. */
const blank = (who: Who): Entry => ({
  row: 0,
  subRow: 0,
  email: who.email,
  name: who.name,
  reviewer: '',
  group: '',
  poc: '',
  problemId: null,
  title: '',
  research: { primary: '', secondary: '' },
  fields: {},
  sentAt: { scope: '', prototype: '', launch: '', pitch: '' },
  reopened: new Set(),
  versions: [],
  reviews: [],
  state: 'none',
  latest: null,
  answer: null,
})

/** A founder sends their own problem, or sends it again: a new version, waiting for review. */
export async function sendProblem(who: Who, entry: Entry | null, input: OwnProblem, at: Date) {
  const version = (entry?.versions.at(-1)?.version ?? 0) + 1
  await appendRows('history', [
    {
      Time: stamp(at),
      Name: who.name,
      Email: who.email,
      Version: String(version),
      Event: EVENT_WORDS.submitted,
      By: who.name,
      // Their own word when none of ours fits: Sports, not Other.
      Industry:
        input.industry === 'other' && input.industryOther
          ? input.industryOther
          : industryWord(input.industry),
      Title: input.title,
      Person: input.person,
      Problem: input.problem,
      Promise: input.promise,
      'Why you': input.why,
      Plan: input.plan,
      'Primary research': input.primary,
      'Secondary research': input.secondary,
    },
  ])
  const base = entry ?? blank(who)
  const next: Entry = {
    ...base,
    research: { primary: input.primary, secondary: input.secondary },
    state: 'waiting',
  }
  await write(
    who,
    entry,
    {
      Problem: input.title,
      'Primary research': input.primary,
      'Secondary research': input.secondary,
    },
    next,
  )
  return version
}

/** A reviewer answers one version of a founder's problem. */
export async function answerProblem(
  entry: Entry,
  input: { version: number; decision: Decision; by: string; notes: string },
  at: Date,
) {
  await appendRows('history', [
    {
      Time: stamp(at),
      Name: entry.name,
      Email: entry.email,
      Version: String(input.version),
      Event: EVENT_WORDS[input.decision],
      By: input.by,
      Notes: input.notes,
    },
  ])
  // Only an answer to the newest version moves where the founder stands.
  const counts = entry.latest?.version === input.version
  if (counts) {
    await write(entry, entry, {}, { ...entry, state: input.decision })
  }
}

/** A founder picks a problem from the bank. Final, like any pick. */
export async function pickProblem(
  who: Who,
  entry: Entry | null,
  input: { id: string; title: string },
) {
  const base = entry ?? blank(who)
  await write(
    who,
    entry,
    // Research sent with their own problem stays in its history; this one needs its own.
    {
      Problem: input.title,
      'Problem no.': input.id,
      'Primary research': '',
      'Secondary research': '',
    },
    { ...base, problemId: input.id, state: 'bank', research: { primary: '', secondary: '' } },
  )
}

/** The research behind a bank pick, or a correction to it. */
export async function setResearch(who: Who, entry: Entry, research: Record<ResearchField, string>) {
  await write(
    who,
    entry,
    { 'Primary research': research.primary, 'Secondary research': research.secondary },
    { ...entry, research },
  )
}

/** Saves a stage's links. With `submit`, also stamps when the stage was submitted. */
export async function setStage(
  who: Who,
  entry: Entry,
  stage: StageId,
  fields: SubmissionFields,
  submit: Date | null,
) {
  const cells: Cells = Object.fromEntries(
    SUBMISSION_IDS.map((id) => [COLUMN[id], fields[id] ?? '']),
  )
  const sentAt = { ...entry.sentAt }
  if (submit) {
    cells[SENT_AT[stage]] = stamp(submit)
    sentAt[stage] = stamp(submit)
  }
  await write(who, entry, cells, { ...entry, fields, sentAt })
}

/** Opens or closes one deadline again for one founder. The cell lists the steps in words. */
export async function setReopened(entry: Entry, step: StepId, open: boolean) {
  const next = new Set(entry.reopened)
  if (open) next.add(step)
  else next.delete(step)
  const words = (['problem', ...STAGE_IDS] as StepId[])
    .filter((item) => next.has(item))
    .map((item) => STEP_WORDS[item])
  await updateRow('hackathon', entry.row, { Reopened: words.join(', ') })
}

export const decisionWord = (decision: Decision) => EVENT_WORDS[decision]
export { DECISIONS, INDUSTRY_IDS }

/** One line of the Problem history tab, as the console's history page shows it. */
export type HistoryLine = {
  /** Where it sits in the tab: the later of two lines in the same second. */
  order: number
  time: string
  name: string
  email: string
  version: number
  event: string
  by: string
  title: string
  notes: string
}

/** Every line of the Problem history tab, newest first. */
export async function historyLines(): Promise<HistoryLine[]> {
  return (await rows('history'))
    .map(({ cells }, order) => ({
      order,
      time: cells.Time.trim(),
      name: cells.Name.trim(),
      email: cells.Email.trim().toLowerCase(),
      version: Number(cells.Version) || 0,
      event: cells.Event.trim(),
      by: cells.By.trim(),
      title: cells.Title.trim(),
      notes: cells.Notes.trim(),
    }))
    .sort((a, b) => b.time.localeCompare(a.time) || b.order - a.order)
}
