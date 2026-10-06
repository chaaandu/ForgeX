'use server'

import { z } from 'zod'
import { email } from '@/content/copy'
import { logEvent } from '@/lib/data/events'
import { allFounders, patchFounder } from '@/lib/data/founders'
import { addResponse, allPicks, allResponses, RESPONSE_TYPES, statusOf } from '@/lib/data/picks'
import { bank, problemById, setProblem } from '@/lib/data/problems'
import { responseEmail, sendEmail } from '@/lib/email/send'
import { problemIdSchema } from '@/lib/problem'
import { getViewer } from '@/lib/session'
import { rows, updateRow } from '@/lib/store'
import { RARITIES } from '@/lib/taxonomy'

/**
 * What the team can do. Every action checks the role from the session, never
 * from the request, and validates its input.
 */

export type TeamResult = { ok: true } | { ok: false; error: 'forbidden' | 'invalid' | 'failed' }

async function team(): Promise<string | null> {
  const viewer = await getViewer()
  return viewer?.role === 'team' ? viewer.email : null
}

const respondSchema = z
  .object({
    pickId: z.string().min(3).max(60),
    type: z.enum(RESPONSE_TYPES),
    note: z.string().trim().max(2000),
    suggested: z.array(problemIdSchema).max(6),
  })
  .refine((value) => value.type !== 'tweak' || value.note.length > 0, 'A tweak needs a note')

/** Answers a founder's why, mirrors the status onto their row, and emails them. */
export async function respond(raw: unknown): Promise<TeamResult> {
  const author = await team()
  if (!author) return { ok: false, error: 'forbidden' }
  const parsed = respondSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  try {
    const [picks, responses, founders] = await Promise.all([allPicks(), allResponses(), allFounders()])
    const pick = picks.find((item) => item.id === parsed.data.pickId)
    if (!pick || pick.withdrawnAt) return { ok: false, error: 'invalid' }
    const founder = founders.find((item) => item.email === pick.email)
    if (!founder) return { ok: false, error: 'invalid' }
    const responseId = await addResponse({ ...parsed.data, author })
    await patchFounder(founder, { Status: parsed.data.type })
    await logEvent(author, 'response', { pickId: pick.id, founder: founder.email, type: parsed.data.type, previous: statusOf(pick, responses) })

    const problem = pick.problemId ? await problemById(pick.problemId) : null
    const title = problem?.title ?? pick.custom?.title ?? email.fallbackTitle
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? 'http://localhost:3000'
    const message = responseEmail({
      first: founder.first,
      title,
      type: parsed.data.type,
      note: parsed.data.note,
      url: `${base.replace(/\/$/, '')}/f/${founder.slug}`,
    })
    const sent = await sendEmail({ to: founder.email, ...message })
    if (sent) {
      const found = (await rows('responses')).find((entry) => entry.cells['Response ID'] === responseId)
      if (found) await updateRow('responses', found.row, { 'Emailed at': new Date().toISOString() })
    }
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

const statusSchema = z.object({ id: problemIdSchema, status: z.enum(['draft', 'approved', 'rejected']) })

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
  const items = (await bank()).filter((item) => ids.data.includes(item.id) && item.status === 'draft')
  for (const item of items) await setProblem(item, { Status: 'approved' }, editor)
  await logEvent(editor, 'bank', { approved: items.map((item) => item.id) })
  return { ok: true }
}

const editSchema = z.object({
  id: problemIdSchema,
  title: z.string().trim().min(3).max(90),
  problem: z.string().trim().min(40).max(700),
  challenge: z.string().trim().min(10).max(200),
  rarity: z.enum(RARITIES),
})

export async function editProblem(raw: unknown): Promise<TeamResult> {
  const editor = await team()
  if (!editor) return { ok: false, error: 'forbidden' }
  const parsed = editSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const item = await problemById(parsed.data.id)
  if (!item) return { ok: false, error: 'invalid' }
  await setProblem(
    item,
    { Title: parsed.data.title, Problem: parsed.data.problem, Challenge: parsed.data.challenge, Rarity: parsed.data.rarity },
    editor,
  )
  await logEvent(editor, 'bank', { id: item.id, edited: true })
  return { ok: true }
}
