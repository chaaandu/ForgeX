import { z } from 'zod'
import { INDUSTRY_IDS, SIDE_IDS } from '../../lib/taxonomy'

/**
 * One piece of evidence that somebody, somewhere, has a problem. One JSON
 * object per line in `data/research/raw/<file>.jsonl`.
 *
 * Never a username, never a long quote: a paraphrase of 25 words or fewer and
 * the link it came from.
 */
export const SOURCES = [
  'reddit',
  'x',
  'quora',
  'hn',
  'producthunt',
  'g2',
  'capterra',
  'playstore',
  'appstore',
  'fixmyitch',
  'yc',
  'news',
  'forum',
  'other',
] as const

export const signalSchema = z.object({
  /** `<source>-<first 10 hex chars of sha1(url)>`; makes duplicates collapse. */
  id: z.string().regex(/^[a-z]+-[0-9a-f]{10}$/),
  source: z.enum(SOURCES),
  url: z.string().url(),
  /** YYYY-MM-DD, or YYYY-MM when only the month is known. */
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
  paraphrase: z
    .string()
    .min(12)
    .refine(
      (text) => text.trim().split(/\s+/).length <= 25,
      'Paraphrase must be 25 words or fewer',
    ),
  industryHint: z.enum(INDUSTRY_IDS).optional(),
  sideHint: z.enum(SIDE_IDS).optional(),
  geo: z.enum(['IN', 'global']),
})

export type Signal = z.infer<typeof signalSchema>
