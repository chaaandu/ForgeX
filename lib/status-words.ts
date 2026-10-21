/**
 * The words in the Hackathon tab's Status column, and the Events in the
 * Problem history tab. The site writes them; the Sheet offers the statuses as
 * a dropdown so the tab can be filtered by them.
 */
export const STATUS_WORDS = {
  none: 'Not started',
  waiting: 'Problem in review',
  rejected: 'Problem rejected',
  approved: 'Problem approved',
  changes: 'Approved with changes',
  bank: 'Picked from bank',
  scope: 'MVP scope submitted',
  prototype: 'Prototype submitted',
  launch: 'Launch submitted',
  pitch: 'Pitch submitted',
} as const

export const STATUS_OPTIONS = Object.values(STATUS_WORDS)

/** What a row in the Problem history tab records. */
export const EVENT_WORDS = {
  submitted: 'Submitted',
  approved: 'Approved',
  changes: 'Approved with changes',
  rejected: 'Rejected',
  picked: 'Picked from bank',
} as const

/** Where a problem came from, in the Source column of Problem history. */
export const SOURCE_WORDS = { own: 'Own', bank: 'Bank' } as const
