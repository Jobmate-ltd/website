import { test, expect, type Page } from '@playwright/test'
import { PLATFORM_ON } from './routes'
import { RIDDOR_CATEGORY_DEFS, riddorDeadline, triage, type TriageAnswers } from '../lib/product-logic/riddor-knowledge.ts'
import { todayLocal } from '../lib/product-logic/date.ts'
import { formatUkDate } from '../lib/tools/index.ts'

/**
 * The three free tools (Phase 3, Part C), driven with the keyboard only: the
 * RIDDOR checker answered with Tab, the arrows, Space and Enter and compared
 * with triage() and riddorDeadline() for the same answers; the URL that
 * carries the answers and survives a reload; the matrix moved with the
 * arrows and selected with Space; the AFR typed in. Nothing is clicked
 * except the consent banner.
 *
 * Runs only against a server built with NEXT_PUBLIC_PLATFORM_LAUNCH=true
 * (set E2E_PLATFORM=on for the suite); with the flag off the pages are 404.
 */
test.skip(!PLATFORM_ON, 'Phase 3 routes are 404 while the launch flag is off')

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

/** Tab to Next and press Enter; the next question's heading takes focus. */
async function pressNext(page: Page) {
  await tabTo(page, { selector: '#riddor-next' })
  await page.keyboard.press('Enter')
  await expect(page.locator('#riddor-question')).toBeFocused()
}

