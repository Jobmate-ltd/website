# Phase 2 — the platform relaunch, behind the flag

The record of what the Phase 2 PR changed, what it measured, what it left
open, and how the flag is flipped. `docs/REBUILD.md` is the standing brief
for every phase; `docs/PHASE-1.md` is the Phase 1 changelog; `docs/SEO.md`
and `docs/COMPONENTS.md` are the references this phase added.

**Nothing in this PR changes production.** `NEXT_PUBLIC_PLATFORM_LAUNCH`
stays unset, and with it unset every pre-existing URL renders exactly as it
did after Phase 1 (proved below, byte for byte after normalising asset
hashes). A person flips the flag; the runbook is at the end.

## Inputs the phase was built on

| Input | Value | Where |
| --- | --- | --- |
| `BOOK_DEMO_URL` | `https://calendly.com/jobmate-sales/30min` | `DEMO_BOOKING_URL` in `lib/brand.ts`; `NEXT_PUBLIC_BOOK_DEMO_URL` may override it and falls back to the same page |
| `PRICE_BOOK` prices and annual terms | **Still in brackets** | `lib/brand.ts` holds `null`; every price surface renders "Book a demo for pricing", the Enterprise tier "Talk to us" |
| Essentials includes | report, investigate, act, RIDDOR, dashboard, SOS, sites & people, offline app | `PRICE_BOOK.essentials.includedModules` |
| Professional includes | Essentials + risk & bowtie, permits & contractors, checklists, fleet & plant, training, documents | `PRICE_BOOK.professional.includedModules` |
| Enterprise | "Talk to us": Professional + onboarding, invoicing, SLAs. SSO and API are not listed | `PRICE_BOOK.enterprise` |
| Sign up / Log in | Unchanged: `https://app.jobsafe.cloud/signup-trial`, `https://app.jobsafe.cloud/login`, same labels | `SIGNUP_TRIAL_URL`, `LOGIN_URL` |
| Support hours | 09:00–17:00 UK time, Monday to Friday, excluding public holidays (matches the terms) | `/contact`, `/pricing` FAQ |
| Hosting | London region (Supabase on AWS eu-west-2) | `HOSTING_LINE`, `HOSTING_DETAIL` |
| Phone, address | 0333 8000 883 · 86 Tettenhall Road, Wolverhampton WV1 4TF | `PHONE_DISPLAY`, `ADDRESS_LINE` |

No price, discount, trial term or certification was invented. Where a value
is unknown the page says so in words.

## What changed

### Step 1 — real product screenshots

`scripts/capture-product.mjs` drives the jobsafe platform (its own repo, in
local demo mode with the North Star Logistics seed) with Playwright and
captures the sixteen states in the brief at 1440×900 @2× (desktop) and
390×844 @3× (phone): dashboard (both), register, the evidence and RIDDOR
steps of a new report, a report with ICAM, the RIDDOR form with its live
verdict, the risk register, a worksheet in matrix and bowtie view, a blocked
permit, the fleet cards, the competency matrix, the actions board, the SOS
screen and a record showing "Pending sync" while offline. Developer chrome is
hidden with injected CSS before each capture; evidence files are real files
pushed through the product's own upload controls. Every export is AVIF +
WebP under `public/product/`, and `lib/product-images.ts` is generated
with the real dimensions, one sentence of alt text that says what is on the
screen, and a caption.

The dashboard still supplied for the homepage hero
(`assets/product-source/dashboard-hero-desktop.png`, 1896×942) goes through
the same pipeline as a `STATIC` entry (`--static` re-exports it), so all
seventeen images have one manifest and one licence trail. Nothing is
generated or mocked; the unit tests refuse a manifest entry whose files are
missing or whose alt text is a placeholder.

### Step 2 — navigation and footer

