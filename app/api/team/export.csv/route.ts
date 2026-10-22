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
  const head = [
    'Number',
    'Name',
    'Email',
    'Reviewer',
    'Group',
    'POC',
    'Status',
    'Progress',
    'Problem',
    'Own or bank',
    'Primary research',
    'Secondary research',
    'GitHub',
    'Prototype',
    'Prototype at',
    'LinkedIn post',
    'More posts',
    'Live link',
    'Launch at',
    'Pitch deck',
    'Loom',
    'Pitch at',
    'Family',
    'Archetype',
    'Last active',
    'Page',
  ]
  const body = rows.map((row) =>
    [
      row.number,
      row.name,
      row.email,
      row.reviewer,
      row.group,
      row.poc,
      row.word,
      `${row.progress}%`,
      row.title,
      row.state === 'none' ? '' : row.state === 'bank' ? 'Bank' : 'Own',
      row.research.primary,
      row.research.secondary,
      row.fields.github ?? '',
      row.fields.prototype ?? '',
      row.sentAt.prototype,
      row.fields.linkedin ?? '',
      (row.fields.linkedinMore ?? '').replace(/\n/g, ' '),
      row.fields.live ?? '',
      row.sentAt.launch,
      row.fields.deck ?? '',
      row.fields.video ?? '',
      row.sentAt.pitch,
      row.family,
      row.archetype,
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
      'content-disposition': `attachment; filename="forgex-hackathon-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  })
}
