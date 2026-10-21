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
      'Last active',
      'Updated at',
      'Reopened',
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
      'Task',
      'Expect',
      'Further',
    ],
  },
  internal: {
    name: 'Problems internal',
    headers: ['ID', 'Evidence', 'Sources', 'Why now', 'Players', 'Scores', 'Total'],
  },
  /**
   * The hackathon at a glance, one row a founder: their group, who reviews
   * their problem, their POC at Mesa, where they stand and the problem they
   * are building. Written for a person to read and filter, so it carries
   * words, never ids or blobs. The one reference it keeps is the bank's own
   * number for a problem picked from the bank, at the end. Status and
   * Progress are written by the site.
   */
  hackathon: {
    name: 'Hackathon',
    headers: [
      'Name',
      'Email',
      'Group',
      'Reviewer',
      'POC',
      'Status',
      'Progress',
      'Problem',
      'Reopened',
      'Problem no.',
    ],
  },
  /**
   * Everything a founder has handed in, one row a founder, in the order they
   * hand it in: the research behind their problem, the MVP scope, the
   * prototype, the launch and the pitch, each stage with when it was
   * submitted. A cell is the link itself.
   */
  submissions: {
    name: 'Submissions',
    headers: [
      'Name',
      'Email',
      'Group',
      'Problem',
      'Primary research',
      'Secondary research',
      'MVP scope',
      'Scope at',
      'GitHub',
      'Prototype',
      'Proof of progress',
      'Prototype at',
      'LinkedIn post',
      'More posts',
      'Live link',
      'Documentation',
      'Launch at',
      'Pitch deck',
      'Loom',
      'Pitch at',
    ],
  },
  /**
   * Where to find each founder's work, one row a founder: the GitHub,
   * LinkedIn and portfolio from their profile, written again whenever they
   * change one. For a person to read; the site keeps the record in Founders.
   */
  profiles: {
    name: 'Profiles',
    headers: ['Name', 'Email', 'Group', 'GitHub', 'LinkedIn', 'Portfolio', 'Updated at'],
  },
  history: {
    name: 'Problem history',
    headers: [
      'Time',
      'Name',
      'Email',
      'Version',
      'Event',
      'By',
      'Industry',
      'Title',
      'Person',
      'Problem',
      'Promise',
      'Why you',
      'Plan',
      'Primary research',
      'Secondary research',
      'Notes',
    ],
  },
  events: {
    name: 'Events',
    headers: ['At', 'Email', 'Kind', 'Data'],
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
