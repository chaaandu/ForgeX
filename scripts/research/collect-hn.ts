/**
 * Hacker News, through the public Algolia API. Finds Ask HN threads from 2025
 * onward that invite people to name a problem, pulls their top-level replies
 * plus comments that match pain-phrase searches, and keeps those that read
 * like somebody describing a real problem.
 *
 *   pnpm tsx scripts/research/collect-hn.ts [--since 2025-01-01] [--max 700]
 *
 * Writes data/research/raw/hn-candidates.json: a review queue, not signals.
 * Each candidate carries a short excerpt (400 characters at most) so a
 * reviewer can write a paraphrase in their own words, which then goes into
 * hn.jsonl through add-signal.ts. A deterministic trim of somebody's sentence
 * is not a paraphrase, so this script never writes hn.jsonl itself.
 *
 * Usernames are never read into the output. Delete hn-candidates.json once
 * the curated hn.jsonl exists; it is a working file.
 */

import { z } from 'zod'
import { RAW_DIR, arg, decodeEntities, fetchJson, writeJson } from './lib'
import { join } from 'node:path'

const API = 'https://hn.algolia.com/api/v1'
const OUT = join(RAW_DIR, 'hn-candidates.json')

/** Threads that ask people to name a problem. */
const THREAD_QUERIES = [
  'what do you wish existed',
  'what tool do you hate paying for',
  'what problem would you pay to solve',
  'biggest pain in your business',
  'SaaS idea',
  'small business problem',
  'what are you struggling with',
  'what software do you wish existed',
  'what problems do you have',
  'what would you pay for',
  'what is your biggest problem',
  'what tedious task',
  'problems worth solving',
  'what do you hate about',
  'wish someone would build',
  'pain points',
  'what software is missing',
  'what annoys you',
  'what is broken',
  'side project idea problem',
]

/**
 * Threads found by browsing the thread search above, picked by hand because
 * their replies are people naming problems in their own work and life.
 * Their top-level replies are kept on a lower bar than search hits.
 */
const CURATED_THREADS: Record<number, string> = {
  45823234: 'My family business runs on a 1993-era text-based UI',
  44948748: 'Services seen abroad: why do we not have them?',
  48045237: 'What do you still do manually in 2026 that should be automated?',
  46238354: 'AI coding is sexy, but accounting is the real low-hanging target',
  47638685: "How do you handle clients who don't pay on time?",
  44506493: 'What problem would you solve with unlimited resources?',
  43670167: 'What problem would you solve with unlimited time and money? (Apr 2025)',
  43883335: 'What problem would you solve with unlimited resources? (May 2025)',
  44351749: 'How much would you pay to solve the largest problem you face?',
  46228406: 'What hard problems are still underexplored?',
  44507780: "Is every company's internal wiki just broken by default?",
  44077121: 'Almost a thousand dollars for a 20 minute new patient visit?',
  47803524: 'Building a solo business is impossible?',
  43298663: 'How do you handle VAT / sales tax accounting as B2C SaaS?',
  44176510: 'Startup getting spammed with PayPal disputes',
  44019193: 'Do people actually pay for small web tools?',
  42777669: 'How are you preparing for PEPPOL?',
  44152012: 'How are parents who program teaching their kids today?',
  45523464: 'Most effective way to reduce excessive digital media consumption?',
  45085014: 'How do you fight YouTube addiction and procrastination?',
  43452945: 'Difficulties with going back to school',
  45073589: 'My advice after I applied to 450 positions before getting hired',
  48707536: 'Is there a list of employers with a record of not paying?',
  43244538: 'How much employee resume verification is done in practice?',
  42830018: 'What do you use for content moderation of UGC?',
  44051755: 'How do you promote your personal projects with a limited budget?',
  46705676: '2 years building a kids audio app as a solo dev',
  46709409: 'Amazon has deactivated my seller account',
  44784619: 'Has any of the Pivotal Tracker replacement attempts succeeded?',
  44815819: 'What do you dislike about ChatGPT and what needs improving?',
}

