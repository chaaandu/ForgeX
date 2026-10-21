/**
 * Prepares the Sheet. Safe to run as often as you like: it only ever adds.
 *
 *   pnpm sheet:init             tabs, headers, and any founder not yet listed
 *   pnpm sheet:init --problems  also adds any problem not yet in the bank, as a draft
 *
 *   pnpm sheet:sync                 after a bank rewrite: wording, level and 2-day version, on
 *                                   problems nobody has edited
 *   pnpm sheet:hackathon            adds new problems as drafts, and writes each problem's 2-day
 *                                   version (Task, Expect, Further) where those cells are still empty
 *   pnpm sheet:groups               writes each founder's Group, Reviewer and POC from
 *                                   data/groups.json, only into cells that are still empty
 *   pnpm sheet:groups --update      the same, and also changes any of those cells that differ
 *                                   from the file, printing each one: after the team's list changes
 *
 * It never overwrites a cell somebody has edited, never reorders rows, and
 * never removes anything. Missing headers are added at the end of the row.
 */
import { append, batchGet, sheetsMeta, structure, update, columnLetter } from '../lib/sheet/google'
import { STATUS_OPTIONS } from '../lib/status-words'
import { TABS, type TabKey } from '../lib/sheet/tabs'
import {
  founderSeedRows,
  groupOf,
  hackathonSeedRows,
  submissionsSeedRows,
  profilesSeedRows,
  internalSeedRows,
  problemSeedRows,
  scopeSeedCells,
} from '../lib/seed'

const withProblems = process.argv.includes('--problems')
const syncWording = process.argv.includes('--sync')
const fillScope = process.argv.includes('--scope')
const fillGroups = process.argv.includes('--groups')
const updateGroups = process.argv.includes('--update')

async function ensureTabs() {
  const meta = await sheetsMeta()
  const titles = new Set(meta.map((sheet) => sheet.properties.title))
  const requests: object[] = []

  // A brand-new spreadsheet has one empty "Sheet1". Make it the Founders tab.
  const first = meta[0]
  if (first && first.properties.title === 'Sheet1' && !titles.has(TABS.founders.name)) {
    requests.push({
      updateSheetProperties: {
        properties: { sheetId: first.properties.sheetId, title: TABS.founders.name },
        fields: 'title',
      },
    })
    titles.add(TABS.founders.name)
  }

  for (const key of Object.keys(TABS) as TabKey[]) {
    const tab = TABS[key]
    if (titles.has(tab.name)) continue
    requests.push({
      addSheet: {
        properties: {
          title: tab.name,
          gridProperties: { frozenRowCount: 1, columnCount: Math.max(26, tab.headers.length + 4) },
        },
      },
    })
  }
  await structure(requests)
  if (requests.length) console.log(`· created or renamed ${requests.length} tab(s)`)

  // Freeze and embolden every header row, and make sure each grid is wide enough.
  const after = await sheetsMeta()
  await structure(
    after.flatMap((sheet) => {
      const tab = Object.values(TABS).find((item) => item.name === sheet.properties.title)
      if (!tab) return []
      const width = sheet.properties.gridProperties?.columnCount ?? 26
      return [
        ...(width < tab.headers.length + 2
          ? [
              {
                appendDimension: {
                  sheetId: sheet.properties.sheetId,
                  dimension: 'COLUMNS',
                  length: tab.headers.length + 2 - width,
                },
              },
            ]
          : []),
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheet.properties.sheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          repeatCell: {
            range: { sheetId: sheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: 'userEnteredFormat.textFormat.bold',
          },
        },
      ]
    }),
  )
}

async function ensureHeaders(grids: Record<string, string[][]>) {
  for (const key of Object.keys(TABS) as TabKey[]) {
    const tab = TABS[key]
    const head = (grids[tab.name]?.[0] ?? []).map((cell) => cell.trim())
    const missing = tab.headers.filter((name) => !head.includes(name))
    if (!missing.length) continue
    const start = head.filter(Boolean).length + 1
    await update(tab.name, [
      {
        a1: `${columnLetter(start)}1:${columnLetter(start + missing.length - 1)}1`,
        values: [missing],
      },
    ])
    console.log(`· ${tab.name}: added ${missing.length} header(s)`)
  }
}

