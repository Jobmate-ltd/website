#!/usr/bin/env node
/**
 * Lighthouse (mobile, the default preset) on the three routes the Phase 1
 * Definition of done names: home, one industry page and one article. Writes
 * an HTML report per route (not committed) plus summary.json and summary.md
 * with the four category scores, and exits 1 if any target is missed:
 *
 *   Accessibility 100 · SEO 100 · Best practices ≥ 95 · Performance ≥ 90
 *
 *   node scripts/lighthouse-routes.mjs [--base http://localhost:3000] [--out docs/lighthouse/phase-1] [--routes phase-1|phase-2|phase-3]
 *
 * Needs the `lighthouse` CLI on the path (npx resolves it) and a Chrome;
 * point CHROME_PATH at one if the machine has no download access. Run it on
 * an idle machine: performance scores drop under CPU contention.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const base = flag('--base', process.env.BASE_URL ?? 'http://localhost:3000')
const out = flag('--out', 'docs/lighthouse/phase-1')
mkdirSync(out, { recursive: true })

const PRESETS = {
  // Phase 1 Definition of done: home, one industry page, one article.
  'phase-1': [
    { slug: 'home', path: '/' },
    { slug: 'industry-healthcare', path: '/industries/healthcare' },
    { slug: 'article-riddor', path: '/insights/riddor-reporting-explained' },
  ],
  // Phase 2 Definition of done: home, /platform, /pricing and one module page,
  // against a server built with NEXT_PUBLIC_PLATFORM_LAUNCH=true.
  'phase-2': [
    { slug: 'home', path: '/' },
    { slug: 'platform', path: '/platform' },
    { slug: 'pricing', path: '/pricing' },
    { slug: 'module-riddor', path: '/platform/riddor' },
  ],
  // Phase 3 Definition of done: the RIDDOR checker, the transport industry page and one module page.
  'phase-3': [
    { slug: 'tool-riddor-checker', path: '/tools/riddor-checker' },
    { slug: 'industry-transport-logistics', path: '/industries/transport-logistics' },
    { slug: 'module-fleet-compliance', path: '/platform/fleet-compliance' },
  ],
}
const preset = flag('--routes', 'phase-1')
const ROUTES = PRESETS[preset]
if (!ROUTES) throw new Error(`--routes must be one of ${Object.keys(PRESETS).join(', ')}`)

const TARGETS = { performance: 90, accessibility: 100, 'best-practices': 95, seo: 100 }

const rows = []
for (const route of ROUTES) {
  const reportBase = join(out, route.slug)
  execFileSync(
    'npx',
    [
      '--no-install',
      'lighthouse',
      base + route.path,
      '--quiet',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=html',
      '--output=json',
      `--output-path=${reportBase}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
    ],
    { stdio: 'inherit', env: process.env },
  )
  const lhr = JSON.parse(readFileSync(`${reportBase}.report.json`, 'utf8'))
  // The HTML report carries the same data for a reader; the raw JSON is
  // several hundred KB per route and not worth committing.
  unlinkSync(`${reportBase}.report.json`)
  const scores = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]))
  const metrics = {
    lcp: lhr.audits['largest-contentful-paint']?.displayValue,
    cls: lhr.audits['cumulative-layout-shift']?.displayValue,
    tbt: lhr.audits['total-blocking-time']?.displayValue,
    fcp: lhr.audits['first-contentful-paint']?.displayValue,
  }
  rows.push({ ...route, scores, metrics, fetchTime: lhr.fetchTime, lighthouseVersion: lhr.lighthouseVersion })
  console.log(`${route.path}: ${JSON.stringify(scores)} ${JSON.stringify(metrics)}`)
}

writeFileSync(join(out, 'summary.json'), JSON.stringify(rows, null, 2))

const md = [
  `# Lighthouse — ${preset.replace(/^phase-(\d+)$/, 'Phase $1')}`,
  ``,
  `Mobile preset (simulated slow 4G, 4× CPU slowdown), Lighthouse ${rows[0]?.lighthouseVersion}, run ${rows[0]?.fetchTime} against \`${base}\`. Targets: Accessibility 100 · SEO 100 · Best practices ≥ 95 · Performance ≥ 90.`,
  ``,
  `| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |`,
  `| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |`,
  ...rows.map((r) => `| \`${r.path}\` | ${r.scores.performance} | ${r.scores.accessibility} | ${r.scores['best-practices']} | ${r.scores.seo} | ${r.metrics.lcp} | ${r.metrics.cls} | ${r.metrics.tbt} |`),
  ``,
  `Full HTML reports are written beside this file by \`node scripts/lighthouse-routes.mjs\` and are not committed.`,
  ``,
]
writeFileSync(join(out, 'summary.md'), md.join('\n'))

const misses = rows.flatMap((r) => Object.entries(TARGETS).filter(([k, min]) => r.scores[k] < min).map(([k, min]) => `${r.path} ${k} ${r.scores[k]} < ${min}`))
if (misses.length) {
  console.error('✘ Lighthouse targets missed:\n  ' + misses.join('\n  '))
  process.exit(1)
}
console.log(`✔ every route meets the targets; reports in ${out}`)
