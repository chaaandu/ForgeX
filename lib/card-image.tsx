import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { archetypes, card as copy, families } from '@/content/copy'
import { ARCHETYPES, FAMILIES } from '@/lib/archetype'
import { founderContext } from '@/lib/context'
import type { Founder } from '@/lib/data/founders'

/**
 * The founder card as a PNG, made on request and never stored. Satori draws
 * it, so it is the card's design in flexbox rather than the same DOM. The
 * card sits on the dark ground with a margin, so its rounded corners never
 * show as white where an app flattens transparency.
 */

const W = 1080
const H = 1512

const FRAME: Record<string, [string, string]> = {
  none: ['#5a5a62', '#2a2a30'],
  picked: ['#a98beb', '#5a3a8e'],
}

let fonts: Promise<
  { name: string; data: Buffer; style: 'normal' | 'italic'; weight: 400 | 500 }[]
> | null = null
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/InstrumentSerif-Regular.ttf')).then((data) => ({
      name: 'Serif',
      data,
      style: 'normal' as const,
      weight: 400 as const,
    })),
    readFile(join(process.cwd(), 'assets/fonts/InstrumentSerif-Italic.ttf')).then((data) => ({
      name: 'Serif',
      data,
      style: 'italic' as const,
      weight: 400 as const,
    })),
    readFile(join(process.cwd(), 'assets/fonts/Geist-Regular.ttf')).then((data) => ({
      name: 'Sans',
      data,
      style: 'normal' as const,
      weight: 400 as const,
    })),
    readFile(join(process.cwd(), 'assets/fonts/GeistMono-Medium.ttf')).then((data) => ({
      name: 'Mono',
      data,
      style: 'normal' as const,
      weight: 500 as const,
    })),
  ])
  return fonts
}

/** Public images are WebP; Satori wants PNG or JPEG. */
async function asDataUrl(publicPath: string, width: number): Promise<string> {
  const file = await readFile(join(process.cwd(), 'public', publicPath.replace(/^\//, '')))
  const png = await sharp(file).resize({ width, withoutEnlargement: false }).png().toBuffer()
  return `data:image/png;base64,${png.toString('base64')}`
}

export const CARD_W = W
export const CARD_H = H
/** The margin of dark ground around the card in the finished PNG. */
const MARGIN = 56
const GROUND = '#0c0c0e'

/** The card alone, 1080×1512, with its corners on the dark ground. */
export async function cardPng(founder: Founder): Promise<Buffer> {
  const context = await founderContext(founder)
  const data = context.card
  const kind = data.archetype ? ARCHETYPES[data.archetype] : null
  const family = kind ? FAMILIES[kind.family] : null
  const finish = data.finish ?? 'none'
  const [hi, lo] = FRAME[finish] ?? FRAME.none!
  const [photo, figure] = await Promise.all([
    asDataUrl(data.photo, 1000),
    family ? asDataUrl(family.art, 420) : Promise.resolve(null),
  ])
  const line = kind ? archetypes[kind.id].identity : ''

  const image = new ImageResponse(
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
          <img
            src={photo}
            width={1008}
            height={1010}
            style={{ objectFit: 'cover', objectPosition: '50% 20%' }}
            alt=""
          />
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
        {/* The archetype whole, feet in the fade, the same as the card on screen. */}
        {figure ? (
          <div
            style={{
              position: 'absolute',
              right: 10,
              top: 710,
              width: 320,
              height: 320,
              display: 'flex',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figure} width={320} height={320} alt="" />
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '28px 56px 0', gap: 14 }}>
          <span
            style={{
              fontFamily: 'Serif',
              fontSize: 104,
              lineHeight: 1,
              color: '#f2f0eb',
              maxWidth: 760,
            }}
          >
            {data.name}
          </span>
          {kind ? (
            <span
              style={{
                fontFamily: 'Serif',
                fontStyle: 'italic',
                fontSize: 54,
                color: family?.tint ?? '#b3b0a9',
              }}
            >
              {`${families[kind.family].name} · ${archetypes[kind.id].name}`}
            </span>
          ) : null}
          {line ? (
            <span
              style={{
                fontFamily: 'Sans',
                fontSize: 36,
                lineHeight: 1.35,
                color: '#b3b0a9',
                maxWidth: 900,
              }}
            >
              {line}
            </span>
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
          <span>{copy.footer.brand}</span>
          <span>{copy.footer.school}</span>
        </div>
      </div>
    </div>,
    { width: W, height: H, fonts: await loadFonts() },
  )
  const raw = Buffer.from(await image.arrayBuffer())
  return sharp(raw)
    .extend({ top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, background: GROUND })
    .flatten({ background: GROUND })
    .png()
    .toBuffer()
}

/**
 * The link preview: 1200×630, the card on the left of the dark ground, the
 * name and what they are building beside it.
 */
export async function previewPng(
  founder: Founder,
  words: { title: string; line: string; footer: string },
): Promise<Buffer> {
  const card = await cardPng(founder)
  const cardUrl = `data:image/png;base64,${(await sharp(card).resize({ height: 560 }).png().toBuffer()).toString('base64')}`
  const image = new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 72px 0 56px',
        background: GROUND,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cardUrl} height={560} width={Math.round(560 * ((W + 2 * MARGIN) / (H + 2 * MARGIN)))} alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        <span style={{ fontFamily: 'Serif', fontSize: 76, lineHeight: 1, color: '#f2f0eb' }}>
          {words.title}
        </span>
        {words.line ? (
          <span style={{ fontFamily: 'Sans', fontSize: 30, lineHeight: 1.35, color: '#b3b0a9' }}>
            {words.line}
          </span>
        ) : null}
        <span
          style={{
            fontFamily: 'Mono',
            fontSize: 22,
            letterSpacing: 2,
            color: '#a98beb',
            marginTop: 12,
          }}
        >
          {words.footer}
        </span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await loadFonts() },
  )
  return Buffer.from(await image.arrayBuffer())
}
