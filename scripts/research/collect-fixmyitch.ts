/**
 * Razorpay Fix My Itch (https://razorpay.com/m/fix-my-itch/), India's public
 * list of problem statements.
 *
 *   pnpm tsx scripts/research/collect-fixmyitch.ts
 *
 * The page is a Framer site. Its problem list is not in the HTML: it is a
 * Framer CMS collection, shipped as public binary chunks (`*.framercms`) that
 * the page's own JavaScript modules load from framerusercontent.com. This
 * script does exactly what a browser does: it reads the page, finds the
 * modules it imports, finds the chunk URLs inside them, downloads the chunks
 * and decodes them. It also reads the page's public search index for the
 * handful of highlight problems shown above the list.
 *
 * robots.txt is checked for both hosts first (razorpay.com allows /m/;
 * framerusercontent.com serves no robots.txt, which RFC 9309 treats as
 * allow). Nothing is posted, no cookie is sent, nothing behind a login.
 *
 * The site says it indexes 10,000+ problems, but only the curated collection
 * the page renders is public. Everything reachable is collected.
 *
 * Writes data/research/raw/fixmyitch-candidates.json: a review queue, not
 * signals. The paraphrases in fixmyitch.jsonl are written by a reviewer in
 * their own words and appended through add-signal.ts.
 */

import { join } from 'node:path'
import { z } from 'zod'
import type { IndustryId } from '../../lib/taxonomy'
import { RAW_DIR, fetchBytes, fetchText, robotsAllows, writeJson } from './lib'

const PAGE = 'https://razorpay.com/m/fix-my-itch/'
const OUT = join(RAW_DIR, 'fixmyitch-candidates.json')

/** Fix My Itch's own categories, mapped onto the taxonomy where the fit is clear. */
const CATEGORY_TO_INDUSTRY: Record<string, IndustryId | undefined> = {
  'B2B Services': 'work',
  'Beauty & Personal Care': 'fashion',
  'E-commerce': 'retail',
  HealthTech: 'health',
  Healthcare: 'health',
  'Home Services': 'homes',
  Housing: 'homes',
  'Real Estate': 'homes',
  SaaS: 'work',
  EdTech: 'education',
  Career: 'education',
  'Food & Beverage': 'food',
  Logistics: 'industry',
  'Payment Issues': 'money',
  FinTech: 'money',
  'Professional Services': 'work',
  Travel: 'mobility',
  Transportation: 'mobility',
  Automotive: 'mobility',
}

// ---------------------------------------------------------------------------
// Framer CMS binary format, as read by the page's own runtime: big-endian,
// u32-length-prefixed UTF-8 strings, one tagged value per field.

type CmsValue = string | number | boolean | null | CmsValue[] | { [key: string]: CmsValue }
type CmsItem = Record<string, CmsValue>

class Reader {
  private offset = 0
  private readonly view: DataView
  private readonly decoder = new TextDecoder()
  constructor(private readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  }
  get done(): boolean {
    return this.offset >= this.bytes.length
  }
  u8(): number {
    return this.view.getUint8(this.offset++)
  }
  i8(): number {
    return this.view.getInt8(this.offset++)
  }
  u16(): number {
    const value = this.view.getUint16(this.offset)
    this.offset += 2
    return value
  }
  u32(): number {
    const value = this.view.getUint32(this.offset)
    this.offset += 4
    return value
  }
  i64(): number {
    const value = Number(this.view.getBigInt64(this.offset))
    this.offset += 8
    return value
  }
  f64(): number {
    const value = this.view.getFloat64(this.offset)
    this.offset += 8
    return value
  }
  string(): string {
    const length = this.u32()
    const value = this.decoder.decode(this.bytes.subarray(this.offset, this.offset + length))
    this.offset += length
    return value
  }
  json(): CmsValue {
    return JSON.parse(this.string()) as CmsValue
  }
  value(): CmsValue {
    const tag = this.u8()
    switch (tag) {
      case 0:
        return null
      case 1: {
        const length = this.u16()
        const out: CmsValue[] = []
        for (let i = 0; i < length; i++) out.push(this.value())
        return out
      }
      case 2:
        return this.u8() !== 0
      case 3: // colour
      case 5: // enum
      case 6: // file
      case 12: // string
        return this.string()
      case 4:
        return new Date(this.i64()).toISOString()
      case 7: // link
      case 10: // responsive image
        return this.json()
      case 8:
        return this.f64()
      case 9:
        return this.object()
      case 11:
        return this.i8() === 0 ? this.u32() : this.string()
      case 13:
        return this.u32()
      default:
        throw new Error(`Unknown Framer CMS value tag ${tag}`)
    }
  }
  object(): { [key: string]: CmsValue } {
    const count = this.u16()
    const out: { [key: string]: CmsValue } = {}
    for (let i = 0; i < count; i++) {
      const key = this.string()
      out[key] = this.value()
    }
    return out
  }
}

export function decodeChunk(bytes: Uint8Array): CmsItem[] {
  const reader = new Reader(bytes)
  const count = reader.u32()
  const items: CmsItem[] = []
  for (let i = 0; i < count && !reader.done; i++) items.push(reader.object())
  return items
}

// ---------------------------------------------------------------------------
// Working out which obfuscated field is which, from the data itself

function stringValues(items: CmsItem[], key: string): string[] {
  return items
    .map((item) => item[key])
    .filter((value): value is string => typeof value === 'string')
}

