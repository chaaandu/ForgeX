import 'server-only'
import { z } from 'zod'
import { normaliseWorkLink } from '@/lib/links'
import { appendRows, rows } from '@/lib/store'

/**
 * A founder's research: the apps owners use and what they get wrong, the
 * owners they talked to, and the problem in their own words. Each save is a
 * new row, so nothing is ever overwritten; the newest row is the research.
 * Once any row is sent, building is open for good.
 */

const text = (max: number) => z.string().trim().max(max)

export const appSchema = z.object({ name: text(60), note: text(280) })
export const talkSchema = z.object({ who: text(120), breaks: text(400), said: text(280) })

export const researchSchema = z.object({
  forWho: text(120),
  problem: text(500),
  moment: text(300),
  apps: z.array(appSchema).max(6),
  talks: z.array(talkSchema).max(5),
  reading: z.array(text(400)).max(5),
})

export type ResearchInput = z.infer<typeof researchSchema>
export type Research = ResearchInput & { at: string; sent: boolean }

/** What sending asks for: who it's for, the problem, the moment, and 3 apps looked at. */
export const MIN = { forWho: 3, problem: 40, moment: 10, apps: 3 } as const

export function readyToSend(input: ResearchInput): boolean {
  return (
    input.forWho.length >= MIN.forWho &&
    input.problem.length >= MIN.problem &&
    input.moment.length >= MIN.moment &&
    input.apps.filter((app) => app.name && app.note).length >= MIN.apps
  )
}

/** Drops empty rows and normalises links. Returns null if a reading link won't work. */
export function cleanResearch(input: ResearchInput): ResearchInput | null {
  const reading: string[] = []
  for (const raw of input.reading.filter(Boolean)) {
    const url = normaliseWorkLink('doc', raw)
    if (!url) return null
    reading.push(url)
  }
  return {
    ...input,
    apps: input.apps.filter((app) => app.name || app.note),
    talks: input.talks.filter((talk) => talk.who || talk.breaks || talk.said),
    reading,
  }
}

function parseList<T>(cell: string, schema: z.ZodType<T>): T[] {
  if (!cell) return []
  try {
    const parsed = z.array(schema).safeParse(JSON.parse(cell))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
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
      moment: cells.Moment,
      apps: parseList(cells.Apps, appSchema),
      talks: parseList(cells.Conversations, talkSchema),
      reading: cells.Reading.split('\n').filter(Boolean),
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
      Moment: input.moment,
      Apps: JSON.stringify(input.apps),
      Conversations: JSON.stringify(input.talks),
      Reading: input.reading.join('\n'),
    },
  ])
}
