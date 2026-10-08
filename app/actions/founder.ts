'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { archetypeOf, isCompleteTrial, scoreTrial, TRIAL } from '@/lib/archetype'
import { arrivalRank, logEvent } from '@/lib/data/events'
import { founderByEmail, LEVELS, levelPatch, patchFounder, type Founder } from '@/lib/data/founders'
import { addResearch, readyToSend, researchOf, researchSchema } from '@/lib/data/research'
import { allReviews, fixStepId } from '@/lib/data/reviews'
import { addTick } from '@/lib/data/steps'
import { addSubmission, historyOf } from '@/lib/data/submissions'
import { cleanStepValue, cleanStopValue, stepComplete, stopFieldComplete } from '@/lib/inputs'
import { LINK_FIELDS, normaliseLink, normaliseWorkLink, type LinkField } from '@/lib/links'
import { planNow, RESEARCH_DAYS, STOP_NUMBERS, STOPS } from '@/lib/plan'
import { list, profilePatchSchema } from '@/lib/profile'
import { getViewer } from '@/lib/session'
import { stepById, stopFieldsFor, stopStepId } from '@/lib/steps'
import { phaseOpen, stopState } from '@/lib/stops'
import { trackOf } from '@/lib/tracks'

/**
 * Everything a founder can change. Each action takes its identity from the
 * session and nowhere else, validates its input, checks the founder owns what
 * they are touching, writes, logs an event, and moves the level forward
 * (never back).
 */

export type Result<T = object> =
  ({ ok: true } & T) | { ok: false; error: ActionError; fields?: Record<string, string> }
export type ActionError = 'signed-out' | 'forbidden' | 'invalid' | 'locked' | 'order' | 'failed'

async function me(): Promise<Founder | ActionError> {
  const viewer = await getViewer()
  if (!viewer) return 'signed-out'
  if (viewer.role !== 'founder') return 'forbidden'
  return (await founderByEmail(viewer.email)) ?? 'forbidden'
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

/** Level 3 done. A one-line bio, GitHub and LinkedIn are what we insist on. */
export async function finishProfile(): Promise<Result> {
  return guarded<object>(async (founder) => {
    const missing: Record<string, string> = {}
    if (!founder.profile.bio.trim()) missing.bio = 'required'
    if (!founder.profile.github.trim()) missing.github = 'required'
    if (!founder.profile.linkedin.trim()) missing.linkedin = 'required'
    if (Object.keys(missing).length) return { ok: false, error: 'invalid', fields: missing }
    await patchFounder(founder, levelPatch(founder, LEVELS.profile))
    await logEvent(founder.email, 'level', { level: LEVELS.profile })
    return { ok: true }
  })
}

/** Level 4. They've taken the challenge: the 3 weeks open, starting with research. */
export async function startResearch(): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (founder.level < LEVELS.profile) return { ok: false, error: 'forbidden' }
    await patchFounder(founder, levelPatch(founder, LEVELS.challenge))
    await logEvent(founder.email, 'level', { level: LEVELS.challenge })
    return { ok: true }
  })
}

const researchInput = z.object({ research: researchSchema, send: z.boolean() })

/**
 * Saves their research, as a draft or sent. Sending needs who it's for, the
 * problem, their research doc and their mentor's yes; the team approves
 * nothing here. The first send opens the plan, and it stays editable.
 */
export async function saveResearch(raw: unknown): Promise<Result<{ sent: boolean }>> {
  return guarded<{ sent: boolean }>(async (founder) => {
    if (founder.level < LEVELS.challenge) return { ok: false, error: 'forbidden' }
    const parsed = researchInput.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const doc = parsed.data.research.doc
      ? normaliseWorkLink('research', parsed.data.research.doc)
      : ''
    if (doc === null) return { ok: false, error: 'invalid', fields: { doc: 'link' } }
    const research = { ...parsed.data.research, doc }
    const before = await researchOf(founder.email)
    const sent = parsed.data.send || Boolean(before?.sent)
    if (sent && !readyToSend(research)) return { ok: false, error: 'invalid' }
    await addResearch(founder.email, research, sent)
    if (sent) await addTick(founder.email, 'r-send', true, '')
    await patchFounder(founder, sent ? levelPatch(founder, LEVELS.research) : {})
    await logEvent(founder.email, 'research', { sent, first: sent && !before?.sent })
    // Sending puts them on the landing, under the wall.
    if (sent) revalidatePath('/')
    return { ok: true, sent }
  })
}

/** Founders who have seen the challenge: the 3 weeks are theirs. */
function inPlan(founder: Founder): boolean {
  return founder.level >= LEVELS.challenge
}

