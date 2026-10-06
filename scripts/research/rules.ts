/**
 * The deterministic rules from docs/RESEARCH.md, in one place so that the
 * step that applies a rule and the step that checks it cannot disagree:
 * hard drops, balance quotas, rarity, the signal line, and the writing lint.
 */

import { INDUSTRY_IDS, LEARN_IDS, RARITIES, SIDE_IDS, type Rarity } from '../../lib/taxonomy'
import type { Signal } from './schema'
import type { DropReason, Scored } from './schema-steps'

// ---------------------------------------------------------------------------
// Evidence

/** Signals older than this are ignored as evidence. 2025 and 2026 are preferred. */
export const MIN_SIGNAL_DATE = '2024-01'

/**
 * The evidence behind a candidate: its IDs resolved against the raw files,
 * one per URL, and nothing dated before MIN_SIGNAL_DATE.
 */
export function resolveSignals(ids: string[], byId: Map<string, Signal>): Signal[] {
  const seen = new Set<string>()
  const out: Signal[] = []
  for (const id of ids) {
    const signal = byId.get(id)
    if (!signal || seen.has(signal.url) || signal.date.slice(0, 7) < MIN_SIGNAL_DATE) continue
    seen.add(signal.url)
    out.push(signal)
  }
  return out
}

export function sourceTypes(signals: Signal[]): number {
  return new Set(signals.map((signal) => signal.source)).size
}

// ---------------------------------------------------------------------------
// Hard drops

export const MIN_SIGNALS = 3
export const MIN_SOURCE_TYPES = 2

export function dropReasons(record: Scored, evidence: Signal[]): DropReason[] {
  const reasons: DropReason[] = []
  if (record.flags.hardware) reasons.push('needs hardware')
  if (record.flags.regulatedData) reasons.push('needs regulated data')
  if (record.flags.governmentOnly) reasons.push('government is the only buyer')
  if (record.flags.incumbentFeature) reasons.push('a feature an incumbent will ship')
  if (record.scores.buildability.value <= 2) reasons.push('buildability 2 or below')
  if (evidence.length < MIN_SIGNALS) reasons.push('fewer than 3 independent signals')
  if (sourceTypes(evidence) < MIN_SOURCE_TYPES) reasons.push('only one source type')
  return reasons
}

// ---------------------------------------------------------------------------
// Balance quotas

export const BANK_MIN = 200
export const BANK_MAX = 300
export const INDUSTRY_MIN_REPRESENTED = 10
export const INDUSTRY_MAX_SHARE = 0.15
export const SIDE_MIN_SHARE = 0.15
export const INDIA_MIN_SHARE = 0.4
export const LEARN_MIN_COUNT = 12
export const RARITY_TARGET: Record<Rarity, number> = {
  rare: 0.25,
  epic: 0.45,
  legendary: 0.24,
  mythic: 0.06,
}
/** Each rarity share must be within this many percentage points of its target. */
export const RARITY_TOLERANCE = 3

/** The first industry tag is the primary one, and the one quotas count. */
export function primaryIndustry(record: { industries: readonly string[] }): string {
  return record.industries[0] ?? 'unknown'
}

export function industryCap(size: number): number {
  return Math.floor(size * INDUSTRY_MAX_SHARE)
}

/** At least 15% of the bank. */
export function sideMin(size: number): number {
  return Math.ceil(size * SIDE_MIN_SHARE)
}

export function indiaMin(size: number): number {
  return Math.ceil(size * INDIA_MIN_SHARE)
}

type Tagged = {
  industries: readonly string[]
  side: string
  geo: string
  learn: readonly string[]
  rarity?: string
}

export type QuotaRow = { quota: string; actual: string; target: string; ok: boolean }

function count<T>(items: T[], key: (item: T) => string | readonly string[]): Map<string, number> {
  const out = new Map<string, number>()
  for (const item of items) {
    const value = key(item)
    for (const one of typeof value === 'string' ? [value] : value)
      out.set(one, (out.get(one) ?? 0) + 1)
  }
  return out
}

function pct(part: number, whole: number): string {
  return whole === 0 ? '0%' : `${((100 * part) / whole).toFixed(1)}%`
}

