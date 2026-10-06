'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { ArchetypeId } from '@/lib/archetype'

/**
 * The six relics. Each archetype in a family shares that family's portrait,
 * so the relic is what tells a Scout from a Surveyor: a small object made of
 * plain solids, lit like something on a desk.
 *
 *   surveyor   a measured globe: a lattice around a core, one level ring
 *   scout      a compass
 *   inventor   a cut crystal with sparks in orbit
 *   tinkerer   two gears in mesh
 *   strategist a stepped ziggurat
 *   builder    blocks stacked into a corner
 */

type Props = {
  /** Called once the first frame is on screen, so a still can step aside. */
  onReady?: () => void
  id: ArchetypeId
  tint: string
  /** Spin slowly. Off under reduced motion regardless. */
  spin?: boolean
  /** For stills: render once and keep the buffer so it can be captured. */
  still?: boolean
  className?: string
}

export default function RelicScene({ id, tint, spin = true, still = false, className, onReady }: Props) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const moving = spin && !reduced && !still
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      frameloop={moving ? 'always' : 'demand'}
      camera={{ position: [0, 0.6, 5.6], fov: 32 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: still }}
      onCreated={() => window.requestAnimationFrame(() => onReady?.())}
      aria-hidden="true"
    >
      <Lighting />
      <Spinner moving={moving && id !== 'scout'}>
        <Relic id={id} tint={tint} />
      </Spinner>
    </Canvas>
  )
}

function Lighting() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = texture
    return () => {
      texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.6} />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#9db4ff" />
    </>
  )
}

function Spinner({ moving, children }: { moving: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!group.current || !moving) return
    group.current.rotation.y += delta * 0.35
  })
  return (
    <group ref={group} rotation={[0.18, -0.5, 0]}>
      {children}
    </group>
  )
}

function useMaterials(tint: string) {
  return useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(tint),
        metalness: 0.55,
        roughness: 0.32,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
      pale: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ece6da'),
        metalness: 0.2,
        roughness: 0.45,
        clearcoat: 0.3,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: new THREE.Color(tint),
        emissive: new THREE.Color(tint),
        emissiveIntensity: 1.4,
      }),
      line: new THREE.LineBasicMaterial({ color: new THREE.Color(tint) }),
    }),
    [tint],
  )
}

function Relic({ id, tint }: { id: ArchetypeId; tint: string }) {
  const m = useMaterials(tint)
  switch (id) {
    case 'surveyor':
      return <Surveyor m={m} />
    case 'scout':
      return <Scout m={m} />
    case 'inventor':
      return <Inventor m={m} />
    case 'tinkerer':
      return <Tinkerer m={m} />
    case 'strategist':
      return <Strategist m={m} />
    case 'builder':
      return <Builder m={m} />
  }
}

type M = ReturnType<typeof useMaterials>

function Surveyor({ m }: { m: M }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)), [])
  return (
    <group>
      <lineSegments geometry={edges} material={m.line} />
      <mesh material={m.body}>
        <octahedronGeometry args={[0.5, 0]} />
      </mesh>
      <mesh material={m.pale} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.035, 16, 128]} />
      </mesh>
      <mesh material={m.pale} rotation={[Math.PI / 2, 0.5, 0]}>
        <torusGeometry args={[1.3, 0.012, 8, 128]} />
      </mesh>
    </group>
  )
}