`lib/site.ts` gained `PLATFORM_NAV` (Platform ▾ in three columns, Record /
Resolve / Prevent, with a promo card to the tour; Solutions ▾; Industries ▾;
Resources ▾; Pricing; on the right Log in, Sign up and Book a demo) and
`PLATFORM_FOOTER` (Platform, Industries, Resources, Company with Cookie
settings, Legal, and the line "Hosted in London · Made by Jobmate Ltd, 86
Tettenhall Road, Wolverhampton WV1 4TF · 0333 8000 883").

`navForFlag()` and `footerForFlag()` drop every link whose page does not
exist in the current flag state, then every menu left empty. That is why
Solutions does not render yet (none of its pages exist), why Industries
shows the four industry pages that exist, and why no menu can ever link to
a 404. `components/site/platform-header.tsx` is the mega-menu (Radix
navigation-menu panels; a mobile sheet with accordion groups and 44px
targets); `components/site/header.tsx` is a server wrapper that renders it
with the flag on and the untouched Phase 1 header (`header-phase-1.tsx`)
with it off.

### Step 3 — pages

All new pages are `notFound()` with the flag off and, belt and braces, are
rewritten to a routeless path in `next.config.ts` so they, and their Open
Graph images, answer with the server-rendered 404.

| Route | What is on it |
| --- | --- |
| `/` | The thirteen sections from the brief: the shadcnblocks Hero 195 layout with the real dashboard behind an animated border, tabs to three more screens; the fact strip; the loop; "One incident, end to end" on a sticky-scroll of six real screens; the module index on family tabs; the regulation bento; "Offline, proven live" (the signal toggle); the industries; why switch; the pricing teaser; the FAQ answering the three "People also ask" questions; the closing band. Headline variants A/B/C in `lib/hero-variants.ts`. |
| `/platform` | The loop diagram (orbiting modules, beams that show what feeds what, the same feeds in words), the module index with "Expanding" for Checklists and Contractors, the five guarantees, and the five-step tour at `#tour` (NextStep.js over real screens, keyboard operable). |
| `/platform/incident-reporting`, `/platform/riddor`, `/platform/risk-assessments`, `/platform/permits-to-work` | One template (`components/platform/module-page.tsx`) fed by `lib/platform-modules.ts`: display line, lead, proof chips, three pains → outcomes, three features each with a real screenshot, the connected modules, the regulation, five or six FAQs including the "People also ask" question, and a `doNotClaim` list that is never rendered. Only what the brief lists is written. |
| `/platform/offline` | The large signal toggle, the sync diagram, the rules of what happens offline, how to install the web app, the gloves-and-glare notes, FAQ. |
| `/pricing` | Team-size toggle group and monthly / annual switch, the three tiers (no price until the price book is filled), the comparison table with tooltips, the cost-of-paper calculator (sliders and number fields, the working shown in full), the FAQ that matches the terms. No trial, checkout or sign-up on the page. |
| `/security` | Hosting, isolation, private storage, roles, history, export and deletion, what to ask for. Certifications: "none is listed today". |
| `/demo` | What the 30 minutes cover, the Calendly button, and a server-side form (`app/api/demo/route.ts`: zod, honeypot, six requests an hour per IP, the same sinks as the toolkit form). |
| `/contact` | Sales, support with the hours from the terms, the address, the phone. |
| `/about` | Rewritten with the flag on (`components/about/about-platform.tsx`): from incident reporting to a platform; the true "does not" list (does not submit RIDDOR to HSE, not a lone-worker alarm, not telematics); who builds it; where the data lives; the disambiguation section kept. The Phase 1 page is `about-phase-1.tsx`, rendered with the flag off. |
| 404 | `app/not-found.tsx`, server-rendered in the layout, no link to a page that does not exist in the current state. |

Existing pages under the flag: the industry templates swap the two FAQ
answers that denied risk assessments and checklists for answers that point
at the modules, add an "In the platform" section linking the four module
pages, and show the pricing teaser instead of the Phase 1 pricing block;
each article and the toolkit carry a contextual link back to their module
(`components/insights/module-backlink.tsx`); the chat widget answers from a
platform knowledge base; `llms.txt` describes the platform and says "no
native store app yet" and "the customer submits to HSE". With the flag off
every one of these files renders its Phase 1 branch, and the diff proves
it.

### SEO

`content/seo/keyword-map.json` is the keyword map; `buildMetadata(path)`
reads it (and the pre-launch row while the flag is off); `h1For(path)` gives
the H1; `lib/seo/links.ts` is the link registry that every page renders its
contextual links from; `scripts/seo-check.mjs` proves the served pages match
both in either state. Titles, descriptions and H1s are the brief's, verbatim.
Schema: `platformApplicationSchema()` with `operatingSystem` "Web
(installable on iOS and Android)", no store links, `offers` only once the
price book has prices; `BreadcrumbList` on every inner page; `FAQPage`
emitted from the same array the accordion renders (force-mounted, so the
answers are in the HTML). The full reference is `docs/SEO.md`.

### Step 4 — measurement

`lib/analytics.ts` exports one typed `track()` that sends a GA4 event only
when the visitor has granted analytics consent and the tag has loaded.
Events wired: `book_demo_click` (every Book a demo button, with its
placement), `lead_form_submitted`, `tour_started`, `tour_completed`,
`pricing_toggle` (team size and billing), `calculator_used`,
`signal_toggle_used`. The hero headline has three variants
(`lib/hero-variants.ts`), chosen at build time by `NEXT_PUBLIC_HERO_VARIANT`
so the homepage stays static; A ships. Registering the flag in Vercel was
attempted through the Vercel API from this session and refused with
`403 forbidden: You don't have permission to list the flags` on the
`website` project, so it is an open item below.

### Components

Every imported component, its source URL, licence and what changed is in
`docs/COMPONENTS.md`. 21st.dev retrievals in this phase: none. One animation
library (`motion`); everything respects `prefers-reduced-motion`.

## Guard changes (`scripts/seo-audit.mjs`)

The brief says a guard that conflicts with it is changed in the same PR and
explained. Three did.

| Rule | Change | Why |
| --- | --- | --- |
| `no-checklists` | Skips `PLATFORM_ONLY_PATHS` (the files that render only with the flag on) and the five shared files that carry a platform-only value opt out with a reasoned `seo-audit-ignore` comment. The Phase 1 surfaces are still checked, and tests prove a claim on one of them still fails. | The rule encoded "jobsafe has no checklists feature", which was true of the incident-reporting product. The platform has a Checklists & inspections module ("Expanding"), named in the brief's Professional tier. The live site, with the flag off, still makes no such claim. |
| `faq-server-rendered` | Follows an import of `@/components/ui/accordion` and audits that file for `forceMount` and the `h-0` collapse. | The Phase 2 FAQ is built on the shared shadcn/ui accordion, which carries the collapse; the rule could not see it and reported a false failure. Tests cover the three ways the shared primitive can be wrong. |
| `vat-shown` | `components/pricing/cost-of-paper.tsx` opts out with a reason. | Its `formatPrice()` calls format the visitor's own paper cost (hours × their hourly rate), not a jobsafe price; the one jobsafe figure on the page carries `VAT_SUFFIX`. |

No rule was deleted. `canonical-everywhere` was widened to accept
`buildMetadata()` (Phase 1 groundwork). Two checks were added that run
against a served build in both states: `scripts/schema-check.mjs` and
`scripts/claims-check.mjs`, and `scripts/seo-check.mjs` from the brief.

## Evidence, measured

Every number below was produced by the commands in "How to run everything"
against production builds of this branch, one with the flag off and one
with it on, on 25/09/2026.

### Flag off (production)

- **Byte-for-byte equivalence with Phase 1.** A Phase 1 checkout
  (`claude/busy-wright-bt9osk`) and this branch were both built with the
  flag unset and served side by side; the HTML of every one of the 24
  pre-existing URLs (12 static pages, 9 articles, sitemap, robots,
  `llms.txt`) was fetched from each and compared after stripping only
  script tags, stylesheet and preload links, and the hashed
  `/_next/static/…` paths. **24 of 24 identical.** The only differing
  responses are the 404s: the hidden Phase 2 routes and any unknown URL now
  render `app/not-found.tsx` (server-side, with the layout, `lang` and
  fonts) instead of Next's default page.
- `npm run seo:check -- --flag off`: `/` and `/about` match their
  pre-launch rows; the ten launch-only routes return 404; all 24
  pre-existing URLs return 200. Clean.
- `npm run schema:check -- --flag off`: 21 routes, 85 JSON-LD nodes, clean.
- `npm run test:e2e` (axe at 320 / 768 / 1280 on 21 routes, the consent
  gate): **68 passed, 5 skipped** (the keyboard flows, which need the flag).

### Flag on (preview)

- `npm run seo:check -- --flag on`: every row's title, description, H1 and
  canonical match; every Phase 2 page has ≥ 3 contextual links in and out
  and every declared link is inside `<main>`; all 24 pre-existing URLs
  still return 200. Clean.
- `npm run schema:check -- --flag on`: 31 routes, 129 nodes, clean.
  `SoftwareApplication.operatingSystem` reads "Web (installable on iOS and
  Android)" on every platform page, no `offers` (no prices), no store
  links, no ratings; every breadcrumb URL resolves; every FAQ question and
  answer is in the HTML.
