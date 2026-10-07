import { defineConfig, devices } from '@playwright/test'

const PORT = 3010
const baseURL = `http://127.0.0.1:${PORT}`

/**
 * End to end, in mock mode, against a production build. The in-memory Sheet
 * is shared, so tests run one at a time and each resets it first.
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**'],
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  timeout: 60_000,
  // Reduced motion makes every animation settle at once, so nothing is
  // clicked mid-flight; the motion itself is reviewed by eye, not by tests.
  use: { baseURL, trace: 'retain-on-failure', reducedMotion: 'reduce' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, grepInvert: /@phone/ },
    // 390px wide: the narrowest phone the cohort is likely to carry.
    {
      name: 'phone',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
      grep: /@phone/,
    },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      NEXT_DIST_DIR: '.next-test',
      MOCK_BACKEND: 'true',
      AUTH_SECRET: 'playwright-secret-playwright-secret',
      AUTH_TRUST_HOST: 'true',
      AUTH_URL: baseURL,
      // Day 6 of the sprint, before stop 1 closes. Honoured in mock mode only.
      PLAN_NOW: '2026-10-14T10:00:00+05:30',
      SHEET_ID: 'mock',
      GOOGLE_SA_EMAIL: 'mock@example.com',
      GOOGLE_SA_KEY: 'mock',
    },
  },
})
