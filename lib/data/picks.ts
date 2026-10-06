import 'server-only'
import { z } from 'zod'
import { problemIdSchema } from '@/lib/problem'
import { appendRows, rows, updateRow } from '@/lib/store'
import { INDUSTRY_IDS, SIDE_IDS } from '@/lib/taxonomy'

/**
 * Picks and the team's responses. Both tabs are append-only: a founder's
 * current pick is their newest one that was not withdrawn, and its status is
 * the type of its newest response.
 */

export const RESPONSE_TYPES = ['go', 'tweak', 'talk', 'another'] as const
export type ResponseType = (typeof RESPONSE_TYPES)[number]
export type PickStatus = 'waiting' | ResponseType

const text = (min: number, max: number) => z.string().trim().min(min).max(max)

export const customProblemSchema = z.object({
  title: text(3, 80).refine((value) => value.split(/\s+/).length < 10, 'Keep the title under ten words'),
  problem: text(40, 700),
  challenge: text(10, 200),
  industry: z.enum([...INDUSTRY_IDS, 'other']),
  side: z.enum(SIDE_IDS),
})

export type CustomProblem = z.infer<typeof customProblemSchema>

export const whySchema = z.object({
  whyProblem: text(20, 1500),
  whyUser: text(20, 1500),
  whyPay: text(20, 1500),
  contact: z.string().trim().max(600),
})

export const pickInputSchema = z
  .object({
    problemId: problemIdSchema.nullable(),
    custom: customProblemSchema.nullable(),
  })
  .and(whySchema)
  .refine((value) => (value.problemId === null) !== (value.custom === null), 'Pick one problem')

export type PickInput = z.infer<typeof pickInputSchema>

export type Pick = {
  row: number
  id: string
  email: string
  problemId: string | null
  custom: CustomProblem | null
  whyProblem: string
  whyUser: string
  whyPay: string
  contact: string
  submittedAt: string
  withdrawnAt: string
}

export type Response = {
  id: string
  pickId: string
  author: string
  type: ResponseType
  note: string
  suggested: string[]
  sentAt: string
}

export async function allPicks(): Promise<Pick[]> {
  return (await rows('picks')).map(({ row, cells }) => {
    const custom = customProblemSchema.safeParse({
      title: cells['Custom title'],
      problem: cells['Custom problem'],
      challenge: cells['Custom challenge'],
      industry: cells['Custom industry'],
      side: cells['Custom side'],
    })
    return {
      row,
      id: cells['Pick ID'],
      email: cells.Email.trim().toLowerCase(),
      problemId: cells['Problem ID'].trim() || null,
      custom: cells['Problem ID'].trim() ? null : custom.success ? custom.data : null,
      whyProblem: cells['Why problem'],
      whyUser: cells['Why user'],
      whyPay: cells['Why pay'],
      contact: cells.Contact,
      submittedAt: cells['Submitted at'],
      withdrawnAt: cells['Withdrawn at'],
    }
  })
}

export async function allResponses(): Promise<Response[]> {
  return (await rows('responses'))
    .map(({ cells }) => ({
      id: cells['Response ID'],
      pickId: cells['Pick ID'],
      author: cells.Author,
      type: RESPONSE_TYPES.find((type) => type === cells.Type.trim()) ?? null,
      note: cells.Note,
      suggested: cells['Suggested IDs']
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
      sentAt: cells['Sent at'],
    }))
    .filter((response): response is Response => response.type !== null)
}

export function statusOf(pick: Pick, responses: Response[]): PickStatus {
  const mine = responses.filter((response) => response.pickId === pick.id)
  return mine.at(-1)?.type ?? 'waiting'
}

/** Every pick a founder has made, oldest first, with each one's thread. */
export async function threadFor(email: string) {
  const [picks, responses] = await Promise.all([allPicks(), allResponses()])
  return picks
    .filter((pick) => pick.email === email)
    .map((pick) => ({
      pick,
      responses: responses.filter((response) => response.pickId === pick.id),
      status: statusOf(pick, responses),
    }))
}

export function newId(prefix: string): string {
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${time}${random}`
}

export async function addPick(email: string, input: PickInput): Promise<string> {
  const id = newId('pk')
  await appendRows('picks', [
    {
      'Pick ID': id,
      Email: email,
      'Problem ID': input.problemId ?? '',
      'Custom title': input.custom?.title ?? '',
      'Custom problem': input.custom?.problem ?? '',
      'Custom challenge': input.custom?.challenge ?? '',
      'Custom industry': input.custom?.industry ?? '',
      'Custom side': input.custom?.side ?? '',
      'Why problem': input.whyProblem,
      'Why user': input.whyUser,
      'Why pay': input.whyPay,
      Contact: input.contact,
      'Submitted at': new Date().toISOString(),
    },
  ])
  return id
}

export async function withdraw(pick: Pick): Promise<void> {
  await updateRow('picks', pick.row, { 'Withdrawn at': new Date().toISOString() })
}

export async function addResponse(input: {
  pickId: string
  author: string
  type: ResponseType
  note: string
  suggested: string[]
}): Promise<string> {
  const id = newId('rs')
  await appendRows('responses', [
    {
      'Response ID': id,
      'Pick ID': input.pickId,
      Author: input.author,
      Type: input.type,
      Note: input.note,
      'Suggested IDs': input.suggested.join(', '),
      'Sent at': new Date().toISOString(),
    },
  ])
  return id
}
