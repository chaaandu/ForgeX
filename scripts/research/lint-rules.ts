/** The bank's voice rules, shared by pnpm bank:lint and the per-batch fix checker. */
import type { Problem } from '../../lib/problem'
import { americanSpellings, bannedIn, decorativeQuotes, spelledNumbers } from '../../lib/voice'

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean)
const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z0-9₹])/).filter(Boolean)

/** Imperative openings a challenge may start with. Anything else is read by a person. */
const VERBS = new Set(
  'make help get give turn cut let show find catch keep stop bring tell reduce protect prove match track collect save put lower spot warn settle recover answer return clear connect stretch shorten lift raise halve double close fill fix free hand move pay plan price prepare ship sort take test trace verify win check confirm decide explain flag guide know learn list map measure name open order pick predict reach reward schedule see set spend split start teach train translate trust write give guarantee replace rebuild recognise remind'.split(' '),
)

const SOLUTION = /\b(an? app|apps? that|a platform|platforms? that|ai[-\s]powered|tool that|tools that|software that|chatbot|dashboard|marketplace that|automate[sd]?|machine learning|blockchain)\b/i
const CATEGORY = /\b(management|platform|solutions?|system|software|tool|app)\b/i
const PERSONA = /\b(Meet|Imagine|Take|Consider|Picture) [A-Z][a-z]+\b|\bnamed [A-Z][a-z]+\b/

export type Flag = { rule: string; detail: string }

export function lint(problem: Problem, excused: string[] = []): Flag[] {
  const flags: Flag[] = []
  const add = (rule: string, detail: string) => flags.push({ rule, detail })

  const titleWords = words(problem.title).length
  if (titleWords >= 10) add('title-length', `${titleWords} words`)
  if (problem.title.length > 60) add('title-length', `${problem.title.length} characters`)
  if (CATEGORY.test(problem.title)) add('title-category', 'names a category or a product, not a moment')
  if (/^(lack of|need for|how to|the problem of|managing|improving)\b/i.test(problem.title)) add('title-category', 'starts like a category')

  const count = sentences(problem.problem).length
  if (count < 2 || count > 3) add('problem-sentences', `${count} sentences`)
  if (problem.problem.length > 480) add('problem-length', `${problem.problem.length} characters`)
  const solution = problem.problem.match(SOLUTION)
  if (solution) add('problem-solution', `"${solution[0]}"`)
  if (/\busers?\b/i.test(problem.problem)) add('problem-user', 'says "user"')
  if (PERSONA.test(problem.problem)) add('problem-persona', 'names a target person')
  if (!/\d|₹|%|lakh|crore|hour|day|week|month|year/i.test(problem.problem)) add('problem-specific', 'no number, amount or timeframe from the evidence')

  const first = (problem.challenge.split(/\s+/)[0] ?? '').toLowerCase().replace(/[^a-z]/g, '')
  if (!VERBS.has(first)) add('challenge-verb', `starts with "${problem.challenge.split(/\s+/)[0]}"`)
  if (sentences(problem.challenge).length > 1) add('challenge-sentences', 'more than one sentence')
  if (problem.challenge.length > 140) add('challenge-length', `${problem.challenge.length} characters`)
  const prescribes = problem.challenge.match(SOLUTION)
  if (prescribes) add('challenge-solution', `"${prescribes[0]}"`)

  const all = [problem.title, problem.problem, problem.challenge].join(' ')
  for (const word of bannedIn(all)) add('banned', word)
  for (const word of spelledNumbers(all)) add('number-words', word)
  for (const word of americanSpellings(all)) add('spelling', word)
  if (decorativeQuotes(all)) add('quotes', 'decorative quote marks')
  if (/!/.test(all)) add('exclamation', 'exclamation mark')

  return flags.filter((flag) => !excused.includes(flag.rule))
}

