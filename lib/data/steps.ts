import 'server-only'
import { appendRows, rows } from '@/lib/store'

/**
 * Ticks on plan steps. Append-only: the newest row for a founder and a step
 * is where that step stands, so ticking and unticking never overwrite.
 */
export type Tick = { done: boolean; value: string; at: string }
export type Ticks = Record<string, Tick>

export async function allTicks(): Promise<Map<string, Ticks>> {
  const byFounder = new Map<string, Ticks>()
  for (const { cells } of await rows('steps')) {
    const email = cells.Email.trim().toLowerCase()
    const ticks = byFounder.get(email) ?? {}
    ticks[cells['Step ID']] = { done: cells.Done === 'yes', value: cells.Value, at: cells.At }
    byFounder.set(email, ticks)
  }
  return byFounder
}

export async function ticksOf(email: string): Promise<Ticks> {
  return (await allTicks()).get(email.trim().toLowerCase()) ?? {}
}

export async function addTick(
  email: string,
  stepId: string,
  done: boolean,
  value: string,
): Promise<void> {
  await appendRows('steps', [
    {
      At: new Date().toISOString(),
      Email: email,
      'Step ID': stepId,
      Done: done ? 'yes' : 'no',
      Value: value,
    },
  ])
}
