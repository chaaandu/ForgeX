'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logEvent } from '@/lib/data/events'
import { founderBySlug } from '@/lib/data/founders'
import { answerProblem, entryOf, setReopened } from '@/lib/data/hackathon'
import { clock, STAGE_IDS } from '@/lib/hackathon'
import { DECISIONS, needsNote } from '@/lib/own-problem'
import { bank, problemById, setProblem } from '@/lib/data/problems'
import { bullets, problemIdSchema, scopeSchema } from '@/lib/problem'
import { getViewer } from '@/lib/session'
import { mayAct, mayDecide, staffOf, type Staff } from '@/lib/staff'
import { DIFFICULTIES } from '@/lib/taxonomy'

/**
 * What the team can do. Every action checks the role from the session, never
 * from the request, and validates its input. Anyone with a Mesa email can look
 * at the console; only the reviewers and the super admin can act, and only the
 * super admin can reopen a deadline.
 */

export type TeamResult = { ok: true } | { ok: false; error: 'forbidden' | 'invalid' | 'failed' }

/** The team member acting, with what they may do, or null for anyone else. */
async function staff(): Promise<({ email: string; name: string } & Staff) | null> {
  const viewer = await getViewer()
  if (viewer?.role !== 'team') return null
  return { email: viewer.email, name: viewer.name, ...staffOf(viewer.email) }
}

/** May edit the bank: the super admin alone. */
async function team(): Promise<string | null> {
  const who = await staff()
  return who?.admin ? who.email : null
}

const reviewSchema = z
  .object({
    slug: z.string().min(1).max(80),
    version: z.number().int().min(1).max(999),
    decision: z.enum(DECISIONS),
    notes: z.string().trim().max(3000),
  })
  .refine((value) => !needsNote(value.decision) || value.notes.length > 0, 'A note is needed')

/**
 * Answers one version of a founder's problem: approved, approved with changes,
 * or rejected, the last two always with a note. Only the founder's reviewer,
 * any reviewer for a founder with none yet, or the super admin. A version can
 * be answered again, and the newest answer stands. Answers keep coming after
 * the window closes: a problem sent in time is still owed one.
 */
export async function review(raw: unknown): Promise<TeamResult> {
  const who = await staff()
  if (!who || !mayAct(who)) return { ok: false, error: 'forbidden' }
  const parsed = reviewSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const founder = await founderBySlug(parsed.data.slug)
    const entry = founder ? await entryOf(founder.email) : null
    if (!founder || !entry || !entry.latest) return { ok: false, error: 'invalid' }
    if (!mayDecide(who, entry.reviewer)) return { ok: false, error: 'forbidden' }
    // Only the newest version can be answered: an older one has been replaced by its author.
    if (parsed.data.version !== entry.latest.version) return { ok: false, error: 'invalid' }
    await answerProblem(
      entry,
      {
        version: parsed.data.version,
        decision: parsed.data.decision,
        by: who.reviewer ?? who.name,
        notes: parsed.data.notes,
      },
      clock(),
    )
    await logEvent(who.email, 'review', {
      founder: founder.email,
      version: parsed.data.version,
      decision: parsed.data.decision,
    })
    revalidatePath('/team/reviews')
    revalidatePath('/')
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

const reopenSchema = z.object({
  slug: z.string().min(1).max(80),
  step: z.enum(['problem', ...STAGE_IDS]),
  open: z.boolean(),
})

/**
 * Opens one deadline again for one founder, or closes it: for the student who
 * talked to Pragati and was given a little more time. Super admin only. The
 * same switch is the Reopened cell on their row, which lists the steps.
 */
export async function reopen(raw: unknown): Promise<TeamResult> {
  const who = await staff()
  if (!who?.admin) return { ok: false, error: 'forbidden' }
  const parsed = reopenSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const founder = await founderBySlug(parsed.data.slug)
    const entry = founder ? await entryOf(founder.email) : null
    if (!founder || !entry) return { ok: false, error: 'invalid' }
    await setReopened(entry, parsed.data.step, parsed.data.open)
    await logEvent(who.email, 'reopen', { founder: founder.email, ...parsed.data })
    revalidatePath('/team')
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
  const editor = await team()
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
  const editor = await team()
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
  /** The 2-day version, bullets one a line. All three empty takes the problem off offer. */
  task: z.string().trim().max(200),
  expect: z.string().trim().max(1200),
  further: z.string().trim().max(600),
})

export async function editProblem(raw: unknown): Promise<TeamResult> {
  const editor = await team()
  if (!editor) return { ok: false, error: 'forbidden' }
  const parsed = editSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const item = await problemById(parsed.data.id)
  if (!item) return { ok: false, error: 'invalid' }
  const expect = bullets.read(parsed.data.expect)
  const further = bullets.read(parsed.data.further)
  const cleared = !parsed.data.task && !expect.length && !further.length
  if (!cleared && !scopeSchema.safeParse({ task: parsed.data.task, expect, further }).success)
    return { ok: false, error: 'invalid' }
  await setProblem(
    item,
    {
      Title: parsed.data.title,
      Problem: parsed.data.problem,
      Challenge: parsed.data.challenge,
      Difficulty: parsed.data.difficulty,
      Task: parsed.data.task,
      Expect: bullets.write(expect),
      Further: bullets.write(further),
    },
    editor,
  )
  await logEvent(editor, 'bank', { id: item.id, edited: true })
  return { ok: true }
}
