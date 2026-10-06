'use client'

import Image from 'next/image'
import { useState } from 'react'
import { archetypes, families, wall as copy } from '@/content/copy'
import { ARCHETYPES, type ArchetypeId } from '@/lib/archetype'

export type Face = { first: string; photo: string; archetype: ArchetypeId | null }

/**
 * One founder on the wall: a small card that flips over when tapped to show
 * who they are. Hover lifts it; focus and Enter flip it too. Under reduced
 * motion it crossfades instead of turning.
 */
export function WallFace({ face, priority }: { face: Face; priority: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const kind = face.archetype ? ARCHETYPES[face.archetype] : null
  return (
    <button
      type="button"
      className="wf"
      aria-pressed={flipped}
      aria-label={copy.face(face.first, kind ? archetypes[kind.id].name : null)}
      onClick={() => setFlipped((value) => !value)}
      onBlur={() => setFlipped(false)}
    >
      <span className="wf-inner" data-flipped={flipped || undefined}>
        <span className="wf-front">
          <Image src={face.photo} alt="" width={160} height={160} sizes="(max-width: 640px) 22vw, 120px" priority={priority} />
        </span>
        <span className="wf-back" aria-hidden="true">
          {kind ? <Image src={kind.relic} alt="" width={64} height={64} className="wf-relic" /> : null}
          <b>{face.first}</b>
          {kind ? (
            <i>
              {families[kind.family].name}
              <br />
              {archetypes[kind.id].name}
            </i>
          ) : (
            <i>{copy.unplaced}</i>
          )}
        </span>
      </span>
    </button>
  )
}
