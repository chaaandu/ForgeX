import 'server-only'

/**
 * The three tracks Mesa sorts founders into. A staffing decision, never shown
 * to a founder, not even as a level: it decides which plan they get, and the
 * plan simply reads differently. The names live in the console only.
 *
 *   guided      new to tech and AI; one core flow, step-by-step build cards
 *   structured  can use the tools; 2 or 3 connected flows, with direction
 *   autonomous  builds on their own; a full product with AI at the centre
 */
export const TRACKS = ['guided', 'structured', 'autonomous'] as const
export type Track = (typeof TRACKS)[number]

/** An unknown or empty track reads as structured, the middle of the three. */
export function trackOf(raw: string): Track {
  return TRACKS.find((track) => track === raw.trim().toLowerCase()) ?? 'structured'
}

/**
 * The tracks' names, for the console. Kept here, server only, rather than in
 * content/copy.ts, which ships to every browser: the leak test fails the build
 * if a track's name reaches a client bundle.
 */
export const TRACK_LABELS: Record<Track, string> = {
  guided: 'Guided',
  structured: 'Structured',
  autonomous: 'Autonomous',
}
