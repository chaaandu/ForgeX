'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { archetypeOf, isCompleteTrial, scoreTrial, TRIAL } from '@/lib/archetype'
import { arrivalRank, logEvent } from '@/lib/data/events'
import { founderByEmail, LEVELS, levelPatch, patchFounder, type Founder } from '@/lib/data/founders'
import {
  entryOf,
  hasProblem,
  pickProblem,
  sendProblem,
  setResearch,
  setStage,
  type Entry,
} from '@/lib/data/hackathon'
import { isOpen, problemById } from '@/lib/data/problems'
import { mayUseBank } from '@/lib/bank-access'
import { clock, phaseAt, STAGE_IDS } from '@/lib/hackathon'
import { linkWarnings, type LinkHealth } from '@/lib/link-check'
import { cleanResearch, mayBuild, ownProblemSchema, RESEARCH_FIELDS } from '@/lib/own-problem'
import { problemIdSchema } from '@/lib/problem'
import { LINK_FIELDS, normaliseLink, type LinkField } from '@/lib/links'
import { list, profilePatchSchema } from '@/lib/profile'
import { getViewer } from '@/lib/session'
import {
  cleanField,
  fieldsOf,
  missingIn,
  requiredOf,
  type SubmissionField,
  type SubmissionFields,
} from '@/lib/submission'
import { worldSchema } from '@/lib/world'

/**
 * Everything a founder can change. Each action takes its identity from the
 * session and nowhere else, validates its input, checks the founder owns what
 * they are touching, writes, logs an event, and moves the level forward
 * (never back).
 */

export type Result<T = object> =
  ({ ok: true } & T) | { ok: false; error: ActionError; fields?: Record<string, string> }
export type ActionError = 'signed-out' | 'forbidden' | 'invalid' | 'closed' | 'locked' | 'failed'

async function me(): Promise<Founder | ActionError> {
  const viewer = await getViewer()
  if (!viewer) return 'signed-out'
  if (viewer.role !== 'founder') return 'forbidden'
  return (await founderByEmail(viewer.email)) ?? 'forbidden'
}

/** Nothing a founder does counts before the portal opens: it opens to all of them at once. */
async function guarded<T>(run: (founder: Founder) => Promise<Result<T>>): Promise<Result<T>> {
  const founder = await me()
  if (typeof founder === 'string') return { ok: false, error: founder }
  if (!phaseAt(clock()).open) return { ok: false, error: 'closed' }
  try {
    return await run(founder)
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

/** Level 1. The first arrival gets a number, by order of arrival. */
export async function arrive(): Promise<Result<{ number: number }>> {
  return guarded<{ number: number }>(async (founder) => {
    if (founder.number) {
      if (founder.level < LEVELS.arrived)
        await patchFounder(founder, levelPatch(founder, LEVELS.arrived))
      return { ok: true, number: founder.number }
    }
    await logEvent(founder.email, 'arrived')
    const number = (await arrivalRank(founder.email)) ?? 0
    await patchFounder(founder, { Number: String(number), ...levelPatch(founder, LEVELS.arrived) })
    return { ok: true, number }
  })
}

const trialSchema = z.record(z.string().max(40), z.string().max(40))

/**
 * Level 2, the quiz. The archetype is worked out here from the answers, never
 * taken from the browser, so a forged request cannot hand anyone an archetype
 * they did not sit for. One retake, for everyone.
 */
export async function saveTrial(raw: unknown): Promise<Result<{ archetype: string }>> {
  return guarded<{ archetype: string }>(async (founder) => {
    const parsed = trialSchema.safeParse(raw)
    if (!parsed.success || !isCompleteTrial(parsed.data)) return { ok: false, error: 'invalid' }
    const answers = Object.fromEntries(
      TRIAL.map((question) => [question.id, parsed.data[question.id] ?? '']),
    )
    const retake = Boolean(founder.archetype)
    if (retake && founder.retakesUsed >= 1) return { ok: false, error: 'locked' }
    const axes = scoreTrial(answers)
    const archetype = archetypeOf(axes)
    await patchFounder(founder, {
      Archetype: archetype,
      'Archetype source': retake ? 'retake' : 'quiz',
      Axes: JSON.stringify(axes),
      'Trial answers': JSON.stringify(answers),
      'Retakes used': String(founder.retakesUsed + (retake ? 1 : 0)),
      ...levelPatch(founder, LEVELS.archetype),
    })
    await logEvent(founder.email, 'archetype', {
      archetype,
      axes,
      retake,
      previous: founder.archetype,
    })
    return { ok: true, archetype }
  })
}

/** Level 2, for founders placed in Hackathon 1: that's me. */
export async function keepArchetype(): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (!founder.archetype) return { ok: false, error: 'invalid' }
    await patchFounder(founder, levelPatch(founder, LEVELS.archetype))
    await logEvent(founder.email, 'level', { level: LEVELS.archetype, kept: founder.archetype })
    return { ok: true }
  })
}

