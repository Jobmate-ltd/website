#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — real product screenshots for the marketing site.
//
// Drives the jobsafe platform (its own repo, running in local demo mode with
// the North Star Logistics seed) with Playwright, captures every state the
// site needs, and exports optimised AVIF + WebP into public/product/. It also
// regenerates lib/product-images.ts, the typed manifest the pages import.
//
//   PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium \
//   node scripts/capture-product.mjs --base http://localhost:3100 --out public/product
//
// --base <url>     jobsafe dev/prod server (default http://localhost:3100)
// --out <dir>      output folder, site-relative (default public/product)
// --only a,b,c     recapture a subset of ids; the others must already exist
// --ts-only        skip capture, regenerate lib/product-images.ts from --out
// --keep-png       keep the temp folder with the lossless PNG captures (debugging)
// --static         (re)export only the supplied stills in STATIC, then rewrite the manifest
//
// Nothing in a screenshot is mocked: every pixel is the product rendering its
// own seed. Developer-only chrome (the demo user switcher, the build footer)
// is hidden with injected CSS before each capture. Evidence files attached
// during a capture are real files pushed through the product's own upload
// controls. Alt text lives in ALT below; edit it here, never in the .ts.
//
// A few stills are supplied by the product team rather than driven (STATIC):
// they are still the real product, exported from assets/product-source/ by the
// same sharp pipeline and listed in the same manifest.
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..')
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback
}
const BASE = arg('--base', 'http://localhost:3100').replace(/\/$/, '')
const OUT = resolve(ROOT, arg('--out', 'public/product'))
const ONLY = arg('--only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const TS_ONLY = args.includes('--ts-only')
const KEEP_PNG = args.includes('--keep-png')
const STATIC_ONLY = args.includes('--static')
const TS_OUT = join(ROOT, 'lib', 'product-images.ts')
const SEED_PHOTO = join(ROOT, 'public', 'images', 'industries', 'transport-logistics-hero.jpg')

/* ── the states ─────────────────────────────────────────────────────────────
   Order matters only for the manifest. `kind` decides the device profile.
   Alt text says what is actually visible in the capture; the caption is one
   line for use under a frame. */
const ALT = {
  'dashboard-desktop': {
    kind: 'desktop',
    alt: 'jobsafe dashboard for North Star Logistics: KPI cards for open high-severity reports, overdue actions, incidents this week and days since the last lost-time injury, a live incident feed of numbered reports with severity and status pills, a reports-by-category donut and hotspots by depot, with the sidebar showing overdue-action, RIDDOR and permit badges.',
    caption: 'The network-wide safety picture the moment you sign in.',
  },
  'dashboard-phone': {
    kind: 'phone',
    alt: 'jobsafe dashboard on a phone: Today, This week and This month range, the All sites filter, then KPI cards stacked one per row for open high-severity reports, overdue actions, incidents this week and days since the last lost-time injury, with the live incident feed below.',
    caption: 'The same dashboard, one-handed on site.',
  },
  'reports-register-desktop': {
    kind: 'desktop',
    alt: 'jobsafe incident register: a context strip for reports in view, open and investigating, awaiting sign-off and RIDDOR notifications due, a toolbar with search, date range, Filters, Saved views and New report, and a table of reports with mono numbers like 26-035, category, site, reporter, reported time, High, Medium or Low severity, Open, Investigating, Awaiting sign-off or Closed status and RIDDOR flags.',
    caption: 'Every report, filterable by status, severity, site and RIDDOR state.',
  },
  'report-new-evidence-phone': {
    kind: 'phone',
    alt: 'New incident report on a phone at step 5 of 7, Evidence: a dropzone accepting JPG, PNG, MP4 and PDF up to 50 MB each with Take a photo and Choose files buttons, and three attached files shown as tiles, two warehouse photos and a witness statement PDF.',
    caption: 'Photos, video and documents attach on the device and sync later.',
  },
  'report-new-riddor-phone': {
    kind: 'phone',
    alt: 'New incident report on a phone at step 6 of 7, RIDDOR triage: Yes reportable, No not reportable and Unsure flag for review, with Yes selected and the reportable category list showing death, specified injury, over-7-day incapacitation, injury to a person not at work and dangerous occurrence, each with its regulation and notification deadline.',
    caption: 'RIDDOR triage is a step in every report, not an afterthought.',
  },
  'report-detail-desktop': {
    kind: 'desktop',
    alt: 'jobsafe report detail for an unsecured-load near miss awaiting sign-off: three evidence tiles (two photos and a witness statement PDF), the vehicle card with the UK number plate YJ68 WCD and a Cartwright curtainsider, the site and location card for the Leeds depot gatehouse, and the ICAM four-level root-cause analysis, with similar past reports and the activity timeline on the right.',
    caption: 'Evidence, vehicle, location and ICAM root cause on one page.',
  },
  'riddor-verdict-desktop': {
    kind: 'desktop',
    alt: 'jobsafe RIDDOR statutory notification form at step 1 of 7, Reportability triage, with the answers work-related, not on a public road, injury to a worker and a Regulation 4 fracture ticked; the live verdict panel in the rail reads Specified injury to a worker, Reg. 4, notify without delay by telephoning the HSE Incident Contact Centre, then complete form F2508 within 10 days.',
    caption: 'The verdict updates as you answer: category, deadline, phone call and HSE form.',
  },
  'risk-register-desktop': {
    kind: 'desktop',
    alt: 'jobsafe Risk & RIDDOR register: a stat strip for live assessments, reviews overdue, awaiting approval, RIDDOR notifications due and F2508 submitted, a warning banner about outstanding notifications, and the risk assessment table with RA numbers, type, site, owner, residual band, next review date and Live, Awaiting approval, Review overdue or Draft status.',
    caption: 'Live, overdue and awaiting-approval assessments in one register.',
  },
  'risk-matrix-desktop': {
    kind: 'desktop',
    alt: 'jobsafe risk worksheet RA-101, forklift truck operations, in matrix view: the risk profile strip for hazards assessed, highest residual, reduction from initial and residual spread above a 5 by 5 severity-by-likelihood grid coloured Low, Medium, High and Extreme, with each hazard plotted at its residual score.',
    caption: '5×5 scoring with Low, Medium, High and Extreme bands.',
  },
  'risk-bowtie-desktop': {
    kind: 'desktop',
    alt: 'jobsafe risk worksheet in bowtie view: the barrier diagram for a forklift-and-pedestrian top event with four threats and their preventive barriers on the left, three consequences and their recovery barriers on the right, each barrier marked effective, degraded or not in place, plus the barrier weighting legend and the barrier audit.',
    caption: 'Bowtie analysis: threats, consequences and the barriers between them.',
  },
  'permits-gate-desktop': {
    kind: 'desktop',
    alt: 'jobsafe permits to work with blocked confined-space permit PTW-0450 open in a drawer: the pre-issue gate reads Cannot issue this permit because the contractor is suspended, the gate checks show contractor competence failing on expired insurance, RAMS and accreditation and the supporting risk assessment RA-118 still awaiting approval, the controls to confirm are unticked and Issue permit is disabled.',
    caption: 'The pre-issue gate stops a permit until competence and the risk assessment are in date.',
  },
  'fleet-cards-desktop': {
    kind: 'desktop',
    alt: 'jobsafe fleet register in card view: a stat strip for assets on register, in service, off road, statutory date passed and due within 30 days, a warning banner, and cards for forklifts, HGVs with number plates WV24 KLM and BX25 TRD, a MEWP, plant and vans, each with keeper, site, MOT, service and inspection dates flagged red or amber when passed or due.',
    caption: 'MOT, service and inspection dates for every asset, flagged before they lapse.',
  },
  'training-matrix-desktop': {
    kind: 'desktop',
    alt: 'jobsafe training and competency matrix: a team capability gauge against target, an individual capability line chart, an absolute potential donut, the proficiency scale from exempt to expert, and the matrix of team members by competency with current-to-target levels, capable counts, gap badges and capability percentages.',
    caption: 'Who is capable of what, and where the gaps are.',
  },
  'actions-board-desktop': {
    kind: 'desktop',
    alt: 'jobsafe actions board: a stat strip for open, overdue, high-priority, in-progress and closed actions, an overdue warning banner, and Overdue, Open, In progress and Closed columns of action cards with priority pill, owner and due date.',
    caption: 'Corrective actions tracked to closure across every depot.',
  },
  'sos-modal-phone': {
    kind: 'phone',
    alt: 'jobsafe SOS emergency screen on a phone: a large 999 Call emergency services button, site chips for Birmingham, Bristol, Glasgow, Leeds and Wolverhampton, tap-to-call rows for the site manager, deputy, HSSE escalation and gatehouse with their numbers, the assembly point and the escalation note.',
    caption: 'SOS: 999 first, then the right people for the site you are on.',
  },
  'pending-sync-phone': {
    kind: 'phone',
    alt: 'jobsafe on a phone while offline: the banner says you are offline and changes are saved on this device and will sync when you reconnect, the sync chip reads Offline, 1 pending, and a near-miss report filed offline shows Open, Low and an amber Pending sync pill beside its status.',
    caption: 'Offline first: the record is saved on the device and syncs when the signal returns.',
  },
}
/* ── supplied stills ────────────────────────────────────────────────────────
   Real product renders handed over as PNG rather than captured here. The
   source file is committed under assets/product-source/ so the export is
   reproducible; `--static` re-exports them without touching the captures. */
const STATIC = {
  'dashboard-hero-desktop': {
    kind: 'desktop',
    source: join(ROOT, 'assets', 'product-source', 'dashboard-hero-desktop.png'),
    alt: 'The jobsafe dashboard for North Star Logistics: six open high-severity reports, two overdue actions, 18 incidents this week, the live incident feed with report numbers, sites and statuses, reports by category, and hotspots by site.',
    caption: 'The dashboard: open high-severity reports, overdue actions, this week\u2019s incidents and the live feed, with hotspots by site.',
  },
}

/** Everything the manifest lists, supplied stills first. */
const META = { ...STATIC, ...ALT }
const IDS = Object.keys(META)

const DESKTOP = { width: 1440, height: 900, scale: 2 }
const PHONE = { width: 390, height: 844, scale: 3 }

/* ── helpers ──────────────────────────────────────────────────────────────── */

const log = (...m) => console.log('[capture]', ...m)
const wanted = (id) => !ONLY.length || ONLY.includes(id)

/** Developer-only chrome, hidden before every capture. */
const HIDE_CSS = `
  main footer { display: none !important; }                     /* build/version footer */
  [aria-label^="Signed in as"] > svg { display: none !important; } /* demo user-switcher chevron */
  [data-testid="toast"] { display: none !important; }
  nextjs-portal { display: none !important; }                   /* Next.js dev-tools button */
  * { caret-color: transparent !important; }
`

async function settle(page, { timeout = 90_000 } = {}) {
  await page.waitForLoadState('domcontentloaded')
  await page
    .locator('[aria-label="Loading jobsafe"]')
    .waitFor({ state: 'detached', timeout })
    .catch(() => {})
  await page.waitForFunction(
    () => document.querySelectorAll('.animate-pulse-soft').length === 0,
    null,
    { timeout },
  )
  await page
    .waitForFunction(() => document.querySelectorAll('[data-testid="toast"]').length === 0, null, {
      timeout: 12_000,
    })
    .catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(
    () => Array.from(document.images).every((i) => i.complete),
    null,
    { timeout: 15_000 },
  ).catch(() => {})
  await page.waitForTimeout(600)
  await page.addStyleTag({ content: HIDE_CSS })
}

async function open(page, path) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  await settle(page)
}

