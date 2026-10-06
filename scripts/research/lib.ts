/**
 * Shared helpers for the research pipeline: signal IDs, a polite fetch that
 * honours robots.txt and keeps to one request a second per host, and JSONL
 * read/append with Zod validation.
 *
 * Nothing here logs in, sends a cookie or stores who said something.
 */

import { createHash } from 'node:crypto'
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import type { z } from 'zod'
import { signalSchema, type Signal } from './schema'

export const USER_AGENT = 'ForgeX-research/1.0 (+https://mesaschool.co)'
/** The token matched against `User-agent:` lines in robots.txt. */
const ROBOTS_TOKEN = 'forgex-research'
const MIN_GAP_MS = 1000

export const ROOT = process.cwd()
export const RESEARCH_DIR = join(ROOT, 'data', 'research')
export const RAW_DIR = join(RESEARCH_DIR, 'raw')
export const PROMPTS_DIR = join(ROOT, 'scripts', 'research', 'prompts')

export const PATHS = {
  candidates: join(RESEARCH_DIR, 'candidates.json'),
  scored: join(RESEARCH_DIR, 'scored.json'),
  dropped: join(RESEARCH_DIR, 'dropped.json'),
  shortlist: join(RESEARCH_DIR, 'shortlist.json'),
  report: join(RESEARCH_DIR, 'REPORT.md'),
  problems: join(ROOT, 'data', 'problems.json'),
  internal: join(ROOT, 'data', 'problems.internal.json'),
}

// ---------------------------------------------------------------------------
// IDs and text

export function sha1(text: string): string {
  return createHash('sha1').update(text).digest('hex')
}

/** `<source>-<first 10 hex chars of sha1(url)>`, the shape `signalSchema` expects. */
export function signalId(source: Signal['source'], url: string): string {
  return `${source}-${sha1(normaliseUrl(url)).slice(0, 10)}`
}

/** Strips tracking parameters and a trailing slash so one page has one ID. */
export function normaliseUrl(url: string): string {
  const parsed = new URL(url)
  for (const key of [...parsed.searchParams.keys()]) {
    if (/^(utm_|ref$|ref_src$|fbclid$|gclid$|si$)/i.test(key)) parsed.searchParams.delete(key)
  }
  let out = parsed.toString()
  if (out.endsWith('/') && parsed.pathname !== '/') out = out.slice(0, -1)
  return out
}

export function wordCount(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function decodeEntities(text: string): string {
  return text
    .replace(/<p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

// ---------------------------------------------------------------------------
// Polite fetch

type Rule = { allow: boolean; path: string }
const robotsCache = new Map<string, Rule[]>()
const lastHit = new Map<string, number>()

async function waitTurn(host: string): Promise<void> {
  const last = lastHit.get(host) ?? 0
  const gap = Date.now() - last
  if (gap < MIN_GAP_MS) await sleep(MIN_GAP_MS - gap)
  lastHit.set(host, Date.now())
}

/**
 * Parses the groups that apply to us: a group naming our token wins, else `*`.
 * Unavailable robots.txt (4xx) means everything is allowed; a server error
 * means nothing is, per RFC 9309.
 */
export function parseRobots(body: string): Rule[] {
  const groups: { agents: string[]; rules: Rule[] }[] = []
  let current: { agents: string[]; rules: Rule[] } | undefined
  let lastWasAgent = false
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim()
    const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line)
    if (!match) continue
    const key = (match[1] ?? '').toLowerCase()
    const value = (match[2] ?? '').trim()
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
      lastWasAgent = true
      continue
    }
    lastWasAgent = false
    if (!current) continue
    if (key === 'allow' || key === 'disallow') {
      if (key === 'disallow' && value === '') continue
      current.rules.push({ allow: key === 'allow', path: value })
    }
  }
  const mine = groups.filter((group) =>
    group.agents.some((agent) => ROBOTS_TOKEN.includes(agent) && agent !== '*'),
  )
  const chosen = mine.length > 0 ? mine : groups.filter((group) => group.agents.includes('*'))
  return chosen.flatMap((group) => group.rules)
}

function ruleMatches(rulePath: string, path: string): boolean {
  const anchored = rulePath.endsWith('$')
  const body = anchored ? rulePath.slice(0, -1) : rulePath
  const pattern = body
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(path)
}

/** Longest matching rule wins; on a tie, allow wins. */
export function isAllowed(rules: Rule[], pathAndQuery: string): boolean {
  let best: Rule | undefined
  for (const rule of rules) {
    if (!ruleMatches(rule.path, pathAndQuery)) continue
    if (
      !best ||
      rule.path.length > best.path.length ||
      (rule.path.length === best.path.length && rule.allow)
    ) {
      best = rule
    }
  }
  return best ? best.allow : true
}

async function robotsFor(origin: string): Promise<Rule[]> {
  const cached = robotsCache.get(origin)
  if (cached) return cached
  const host = new URL(origin).host
  await waitTurn(host)
  let rules: Rule[] = []
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    })
    if (response.ok) rules = parseRobots(await response.text())
    else if (response.status >= 500) rules = [{ allow: false, path: '/' }]
  } catch {
    rules = [{ allow: false, path: '/' }]
  }
  robotsCache.set(origin, rules)
  return rules
}

export class RobotsDisallowed extends Error {
  constructor(url: string) {
    super(`robots.txt disallows ${url}`)
    this.name = 'RobotsDisallowed'
  }
}

/** Checks robots.txt for the URL's host without fetching the URL itself. */
export async function robotsAllows(url: string): Promise<boolean> {
  const parsed = new URL(url)
  const rules = await robotsFor(parsed.origin)
  return isAllowed(rules, parsed.pathname + parsed.search)
}

