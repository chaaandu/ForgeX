import Image from 'next/image'
import { archetypes, wall as copy } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'
import { Flip } from './Flip'
import '@/components/card/card.css'

export type Face = { first: string; photo: string; archetype: ArchetypeId }

/**
 * The founder wall: every placed founder who has not asked to be left off,
 * as small tiles that flip to their archetype standing whole in its own light.
 * Rendered on the server as plain buttons, with one tiny client listener doing
 * every flip, because hydrating 117 components on a mid-range phone cost two
 * seconds of main thread before the headline painted.
 */
export function Wall({ faces }: { faces: Face[] }) {
  return (
    <>
      <Flip />
      <ul
        className="wall m-0 grid list-none content-start gap-1.5 px-3 pt-16 md:gap-2 md:px-6 md:pt-20"
        aria-label={copy.label}
      >
        {faces.map((face, index) => {
          const kind = ARCHETYPES[face.archetype]
          const family = FAMILIES[kind.family]
          return (
            <li
              key={face.photo}
              className="wall-cell"
              style={{ ['--i' as string]: index, ['--fam' as string]: family.tint }}
            >
              <button
                type="button"
                className="wf"
                data-face=""
                data-first={face.first}
                data-kind={archetypes[kind.id].name}
                aria-pressed="false"
                aria-label={copy.face(face.first, archetypes[kind.id].name)}
              >
                <span className="wf-inner">
                  <span className="wf-front">
                    <Image
                      src={face.photo}
                      alt=""
                      width={120}
                      height={120}
                      sizes="(max-width: 720px) 19vw, (max-width: 1200px) 10vw, 7vw"
                      loading={index < 26 ? 'eager' : 'lazy'}
                      fetchPriority="low"
                    />
                  </span>
                  <span className="wf-back" aria-hidden="true">
                    {/* The whole figure, never a crop, standing on the tile's floor. */}
                    <Image
                      src={family.art}
                      alt=""
                      width={160}
                      height={160}
                      sizes="(max-width: 720px) 19vw, (max-width: 1200px) 10vw, 7vw"
                      className="wf-figure"
                      loading="lazy"
                    />
                    {/* Filled in when flipped: 117 hidden labels would otherwise be
                        most of the page's text, all of it tiny. The button's
                        label already says who this is. */}
                    <span className="wf-text">
                      <b />
                      <i />
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
