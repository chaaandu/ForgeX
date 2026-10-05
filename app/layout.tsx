import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Background } from '@/components/Background'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ForgeX 2.0',
  description: "200+ problems. Bet on the one you'd build.",
  openGraph: {
    title: 'ForgeX 2.0',
    description: "200+ problems. Bet on the one you'd build.",
  },
}

export const viewport: Viewport = {
  themeColor: '#09090B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Background />
        {children}
      </body>
    </html>
  )
}
