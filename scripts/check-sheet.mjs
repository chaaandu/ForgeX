/**
 * Calls the deployed Apps Script the way the app does and reports what came
 * back. Reads APPS_SCRIPT_URL and APPS_SCRIPT_SECRET from .env.local.
 *
 *   node scripts/check-sheet.mjs
 */
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
)

const response = await fetch(env.APPS_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ secret: env.APPS_SCRIPT_SECRET, action: 'data' }),
  redirect: 'follow',
})

const text = await response.text()
if (!text.trimStart().startsWith('{')) {
  console.log('status', response.status, 'but the body is not JSON. First 200 characters:')
  console.log(text.replace(/\s+/g, ' ').slice(0, 200))
  console.log(
    '\nThat is the Drive error page. The web app is not readable anonymously:' +
      '\n  Deploy > Manage deployments > Edit > Execute as: Me,' +
      '\n  Who has access: Anyone > Version: New version > Deploy',
  )
  process.exit(1)
}

const body = JSON.parse(text)
if (!body.ok) {
  console.log('the script answered:', JSON.stringify(body))
  process.exit(1)
}
console.log('problems:', body.problems.length)
console.log('bets:', Object.keys(body.bets).length, JSON.stringify(body.bets).slice(0, 200))
console.log('first:', body.problems[0]?.id, body.problems[0]?.tag, '|', body.problems[0]?.title)