/** Level 3. Saves whatever changed; links are normalised here, never in the browser. */
export async function saveProfile(
  raw: unknown,
): Promise<Result<{ links: Partial<Record<LinkField, string>> }>> {
  return guarded<{ links: Partial<Record<LinkField, string>> }>(async (founder) => {
    const parsed = profilePatchSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const patch = parsed.data
    const fields: Record<string, string> = {}
    const links: Partial<Record<LinkField, string>> = {}
    for (const field of LINK_FIELDS) {
      const value = patch[field]
      if (value === undefined) continue
      if (!value.trim()) {
        links[field] = ''
        continue
      }
      const url = normaliseLink(field, value)
      if (url) links[field] = url
      else fields[field] = 'link'
    }
    if (Object.keys(fields).length) return { ok: false, error: 'invalid', fields }
    await patchFounder(founder, {
      ...(patch.bio !== undefined ? { Bio: patch.bio } : {}),
      ...(patch.city !== undefined ? { City: patch.city } : {}),
      ...(patch.degree !== undefined ? { Degree: patch.degree } : {}),
      ...(patch.languages ? { Languages: list.write(patch.languages) } : {}),
      ...(patch.goodAt ? { 'Good at': list.write(patch.goodAt) } : {}),
      ...(patch.wantToLearn ? { 'Want to learn': list.write(patch.wantToLearn) } : {}),
      ...(links.github !== undefined ? { GitHub: links.github } : {}),
      ...(links.linkedin !== undefined ? { LinkedIn: links.linkedin } : {}),
      ...(links.portfolio !== undefined ? { Portfolio: links.portfolio } : {}),
    })
    await logEvent(founder.email, 'profile', { fields: Object.keys(patch) })
    return { ok: true, links }
  })
}

/** Level 3 done. A GitHub and a LinkedIn are what we insist on; the one line about them is theirs to add or not. */
export async function finishProfile(): Promise<Result> {
  return guarded<object>(async (founder) => {
    const missing: Record<string, string> = {}
    if (!founder.profile.github.trim()) missing.github = 'required'
    if (!founder.profile.linkedin.trim()) missing.linkedin = 'required'
    if (Object.keys(missing).length) return { ok: false, error: 'invalid', fields: missing }
    await patchFounder(founder, levelPatch(founder, LEVELS.profile))
    await logEvent(founder.email, 'level', { level: LEVELS.profile })
    return { ok: true }
  })
}

/**
 * The three questions, for the bank. Asked only of a founder who ends up
 * picking from it. Nothing is saved until every answer is in.
 */
export async function saveWorld(raw: unknown): Promise<Result> {
  return guarded<object>(async (founder) => {
    const parsed = worldSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    if (founder.level < LEVELS.profile) return { ok: false, error: 'forbidden' }
    if (hasProblem(await entryOf(founder.email))) return { ok: false, error: 'locked' }
    await patchFounder(founder, {
      World: JSON.stringify(parsed.data),
      ...levelPatch(founder, LEVELS.world),
    })
    await logEvent(founder.email, 'world', parsed.data)
    return { ok: true }
  })
}

type Warnings = { warnings: Partial<Record<string, LinkHealth>> }

/** May this founder still send their own problem: the window is open, or the team reopened it for them. */
function maySendProblem(entry: Entry | null, now: Date) {
  return phaseAt(now).problemsOpen || Boolean(entry?.reopened.has('problem'))
}

