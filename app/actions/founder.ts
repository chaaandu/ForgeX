'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { archetypeOf, isCompleteTrial, scoreTrial, TRIAL } from '@/lib/archetype'
import { arrivalRank, logEvent } from '@/lib/data/events'
import { founderByEmail, LEVELS, levelPatch, patchFounder, type Founder } from '@/lib/data/founders'
import { addMessage } from '@/lib/data/messages'
import {
  addResearch,
  cleanResearch,
  readyToSend,
  researchOf,
  researchSchema,
} from '@/lib/data/research'
import { allReviews, fixStepId } from '@/lib/data/reviews'
import { addTick } from '@/lib/data/steps'
import { addSubmission, historyOf } from '@/lib/data/submissions'
import { cleanStepValue, cleanStopValue, stepComplete, stopFieldComplete } from '@/lib/inputs'
import { LINK_FIELDS, normaliseLink, normaliseWorkLink, type LinkField } from '@/lib/links'
import { planNow, STOP_NUMBERS, STOPS } from '@/lib/plan'
import { list, profilePatchSchema } from '@/lib/profile'
import { MESSAGE_LINES, MESSAGE_MAX } from '@/lib/limits'
import { getViewer } from '@/lib/session'
import { stepById, stepsFor, stopFieldsFor, stopStepId } from '@/lib/steps'
import { stopState } from '@/lib/stops'
import { trackOf } from '@/lib/tracks'

/**
 * Everything a founder can change. Each action takes its identity from the
 * session and nowhere else, validates its input, checks the founder owns what
 * they are touching, writes, logs an event, and moves the level forward
 * (never back).
 */

export type Result<T = object> =
  ({ ok: true } & T) | { ok: false; error: ActionError; fields?: Record<string, string> }
export type ActionError = 'signed-out' | 'forbidden' | 'invalid' | 'locked' | 'failed'

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

/** Level 3 done. A one-line bio is the only thing we insist on. */
export async function finishProfile(): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (!founder.profile.bio.trim())
      return { ok: false, error: 'invalid', fields: { bio: 'required' } }
    await patchFounder(founder, levelPatch(founder, LEVELS.profile))
    await logEvent(founder.email, 'level', { level: LEVELS.profile })
    return { ok: true }
  })
}

/** Level 4. They've read the challenge and are starting their research. */
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
 * problem, the moment it breaks and 3 apps; nobody approves it. The first
 * send opens the plan, and they can keep editing it after.
 */
export async function saveResearch(raw: unknown): Promise<Result<{ sent: boolean }>> {
  return guarded<{ sent: boolean }>(async (founder) => {
    if (founder.level < LEVELS.challenge) return { ok: false, error: 'forbidden' }
    const parsed = researchInput.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const research = cleanResearch(parsed.data.research)
    if (!research) return { ok: false, error: 'invalid', fields: { reading: 'link' } }
    const before = await researchOf(founder.email)
    const sent = parsed.data.send || Boolean(before?.sent)
    if (sent && !readyToSend(research)) return { ok: false, error: 'invalid' }
    await addResearch(founder.email, research, sent)
    await patchFounder(founder, sent ? levelPatch(founder, LEVELS.research) : {})
    await logEvent(founder.email, 'research', { sent, first: sent && !before?.sent })
    // Sending puts them on the landing, under the wall.
    if (sent) revalidatePath('/')
    return { ok: true, sent }
  })
}

/** Founders who have sent their research: the plan is theirs from here. */
async function building(founder: Founder): Promise<boolean> {
  return founder.level >= LEVELS.research && Boolean((await researchOf(founder.email))?.sent)
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
    if (!(await building(founder))) return { ok: false, error: 'forbidden' }
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
    if (step.input?.kind === 'stop') return { ok: false, error: 'invalid' }
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
    if (!(await building(founder))) return { ok: false, error: 'forbidden' }
    const parsed = stopInput.safeParse(raw)
    if (!parsed.success || !STOP_NUMBERS.includes(parsed.data.stop))
      return { ok: false, error: 'invalid' }
    const { stop, send } = parsed.data
    const now = planNow()
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
    if (sending) revalidatePath('/team/stops')
    return { ok: true, late: late || state.late, fields }
  })
}

const messageInput = z.object({
  text: z
    .string()
    .trim()
    .min(3)
    .max(MESSAGE_MAX)
    .refine((value) => value.split('\n').length <= MESSAGE_LINES, 'Three lines at most'),
  stepId: z.string().max(80),
  screenshot: z.string().max(600),
})

/** Stuck? Message the team. Open from the challenge on, before research too. */
export async function sendMessage(raw: unknown): Promise<Result> {
  return guarded<object>(async (founder) => {
    if (founder.level < LEVELS.challenge) return { ok: false, error: 'forbidden' }
    const parsed = messageInput.safeParse(raw)
    if (!parsed.success) return { ok: false, error: 'invalid' }
    const screenshot = parsed.data.screenshot.trim()
      ? normaliseWorkLink('screenshot', parsed.data.screenshot)
      : ''
    if (screenshot === null) return { ok: false, error: 'invalid', fields: { screenshot: 'link' } }
    // A step tag must be one of their own steps, or it's dropped.
    const stepId = stepsFor(trackOf(founder.track)).some((step) => step.id === parsed.data.stepId)
      ? parsed.data.stepId
      : ''
    const id = await addMessage({
      founder: founder.email,
      from: founder.email,
      stepId,
      text: parsed.data.text,
      screenshot,
    })
    await logEvent(founder.email, 'message', { id, stepId })
    revalidatePath('/team/messages')
    return { ok: true }
  })
}
