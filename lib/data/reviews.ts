import 'server-only'
import { newId } from '@/lib/data/ids'
import { appendRows, rows } from '@/lib/store'

/**
 * The team's word on a stop: green, amber or red, notes and a fix list. Also
 * check-in notes from 27 to 30 Oct, which are the team's alone and never
 * reach a founder. Append-only; the newest review for a stop stands.
 */
export const RATINGS = ['green', 'amber', 'red'] as const
export type Rating = (typeof RATINGS)[number]
export type ReviewStop = '1' | '2' | '3' | 'checkin'

export type Review = {
  id: string
  email: string
  stop: ReviewStop
  rating: Rating | null
  notes: string
  fixes: string[]
  author: string
  at: string
}

export async function allReviews(): Promise<Review[]> {
  return (await rows('reviews')).flatMap(({ cells }) => {
    const stop = (['1', '2', '3', 'checkin'] as const).find((item) => item === cells.Stop.trim())
    if (!stop) return []
    return [
      {
        id: cells['Review ID'],
        email: cells.Email.trim().toLowerCase(),
        stop,
        rating: RATINGS.find((item) => item === cells.Rating.trim()) ?? null,
        notes: cells.Notes,
        fixes: cells.Fixes.split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        author: cells.Author,
        at: cells.At,
      },
    ]
  })
}

/** The standing review per founder for one stop. */
export function latestBy(reviews: Review[], stop: ReviewStop): Map<string, Review> {
  const latest = new Map<string, Review>()
  for (const review of reviews) if (review.stop === stop) latest.set(review.email, review)
  return latest
}

export async function addReview(input: Omit<Review, 'id' | 'at'>): Promise<string> {
  const id = newId('rv')
  await appendRows('reviews', [
    {
      'Review ID': id,
      Email: input.email,
      Stop: input.stop,
      Rating: input.rating ?? '',
      Notes: input.notes,
      Fixes: input.fixes.join('\n'),
      Author: input.author,
      At: new Date().toISOString(),
    },
  ])
  return id
}

/** Fix-list items become ticks under this ID, so a new review starts a fresh list. */
export function fixStepId(reviewId: string, index: number): string {
  return `fix:${reviewId}:${index}`
}
