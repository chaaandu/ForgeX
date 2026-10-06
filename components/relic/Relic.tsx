'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ARCHETYPES, type ArchetypeId } from '@/lib/archetype'

/**
 * The relic. Its rendered still shows at once; the live 3D version, the
 * heaviest thing in the app, is fetched only once the browser is idle and
 * swaps in over it. Under reduced motion, or without WebGL, the still is all
 * anyone needs.
 */
const RelicScene = dynamic(() => import('./RelicScene'), { ssr: false, loading: () => null })

function canAnimate(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function Relic(props: { id: ArchetypeId; tint: string; spin?: boolean; still?: boolean; className?: string }) {
  const [live, setLive] = useState(Boolean(props.still))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (props.still || !canAnimate()) return
    // After the reveal has landed and the page has settled, then when idle.
    let handle = 0
    const timer = window.setTimeout(() => {
      handle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setLive(true), { timeout: 2000 })
        : window.setTimeout(() => setLive(true), 300)
    }, 2400)
    return () => {
      window.clearTimeout(timer)
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [props.still])

  return (
    <div className={props.className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {props.still ? null : (
        <Image src={ARCHETYPES[props.id].relic} alt="" fill sizes="160px" style={{ objectFit: 'contain', opacity: ready ? 0 : 1, transition: 'opacity 400ms' }} />
      )}
      {live ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <RelicScene {...props} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  )
}