/** Sending research unlocks the build days; until then only research steps can move. */
async function researchSent(founder: Founder): Promise<boolean> {
  return Boolean((await researchOf(founder.email))?.sent)
}

const tickInput = z.object({
  stepId: z.string().min(1).max(80),
  done: z.boolean(),
  value: z.string().max(2000),
})

/**
 * Ticks or unticks a step, and saves the link or answer it asks for. A step
 * from another track's plan, or a fix from someone else's review, is refused.
 */
export async function tickStep(raw: unknown): Promise<Result<{ value: string }>> {
  return guarded<{ value: string }>(async (founder) => {
    if (!inPlan(founder)) return { ok: false, error: 'forbidden' }
    const parsed = tickInput.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const { stepId, done } = parsed.data
    if (stepId.startsWith('fix:')) {
      // A fix from a review of their own stop: fix:<review id>:<index>.
      const [, reviewId, index] = stepId.split(':')
      const review = (await allReviews()).find(
        (item) => item.id === reviewId && item.email === founder.email && item.stop !== 'checkin',
      )
      if (!review || stepId !== fixStepId(review.id, Number(index)) || !review.fixes[Number(index)])
        return { ok: false, error: 'forbidden' }
      await addTick(founder.email, stepId, done, '')
      await logEvent(founder.email, 'step', { stepId, done })
      return { ok: true, value: '' }
    }
    const step = stepById(stepId)
    const track = trackOf(founder.track)
    if (!step || !step.tracks.includes(track)) return { ok: false, error: 'forbidden' }
    if (step.input?.kind === 'stop' || step.input?.kind === 'research')
      return { ok: false, error: 'invalid' }
    if (step.day > RESEARCH_DAYS[1] && !(await researchSent(founder)))
      return { ok: false, error: 'locked' }
    const value = cleanStepValue(step.input, parsed.data.value)
    if (value === null) return { ok: false, error: 'invalid', fields: { value: 'format' } }
    if (done && !stepComplete(step.input, value))
      return { ok: false, error: 'invalid', fields: { value: 'required' } }
    await addTick(founder.email, stepId, done, value)
    await logEvent(founder.email, 'step', { stepId, done, value })
    return { ok: true, value }
  })
}

const stopInput = z.object({
  stop: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  fields: z.record(z.string().max(40), z.string().max(2000)),
  send: z.boolean(),
})

/**
 * Saves a stop as a draft, or sends it. Until 6 pm it can change as often as
 * they like. After 6 pm a sent stop is locked, and one never sent can still
 * be sent once, marked late.
 */
export async function saveStop(
  raw: unknown,
): Promise<Result<{ late: boolean; fields: Record<string, string> }>> {
  return guarded<{ late: boolean; fields: Record<string, string> }>(async (founder) => {
    if (!inPlan(founder) || !(await researchSent(founder))) return { ok: false, error: 'forbidden' }
    const parsed = stopInput.safeParse(raw)
    if (!parsed.success || !STOP_NUMBERS.includes(parsed.data.stop))
      return { ok: false, error: 'invalid' }
    const { stop, send } = parsed.data
    const now = planNow()
    // Phases go in order: the one before must have been sent first.
    if (stop > 1) {
      const before = await historyOf(founder.email, (stop - 1) as 1 | 2)
      const sent = new Set(before.some((item) => item.status === 'sent') ? [stop - 1] : [])
      if (!phaseOpen(stop, sent)) return { ok: false, error: 'order' }
    }
    const history = await historyOf(founder.email, stop)
    const state = stopState(history, STOPS[stop].closes, now)
    if (state.locked) return { ok: false, error: 'locked' }
    // Once sent, every save is a resend: there is no draft behind a sent stop.
    const sending = send || state.sent
    const fields: Record<string, string> = {}
    const problems: Record<string, string> = {}
    for (const field of stopFieldsFor(trackOf(founder.track), stop)) {
      const value = cleanStopValue(field, parsed.data.fields[field.id] ?? '')
      if (value === null) problems[field.id] = 'format'
      else {
        fields[field.id] = value
        if (sending && !stopFieldComplete(field, value)) problems[field.id] = 'required'
      }
    }
    if (Object.keys(problems).length) return { ok: false, error: 'invalid', fields: problems }
    const late = sending && state.closed
    await addSubmission({
      email: founder.email,
      stop,
      status: sending ? 'sent' : 'draft',
      fields,
      late: late || state.late,
    })
    if (sending) await addTick(founder.email, stopStepId(stop), true, '')
    await logEvent(founder.email, 'stop', { stop, sent: sending, late })
    if (sending) revalidatePath('/team/phases')
    return { ok: true, late: late || state.late, fields }
  })
}
