/**
 * Y Combinator Requests for Startups (https://www.ycombinator.com/rfs), every
 * season the page carries (Summer 2024 to the current batch).
 *
 *   pnpm tsx scripts/research/collect-yc.ts
 *
 * The page server-renders only the newest season; the others ship inside the
 * page's public JavaScript component, which the browser loads from
 * bookface-static.ycombinator.com. This script follows the same path: page,
 * then the Inertia bundle, then the component registry, then the RFS
 * component, and reads the season and request records out of it.
 *
 * robots.txt allows /rfs. The company directory is not used: robots.txt
 * disallows its filtered listings (`/companies?*`), so batch themes come from
 * the RFS seasons themselves.
 *
 * Writes data/research/raw/yc-candidates.json, a review queue. The curated
 * yc.jsonl is written by a reviewer through add-signal.ts, because each
 * request is an essay and the signal needs a paraphrase of the problem in it.
 */

import { join } from 'node:path'
import { RAW_DIR, fetchText, robotsAllows, writeJson } from './lib'

const PAGE = 'https://www.ycombinator.com/rfs'
const OUT = join(RAW_DIR, 'yc-candidates.json')

/**
 * When each season's list went public. The component carries no dates, so
 * these are the earliest Hacker News submissions of each list (Algolia API,
 * checked 2026-10-06). Winter 2025 was published as /rfs-build.
 */
const SEASON_DATES: Record<string, string> = {
  'fall-2026': '2026-07-22',
  'summer-2026': '2026-04-28',
  'spring-2026': '2026-02-03',
  'fall-2025': '2025-07-30',
  'summer-2025': '2025-05-08',
  'spring-2025': '2025-01-30',
  'winter-2025': '2024-11-12',
  'summer-2024': '2024-02-14',
}

const SEASON_ID = /^(spring|summer|fall|winter)-\d{4}$/

type Request = {
  season: string
  date: string
  slug: string
  title: string
  url: string
  excerpt: string
}

function clean(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\$\{[^}]*\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main(): Promise<void> {
  if (!(await robotsAllows(PAGE))) {
    console.error(`robots.txt disallows ${PAGE}`)
    process.exit(1)
  }
  const html = await fetchText(PAGE)

  const inertia = html.match(
    /https:\/\/bookface-static\.ycombinator\.com\/vite\/assets\/inertia-ycdc-[^"']+\.js/,
  )?.[0]
  if (!inertia) throw new Error('Could not find the page bundle')
  const bundle = await fetchText(inertia)
  const registryPath = bundle.match(/\.\/(component_registry-[^"']+\.js)/)?.[1]
  if (!registryPath) throw new Error('Could not find the component registry')
  const registry = await fetchText(new URL(registryPath, inertia).toString())
  const componentPath = registry.match(/\.\/(RequestsForStartupsPage-[^`"']+\.js)/)?.[1]
  if (!componentPath) throw new Error('Could not find the RFS component')
  const component = await fetchText(new URL(componentPath, inertia).toString())

  const records = component.matchAll(
    /\{id:`([^`]+)`,title:`([^`]+)`,description:`((?:[^`\\]|\\.)*)`/g,
  )
  const requests: Request[] = []
  let season: string | undefined
  for (const [, id, title, description] of records) {
    if (!id || !title) continue
    if (SEASON_ID.test(id)) {
      season = id
      continue
    }
    if (!season) continue
    const date = SEASON_DATES[season]
    if (!date) {
      console.warn(`No publication date known for ${season}; add it to SEASON_DATES`)
      continue
    }
    const text = clean(description ?? '')
    requests.push({
      season,
      date,
      slug: id,
      title: clean(title),
      url: `${PAGE}#${season}-${id}`,
      excerpt: text.length > 600 ? `${text.slice(0, 597)}...` : text,
    })
  }

  writeJson(OUT, requests)
  const seasons = new Set(requests.map((request) => request.season))
  console.log(`Wrote ${requests.length} requests across ${seasons.size} seasons to ${OUT}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
