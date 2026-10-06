/**
 * Live, gentle guidance while a founder writes. Deterministic and local: no
 * model, no network, nothing stored. A nudge never blocks sending; it names
 * the most useful thing to fix, one at a time, and goes away once fixed.
 */

export type Nudge = 'solution' | 'person' | 'money' | 'short' | 'prescribes' | 'title'

const SOLUTION =
  /\b(an?\s+(app|application|platform|website|site|tool|chatbot|bot|dashboard|marketplace|software|saas)|i\s*('ll|will|would|want to|plan to)\s+(build|make|create|develop)|we\s*('ll|will|would)\s+(build|make|create)|ai[-\s]powered|using ai)\b/i

const PERSON =
  /\b(owner|owners|manager|student|students|parent|parents|farmer|farmers|driver|drivers|shopkeeper|shopkeepers|teacher|teachers|doctor|doctors|nurse|mother|mom|mum|father|dad|uncle|aunt|aunty|friend|friends|customer|customers|seller|sellers|buyer|buyers|creator|creators|freelancer|freelancers|retailer|retailers|chef|cook|worker|workers|employee|employees|team|staff|patient|patients|tenant|landlord|vendor|vendors|people|someone|person|he|she|they|my|our|who)\b/i

const MONEY =
  /(\b(pay|pays|paid|paying|price|pricing|priced|fee|fees|subscription|subscribe|save|saves|saving|savings|commission|ads|advert|rupee|rupees|rs|money|revenue|charge|charges|cost|costs|margin|monthly|per month|per year|annual|free|freemium|earn|earns|profit|sell|sells|sale)\b|₹)/i

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

export type WhyField = 'whyProblem' | 'whyUser' | 'whyPay'

export function nudgeFor(field: WhyField, text: string): Nudge | null {
  const count = words(text)
  if (count < 5) return null
  if (field === 'whyProblem' && SOLUTION.test(text)) return 'solution'
  if (field === 'whyUser' && !PERSON.test(text)) return 'person'
  if (field === 'whyPay' && !MONEY.test(text)) return 'money'
  if (count < 25) return 'short'
  return null
}

export function composerNudge(field: 'title' | 'problem' | 'challenge', text: string): Nudge | null {
  if (field === 'title') return words(text) >= 10 ? 'title' : null
  if (words(text) < 4) return null
  if (field === 'problem' && SOLUTION.test(text)) return 'solution'
  if (field === 'challenge' && /\b(build|make|create|develop)\s+(an?\s+)?(app|platform|website|tool|chatbot|bot|dashboard)\b/i.test(text)) {
    return 'prescribes'
  }
  return null
}

export function wordCount(text: string): number {
  return words(text)
}
