'use client'

import dynamic from 'next/dynamic'
import type { ArchetypeId } from '@/lib/archetype'

/**
 * The relic, loaded only in the browser and only when it is on screen. Three.js
 * is the heaviest thing in the app, so nothing pays for it until a relic is
 * actually shown.
 */
const RelicScene = dynamic(() => import('./RelicScene'), {
  ssr: false,
  loading: () => <div aria-hidden="true" style={{ width: '100%', height: '100%' }} />,
})

export function Relic(props: { id: ArchetypeId; tint: string; spin?: boolean; still?: boolean; className?: string }) {
  return <RelicScene {...props} />
}
