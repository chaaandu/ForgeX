/** A short, sortable, unguessable-enough ID for an appended row: `ms_lq3x9a4k2b`. */
export function newId(prefix: string): string {
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${time}${random}`
}
