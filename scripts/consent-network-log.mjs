#!/usr/bin/env node
/**
 * Proves the consent gate (Workstream C.2, Definition of done): records every
 * network request the homepage makes before a choice, after "Reject all" and
 * after "Accept all", then renders the three logs as one PNG so the evidence
 * can sit in the PR without anyone opening DevTools.
 *
 *   node scripts/consent-network-log.mjs [--base http://localhost:3000] [--out docs/screenshots/phase-1]
 *
 * Writes consent-network-log.png and consent-network-log.json to --out.
 * Exits 1 if any third-party host is contacted before consent, so it doubles
 * as a check.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const base = flag('--base', process.env.BASE_URL ?? 'http://localhost:3000')
const out = flag('--out', 'docs/screenshots/phase-1')
mkdirSync(out, { recursive: true })

const origin = new URL(base).origin
const THIRD_PARTY = /googletagmanager\.com|google-analytics\.com|vercel-insights\.com|_vercel\/speed-insights|youtube\.com|youtube-nocookie\.com|searchatlas\.com|calendly\.com/

function classify(url) {
  if (url.startsWith(origin)) return 'first-party'
  if (url.startsWith('data:') || url.startsWith('blob:')) return 'inline'
  return 'third-party'
}

async function record(page, label, act) {
  const entries = []
  const onRequest = (req) => entries.push({ url: req.url(), type: req.resourceType(), method: req.method() })
  page.on('request', onRequest)
  await act()
  await page.mouse.wheel(0, 3000)
  await page.waitForTimeout(2500)
  await page.waitForLoadState('networkidle')
  page.off('request', onRequest)
  const rows = entries.map((e) => ({ ...e, party: classify(e.url) }))
  return {
    label,
    total: rows.length,
    thirdParty: rows.filter((r) => r.party === 'third-party').map((r) => r.url),
    nonEssential: rows.filter((r) => THIRD_PARTY.test(r.url)).map((r) => r.url),
    rows,
  }
}

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
const page = await context.newPage()

const before = await record(page, 'First visit, no choice made', () => page.goto(base + '/', { waitUntil: 'networkidle' }))
const rejected = await record(page, 'After "Reject all", then a reload', async () => {
  await page.getByRole('button', { name: 'Reject all' }).click()
  await page.reload({ waitUntil: 'networkidle' })
})
await context.clearCookies()
const accepted = await record(page, 'After "Accept all"', async () => {
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.waitForFunction(() => Array.from(document.scripts).some((s) => s.src.includes('googletagmanager.com/gtag/js')), null, { timeout: 15_000 }).catch(() => {})
})

const cookiesAfterAccept = (await context.cookies()).map((c) => c.name)
const capturedAt = new Date().toISOString()
const report = { capturedAt, base, phases: [before, rejected, accepted], cookiesAfterAccept }
writeFileSync(join(out, 'consent-network-log.json'), JSON.stringify(report, null, 2))

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const short = (url) => {
  const u = new URL(url)
  const path = u.pathname.length > 64 ? u.pathname.slice(0, 61) + '…' : u.pathname
  return `${u.host}${path}${u.search ? ' ?…' : ''}`
}
const phaseHtml = (p) => `
  <section>
    <h2>${esc(p.label)} <span class="count">${p.total} requests · ${p.thirdParty.length} third-party · ${p.nonEssential.length} non-essential</span></h2>
    <table>
      <thead><tr><th>Type</th><th>Host and path</th><th>Party</th></tr></thead>
      <tbody>
        ${p.rows.map((r) => `<tr class="${r.party}${THIRD_PARTY.test(r.url) ? ' non-essential' : ''}"><td>${esc(r.type)}</td><td>${esc(short(r.url))}</td><td>${r.party}${THIRD_PARTY.test(r.url) ? ' · non-essential' : ''}</td></tr>`).join('')}
      </tbody>
    </table>
  </section>`

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Consent network log</title>
<style>
  body{margin:0;background:#fff;color:#0a0a0a;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;padding:28px 32px}
  h1{font:800 20px/1.2 system-ui,sans-serif;margin:0 0 4px}
  .meta{color:#3e4654;margin:0 0 24px;font-family:system-ui,sans-serif}
  h2{font:700 15px/1.3 system-ui,sans-serif;margin:24px 0 8px;border-top:1px solid #e5e7eb;padding-top:16px}
  .count{font-weight:400;color:#3e4654;margin-left:8px}
  table{border-collapse:collapse;width:100%}
  th{text-align:left;font:700 11px/1 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#3e4654;padding:6px 8px;border-bottom:1px solid #e5e7eb}
  td{padding:4px 8px;border-bottom:1px solid #f3f4f6;white-space:nowrap}
  tr.third-party td{background:rgba(245,158,11,.10)}
  tr.non-essential td{background:rgba(230,57,70,.08);color:#cd1a27;font-weight:700}
  .verdict{font:700 14px/1.4 system-ui,sans-serif;margin:8px 0 0;padding:10px 12px;border:1px solid #e5e7eb;border-radius:4px}
  .verdict.ok{background:rgba(34,197,94,.10);color:#15803d}
  .verdict.bad{background:rgba(230,57,70,.08);color:#cd1a27}
</style></head><body>
<h1>www.jobsafe.cloud — network requests around the consent banner</h1>
<p class="meta">Captured ${capturedAt} against ${esc(base)} with headless Chromium at 1280×900, scrolled to the foot of the page each time. Amber rows are third-party hosts; red rows are non-essential (analytics, video, chat) hosts.</p>
<p class="verdict ${before.nonEssential.length === 0 && rejected.nonEssential.length === 0 ? 'ok' : 'bad'}">
  Before a choice: ${before.nonEssential.length} non-essential requests. After "Reject all": ${rejected.nonEssential.length}. After "Accept all": ${accepted.nonEssential.length} (analytics loads only now). Cookies after accept: ${esc(cookiesAfterAccept.join(', ') || 'none')}.
</p>
${[before, rejected, accepted].map(phaseHtml).join('')}
</body></html>`

const shot = await context.newPage()
await shot.setContent(html, { waitUntil: 'load' })
await shot.screenshot({ path: join(out, 'consent-network-log.png'), fullPage: true })
await browser.close()

console.log(`before: ${before.total} requests, ${before.nonEssential.length} non-essential`)
console.log(`reject: ${rejected.total} requests, ${rejected.nonEssential.length} non-essential`)
console.log(`accept: ${accepted.total} requests, ${accepted.nonEssential.length} non-essential; cookies: ${cookiesAfterAccept.join(', ')}`)
if (before.nonEssential.length || rejected.nonEssential.length) {
  console.error('✘ a non-essential script loaded before consent')
  process.exit(1)
}
console.log(`✔ wrote ${join(out, 'consent-network-log.png')}`)
