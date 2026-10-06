import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as copy from '@/content/copy'
import { bannedIn, bareSomethingWentWrong, decorativeQuotes } from '@/lib/voice'

/**
 * The copy lint. docs/VOICE.md is the standard; these are the parts a machine
 * can hold us to. It fails the build, on purpose.
 */

type Leaf = { path: string; text: string }

/** Every string in content/copy.ts, with functions called on sample values. */
function leaves(value: unknown, path: string, out: Leaf[] = []): Leaf[] {
  if (typeof value === 'string') out.push({ path, text: value })
  else if (typeof value === 'function') {
    const fn = value as (...args: unknown[]) => unknown
    const result = fn(...Array.from({ length: Math.max(fn.length, 1) }, () => 'Ananya'))
    leaves(result, `${path}()`, out)
  } else if (Array.isArray(value)) value.forEach((item, index) => leaves(item, `${path}[${index}]`, out))
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) leaves(item, path ? `${path}.${key}` : key, out)
  }
  return out
}

const all = leaves(copy, '')
const at = (path: string) => all.find((leaf) => leaf.path === path)?.text

/** Buttons a founder or the team presses. Each must be a verb under 24 characters. */
const BUTTONS = [
  'landing.enter',
  'login.google',
  'login.another',
  'arrive.go',
  'archetypeFlow.intro.start',
  'archetypeFlow.retry',
  'archetypeFlow.reveal.keep',
  'archetypeFlow.reveal.next',
  'archetypeFlow.reveal.retake',
  'card.download',
  'card.share',
  'profile.edit',
  'profile.editProfile',
  'profile.finishEditing',
  'profile.done',
  'world.next',
  'world.back',
  'world.done',
  'matches.changeAnswers',
  'problem.build',
  'why.send',
  'why.change',
  'why.sent.go',
  'composer.next',
  'composer.back',
  'page.pickAnother',
  'page.backToMatches',
  'page.console',
  'notFound.home',
  'crashed.retry',
  'consoleCopy.founders.export',
  'consoleCopy.queue.send',
  'consoleCopy.bank.approve',
  'consoleCopy.bank.reject',
  'consoleCopy.bank.draft',
  'consoleCopy.bank.edit',
  'consoleCopy.bank.save',
  'consoleCopy.bank.cancel',
]

/** Headings. Eight words or fewer, except the owner's own lines, which are theirs to keep. */
const HEADINGS = [
  'archetypeFlow.intro.title',
  'archetypeFlow.intro.retakeTitle',
  'archetypeFlow.reveal.cardTitle',
  'matches.title',
  'matches.gentleTitle',
  'matches.empty.title',
  'composer.title',
  'why.sent.title',
  'notFound.title',
  'crashed.title',
  'login.title',
  'world.industries.ask',
  'world.side.ask',
  'world.access.ask',
  'world.learn.ask',
  'world.intent.ask',
  'world.comfort.ask',
]
const OWNER_HEADINGS = ['profile.heading', 'why.heading']

/** The two places an exclamation mark is allowed: the archetype reveal and the founder card. */
const EXCLAIM_OK = /^(archetypeFlow\.reveal\.|card\.)/

describe('copy', () => {
  it('uses no banned words', () => {
    const hits = all.flatMap((leaf) => bannedIn(leaf.text).map((word) => `${leaf.path}: ${word}`))
    expect(hits).toEqual([])
  })

  it('never says something went wrong without saying what to do', () => {
    expect(all.filter((leaf) => bareSomethingWentWrong(leaf.text)).map((leaf) => leaf.path)).toEqual([])
  })

  it('has no decorative quote marks', () => {
    expect(all.filter((leaf) => decorativeQuotes(leaf.text)).map((leaf) => leaf.path)).toEqual([])
  })

  it('keeps exclamation marks to the reveal and the card', () => {
    expect(all.filter((leaf) => leaf.text.includes('!') && !EXCLAIM_OK.test(leaf.path)).map((leaf) => leaf.path)).toEqual([])
  })

  it('keeps every button under 24 characters, and never Submit or OK', () => {
    for (const path of BUTTONS) {
      const text = at(path)
      expect(text, path).toBeDefined()
      expect((text ?? '').length, `${path}: ${text}`).toBeLessThan(24)
      expect(text, path).not.toMatch(/^(submit|ok|click here|yes|no)$/i)
    }
  })

  it('keeps headings to eight words or fewer', () => {
    for (const path of HEADINGS) {
      const text = at(path)
      expect(text, path).toBeDefined()
      expect((text ?? '').split(/\s+/).length, `${path}: ${text}`).toBeLessThanOrEqual(8)
    }
    for (const path of OWNER_HEADINGS) expect(at(path), path).toBeDefined()
  })

  it('keeps sentences under 20 words', () => {
    const long = all.flatMap((leaf) =>
      leaf.text
        .split(/(?<=[.?])\s+/)
        .filter((sentence) => sentence.split(/\s+/).length >= 20 && !OWNER_HEADINGS.includes(leaf.path))
        .map((sentence) => `${leaf.path}: ${sentence}`),
    )
    expect(long).toEqual([])
  })
})

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sources(path)
    return path.endsWith('.tsx') ? [path] : []
  })
}

const files = [...sources(join(process.cwd(), 'app')), ...sources(join(process.cwd(), 'components'))].filter(
  (path) => !path.includes(`${join('app', 'api', 'card')}`),
)

describe('copy in components', () => {
  it('gives every image alt text', () => {
    const missing = files.flatMap((path) => {
      const text = readFileSync(path, 'utf8')
      return [...text.matchAll(/<(Image|img)\b[^>]*?\/?>/gs)]
        .filter((match) => !/\balt=/.test(match[0]))
        .map(() => path.replace(process.cwd(), ''))
    })
    expect(missing).toEqual([])
  })

  it('keeps words out of components: every string lives in content/copy.ts', () => {
    const inline = files.flatMap((path) => {
      const text = readFileSync(path, 'utf8')
      const jsxText = [...text.matchAll(/>\s*([A-Za-z][^<>{}]*?)\s*<\//g)].map((match) => match[1])
      const labels = [...text.matchAll(/\b(aria-label|alt|title|placeholder)="([^"]*[A-Za-z][^"]*)"/g)].map((match) => match[2])
      return [...jsxText, ...labels].map((found) => `${path.replace(process.cwd(), '')}: ${found}`)
    })
    expect(inline).toEqual([])
  })
})
