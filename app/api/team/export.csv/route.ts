import { logEvent } from '@/lib/data/events'
import { getViewer } from '@/lib/session'
import { founderRows, type FounderRow } from '@/lib/team-rows'

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
  const head = [
    'Number',
    'Name',
    'Email',
    'Track',
    'Pod',
    'Family',
    'Archetype',
    'Level',
    'Building for',
    'Steps done',
    'Steps due',
    'Behind',
    'Stop 1',
    'Stop 2',
    'Stop 3',
    'Waiting on us',
    'Last active',
    'Page',
  ]
  const stop = (cell: FounderRow['stops'][number] | undefined) =>
    cell ? [cell.state, cell.rating].filter(Boolean).join(' ') : ''
  const body = rows.map((row) =>
    [
      row.number,
      row.name,
      row.email,
      row.trackLabel,
      row.pod,
      row.family,
      row.archetype,
      row.level,
      row.forWho,
      row.done,
      row.due,
      row.behind,
      stop(row.stops[0]),
      stop(row.stops[1]),
      stop(row.stops[2]),
      row.waiting ? 'yes' : '',
      row.lastActive,
      `/f/${row.slug}`,
    ]
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
