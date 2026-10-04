import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Tag } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** The one place a tag turns into a colour. */
export const TAG_COLOR: Record<Tag, string> = {
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
  mythic: '#EF4444',
}

export const TAG_LABEL: Record<Tag, string> = {
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
}

/** Fill at 14%, text at full, border at 30%. */
export function tagStyle(tag: Tag) {
  const color = TAG_COLOR[tag]
  return {
    backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
    borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
    color,
  }
}
