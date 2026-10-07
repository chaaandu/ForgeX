import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import students from '../data/students.json'

/**
 * Nothing private may reach a browser. This reads every client chunk of the
 * production build the suite runs against and fails on any roster email or
 * any of the fields that are the team's alone.
 */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : path.endsWith('.js') ? [path] : []
  })
}

test('client bundles carry no roster emails and no team-only fields', () => {
  const chunks = files(join(process.cwd(), process.env.NEXT_DIST_DIR ?? '.next-test', 'static'))
  expect(chunks.length).toBeGreaterThan(0)
  const text = chunks.map((path) => readFileSync(path, 'utf8')).join('\n')
  for (const student of students as { email: string }[]) {
    expect(text.includes(student.email), student.email).toBe(false)
  }
  for (const field of [
    'H1 outcome',
    'H1 level',
    'Prior work',
    'Venture to Role',
    'autonomous',
    'structured',
    'guided',
  ]) {
    expect(text.includes(field), field).toBe(false)
  }
})
