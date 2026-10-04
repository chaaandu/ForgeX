/**
 * ForgeX 2.0 Bets — the only writer to this Sheet.
 *
 * Every call is a POST with a JSON body { secret, action, ...payload }. The
 * secret is checked against the SHARED_SECRET script property, every write
 * takes the script lock and re-reads the row inside it, and the Bet log tab is
 * append-only.
 *
 * Script properties this expects:
 *   SHARED_SECRET   long random string, the same as APPS_SCRIPT_SECRET on Vercel
 *   BETS_CLOSE_AT   ISO 8601 with offset, e.g. 2026-10-22T23:59:00+05:30
 */

var PROBLEMS_TAB = 'Problems'
var LOG_TAB = 'Bet log'
var TZ = 'Asia/Kolkata'

var BET_BY = 'Bet by'
var BET_EMAIL = 'Bet email'
var BET_PHOTO = 'Bet photo'
var BET_AT = 'Bet at'
var BET_HEADERS = [BET_BY, BET_EMAIL, BET_PHOTO, BET_AT]

var LOG_HEADERS = ['Timestamp', 'Action', 'Email', 'Name', 'Problem ID', 'Previous problem ID']

/* ---------------------------------------------------------------- plumbing */

function doPost(e) {
  var body
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}')
  } catch (err) {
    return json({ ok: false, error: 'bad_request' })
  }

  var expected = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET')
  if (!expected || body.secret !== expected) return json({ ok: false, error: 'unauthorized' })

  try {
    if (body.action === 'data') return json(handleData())
    if (body.action === 'bet') return json(handleBet(body))
    if (body.action === 'release') return json(handleRelease(body))
    return json({ ok: false, error: 'unknown_action' })
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) })
  }
}

function doGet() {
  return json({ ok: false, error: 'post_only' })
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function now() {
  return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ss'+05:30'")
}

function isClosed() {
  var raw = PropertiesService.getScriptProperties().getProperty('BETS_CLOSE_AT')
  if (!raw) return false
  var close = new Date(raw).getTime()
  if (isNaN(close)) return false
  return Date.now() >= close
}

/* ------------------------------------------------------------------ sheets */

function problemsSheet() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(PROBLEMS_TAB)
  if (!sheet) throw new Error('no ' + PROBLEMS_TAB + ' tab')
  return sheet
}

/** Header name to zero-based column index, creating the four bet columns if absent. */
function headerIndex(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1)
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0]

  for (var i = 0; i < BET_HEADERS.length; i++) {
    if (headers.indexOf(BET_HEADERS[i]) === -1) {
      width += 1
      sheet.getRange(1, width).setValue(BET_HEADERS[i])
      headers.push(BET_HEADERS[i])
    }
  }

  var index = {}
  for (var c = 0; c < headers.length; c++) {
    var name = String(headers[c]).trim()
    if (name && !(name in index)) index[name] = c
  }
  return index
}

function logSheet() {
  var book = SpreadsheetApp.getActive()
  var sheet = book.getSheetByName(LOG_TAB)
  if (!sheet) {
    sheet = book.insertSheet(LOG_TAB)
    sheet.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS])
    sheet.setFrozenRows(1)
  }
  return sheet
}

function appendLog(action, email, name, problemId, previousId) {
  logSheet().appendRow([now(), action, email, name, problemId, previousId || ''])
}

/** Every data row, with its 1-based sheet row number. */
function readRows(sheet, index) {
  var last = sheet.getLastRow()
  if (last < 2) return []
  var width = sheet.getLastColumn()
  var values = sheet.getRange(2, 1, last - 1, width).getValues()

  var rows = []
  for (var r = 0; r < values.length; r++) {
    var id = String(values[r][index['ID']] || '').trim()
    if (!id) continue
    rows.push({ row: r + 2, id: id, values: values[r] })
  }
  return rows
}

function cell(row, index, header) {
  var at = index[header]
  if (at === undefined) return ''
  var value = row.values[at]
  if (value instanceof Date) return Utilities.formatDate(value, TZ, "yyyy-MM-dd'T'HH:mm:ss'+05:30'")
  return value === null || value === undefined ? '' : String(value).trim()
}

/* --------------------------------------------------------------- parsing */

function normaliseTag(raw) {
  var word = String(raw || '')
    .replace(/[^A-Za-z]/g, '')
    .toLowerCase()
  var allowed = ['rare', 'epic', 'legendary', 'mythic']
  return allowed.indexOf(word) === -1 ? null : word
}

function splitList(raw) {
  var parts = String(raw || '').split(/;\s+/)
  var out = []
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim().replace(/[.;]$/, '')
    if (part) out.push(part)
  }
  return out
}

