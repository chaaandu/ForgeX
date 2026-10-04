import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'ForgeX 2.0'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090B',
        color: '#FAFAFA',
        fontSize: 92,
        letterSpacing: '-0.03em',
      }}
    >
      ForgeX 2.0
    </div>,
    size,
  )
}
