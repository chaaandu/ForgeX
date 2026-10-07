'use server'

import { z } from 'zod'
import { archetypeOf, isCompleteTrial, scoreTrial, TRIAL } from '@/lib/archetype'
import { arrivalRank, logEvent } from '@/lib/data/events'
import { founderByEmail, LEVELS, levelPatch, patchFounder, type Founder } from '@/lib/data/founders'
import { addPick, allPicks, allResponses, pickInputSchema, statusOf, withdraw } from '@/lib/data/picks'
import { problemById } from '@/lib/data/problems'
import { LINK_FIELDS, normaliseLink, type LinkField } from '@/lib/links'
import { list, profilePatchSchema } from '@/lib/profile'
import { getViewer } from '@/lib/session'
import { worldSchema } from '@/lib/world'

/**
 * Everything a founder can change. Each action takes its identity from the
 * session and nowhere else, validates its input, checks the founder owns what
 * they are touching, writes, logs an event, and moves the level forward
 * (never back).
 */

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: ActionError; fields?: Record<string, string> }
export type ActionError = 'signed-out' | 'forbidden' | 'invalid' | 'closed' | 'locked' | 'failed'

async function me(): Promise<Founder | ActionError> {
  const viewer = await getViewer()
  if (!viewer) return 'signed-out'
  if (viewer.role !== 'founder') return 'forbidden'
  return (await founderByEmail(viewer.email)) ?? 'forbidden'
}

function picksClosed(): boolean {
  const close = process.env.PICKS_CLOSE_AT
  return Boolean(close) && Date.now() > new Date(close as string).getTime()
}

async function guarded<T>(run: (founder: Founder) => Promise<Result<T>>): Promise<Result<T>> {
  const founder = await me()
  if (typeof founder === 'string') return { ok: false, error: founder }
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
      if (founder.level < LEVELS.arrived) await patchFounder(founder, levelPatch(founder, LEVELS.arrived))
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
    const answers = Object.fromEntries(TRIAL.map((question) => [question.id, parsed.data[question.id] ?? '']))
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
    await logEvent(founder.email, 'archetype', { archetype, axes, retake, previous: founder.archetype })
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
export async function saveProfile(raw: unknown): Promise<Result<{ links: Partial<Record<LinkField, string>> }>> {
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

/** Level 3 done. A one-line bio is the only thing we insist on. */
export async function finishProfile(): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (!founder.profile.bio.trim()) return { ok: false, error: 'invalid', fields: { bio: 'required' } }
    await patchFounder(founder, levelPatch(founder, LEVELS.profile))
    await logEvent(founder.email, 'level', { level: LEVELS.profile })
    return { ok: true }
  })
}

/** Level 4. Nothing is saved until every answer is in: half an answer would skew every match. */
export async function saveWorld(raw: unknown): Promise<Result> {
  return guarded<object>(async (founder) => {
    const parsed = worldSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    if (founder.level < LEVELS.profile) return { ok: false, error: 'forbidden' }
    await patchFounder(founder, { World: JSON.stringify(parsed.data), ...levelPatch(founder, LEVELS.world) })
    await logEvent(founder.email, 'world', parsed.data)
    return { ok: true }
  })
}

/**
 * Level 6. Sends a why for a problem from the bank or one the founder wrote.
 * A pick still waiting is withdrawn in favour of the new one. After Try
 * another, anything goes. After Needs a tweak, only a revision of the same
 * problem: the same bank problem, or their own problem reworded. Approved and
 * Talk to your mentor are settled.
 */
export async function submitPick(raw: unknown): Promise<Result<{ slug: string }>> {
  return guarded<{ slug: string }>(async (founder) => {
    if (picksClosed()) return { ok: false, error: 'closed' }
    if (founder.level < LEVELS.world) return { ok: false, error: 'forbidden' }
    const parsed = pickInputSchema.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    if (parsed.data.problemId) {
      const problem = await problemById(parsed.data.problemId)
      if (!problem || problem.status !== 'approved') return { ok: false, error: 'invalid' }
    }
    const [picks, responses] = await Promise.all([allPicks(), allResponses()])
    const mine = picks.filter((pick) => pick.email === founder.email && !pick.withdrawnAt)
    const latest = mine.at(-1)
    let revises: string | null = null
    if (latest) {
      const status = statusOf(latest, responses)
      if (status === 'tweak') {
        const same = latest.problemId
          ? parsed.data.problemId === latest.problemId
          : parsed.data.custom !== null
        if (!same) return { ok: false, error: 'locked' }
        revises = latest.id
      } else if (status !== 'another' && status !== 'waiting') {
        return { ok: false, error: 'locked' }
      }
      if (status === 'waiting') await withdraw(latest)
    }
    const id = await addPick(founder.email, parsed.data)
    await patchFounder(founder, { 'Pick ID': id, Status: 'waiting', ...levelPatch(founder, LEVELS.why) })
    await logEvent(founder.email, 'pick', {
      id,
      problemId: parsed.data.problemId,
      custom: Boolean(parsed.data.custom),
      revises,
    })
    return { ok: true, slug: founder.slug }
  })
}

/** Back out of a pick the team has not answered yet. */
export async function withdrawPick(): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (picksClosed()) return { ok: false, error: 'closed' }
    const [picks, responses] = await Promise.all([allPicks(), allResponses()])
    const latest = picks.filter((pick) => pick.email === founder.email && !pick.withdrawnAt).at(-1)
    if (!latest || statusOf(latest, responses) !== 'waiting') return { ok: false, error: 'locked' }
    await withdraw(latest)
    await patchFounder(founder, { 'Pick ID': '', Status: '' })
    await logEvent(founder.email, 'withdraw', { id: latest.id })
    return { ok: true }
  })
}

