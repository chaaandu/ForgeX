'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useId } from 'react'
import { copy } from '@/lib/copy'
import { formatStampDate } from '@/lib/time'
import type { Tag } from '@/lib/types'
import { TAG_COLOR } from '@/lib/utils'

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function Stamp({
  size,
  tag,
  name,
  photo,
  at,
  /** `slam` on your own fresh bet, `fade` for one that arrived by polling. */
  entrance = 'none',
}: {
  size: number
  tag: Tag
  name: string
  photo: string
  at: string
  entrance?: 'slam' | 'fade' | 'none'
}) {
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const color = TAG_COLOR[tag]
  const withText = size >= 64
  const ring = copy.stampRing(formatStampDate(at))

  const slam = entrance === 'slam' && !reduced
  const animation = slam
    ? {
        initial: { scale: 1.8, opacity: 0 },
        animate: { scale: [1.8, 1, 1, 1], opacity: 1, x: [0, 0, -2, 0] },
        transition: {
          duration: 0.34,
          times: [0, 0.65, 0.82, 1],
          ease: [0.16, 1, 0.3, 1] as const,
        },
      }
    : entrance === 'none'
      ? { initial: false as const, animate: { scale: 1, opacity: 1 } }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <motion.span
      {...animation}
      className="pointer-events-none relative block shrink-0"
      style={{ width: size, height: size }}
      title={name}
    >
      <span
        className="absolute overflow-hidden rounded-full bg-black/40"
        style={{ inset: withText ? '16%' : '12%' }}
      >
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes={`${size}px`}
            unoptimized={photo.startsWith('/')}
            className="object-cover contrast-125 grayscale"
          />
        ) : (
          <span
            className="text-primary/70 flex h-full w-full items-center justify-center font-mono"
            style={{ fontSize: size * 0.28 }}
          >
            {initials(name)}
          </span>
        )}
      </span>

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ transform: 'rotate(-8deg)' }}
        aria-hidden
      >
        <defs>
          <filter id={`ink-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="7" />
            <feDisplacementMap
              in="SourceGraphic"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <path
            id={`ring-${uid}`}
            d="M 50,50 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
            fill="none"
          />
        </defs>
        <g filter={`url(#ink-${uid})`} opacity="0.92">
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke={color}
            strokeWidth={withText ? 2 : 3}
          />
          {withText && (
            <circle
              cx="50"
              cy="50"
              r="32.5"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.6"
            />
          )}
          {withText && (
            <text
              fill={color}
              style={{ fontSize: 7.2, letterSpacing: 1.1, fontFamily: 'var(--font-mono)' }}
            >
              <textPath href={`#ring-${uid}`} startOffset="50%" textAnchor="middle">
                {ring}
              </textPath>
            </text>
          )}
        </g>
      </svg>
      <span className="sr-only">{name}</span>
    </motion.span>
  )
}
