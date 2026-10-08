'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logEvent } from '@/lib/data/events'
import { allFounders } from '@/lib/data/founders'
import { POD_COUNT, seat } from '@/lib/data/pods'
import { bank, problemById, setProblem } from '@/lib/data/problems'
import { addReview, RATINGS } from '@/lib/data/reviews'
import { problemIdSchema } from '@/lib/problem'
import { getViewer } from '@/lib/session'
import { bankOn } from '@/lib/flags'
import { DIFFICULTIES } from '@/lib/taxonomy'
import { trackOf } from '@/lib/tracks'

/**
 * What the team can do. Every action checks the role from the session, never
 * from the request, and validates its input.
 */

export type TeamResult = { ok: true } | { ok: false; error: 'forbidden' | 'invalid' | 'failed' }

async function team(): Promise<string | null> {
  const viewer = await getViewer()
  return viewer?.role === 'team' ? viewer.email : null
}

/** The bank's actions, only while the bank is switched on. */
async function bankEditor(): Promise<string | null> {
  return bankOn() ? team() : null
}

const reviewSchema = z.object({
  email: z.string().email().max(200),
  stop: z.enum(['1', '2', '3']),
  rating: z.enum(RATINGS),
  notes: z.string().trim().max(2000),
  fixes: z.array(z.string().trim().min(1).max(200)).max(12),
})

/**
 * Rates a founder's stop green, amber or red, with notes and a fix list. The
 * founder sees the rating as words, the notes, and the fixes as ticks on
 * Today. A new review replaces the last one; both stay in the Sheet.
 */
export async function reviewStop(raw: unknown): Promise<TeamResult> {
  const author = await team()
  if (!author) return { ok: false, error: 'forbidden' }
  const parsed = reviewSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const founder = (await allFounders()).find((item) => item.email === parsed.data.email)
    if (!founder) return { ok: false, error: 'invalid' }
    const id = await addReview({ ...parsed.data, author })
    await logEvent(author, 'review', {
      id,
      founder: founder.email,
      stop: parsed.data.stop,
      rating: parsed.data.rating,
      fixes: parsed.data.fixes.length,
    })
    // A green stop 2 puts their live link on the landing.
    if (parsed.data.stop === '2') revalidatePath('/')
    revalidatePath(`/team/phases/${parsed.data.stop}`)
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

const checkinSchema = z.object({
  email: z.string().email().max(200),
  notes: z.string().trim().min(1).max(2000),
})

/** A note from a 1:1 check-in, 27 to 30 Oct. The team's alone; founders never see it. */
export async function addCheckin(raw: unknown): Promise<TeamResult> {
  const author = await team()
  if (!author) return { ok: false, error: 'forbidden' }
  const parsed = checkinSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const founder = (await allFounders()).find((item) => item.email === parsed.data.email)
    if (!founder) return { ok: false, error: 'invalid' }
    await addReview({
      email: founder.email,
      stop: 'checkin',
      rating: null,
      notes: parsed.data.notes,
      fixes: [],
      author,
    })
    await logEvent(author, 'checkin', { founder: founder.email })
    revalidatePath(`/f/${founder.slug}`)
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

const seatSchema = z.object({
  email: z.string().email().max(200),
  pod: z.number().int().min(1).max(POD_COUNT).nullable(),
  role: z.enum(['member', 'mentor']),
})

/**
 * Puts a founder in a pod, or takes them out. Members are guided founders;
 * mentors are autonomous volunteers. Anyone else is refused.
 */
export async function setSeat(raw: unknown): Promise<TeamResult> {
  const author = await team()
  if (!author) return { ok: false, error: 'forbidden' }
  const parsed = seatSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const founder = (await allFounders()).find((item) => item.email === parsed.data.email)
    if (!founder) return { ok: false, error: 'invalid' }
    const track = trackOf(founder.track)
    if (parsed.data.role === 'member' ? track !== 'guided' : track !== 'autonomous')
      return { ok: false, error: 'invalid' }
    await seat(founder.email, parsed.data.pod, parsed.data.role, author)
    await logEvent(author, 'pod', { founder: founder.email, ...parsed.data })
    revalidatePath('/team/pods')
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

const statusSchema = z.object({
  id: problemIdSchema,
  status: z.enum(['draft', 'approved', 'rejected']),
})

/** Approves, rejects or returns a problem to draft. Founders only ever see approved ones. */
export async function setProblemStatus(raw: unknown): Promise<TeamResult> {
  const editor = await bankEditor()
  if (!editor) return { ok: false, error: 'forbidden' }
  const parsed = statusSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const item = await problemById(parsed.data.id)
  if (!item) return { ok: false, error: 'invalid' }
  await setProblem(item, { Status: parsed.data.status }, editor)
  await logEvent(editor, 'bank', { id: item.id, status: parsed.data.status, previous: item.status })
  return { ok: true }
}

/** Approves every draft at once, for after a full read-through. */
export async function approveAll(raw: unknown): Promise<TeamResult> {
  const editor = await bankEditor()
  if (!editor) return { ok: false, error: 'forbidden' }
  const ids = z.array(problemIdSchema).max(400).safeParse(raw)
  if (!ids.success) return { ok: false, error: 'invalid' }
  const items = (await bank()).filter(
    (item) => ids.data.includes(item.id) && item.status === 'draft',
  )
  for (const item of items) await setProblem(item, { Status: 'approved' }, editor)
  await logEvent(editor, 'bank', { approved: items.map((item) => item.id) })
  return { ok: true }
}

const editSchema = z.object({
  id: problemIdSchema,
  title: z.string().trim().min(3).max(90),
  problem: z.string().trim().min(40).max(700),
  challenge: z.string().trim().min(10).max(200),
  difficulty: z.enum(DIFFICULTIES),
})

export async function editProblem(raw: unknown): Promise<TeamResult> {
  const editor = await bankEditor()
  if (!editor) return { ok: false, error: 'forbidden' }
  const parsed = editSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const item = await problemById(parsed.data.id)
  if (!item) return { ok: false, error: 'invalid' }
  await setProblem(
    item,
    {
      Title: parsed.data.title,
      Problem: parsed.data.problem,
      Challenge: parsed.data.challenge,
      Difficulty: parsed.data.difficulty,
    },
    editor,
  )
  await logEvent(editor, 'bank', { id: item.id, edited: true })
  return { ok: true }
}
