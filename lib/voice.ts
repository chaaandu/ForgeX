/**
 * The machine-checkable parts of docs/VOICE.md, shared by the copy lint and
 * the bank lint so the two can never disagree about a word.
 */

export const BANNED = [
  'revolutionise',
  'revolutionize',
  'seamless',
  'seamlessly',
  'leverage',
  'unlock',
  'empower',
  'synergy',
  'cutting-edge',
  'game-changer',
  'game changer',
  'robust',
  'delve',
  'elevate',
  'supercharge',
  'journey',
  "in today's world",
  "let's dive in",
  'oops',
  'simply',
  'amazing',
  'awesome',
  'incredible',
  'frictionless',
] as const

/** Flags any banned word or phrase, matched on word boundaries. */
export function bannedIn(text: string): string[] {
  const lower = text.toLowerCase()
  return BANNED.filter((word) => new RegExp(`(^|[^a-z])${word.replace(/[-']/g, (c) => `\\${c}`)}([^a-z]|$)`).test(lower))
}

/** "Something went wrong" is allowed only when it is followed by what to do. */
export function bareSomethingWentWrong(text: string): boolean {
  return /something went wrong\.?$/i.test(text.trim())
}

const SPELLED = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'twenty', 'thirty', 'forty', 'fifty', 'hundred']

/** Numbers written as words where the voice wants digits. "One" is allowed: it is often not a count. */
export function spelledNumbers(text: string): string[] {
  return SPELLED.filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(text))
}

const US = [/\b\w+iz(e|es|ed|ing|ation|ations)\b/i, /\bcolor\b/i, /\bcenter\b/i, /\bprogram\b/i, /\bbehavior\b/i, /\bfavorite\b/i, /\blicense\b/i, /\bcatalog\b/i]
const US_OK = /\b(size|sizes|sized|sizing|prize|seize|seized|citizen|citizens|realize?d?)\b/i

/** American spellings, for a voice that writes British English as used in India. */
export function americanSpellings(text: string): string[] {
  return US.flatMap((pattern) => {
    const match = text.match(pattern)
    return match && !US_OK.test(match[0]) ? [match[0]] : []
  })
}

/** Decorative quote marks. */
export function decorativeQuotes(text: string): boolean {
  return /[“”‘’«»]/.test(text)
}
