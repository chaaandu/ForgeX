/**
 * ForgeX 2.0 Bets — the only writer to this Sheet.
 *
 * Every call is a POST with a JSON body { secret, action, ...payload }. The
 * secret is checked against the SHARED_SECRET script property, every write
 * takes the script lock and re-reads the row inside it, and the Bet log tab is
 * append-only.
 *
 * The Problems tab carries one extra column, "Bet by", holding the bettor's
 * name and nothing else. Who that is and when they bet comes from the Bet log,
 * which already records the email and the timestamp of every move.
 *
 * Script properties this expects:
 *   SHARED_SECRET   long random string, the same as APPS_SCRIPT_SECRET on Vercel
 *   BETS_CLOSE_AT   ISO 8601 with offset, e.g. 2026-10-22T23:59:00+05:30
 */

var PROBLEMS_TAB = 'Problems'
var LOG_TAB = 'Bet log'
var TZ = 'Asia/Kolkata'

var BET_BY = 'Bet by'
var BET_HEADERS = [BET_BY]

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

var STAMP = "yyyy-MM-dd'T'HH:mm:ss'+05:30'"

function now() {
  return Utilities.formatDate(new Date(), TZ, STAMP)
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
  if (value instanceof Date) return Utilities.formatDate(value, TZ, STAMP)
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

/**
 * The last bet or move per problem, from the Bet log. Release rows clear the
 * entry, so what comes back is whoever the log says holds each problem now.
 */
function latestFromLog() {
  var sheet = logSheet()
  var last = sheet.getLastRow()
  if (last < 2) return {}

  var values = sheet.getRange(2, 1, last - 1, LOG_HEADERS.length).getValues()
  var latest = {}
  for (var r = 0; r < values.length; r++) {
    var row = values[r]
    var action = String(row[1] || '').trim()
    var problemId = String(row[4] || '').trim()
    if (!problemId) continue

    if (action === 'release') {
      delete latest[problemId]
      continue
    }
    if (action !== 'bet' && action !== 'move') continue

    var at = row[0]
    latest[problemId] = {
      at: at instanceof Date ? Utilities.formatDate(at, TZ, STAMP) : String(at || ''),
      email: String(row[2] || '').trim().toLowerCase(),
      name: String(row[3] || '').trim(),
    }

    // A move frees the problem it came from.
    var previousId = String(row[5] || '').trim()
    if (previousId) delete latest[previousId]
  }
  return latest
}

/**
 * Who holds what. The Problems tab decides occupancy, so clearing "Bet by" by
 * hand frees a problem, and the log fills in the email and the time.
 */
function betsFrom(rows, index, latest) {
  var bets = {}
  for (var i = 0; i < rows.length; i++) {
    var name = cell(rows[i], index, BET_BY)
    if (!name) continue

    var logged = latest[rows[i].id]
    var matches = logged && logged.name === name
    bets[rows[i].id] = {
      name: name,
      email: matches ? logged.email : '',
      photo: '',
      at: matches ? logged.at : '',
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

  return { ok: true, problems: problems, bets: betsFrom(rows, index, latestFromLog()) }
}

function writeBet(sheet, index, row, name) {
  sheet.getRange(row, index[BET_BY] + 1).setValue(name)
}

function clearBet(sheet, index, row) {
  writeBet(sheet, index, row, '')
}

function handleBet(body) {
  var email = String(body.email || '').trim().toLowerCase()
  var name = String(body.name || '').trim()
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
    var bets = betsFrom(rows, index, latestFromLog())

    var target = null
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === problemId) target = rows[i]
    }
    if (!target) return { ok: false, error: 'not_found' }

    // Matching on the name as well as the email picks up rows somebody filled
    // in by hand, which carry no email.
    var mine = function (bet) {
      return bet.email ? bet.email === email : bet.name === name
    }

    var holder = bets[problemId]
    if (holder) {
      if (mine(holder)) return { ok: true, bets: bets }
      return { ok: false, error: 'taken', by: holder.name }
    }

    // One problem per student.
    var previousId = ''
    for (var id in bets) {
      if (mine(bets[id])) previousId = id
    }

    var action = 'bet'
    if (previousId) {
      for (var j = 0; j < rows.length; j++) {
        if (rows[j].id === previousId) clearBet(sheet, index, rows[j].row)
      }
      action = 'move'
    }

    writeBet(sheet, index, target.row, name)
    SpreadsheetApp.flush()
    appendLog(action, email, name, problemId, previousId)

    return { ok: true, bets: betsFrom(readRows(sheet, index), index, latestFromLog()) }
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
    var bets = betsFrom(rows, index, latestFromLog())

    var target = null
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === problemId) target = rows[i]
    }
    if (!target) return { ok: false, error: 'not_found' }

    var holder = bets[problemId]
    if (holder && holder.email === email) {
      clearBet(sheet, index, target.row)
      SpreadsheetApp.flush()
      appendLog('release', email, holder.name, problemId, '')
    }

    return { ok: true, bets: betsFrom(readRows(sheet, index), index, latestFromLog()) }
  } finally {
    lock.releaseLock()
  }
}
