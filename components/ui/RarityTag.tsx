import { RARITY_LABEL } from '@/lib/problem'
import type { Rarity } from '@/lib/taxonomy'

const COLOR: Record<Rarity, string> = {
  rare: 'var(--color-rare)',
  epic: 'var(--color-epic)',
  legendary: 'var(--color-legendary)',
  mythic: 'var(--color-mythic)',
}

/** Rarity is scope and ambition, never difficulty. An accent, never a fill. */
export function RarityTag({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[12px] leading-none tracking-[0.08em] uppercase"
      style={{ color: COLOR[rarity] }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: COLOR[rarity], boxShadow: `0 0 10px ${COLOR[rarity]}` }}
      />
      {RARITY_LABEL[rarity]}
    </span>
  )
}

export function rarityColor(rarity: Rarity): string {
  return COLOR[rarity]
}