/**
 * Sends their own problem for review, or sends it again. Unlimited, until the
 * window closes: a problem in review can be replaced, a rejected one rewritten.
 * Once approved, or once they pick from the bank, it is settled.
 */
export async function submitProblem(raw: unknown): Promise<Result<Warnings>> {
  return guarded<Warnings>(async (founder) => {
    if (founder.level < LEVELS.profile) return { ok: false, error: 'forbidden' }
    const parsed = ownProblemSchema.safeParse(raw)
    if (!parsed.success) {
      const fields = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          String(issue.path[0] ?? ''),
          issue.message === 'words' ? 'words' : 'required',
        ]),
      )
      return { ok: false, error: 'invalid', fields }
    }
    // Primary research is optional: empty stays empty, anything else must be a link.
    const primary = parsed.data.primary ? cleanResearch(parsed.data.primary) : ''
    const secondary = cleanResearch(parsed.data.secondary)
    if (primary === null || !secondary) {
      return {
        ok: false,
        error: 'invalid',
        fields: {
          ...(primary === null ? { primary: 'link' } : {}),
          ...(secondary ? {} : { secondary: 'link' }),
        },
      }
    }
    const now = clock()
    const entry = await entryOf(founder.email)
    if (!maySendProblem(entry, now)) return { ok: false, error: 'closed' }
    if (entry && mayBuild(entry.state)) return { ok: false, error: 'locked' }
    const input = { ...parsed.data, primary: primary ?? '', secondary }
    const version = await sendProblem(founder, entry, input, now)
    await patchFounder(founder, levelPatch(founder, LEVELS.picked))
    await logEvent(founder.email, 'problem', { version, title: input.title })
    revalidatePath('/team/reviews')
    return {
      ok: true,
      warnings: await linkWarnings({ ...(primary ? { primary } : {}), secondary }),
    }
  })
}

const linksSchema = z.partialRecord(z.enum(RESEARCH_FIELDS), z.string().max(400))

/** Checks research links as they are pasted, before anything is sent, so sharing can be fixed first. */
export async function checkResearch(raw: unknown): Promise<Result<Warnings & { bad: string[] }>> {
  return guarded<Warnings & { bad: string[] }>(async () => {
    const parsed = linksSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const clean: Partial<Record<string, string>> = {}
    const bad: string[] = []
    for (const [key, value] of Object.entries(parsed.data)) {
      if (!value?.trim()) continue
      const url = cleanResearch(value)
      if (url) clean[key] = url
      else bad.push(key)
    }
    return { ok: true, bad, warnings: await linkWarnings(clean) }
  })
}

/**
 * Picks a problem from the bank: only once the bank is open, and only for a
 * founder with no problem of their own approved or in review. Final the
 * moment it is made.
 */
export async function pickFromBank(raw: unknown): Promise<Result> {
  return guarded<object>(async (founder) => {
    const now = clock()
    const phase = phaseAt(now)
    if (!phase.bankOpen || phase.over) return { ok: false, error: 'closed' }
    if (founder.level < LEVELS.profile || !founder.world) return { ok: false, error: 'forbidden' }
    const id = problemIdSchema.safeParse(raw)
    if (!id.success) return { ok: false, error: 'invalid' }
    const problem = await problemById(id.data)
    if (!problem || !isOpen(problem)) return { ok: false, error: 'invalid' }
    const entry = await entryOf(founder.email)
    if (!mayUseBank(entry, phase)) return { ok: false, error: 'locked' }
    await pickProblem(founder, entry, { id: problem.id, title: problem.scope.task })
    await patchFounder(founder, levelPatch(founder, LEVELS.picked))
    await logEvent(founder.email, 'pick', {
      problemId: problem.id,
      replaces: entry?.state ?? 'none',
    })
    revalidatePath('/')
    return { ok: true }
  })
}

const researchSchema = z.object({ primary: z.string().max(400), secondary: z.string().max(400) })