function pickFields(items: CmsItem[]): { title: string; description: string; category: string } {
  const keys = [...new Set(items.flatMap((item) => Object.keys(item)))].filter(
    (key) => !['id', 'createdAt', 'updatedAt', 'nextItemId', 'previousItemId'].includes(key),
  )
  const stats = keys.map((key) => {
    const values = stringValues(items, key)
    const questions = values.filter((value) => value.trim().endsWith('?')).length
    const meanLength = values.reduce((sum, value) => sum + value.length, 0) / (values.length || 1)
    const distinct = new Set(values).size
    const numeric = values.filter((value) => /^\d+(\.\d+)?$/.test(value)).length
    return { key, count: values.length, questions, meanLength, distinct, numeric }
  })
  const byQuestions = [...stats].sort((a, b) => b.questions - a.questions)
  const title = byQuestions[0]?.key
  const description = [...stats]
    .filter((stat) => stat.key !== title)
    .sort((a, b) => b.meanLength - a.meanLength)[0]?.key
  const category = stats
    .filter(
      (stat) =>
        stat.key !== title &&
        stat.key !== description &&
        stat.count > items.length / 2 &&
        stat.numeric === 0 &&
        stat.distinct > 2 &&
        stat.distinct <= 40,
    )
    .sort((a, b) => b.meanLength - a.meanLength)[0]?.key
  if (!title || !description || !category) throw new Error('Could not identify the CMS fields')
  return { title, description, category }
}

// ---------------------------------------------------------------------------

const searchIndexSchema = z.record(
  z.string(),
  z.object({ p: z.array(z.string()).optional(), h2: z.array(z.string()).optional() }).passthrough(),
)

type Candidate = {
  ref: string
  url: string
  date: string
  title: string
  description: string
  category: string
  industryHint?: IndustryId
  numbers: Record<string, number>
  via: 'cms' | 'highlight'
}

async function main(): Promise<void> {
  if (!(await robotsAllows(PAGE))) {
    console.error(`robots.txt disallows ${PAGE}. Use web search snippets instead.`)
    process.exit(1)
  }
  const html = await fetchText(PAGE)

  // 1. The modules the page imports, and the CMS chunks they point at
  const modules = [
    ...new Set(html.match(/https:\/\/framerusercontent\.com\/sites\/[^"'\s]+\.mjs/g) ?? []),
  ]
  const chunkUrls = new Set<string>()
  for (const moduleUrl of modules) {
    let source: string
    try {
      source = await fetchText(moduleUrl)
    } catch (error) {
      console.warn(`skip ${moduleUrl}: ${error instanceof Error ? error.message : String(error)}`)
      continue
    }
    const pattern = /new URL\(`(\.\/[^`]+-chunk-[^`]+\.framercms)`,`([^`]+)`\)/g
    for (const match of source.matchAll(pattern)) {
      if (match[1] && match[2]) chunkUrls.add(new URL(match[1], match[2]).toString())
    }
  }
  console.log(`${modules.length} modules, ${chunkUrls.size} CMS chunks`)

  const items: CmsItem[] = []
  for (const chunkUrl of chunkUrls) items.push(...decodeChunk(await fetchBytes(chunkUrl)))
  console.log(`${items.length} CMS items`)

  const candidates: Candidate[] = []
  if (items.length > 0) {
    const fields = pickFields(items)
    for (const item of items) {
      const id = typeof item.id === 'string' ? item.id : undefined
      const title = item[fields.title]
      const description = item[fields.description]
      if (!id || typeof title !== 'string' || typeof description !== 'string') continue
      const category =
        typeof item[fields.category] === 'string' ? String(item[fields.category]) : ''
      const numbers: Record<string, number> = {}
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'number') numbers[key] = value
        else if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))
          numbers[key] = Number(value)
      }
      const created = typeof item.createdAt === 'string' ? item.createdAt.slice(0, 10) : '2026-01'
      candidates.push({
        ref: id,
        url: `${PAGE}#${id}`,
        date: created,
        title: title.trim(),
        description: description.trim(),
        category,
        industryHint: CATEGORY_TO_INDUSTRY[category],
        numbers,
        via: 'cms',
      })
    }
  }

  // 2. Highlight problems from the page's public search index
  const indexUrls = [
    ...new Set(
      html.match(/https:\/\/framerusercontent\.com\/sites\/[^"'\s]+searchIndex-[^"'\s]+\.json/g) ??
        [],
    ),
  ]
  const known = new Set(candidates.map((candidate) => candidate.title.replace(/[’']/g, "'")))
  const firstDate = candidates.map((candidate) => candidate.date).sort()[0] ?? '2026-01'
  for (const indexUrl of indexUrls.slice(0, 1)) {
    const index = searchIndexSchema.parse(JSON.parse(await fetchText(indexUrl)))
    const page = Object.entries(index).find(([path]) => path.includes('fix-my-itch'))?.[1]
    const lines = page?.p ?? []
    lines.forEach((line, i) => {
      const title = line.trim()
      if (!/^Why .+\?$/.test(title) || known.has(title.replace(/[’']/g, "'"))) return
      const previous = lines[i - 1]?.trim() ?? ''
      const category =
        /^[A-Z][A-Za-z &]+$/.test(previous) && !previous.endsWith('?') ? previous : ''
      known.add(title)
      candidates.push({
        ref: `highlight-${candidates.length}`,
        url: `${PAGE}#highlight-${encodeURIComponent(title.slice(4, 40).toLowerCase().replace(/\W+/g, '-'))}`,
        date: firstDate.slice(0, 7),
        title,
        description: '',
        category,
        industryHint: CATEGORY_TO_INDUSTRY[category],
        numbers: {},
        via: 'highlight',
      })
    })
  }

  writeJson(OUT, candidates)
  console.log(`Wrote ${candidates.length} to ${OUT}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
