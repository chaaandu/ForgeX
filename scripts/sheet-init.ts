/**
 * Prepares the Sheet. Safe to run as often as you like: it only ever adds.
 *
 *   pnpm sheet:init             tabs, headers, and any founder not yet listed
 *   pnpm sheet:init --problems  also adds any problem not yet in the bank, as a draft
 *
 * It never overwrites a cell somebody has edited, never reorders rows, and
 * never removes anything. Missing headers are added at the end of the row.
 */
import { append, batchGet, sheetsMeta, structure, update, columnLetter } from '../lib/sheet/google'
import { TABS, type TabKey } from '../lib/sheet/tabs'
import { founderSeedRows, internalSeedRows, problemSeedRows } from '../lib/seed'

const withProblems = process.argv.includes('--problems')

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
          ? [{ appendDimension: { sheetId: sheet.properties.sheetId, dimension: 'COLUMNS', length: tab.headers.length + 2 - width } }]
          : []),
        {
          updateSheetProperties: {
            properties: { sheetId: sheet.properties.sheetId, gridProperties: { frozenRowCount: 1 } },
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
      { a1: `${columnLetter(start)}1:${columnLetter(start + missing.length - 1)}1`, values: [missing] },
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
  if (fresh.length) await append(name, fresh.map((row) => head.map((header) => row[header] ?? '')))
  return fresh.length
}

async function main() {
  await ensureTabs()
  const names = Object.values(TABS).map((tab) => tab.name)
  await ensureHeaders(await batchGet(names))

  const founders = await addMissing('founders', 'Email', founderSeedRows())
  console.log(`· Founders: ${founders} added`)

  if (withProblems) {
    const problems = await addMissing('problems', 'ID', problemSeedRows('draft'))
    const internal = await addMissing('internal', 'ID', internalSeedRows())
    console.log(`· Problems: ${problems} added as drafts, ${internal} internal rows`)
  }
  console.log('Sheet ready.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
