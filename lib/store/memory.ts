import 'server-only'
import { TABS, type TabKey } from '@/lib/sheet/tabs'
import { seedGrids } from '@/lib/seed'

/**
 * The Sheet, in memory, for mock mode: same tabs, same headers, same seed. The
 * app cannot tell the difference, which is the point.
 */
type Grids = Record<TabKey, string[][]>

type Memory = {
  grid(key: TabKey): string[][]
  append(key: TabKey, rows: string[][]): void
  update(key: TabKey, row: number, head: string[], patch: Record<string, string>): void
  reset(demo?: boolean): void
}

const holder = globalThis as typeof globalThis & { __forgexMemory?: Grids }

// A dev server starts with the demo founders, so the landing has something
// to show; a reset (what the tests do) starts clean unless it asks for them.
function fresh(demo: boolean): Grids {
  return seedGrids(demo)
}

export function memory(): Memory {
  holder.__forgexMemory ??= fresh(true)
  const grids = holder.__forgexMemory
  return {
    grid: (key) => grids[key].map((row) => [...row]),
    append: (key, rows) => {
      grids[key].push(...rows.map((row) => [...row]))
    },
    update: (key, row, head, patch) => {
      const target = grids[key][row - 1]
      if (!target) throw new Error(`${TABS[key].name} has no row ${row}`)
      for (const [name, value] of Object.entries(patch)) {
        const column = head.findIndex((cell) => cell.trim() === name)
        if (column >= 0) target[column] = value
      }
    },
    reset: (demo = false) => {
      holder.__forgexMemory = fresh(demo)
    },
  }
}