- `npm run claims:check -- --base …`: nothing on the "never" or "once
  built" lists in the rendered text or JSON-LD of 31 routes or in
  `llms.txt`; 28 sentences carry a negation ("not available yet", "you
  submit to HSE") and are listed as such. Sign up → only
  `https://app.jobsafe.cloud/signup-trial`; Log in → only
  `https://app.jobsafe.cloud/login`; Book a demo → only
  `https://calendly.com/jobmate-sales/30min` and `/demo`. External hosts
  linked: app.jobsafe.cloud, calendly.com, jobmate.cloud, the social
  profiles, and the HSE, legislation.gov.uk, ICO, BSI and press sources
  cited by the articles. No platform or live-demo host anywhere.
- `E2E_PLATFORM=on npm run test:e2e`: axe (WCAG 2.2 AA + best-practice
  tags) at 320 / 768 / 1280 on all 31 routes, the consent gate, and the
  five keyboard-only flows (signal toggle, pricing toggle, calculator,
  tour, mega-menu): **103 passed, 0 failed.**
- Lighthouse, mobile preset (`docs/lighthouse/phase-2/summary.md`):

  | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
  | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
  | `/` | 91 | 100 | 100 | 100 | 3.4 s | 0 | 120 ms |
  | `/platform` | 91 | 100 | 100 | 100 | 3.5 s | 0 | 40 ms |
  | `/pricing` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 120 ms |
  | `/platform/riddor` | 93 | 100 | 100 | 100 | 3.2 s | 0 | 70 ms |

  The homepage first scored 89: it was the only page loading the `motion`
  library (35 KB gzipped, for the hero's border beam and the story's scroll
  tracking). The beam is now CSS keyframes on `offset-distance` and the
  story uses an IntersectionObserver; `motion` stays for the beams on
  `/platform` and the number ticker on `/pricing`.
- Screenshots of every new page and the rewritten ones at 1440 and 390,
  flag on, consent rejected: `docs/screenshots/phase-2/` (30 files).

### Both states

- `npm run lint`, `npm run typecheck`, `npm run seo:audit`,
  `npm run claims:check` (source mode): clean.
- `npm test`: 113 tests, 113 pass (constants, routes, nav for each flag
  state, keyword map, link registry, hero variants, analytics gate,
  platform content model, module pages, image manifest, every audit rule).
- Product screenshots: 17 real exports, every one present in AVIF and
  WebP with the manifest's dimensions (asserted by `test/platform.test.mjs`).

## Open inputs

Things a person has to supply or confirm. None of them blocks the flag, but
each one changes what a page says.

1. **Prices and annual terms** for Essentials and Professional
   (`PRICE_BOOK` in `lib/brand.ts`, `pricePerUserMonthExVat` and
   `annualTerms`). Until they are set, `/pricing`, the pricing teaser, the
   calculator's plan side, the chat widget and `llms.txt` all say "Book a
   demo for pricing", the JSON-LD carries no `offers`, and the "Prices in
   pounds" fact stays off the fact strip. Setting them is a one-line change
   per tier; `test/brand.test.mjs` and `test/platform.test.mjs` check the
   labels either way.
2. **Security page wording** on encryption and backups ("encrypted in
   transit and at rest by the hosting provider, which also takes the
   backups; the exact terms are those of the hosting plan") and the
   certifications line ("none is listed today"). Both are true as written;
   confirm or tighten against the current Supabase plan.
3. **Support hours** on `/contact` and the pricing FAQ are copied from the
   terms (09:00–17:00 UK time, Monday to Friday, excluding public holidays).
   Confirm they still match.
4. **`NEXT_PUBLIC_BOOK_DEMO_URL`** is unset; every Book a demo control
   falls back to `DEMO_BOOKING_URL`, the same Calendly page. Set it only if
   the booking link changes.
5. **The hero A/B/C flag in Vercel.** The API refused this session
   (`403 forbidden` on `projectFlags:list` for `website`). Either grant the
   integration the Flags permission and register `hero-variant` (string; A,
   B, C; default A), or keep choosing the variant per deployment with
   `NEXT_PUBLIC_HERO_VARIANT`. Wiring the `flags` SDK would make the
   homepage dynamic, which is a decision, not a default.
6. **Solutions pages and the three missing industries** (construction,
   facilities and care, utilities) are configured in `PLATFORM_NAV` and
   appear the moment their pages exist. Nothing links to them until then.
7. **The current app's store listings** stay in `Organization.sameAs`
   (they are real, and Log in / Sign up still go to that app); the
   platform's `SoftwareApplication` node carries no store link. If the
   old app is delisted, remove them from `SAME_AS`.

## The flag-flip runbook

1. In Vercel, project `website`, add `NEXT_PUBLIC_PLATFORM_LAUNCH=true` to
   the Production environment (Preview already builds with it). The flag is
   read at build time, so redeploy. Do not flip it on a Friday.
2. On the deployed site run, from a checkout of this branch:
   `node scripts/seo-check.mjs --flag on --base https://www.jobsafe.cloud`,
   `node scripts/schema-check.mjs --flag on --base https://www.jobsafe.cloud`,
   `node scripts/claims-check.mjs --base https://www.jobsafe.cloud`.
   All three must be clean.
3. Submit the sitemap in Search Console; request indexing for `/`,
   `/platform`, the four module pages and `/pricing`.
4. Watch coverage and queries daily for two weeks, then weekly for two
   months, against the Phase 1 baseline.
5. To roll back, remove the variable and redeploy: the build is the Phase 1
   site again, nothing else to undo.

## Separate decisions, not part of this phase

- **Pointing Sign up and Log in at the platform.** Both still go to the
  current app with the same labels, in both flag states, and
  `test/platform.test.mjs` fails if either moves. Changing them is its own
  change, with `PLATFORM_SIGNUP_URL` / `PLATFORM_LOGIN_URL` already typed in
  `lib/brand.ts` for it.
- **An open live demo.** `LIVE_DEMO_URL` stays unset and no page, menu or
  JSON-LD links to one. `docs/REBUILD.md` mentions it; those parts were
  ignored for this phase as the brief said.

## How to run everything

```
npm ci
npm run lint && npm run typecheck && npm test
npm run seo:audit && npm run claims:check

# flag off (production)
npm run build && npm run start &
npm run seo:check -- --flag off
npm run schema:check -- --flag off
PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium BASE_URL=http://localhost:3000 npm run test:e2e

# flag on (preview)
NEXT_PUBLIC_PLATFORM_LAUNCH=true npm run build && npm run start &
npm run seo:check -- --flag on
npm run schema:check -- --flag on
npm run claims:check -- --base http://localhost:3000
E2E_PLATFORM=on PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium BASE_URL=http://localhost:3000 npm run test:e2e
CHROME_PATH=/opt/pw-browsers/chromium node scripts/lighthouse-routes.mjs --routes phase-2 --out docs/lighthouse/phase-2
node scripts/screenshot-routes.mjs --platform --consent reject --out docs/screenshots/phase-2

# product screenshots (needs the jobsafe repo running in demo mode on :3100)
PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run capture:product
```