test.describe('free tools, keyboard only', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('riddor checker: a worker fracture answered with Tab, arrows, Space and Enter is a specified injury with the 10-day deadline', async ({ page }) => {
    await open(page, '/tools/riddor-checker')
    const question = page.locator('#riddor-question')
    const live = page.locator('#riddor-verdict-live')
    await expect(live).toHaveText('')
    await expect(page.getByText('Question 1 of 8', { exact: true })).toBeVisible()

    // 1. Work-related: yes (Space selects the focused radio).
    await tabTo(page, { selector: '#riddor-workRelated-yes' })
    await page.keyboard.press('Space')
    await expect(page.locator('#riddor-workRelated-yes')).toBeChecked()
    await pressNext(page)
    await expect(question).toHaveText('Did it involve a vehicle moving on a road?')

    // 2. Road traffic: no (ArrowDown moves to, and selects, the next radio).
    await tabTo(page, { selector: '#riddor-roadTraffic-yes' })
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#riddor-roadTraffic-no')).toBeChecked()
    await pressNext(page)
    await expect(question).toHaveText('What was the outcome?')

    // 3. Outcome: injury.
    await tabTo(page, { selector: '#riddor-outcome-death' })
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#riddor-outcome-injury')).toBeChecked()
    await pressNext(page)
    await expect(question).toHaveText('Who was injured?')

    // 4. A worker.
    await tabTo(page, { selector: '#riddor-personType-worker' })
    await page.keyboard.press('Space')
    await pressNext(page)
    await expect(question).toHaveText('Did the worker suffer any of these specified injuries?')

    // 5. A fracture (Space ticks the checkbox): triage decides, the verdict appears.
    await tabTo(page, { selector: '#riddor-specifiedInjuries-fracture' })
    await page.keyboard.press('Space')
    await expect(page.locator('#riddor-specifiedInjuries-fracture')).toBeChecked()

    const answers: TriageAnswers = { workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: ['fracture'] }
    const expected = triage(answers)
    expect(expected.category).toBe('Specified')
    const today = todayLocal()
    const deadline = riddorDeadline(expected.category, today, today)
    expect(deadline.daysLeft).toBe(10)

    const verdict = page.locator('#riddor-verdict')
    await expect(verdict).toContainText(RIDDOR_CATEGORY_DEFS.Specified.label)
    await expect(verdict).toContainText(expected.reasons[0])
    await expect(verdict).toContainText(formatUkDate(deadline.deadlineAt as string))
    await expect(verdict).toContainText('in 10 days')
    await expect(verdict).toContainText('0345 300 9923')
    await expect(verdict.getByRole('link', { name: /HSE’s RIDDOR forms/ })).toHaveAttribute('href', 'https://notifications.hse.gov.uk/riddorforms')
    await expect(live).toContainText(RIDDOR_CATEGORY_DEFS.Specified.label)
    await expect(live).not.toHaveText('')

    // Next finishes; Back returns to the injuries question with the answer kept.
    await pressNext(page)
    await expect(question).toHaveText('That is everything the checker needs')
    await tabTo(page, { selector: '#riddor-back' })
    await page.keyboard.press('Enter')
    await expect(question).toBeFocused()
    await expect(question).toHaveText('Did the worker suffer any of these specified injuries?')
    await expect(page.locator('#riddor-specifiedInjuries-fracture')).toBeChecked()
    await expect(page.getByText('Question 5 of 5', { exact: true })).toBeVisible()

    // Start again clears the verdict and the live region.
    await tabTo(page, { selector: '#riddor-reset' })
    await page.keyboard.press('Enter')
    await expect(question).toHaveText('Did it arise out of or in connection with work?')
    await expect(page.locator('#riddor-verdict')).toHaveCount(0)
    await expect(live).toHaveText('')
  })

  test('riddor checker: the URL carries the answers and reloading it restores the verdict', async ({ page }) => {
    await open(page, '/tools/riddor-checker')
    await tabTo(page, { selector: '#riddor-workRelated-yes' })
    await page.keyboard.press('Space')
    await expect(page).toHaveURL(/\/tools\/riddor-checker\?workRelated=yes/)

    const query = 'workRelated=yes&roadTraffic=no&outcome=injury&personType=worker&specifiedInjuries=&daysOff=8&date=2026-09-01'
    await page.goto(`/tools/riddor-checker?${query}`, { waitUntil: 'networkidle' })
    const expected = triage({ workRelated: 'yes', roadTraffic: 'no', outcome: 'injury', personType: 'worker', specifiedInjuries: [], daysOff: '8' })
    expect(expected.category).toBe('Over7Day')
    const deadline = riddorDeadline('Over7Day', '2026-09-01', todayLocal())
    const verdict = page.locator('#riddor-verdict')
    await expect(verdict).toContainText(RIDDOR_CATEGORY_DEFS.Over7Day.label)
    await expect(verdict).toContainText(formatUkDate(deadline.deadlineAt as string))
    await expect(page.locator('#riddor-date')).toHaveValue('2026-09-01')
    await expect(page.getByText('All questions answered')).toBeVisible()

    await page.reload({ waitUntil: 'networkidle' })
    await expect(page).toHaveURL(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    await expect(page.locator('#riddor-verdict')).toContainText(RIDDOR_CATEGORY_DEFS.Over7Day.label)
    await expect(page.locator('#riddor-verdict')).toContainText('16/09/2026')
  })

  test('risk matrix: the arrows move between cells and Space selects one, with the band in text', async ({ page }) => {
    await open(page, '/tools/risk-matrix')
    await tabTo(page, { selector: '[role="grid"] button' })
    await expect(page.locator('#matrix-cell-1-1')).toBeFocused()
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight')
    for (let i = 0; i < 2; i++) await page.keyboard.press('ArrowDown')
    await expect(page.locator('#matrix-cell-3-4')).toBeFocused()
    await expect(page.locator('#matrix-cell-3-4')).toHaveAttribute('aria-label', 'Likelihood 3 Possible, severity 4 Major, score 12, High')
    await page.keyboard.press('Space')
    await expect(page.locator('#matrix-cell-3-4')).toHaveAttribute('aria-pressed', 'true')
    const result = page.locator('#matrix-result')
    await expect(result).toContainText('Score 12: High')
    await expect(result).toContainText('Must be reduced.')
    await expect(result).toContainText('within 30 days')
    await expect(page).toHaveURL(/\/tools\/risk-matrix\?l=3&s=4/)
    await expect(page.locator('#matrix-likelihood')).toHaveValue('3')
    await expect(page.locator('#matrix-severity')).toHaveValue('4')

    // The lists drive the grid too: severity 5 from the select selects the cell.
    await tabTo(page, { selector: '#matrix-severity' })
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#matrix-cell-3-5')).toHaveAttribute('aria-pressed', 'true')
    await expect(result).toContainText('Score 15: High')

    // The hierarchy helper is a radio group; the note names the level.
    await tabTo(page, { selector: '#matrix-control-Eliminate' })
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#matrix-control-Substitute')).toBeChecked()
    await expect(page.getByText(/^Level 2 of 5, substitute\./)).toBeVisible()
  })

  test('AFR: typing the injuries and the hours shows the working and the period', async ({ page }) => {
    await open(page, '/tools/accident-frequency-rate')
    await tabTo(page, { selector: '#afr-injuries' })
    await page.keyboard.type('4')
    await page.keyboard.press('Tab')
    await expect(page.locator('#afr-hours')).toBeFocused()
    await page.keyboard.type('812000')
    const result = page.locator('#afr-result')
    await expect(result).toContainText('(4 × 100,000) ÷ 812,000 = 0.49')
    await expect(result).toContainText('per 100,000 hours worked')
    await page.keyboard.press('Tab')
    await page.keyboard.type('2025')
    await expect(result).toContainText('Accident frequency rate for 2025')
    // Both conventions are sourced on the page.
    await expect(page.getByRole('link', { name: /Office of Rail and Road/ })).toHaveAttribute('href', 'https://www.orr.gov.uk/glossary')
    await expect(page.getByRole('link', { name: /Measures of workplace injury/ })).toHaveAttribute('href', 'https://www.hse.gov.uk/statistics/lfs/injury.htm')
    await expect(page.getByText('Source pending verification')).toHaveCount(0)
  })
})
