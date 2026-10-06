/**
 * A founder's permanent address, from their name: `Ananya Rao` → `ananya-rao`.
 * Accents fold to plain letters. A clash gets a numeric suffix in a stable
 * order (by email), and once seeded a slug never changes.
 */
export function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function assignSlugs(people: { email: string; name: string }[]): Map<string, string> {
  const taken = new Set<string>()
  const out = new Map<string, string>()
  for (const person of [...people].sort((a, b) => a.email.localeCompare(b.email))) {
    const base = slugify(person.name) || person.email.split('@')[0]!.replace(/[^a-z0-9]+/g, '-')
    let slug = base
    for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`
    taken.add(slug)
    out.set(person.email, slug)
  }
  return out
}
