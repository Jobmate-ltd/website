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
// controls, and the progress notes, document versions, checklist answers and
// signature in the later states are entered through the product's own
// controls too. Alt text lives in ALT below; edit it here, never in the .ts.
//
// Not captured because the product has no such screen: an evidence lightbox
// (report evidence tiles are static thumbnails; nothing opens on click). Note
// also that document-versions-desktop shows a file at v2 after the same name
// was uploaded twice; the product bumps the version number in place and has
// no version-history list to capture.
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
  'actions-list-desktop': {
    kind: 'desktop',
    alt: 'jobsafe actions register in list view on the Overdue tab: a stat strip for open, overdue, high-priority, in-progress and closed actions, an overdue warning banner, the Open, Overdue, Assigned to me, Closed and All tabs with counts, search and Filters, the List and Board toggle with Export and Raise action, and a table of the two overdue actions with mono ids ACT-3070 and ACT-3038, owner avatars, site, High priority pills, due dates marked 6d and 2d overdue, red Overdue status pills and a Complete quick action.',
    caption: 'Overdue is worked out from the due date; every action carries an owner and a deadline.',
  },
  'action-detail-desktop': {
    kind: 'desktop',
    alt: 'jobsafe action ACT-3041, Replace damaged racking upright at Bay 14, open in a drawer over the actions register: an In progress status picker with High priority and Due in 4 days pills, inline controls for the owner Dan Rowley, priority and due date, then site, department, raised by and created rows, the description, two timestamped progress notes from Claire Mensah with the Add a progress note box under them, and Mark complete and Delete in the footer.',
    caption: 'Status, owner and due date change inline; every note is stamped on the timeline.',
  },
  'fleet-list-desktop': {
    kind: 'desktop',
    alt: 'jobsafe fleet register in list view: a stat strip for assets on register, in service, off road, statutory date passed and due within 30 days, a warning banner for the passed statutory date, and a table of nine assets with mono ids like FLT-204, HGV-118 and MEW-302, asset type, site, keeper, MOT, service and inspection dates, with overdue dates in red (a LOLER inspection 9 days overdue, a service 4 days overdue), due-soon dates in amber and In service, Off road or Service due status pills.',
    caption: 'Every vehicle and item of plant with its statutory dates, flagged before and after they lapse.',
  },
  'asset-detail-desktop': {
    kind: 'desktop',
    alt: 'jobsafe asset HGV-122, a Scania R 450 tractor unit BX25 TRD at Birmingham, open in a drawer over the fleet register: Service due, HGV tractor unit and 61,480 km pills, Detail and History tabs (two history entries), compliance rows for MOT / plating, road tax, insurance, next service in red as 4 days overdue, next safety inspection in amber as due in 20 days and the 6-weekly inspection cycle, then registration, make and model, site, department, keeper Adeola Adebayo, acquired date and the editable odometer, with the status select, Raise action and Remove in the footer.',
    caption: 'MOT, tax, insurance, service and inspection dates on one record, with its history one tab away.',
  },
  'course-matrix-desktop': {
    kind: 'desktop',
    alt: 'jobsafe course and refresher matrix: a stat strip for network compliance, expired, expiring within 90 days, required but not held and courses tracked, a banner naming nine work-stopping competence gaps, the legend for Valid, Expiring, Expired, Booked, Not held and Not required cells, and the matrix of employees against Core H&S, Plant & operations, Driving & transport and Specialist course groups, critical courses marked with a warning, expiry dates in green cells, days left in amber, days expired in red and required courses not held shown as a red cross.',
    caption: 'Valid, expiring, expired, booked, not held or not required, for every person and course.',
  },
  'development-plan-desktop': {
    kind: 'desktop',
    alt: 'jobsafe competency drawer for Adeola Adebayo, Supervisor, over the training matrix: current capability 70% against a target of 80%, a capability gap of 4 and 6 of 10 capable, the generated individual development plan listing five skills to take from their current level to target (working at height, fire warden, first aid at work, asbestos awareness and toolbox talk sign-off) with a priority line under each, the skill breakdown of current against target levels, the start of the outstanding and overdue list, and Generate development plan and Export record in the footer.',
    caption: 'One click turns the gaps in the matrix into a development plan for that person.',
  },
  'documents-tree-desktop': {
    kind: 'desktop',
    alt: 'jobsafe document control: a note that you are signed in as Claire Mensah at access level 4 and folders above your level are locked, the folder tree with Policies and statements, Fleet and compliance, Risk assessments with Birmingham, Leeds and Wolverhampton sub-folders, Training and competence, Permits and contractors with Competence packs, and RIDDOR and investigations, each with its document count; the Policies and statements folder open showing 4 files, min level 1 and a Level 1+ access select, and the file list with PDF and DOC kind tags, version, size, uploader and date on each line (the seeded files are metadata only, shown with a No file chip), Current or Signed tags and a menu per file.',
    caption: 'Folders carry a minimum access level; files carry their version, tag and uploader.',
  },
  'document-versions-desktop': {
    kind: 'desktop',
    alt: 'jobsafe document control with the Fleet and compliance folder open at min level 2: a LOLER thorough examination PDF uploaded twice through the Upload button is listed once as v2 with its size, uploader Claire Mensah, the upload date and a download button, above the seeded LOLER schedule spreadsheet at v6 and the operator licence PDF at v1, each tagged Current and marked metadata only with a No file chip.',
    caption: 'Upload a file with the same name and it becomes the next version, not a duplicate.',
  },
  'dashboard-trend-desktop': {
    kind: 'desktop',
    alt: 'jobsafe dashboard filtered to the Birmingham depot, scrolled to the lower half: the last two reports of the live incident feed, the foot of the reports-by-category card, the hotspots by site card listing Birmingham, Bristol, Glasgow, Leeds and Wolverhampton with stacked category bars and totals for the last 30 days and Birmingham highlighted as the selected filter, and the incidents over time card below showing the last 12 weeks by category for Birmingham as a line chart with HSSE, near miss, incident and other legend counts, pins on the high-severity events and a Weekly or Monthly toggle.',
    caption: 'Pick a depot in the hotspots and the whole dashboard, 12-week trend included, follows it.',
  },
  'bowtie-barrier-desktop': {
    kind: 'desktop',
    alt: 'jobsafe bowtie barrier drawer for Aisle-end convex mirrors, a preventive barrier on the threat Pedestrian walks into the FLT operating aisle, over the RA-101 worksheet: the barrier name field, the barrier type select reading Hardware, passive, the current effectiveness choice of Effective, Degraded, Failed or Not in place with Degraded selected, a barrier credit of 0.50 explained as type weight times effectiveness, a note field, one escalation factor, Mirrors dirty or misaligned, with its control Added to the weekly warehouse inspection, and Save barrier, Raise barrier action and delete in the footer.',
    caption: 'Each barrier has a type, an honest effectiveness rating and the factors that defeat it.',
  },
  'bowtie-audit-desktop': {
    kind: 'desktop',
    alt: 'jobsafe bowtie barrier audit for RA-101 under the barrier diagram: the barrier type weighting legend (hardware passive ×1.25, hardware active ×1, hardware + human ×0.7, human procedural ×0.5, continuous ×0.85), the effectiveness multiplier legend (Effective ×1, Degraded ×0.4, Failed ×0, Not in place ×0), then the audit card reading 4 critical, 4 to watch and 2 to note with a Raise 8 barrier actions button and a list naming each threat or consequence with the barrier that is not in place, the barrier that is degraded, or the escalation factor that has no control.',
    caption: 'The audit lists every missing, failed or degraded barrier and raises an action for each.',
  },
  'contractor-detail-desktop': {
    kind: 'desktop',
    alt: 'jobsafe contractor record for Clyde Industrial Cleaning, C04, tank and drainage cleaning, open in a drawer over the contractors and competence tab: Suspended and 4 issues pills, a banner reading Not competent to receive a permit that lists the suspension and the expired employer liability insurance, RAMS and accreditation, competence evidence rows for employer liability, RAMS, accreditation and last audit with Expired or Within 12 months pills, the company contact, phone and operatives, permit history with PTW-0450 Interceptor tank clean, yard drainage marked Blocked, and the status select and Chase pack button in the footer.',
    caption: 'Insurance, RAMS, accreditation and audit dates decide whether a contractor can hold a permit.',
  },
  'checklist-templates-desktop': {
    kind: 'desktop',
    alt: 'jobsafe checklists on the Templates tab: a stat strip for completed today, completed this week, failed this week, in progress and templates, search and Filters, and a table of six templates with mono ids and their basis: Forklift pre-use inspection (PUWER 1998, L117 ACOP), HGV daily walkaround check (DVSA daily walkaround, Guide to maintaining roadworthiness), Hot works permit close-out, MEWP pre-use inspection (IPAF pre-use, LOLER 1998), Site induction sign-off and Weekly fire warden walk-round, each with category, frequency, site, item count, when and by whom it was last completed and a Start button.',
    caption: 'DVSA walkaround, forklift and MEWP pre-use, fire warden and induction checks, ready to run.',
  },
  'walkaround-fail-phone': {
    kind: 'phone',
    alt: 'jobsafe HGV daily walkaround check running on a phone, with the completion reference and Discard in the sticky bar: item 2, tyres and wheels, marked Fail on its Pass, Fail and N/A buttons, the required Describe the defect box filled in about missing wheel-nut indicators and a loose nut, the note that a corrective action is raised from this description, an attached photo thumbnail with its remove control beside Add photo, then items 3 and 4 marked Pass with Add note and Add photo, and the sticky footer reading 4/8, 1 failed, Saved between Save & exit and Sign & submit.',
    caption: 'Pass, fail or N/A each item; a fail needs a note and raises an action on submit.',
  },
  'checklist-signoff-phone': {
    kind: 'phone',
    alt: 'jobsafe sign-off sheet for the HGV daily walkaround check on a phone, Wolverhampton, WV24 KLM Volvo FH 460: 6 passed or answered, 1 failed and 1 action to raise, the failed tyres and wheels item listed, Signed by Claire Mensah with a Draw or Type choice, a signature drawn on the pad with Undo and Clear under it, the line that by signing you confirm the checks were carried out as recorded, and Back and Submit with defects buttons.',
    caption: 'Sign on the glass or type your name; the failed item becomes an action due in seven days.',
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

/**
 * Drops the focus ring a drawer puts on its first control and parks the
 * pointer on an empty stretch of the topbar, so no hover or focus style
 * lands in the frame. Only for states whose auto-focus is incidental.
 */
async function park(page) {
  await page.evaluate(() => document.activeElement?.blur?.())
  await page.mouse.move(900, 28)
  await page.waitForTimeout(150)
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

/**
 * Real evidence files: a photo, a close-up crop of it, a one-page PDF, and a
 * LOLER report PDF with the photo embedded (uploaded twice to make a version).
 */
async function buildEvidence() {
  const dir = join(TMP, 'evidence')
  mkdirSync(dir, { recursive: true })
  const photo = join(dir, 'IMG_2041.jpg')
  const closeup = join(dir, 'IMG_2042.jpg')
  const pdf = join(dir, 'Witness statement.pdf')
  const loler = join(dir, 'LOLER thorough examination FLT-204.pdf')
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
  const jpeg = await sharp(SEED_PHOTO).resize({ width: 1200 }).jpeg({ quality: 80 }).toBuffer()
  const jm = await sharp(jpeg).metadata()
  writeFileSync(
    loler,
    minimalPdf(
      [
        'Report of thorough examination, LOLER 1998 reg. 9',
        'North Star Logistics Ltd, Leeds depot',
        'Equipment: FLT-204, Linde H30D counterbalance, plant no. FLT204',
        'Examined in service; no defects found that require the truck to be taken out of use.',
        'Next thorough examination due within 12 months.',
      ],
      { jpeg, width: jm.width, height: jm.height },
    ),
  )
  return { photo, closeup, pdf, loler }
}

/** A one-page PDF of `lines` in Helvetica, optionally with a JPEG placed under the text. */
function minimalPdf(lines, image) {
  const esc = (s) => s.replace(/[\\()]/g, (c) => '\\' + c)
  let content =
    'BT /F1 12 Tf 72 760 Td 16 TL ' + lines.map((l) => `(${esc(l)}) Tj T*`).join(' ') + ' ET'
  if (image) {
    const w = 451
    const h = Math.round((w * image.height) / image.width)
    content += ` q ${w} 0 0 ${h} 72 ${Math.max(40, 730 - lines.length * 16 - h)} cm /Im1 Do Q`
  }
  const objs = [
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >>${image ? ' /XObject << /Im1 6 0 R >>' : ''} >> >>`,
    ),
    Buffer.from(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`),
    Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    ...(image
      ? [
          Buffer.concat([
            Buffer.from(
              `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.jpeg.length} >>\nstream\n`,
            ),
            image.jpeg,
            Buffer.from('\nendstream'),
          ]),
        ]
      : []),
  ]
  const parts = [Buffer.from('%PDF-1.4\n', 'latin1')]
  let length = parts[0].length
  const offsets = []
  objs.forEach((o, i) => {
    offsets.push(length)
    const chunk = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), o, Buffer.from('\nendobj\n')])
    parts.push(chunk)
    length += chunk.length
  })
  parts.push(
    Buffer.from(
      `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` +
        offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('') +
        `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${length}\n%%EOF\n`,
      'latin1',
    ),
  )
  return Buffer.concat(parts)
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

  await attempt('actions-list-desktop', async () => {
    await open(page, '/actions?tab=overdue')
    await page.getByRole('tab', { name: /^Overdue/, selected: true }).waitFor()
    await page.getByRole('radio', { name: 'List' }).click()
    await page.getByRole('table', { name: 'Actions, overdue' }).waitFor()
    await settle(page)
    await capture(page, 'actions-list-desktop')
  })

  await attempt('action-detail-desktop', async () => {
    // ACT-3041: in progress, high priority, due in 4 days. The seed gives open actions no notes,
    // so two are entered through the drawer's own "Add a progress note" control first.
    await open(page, '/actions?open=ACT-3041')
    const drawer = page.getByRole('dialog', { name: /Replace damaged racking upright/ })
    await drawer.waitFor()
    for (const text of [
      'Racking contractor booked for Thursday. Bay 14 run cordoned off and isolated in the meantime.',
      'Upright replaced and run re-inspected; awaiting the SEMA report before reloading.',
    ]) {
      await drawer.getByLabel('Add a progress note').fill(text)
      await drawer.getByRole('button', { name: 'Add', exact: true }).click()
      await drawer.getByText(text).waitFor()
      // The mutation clears the box on success; wait for that so the next fill is not wiped.
      await page.waitForFunction(
        () => document.querySelector('textarea[aria-label="Add a progress note"]')?.value === '',
      )
    }
    await settle(page)
    await capture(page, 'action-detail-desktop')
    await page.keyboard.press('Escape')
  })

  await attempt('fleet-list-desktop', async () => {
    await open(page, '/fleet')
    await page.getByRole('table', { name: 'Fleet register' }).waitFor()
    await page.getByText(/^\d+d overdue$/).first().waitFor()
    await capture(page, 'fleet-list-desktop')
  })

  await attempt('asset-detail-desktop', async () => {
    // HGV-122: service overdue, inspection due soon, keeper, odometer and two history entries.
    await open(page, '/fleet?open=HGV-122')
    const drawer = page.getByRole('dialog', { name: /^HGV-122/ })
    await drawer.getByRole('tab', { name: 'Detail', selected: true }).waitFor()
    await drawer.getByText('Next safety inspection').waitFor()
    await settle(page)
    await park(page)
    await capture(page, 'asset-detail-desktop')
    await page.keyboard.press('Escape')
  })

  await attempt('course-matrix-desktop', async () => {
    await open(page, '/training/courses')
    await page.getByRole('note', { name: 'Cell legend' }).waitFor()
    await page.getByRole('table', { name: /^Training matrix/ }).waitFor()
    await park(page)
    await capture(page, 'course-matrix-desktop')
  })

  await attempt('development-plan-desktop', async () => {
    await open(page, '/training')
    await page.getByRole('heading', { level: 1 }).waitFor()
    // Row headers are buttons that open the person's drawer; Adeola Adebayo has five gaps to plan.
    await page.locator('th[scope="row"] button').filter({ hasText: 'Adeola Adebayo' }).first().click()
    const drawer = page.getByRole('dialog', { name: 'Adeola Adebayo' })
    await drawer.getByRole('button', { name: 'Generate development plan' }).click()
    await drawer.getByText(/Individual development plan, Adeola Adebayo/).waitFor()
    await settle(page)
    await capture(page, 'development-plan-desktop')
    await page.keyboard.press('Escape')
  })

  await attempt('documents-tree-desktop', async () => {
    await open(page, '/documents')
    const folders = page.getByRole('navigation', { name: 'Folders' })
    await folders.getByRole('button', { name: /^Policies and statements/ }).click()
    await page.getByRole('combobox', { name: 'Minimum access level for Policies and statements' }).waitFor()
    await page.getByRole('list', { name: 'Documents' }).getByRole('listitem').first().waitFor()
    await settle(page)
    await capture(page, 'documents-tree-desktop')
  })

  await attempt('document-versions-desktop', async () => {
    if (!(await page.getByRole('navigation', { name: 'Folders' }).count())) await open(page, '/documents')
    const folders = page.getByRole('navigation', { name: 'Folders' })
    await folders.getByRole('button', { name: /^Fleet and compliance/ }).click()
    await page.getByRole('combobox', { name: 'Minimum access level for Fleet and compliance' }).waitFor()
    // The same file twice through the product's Upload control: the second upload becomes v2.
    const name = 'LOLER thorough examination FLT-204.pdf'
    const row = page.getByRole('list', { name: 'Documents' }).getByRole('listitem').filter({ hasText: name })
    const input = page.locator('input[aria-label="Upload files"]')
    await input.setInputFiles(evidence.loler)
    await row.getByText(/^v1 ·/).waitFor()
    await input.setInputFiles(evidence.loler)
    await row.getByText(/^v2 ·/).waitFor()
    await row.getByRole('link', { name: `Download ${name}` }).waitFor()
    await settle(page)
    await capture(page, 'document-versions-desktop')
  })

  await attempt('dashboard-trend-desktop', async () => {
    // Hotspots plus the trend span ~1000 CSS px, so like report-detail this renders at 1760×1100
    // CSS with a matching scale factor (still 2880×1800 output). Its own context also keeps the
    // Birmingham depot filter, a per-device preference, away from the other captures.
    const W = 1760
    const H = 1100
    const ctx = await browser.newContext({
      viewport: { width: W, height: H },
      deviceScaleFactor: (DESKTOP.width * DESKTOP.scale) / W,
      locale: 'en-GB',
      timezoneId: 'Europe/London',
      colorScheme: 'light',
      reducedMotion: 'reduce',
    })
    try {
      const p = await ctx.newPage()
      p.setDefaultTimeout(45_000)
      await open(p, '/')
      await p.getByRole('heading', { level: 1, name: 'Dashboard' }).waitFor()
      await p.getByRole('group', { name: 'Sites' }).getByRole('button', { name: /Birmingham/ }).click()
      await p.getByRole('button', { name: /^Site filter: Birmingham/ }).waitFor()
      await settle(p)
      await scrollUnderTopbar(p, p.getByRole('heading', { name: 'Hotspots by site' }), 20)
      const chart = await p.getByRole('region', { name: /^Incidents over time chart/ }).boundingBox()
      if (!chart || chart.y + chart.height > H) {
        throw new Error(`trend chart not in frame (bottom at y=${chart ? chart.y + chart.height : 'n/a'})`)
      }
      await capture(p, 'dashboard-trend-desktop', {
        clip: { x: 0, y: 0, width: W, height: H },
        size: { width: DESKTOP.width * DESKTOP.scale, height: DESKTOP.height * DESKTOP.scale },
      })
    } finally {
      await ctx.close()
    }
  })

  const bowtie = async () => {
    const dialog = page.getByRole('dialog')
    if (await dialog.count()) {
      await page.keyboard.press('Escape')
      await dialog.first().waitFor({ state: 'detached' }).catch(() => {})
    }
    if (!(await page.getByRole('heading', { name: 'Barrier diagram' }).count())) {
      await worksheet()
      await page.getByRole('radio', { name: 'Bowtie' }).click()
      await page.getByRole('heading', { name: 'Barrier diagram' }).waitFor()
    }
  }

  await attempt('bowtie-barrier-desktop', async () => {
    await bowtie()
    // A degraded passive-hardware barrier with one controlled escalation factor.
    await page.getByRole('button', { name: /^Aisle-end convex mirrors:/ }).click()
    const drawer = page.getByRole('dialog', { name: 'Barrier', exact: true })
    await drawer.getByRole('radiogroup', { name: 'Current effectiveness' }).waitFor()
    await drawer.getByRole('textbox', { name: 'Escalation factor 1', exact: true }).waitFor()
    await settle(page)
    await capture(page, 'bowtie-barrier-desktop')
    await page.keyboard.press('Escape')
    await drawer.waitFor({ state: 'detached' })
  })

  await attempt('bowtie-audit-desktop', async () => {
    await bowtie()
    await page.getByRole('heading', { name: 'Barrier audit' }).waitFor()
    // Frame from the weighting legend so the audit list has its key above it.
    await scrollUnderTopbar(page, page.getByText('Barrier type, weighting', { exact: true }), 40)
    await settle(page)
    await capture(page, 'bowtie-audit-desktop')
  })

  await attempt('contractor-detail-desktop', async () => {
    // C04: suspended, every evidence date expired, one blocked permit in its history.
    await open(page, '/permits?contractor=C04')
    const drawer = page.getByRole('dialog', { name: 'Clyde Industrial Cleaning' })
    await drawer.getByRole('button', { name: 'Chase pack' }).waitFor()
    await drawer.getByRole('list', { name: 'Permits for this contractor' }).waitFor()
    await settle(page)
    await park(page)
    await capture(page, 'contractor-detail-desktop')
    await page.keyboard.press('Escape')
  })

  await attempt('checklist-templates-desktop', async () => {
    await open(page, '/checklists')
    await page.getByRole('table', { name: 'Checklist templates' }).waitFor()
    await page.getByRole('link', { name: 'Start HGV daily walkaround check' }).waitFor()
    await capture(page, 'checklist-templates-desktop')
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

  /* DVSA walkaround (CL-001) on a phone: depot and vehicle picked, item 2 failed with a defect
     note and a real photo through the item's own control, then the sign-off sheet signed on
     the pad. The completion, its autosave and the defect count are the product's own. */
  const items = page.getByRole('list', { name: 'Checklist items' }).getByRole('listitem')
  const walkaroundToFail = async () => {
    await open(page, '/checklists/CL-001')
    await items.first().waitFor()
    await page.getByRole('combobox', { name: /^Depot \/ site/ }).selectOption('WLV')
    await page.getByRole('combobox', { name: /^HGV being checked/ }).selectOption('HGV-118')
    await items.nth(0).getByRole('radio', { name: 'Pass' }).click()
    await items.nth(1).getByRole('radio', { name: 'Fail' }).click()
    await items
      .nth(1)
      .getByLabel('Describe the defect')
      .fill(
        'Nearside rear wheel: two wheel-nut indicators missing and one nut visibly loose. Not to be driven until torqued and re-checked.',
      )
    await items.nth(1).locator('input[type="file"]').setInputFiles(evidence.closeup)
    await items.nth(1).getByRole('img', { name: /^Photo 1 for/ }).waitFor()
    await items.nth(2).getByRole('radio', { name: 'Pass' }).click()
    await items.nth(3).getByRole('radio', { name: 'Pass' }).click()
    await page.getByRole('region', { name: 'Checklist actions' }).getByText(/4\/8 · 1 failed · Saved$/).waitFor()
  }
  let onWalkaround = false

  await attempt('walkaround-fail-phone', async () => {
    await walkaroundToFail()
    onWalkaround = true
    await settle(page)
    await scrollUnderTopbar(page, items.nth(1), 8)
    await capture(page, 'walkaround-fail-phone')
  })

  await attempt('checklist-signoff-phone', async () => {
    if (!onWalkaround) await walkaroundToFail()
    await items.nth(4).getByRole('radio', { name: 'Pass' }).click()
    await items.nth(5).getByRole('radio', { name: 'Yes' }).click()
    await items.nth(6).getByRole('spinbutton').fill('148412')
    await page.getByRole('button', { name: 'Sign & submit' }).click()
    const sheet = page.getByRole('dialog', { name: 'Sign off this checklist' })
    await sheet.waitFor()
    // Sign on the pad with pointer strokes.
    const box = await sheet.getByRole('img', { name: /^Signed by .*: empty/ }).boundingBox()
    if (!box) throw new Error('signature pad not visible')
    const pts = [
      [0.1, 0.72], [0.18, 0.3], [0.27, 0.68], [0.35, 0.34], [0.44, 0.7],
      [0.53, 0.42], [0.62, 0.62], [0.72, 0.36], [0.82, 0.6], [0.9, 0.44],
    ]
    await page.mouse.move(box.x + box.width * pts[0][0], box.y + box.height * pts[0][1])
    await page.mouse.down()
    for (const [fx, fy] of pts.slice(1)) {
      await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 8 })
    }
    await page.mouse.up()
    await sheet.getByRole('img', { name: /^Signed by .*: signed$/ }).waitFor()
    await sheet.getByRole('button', { name: 'Submit with defects' }).waitFor()
    await settle(page)
    await capture(page, 'checklist-signoff-phone')
  })

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
