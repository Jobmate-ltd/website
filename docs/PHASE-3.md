# Phase 3: modules, industries, free tools and comparisons

Built 25/09/2026 on top of Phase 2 (`main` at `0fd84b7`). Everything here
sits behind `NEXT_PUBLIC_PLATFORM_LAUNCH`; the comparison pages also sit
behind `NEXT_PUBLIC_COMPARE_PAGES`. With the launch flag off, production
renders exactly as after Phase 2: the four industry pages that existed keep
their Phase 1 page (`app/industries/<sector>/phase-1.tsx`, moved verbatim)
and every new route is a 404 through the same rewrite that hides the Phase 2
routes.

## 1. The inputs, and what each `no` did

The brief left every input in square brackets. A bracketed value is not a
value, so each was read as `no` and checked against the product code on
25/09/2026 (`Jobmate-ltd/jobsafe` at `4e7a43c`). They are typed in
`lib/brand.ts` as `PHASE_3_INPUTS`; flipping one is a one-line change and
the page, the menu item and the sitemap entry follow.

| Input | Value | Evidence in the product | What the site does while `false` |
| --- | --- | --- | --- |
| `CHECKLIST_BUILDER_SHIPPED` | `false` | Checklist templates are seeded (`src/lib/domain/checklist.ts`); there is no screen or route that creates or edits a template | `/platform/checklists` is built and 404 (`gate: 'checklistBuilderShipped'`), out of the menu, the footer, the sitemap and the link registry; the Checklists module shows "Expanding" with no link |
| `CONTRACTOR_CRUD_SHIPPED` | `false` | Contractor records are seeded (`src/lib/domain/contractor/`); the drawer edits status and raises "Chase pack" but nothing creates a contractor | `/platform/contractors` likewise; the permits page and the FAQs say "adding new contractor records from inside the app is not available yet" |
| `EMAIL_ALERTS_SHIPPED` | `false` | `src/lib/domain/notifications/` writes in-app notifications; no mail transport exists | Every page says owners see overdue items in the in-app bell; nothing says "emailed" |
| `CSV_IMPORT_SHIPPED` | `false` | Every register exports to CSV; no import route exists | The comparisons' "How to switch" is titled "Talk to us about moving your records"; the homepage FAQ keeps "Can we import our records? Not yet." |
| `PDF_EXPORT_SHIPPED` | `false` | "Export PDF" on a report is `window.print()`; nothing generates a PDF | No page offers a PDF; the RIDDOR checker has no email-a-PDF option |
| `PUBLISH_COMPARE_PAGES` | `false` | A sign-off, not a product fact | The four `/compare` routes are built and 404 until `NEXT_PUBLIC_COMPARE_PAGES=true`; the Compare menu column and footer column render only then |

## 2. What was built

### Part A: module pages

