import { test, expect, type Request } from '@playwright/test'

/**
 * PECR: no non-essential script loads before consent. The gate is the
 * consent cookie; the only third-party hosts that may ever be contacted are
 * Google (analytics) and Vercel (speed insights), and only after "Accept".
 */
const NON_ESSENTIAL = /googletagmanager\.com|google-analytics\.com|vercel-insights\.com|_vercel\/speed-insights|youtube\.com|youtube-nocookie\.com|searchatlas\.com/

function thirdParty(requests: Request[]) {
  return requests.map((r) => r.url()).filter((url) => NON_ESSENTIAL.test(url))
}

test('loads nothing non-essential before a choice is made', async ({ page }) => {
  const requests: Request[] = []
  page.on('request', (req) => requests.push(req))
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.mouse.wheel(0, 2000)
  await page.waitForTimeout(1500)
  await expect(page.getByRole('dialog', { name: /cookies on jobsafe\.cloud/i })).toBeVisible()
  expect(thirdParty(requests)).toEqual([])
  expect(await page.evaluate(() => document.cookie)).not.toContain('_ga')
})

test('"Reject all" stores the choice for six months and still loads nothing', async ({ page, context }) => {
  const requests: Request[] = []
  page.on('request', (req) => requests.push(req))
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Reject all' }).click()
  await expect(page.getByRole('dialog', { name: /cookies on jobsafe\.cloud/i })).toBeHidden()
  await page.waitForTimeout(1500)
  expect(thirdParty(requests)).toEqual([])

  const cookie = (await context.cookies()).find((c) => c.name === 'jobsafe_consent')
  expect(cookie).toBeDefined()
  const days = (cookie!.expires - Date.now() / 1000) / 86400
  expect(days).toBeGreaterThan(180)
  expect(days).toBeLessThan(184)

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('dialog', { name: /cookies on jobsafe\.cloud/i })).toBeHidden()
})

test('"Accept all" loads the analytics tag, and only then', async ({ page }) => {
  const requests: Request[] = []
  page.on('request', (req) => requests.push(req))
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(thirdParty(requests)).toEqual([])
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.waitForFunction(() => Array.from(document.scripts).some((s) => s.src.includes('googletagmanager.com/gtag/js')), null, { timeout: 15_000 })
  expect(requests.some((r) => /googletagmanager\.com\/gtag\/js/.test(r.url()))).toBe(true)
})

test('the footer reopens the settings panel and the choice can be changed', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Reject all' }).click()
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  const dialog = page.getByRole('dialog', { name: /cookies on jobsafe\.cloud/i })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('switch', { name: /analytics/i })).not.toBeChecked()
  await dialog.getByRole('switch', { name: /analytics/i }).check()
  await dialog.getByRole('button', { name: 'Save choices' }).click()
  await expect(dialog).toBeHidden()
  expect(await page.evaluate(() => document.cookie)).toMatch(/jobsafe_consent=.*analytics%22%3Atrue/)
})

test('Sign up and Log in still point at the current app', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'networkidle' })
  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: 'Sign up now' })).toHaveAttribute('href', 'https://app.jobsafe.cloud/signup-trial')
  await expect(header.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', 'https://app.jobsafe.cloud/login')
})