/** Every balance quota, measured against a bank. `rarity` rows appear when records carry one. */
export function quotaReport(bank: Tagged[]): QuotaRow[] {
  const size = bank.length
  const rows: QuotaRow[] = []
  rows.push({
    quota: 'Bank size',
    actual: String(size),
    target: `${BANK_MIN} to ${BANK_MAX}`,
    ok: size >= BANK_MIN && size <= BANK_MAX,
  })

  const industries = count(bank, primaryIndustry)
  rows.push({
    quota: 'Industries represented',
    actual: String(industries.size),
    target: `at least ${INDUSTRY_MIN_REPRESENTED}`,
    ok: industries.size >= INDUSTRY_MIN_REPRESENTED,
  })
  for (const id of INDUSTRY_IDS) {
    const n = industries.get(id) ?? 0
    rows.push({
      quota: `Industry ${id}`,
      actual: `${n} (${pct(n, size)})`,
      target: `at most ${industryCap(size)} (15%)`,
      ok: n <= industryCap(size),
    })
  }

  const sides = count(bank, (item) => item.side)
  for (const id of SIDE_IDS) {
    const n = sides.get(id) ?? 0
    rows.push({
      quota: `Side ${id}`,
      actual: `${n} (${pct(n, size)})`,
      target: `at least ${sideMin(size)} (15%)`,
      ok: n >= sideMin(size),
    })
  }

  const india = bank.filter((item) => item.geo === 'IN').length
  rows.push({
    quota: 'Geography IN',
    actual: `${india} (${pct(india, size)})`,
    target: `at least ${indiaMin(size)} (40%)`,
    ok: india >= indiaMin(size),
  })

  if (bank.some((item) => item.rarity)) {
    const rarities = count(bank, (item) => item.rarity ?? 'none')
    for (const id of RARITIES) {
      const n = rarities.get(id) ?? 0
      const share = size === 0 ? 0 : (100 * n) / size
      const target = 100 * RARITY_TARGET[id]
      rows.push({
        quota: `Rarity ${id}`,
        actual: `${n} (${share.toFixed(1)}%)`,
        target: `${target}% ±${RARITY_TOLERANCE}`,
        ok: Math.abs(share - target) <= RARITY_TOLERANCE,
      })
    }
  }

  const learn = count(bank, (item) => item.learn)
  for (const id of LEARN_IDS) {
    const n = learn.get(id) ?? 0
    rows.push({
      quota: `Learn ${id}`,
      actual: String(n),
      target: `at least ${LEARN_MIN_COUNT}`,
      ok: n >= LEARN_MIN_COUNT,
    })
  }
  return rows
}

// ---------------------------------------------------------------------------
// Rarity: ambition, adjusted for the inverse of buildability. Never quality.

export function ambition(record: Scored): number {
  const { pain, openness, novelty, buildability } = record.scores
  const core = Math.cbrt(pain.value * openness.value * novelty.value)
  return Number((core * (1 + 0.1 * (5 - buildability.value))).toFixed(4))
}

/** Rarity counts for a bank of `size`, summing exactly to `size`, closest to the targets. */
export function rarityCounts(size: number): Record<Rarity, number> {
  const raw = RARITIES.map((id) => ({ id, exact: size * RARITY_TARGET[id] }))
  const counts = Object.fromEntries(raw.map((item) => [item.id, Math.floor(item.exact)])) as Record<
    Rarity,
    number
  >
  let left = size - RARITIES.reduce((sum, id) => sum + counts[id], 0)
  for (const item of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break
    counts[item.id]++
    left--
  }
  return counts
}

// ---------------------------------------------------------------------------
// The signal line and strength meter

export function yearsText(dates: string[]): string {
  const years = [...new Set(dates.map((date) => date.slice(0, 4)))].sort()
  if (years.length <= 1) return years[0] ?? ''
  return `${years.slice(0, -1).join(', ')} and ${years[years.length - 1]}`
}

export function signalLine(evidence: Signal[]): string {
  return `Seen across ${evidence.length} posts in ${yearsText(evidence.map((signal) => signal.date))}`
}

/**
 * The count on a log scale (3 signals is 1, each doubling adds one), nudged up
 * half a point for each source type beyond two, clamped to 1..5.
 */
export function signalStrength(evidence: Signal[]): number {
  const n = Math.max(evidence.length, 1)
  const base = 1 + Math.log2(n / MIN_SIGNALS)
  const diversity = 0.5 * Math.max(0, sourceTypes(evidence) - MIN_SOURCE_TYPES)
  return Math.min(5, Math.max(1, Math.round(base + diversity)))
}

// ---------------------------------------------------------------------------
// Writing rules

const SOLUTION_WORDS: [RegExp, string][] = [
  [/\bapps?\b/i, '"app"'],
  [/\bplatforms?\b/i, '"platform"'],
  [/\bAI[\s-]+powered\b/i, '"AI-powered"'],
  [/\btools? that\b/i, '"tool that"'],
]

