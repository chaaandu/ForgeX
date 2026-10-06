import Image from 'next/image'
import { archetypes, families, wall as copy } from '@/content/copy'
import { ARCHETYPES, FAMILIES, type ArchetypeId } from '@/lib/archetype'
import { Flip } from './Flip'
import { Glint } from './Glint'
import '@/components/card/card.css'

export type Face = { first: string; photo: string; archetype: ArchetypeId | null }

/**
 * The founder wall: every face that has not asked to be left off, as small
 * cards that drift and flip. Rendered on the server as plain buttons, with one
 * tiny client listener doing every flip, because hydrating 117 components on a
 * mid-range phone cost two seconds of main thread before the headline painted.
 */
export function Wall({ faces }: { faces: Face[] }) {
  return (
    <>
      <Flip />
      <Glint />
      <ul className="wall m-0 grid list-none content-start gap-1.5 px-3 pt-16 md:gap-2 md:px-6 md:pt-20" aria-label={copy.label}>
        {faces.map((face, index) => {
          const kind = face.archetype ? ARCHETYPES[face.archetype] : null
          return (
            <li key={face.photo} className="wall-cell" style={{ ['--i' as string]: index }}>
              <button
                type="button"
                className="wf"
                data-face=""
                data-first={face.first}
                data-kind={kind ? `${families[kind.family].name}\n${archetypes[kind.id].name}` : copy.unplaced}
                aria-pressed="false"
                aria-label={copy.face(face.first, kind ? archetypes[kind.id].name : null)}
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
                    {kind ? <Image src={FAMILIES[kind.family].head} alt="" width={64} height={64} className="wf-head" loading="lazy" /> : null}
                    {/* Filled in when flipped: 117 hidden labels would otherwise be
                        most of the page's text, all of it tiny. The button's
                        label already says who this is. */}
                    <b />
                    <i />
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
