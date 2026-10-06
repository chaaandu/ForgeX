import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import {
  Big_Shoulders,
  Bricolage_Grotesque,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Manrope,
} from 'next/font/google'
import Link from 'next/link'
import './lab.css'

/* Every face any direction might use. Only the lab loads all of them. */
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--f-instrument' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], axes: ['wdth', 'opsz'], variable: '--f-bricolage' })
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--f-inter-tight' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--f-jetbrains' })
const shoulders = Big_Shoulders({ subsets: ['latin'], weight: ['600', '800', '900'], variable: '--f-shoulders', adjustFontFallback: false })
const manrope = Manrope({ subsets: ['latin'], variable: '--f-manrope' })

export const metadata: Metadata = {
  title: 'ForgeX lab',
  robots: { index: false, follow: false },
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const fonts = [
    instrument.variable,
    bricolage.variable,
    interTight.variable,
    jetbrains.variable,
    shoulders.variable,
    manrope.variable,
    GeistSans.variable,
    GeistMono.variable,
  ].join(' ')
  return (
    <div className={fonts}>
      <nav className="lab-nav" aria-label="Directions">
        <Link href="/lab/a">A Matte</Link>
        <Link href="/lab/b">B Riso</Link>
        <Link href="/lab/c">C Forge</Link>
      </nav>
      {children}
    </div>
  )
}
