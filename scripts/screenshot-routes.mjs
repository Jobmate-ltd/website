#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — route screenshots.
//
// Captures every marketing route at 1440 and 390 wide, full page, as JPEG.
// Used for the before/after comparison in the Phase 1 PR and kept so later
// phases can produce the same evidence.
//
//   node scripts/screenshot-routes.mjs --out docs/screenshots/phase-1/before
//   node scripts/screenshot-routes.mjs --out docs/screenshots/phase-1/after --base http://localhost:3000 --consent reject --banner
//
// --consent reject|accept  presets the consent cookie so the banner does not
//                          cover the page in every shot (the site as a
//                          returning visitor sees it).
// --banner                 also captures the homepage viewport with the banner
//                          showing, as consent-banner-<width>.jpg.
// --platform               also capture the Phase 2 routes (the server must be
//                          built with NEXT_PUBLIC_PLATFORM_LAUNCH=true);
// --platform-only          capture just those.
//
// Requires Playwright (globally or in node_modules) and a running server.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function loadPlaywright() {
  try {
    return require('playwright')
  } catch {
    // Fall back to a global install (the CI image ships one).
    const globalRoot = process.env.GLOBAL_NODE_MODULES ?? '/opt/node22/lib/node_modules'
    return require(join(globalRoot, 'playwright'))
  }
}

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const BASE = arg('--base', 'http://localhost:3000')
const OUT = arg('--out', 'docs/screenshots/before')
const ONLY = arg('--only', '')
const CONSENT = arg('--consent', '')
const BANNER = args.includes('--banner')
const PLATFORM = args.includes('--platform') || process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true'
const PLATFORM_ONLY = args.includes('--platform-only')

/** The cookie lib/consent.ts writes, so the banner stays closed. */
function consentCookie(choice) {
  const granted = choice === 'accept'
  return {
    name: 'jobsafe_consent',
    value: encodeURIComponent(JSON.stringify({ version: 1, at: new Date().toISOString(), analytics: granted, marketing: granted })),
    url: BASE,
  }
}

/** Every public route. Keep in sync with app/sitemap.ts. */
export const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'academy', path: '/academy' },
  { slug: 'insights', path: '/insights' },
  { slug: 'insights-rams', path: '/insights/rams-risk-assessments-method-statements' },
  { slug: 'insights-investigate', path: '/insights/how-to-investigate-a-workplace-accident' },
  { slug: 'insights-first-aid', path: '/insights/first-aid-at-work-requirements' },
  { slug: 'insights-riddor', path: '/insights/riddor-reporting-explained' },
  { slug: 'insights-near-miss', path: '/insights/near-miss-reporting-safety-culture' },
  { slug: 'insights-lone-worker', path: '/insights/lone-worker-safety-guide' },
  { slug: 'insights-accident-book', path: '/insights/accident-book-requirements-uk' },
  { slug: 'insights-riddor-2026', path: '/insights/riddor-changes-2026-consultation' },
  { slug: 'insights-toolbox-talks', path: '/insights/toolbox-talks-that-work' },
  { slug: 'industries-window-door-fitters', path: '/industries/window-door-fitters' },
  { slug: 'industries-healthcare', path: '/industries/healthcare' },
  { slug: 'industries-field-services', path: '/industries/field-services' },
  { slug: 'industries-transport-logistics', path: '/industries/transport-logistics' },
  { slug: 'toolkit', path: '/toolkit' },
  { slug: 'privacy-policy', path: '/privacy-policy' },
  { slug: 'terms', path: '/terms' },
  { slug: 'cookies', path: '/cookies', optional: true },
]

/** Phase 2 routes, captured only against a server built with NEXT_PUBLIC_PLATFORM_LAUNCH=true (pass --platform). */
export const PLATFORM_ROUTES = [
  { slug: 'platform', path: '/platform' },
  { slug: 'platform-incident-reporting', path: '/platform/incident-reporting' },
  { slug: 'platform-riddor', path: '/platform/riddor' },
  { slug: 'platform-risk-assessments', path: '/platform/risk-assessments' },
  { slug: 'platform-permits-to-work', path: '/platform/permits-to-work' },
  { slug: 'platform-offline', path: '/platform/offline' },
  { slug: 'pricing', path: '/pricing' },
  { slug: 'security', path: '/security' },
  { slug: 'demo', path: '/demo' },
  { slug: 'contact', path: '/contact' },
  { slug: 'not-found', path: '/this-page-does-not-exist', optional: true, allow404: true },
]

const VIEWPORTS = [
  // 1440 rendered at half scale keeps the PR images legible and small.
  { name: '1440', width: 1440, height: 900, deviceScaleFactor: 0.5 },
  { name: '390', width: 390, height: 844, deviceScaleFactor: 1 },
]

async function main() {
  const { chromium } = loadPlaywright()
  mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined })

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    })
    if (BANNER) {
      // First visit: the banner over the hero, viewport only.
      const page = await context.newPage()
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 90_000 })
      await page.waitForSelector('[role="dialog"]', { timeout: 10_000 })
      const file = join(OUT, `consent-banner-${vp.name}.jpg`)
      await page.screenshot({ path: file, fullPage: false, type: 'jpeg', quality: 80 })
      console.log(`✔ ${file}`)
      await page.close()
    }
    if (CONSENT === 'reject' || CONSENT === 'accept') {
      await context.addCookies([consentCookie(CONSENT)])
    } else if (CONSENT) {
      throw new Error(`--consent must be "reject" or "accept", got "${CONSENT}"`)
    }
    const routes = PLATFORM_ONLY ? PLATFORM_ROUTES : PLATFORM ? [...ROUTES, ...PLATFORM_ROUTES] : ROUTES
    for (const route of routes) {
      if (ONLY && route.slug !== ONLY) continue
      const page = await context.newPage()
      const res = await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 90_000 })
      if (!res || (res.status() >= 400 && !(route.allow404 && res.status() === 404))) {
        if (route.optional) {
          await page.close()
          continue
        }
        throw new Error(`${route.path} returned ${res?.status()}`)
      }
      // Let lazy images and reveal-on-scroll settle by walking the page.
      await page.evaluate(async () => {
        const step = Math.max(400, window.innerHeight)
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(400)
      const file = join(OUT, `${route.slug}-${vp.name}.jpg`)
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 72 })
      console.log(`✔ ${file}`)
      await page.close()
    }
    await context.close()
  }
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
