import 'server-only'
import { createSign } from 'node:crypto'

/**
 * The Sheets API, spoken directly. A service account signs its own JWT, trades
 * it for an access token, and every call retries on 429 and 5xx with jittered
 * backoff. No SDK: the whole surface we need is five endpoints.
 */

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const API = 'https://sheets.googleapis.com/v4/spreadsheets'

type Token = { value: string; expires: number }
let token: Token | null = null

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export function sheetId(): string {
  return env('SHEET_ID')
}

async function accessToken(): Promise<string> {
  if (token && token.expires > Date.now() + 60_000) return token.value
  const email = env('GOOGLE_SA_EMAIL')
  const key = env('GOOGLE_SA_KEY').replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key).toString('base64url')
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Google token exchange failed: ${response.status}`)
  const body = (await response.json()) as { access_token: string; expires_in: number }
  token = { value: body.access_token, expires: Date.now() + body.expires_in * 1000 }
  return token.value
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** One call, retried up to four times on quota and server errors. */
async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let attempt = 0
  for (;;) {
    const response = await fetch(`${API}/${sheetId()}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${await accessToken()}`,
        'content-type': 'application/json',
        ...init.headers,
      },
      cache: 'no-store',
    })
    if (response.ok) return (await response.json()) as T
    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt >= 3) {
      const detail = await response.text().catch(() => '')
      throw new Error(`Sheets ${init.method ?? 'GET'} ${path.split('?')[0]} failed: ${response.status} ${detail.slice(0, 200)}`)
    }
    attempt += 1
    await sleep(2 ** attempt * 400 + Math.random() * 400)
  }
}

const range = (tab: string, a1 = '') => encodeURIComponent(`'${tab.replace(/'/g, "''")}'${a1 ? `!${a1}` : ''}`)

export type Grid = string[][]

/** Whole tabs at once. One request, however many tabs. */
export async function batchGet(tabs: string[]): Promise<Record<string, Grid>> {
  const query = tabs.map((tab) => `ranges=${range(tab)}`).join('&')
  const body = await call<{ valueRanges: { values?: string[][] }[] }>(
    `/values:batchGet?${query}&valueRenderOption=FORMATTED_VALUE`,
  )
  const out: Record<string, Grid> = {}
  tabs.forEach((tab, index) => {
    out[tab] = body.valueRanges[index]?.values ?? []
  })
  return out
}

/** Appends rows after the last one. Google serialises appends, so they never collide. */
export async function append(tab: string, rows: Grid): Promise<void> {
  await call(`/values/${range(tab, 'A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values: rows }),
  })
}

/** Writes cells in place. Each entry is an A1 range within `tab` and its values. */
export async function update(tab: string, writes: { a1: string; values: Grid }[]): Promise<void> {
  if (!writes.length) return
  await call(`/values:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      valueInputOption: 'RAW',
      data: writes.map((write) => ({ range: `'${tab.replace(/'/g, "''")}'!${write.a1}`, values: write.values })),
    }),
  })
}

type SheetMeta = { properties: { sheetId: number; title: string; gridProperties?: { columnCount?: number } } }

export async function sheetsMeta(): Promise<SheetMeta[]> {
  const body = await call<{ sheets: SheetMeta[] }>(`?fields=sheets.properties`)
  return body.sheets
}

/** Structural changes: adding tabs, freezing headers, widening grids. */
export async function structure(requests: object[]): Promise<void> {
  if (!requests.length) return
  await call(`:batchUpdate`, { method: 'POST', body: JSON.stringify({ requests }) })
}

/** Column number (1-based) to letters: 1 → A, 27 → AA. */
export function columnLetter(n: number): string {
  let out = ''
  let value = n
  while (value > 0) {
    const rem = (value - 1) % 26
    out = String.fromCharCode(65 + rem) + out
    value = Math.floor((value - 1) / 26)
  }
  return out
}