function Scout({ m }: { m: M }) {
  // Lies flat like a compass on a table, tilted up toward you. The needle
  // swings on its own; the body stays put so it never wobbles.
  const needle = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (needle.current) needle.current.rotation.y = 0.6 + Math.sin(state.clock.elapsedTime * 0.9) * 0.5
  })
  return (
    <group rotation={[0.95, 0, 0]}>
      <mesh material={m.pale} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.11, 24, 128]} />
      </mesh>
      <mesh material={m.body} position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.08, 96]} />
      </mesh>
      {[0, 1, 2, 3].map((quarter) => (
        <mesh
          key={quarter}
          material={m.pale}
          position={[Math.cos((quarter * Math.PI) / 2) * 0.8, 0.02, Math.sin((quarter * Math.PI) / 2) * 0.8]}
        >
          <boxGeometry args={[0.08, 0.04, 0.08]} />
        </mesh>
      ))}
      <group ref={needle} position={[0, 0.08, 0]} rotation={[0, 0.6, 0]}>
        <mesh material={m.glow} position={[0, 0, -0.36]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.72, 4]} />
        </mesh>
        <mesh material={m.pale} position={[0, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.72, 4]} />
        </mesh>
        <mesh material={m.pale}>
          <sphereGeometry args={[0.1, 24, 24]} />
        </mesh>
      </group>
    </group>
  )
}

function Inventor({ m }: { m: M }) {
  const sparks = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (sparks.current) sparks.current.rotation.z = state.clock.elapsedTime * 0.8
  })
  return (
    <group>
      <mesh material={m.body} scale={[0.8, 1.35, 0.8]}>
        <octahedronGeometry args={[0.85, 0]} />
      </mesh>
      <group ref={sparks} rotation={[1.2, 0.3, 0]}>
        {[0, 1, 2].map((index) => {
          const angle = (index / 3) * Math.PI * 2
          return (
            <mesh key={index} material={m.glow} position={[Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
            </mesh>
          )
        })}
        <mesh material={m.pale}>
          <torusGeometry args={[1.25, 0.01, 8, 128]} />
        </mesh>
      </group>
    </group>
  )
}

function gear(teeth: number, outer: number, inner: number, hole: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  const steps = teeth * 4
  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2
    const radius = index % 4 < 2 ? outer : inner
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (index === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  const bore = new THREE.Path()
  bore.absarc(0, 0, hole, 0, Math.PI * 2, true)
  shape.holes.push(bore)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 24,
  })
  geometry.center()
  return geometry
}

function Tinkerer({ m }: { m: M }) {
  const big = useMemo(() => gear(12, 0.9, 0.74, 0.22), [])
  const small = useMemo(() => gear(8, 0.56, 0.42, 0.14), [])
  const turn = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    const group = turn.current
    if (!group) return
    const [a, b] = group.children
    if (a) a.rotation.z += delta * 0.4
    if (b) b.rotation.z -= delta * 0.4 * (12 / 8)
  })
  return (
    <group ref={turn} rotation={[0.2, 0, 0]}>
      <mesh geometry={big} material={m.body} position={[-0.32, 0.18, 0]} />
      <mesh geometry={small} material={m.pale} position={[0.95, -0.55, 0.05]} rotation={[0, 0, 0.2]} />
    </group>
  )
}

function Strategist({ m }: { m: M }) {
  const tiers = [
    { size: 1.7, y: -0.55 },
    { size: 1.2, y: -0.15 },
    { size: 0.72, y: 0.25 },
  ]
  return (
    <group>
      {tiers.map((tier, index) => (
        <mesh
          key={tier.size}
          material={index === 1 ? m.pale : m.body}
          position={[0, tier.y, 0]}
          rotation={[0, (index * Math.PI) / 12, 0]}
        >
          <boxGeometry args={[tier.size, 0.36, tier.size]} />
        </mesh>
      ))}
      <mesh material={m.glow} position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
      </mesh>
    </group>
  )
}

function Builder({ m }: { m: M }) {
  const unit = 0.62
  const gap = 0.06
  const step = unit + gap
  const blocks: [number, number, number, keyof M][] = [
    [0, 0, 0, 'body'],
    [step, 0, 0, 'pale'],
    [0, 0, -step, 'pale'],
    [0, step, 0, 'body'],
    [step, 0, -step, 'body'],
  ]
  return (
    <group position={[-step / 2, -step / 2, step / 2]}>
      {blocks.map(([x, y, z, material]) => (
        <mesh key={`${x}-${y}-${z}`} material={m[material] as THREE.Material} position={[x, y, z]}>
          <boxGeometry args={[unit, unit, unit]} />
        </mesh>
      ))}
    </group>
  )
}
