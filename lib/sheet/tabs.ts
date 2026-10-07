/**
 * The Sheet, tab by tab. Columns are read by header name, never by position,
 * so a person can reorder or add columns in the Sheet without breaking the app.
 * Renaming one of these headers in the Sheet does break it, loudly: the codecs
 * fail rather than read a renamed column as empty.
 */

export const TABS = {
  founders: {
    name: 'Founders',
    headers: [
      'Email',
      'Slug',
      'Name',
      'First name',
      'Photo',
      'Number',
      'Track',
      'Wall',
      'Level',
      'Archetype',
      'Archetype source',
      'Axes',
      'Trial answers',
      'Retakes used',
      'H1 archetype',
      'H1 outcome',
      'H1 level',
      'Prior work',
      'Bio',
      'City',
      'Languages',
      'Degree',
      'Good at',
      'Want to learn',
      'GitHub',
      'LinkedIn',
      'Portfolio',
      'World',
      'Pick ID',
      'Status',
      'Last active',
      'Updated at',
    ],
  },
  problems: {
    name: 'Problems',
    headers: [
      'ID',
      'Status',
      'Title',
      'Problem',
      'Challenge',
      'Difficulty',
      'Industries',
      'Side',
      'Learn',
      'Geo',
      'Signal count',
      'Signal strength',
      'Signal line',
      'Edited by',
      'Edited at',
    ],
  },
  internal: {
    name: 'Problems internal',
    headers: ['ID', 'Evidence', 'Sources', 'Why now', 'Players', 'Scores', 'Total'],
  },
  picks: {
    name: 'Picks',
    headers: [
      'Pick ID',
      'Email',
      'Problem ID',
      'Custom title',
      'Custom problem',
      'Custom challenge',
      'Custom industry',
      'Custom side',
      'Why problem',
      'Why user',
      'Why pay',
      'Contact',
      'Submitted at',
      'Withdrawn at',
    ],
  },
  responses: {
    name: 'Responses',
    headers: [
      'Response ID',
      'Pick ID',
      'Author',
      'Type',
      'Note',
      'Suggested IDs',
      'Sent at',
      'Emailed at',
    ],
  },
  events: {
    name: 'Events',
    headers: ['At', 'Email', 'Kind', 'Data'],
  },
  /** Each save of a founder's research, newest last. Status is draft or sent. */
  research: {
    name: 'Research',
    headers: [
      'At',
      'Email',
      'Status',
      'For',
      'Problem',
      'Moment',
      'Apps',
      'Conversations',
      'Reading',
    ],
  },
  /** Every tick and untick of a plan step, with the link or answer it asked for. */
  steps: {
    name: 'Steps',
    headers: ['At', 'Email', 'Step ID', 'Done', 'Value'],
  },
  /** One thread per founder with the team. From is whoever wrote the line. */
  messages: {
    name: 'Messages',
    headers: ['Message ID', 'Founder', 'From', 'Step ID', 'Text', 'Screenshot', 'At', 'Emailed at'],
  },
  /** Each save of a stop, newest last. Fields is JSON keyed by field ID. */
  submissions: {
    name: 'Submissions',
    headers: ['Submission ID', 'Email', 'Stop', 'Status', 'Fields', 'Saved at', 'Late'],
  },
  /** The team's rating of a stop, or a check-in note (Stop is `checkin`). Newest wins. */
  reviews: {
    name: 'Reviews',
    headers: ['Review ID', 'Email', 'Stop', 'Rating', 'Notes', 'Fixes', 'Author', 'At'],
  },
  /** Pod and mentor assignments. Role is member or mentor; an empty Pod takes someone out. */
  pods: {
    name: 'Pods',
    headers: ['At', 'Email', 'Pod', 'Role', 'Set by'],
  },
} as const

export type TabKey = keyof typeof TABS
export type Header<K extends TabKey> = (typeof TABS)[K]['headers'][number]

/** A row as the store hands it over: cells by header, plus where it lives. */
export type Row<K extends TabKey> = { row: number; cells: Record<Header<K>, string> }

/**
 * Turns a raw grid (header row first) into rows keyed by header. Throws if a
 * header the app needs is missing, naming it, so a renamed column is found in
 * one deploy rather than in a month of quietly empty cells.
 */
export function decode<K extends TabKey>(key: K, grid: string[][]): Row<K>[] {
  const tab = TABS[key]
  const [head = [], ...body] = grid
  const index = new Map(head.map((name, position) => [name.trim(), position]))
  const missing = tab.headers.filter((name) => !index.has(name))
  if (missing.length) throw new Error(`${tab.name} is missing columns: ${missing.join(', ')}`)
  return body
    .map((values, offset) => {
      const cells = {} as Record<Header<K>, string>
      for (const name of tab.headers as readonly Header<K>[]) {
        cells[name] = (values[index.get(name) ?? -1] ?? '').toString()
      }
      return { row: offset + 2, cells }
    })
    .filter((entry) => Object.values(entry.cells).some((value) => value !== ''))
}

/** A row's values in the order the Sheet's own header row has them. */
export function encode<K extends TabKey>(
  head: string[],
  cells: Partial<Record<Header<K>, string>>,
): string[] {
  return head.map((name) => (cells as Record<string, string | undefined>)[name.trim()] ?? '')
}