/** Searched directly against comments, outside any particular thread. */
const COMMENT_QUERIES = [
  'I would pay for',
  'I wish there was',
  'I wish someone would build',
  'nobody has solved',
  'still use spreadsheets',
  'hours every week',
  'biggest pain',
  'small business owner',
  'my wife runs',
  'my parents business',
  'frustrating as a freelancer',
  'clients pay late',
  'no good tool for',
  'hate paying for',
  'overpriced and clunky',
  'manual process',
  'every month I have to',
  'there is no good way to',
  // People describing a problem in somebody else's working life, which is
  // where the non-developer problems on HN tend to surface.
  'my dad runs',
  'my mom runs',
  'family business',
  'I run a small',
  'we run a small',
  'restaurant owner',
  'small shop',
  'my landlord',
  'contractor never',
  'bookkeeping is',
  'receipts every',
  'chasing invoices',
  'insurance claim',
  'elderly parents',
  'caregiver',
  'my kids school',
  'as a teacher',
  'as a nurse',
  'tax season',
  'meal planning',
  'job search is',
  'applying to jobs',
  'my accountant',
  'farmers',
  'warehouse',
  'tenants',
  'clinic',
  'paperwork',
  'whatsapp groups',
  'excel sheet',
]

/**
 * Searched against Ask HN posts themselves. A post titled "How do you
 * handle..." or "Is there a tool for..." is somebody stating a problem.
 */
const ASK_QUERIES = [
  'how do you handle',
  'how do you manage',
  'is there a tool',
  'is there an app',
  'anyone else struggling',
  'how do you track',
  'how do you keep track',
  'how do you deal with',
  'why is it so hard',
  'what do you use to',
  'how do you organize',
  'how do you find',
  'best way to manage',
  'looking for a tool',
  'frustrated with',
  'tired of',
  'how do small businesses',
  'how do you get clients',
  'how do you price',
  'how do you invoice',
  'how do you budget',
  'how do you learn',
  'how do you plan',
]
const ASK_TITLE =
  /^(how (do|can|should) (you|i|we)|is there (a|an|any)|anyone else|what do you use|struggling|why is it so hard|how to|best way|looking for|tired of|frustrated)/i

const PAIN = [
  /\bfrustrat/i,
  /\bannoy/i,
  /\bhate\b/i,
  /\bpain\b/i,
  /\bpainful\b/i,
  /\bwish\b/i,
  /\bstruggl/i,
  /\bwast(e|ed|ing)\b/i,
  /\btedious\b/i,
  /\bmanual(ly)?\b/i,
  /\bspreadsheet/i,
  /\bnobody\b/i,
  /\bno good\b/i,
  /\bcan'?t find\b/i,
  /\bhard to\b/i,
  /\bexpensive\b/i,
  /\boverpriced\b/i,
  /\bwould pay\b/i,
  /\bpay for\b/i,
  /\bbroken\b/i,
  /\bclunky\b/i,
  /\bnightmare\b/i,
  /\bhours\b/i,
  /\bevery (day|week|month)\b/i,
  /\bkeep (forgetting|losing|having)\b/i,
  /\bno way to\b/i,
  /\bimpossible\b/i,
]