/** Scrolls the window so `locator` sits just under the sticky topbar. */
async function scrollUnderTopbar(page, locator, gap = 16) {
  const handle = await locator.elementHandle()
  await page.evaluate(
    ([el, g]) => {
      // The sticky bar can wrap to two rows on a phone, so measure it rather than trust --header-h.
      const bar = document.querySelector('header.sticky, main div.sticky.top-0')
      const header =
        bar?.getBoundingClientRect().height ||
        Number(getComputedStyle(document.documentElement).getPropertyValue('--header-h').replace('px', '')) ||
        60
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(0, top - header - g), behavior: 'instant' })
    },
    [handle, gap],
  )
  await page.waitForTimeout(250)
}

const results = new Map()
const failures = []
let TMP = ''

async function capture(page, id, { clip, size } = {}) {
  const file = join(TMP, `${id}.png`)
  await page.screenshot({
    path: file,
    type: 'png',
    animations: 'disabled',
    caret: 'hide',
    ...(clip ? { clip } : {}),
  })
  let meta = await sharp(file).metadata()
  // A fractional scale factor can leave the capture a pixel off the target; normalise it.
  if (size && (meta.width !== size.width || meta.height !== size.height)) {
    if (Math.abs(meta.width - size.width) > 4 || Math.abs(meta.height - size.height) > 4)
      throw new Error(`${id}: captured ${meta.width}×${meta.height}, expected ${size.width}×${size.height}`)
    const buf = await sharp(file).resize(size.width, size.height, { fit: 'fill' }).png().toBuffer()
    writeFileSync(file, buf)
    meta = await sharp(file).metadata()
  }
  results.set(id, { id, kind: ALT[id].kind, png: file, width: meta.width, height: meta.height })
  log(`captured ${id} (${meta.width}×${meta.height})`)
}

