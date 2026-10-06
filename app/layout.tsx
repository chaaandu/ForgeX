import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ForgeX 2.0',
  description: 'Find a problem worth three weeks of your life.',
}

export const viewport: Viewport = {
  themeColor: '#0c0c0e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
