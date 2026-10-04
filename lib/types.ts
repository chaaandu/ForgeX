export const TAGS = ['rare', 'epic', 'legendary', 'mythic'] as const
export type Tag = (typeof TAGS)[number]

export type Role = 'student' | 'team'

/** One row of `Tools to use`: the kit name and the tools filed under it. */
export type ToolKit = {
  kit: string
  tools: string
}

/** Columns A to N of the Problems tab, parsed. */
export type Problem = {
  id: string
  title: string
  tag: Tag
  cluster: string
  region: string
  problem: string
  who: string
  whyItMatters: string
  challenge: string
  northStar: string
  directions: string[]
  constraints: string
  buildExpectation: string
  tools: ToolKit[]
}

/** Columns O to R, for a problem somebody holds. `email` is team-only. */
export type Bet = {
  name: string
  photo: string
  at: string
  email?: string
}

/** Problem ID to bet. A missing key means the problem is open. */
export type BetMap = Record<string, Bet>