async function attempt(id, fn) {
  if (!wanted(id)) return
  try {
    await fn()
  } catch (e) {
    failures.push({ id, error: e })
    console.error(`[capture] FAILED ${id}: ${e?.message ?? e}`)
  }
}

/** Real evidence files: a photo, a close-up crop of it, and a one-page PDF. */
async function buildEvidence() {
  const dir = join(TMP, 'evidence')
  mkdirSync(dir, { recursive: true })
  const photo = join(dir, 'IMG_2041.jpg')
  const closeup = join(dir, 'IMG_2042.jpg')
  const pdf = join(dir, 'Witness statement.pdf')
  await sharp(SEED_PHOTO).resize({ width: 1600 }).jpeg({ quality: 82 }).toFile(photo)
  const m = await sharp(SEED_PHOTO).metadata()
  const w = Math.round(m.width * 0.42)
  const h = Math.round(w * 0.75)
  await sharp(SEED_PHOTO)
    .extract({ left: 0, top: Math.round(m.height * 0.12), width: w, height: Math.min(h, m.height) })
    .resize({ width: 1200 })
    .jpeg({ quality: 82 })
    .toFile(closeup)
  writeFileSync(
    pdf,
    minimalPdf([
      'Witness statement',
      'North Star Logistics Ltd, Leeds depot',
      'Gatehouse check found two pallets of drums unstrapped on an outbound',
      'curtainsider. Vehicle held at the gate; load re-secured before departure.',
    ]),
  )
  return { photo, closeup, pdf }
}

