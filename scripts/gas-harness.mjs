/**
 * Runs apps-script/Code.gs in node against a fake Sheet, so the backend's rules
 * can be checked without deploying. Not part of the app.
 *
 *   node scripts/gas-harness.mjs
 */
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

/** A sheet is a dense 2D array of strings. */
function makeSheet(name, rows) {
  return {
    name,
    rows,
    getLastRow: () => rows.length,
    getLastColumn: () => Math.max(...rows.map((r) => r.length), 1),
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValues: () => {
          const out = []
          for (let i = 0; i < nr; i += 1) {
            const row = rows[r - 1 + i] ?? []
            const line = []
            for (let j = 0; j < nc; j += 1) line.push(row[c - 1 + j] ?? '')
            out.push(line)
          }
          return out
        },
        setValue: (v) => {
          while (rows.length < r) rows.push([])
          const row = rows[r - 1]
          while (row.length < c) row.push('')
          row[c - 1] = v
        },
        setValues: (vals) => {
          vals.forEach((line, i) => {
            while (rows.length < r + i) rows.push([])
            line.forEach((v, j) => {
              const row = rows[r - 1 + i]
              while (row.length < c + j) row.push('')
              row[c - 1 + j] = v
            })
          })
        },
      }
    },
    appendRow: (row) => rows.push([...row]),
    setFrozenRows: () => undefined,
    copyTo: () => makeSheet('copy', rows.map((r) => [...r])),
    setName: () => undefined,
    hideSheet: () => undefined,
  }
}

const headers = [
  'ID',
  'Title',
  'Tag',
  'Cluster',
  'Region',
  'Problem',
  'Who experiences it',
  'Why it matters',
  'Challenge',
  'North star metric',
  'Potential directions (examples only)',
  'Constraints',
  'Build expectation',
  'Tools to use',
]
const problemRows = [headers]
for (const id of ['P001', 'P002', 'P003']) {
  problemRows.push([
    id,
    `Title ${id}`,
    '🟣 Epic',
    'A. Cluster',
    'India',
    'prob',
    'who',
    'why',
    'chal',
    'ns',
    'a; b',
    'cons',
    'build',
    'Docs: Claude; Data: Sheets',
  ])
}

const problems = makeSheet('Problems', problemRows)
const sheets = { Problems: problems }
let logTab = null

const ctx = {
  console,
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (k) =>
        k === 'SHARED_SECRET'
          ? 'secret'
          : k === 'BETS_CLOSE_AT'
            ? '2030-01-01T00:00:00+05:30'
            : null,
    }),
  },
  SpreadsheetApp: {
    getActive: () => ({
      getSheetByName: (n) => (n === 'Problems' ? problems : n === 'Bet log' ? logTab : null),
      insertSheet: (n) => {
        logTab = makeSheet(n, [])
        sheets[n] = logTab
        return logTab
      },
    }),
    flush: () => undefined,
  },
  LockService: {
    getScriptLock: () => ({ waitLock: () => undefined, releaseLock: () => undefined }),
  },
  ContentService: {
    createTextOutput: (t) => ({ setMimeType: () => t }),
    MimeType: { JSON: 'json' },
  },
  Utilities: {
    formatDate: (d) => new Date(d).toISOString().replace('Z', '+05:30').slice(0, 19) + '+05:30',
  },
}
vm.createContext(ctx)
vm.runInContext(readFileSync('apps-script/Code.gs', 'utf8'), ctx)

const call = (body) =>
  JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ secret: 'secret', ...body }) } }))
const A = { email: 'a@forge27.mesaschool.co', name: 'Student A' }
const B = { email: 'b@forge27.mesaschool.co', name: 'Student B' }
const show = (label) => {
  const data = call({ action: 'data' })
  const held = Object.entries(data.bets)
    .map(([id, b]) => `${id}=${b.name}/${b.email || '-'}`)
    .join(' ')
  console.log(
    label.padEnd(26),
    '|',
    held || '(none)',
    '| col O:',
    problemRows
      .slice(1)
      .map((r) => r[14] || '-')
      .join(','),
  )
}

