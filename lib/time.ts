const IST = 'Asia/Kolkata'

/** `7 Oct, 2:30 pm` in IST, for the student subline. */
export function formatCloseTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const period = get('dayPeriod').toLowerCase()
  return `${get('day')} ${get('month')}, ${get('hour')}:${get('minute')} ${period}`
}

/** `05 OCT` in IST, for the stamp ring. */
export function formatStampDate(iso: string): string {
  const date = new Date(iso)
  const safe = Number.isNaN(date.getTime()) ? new Date() : date
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    day: '2-digit',
    month: 'short',
  }).formatToParts(safe)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${get('day')} ${get('month')}`.toUpperCase()
}

/** `5 Oct 2026, 2:30 pm` in IST, for the team footer. */
export function formatBetTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/** Reads BETS_CLOSE_AT. Server only. */
export function closeTimeIso(): string {
  return process.env.BETS_CLOSE_AT ?? ''
}

export function isClosed(nowMs: number = Date.now()): boolean {
  const close = new Date(closeTimeIso()).getTime()
  if (Number.isNaN(close)) return false
  return nowMs >= close
}
