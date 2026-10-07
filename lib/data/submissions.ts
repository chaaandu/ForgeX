import 'server-only'
import { newId } from '@/lib/data/ids'
import type { StopNumber } from '@/lib/plan'
import { appendRows, rows } from '@/lib/store'

/**
 * Stop submissions. Each save is a new row; the newest row for a founder and
 * a stop is the submission. Whether it can still change is `stopState` in
 * lib/stops.ts.
 */
export type Submission = {
  id: string
  email: string
  stop: StopNumber
  status: 'draft' | 'sent'
  fields: Record<string, string>
  savedAt: string
  late: boolean
}

function parseFields(cell: string): Record<string, string> {
  try {
    const value = JSON.parse(cell) as unknown
    if (!value || typeof value !== 'object') return {}
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    )
  } catch {
    return {}
  }
}

export async function allSubmissions(): Promise<Submission[]> {
  return (await rows('submissions')).flatMap(({ cells }) => {
    const stop = Number(cells.Stop)
    if (stop !== 1 && stop !== 2 && stop !== 3) return []
    return [
      {
        id: cells['Submission ID'],
        email: cells.Email.trim().toLowerCase(),
        stop,
        status: cells.Status === 'sent' ? 'sent' : 'draft',
        fields: parseFields(cells.Fields),
        savedAt: cells['Saved at'],
        late: cells.Late === 'yes',
      } satisfies Submission,
    ]
  })
}

export async function historyOf(email: string, stop: StopNumber): Promise<Submission[]> {
  const key = email.trim().toLowerCase()
  return (await allSubmissions()).filter((item) => item.email === key && item.stop === stop)
}

export async function addSubmission(input: Omit<Submission, 'id' | 'savedAt'>): Promise<void> {
  await appendRows('submissions', [
    {
      'Submission ID': newId('sb'),
      Email: input.email,
      Stop: String(input.stop),
      Status: input.status,
      Fields: JSON.stringify(input.fields),
      'Saved at': new Date().toISOString(),
      Late: input.late ? 'yes' : '',
    },
  ])
}