function minimalPdf(lines) {
  const esc = (s) => s.replace(/[\\()]/g, (c) => '\\' + c)
  const content =
    'BT /F1 12 Tf 72 760 Td 16 TL ' + lines.map((l) => `(${esc(l)}) Tj T*`).join(' ') + ' ET'
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let out = '%PDF-1.4\n'
  const offsets = []
  objs.forEach((o, i) => {
    offsets.push(Buffer.byteLength(out))
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = Buffer.byteLength(out)
  out +=
    `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` +
    offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('') +
    `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(out, 'latin1')
}

/* ── desktop flow ─────────────────────────────────────────────────────────── */

async function desktopFlow(browser, evidence) {
  const context = await browser.newContext({
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    deviceScaleFactor: DESKTOP.scale,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  page.setDefaultTimeout(45_000)

  await attempt('dashboard-desktop', async () => {
    await open(page, '/')
    await page.getByRole('heading', { level: 1, name: 'Dashboard' }).waitFor()
    await capture(page, 'dashboard-desktop')
  })

  await attempt('reports-register-desktop', async () => {
    await open(page, '/reports')
    await page.getByRole('table', { name: 'Incident register' }).waitFor()
    await capture(page, 'reports-register-desktop')
  })

  await attempt('report-detail-desktop', async () => {
    // Evidence → vehicle → ICAM spans ~1000 CSS px, more than a 900 px viewport shows. This one
    // state renders at 1760×1100 CSS with a matching scale factor (still 2880×1800 output) in a
    // tall viewport, and the top 1100 px are clipped so the sticky footer bar stays out of frame.
    const W = 1760
    const H = 1100
    const ctx = await browser.newContext({
      viewport: { width: W, height: 1500 },
      deviceScaleFactor: (DESKTOP.width * DESKTOP.scale) / W,
      locale: 'en-GB',
      timezoneId: 'Europe/London',
      colorScheme: 'light',
      reducedMotion: 'reduce',
    })
    try {
      const p = await ctx.newPage()
      p.setDefaultTimeout(45_000)
      // inc_h: "Unsecured load identified at gatehouse", awaiting sign-off, YJ68 WCD, ICAM populated.
      await open(p, '/reports/inc_h')
      await p.getByRole('heading', { level: 1, name: /Unsecured load/ }).waitFor()
      // Attach real files through the product's own evidence control.
      await p.locator('input[aria-label="Add evidence files"]').setInputFiles([
        evidence.photo,
        evidence.closeup,
        evidence.pdf,
      ])
      await p.getByText('Witness statement.pdf').first().waitFor()
      await p.locator('img[alt="IMG_2042.jpg"]').waitFor()
      await p.waitForFunction(
        () => Array.from(document.querySelectorAll('img')).every((i) => i.complete && i.naturalWidth > 0),
        null,
        { timeout: 15_000 },
      )
      await settle(p)
      await scrollUnderTopbar(p, p.getByRole('heading', { name: /^Evidence/ }), 20)
      const icam = await p.getByRole('heading', { name: /^Root-cause analysis/ }).boundingBox()
      if (!icam || icam.y > H - 160) {
        throw new Error(`ICAM panel not in frame (heading at y=${icam?.y})`)
      }
      await capture(p, 'report-detail-desktop', {
        clip: { x: 0, y: 0, width: W, height: H },
        size: { width: DESKTOP.width * DESKTOP.scale, height: DESKTOP.height * DESKTOP.scale },
      })
    } finally {
      await ctx.close()
    }
  })

  await attempt('riddor-verdict-desktop', async () => {
    await open(page, '/riddor/new')
    await page.getByRole('heading', { level: 2, name: 'Reportability triage' }).waitFor()
    await page.getByRole('radio', { name: 'Yes', exact: true }).first().click()
    // The input is visually hidden behind its label; click the label like the product's e2e does.
    await page.getByText('A fracture, other than to fingers, thumbs or toes', { exact: true }).click()
    const verdict = page.getByRole('region', { name: 'Reportability verdict' })
    await verdict.getByText(/Specified injury/).waitFor()
    await verdict.getByText(/F2508/).waitFor()
    await settle(page)
    await capture(page, 'riddor-verdict-desktop')
  })

  await attempt('risk-register-desktop', async () => {
    await open(page, '/risk')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await capture(page, 'risk-register-desktop')
  })

  const worksheet = async () => {
    await open(page, '/risk/RA-101')
    await page.getByRole('heading', { level: 1, name: /Forklift truck operations/ }).waitFor()
    await page.getByRole('group', { name: 'Risk profile' }).waitFor()
  }

  await attempt('risk-matrix-desktop', async () => {
    await worksheet()
    await page.getByRole('radio', { name: 'Matrix' }).click()
    const matrix = page.getByRole('group', { name: 'Residual risk matrix' })
    await matrix.waitFor()
    await settle(page)
    await scrollUnderTopbar(page, page.getByRole('radiogroup', { name: 'Worksheet view' }), 20)
    await capture(page, 'risk-matrix-desktop')
  })

  await attempt('risk-bowtie-desktop', async () => {
    if (!(await page.getByRole('group', { name: 'Risk profile' }).count())) await worksheet()
    await page.getByRole('radio', { name: 'Bowtie' }).click()
    const diagram = page.getByRole('heading', { name: 'Barrier diagram' })
    await diagram.waitFor()
    // "Fit" scales the diagram to the card so threats, top event and consequences are all in frame.
    const fit = page.getByRole('radio', { name: 'Fit' })
    if (await fit.count()) await fit.click()
    else await page.getByText('Fit', { exact: true }).click()
    await settle(page)
    await scrollUnderTopbar(page, diagram, 36)
    await capture(page, 'risk-bowtie-desktop')
  })

  await attempt('permits-gate-desktop', async () => {
    await open(page, '/permits')
    await page.getByRole('table', { name: 'Permits to work' }).waitFor()
    await page.getByRole('button', { name: /Interceptor tank clean/ }).first().click()
    const drawer = page.getByRole('dialog')
    await drawer.getByRole('alert').filter({ hasText: 'Cannot issue this permit' }).waitFor()
    await drawer.getByRole('list', { name: 'Gate checks' }).waitFor()
    await settle(page)
    await capture(page, 'permits-gate-desktop')
    await page.keyboard.press('Escape')
  })

  await attempt('fleet-cards-desktop', async () => {
    await open(page, '/fleet?view=cards')
    await page.getByRole('radio', { name: 'Cards' }).waitFor().catch(() => {})
    await capture(page, 'fleet-cards-desktop')
  })

  await attempt('training-matrix-desktop', async () => {
    await open(page, '/training')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await capture(page, 'training-matrix-desktop')
  })

  await attempt('actions-board-desktop', async () => {
    await open(page, '/actions')
    // "All" so the Closed column has cards too.
    await page.getByRole('tab', { name: /^All/ }).click()
    await page.getByRole('radio', { name: 'Board' }).click()
    await settle(page)
    await capture(page, 'actions-board-desktop')
  })

  await context.close()
}

/* ── phone flows ──────────────────────────────────────────────────────────── */

function phoneContext(browser, extra = {}) {
  return browser.newContext({
    viewport: { width: PHONE.width, height: PHONE.height },
    deviceScaleFactor: PHONE.scale,
    isMobile: true,
    hasTouch: true,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    ...extra,
  })
}

/** Fills steps 1–4 of the new-report wizard and leaves the page on step 5, Evidence. */
async function wizardToEvidence(page, story) {
  await page.getByRole('heading', { level: 2, name: 'Incident details' }).waitFor()
  await page.getByText(story.category, { exact: true }).click()
  await page.getByText(story.severity, { exact: true }).click()
  await page.getByLabel('Report title').fill(story.title)
  await page.getByLabel('What happened').fill(story.narrative)
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('heading', { level: 2, name: 'Site & location' }).waitFor()
  await page.getByRole('combobox', { name: /^Depot/ }).selectOption(story.siteId)
  if (story.area) await page.getByLabel('Area within depot').fill(story.area)
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('heading', { level: 2, name: 'People involved' }).waitFor()
  if (story.person) {
    await page.getByLabel('Full name').fill(story.person.name)
    await page.getByLabel('Role', { exact: true }).fill(story.person.role)
    if (story.person.tag) {
      await page
        .getByRole('radio', { name: story.person.tag })
        .click()
        .catch(() => {})
    }
    await page.getByRole('button', { name: 'Add person' }).click()
  }
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('heading', { level: 2, name: 'Vehicle / asset' }).waitFor()
  if (story.vehicle) {
    await page.getByRole('switch', { name: 'A vehicle or asset was involved' }).click()
    await page.getByLabel('Registration / asset id').fill(story.vehicle.reg)
    await page.getByLabel('Make / model').fill(story.vehicle.model)
  }
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('heading', { level: 2, name: 'Evidence' }).waitFor()
}

async function phoneFlow(browser, evidence) {
  const context = await phoneContext(browser)
  const page = await context.newPage()
  page.setDefaultTimeout(45_000)

  await attempt('dashboard-phone', async () => {
    await open(page, '/')
    await page.getByRole('heading', { level: 1, name: 'Dashboard' }).waitFor()
    await capture(page, 'dashboard-phone')
  })

  await attempt('sos-modal-phone', async () => {
    if (!(await page.getByRole('heading', { level: 1, name: 'Dashboard' }).count())) await open(page, '/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('button', { name: 'SOS' }).click()
    const dialog = page.getByRole('dialog', { name: 'Emergency' })
    await dialog.waitFor()
    await dialog.getByRole('link', { name: /Call emergency services/ }).waitFor()
    await settle(page)
    await capture(page, 'sos-modal-phone')
    await page.keyboard.press('Escape')
  })

  const story = {
    category: 'Incident',
    severity: 'High',
    title: 'Forklift clipped pallet stack, operator struck',
    narrative:
      'Counterbalance truck clipped a stack of loaded pallets turning at the end of aisle 3. Two pallets fell into the aisle and the operator was struck on the shoulder by a falling carton. First aid given on site; sent to A&E.',
    siteId: 'BHM',
    area: 'Warehouse C, aisle 3',
    person: { name: 'Owen Blake', role: 'FLT operator', tag: 'Injured' },
    vehicle: { reg: 'FLT-04', model: 'Linde H25 counterbalance' },
  }

  const needWizard = wanted('report-new-evidence-phone') || wanted('report-new-riddor-phone')
  let onEvidence = false
  if (needWizard) {
    await attempt('report-new-evidence-phone', async () => {
      await open(page, '/reports/new')
      await wizardToEvidence(page, story)
      onEvidence = true
      await page.locator('input[aria-label="Choose files"]').setInputFiles([
        evidence.photo,
        evidence.closeup,
        evidence.pdf,
      ])
      await page.getByRole('button', { name: /^Remove Witness statement/ }).waitFor()
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('img')).every((i) => i.complete),
        null,
        { timeout: 15_000 },
      )
      await settle(page)
      await page.evaluate(() => window.scrollTo(0, 0))
      await capture(page, 'report-new-evidence-phone')
    })

    await attempt('report-new-riddor-phone', async () => {
      if (!onEvidence) {
        await open(page, '/reports/new')
        await wizardToEvidence(page, story)
      }
      await page.getByRole('button', { name: 'Continue' }).click()
      await page.getByRole('heading', { level: 2, name: 'RIDDOR triage' }).waitFor()
      await page.getByText('Yes, reportable', { exact: true }).click()
      await page.getByText('Over-7-day incapacitation of a worker', { exact: true }).click()
      await page.getByText('This must be filed on the statutory RIDDOR form').waitFor()
      await settle(page)
      await scrollUnderTopbar(page, page.getByRole('heading', { level: 2, name: 'RIDDOR triage' }), 12)
      await capture(page, 'report-new-riddor-phone')
    })
  }

  await context.close()
}

/**
 * Offline on a phone with the demo cloud (an in-memory remote that exercises
 * the real outbox). `setOffline` flips navigator.onLine, which is what the
 * product's sync engine and offline banner read; the dev server has no
 * service worker, so page code is still served through the route handler
 * (Playwright fetches it Node-side) and the wizard can hand over to the new
 * report's page. The record and its Pending sync state are the product's own.
 */
async function offlineFlow(browser) {
  if (!wanted('pending-sync-phone')) return
  const context = await phoneContext(browser)
  await context.addInitScript(() => {
    window.localStorage.setItem('jobsafe.store', 'demo-cloud')
  })
  const state = { offline: false }
  await context.route('**/*', async (route) => {
    if (!state.offline) return route.continue()
    try {
      const res = await route.fetch()
      return route.fulfill({ response: res })
    } catch {
      return route.abort('internetdisconnected')
    }
  })
  const page = await context.newPage()
  page.setDefaultTimeout(45_000)

  await attempt('pending-sync-phone', async () => {
    await open(page, '/reports/new')
    await page.getByRole('heading', { level: 2, name: 'Incident details' }).waitFor()
    await page.getByTestId('sync-status').first().waitFor()
    await page
      .locator('[data-testid="sync-status"][data-tone="ok"]')
      .first()
      .waitFor({ timeout: 30_000 })

    state.offline = true
    await context.setOffline(true)
    await page.getByTestId('offline-banner').waitFor()

    await page.getByText('Near miss', { exact: true }).click()
    await page.getByText('Low', { exact: true }).click()
    await page.getByLabel('Report title').fill('Trailer chock missing at Bay 4')
    await page
      .getByLabel('What happened')
      .fill(
        'Trailer on Bay 4 found without a wheel chock before unloading started. Chocked before the FLT went on. Loader reminded of the docking checklist.',
      )
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('combobox', { name: /^Depot/ }).selectOption('WLV')
    await page.getByLabel('Area within depot').fill('Bay 4')
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByText('No, not reportable', { exact: true }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('heading', { level: 2, name: 'Review & submit' }).waitFor()
    await page.getByRole('button', { name: 'Submit report' }).click()

    let reached = false
    try {
      await page.waitForURL(/\/reports\/\d{2}-\d{3,}$/, { timeout: 30_000 })
      await page.getByTestId('sync-pill').first().waitFor({ timeout: 20_000 })
      reached = true
    } catch (e) {
      log(`pending-sync: new-report hand-over failed offline (${e?.message?.split('\n')[0]}); falling back to an offline edit`)
    }
    if (!reached) {
      // Fallback: edit a seeded report offline (a comment) so it shows Pending sync.
      state.offline = false
      await context.setOffline(false)
      await open(page, '/reports/inc_a')
      await page.getByRole('heading', { level: 1, name: /Reversing manoeuvre/ }).waitFor()
      await page.locator('[data-testid="sync-status"][data-tone="ok"]').first().waitFor({ timeout: 30_000 })
      state.offline = true
      await context.setOffline(true)
      await page.getByTestId('offline-banner').waitFor()
      await page.getByLabel('Add a comment').fill('Banksman re-briefed; walkway markings repainted this afternoon.')
      await page.getByRole('button', { name: 'Send' }).click()
      await page.getByTestId('sync-pill').first().waitFor({ timeout: 20_000 })
    }
    await settle(page)
    await page.evaluate(() => window.scrollTo(0, 0))
    await capture(page, 'pending-sync-phone')
  })

  await context.close()
}

/* ── export ───────────────────────────────────────────────────────────────── */

async function exportImage(r) {
  mkdirSync(OUT, { recursive: true })
  const webp = join(OUT, `${r.id}.webp`)
  const avif = join(OUT, `${r.id}.avif`)
  await sharp(r.png).webp({ quality: 80, effort: 5 }).toFile(webp)
  await sharp(r.png).avif({ quality: 55, effort: 6 }).toFile(avif)
  return { webp, avif }
}

/** Exports every supplied still through the same WebP + AVIF pipeline. */
async function exportStatic() {
  mkdirSync(OUT, { recursive: true })
  for (const [id, still] of Object.entries(STATIC)) {
    if (!wanted(id)) continue
    if (!existsSync(still.source)) throw new Error(`Supplied still missing: ${still.source}`)
    const meta = await sharp(still.source).metadata()
    log(`static ${id} ← ${still.source.slice(ROOT.length + 1)} (${meta.width}×${meta.height})`)
    await exportImage({ id, png: still.source })
  }
}

async function manifestFromDisk() {
  const rows = []
  const missing = []
  for (const id of IDS) {
    const webp = join(OUT, `${id}.webp`)
    const avif = join(OUT, `${id}.avif`)
    if (!existsSync(webp) || !existsSync(avif)) {
      missing.push(id)
      continue
    }
    const meta = await sharp(webp).metadata()
    rows.push({
      id,
      kind: META[id].kind,
      width: meta.width,
      height: meta.height,
      webp,
      avif,
      alt: META[id].alt,
      caption: META[id].caption,
    })
  }
  return { rows, missing }
}

function writeManifest(rows) {
  const q = (s) => JSON.stringify(s)
  const rel = (p) => '/' + p.slice(resolve(ROOT, 'public').length + 1).replaceAll('\\', '/')
  const lines = [
    '// GENERATED by scripts/capture-product.mjs — do not edit by hand.',
    '// Edit the alt text and captions in the script (ALT, STATIC), then re-run:',
    '//   node scripts/capture-product.mjs --ts-only',
    '// Every image is the real product: driven captures from the jobsafe demo',
    '// seed, plus the supplied stills under assets/product-source/.',
    '',
    'export interface ProductImage {',
    '  readonly id: string',
    '  readonly webp: string',
    '  readonly avif: string',
    '  readonly width: number',
    '  readonly height: number',
    "  readonly kind: 'desktop' | 'phone'",
    '  readonly alt: string',
    '  readonly caption: string',
    '}',
    '',
    'export const PRODUCT_IMAGE_IDS = [',
    ...rows.map((r) => `  ${q(r.id)},`),
    '] as const',
    '',
    'export type ProductImageId = (typeof PRODUCT_IMAGE_IDS)[number]',
    '',
    'export const PRODUCT_IMAGES: Record<ProductImageId, ProductImage> = {',
    ...rows.flatMap((r) => [
      `  ${q(r.id)}: {`,
      `    id: ${q(r.id)},`,
      `    webp: ${q(rel(r.webp))},`,
      `    avif: ${q(rel(r.avif))},`,
      `    width: ${r.width},`,
      `    height: ${r.height},`,
      `    kind: ${q(r.kind)},`,
      `    alt: ${q(r.alt)},`,
      `    caption: ${q(r.caption)},`,
      '  },',
    ]),
    '}',
    '',
  ]
  writeFileSync(TS_OUT, lines.join('\n'))
}

function printTable(rows) {
  const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`
  const pad = (s, n) => String(s).padEnd(n)
  console.log('')
  console.log(pad('id', 28) + pad('kind', 9) + pad('size', 12) + pad('webp', 10) + 'avif')
  console.log('-'.repeat(70))
  for (const r of rows) {
    console.log(
      pad(r.id, 28) + pad(r.kind, 9) + pad(`${r.width}×${r.height}`, 12) + pad(kb(r.webp), 10) + kb(r.avif),
    )
  }
  console.log('')
}

/* ── main ─────────────────────────────────────────────────────────────────── */

async function main() {
  for (const id of ONLY) if (!IDS.includes(id)) throw new Error(`Unknown id in --only: ${id}`)

  if (STATIC_ONLY) {
    await exportStatic()
  } else if (!TS_ONLY) {
    await exportStatic()
    TMP = mkdtempSync(join(tmpdir(), 'jobsafe-capture-'))
    log(`base ${BASE} → ${OUT} (temp ${TMP})`)
    const ping = await fetch(BASE + '/').catch(() => null)
    if (!ping || !ping.ok) throw new Error(`jobsafe is not answering at ${BASE} (${ping?.status ?? 'no response'})`)

    const evidence = await buildEvidence()
    const browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    })
    try {
      await desktopFlow(browser, evidence)
      await phoneFlow(browser, evidence)
      await offlineFlow(browser)
    } finally {
      await browser.close()
    }

    const captured = [...results.values()]
    log(`exporting ${captured.length} capture${captured.length === 1 ? '' : 's'}…`)
    const batch = 3
    for (let i = 0; i < captured.length; i += batch) {
      await Promise.all(captured.slice(i, i + batch).map((r) => exportImage(r)))
    }
    if (KEEP_PNG) log(`lossless captures kept in ${TMP}`)
    else rmSync(TMP, { recursive: true, force: true })
  }

  const { rows, missing } = await manifestFromDisk()
  printTable(rows)
  for (const f of failures) console.error(`[capture] ${f.id}: ${f.error?.stack ?? f.error}`)
  if (missing.length) console.error(`[capture] missing exports for: ${missing.join(', ')}`)
  if (failures.length || missing.length) {
    console.error(`[capture] ${failures.length} state(s) could not be captured; manifest not written`)
    process.exit(1)
  }
  writeManifest(rows)
  log(`wrote ${TS_OUT} (${rows.length} images)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
