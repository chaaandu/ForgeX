import { describe, expect, it } from 'vitest'
import { linkLabel, normaliseLink } from '@/lib/links'
import { safeNext } from '@/lib/next-path'
import { roleForEmail } from '@/lib/roles'
import { decode, encode } from '@/lib/sheet/tabs'
import { assignSlugs, slugify } from '@/lib/slug'

describe('roles', () => {
  it('reads the role from the domain alone', () => {
    expect(roleForEmail('a_b@forge27.mesaschool.co')).toBe('founder')
    expect(roleForEmail('Someone@MesaSchool.co')).toBe('team')
    expect(roleForEmail('x@evilmesaschool.co')).toBeNull()
    expect(roleForEmail('x@gmail.com')).toBeNull()
    expect(roleForEmail('')).toBeNull()
  })
})

describe('slugs', () => {
  it('folds accents and punctuation', () => {
    expect(slugify('Ananya Rao')).toBe('ananya-rao')
    expect(slugify("Zoë D'Souza")).toBe('zoe-d-souza')
  })
  it('suffixes clashes in a stable order', () => {
    const slugs = assignSlugs([
      { email: 'b@x', name: 'Ananya Rao' },
      { email: 'a@x', name: 'Ananya Rao' },
    ])
    expect(slugs.get('a@x')).toBe('ananya-rao')
    expect(slugs.get('b@x')).toBe('ananya-rao-2')
  })
})

describe('links', () => {
  it('accepts urls, handles and @handles', () => {
    expect(normaliseLink('github', 'https://github.com/ananya?tab=repos')).toBe(
      'https://github.com/ananya',
    )
    expect(normaliseLink('github', '@ananya')).toBe('https://github.com/ananya')
    expect(normaliseLink('linkedin', 'ananya-rao')).toBe('https://www.linkedin.com/in/ananya-rao')
    expect(normaliseLink('portfolio', 'ananya.dev')).toBe('https://ananya.dev')
  })
  it('refuses anything that is not a link to the right place', () => {
    expect(normaliseLink('github', 'javascript:alert(1)')).toBeNull()
    expect(normaliseLink('github', 'https://evilgithub.com/x')).toBeNull()
    expect(normaliseLink('linkedin', 'https://github.com/x')).toBeNull()
    expect(normaliseLink('portfolio', 'not a link')).toBeNull()
    expect(normaliseLink('github', '')).toBeNull()
  })
  it('labels saved links', () => {
    expect(linkLabel('github', 'https://github.com/ananya')).toBe('@ananya')
    expect(linkLabel('portfolio', 'https://www.ananya.dev')).toBe('ananya.dev')
  })
})

describe('sheet codec', () => {
  it('reads by header, not position', () => {
    const rows = decode('events', [
      ['Kind', 'At', 'Data', 'Email', 'Extra'],
      ['arrived', '2026-10-06', '{}', 'a@x', 'ignored'],
    ])
    expect(rows[0]?.cells).toEqual({ At: '2026-10-06', Email: 'a@x', Kind: 'arrived', Data: '{}' })
    expect(rows[0]?.row).toBe(2)
  })
  it('fails loudly when a column is renamed', () => {
    expect(() => decode('events', [['When', 'Email', 'Kind', 'Data']])).toThrow(
      /missing columns: At/,
    )
  })
  it('writes in the sheet’s own column order', () => {
    expect(encode(['Kind', 'Email'], { Email: 'a@x', Kind: 'pick' })).toEqual(['pick', 'a@x'])
  })
})

describe('where sign-in returns to', () => {
  it('keeps a path on this site and refuses anything else', () => {
    expect(safeNext('/world')).toBe('/world')
    expect(safeNext('/why?p=P012')).toBe('/why?p=P012')
    expect(safeNext('//evil.com')).toBe('/enter')
    expect(safeNext('https://evil.com')).toBe('/enter')
    expect(safeNext('/login?next=/x')).toBe('/enter')
    expect(safeNext(undefined)).toBe('/enter')
  })
})
