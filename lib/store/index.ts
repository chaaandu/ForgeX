import 'server-only'
import { revalidateTag, unstable_cache } from 'next/cache'
import { append, batchGet, columnLetter, update } from '@/lib/sheet/google'
import { decode, encode, TABS, type Header, type Row, type TabKey } from '@/lib/sheet/tabs'
import { memory } from './memory'
import { isMock } from './mode'

/**
 * The one door to the Sheet. Reads are whole tabs, cached in Next's shared
 * data cache and invalidated by tag the moment anything writes to that tab, so
 * a founder always sees their own change and nobody waits on Google twice.
 * Writes are appends, or in-place updates of one known row.
 */

const TTL: Record<TabKey, number> = {
  founders: 15,
  problems: 300,
  internal: 300,
  picks: 15,
  responses: 15,
  events: 30,
}

const tag = (key: TabKey) => `tab:${key}`

function cachedGrid(key: TabKey) {
  return unstable_cache(
    async () => (await batchGet([TABS[key].name]))[TABS[key].name] ?? [],
    ['grid', key],
    { tags: [tag(key)], revalidate: TTL[key] },
  )
}

const loaders = Object.fromEntries(
  (Object.keys(TABS) as TabKey[]).map((key) => [key, cachedGrid(key)]),
) as Record<TabKey, () => Promise<string[][]>>

async function grid(key: TabKey): Promise<string[][]> {
  if (isMock()) return memory().grid(key)
  return loaders[key]()
}

export async function rows<K extends TabKey>(key: K): Promise<Row<K>[]> {
  return decode(key, await grid(key))
}

export async function appendRows<K extends TabKey>(
  key: K,
  entries: Partial<Record<Header<K>, string>>[],
): Promise<void> {
  if (!entries.length) return
  const head = (await grid(key))[0] ?? [...TABS[key].headers]
  const values = entries.map((cells) => encode<K>(head, cells))
  if (isMock()) memory().append(key, values)
  else await append(TABS[key].name, values)
  revalidateTag(tag(key))
}

/** Writes some cells of one row, found by its row number, leaving the rest alone. */
export async function updateRow<K extends TabKey>(
  key: K,
  row: number,
  patch: Partial<Record<Header<K>, string>>,
): Promise<void> {
  const head = (await grid(key))[0] ?? []
  const writes = Object.entries(patch as Record<string, string>).flatMap(([name, value]) => {
    const column = head.findIndex((cell) => cell.trim() === name)
    if (column < 0) throw new Error(`${TABS[key].name} has no column ${name}`)
    return [{ a1: `${columnLetter(column + 1)}${row}`, values: [[value]] }]
  })
  if (isMock()) memory().update(key, row, head, patch as Record<string, string>)
  else await update(TABS[key].name, writes)
  revalidateTag(tag(key))
}