/**
 * Fetches with our User-Agent, after robots.txt says yes, at most once a
 * second per host. Retries 429 and 5xx twice with a growing pause.
 */
export async function politeFetch(url: string, init: RequestInit = {}): Promise<Response> {
  if (!(await robotsAllows(url))) throw new RobotsDisallowed(url)
  const host = new URL(url).host
  for (let attempt = 0; ; attempt++) {
    await waitTurn(host)
    const response = await fetch(url, {
      ...init,
      headers: { 'User-Agent': USER_AGENT, ...(init.headers ?? {}) },
    })
    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await sleep(2000 * (attempt + 1))
      continue
    }
    return response
  }
}

export async function fetchJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const response = await politeFetch(url)
  if (!response.ok) throw new Error(`${response.status} from ${url}`)
  return schema.parse(await response.json())
}

export async function fetchText(url: string): Promise<string> {
  const response = await politeFetch(url)
  if (!response.ok) throw new Error(`${response.status} from ${url}`)
  return response.text()
}

export async function fetchBytes(url: string): Promise<Uint8Array> {
  const response = await politeFetch(url)
  if (!response.ok) throw new Error(`${response.status} from ${url}`)
  return new Uint8Array(await response.arrayBuffer())
}

// ---------------------------------------------------------------------------
// Files

export function ensureDir(file: string): void {
  mkdirSync(dirname(file), { recursive: true })
}

export function readJson<T>(file: string, schema: z.ZodType<T>): T {
  if (!existsSync(file)) throw new Error(`Missing ${file}. Run the step that writes it first.`)
  const parsed = schema.safeParse(JSON.parse(readFileSync(file, 'utf8')))
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 10)
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`${file} does not match its schema:\n${issues}`)
  }
  return parsed.data
}

export function writeJson(file: string, value: unknown): void {
  ensureDir(file)
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

export type JsonlRead<T> = { rows: T[]; errors: { line: number; message: string }[] }

export function readJsonl<T>(file: string, schema: z.ZodType<T>): JsonlRead<T> {
  const out: JsonlRead<T> = { rows: [], errors: [] }
  if (!existsSync(file)) return out
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    if (!line.trim()) return
    let value: unknown
    try {
      value = JSON.parse(line)
    } catch {
      out.errors.push({ line: index + 1, message: 'not JSON' })
      return
    }
    const parsed = schema.safeParse(value)
    if (parsed.success) out.rows.push(parsed.data)
    else
      out.errors.push({
        line: index + 1,
        message: parsed.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; '),
      })
  })
  return out
}

/** Every `*.jsonl` under data/research/raw, validated, de-duplicated by ID and by URL. */
export function readAllSignals(): { signals: Signal[]; errors: string[] } {
  const signals: Signal[] = []
  const errors: string[] = []
  const ids = new Set<string>()
  const urls = new Set<string>()
  if (!existsSync(RAW_DIR)) return { signals, errors }
  for (const name of readdirSync(RAW_DIR).sort()) {
    if (!name.endsWith('.jsonl')) continue
    const { rows, errors: bad } = readJsonl(join(RAW_DIR, name), signalSchema)
    for (const error of bad) errors.push(`${name}:${error.line} ${error.message}`)
    for (const row of rows) {
      const url = normaliseUrl(row.url)
      if (ids.has(row.id) || urls.has(url)) continue
      ids.add(row.id)
      urls.add(url)
      signals.push(row)
    }
  }
  return { signals, errors }
}

export type SignalInput = Omit<Signal, 'id'> & { id?: string }

/**
 * Validates and appends signals to a JSONL file, skipping any whose ID or URL
 * is already there (or already earlier in the same batch). Returns what
 * happened to each, so a caller can report it.
 */
export function appendSignals(
  file: string,
  inputs: SignalInput[],
): { added: Signal[]; duplicates: number; invalid: { input: SignalInput; message: string }[] } {
  const existing = readJsonl(file, signalSchema).rows
  const ids = new Set(existing.map((row) => row.id))
  const urls = new Set(existing.map((row) => normaliseUrl(row.url)))
  const added: Signal[] = []
  const invalid: { input: SignalInput; message: string }[] = []
  let duplicates = 0
  for (const input of inputs) {
    let candidate: unknown
    try {
      candidate = {
        ...input,
        id: signalId(input.source, input.url),
        paraphrase: input.paraphrase.trim(),
      }
    } catch (error) {
      invalid.push({ input, message: error instanceof Error ? error.message : String(error) })
      continue
    }
    const parsed = signalSchema.safeParse(candidate)
    if (!parsed.success) {
      invalid.push({
        input,
        message: parsed.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; '),
      })
      continue
    }
    const url = normaliseUrl(parsed.data.url)
    if (ids.has(parsed.data.id) || urls.has(url)) {
      duplicates++
      continue
    }
    ids.add(parsed.data.id)
    urls.add(url)
    added.push(parsed.data)
  }
  if (added.length > 0) {
    ensureDir(file)
    appendFileSync(file, added.map((row) => JSON.stringify(row)).join('\n') + '\n')
  }
  return { added, duplicates, invalid }
}

// ---------------------------------------------------------------------------
// Prompts

/** Reads a prompt file and the `version: N` on its first line. */
export function readPrompt(name: string): { version: number; text: string } {
  const text = readFileSync(join(PROMPTS_DIR, name), 'utf8')
  const match = /^version:\s*(\d+)\s*$/m.exec(text.split('\n')[0] ?? '')
  if (!match) throw new Error(`${name} must start with "version: N"`)
  return { version: Number(match[1]), text: text.split('\n').slice(1).join('\n').trim() }
}

export function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

export function flag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}
