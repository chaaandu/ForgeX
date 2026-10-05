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
const byName = new Map((roster as Student[]).map((student) => [student.name.toLowerCase(), student]))

export const students = roster as Student[]

export function studentByEmail(email: string): Student | undefined {
  return byEmail.get(email.trim().toLowerCase())
}

/** Names are unique across the roster, so this is as good a key as the email. */
export function studentByName(name: string): Student | undefined {
  return byName.get(name.trim().toLowerCase())
}
