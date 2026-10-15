/**
 * A time as the Sheet shows it, `2026-10-23 12:41:05` in India time, back as
 * an ISO time for anything that formats or compares it. Stamps written before
 * seconds were added read too. Anything else comes back empty.
 */
export function stampToIso(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(:\d{2})?$/.exec(value.trim())
  return match ? `${match[1]}T${match[2]}${match[3] ?? ':00'}+05:30` : ''
}
