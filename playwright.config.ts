import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks: axe on every route at 320, 768 and 1280, and the consent
 * gate. Runs against a production build (`next start`) so the numbers are the
 * ones a visitor gets. Set BASE_URL to point at a server you already have up.
 */
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

/**
 * A machine with a pre-installed Chromium (a sandbox, a locked-down runner)
 * points PLAYWRIGHT_CHROMIUM_PATH at the binary instead of downloading one.
 * Unset, Playwright uses the browser `npx playwright install chromium` put
 * in place, which is what CI does.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    colorScheme: 'light',
    launchOptions: { executablePath },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