/** Self-promotion and pointers to existing products are not problems. */
const NOT_A_PROBLEM = [
  /\b(i|we) (built|made|launched|created|am building|are building)\b/i,
  /\bshameless plug\b/i,
  /\bmy (startup|company|product|app)\b/i,
  /^\s*(check out|try|there'?s|have you tried|this exists|already exists)\b/i,
  /\bshow hn\b/i,
]

const hitSchema = z.object({
  objectID: z.string(),
  created_at: z.string(),
  created_at_i: z.number(),
  title: z.string().nullable().optional(),
  story_title: z.string().nullable().optional(),
  comment_text: z.string().nullable().optional(),
  story_text: z.string().nullable().optional(),
  story_id: z.number().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  num_comments: z.number().nullable().optional(),
})
const pageSchema = z.object({ hits: z.array(hitSchema), nbPages: z.number() })
type Hit = z.infer<typeof hitSchema>

type Candidate = {
  objectID: string
  url: string
  date: string
  thread: string
  excerpt: string
  score: number
  via: string
}

function url(path: string, params: Record<string, string>): string {
  return `${API}/${path}?${new URLSearchParams(params).toString()}`
}

function scoreText(text: string): number {
  if (text.length < 80 || text.length > 3000) return 0
  if (NOT_A_PROBLEM.some((pattern) => pattern.test(text))) return 0
  const hits = PAIN.filter((pattern) => pattern.test(text)).length
  if (hits === 0) return 0
  const lengthBonus = text.length > 300 ? 1 : 0
  return hits + lengthBonus
}

function excerpt(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > 400 ? `${clean.slice(0, 397)}...` : clean
}

async function main(): Promise<void> {
  const since = arg('since') ?? '2025-01-01'
  const max = Number(arg('max') ?? 700)
  const sinceEpoch = Math.floor(new Date(`${since}T00:00:00Z`).getTime() / 1000)
  const numericFilters = `created_at_i>${sinceEpoch}`

  // 1. Threads
  const threads = new Map<number, string>()
  for (const query of THREAD_QUERIES) {
    for (const tags of ['ask_hn', 'story']) {
      const page = await fetchJson(
        url('search', { query, tags, numericFilters, hitsPerPage: '30' }),
        pageSchema,
      )
      for (const hit of page.hits) {
        const title = hit.title ?? ''
        if ((hit.num_comments ?? 0) < 8) continue
        if (!/^(ask hn|tell hn)|\?$/i.test(title)) continue
        threads.set(Number(hit.objectID), title)
      }
    }
  }
  console.log(`${threads.size} threads`)

  // 2. Top-level replies in those threads
  const candidates = new Map<string, Candidate>()
  const consider = (hit: Hit, thread: string, via: string, topLevelOnly: boolean, minScore = 2) => {
    const raw = hit.comment_text
    if (!raw) return
    if (topLevelOnly && hit.parent_id !== hit.story_id) return
    const text = decodeEntities(raw)
    const score = scoreText(text)
    if (score < minScore) return
    const prior = candidates.get(hit.objectID)
    if (prior && prior.score >= score) return
    candidates.set(hit.objectID, {
      objectID: hit.objectID,
      url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
      date: hit.created_at.slice(0, 10),
      thread,
      excerpt: excerpt(text),
      score,
      via,
    })
  }

  for (const [storyId, title] of threads) {
    const page = await fetchJson(
      url('search', { tags: `comment,story_${storyId}`, hitsPerPage: '1000' }),
      pageSchema,
    )
    for (const hit of page.hits) consider(hit, title, 'thread', true)
  }
  console.log(`${candidates.size} candidates after threads`)

  // 2b. Hand-picked threads, on a lower bar and with a bonus so they sort first
  for (const [storyId, title] of Object.entries(CURATED_THREADS)) {
    const page = await fetchJson(
      url('search', { tags: `comment,story_${storyId}`, hitsPerPage: '1000' }),
      pageSchema,
    )
    for (const hit of page.hits) consider(hit, title, 'curated', true, 1)
  }
  for (const candidate of candidates.values()) {
    if (candidate.via === 'curated') candidate.score += 3
  }
  console.log(`${candidates.size} candidates after curated threads`)

  // 3. Pain-phrase comment searches anywhere on the site
  for (const query of COMMENT_QUERIES) {
    for (let pageNo = 0; pageNo < 2; pageNo++) {
      const page = await fetchJson(
        url('search_by_date', {
          query: `"${query}"`,
          tags: 'comment',
          numericFilters,
          hitsPerPage: '100',
          page: String(pageNo),
        }),
        pageSchema,
      )
      for (const hit of page.hits) consider(hit, hit.story_title ?? '', `search:${query}`, false, 3)
      if (pageNo + 1 >= page.nbPages) break
    }
  }
  console.log(`${candidates.size} candidates after searches`)

  // 4. Ask HN posts that are themselves somebody stating a problem
  for (const query of ASK_QUERIES) {
    for (let pageNo = 0; pageNo < 2; pageNo++) {
      const page = await fetchJson(
        url('search', {
          query,
          tags: 'ask_hn',
          numericFilters: `${numericFilters},num_comments>=3`,
          hitsPerPage: '100',
          page: String(pageNo),
        }),
        pageSchema,
      )
      for (const hit of page.hits) {
        const title = (hit.title ?? '').replace(/^ask hn:\s*/i, '')
        if (!ASK_TITLE.test(title) || candidates.has(hit.objectID)) continue
        const body = decodeEntities(hit.story_text ?? '')
        const text = body ? `${title} | ${body}` : title
        if (NOT_A_PROBLEM.some((pattern) => pattern.test(body))) continue
        candidates.set(hit.objectID, {
          objectID: hit.objectID,
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          date: hit.created_at.slice(0, 10),
          thread: title,
          excerpt: excerpt(text),
          score: 2 + PAIN.filter((pattern) => pattern.test(text)).length,
          via: `ask:${query}`,
        })
      }
      if (pageNo + 1 >= page.nbPages) break
    }
  }
  console.log(`${candidates.size} candidates after Ask HN posts`)

  const sorted = [...candidates.values()]
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, max)
  writeJson(OUT, sorted)
  console.log(`Wrote ${sorted.length} to ${OUT}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
