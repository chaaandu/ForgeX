import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { archetypes, card as copy, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES } from '@/lib/archetype'
import { founderContext } from '@/lib/context'
import { founderBySlug } from '@/lib/data/founders'
import { getViewer } from '@/lib/session'

/**
 * The founder card as a 1080×1512 PNG, made on request and never stored. The
 * founder can fetch their own; the team can fetch anyone's. Satori draws it,
 * so it is the card's design in flexbox rather than the same DOM.
 */

const W = 1080
const H = 1512

const FRAME: Record<string, [string, string]> = {
  none: ['#5a5a62', '#2a2a30'],
  rare: ['#b4ceff', '#3d6fd6'],
  epic: ['#d8c6ff', '#7d55d9'],
  legendary: ['#ffd99a', '#c9821b'],
  mythic: ['#ffb3ad', '#d23c33'],
  original: ['#ffffff', '#bfb7a8'],
}

let fonts: Promise<{ name: string; data: Buffer; style: 'normal' | 'italic'; weight: 400 | 500 }[]> | null = null
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/InstrumentSerif-Regular.ttf')).then((data) => ({ name: 'Serif', data, style: 'normal' as const, weight: 400 as const })),
    readFile(join(process.cwd(), 'assets/fonts/InstrumentSerif-Italic.ttf')).then((data) => ({ name: 'Serif', data, style: 'italic' as const, weight: 400 as const })),
    readFile(join(process.cwd(), 'assets/fonts/Geist-Regular.ttf')).then((data) => ({ name: 'Sans', data, style: 'normal' as const, weight: 400 as const })),
    readFile(join(process.cwd(), 'assets/fonts/GeistMono-Medium.ttf')).then((data) => ({ name: 'Mono', data, style: 'normal' as const, weight: 500 as const })),
  ])
  return fonts
}

/** Public images are WebP; Satori wants PNG or JPEG. */
async function asDataUrl(publicPath: string, width: number): Promise<string> {
  const file = await readFile(join(process.cwd(), 'public', publicPath.replace(/^\//, '')))
  const png = await sharp(file).resize({ width, withoutEnlargement: false }).png().toBuffer()
  return `data:image/png;base64,${png.toString('base64')}`
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const viewer = await getViewer()
  if (!viewer) return new Response('Sign in first', { status: 401 })
  const { slug } = await params
  const founder = await founderBySlug(slug)
  if (!founder || (viewer.role !== 'team' && viewer.email !== founder.email)) {
    return new Response('Not found', { status: 404 })
  }

  const context = await founderContext(founder)
  const data = context.card
  const kind = data.archetype ? ARCHETYPES[data.archetype] : null
  const family = kind ? FAMILIES[kind.family] : null
  const finish = data.finish ?? 'none'
  const [hi, lo] = FRAME[finish] ?? FRAME.none!
  const [photo, head] = await Promise.all([
    asDataUrl(data.photo, 1000),
    family ? asDataUrl(family.head, 256) : Promise.resolve(null),
  ])
  const line = data.problemTitle
    ? `${copy.building}: ${data.problemTitle}`
    : data.bio || (kind ? archetypes[kind.id].identity : '')

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          padding: 36,
          background: `linear-gradient(150deg, ${hi} 0%, ${lo} 45%, #111 100%)`,
          borderRadius: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            borderRadius: 44,
            overflow: 'hidden',
            background: '#121214',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', position: 'relative', width: '100%', height: 1010 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={1008} height={1010} style={{ objectFit: 'cover', objectPosition: '50% 20%' }} alt="" />
            {/* The photo melts into the card: Satori needs the overlay's size spelled out. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1008,
                height: 1010,
                display: 'flex',
                backgroundImage:
                  'linear-gradient(180deg, rgba(18,18,20,0.5) 0%, rgba(18,18,20,0) 22%, rgba(18,18,20,0) 58%, rgba(18,18,20,0.85) 85%, #121214 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 48,
                right: 48,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'Mono',
                fontSize: 34,
                letterSpacing: 2,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              <span>{data.number ? copy.number(data.number, data.of) : ''}</span>
            </div>
          </div>
          {head && family ? (
            <div
              style={{
                position: 'absolute',
                right: 48,
                top: 880,
                width: 190,
                height: 190,
                borderRadius: 95,
                display: 'flex',
                overflow: 'hidden',
                background: '#121214',
                border: `6px solid ${family.tint}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={head} width={178} height={178} style={{ borderRadius: 89 }} alt="" />
            </div>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '28px 56px 0', gap: 14 }}>
            <span style={{ fontFamily: 'Serif', fontSize: 104, lineHeight: 1, color: '#f2f0eb', maxWidth: 760 }}>{data.name}</span>
            {kind ? (
              <span style={{ fontFamily: 'Serif', fontStyle: 'italic', fontSize: 54, color: family?.tint ?? '#b3b0a9' }}>
                {`${families[kind.family].name} · ${archetypes[kind.id].name}`}
              </span>
            ) : null}
            {line ? (
              <span style={{ fontFamily: 'Sans', fontSize: 36, lineHeight: 1.35, color: '#b3b0a9', maxWidth: 900 }}>{line}</span>
            ) : null}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 56,
              right: 56,
              bottom: 40,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Mono',
              fontSize: 26,
              letterSpacing: 2,
              color: '#8f8c85',
            }}
          >
            <span>FORGEX</span>
            <span>MESA SCHOOL OF BUSINESS</span>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: await loadFonts(),
      headers: { 'Cache-Control': 'private, max-age=60' },
    },
  )
}
