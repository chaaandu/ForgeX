import 'server-only'
import { archetypes, families, share as copy } from '@/content/copy'
import { ARCHETYPES } from '@/lib/archetype'
import type { Founder } from '@/lib/data/founders'
import { researchOf } from '@/lib/data/research'

/** The public address the site lives at, for links and previews that leave it. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

/**
 * What a shared card may say in public: the name, the archetype, and who they
 * are building for, which the landing already shows. Never anything else.
 * Founders who asked to be left off the wall can't be shared.
 */
export async function shareable(founder: Founder | null) {
  if (!founder || !founder.wall) return null
  const kind = founder.archetype && founder.level >= 2 ? ARCHETYPES[founder.archetype] : null
  const research = await researchOf(founder.email)
  const forWho = research?.sent ? research.forWho : ''
  const archetype = kind ? `${families[kind.family].name} · ${archetypes[kind.id].name}` : ''
  return {
    founder,
    title: copy.title(founder.name),
    archetype,
    forWho,
    line: forWho ? copy.building(forWho) : archetype,
  }
}