Seven module pages and the bowtie page, all on the Phase 2 template
(`components/platform/module-page.tsx`), which now also renders a "Built
for" row (the industry pages that lead with the module) and a "Try it free"
row (the tool that runs the module's logic). Content is in
`lib/platform-modules-phase-3.ts`; every fact comes from the brief's
per-page notes and was checked against the captured screens, and every
page carries a `doNotClaim` list that `test/industries.test.mjs` and
`test/platform.test.mjs` enforce.

| Page | Notes |
| --- | --- |
| `/platform/investigations` | Four-level ICAM on the report; similar past reports (rule-based); investigating needs level 2, sign-off level 3. Not claimed: 5-Whys, fishbone, machine learning. The product has no lightbox, so the evidence gallery is described as it is |
| `/platform/corrective-actions` | One register, seven sources; overdue worked out from the date; list or board; owners see overdue in the in-app bell |
| `/platform/fleet-compliance` | MOT, tax, insurance, service, inspection and LOLER dates; "do not use" past a statutory date; due within 30 days; the DVSA walkaround as a checklist whose fail raises an action. Not claimed: telematics, tachograph, O-licence, FORS, CLOCS |
| `/platform/training-competence` | Competency scores, role targets, course expiries at 90 days, critical courses that stop work, gaps that raise actions |
| `/platform/document-control` | Folder tree with access levels, same-name upload bumps the version in place (no version history, and the page does not claim one). Not claimed: review dates, approvals, read-and-sign, expiry reminders |
| `/platform/dashboards` | Four KPIs, live feed, hotspots by site, 12-week trend, a depot filter across the app. Not claimed: custom dashboards, TRIR, LTIFR, scheduled reports |
| `/platform/bowtie-analysis` | A view inside the risk assessment: five barrier types, Effective / Degraded / Failed / Not in place, escalation factors, residual score, barrier audit. Links both ways with `/platform/risk-assessments`; answers the three PAA questions |
| `/platform/checklists` | Built, gated on `checklistBuilderShipped` |
| `/platform/contractors` | Built, gated on `contractorCrudShipped` |

The Platform menu, the `/platform` index (a bowtie card under Prevent and
a free-tools row), the homepage Record/Resolve/Prevent tabs and the footer
link the new pages.

### Part B: industry pages

One template (`components/industries/industry-page.tsx`) and seven typed
content files in `lib/industries/`. Each page: the sector H1 from the
keyword map, a lead in the sector's words, a real screen, two CTAs; three
statistics (fewer where fewer verified) each printed with its source name,
year and checked date and kept with the verbatim quote in the content
file; six pains each linking the module that answers it; three screens
with sector captions; the legal framing with a source on every point;
two free tools; eight FAQs naming the regulation they answer (FAQPage from
the same array); the closing CTA. A templates slot is reserved for Phase 4.

| Page | Status | Facts (all checked 25/09/2026) |
| --- | --- | --- |
| `/industries/transport-logistics` | Rebuilt; H1 "Health and safety software for hauliers and depot operators" | 15 killed in transportation and storage 2025/26p; 30% of the sector's deaths struck by a moving vehicle (five-year average); 7,698 RIDDOR non-fatal injuries 2024/25p |
| `/industries/construction` | New; CDM 2015 as context only; CSCS cards as course records only | 25 deaths 2025/26p (average 37); fatal rate around 5× all industries; 3,726 RIDDOR non-fatal injuries, 41% specified |
| `/industries/field-services` | Rebuilt; "not a lone-worker alarm" kept; CHAS, SafeContractor and Constructionline named only as schemes | 583 killed in collisions involving driving for work 2025 (DfT); 31 worker deaths from falls from height 2025/26p; falls from height 8% of non-fatal injuries 2024/25 (all industries, stated) |
| `/industries/facilities-management` | New | Admin and support services 2,160 injuries per 100,000 workers vs 1,780; 9 killed 2025/26p and a rate 1.5 to 2.5× all industries; slips, trips and falls 30% of non-fatal injuries (all industries, stated) |
| `/industries/manufacturing-warehousing` | New | 18 killed in manufacturing 2025/26p; 8,853 RIDDOR non-fatal injuries 2024/25p; 1,107 contact with moving machinery (13%) |
| `/industries/healthcare` | Rebuilt as care, staff safety only; CQC Regulation 17 cited as the duty to keep records about staff and the management of the service | 255,000 with work-related ill health, 52% stress; acts of violence 29% of non-fatal injuries (3,211); 2,125 handling injuries (19%) |
| `/industries/window-door-fitters` | Rebuilt, best copy kept | Falls from height over half of construction deaths (average 19 a year); 736 falls from height 2024/25p, 513 specified; 41,000 with a musculoskeletal disorder, 2.0% vs 1.2% |

The full research table, with the sentence or table cell each figure comes
from, is in the PR description; the quotes are in the content files.
Sector definitions are stated on the page where HSE's series is broader
than the sector (care includes hospitals; FM is "admin and support
services"; glazing is inside construction).

Legal framing verified 25/09/2026: the Sentencing Council guideline in
force 1 February 2016 (turnover bands, offence range to £10 million);
HSWA 1974 sections 2, 3 and 37; CDM 2015; the Work at Height Regulations
2005; the Manual Handling Operations Regulations 1992; PUWER and LOLER
1998; the Regulatory Reform (Fire Safety) Order 2005; CQC Regulation 17
(records about staff and management, 17(2)(d)); HSE's lone working,
driving for work, workplace transport and violence pages; FORS and CLOCS
(named as schemes, jobsafe not accredited). Each point links its source.

### Part C: product logic and free tools

`lib/product-logic/` is generated by `scripts/sync-product-logic.mjs` from
the product repository (`src/lib/domain/riddor/knowledge.ts` whole;
`src/lib/domain/risk/scoring.ts` for `BANDS`, `LIKELIHOOD_SCALE`,
`SEVERITY_SCALE`, `HIERARCHY_DEFS`, `score`, `bandOf`; the enums and
calendar-date helpers they need), each file headed with the repository,
path and commit, with `SOURCE.json` as the manifest and `--check` for CI
once a product checkout is available. `test/product-logic.test.mjs`
mirrors the upstream tests case for case. See `docs/PRODUCT-LOGIC.md`.

| Tool | Notes |
| --- | --- |
| `/tools/riddor-checker` | One question at a time through `triage()`; the verdict, the reasons, what to do, the deadline from `riddorDeadline()` and a date picker, the HSE contact from `HSE_CONTACT`; answers in the URL; keyboard-only with `aria-live` announcements; "What to record" from `RECORD_REQUIREMENTS`; HowTo and FAQPage; the customer submits to HSE and HSE's page is linked. No gate and no email-a-PDF (no mail path exists). Linked from `/platform/riddor` and from the RIDDOR and accident-book articles through `ModuleBacklink` |
| `/tools/risk-matrix` | The product's 5×5 with its scale labels, the band and action from `BANDS`, the hierarchy-of-control helper, HSE's five steps in plain words with the link, CTA "Run full assessments with hazards, controls and bowtie in jobsafe." |
| `/tools/accident-frequency-rate` | Injuries × 100,000 ÷ hours with the working shown; the convention sourced to the Highways Agency technical note and the ORR glossary; HSE's per-100,000-workers rate shown as a different measure; the per-million-hours convention not shown because no UK primary source defines it; "jobsafe keeps the incident record your AFR is built from." and no claim that jobsafe calculates it |
| `/tools` | The hub; ItemList |

The Resources menu gained a "Free tools" column, the footer's Resources
column lists them, and the homepage free-tools band (section 11) is on.

### Part D: comparisons

`/compare`, `/compare/mitti-safetyculture`, `/compare/evotix` and
`/compare/ecoonline`, all behind `NEXT_PUBLIC_COMPARE_PAGES`. Content in
`lib/compare.ts`: the same 15 rows on every page, each competitor cell with
its source URL, a verbatim quote where one exists and "checked
25/09/2026"; "Choose them if / choose jobsafe if"; rows where the
competitor is better marked "Theirs"; no ratings, logos or screenshots of
their product; "How to switch" titled "Talk to us about moving your
records"; the CAP Code (section 3, rules 3.32 to 3.43) cited at the foot
of every page. The research was re-fetched on build day with live HTTP
requests (Firecrawl had no credits) and the fetched texts are kept with the
session; the starting facts the brief supplied that the re-fetch refuted
(Mitti's lone worker is included in every plan; Evotix's demo form has five
fields, not seven; Mitti's own FAQs do not concede the permit-to-work
point) were not used. `docs/MONITORING.md` defines the six Firecrawl
change monitors (pricing and modules pages per competitor) with the exact
calls; they could not be created because the Firecrawl account has no
credits, and the doc says so.

The claims checker was taught the difference between a fact about a
competitor and a claim about jobsafe: competitor-side fields in
`lib/compare.ts` and elements marked `data-claims="competitor"` are not
scanned; everything said about jobsafe is.

## 3. Skipped, and why

| Item | Why |
| --- | --- |
| `/platform/checklists`, `/platform/contractors` as live pages | Their inputs are `false`. Built and gated; nothing else changes when they flip |
| Email-a-PDF from the RIDDOR checker | No mail path and no PDF generation exist |
| Firecrawl change monitors | Defined in `docs/MONITORING.md`; creation failed on credits, twice, with the exact error recorded |
| The per-million-hours AFR convention | No UK regulator or industry body defines it from a primary source; the page says so rather than showing an unsourced convention |
| A "version history" claim on document control | The product bumps the version in place and keeps no earlier versions; the page says what it does |
| An evidence lightbox on investigations | The product has none; the gallery is described as it is |
| The sector templates slot on industry pages | Phase 4; the slot renders nothing |
| The five-steps risk assessment guide | Phase 4; `/tools/risk-matrix` explains the five steps and links HSE, and owns "5x5 risk matrix" only |
| `sync-product-logic --check` in CI | Needs the product checkout; documented as a manual step in `docs/PRODUCT-LOGIC.md` |

## 4. Verification

Run on 25/09/2026 against production builds of this branch; the commands
are in the README.

**Flag off (production as it deploys)**: `npm run build` clean; every
pre-existing route's document (the HTML with its `<script>` blocks removed,
which is what a visitor and a crawler see) is byte-identical to a build of
`main` at `0fd84b7` on 19 of 24 routes and identical on the other five (the
homepage and the four rebuilt industry pages), which differ only in one
extra client chunk in the script list because the client module graph
grew; `seo-check --flag off` clean (24 pre-existing URLs 200, every Phase 3
route 404); `schema-check --flag off` clean (21 routes, 85 nodes);
`claims-check` (source) clean.

**Flag on, comparisons off**: build clean; `seo-check --flag on --compare
off` clean (every row matches its title, description, H1 and canonical; the
four comparison rows and the two gated module rows 404; every platform page
that exists, 29 of them, has ≥ 3 contextual links in and out and every
declared link is in `<main>`); `schema-check` clean (45 routes, 201 nodes:
SoftwareApplication, BreadcrumbList, FAQPage, WebApplication, HowTo,
ItemList, BlogPosting); `claims-check --base` clean (Sign up and Log in
unchanged, Book a demo → Calendly or `/demo`, external hosts listed);
Playwright 149 passed: axe (WCAG 2.2 AA + best practice) on all 45 routes at
320, 768 and 1280, the consent gate, the four Phase 2 keyboard flows and the
mega-menu, and the four keyboard-only tool flows (a worker fracture through
the checker with Tab, arrows, Space and Enter asserting the Specified
verdict, the 10-day date and the changed live region; the URL round trip;
arrows and Space on the matrix; typing into the AFR calculator).

| Lighthouse, mobile | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/tools/riddor-checker` | 94 | 100 | 100 | 100 |
| `/industries/transport-logistics` | 93 | 100 | 100 | 100 |
| `/platform/fleet-compliance` | 93 | 100 | 100 | 100 |

**Flag on, comparisons on**: build clean; `seo-check --flag on --compare
on` clean (the four comparison rows match their titles, descriptions, H1s
and canonicals; 33 platform pages with ≥ 3 links in and out; every
declared link in `<main>`); `schema-check --compare on` clean (49 routes,
217 nodes); `claims-check --base --compare on` clean (competitor-side copy
exempt, jobsafe-side copy scanned; external hosts now include mitti.com,
evotix.com, ecoonline.com and asa.org.uk, each linked as a source); axe on
`/compare` and the three comparisons at 320, 768 and 1280: 12 passed.

**Unit tests**: `npm test` 183 passed, 0 failed, including
`test/product-logic.test.mjs` (the upstream RIDDOR and 5×5 cases, case for
case), `test/industries.test.mjs`, `test/tools.test.mjs` and
`test/compare.test.mjs`. `npm run lint`, `npm run typecheck` and
`node scripts/seo-audit.mjs` clean.