/** The research behind a problem picked from the bank. It counts once the secondary link is in. */
export async function saveResearch(
  raw: unknown,
): Promise<Result<Warnings & { research: Record<string, string> }>> {
  return guarded<Warnings & { research: Record<string, string> }>(async (founder) => {
    const parsed = researchSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const entry = await entryOf(founder.email)
    if (!entry || entry.state !== 'bank') return { ok: false, error: 'forbidden' }
    const research = { ...entry.research }
    const bad: Record<string, string> = {}
    for (const field of RESEARCH_FIELDS) {
      const value = parsed.data[field].trim()
      if (!value) research[field] = ''
      else {
        const clean = cleanResearch(value)
        if (clean) research[field] = clean
        else bad[field] = 'link'
      }
    }
    await setResearch(founder, entry, research)
    await logEvent(founder.email, 'research', research)
    if (Object.keys(bad).length) return { ok: false, error: 'invalid', fields: bad }
    return { ok: true, research, warnings: await linkWarnings(research) }
  })
}

const stageSchema = z.object({
  stage: z.enum(STAGE_IDS),
  fields: z.partialRecord(z.string(), z.string().max(1200)),
})

type StageResult = Result<Warnings & { fields: SubmissionFields; sent: boolean }>

/**
 * Saves a stage's links, or submits the stage. Every field is cleaned here,
 * never in the browser. A save keeps whatever is usable and names what is not;
 * submitting needs every required field. Once submitted, a link can still be
 * changed until the deadline but a required one cannot be emptied. Each
 * deadline is hard, unless the team has reopened that stage for this founder.
 */
async function writeStage(raw: unknown, submit: boolean): Promise<StageResult> {
  return guarded<Warnings & { fields: SubmissionFields; sent: boolean }>(async (founder) => {
    const parsed = stageSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const { stage } = parsed.data
    const now = clock()
    const entry = await entryOf(founder.email)
    if (!entry || !mayBuild(entry.state)) return { ok: false, error: 'forbidden' }
    if (phaseAt(now).locked[stage] && !entry.reopened.has(stage))
      return { ok: false, error: 'locked' }

    const own = new Set<string>(fieldsOf(stage).map((field) => field.id))
    const required = new Set<string>(requiredOf(stage))
    const submitted = Boolean(entry.sentAt[stage])
    const fields: SubmissionFields = { ...entry.fields }
    const bad: Record<string, string> = {}
    const changed: Partial<Record<SubmissionField, string>> = {}
    for (const [id, value] of Object.entries(parsed.data.fields) as [SubmissionField, string][]) {
      if (!own.has(id)) continue
      const clean = cleanField(id, value)
      if (clean === null) bad[id] = 'link'
      else if (clean) {
        if (clean !== fields[id]) changed[id] = clean
        fields[id] = clean
      } else if (submitted && required.has(id)) bad[id] = 'required'
      else delete fields[id]
    }
    if (submit) {
      for (const id of missingIn(stage, fields)) bad[id] ??= 'required'
      if (Object.keys(bad).length) return { ok: false, error: 'invalid', fields: bad }
    }
    const first = submit && !submitted
    const dirty = JSON.stringify(fields) !== JSON.stringify(entry.fields)
    if (first || dirty) await setStage(founder, entry, stage, fields, first ? now : null)
    if (first) {
      if (stage === 'pitch') await patchFounder(founder, levelPatch(founder, LEVELS.sent))
      await logEvent(founder.email, 'submission', {
        stage,
        late: phaseAt(now).closed[stage],
        fields: Object.fromEntries([...own].map((id) => [id, fields[id as SubmissionField] ?? ''])),
      })
      // Their progress shows under the wall.
      revalidatePath('/')
    } else if (submitted && dirty) {
      await logEvent(founder.email, 'submission', { stage, changed })
    }
    if (Object.keys(bad).length) return { ok: false, error: 'invalid', fields: bad }
    return {
      ok: true,
      fields,
      sent: submit || submitted,
      warnings: await linkWarnings(changed),
    }
  })
}

export async function saveStage(raw: unknown): Promise<StageResult> {
  return writeStage(raw, false)
}

export async function submitStage(raw: unknown): Promise<StageResult> {
  return writeStage(raw, true)
}
