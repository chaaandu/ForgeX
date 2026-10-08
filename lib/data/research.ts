import 'server-only'
import { z } from 'zod'
import { appendRows, rows } from '@/lib/store'

/**
 * A founder's research. The research itself lives in a Google Doc their
 * mentor has already gone through with them; here they add who it's for, the
 * problem in their own words, and the doc. Each save is a new row and the
 * newest stands. Once any row is sent, building is open for good.
 */

const text = (max: number) => z.string().trim().max(max)

export const researchSchema = z.object({
  forWho: text(120),
  problem: text(500),
  doc: text(600),
  mentor: z.boolean(),
})

export type ResearchInput = z.infer<typeof researchSchema>
export type Research = ResearchInput & { at: string; sent: boolean }

/** What sending asks for. */
export const MIN = { forWho: 3, problem: 40 } as const

export function readyToSend(input: ResearchInput): boolean {
  return (
    input.forWho.length >= MIN.forWho &&
    input.problem.length >= MIN.problem &&
    input.doc.length > 0 &&
    input.mentor
  )
}

export async function allResearch(): Promise<Map<string, Research>> {
  const latest = new Map<string, Research>()
  for (const { cells } of await rows('research')) {
    const email = cells.Email.trim().toLowerCase()
    const sent = cells.Status === 'sent' || Boolean(latest.get(email)?.sent)
    latest.set(email, {
      at: cells.At,
      sent,
      forWho: cells.For,
      problem: cells.Problem,
      doc: cells.Doc,
      mentor: cells.Mentor === 'yes',
    })
  }
  return latest
}

export async function researchOf(email: string): Promise<Research | null> {
  return (await allResearch()).get(email.trim().toLowerCase()) ?? null
}

export async function addResearch(
  email: string,
  input: ResearchInput,
  sent: boolean,
): Promise<void> {
  await appendRows('research', [
    {
      At: new Date().toISOString(),
      Email: email,
      Status: sent ? 'sent' : 'draft',
      For: input.forWho,
      Problem: input.problem,
      Doc: input.doc,
      Mentor: input.mentor ? 'yes' : '',
    },
  ])
}