function parseTools(raw) {
  var chunks = String(raw || '').split(/;\s+/)
  var out = []
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i].trim()
    if (!chunk) continue
    var at = chunk.indexOf(': ')
    if (at === -1) out.push({ kit: '', tools: chunk })
    else out.push({ kit: chunk.slice(0, at).trim(), tools: chunk.slice(at + 2).trim() })
  }
  return out
}

function toProblem(row, index) {
  var tag = normaliseTag(cell(row, index, 'Tag'))
  if (!tag) return null
  return {
    id: row.id,
    title: cell(row, index, 'Title'),
    tag: tag,
    cluster: cell(row, index, 'Cluster'),
    region: cell(row, index, 'Region'),
    problem: cell(row, index, 'Problem'),
    who: cell(row, index, 'Who experiences it'),
    whyItMatters: cell(row, index, 'Why it matters'),
    challenge: cell(row, index, 'Challenge'),
    northStar: cell(row, index, 'North star metric'),
    directions: splitList(cell(row, index, 'Potential directions (examples only)')),
    constraints: cell(row, index, 'Constraints'),
    buildExpectation: cell(row, index, 'Build expectation'),
    tools: parseTools(cell(row, index, 'Tools to use')),
  }
}

function betsFrom(rows, index) {
  var bets = {}
  for (var i = 0; i < rows.length; i++) {
    var email = cell(rows[i], index, BET_EMAIL).toLowerCase()
    if (!email) continue
    bets[rows[i].id] = {
      name: cell(rows[i], index, BET_BY),
      email: email,
      photo: cell(rows[i], index, BET_PHOTO),
      at: cell(rows[i], index, BET_AT),
    }
  }
  return bets
}

/* ------------------------------------------------------------------ actions */

function handleData() {
  var sheet = problemsSheet()
  var index = headerIndex(sheet)
  var rows = readRows(sheet, index)

  var problems = []
  for (var i = 0; i < rows.length; i++) {
    var problem = toProblem(rows[i], index)
    if (problem) problems.push(problem)
  }

  return { ok: true, problems: problems, bets: betsFrom(rows, index) }
}

function writeBet(sheet, index, row, name, email, photo, at) {
  sheet.getRange(row, index[BET_BY] + 1).setValue(name)
  sheet.getRange(row, index[BET_EMAIL] + 1).setValue(email)
  sheet.getRange(row, index[BET_PHOTO] + 1).setValue(photo)
  sheet.getRange(row, index[BET_AT] + 1).setValue(at)
}

function clearBet(sheet, index, row) {
  writeBet(sheet, index, row, '', '', '', '')
}

function handleBet(body) {
  var email = String(body.email || '').trim().toLowerCase()
  var name = String(body.name || '').trim()
  var photo = String(body.photo || '').trim()
  var problemId = String(body.problemId || '').trim()
  if (!email || !problemId) return { ok: false, error: 'bad_request' }
  if (isClosed()) return { ok: false, error: 'closed' }

  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    // Everything below is read fresh inside the lock, so two students tapping
    // the same problem at the same moment can never both win.
    var sheet = problemsSheet()
    var index = headerIndex(sheet)
    var rows = readRows(sheet, index)

    var target = null
    var previous = null
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === problemId) target = rows[i]
      if (cell(rows[i], index, BET_EMAIL).toLowerCase() === email) previous = rows[i]
    }

    if (!target) return { ok: false, error: 'not_found' }

    var holder = cell(target, index, BET_EMAIL).toLowerCase()
    if (holder === email) return { ok: true, bets: betsFrom(rows, index) }
    if (holder) return { ok: false, error: 'taken', by: cell(target, index, BET_BY) }

    var at = now()
    var action = 'bet'
    var previousId = ''

    if (previous) {
      clearBet(sheet, index, previous.row)
      previousId = previous.id
      action = 'move'
    }

    writeBet(sheet, index, target.row, name, email, photo, at)
    SpreadsheetApp.flush()
    appendLog(action, email, name, problemId, previousId)

    return { ok: true, bets: betsFrom(readRows(sheet, index), index) }
  } finally {
    lock.releaseLock()
  }
}

function handleRelease(body) {
  var email = String(body.email || '').trim().toLowerCase()
  var problemId = String(body.problemId || '').trim()
  if (!email || !problemId) return { ok: false, error: 'bad_request' }
  if (isClosed()) return { ok: false, error: 'closed' }

  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    var sheet = problemsSheet()
    var index = headerIndex(sheet)
    var rows = readRows(sheet, index)

    var target = null
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === problemId) target = rows[i]
    }
    if (!target) return { ok: false, error: 'not_found' }

    if (cell(target, index, BET_EMAIL).toLowerCase() === email) {
      var name = cell(target, index, BET_BY)
      clearBet(sheet, index, target.row)
      SpreadsheetApp.flush()
      appendLog('release', email, name, problemId, '')
    }

    return { ok: true, bets: betsFrom(readRows(sheet, index), index) }
  } finally {
    lock.releaseLock()
  }
}
