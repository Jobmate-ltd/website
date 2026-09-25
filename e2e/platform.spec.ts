import { test, expect, type Page } from '@playwright/test'
import { PLATFORM_ON } from './routes'

/**
 * The four interactive pieces of the platform relaunch, driven with the
 * keyboard only (Phase 2 Definition of done): the signal toggle, the pricing
 * toggle, the cost-of-paper calculator and the product tour, plus the
 * mega-menu. Each test tabs to the control, operates it with Space, Enter or
 * the arrow keys, and checks the visible result. Nothing is clicked except
 * the consent banner, which is not under test here.
 *
 * Runs only against a server built with NEXT_PUBLIC_PLATFORM_LAUNCH=true
 * (set E2E_PLATFORM=on for the suite); with the flag off the pages are 404.
 */
test.skip(!PLATFORM_ON, 'Phase 2 routes are 404 while the launch flag is off')

interface Target {
  /** A standard CSS selector the focused element must match. */
  selector?: string
  /** Text the focused element's label must start with (aria-label or visible text). */
  text?: string
}

/** Presses Tab until the focused element matches `target`, or gives up. */
async function tabTo(page: Page, target: Target, limit = 200) {
  for (let i = 0; i < limit; i++) {
    const hit = await page.evaluate(({ selector, text }) => {
      const el = document.activeElement
      if (!el || el === document.body) return false
      if (selector && !el.matches(selector)) return false
      if (text) {
        const label = (el.getAttribute('aria-label') ?? el.textContent ?? '').replace(/\s+/g, ' ').trim()
        if (!label.startsWith(text)) return false
      }
      return true
    }, target)
    if (hit) return
    await page.keyboard.press('Tab')
  }
  throw new Error(`Could not reach ${JSON.stringify(target)} with Tab in ${limit} presses`)
}

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  const reject = page.getByRole('button', { name: 'Reject all' })
  if (await reject.isVisible().catch(() => false)) await reject.click()
}

test.describe('keyboard only', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('signal toggle: flip signal off with Space, file a report, flip it back and see it sync', async ({ page }) => {
    await open(page, '/platform/offline')
    await tabTo(page, { selector: '#signal-large' })
    await page.keyboard.press('Space')
    await expect(page.locator('label[for="signal-large"]')).toHaveText(/Signal: off/)

    await tabTo(page, { selector: '#what-large' })
    await page.keyboard.type('Tail lift dropped on the last cage')
    await page.keyboard.press('Tab')
    await page.keyboard.type('Leeds depot, bay 4')
    await tabTo(page, { selector: 'button[type="submit"]', text: 'Save report' })
    await page.keyboard.press('Enter')
    await expect(page.getByText('Pending sync').first()).toBeVisible()

    // Back up to the switch and turn signal on again.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Shift+Tab')
      if (await page.evaluate(() => document.activeElement?.id === 'signal-large')) break
    }
    await expect(page.locator('#signal-large')).toBeFocused()
    await page.keyboard.press('Space')
    await expect(page.locator('label[for="signal-large"]')).toHaveText(/Signal: on/)
    await expect(page.getByText(/^Synced \d\d:\d\d:\d\d$/).first()).toBeVisible({ timeout: 5_000 })
  })

  test('pricing toggle: arrow keys move between team sizes, Space selects one and flips billing', async ({ page }) => {
    await open(page, '/pricing')
    const group = page.getByRole('radiogroup', { name: 'How many people will use it?' })
    await tabTo(page, { selector: '[aria-labelledby="team-size-label"] [role="radio"]' })
    // Radix toggle groups move focus with the arrows (a tick later, so wait for it) and select with Space or Enter.
    await page.keyboard.press('ArrowRight')
    await expect(group.getByRole('radio', { name: '250+' })).toBeFocused()
    await page.keyboard.press('Space')
    await expect(group.getByRole('radio', { name: '250+' })).toHaveAttribute('data-state', 'on')
    await expect(page.getByText('For 250+ people')).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await expect(group.getByRole('radio', { name: '26–250' })).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(group.getByRole('radio', { name: '1–25' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(group.getByRole('radio', { name: '1–25' })).toHaveAttribute('data-state', 'on')
    await expect(page.getByText('For 1–25 people')).toBeVisible()

    await tabTo(page, { selector: '#billing-annual' })
    await page.keyboard.press('Space')
    await expect(page.locator('#billing-annual')).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByText('Terms to follow')).toBeVisible()
  })

  test('calculator: arrow keys on the slider change the working and the yearly figure', async ({ page }) => {
    await open(page, '/pricing')
    const working = page.getByText(/reports × \d+ min ÷ 60/)
    await expect(working).toBeVisible()
    const before = await working.textContent()

    await tabTo(page, { selector: '[role="slider"]', text: 'Paper reports a month' })
    for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight')
    await expect(working).not.toHaveText(before ?? '')

    // The number field beside each slider is the same value and is also keyboard-editable.
    await tabTo(page, { selector: '#calc-minutes' })
    await page.keyboard.press('Control+a')
    await page.keyboard.type('60')
    await expect(page.getByText(/× 60 min ÷ 60/)).toBeVisible()
  })

  test('tour: Enter starts it, Enter on Next walks every stop, Finish closes it', async ({ page }) => {
    await open(page, '/platform')
    await tabTo(page, { selector: 'button[aria-describedby="tour-lead"]' })
    await page.keyboard.press('Enter')
    await expect(page.locator('#tour-title')).toBeVisible()
    await expect(page.locator('#tour-title')).toHaveText('Start on the dashboard')

    for (const title of ['Open a report', 'Watch the RIDDOR verdict', 'See a permit blocked', 'Finish on a bowtie']) {
      await tabTo(page, { selector: 'button', text: 'Next' }, 400)
      await page.keyboard.press('Enter')
      await expect(page.locator('#tour-title')).toHaveText(title)
    }
    await tabTo(page, { selector: 'button', text: 'Finish' }, 400)
    await page.keyboard.press('Enter')
    await expect(page.locator('#tour-title')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Take the 2-minute tour' })).toBeEnabled()
  })

  test('every mega-menu opens with the keyboard and every link in the header resolves', async ({ page }) => {
    await open(page, '/')
    const hrefs = new Set<string>()
    const collect = async () => {
      for (const href of await page.locator('header a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''))) hrefs.add(href)
    }
    await collect()
    // Radix navigation-menu renders a panel's links only while it is open, so open each one in turn.
    for (const [menu, firstLink] of [
      ['Platform', /Incident & near-miss reporting/],
      ['Industries', /Transport & logistics/],
      ['Resources', /Insights/],
    ] as const) {
      await tabTo(page, { selector: 'header button', text: menu })
      await page.keyboard.press('Enter')
      await expect(page.getByRole('link', { name: firstLink }).first()).toBeVisible()
      await collect()
      await page.keyboard.press('Escape')
    }
    expect(hrefs.size).toBeGreaterThanOrEqual(12)
    for (const href of hrefs) {
      const res = await page.request.get(href.split('#')[0] || '/')
      expect(res.status(), `${href} from the header`).toBe(200)
    }
  })
})
