import { z } from 'zod'
import roster from '../data/students.json'

export const studentSchema = z.object({
  email: z.string(),
  name: z.string(),
  firstName: z.string(),
  photo: z.string().nullable(),
  track: z.string(),
})

export const studentsSchema = z.array(studentSchema)

export type Student = z.infer<typeof studentSchema>

const byEmail = new Map((roster as Student[]).map((student) => [student.email, student]))
const byName = new Map(
  (roster as Student[]).map((student) => [student.name.toLowerCase(), student]),
)

export const students = roster as Student[]

export function studentByEmail(email: string): Student | undefined {
  return byEmail.get(email.trim().toLowerCase())
}

/** Names are unique across the roster, so this is as good a key as the email. */
export function studentByName(name: string): Student | undefined {
  return byName.get(name.trim().toLowerCase())
}

/**
 * The ForgeX cohort: roster rows on the founder domain that have a photo.
 * Two founder-domain rows without one are outside the cohort by the owner's
 * decision (2026-10-06) and cannot sign in.
 */
export const cohort = students.filter(
  (student) => student.email.endsWith('@forge27.mesaschool.co') && Boolean(student.photo),
)

const cohortEmails = new Set(cohort.map((student) => student.email))

export function inCohort(email: string): boolean {
  return cohortEmails.has(email.trim().toLowerCase())
}
