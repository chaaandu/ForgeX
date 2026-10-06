import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { meta } from '@/content/copy'
import './globals.css'

/* Latin subsets only, and only the headline serif is preloaded: it is the
   largest paint on the landing. Geist has a metric-matched fallback, so it
   can arrive a moment later without moving anything. */
const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap', preload: false })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap', preload: false })

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: meta.title, template: meta.template },
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description, type: 'website' },
}

export const viewport: Viewport = {
  themeColor: '#0c0c0e',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  )
}
