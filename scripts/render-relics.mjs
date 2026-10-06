// Captures each relic from /lab/relics as a transparent still in public/relics/.
// Usage: node scripts/render-relics.mjs http://localhost:3100
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const base = process.argv[2] ?? 'http://localhost:3000'
mkdirSync('public/relics', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 })
await page.goto(`${base}/lab/relics`, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.addStyleTag({ content: 'html,body{background:transparent!important} .lab-nav{display:none!important}' })
for (const handle of await page.$$('[data-relic]')) {
  const id = await handle.getAttribute('data-relic')
  const png = await handle.screenshot({ omitBackground: true })
  await sharp(png).resize(256, 256).webp({ quality: 88, alphaQuality: 90 }).toFile(`public/relics/${id}.webp`)
  console.log(`public/relics/${id}.webp`)
}
await browser.close()
