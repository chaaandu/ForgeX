import { isMock } from '@/lib/store/mode'

/**
 * Who on the team may do what. Anyone with a Mesa email can look at the
 * console; only the reviewers and the super admin can act. A reviewer answers
 * the founders in their own group, and any founder nobody has been given yet.
 * The super admin can do everything, and alone edits the bank and reopens a deadline.
 */
export const SUPER_ADMIN = 'chandu@mesaschool.co'

/**
 * The reviewers, by the name the Reviewer column uses. Param signs in with his
 * own address, outside Mesa; `lib/roles.ts` lets that one address in as team.
 */
export const REVIEWERS: { name: string; email: string }[] = [
  { name: 'Saurabh', email: 'saurabh@mesaschool.co' },
  { name: 'Param', email: 'param@joinsquareup.com' },
  { name: 'Ebrahim', email: 'eakbari@mesaschool.co' },
]

/** Mock mode only: a stand-in sign-in for Param, whose real address is outside Mesa. */
const MOCK_EMAILS: Record<string, string> = {
  Param: 'param@mesaschool.co',
}

export type Staff = {
  /** The super admin: every action, every founder. */
  admin: boolean
  /** The reviewer's name, as written in the Reviewer column, or null. */
  reviewer: string | null
}

export function staffOf(email: string): Staff {
  const key = email.trim().toLowerCase()
  const mock = isMock()
  const reviewer =
    REVIEWERS.find(
      (item) =>
        (item.email && item.email.toLowerCase() === key) ||
        (mock && MOCK_EMAILS[item.name] === key),
    )?.name ?? null
  return { admin: key === SUPER_ADMIN, reviewer }
}

/** May answer problems at all. Only the super admin edits the bank or reopens a deadline. */
export const mayAct = (staff: Staff) => staff.admin || staff.reviewer !== null

/** May answer this founder's problem: the super admin, their reviewer, or any reviewer if they have none yet. */
export const mayDecide = (staff: Staff, assigned: string) =>
  staff.admin ||
  (staff.reviewer !== null &&
    (!assigned.trim() || assigned.trim().toLowerCase() === staff.reviewer.toLowerCase()))
