#!/usr/bin/env node
/**
 * axe on one route at one width, with the failing nodes printed. Faster than
 * the full e2e sweep when fixing a single violation.
 *
 *   node scripts/axe-route.mjs /industries/healthcare 320 [--base http://localhost:3000]
 *
 * Uses the same WCAG 2.2 AA + best-practice tags as e2e/axe.spec.ts, so a
 * clean run here is a clean run there. Honour PLAYWRIGHT_CHROMIUM_PATH like
 * the rest of the tooling.
 */
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base')
const base = baseIndex === -1 ? (process.env.BASE_URL ?? 'http://localhost:3000') : args.splice(baseIndex, 2)[1]
const [route = '/', width = '320'] = args

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined })
const context = await browser.newContext({ viewport: { width: Number(width), height: 900 }, colorScheme: 'light' })
const page = await context.newPage()
await page.goto(base + route, { waitUntil: 'networkidle' })
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
  .analyze()
await browser.close()

for (const v of results.violations) {
  console.log(`\n${v.id} (${v.impact}): ${v.help}\n  ${v.helpUrl}`)
  for (const n of v.nodes.slice(0, 8)) {
    console.log(`  - ${n.target.join(' ')}`)
    console.log(`      ${n.failureSummary?.split('\n').slice(0, 3).join(' | ')}`)
    console.log(`      ${n.html.slice(0, 220)}`)
  }
}
console.log(`\n${route} @ ${width}px: ${results.violations.length} violation type(s), ${results.passes.length} rules passed`)
process.exit(results.violations.length ? 1 : 0)
