/**
 * The three tracks Mesa sorts founders into. A staffing decision, never shown
 * to a founder, but it decides what they're offered:
 *
 *   autonomous  strong in tech; brings their own problem, so sees no bank
 *   structured  can build with some support; medium and hard problems
 *   guided      new to tech and AI; easy and medium problems
 *
 * Every track can write their own problem.
 */
import type { Difficulty } from './taxonomy'

export const TRACKS = ['autonomous', 'structured', 'guided'] as const
export type Track = (typeof TRACKS)[number]

export const TRACK_DIFFICULTIES: Record<Track, Difficulty[]> = {
  autonomous: [],
  structured: ['hard', 'medium'],
  guided: ['medium', 'easy'],
}

export function trackOf(raw: string): Track {
  return TRACKS.find((track) => track === raw.trim().toLowerCase()) ?? 'structured'
}

/** Autonomous founders skip the bank and go straight to writing their own problem. */
export function seesBank(track: Track): boolean {
  return TRACK_DIFFICULTIES[track].length > 0
}
