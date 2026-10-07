import 'server-only'
import { newId } from '@/lib/data/ids'
import { appendRows, rows, updateRow } from '@/lib/store'

/**
 * Stuck? Message the team. One thread per founder, append-only. A thread is
 * waiting on the team when its newest line is the founder's.
 */
export type Message = {
  row: number
  id: string
  founder: string
  from: string
  stepId: string
  text: string
  screenshot: string
  at: string
  emailedAt: string
}

export async function allMessages(): Promise<Message[]> {
  return (await rows('messages')).map(({ row, cells }) => ({
    row,
    id: cells['Message ID'],
    founder: cells.Founder.trim().toLowerCase(),
    from: cells.From.trim().toLowerCase(),
    stepId: cells['Step ID'],
    text: cells.Text,
    screenshot: cells.Screenshot,
    at: cells.At,
    emailedAt: cells['Emailed at'],
  }))
}

export async function threadOf(founder: string): Promise<Message[]> {
  const key = founder.trim().toLowerCase()
  return (await allMessages()).filter((message) => message.founder === key)
}

/** Threads by founder, oldest line first. */
export function threads(messages: Message[]): Map<string, Message[]> {
  const byFounder = new Map<string, Message[]>()
  for (const message of messages) {
    byFounder.set(message.founder, [...(byFounder.get(message.founder) ?? []), message])
  }
  return byFounder
}

export function waitingOnTeam(thread: Message[]): boolean {
  const last = thread.at(-1)
  return Boolean(last && last.from === last.founder)
}

export async function addMessage(input: {
  founder: string
  from: string
  stepId: string
  text: string
  screenshot: string
}): Promise<string> {
  const id = newId('ms')
  await appendRows('messages', [
    {
      'Message ID': id,
      Founder: input.founder,
      From: input.from,
      'Step ID': input.stepId,
      Text: input.text,
      Screenshot: input.screenshot,
      At: new Date().toISOString(),
    },
  ])
  return id
}

export async function markEmailed(id: string): Promise<void> {
  const found = (await allMessages()).find((message) => message.id === id)
  if (found) await updateRow('messages', found.row, { 'Emailed at': new Date().toISOString() })
}