console.log(
  'unauthorized:',
  JSON.stringify(
    JSON.parse(ctx.doPost({ postData: { contents: '{"secret":"nope","action":"data"}' } })),
  ),
)
show('start')
console.log(
  'A bets P001      :',
  JSON.stringify(call({ action: 'bet', ...A, problemId: 'P001' }).ok),
)
show('after A bets P001')
console.log('B bets P001      :', JSON.stringify(call({ action: 'bet', ...B, problemId: 'P001' })))
console.log(
  'A bets P001 again:',
  JSON.stringify(call({ action: 'bet', ...A, problemId: 'P001' }).ok),
)
console.log(
  'A moves to P002  :',
  JSON.stringify(call({ action: 'bet', ...A, problemId: 'P002' }).ok),
)
show('after A moves')
console.log(
  'B bets P001      :',
  JSON.stringify(call({ action: 'bet', ...B, problemId: 'P001' }).ok),
)
show('after B takes P001')
console.log(
  'B releases P002  :',
  JSON.stringify(call({ action: 'release', email: B.email, problemId: 'P002' }).ok),
  '(not theirs)',
)
show('after bogus release')
console.log(
  'A releases P002  :',
  JSON.stringify(call({ action: 'release', email: A.email, problemId: 'P002' }).ok),
)
show('after A releases')
console.log('bad id           :', JSON.stringify(call({ action: 'bet', ...A, problemId: 'P999' })))
console.log('\nBet log:')
for (const row of logTab.rows) console.log(' ', row.join(' | '))
console.log('\nmanual edit: set P003 Bet by to "Student B" by hand')
problemRows[3][14] = 'Student B'
show('after manual edit')
console.log('A bets P003      :', JSON.stringify(call({ action: 'bet', ...A, problemId: 'P003' })))
console.log(
  'B bets P001 again:',
  JSON.stringify(call({ action: 'bet', ...B, problemId: 'P001' }).ok),
  '(B already holds P001 and P003 by hand)',
)
show('end')
const data = call({ action: 'data' })
console.log(
  '\nproblems parsed:',
  data.problems.length,
  JSON.stringify(data.problems[0].tools),
  data.problems[0].tag,
  data.problems[0].directions,
)

console.log('\n### edit action')
console.log(
  'batch result:',
  JSON.stringify(
    call({
      action: 'edit',
      edits: [
        { id: 'P002', values: { 'North star metric': 'rewritten', Mechanic: 'doc-reconcile' } },
        { id: 'P003', values: { Status: 'cut' } },
        { id: 'P999', values: { Status: 'cut' } },
      ],
    }),
  ),
)
const after = call({ action: 'data' })
console.log('on the board after cutting P003:', after.problems.map((x) => x.id).join(','))
console.log('P002 north star :', after.problems.find((x) => x.id === 'P002').northStar)
console.log('P002 mechanic   :', after.problems.find((x) => x.id === 'P002').mechanic)
console.log('new headers     :', problemRows[0].slice(14).join(' | '))

console.log('\n### three changes, then the pick is final')
const C = { email: 'c@forge27.mesaschool.co', name: 'Student C' }
// Clear the board so C has somewhere to go.
for (const row of problemRows.slice(1)) row[14] = ''
const picks = ['P001', 'P002', 'P003', 'P001', 'P002']
picks.forEach((id, i) => {
  const r = call({ action: 'bet', ...C, problemId: id })
  const label = i === 0 ? 'first pick ' : `change ${i}  `
  console.log(`  ${label} -> ${id}: ${r.ok ? 'ok' : JSON.stringify(r)}`)
})
const end = call({ action: 'data' })
console.log('  C ends on   :', Object.entries(end.bets).find(([, b]) => b.email === C.email)?.[0])
console.log('  picks logged:', end.picks[C.email], '| max changes:', end.maxChanges)
console.log('  release now :', JSON.stringify(call({ action: 'release', email: C.email, problemId: 'P001' })))

console.log('\n### clearing a Bet by cell by hand')
// Fresh board and a fresh student.
for (const row of problemRows.slice(1)) row[14] = ''
logTab.rows.length = 1
const D = { email: 'd@forge27.mesaschool.co', name: 'Student D' }

call({ action: 'bet', ...D, problemId: 'P001' })
let state = call({ action: 'data' })
console.log('  after betting P001   : holder =', state.bets.P001?.name, '| picks =', state.picks[D.email])

// The owner clears the cell, the way they would in the Sheet.
problemRows[1][14] = ''
state = call({ action: 'data' })
console.log('  after clearing cell  : P001 held =', !!state.bets.P001, '| picks still =', state.picks[D.email])

const again = call({ action: 'bet', ...D, problemId: 'P002' })
state = call({ action: 'data' })
console.log('  student bets again   :', again.ok ? 'allowed' : JSON.stringify(again), '| picks now =', state.picks[D.email])
console.log('  so changes used      :', state.picks[D.email] - 1, 'of', state.maxChanges)

// Removing the log row is what actually gives the change back. Mutate in
// place: the fake sheet captured this array, so reassigning it does nothing.
const keep = logTab.rows.filter((r) => !(r[2] === D.email && r[4] === 'P001'))
logTab.rows.splice(0, logTab.rows.length, ...keep)
state = call({ action: 'data' })
console.log('  after deleting the log row for P001: picks =', state.picks[D.email], '-> changes used =', state.picks[D.email] - 1)