/** Appends rows whose key is not already present, in the Sheet's own column order. */
async function addMissing(
  key: TabKey,
  keyHeader: string,
  rows: Record<string, string | undefined>[],
): Promise<number> {
  const name = TABS[key].name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const keyIndex = head.indexOf(keyHeader)
  const present = new Set(grid.slice(1).map((row) => (row[keyIndex] ?? '').trim().toLowerCase()))
  const fresh = rows.filter((row) => !present.has((row[keyHeader] ?? '').toLowerCase()))
  if (fresh.length)
    await append(
      name,
      fresh.map((row) => head.map((header) => row[header] ?? '')),
    )
  return fresh.length
}

/**
 * Brings the Sheet in line with data/problems.json and data/problems.scope.json
 * after a rewrite: the wording, the level and the 2-day version. Only on rows
 * nobody on the team has edited: a hand edit in the Sheet or the console
 * always wins over the file. A problem that has lost its 2-day version has
 * those cells cleared, so it is no longer offered.
 */
async function syncProblemWording(): Promise<number> {
  const name = TABS.problems.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const col = (header: string) => head.indexOf(header)
  const wanted = new Map(problemSeedRows('draft').map((row) => [row.ID ?? '', row]))
  const writes: { a1: string; values: string[][] }[] = []
  grid.slice(1).forEach((row, offset) => {
    const id = (row[col('ID')] ?? '').trim()
    const next = wanted.get(id)
    if (!next || (row[col('Edited by')] ?? '').trim()) return
    for (const header of [
      'Title',
      'Problem',
      'Challenge',
      'Difficulty',
      'Task',
      'Expect',
      'Further',
    ] as const) {
      if (col(header) < 0) continue
      const value = next[header] ?? ''
      if ((row[col(header)] ?? '') !== value)
        writes.push({ a1: `${columnLetter(col(header) + 1)}${offset + 2}`, values: [[value]] })
    }
  })
  for (let index = 0; index < writes.length; index += 200)
    await update(name, writes.slice(index, index + 200))
  return new Set(writes.map((write) => write.a1.replace(/^[A-Z]+/, ''))).size
}

/**
 * Writes the 2-day version of each problem from data/problems.scope.json, but
 * only on rows where all three cells are still empty: a version somebody has
 * written or edited in the Sheet or the console always wins over the file.
 */
async function fillProblemScope(): Promise<number> {
  const name = TABS.problems.name
  const grid = (await batchGet([name]))[name] ?? []
  const head = (grid[0] ?? []).map((cell) => cell.trim())
  const col = (header: string) => head.indexOf(header)
  const scopes = scopeSeedCells()
  const headers = ['Task', 'Expect', 'Further'] as const
  const writes: { a1: string; values: string[][] }[] = []
  let filled = 0
  grid.slice(1).forEach((row, offset) => {
    const scope = scopes.get((row[col('ID')] ?? '').trim())
    if (!scope || headers.some((header) => (row[col(header)] ?? '').trim())) return
    filled += 1
    for (const header of headers)
      writes.push({
        a1: `${columnLetter(col(header) + 1)}${offset + 2}`,
        values: [[scope[header]]],
      })
  })
  for (let index = 0; index < writes.length; index += 200)
    await update(name, writes.slice(index, index + 200))
  return filled
}

/**
 * Writes Group, Reviewer and POC from data/groups.json on every Hackathon row,
 * and Group on every Submissions row, where that cell is empty. A name
 * somebody typed in the Sheet always stays.
 */
async function fillGroupCells(overwrite: boolean): Promise<number> {
  const groups = groupOf()
  let filled = 0
  for (const [key, headers] of [
    ['hackathon', ['Group', 'Reviewer', 'POC']],
    ['submissions', ['Group']],
    ['profiles', ['Group']],
  ] as const) {
    const name = TABS[key].name
    const grid = (await batchGet([name]))[name] ?? []
    const head = (grid[0] ?? []).map((cell) => cell.trim())
    const col = (header: string) => head.indexOf(header)
    const writes: { a1: string; values: string[][] }[] = []
    grid.slice(1).forEach((row, offset) => {
      const group = groups.get((row[col('Email')] ?? '').trim().toLowerCase())
      if (!group) return
      const values: Record<string, string> = {
        Group: group.group,
        Reviewer: group.reviewer,
        POC: group.poc,
      }
      for (const header of headers) {
        const value = values[header] ?? ''
        const current = (row[col(header)] ?? '').trim()
        if (col(header) < 0 || !value || current === value) continue
        if (current && !overwrite) continue
        if (current) console.log(`  ${group.email}: ${header} ${current} → ${value}`)
        writes.push({ a1: `${columnLetter(col(header) + 1)}${offset + 2}`, values: [[value]] })
      }
    })
    for (let index = 0; index < writes.length; index += 200)
      await update(name, writes.slice(index, index + 200))
    filled += writes.length
  }
  return filled
}

