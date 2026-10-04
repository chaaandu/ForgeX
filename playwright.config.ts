import { defineConfig, devices } from '@playwright/test'

const PORT = 3010
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      MOCK_BACKEND: 'true',
      AUTH_SECRET: 'playwright-secret-playwright-secret',
      AUTH_TRUST_HOST: 'true',
      AUTH_URL: baseURL,
      BETS_CLOSE_AT: '2030-01-01T00:00:00+05:30',
    },
  },
})
