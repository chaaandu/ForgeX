import { logEvent } from '@/lib/data/events'
import { getViewer } from '@/lib/session'
import { founderRows } from '@/lib/team-rows'

const cell = (value: string | number | null) => {
  const text = value === null ? '' : String(value)
  // Quote everything, and stop a cell from being read as a spreadsheet formula.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET() {
  const viewer = await getViewer()
  if (viewer?.role !== 'team') return new Response('Not found', { status: 404 })
  const rows = await founderRows()
  const head = ['Number', 'Name', 'Email', 'Track', 'Family', 'Archetype', 'Level', 'Pick', 'Status', 'Last active', 'Page']
  const body = rows.map((row) =>
    [row.number, row.name, row.email, row.track, row.family, row.archetype, row.level, row.pick, row.status, row.lastActive, `/f/${row.slug}`]
      .map(cell)
      .join(','),
  )
  await logEvent(viewer.email, 'export', { rows: rows.length })
  return new Response([head.map(cell).join(','), ...body].join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="forgex-founders-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  })
}