/** The tabs a person reads. Every other tab is hidden; the site reads it all the same. */
const VISIBLE: readonly TabKey[] = ['hackathon', 'submissions', 'profiles', 'history']

/**
 * Sets a tab a person reads up for reading: the header bold, every other row
 * regular, text wrapped in every column, and on the Hackathon tab, Status a
 * dropdown of the words the app writes. Hides every tab nobody needs to read.
 */
async function formatForReading() {
  const meta = await sheetsMeta()
  const requests: object[] = meta.flatMap((sheet) => {
    const key = (Object.keys(TABS) as TabKey[]).find(
      (item) => TABS[item].name === sheet.properties.title,
    )
    const hidden = !key || !VISIBLE.includes(key)
    return sheet.properties.hidden === hidden
      ? []
      : [
          {
            updateSheetProperties: {
              properties: { sheetId: sheet.properties.sheetId, hidden },
              fields: 'hidden',
            },
          },
        ]
  })
  for (const key of VISIBLE) {
    const tab = TABS[key]
    const sheet = meta.find((item) => item.properties.title === tab.name)
    if (sheet) requests.push(...(await readable(sheet.properties.sheetId, key)))
  }
  await structure(requests)
}

async function readable(sheetId: number, key: TabKey): Promise<object[]> {
  const tab = TABS[key]
  const head = ((await batchGet([tab.name]))[tab.name]?.[0] ?? []).map((cell) => cell.trim())
  const column = key === 'hackathon' ? head.indexOf('Status') : -1
  return [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: false },
            wrapStrategy: 'WRAP',
            verticalAlignment: 'TOP',
          },
        },
        fields: 'userEnteredFormat(textFormat.bold,wrapStrategy,verticalAlignment)',
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true },
            wrapStrategy: 'WRAP',
            verticalAlignment: 'MIDDLE',
          },
        },
        fields: 'userEnteredFormat(textFormat.bold,wrapStrategy,verticalAlignment)',
      },
    },
    ...(column < 0
      ? []
      : [
          {
            setDataValidation: {
              range: {
                sheetId,
                startRowIndex: 1,
                startColumnIndex: column,
                endColumnIndex: column + 1,
              },
              rule: {
                condition: {
                  type: 'ONE_OF_LIST',
                  values: STATUS_OPTIONS.map((word) => ({ userEnteredValue: word })),
                },
                strict: true,
                showCustomUi: true,
              },
            },
          },
        ]),
  ]
}

async function main() {
  await ensureTabs()
  const names = Object.values(TABS).map((tab) => tab.name)
  await ensureHeaders(await batchGet(names))

  const founders = await addMissing('founders', 'Email', founderSeedRows())
  console.log(`· Founders: ${founders} added`)

  const listed = await addMissing('hackathon', 'Email', hackathonSeedRows())
  const handed = await addMissing('submissions', 'Email', submissionsSeedRows())
  // Links come from the live Founders tab (pnpm sheet:profiles), never from the seed.
  const linked = await addMissing(
    'profiles',
    'Email',
    profilesSeedRows().map(({ Name, Email, Group }) => ({ Name, Email, Group })),
  )
  await formatForReading()
  console.log(`· Hackathon: ${listed} founders added, text wrapped, Status is a dropdown`)
  console.log(`· Submissions: ${handed} founders added`)
  console.log(`· Profiles: ${linked} founders added`)
  console.log('· Hackathon, Submissions, Profiles and Problem history are shown, every other tab is hidden')
  if (withProblems) {
    const problems = await addMissing('problems', 'ID', problemSeedRows('draft'))
    const internal = await addMissing('internal', 'ID', internalSeedRows())
    console.log(`· Problems: ${problems} added as drafts, ${internal} internal rows`)
  }
  if (syncWording) console.log(`· Problems: ${await syncProblemWording()} rows brought up to date`)
  if (fillGroups)
    console.log(
      `· Hackathon and Submissions: ${await fillGroupCells(updateGroups)} Group, Reviewer and POC cells filled`,
    )
  if (fillScope) console.log(`· Problems: ${await fillProblemScope()} given a 2-day version`)
  console.log('Sheet ready.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
