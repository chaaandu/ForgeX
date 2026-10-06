// Screenshots for self-review: node scripts/shoot.mjs <base> <path> [name] [--widths=390,1080,1440] [--full]
import { chromium } from '@playwright/test'

const [base, path, name = path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'root'] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const widths = (process.argv.find((a) => a.startsWith('--widths='))?.split('=')[1] ?? '390,1080,1440').split(',').map(Number)
const full = process.argv.includes('--full')
const wait = Number(process.argv.find((a) => a.startsWith('--wait='))?.split('=')[1] ?? 2500)

const browser = await chromium.launch()
for (const width of widths) {
  const height = width < 600 ? 844 : width < 1200 ? 1200 : 900
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(wait)
  const file = `/tmp/shots/${name}-${width}.png`
  await page.screenshot({ path: file, fullPage: full })
  console.log(file)
  await page.close()
}
await browser.close()
