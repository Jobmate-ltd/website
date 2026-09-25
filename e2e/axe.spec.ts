import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ROUTES, WIDTHS } from './routes'

/**
 * axe on every route at 320, 768 and 1280 wide, with the consent banner
 * showing (a first visit) — the banner is part of the page and must pass too.
 * WCAG 2.2 AA tags; zero violations is the bar (Definition of done).
 */
for (const width of WIDTHS) {
  test.describe(`axe at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const route of ROUTES) {
      test(`${route} has no accessibility violations`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' })
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`)
        expect(summary, summary.join('\n\n')).toEqual([])
      })
    }
  })
}
