/**
 * The shared vocabulary between the founder's answers, the problem bank and the
 * matcher. Level 4 asks in these terms, the research pipeline tags every problem
 * in these terms, and `lib/match.ts` joins the two on these IDs.
 *
 * Rename a label freely. Never rename or remove an ID once problems carry it:
 * `pnpm test:unit` fails if any problem names a tag that is not here.
 */

export const INDUSTRIES = [
  { id: 'retail', short: 'Retail', label: 'Retail and local shops' },
  { id: 'food', short: 'Food', label: 'Food and quick commerce' },
  { id: 'money', short: 'Money', label: 'Money and finance' },
  { id: 'health', short: 'Health', label: 'Health and fitness' },
  { id: 'education', short: 'Education', label: 'Education and careers' },
  { id: 'work', short: 'Work', label: 'Work and teams' },
  { id: 'creators', short: 'Creators', label: 'Creators and media' },
  { id: 'mobility', short: 'Travel', label: 'Travel and mobility' },
  { id: 'agri', short: 'Farming', label: 'Farming and food supply' },
  { id: 'homes', short: 'Homes', label: 'Homes and real estate' },
  { id: 'industry', short: 'Manufacturing', label: 'Manufacturing and logistics' },
  { id: 'fashion', short: 'Fashion', label: 'Fashion and beauty' },
] as const

export type IndustryId = (typeof INDUSTRIES)[number]['id']
export const INDUSTRY_IDS = INDUSTRIES.map((industry) => industry.id) as IndustryId[]

/** Who a problem is lived by. A founder may also answer `unsure`, which matches all three. */
/**
 * Who pays, or who is hurting. `creator` is the bank's word for anyone who
 * earns on their own: drivers, sellers, farmers, freelancers and creators, so
 * the label says that rather than the narrower word.
 */
export const SIDES = [
  { id: 'business', label: 'Businesses' },
  { id: 'consumer', label: 'Everyday people' },
  { id: 'creator', label: 'Self-employed' },
] as const

export type SideId = (typeof SIDES)[number]['id']
export const SIDE_IDS = SIDES.map((side) => side.id) as SideId[]

/** What building a solution is likely to teach. */
export const LEARN = [
  { id: 'agents', label: 'AI agents', chip: 'Teaches AI agents' },
  { id: 'voice', label: 'Voice AI', chip: 'Teaches voice AI' },
  { id: 'vision', label: 'Vision', chip: 'Teaches computer vision' },
  { id: 'data', label: 'Data and dashboards', chip: 'Teaches data and dashboards' },
  { id: 'payments', label: 'Payments', chip: 'Teaches payments' },
  { id: 'mobile', label: 'Mobile apps', chip: 'Teaches mobile apps' },
  { id: 'web', label: 'Full-stack web', chip: 'Teaches full-stack web' },
  { id: 'automation', label: 'Automation and integrations', chip: 'Teaches automation' },
] as const

export type LearnId = (typeof LEARN)[number]['id']
export const LEARN_IDS = LEARN.map((learn) => learn.id) as LearnId[]

/** People a founder can reach this week. Each is paired with the world that person is in. */
export const ACCESS = [
  { id: 'family', label: 'Family business' },
  { id: 'relatives', label: "Relatives' work" },
  { id: 'internship', label: 'A past internship or job' },
  { id: 'parents', label: "Friends' parents" },
  { id: 'community', label: "A community you're in" },
] as const

export type AccessId = (typeof ACCESS)[number]['id']
export const ACCESS_IDS = ACCESS.map((access) => access.id) as AccessId[]

export const INTENTS = [
  { id: 'career', label: 'A career in tech and AI' },
  { id: 'company', label: 'Building a company' },
  { id: 'both', label: 'Both' },
  { id: 'exploring', label: 'Still working it out' },
] as const

export type IntentId = (typeof INTENTS)[number]['id']
export const INTENT_IDS = INTENTS.map((intent) => intent.id) as IntentId[]

/** Tech comfort, one to five. The words are the question; the number is for the matcher. */
export const COMFORT = [1, 2, 3, 4, 5] as const
export type Comfort = (typeof COMFORT)[number]

/**
 * How hard a problem is to build in 3 weeks. The team's word, never shown to a
 * founder: a label that ranks problems changes which one somebody picks.
 */
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

/** The research pipeline scores ambition as rarity; this is how that becomes difficulty. */
export const RARITIES = ['rare', 'epic', 'legendary', 'mythic'] as const
export type Rarity = (typeof RARITIES)[number]
export const DIFFICULTY_OF_RARITY: Record<Rarity, Difficulty> = {
  rare: 'easy',
  epic: 'medium',
  legendary: 'hard',
  mythic: 'hard',
}

export const GEOS = ['IN', 'global'] as const
export type Geo = (typeof GEOS)[number]

export const labelOf = {
  industry: (id: string) => INDUSTRIES.find((item) => item.id === id)?.label ?? id,
  industryShort: (id: string) => INDUSTRIES.find((item) => item.id === id)?.short ?? id,
  side: (id: string) => SIDES.find((item) => item.id === id)?.label ?? id,
  learn: (id: string) => LEARN.find((item) => item.id === id)?.label ?? id,
  access: (id: string) => ACCESS.find((item) => item.id === id)?.label ?? id,
}
