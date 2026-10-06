import { Relic } from '@/components/relic/Relic'
import { ARCHETYPE_IDS, ARCHETYPES, FAMILIES } from '@/lib/archetype'

/** Renders every relic once, still, on transparent ground, for `pnpm art:relics` to capture. */
export default function Relics() {
  return (
    <main style={{ display: 'flex', flexWrap: 'wrap', gap: 0, background: 'transparent' }}>
      {ARCHETYPE_IDS.map((id) => (
        <div key={id} data-relic={id} style={{ width: 512, height: 512 }}>
          <Relic id={id} tint={FAMILIES[ARCHETYPES[id].family].tint} still />
        </div>
      ))}
    </main>
  )
}