const PERSONA_PATTERNS: RegExp[] = [
  /\b(Meet|Imagine|Take|Consider|Picture) [A-Z][a-z]+\b/,
  /\b[A-Z][a-z]+, (a|an) (\d{1,2}|[a-z]+)[- ]year[- ]old\b/,
  /\bnamed [A-Z][a-z]+\b/,
]

/** Common first names: a named persona is a person, and a person has a name. */
const FIRST_NAMES = new Set(
  (
    'Aarav Aditi Aditya Ajay Amit Anil Anita Anjali Ankit Arjun Asha Deepak Divya Gita Kavya ' +
    'Kiran Lakshmi Manoj Meena Neha Nikhil Pooja Priya Rahul Raj Rajesh Ramesh Ravi Rohan Rohit ' +
    'Sanjay Sita Sneha Sunita Suresh Vijay Vikram Alice Anna Bob David Emma James John Maria ' +
    'Mary Michael Sarah Tom'
  ).split(' '),
)

/** Brands that must not appear in a title, plus every player named in the scored file. */
const BRANDS = [
  'Amazon',
  'BigBasket',
  'Blinkit',
  'ChatGPT',
  'Claude',
  'Excel',
  'Facebook',
  'Flipkart',
  'Google',
  'Instagram',
  'LinkedIn',
  'Meta',
  'Microsoft',
  'Myntra',
  'Notion',
  'Nykaa',
  'Ola',
  'OpenAI',
  'PayPal',
  'Paytm',
  'PhonePe',
  'Razorpay',
  'Shopify',
  'Slack',
  'Stripe',
  'Swiggy',
  'Tally',
  'Uber',
  'WhatsApp',
  'YouTube',
  'Zepto',
  'Zoho',
  'Zomato',
]

/**
 * Player names that read as brands: camel-cased (PhonePe), containing a digit,
 * or two or more capitalised words (Urban Company). A single capitalised word
 * is too often a generic approach ("Spreadsheets") to fail a title over.
 */
export function brandsFromPlayers(names: string[]): string[] {
  return [
    ...new Set(
      names
        .map((name) => name.trim())
        .filter(
          (name) =>
            /^[A-Z]/.test(name) &&
            (/[a-z][A-Z]/.test(name) ||
              /\d/.test(name) ||
              /^([A-Z][\w&.-]*\s+)+[A-Z][\w&.-]*$/.test(name)),
        ),
    ),
  ]
}

export function sentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'‘“(])/)
    .filter((part) => part.trim().length > 0)
}

export type LintIssue = { field: 'title' | 'problem' | 'challenge'; message: string }

export function lint(
  record: { title: string; problem: string; challenge: string },
  extraBrands: string[] = [],
): LintIssue[] {
  const issues: LintIssue[] = []
  const { title, problem, challenge } = record

  const words = title.trim().split(/\s+/).length
  if (words >= 10) issues.push({ field: 'title', message: `${words} words, must be under ten` })
  if (/[:?]/.test(title))
    issues.push({ field: 'title', message: 'contains a colon or question mark' })
  for (const brand of [...BRANDS, ...extraBrands]) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (brand.length >= 3 && new RegExp(`\\b${escaped}\\b`).test(title)) {
      issues.push({ field: 'title', message: `names a brand (${brand})` })
    }
  }

  const count = sentences(problem).length
  if (count < 2 || count > 3)
    issues.push({ field: 'problem', message: `${count} sentences, must be 2 or 3` })
  for (const [pattern, word] of SOLUTION_WORDS) {
    if (pattern.test(problem))
      issues.push({ field: 'problem', message: `uses the solution word ${word}` })
    if (pattern.test(challenge))
      issues.push({ field: 'challenge', message: `uses the solution word ${word}` })
  }
  const persona =
    PERSONA_PATTERNS.some((pattern) => pattern.test(problem)) ||
    (problem.match(/\b[A-Z][a-z]+\b/g) ?? []).some((word) => FIRST_NAMES.has(word))
  if (persona) issues.push({ field: 'problem', message: 'names a persona' })

  if (/\n/.test(challenge.trim()))
    issues.push({ field: 'challenge', message: 'more than one line' })
  if (/\?/.test(challenge))
    issues.push({ field: 'challenge', message: 'is a question, not an instruction' })
  if (
    /^(build|create|develop|launch|design|make) (an?|the|your) [\w-]+ (app|platform|tool|website|bot)\b/i.test(
      challenge,
    )
  ) {
    issues.push({ field: 'challenge', message: 'names the product instead of the task' })
  }
  return issues
}
