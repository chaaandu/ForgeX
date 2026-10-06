'use client'

import Image from 'next/image'
import { useState } from 'react'
import { archetypes } from '@/content/copy'
import type { Face } from './data'

/**
 * The founder wall as plain DOM: a grid of faces, each a button. Hover, focus
 * or tap raises one and names it. This is the version that ships to every
 * device and to the accessibility tree; WebGL, if it earns a place, sits on top.
 */
export function Wall({
  faces,
  className,
  faceClassName,
  tagClassName,
  priority = 8,
}: {
  faces: Face[]
  className?: string
  faceClassName?: string
  tagClassName?: string
  priority?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  return (
    <ul className={className} aria-label="Founders">
      {faces.map((face, index) => (
        <li key={face.photo} style={{ ['--i' as string]: index }}>
          <button
            type="button"
            className={faceClassName}
            data-active={active === index || undefined}
            onPointerEnter={() => setActive(index)}
            onPointerLeave={() => setActive((value) => (value === index ? null : value))}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((value) => (value === index ? null : index))}
            aria-label={`${face.first}${face.archetype ? `, ${archetypes[face.archetype].name}` : ''}`}
          >
            <Image
              src={face.photo}
              alt=""
              width={160}
              height={160}
              sizes="(max-width: 640px) 25vw, 120px"
              priority={index < priority}
            />
            <span className={tagClassName} aria-hidden="true">
              <b>{face.first}</b>
              {face.archetype ? <i>{archetypes[face.archetype].name}</i> : null}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
