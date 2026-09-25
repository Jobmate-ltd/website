# Rebuilding www.jobsafe.cloud

This is the standing brief for the four-phase rebuild of the jobsafe marketing
site. Phase 1 (this document's first reader) laid the foundation: the light
design system, the component set, the constants file and the truth fixes.
Phases 2–4 compose pages from what Phase 1 built and sell the platform.

jobsafe is always lowercase, including at the start of a sentence. It is made
by Jobmate Ltd, Wolverhampton.

Where something in this file is implemented, the code path is named so nobody
has to guess. Where a value is a business decision (a price, a trial rule),
the only source of truth is `lib/brand.ts`; this file describes, it never
duplicates.

## 1. Positioning

- **Category line:** "The health and safety platform for UK operators whose
  work happens in yards, sites, depots and vans."
- **Tagline** stays "Record. Resolve. Prevent." It becomes the information
  architecture:
  - **Record:** incidents, RIDDOR, checklists, fleet
  - **Resolve:** investigations, actions, permits, contractors
  - **Prevent:** risk and bowtie, training, documents, dashboards
- **Hero headlines to test** (Phase 2):
  - A: "One safety platform. Built for UK law. Works without signal."
  - B: "From the first report to the last certificate. One record, offline."
  - C: "Health and safety for the yard, the site and the depot."

## 2. Pillars, each with its proof

| Pillar | Proof |
| --- | --- |
| **One record, report to prevention.** | Actions are raised automatically from eight sources. Permits check contractor competence and a live risk assessment before issue. |
| **Written for UK law.** | RIDDOR 2013 Reg 4 and Schedule 2 triage with deadlines; MHSWR 1999 reg 3 "suitable and sufficient" check; LOLER and MOT dates. |
| **Works without signal.** | Every module saves to the phone first; "Pending sync" on each record; signed-in phones open offline. |
| **Stays in the UK.** | Hosted in London, walled off per organisation. |
| **Bought without a sales call.** | Prices in pounds with VAT shown, and an open live demo. |

## 3. Claims ladder

### Say now, because it is true in the platform code

- works offline in every module
- hosted in London
- RIDDOR 2013 triage with reporting deadlines
- permits won't issue until contractor competence and a live risk assessment
  check out
- 5×5 risk assessments with hierarchy of control and bowtie analysis
- MOT, tax, insurance, service and LOLER dates on every vehicle and machine
- accessibility tested to WCAG 2.2 AA
- CSV export from every register

### Say once built

Email and push alerts, build your own checklists, add contractors, PDF
reports, import from spreadsheets, SSO, native iOS and Android apps,
integrations, AI.

### Never say

- "immutable audit trail" (unless an append-only log is built)
- "ISO 45001 compliant", "ISO 45001 certified" or "ISO 45001 aligned"; say
  what the records do instead
- "files RIDDOR with HSE for you"
- "HSSE compliant"
- unsourced multipliers ("3× faster", "under 60 seconds", "over 70%")
- patient-safety framing on care pages

`scripts/seo-audit.mjs` fails the build on the unsourced multipliers it knows
about (`unsourced-number`). Add a new phrase to `UNSOURCED` the moment it is
retired from the site so it cannot come back.

## 4. Voice

- **Mechanics:** UK English, DD/MM/YYYY, lowercase jobsafe always. Sentence
  case for headings and buttons. Uppercase eyebrows. No emoji.
- **Words to avoid:** seamless, revolutionary, game-changer, best-in-class,
  cutting-edge, leverage, unlock, supercharge.
- **Style:** short active sentences. Name the broken thing a safety manager
  already knows before selling anything. No fear-mongering.
- **Sector words:**
  - transport: yard, depot, tail lift, banksman, walkaround
  - construction: site, principal contractor, plant
  - care: staff, shift, lone working
  - facilities: estate, contractor, member of the public
  - manufacturing: line, high bay, MHE, FLT
- **Proof:** never fabricate customers, logos, testimonials, ratings, counts
  or outcomes. External statistics name their source and year on the page.

## 5. Competitors and the rename

- SafetyCulture renamed itself **Mitti** on 11/08/2026; safetyculture.com
  redirects to mitti.com. Write "Mitti (formerly SafetyCulture)" on first
  mention.
- Evotix and EcoOnline publish no prices and gate demos behind 7- and 9-field
  forms. Mitti prices in USD only and has no UK data region.

## 6. Design system

The site adopts the product's own light token system, so the site and the
app look like one company. The values come from the product's
`src/styles/globals.css`. On the site they live in `app/globals.css` (Tailwind
v4 `@theme`), and that file is the **only** place a colour literal may appear;
`scripts/seo-audit.mjs` (`colour-literal`) fails the build on any other.

### Grounds and ink

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#FFFFFF` | default section background, cards |
| `bg` | `#F7F8FA` | alternate section bands, footer |
| `canvas-muted` | `#FCFCFD` | table heads, subtle fills |
| `ink-1` | `#0A0A0A` | headings, primary text on light, dark buttons |
| `ink-2` | `#1F2937` | body text |
| `ink-3` | `#2E3540` | nav items, secondary buttons |
| `ink-4` | `#313844` | secondary text, eyebrows on grey |
| `ink-5` | `#3E4654` | tertiary text, captions (the lightest colour allowed for text) |
| `line-1` | `#E5E7EB` | borders |
| `line-2` | `#EEF0F3` | soft dividers |
| `line-3` | `#F3F4F6` | hairlines, chip backgrounds |
| `grey-400` | `#9CA3AF` | decorative strokes only, never text (2.5:1 on white) |

### Brand

| Token | Value | Use |
| --- | --- | --- |
| `brand` | `#E63946` | the crimson: icons, large display words (24px and up), illustrations, focus rings, chart accents |
| `brand-strong` | `#CD1A27` | solid primary button fill (white text), links, eyebrows and any crimson text under 24px (AA on white and on `bg`) |
| `brand-dark` | `#C42D24` | hover on primary buttons |
| `brand-tint-04` / `-08` / `-18` | `rgba(230,57,70,.04 / .08 / .18)` | selected rows, badges, soft borders |

### Status, for product-style UI and pills only

These are not decorative accents.

| Meaning | Text | Tint |
| --- | --- | --- |
| Good | `#15803D` | `rgba(34,197,94,.10)` |
| Warning | `#B45309` | `rgba(245,158,11,.10)` |
| Info | `#1D4ED8` | `rgba(29,78,216,.08)` |
| Neutral | `#444C59` | `#F3F4F6` |
| Critical | `#CD1A27` | `rgba(230,57,70,.08)` |

In code: `StatusPill` in `components/ui/chip.tsx`.

### Typography

Both families are loaded with `next/font/local` from `assets/fonts/`
(variable woff2, SIL OFL). Geist is gone.

- **Manrope** (variable, 200–800; the site uses 400, 500, 600, 700, 800) for
  everything, with font features `'cv02','cv03','cv04','cv11'`.
- **JetBrains Mono** (variable; the site uses 400, 500) with tabular numbers,
  for report numbers (`26-014`), dates, prices in tables, regulation
  references and code-like labels.

| Role | Size | Weight | Tracking | Line height | Utility |
| --- | --- | --- | --- | --- | --- |
| Display (hero H1) | `clamp(40px, 6vw, 68px)` | 800 | −0.035em | 1.02 | `type-display` |
| H2 | `clamp(30px, 3.6vw, 44px)` | 800 | −0.025em | 1.1 | `type-h2` |
| H3 | 22px | 700 | −0.015em | 1.25 | `type-h3` |
| Lead | 19px | 400 | normal | 1.55 | `type-lead` |
| Body | 16–17px | 400 | normal | 1.6 | `type-body` |
| Small | 14px | 400 | normal | normal | `type-small` |
| Eyebrow | 12px | 800 | 0.12em | normal | `type-eyebrow` |

- Eyebrows are uppercase and set in `brand-strong` (`components/ui/eyebrow.tsx`).
- Headings use `text-wrap: balance`.
- Keep running text near 65 characters wide (`measure`).

### Shape and depth

- **Radii follow the product, which is deliberately squared.** Buttons,
  inputs and cards use 4px (`rounded-control`). Large screenshot frames and
  the hero device use 8px (`rounded-frame`). Pills and avatars use 9999px
  (`rounded-pill`). Nothing else goes above 8px; the default Tailwind radius
  scale is removed from the theme so nothing larger can be reached by accident.
- **Borders do the separating.** Use a `line-1` hairline; shadows stay quiet.
- **Shadows:**
  - `0 1px 2px rgb(15 23 42 / .04)` at rest (`shadow-rest`)
  - `0 1px 2px rgb(15 23 42 / .04), 0 4px 12px rgb(15 23 42 / .06)` on hover
    (`shadow-hover`)
  - `0 24px 60px rgb(15 23 42 / .10)` for screenshot frames only
    (`shadow-frame`)

### Signature texture

Keep the brand's 60px grid, now as ink at 4.5% opacity. It sits behind heroes
only and fades out downwards with a mask. Place one soft crimson radial per
hero at 8–10% opacity (`components/ui/hero-backdrop.tsx`, `hero-grid` and
`hero-radial` utilities). The grain overlay, the ambient red glow and the
animated border beams are gone; they belonged to the dark world.

### Motion

- Durations 160–220ms, easing `cubic-bezier(.22,1,.36,1)` (`ease-out-expo`).
- Reveal-on-scroll runs once and starts from a visible state; content is
  never left at `opacity: 0` waiting for an observer
  (`components/ui/reveal.tsx` only marks an element pending once it has
  confirmed the element is below the fold).
- Everything goes instant under `prefers-reduced-motion`.

### Wordmark

The wordmark on light (ink "job", crimson `#E63946` "safe" and swoosh) lives in
`public/images/brand/` at 1× and 2×, PNG and WebP, and renders through
`components/ui/wordmark.tsx` with `alt="jobsafe"`. A vector SVG is still owed
by design; do not trace one by hand. Favicon and app icon are unchanged.

### Imagery on light

- Prefer colour and natural light: UK yards, depots, sites, warehouses and
  vans, with people working rather than posing.
- The dark-graded hero photos and videos from the old site may stay for now,
  cropped into 8px-radius frames on a light ground rather than full-bleed
  dark heroes.
- Product screenshots are replaced in Phase 2 with real product UI. For now
  the existing ones are framed on light (`BrowserFrame`, `PhoneFrame`).

## 7. Build rules

- **One constants file.** `lib/brand.ts` holds every price, URL, phone
  number, trial rule and launch flag. No component hard-codes a price or URL;
  `scripts/seo-audit.mjs` (`price-literal`, `vat-shown`, `trial-card-claim`,
  `maker-line`) fails the build if one does.
- **Pages are composed from the component set** in `components/ui` and
  `components/site`: `Container`, `Section`, `Eyebrow`, `SectionHeading`,
  `Button`, `Chip`/`StatusPill`, `BrowserFrame`/`PhoneFrame`, `FactStrip`,
  `FeatureRow`, `Faq`, `CtaBand`, `Header` (driven by `NAV` in `lib/site.ts`),
  `Footer` (driven by `FOOTER`), `ConsentBanner`.
- **Every page is server-rendered with metadata, canonical, OG and JSON-LD.**
  Metadata goes through `pageMetadata()` in `lib/seo.ts` (self-referencing
  canonical, Open Graph, Twitter card); Open Graph images are
  `opengraph-image.tsx` files rendered by `lib/og.tsx`; JSON-LD comes from
  `lib/schema.ts`. `canonical-everywhere` fails the build on a page that
  hand-rolls its metadata.
- **axe clean at 320, 768 and 1280** on every route
  (`npm run test:e2e`, `e2e/axe.spec.ts`, run in CI).
- **No non-essential script before consent.** Analytics and Speed Insights
  mount only after the visitor accepts (`components/site/analytics.tsx`,
  `lib/consent.ts`, `e2e/consent.spec.ts`).
- **Real product UI only in screenshots; never generated UI.**
- **The launch flag.** `NEXT_PUBLIC_PLATFORM_LAUNCH` (default `false`) and
  `isPlatformLaunched()` in `lib/brand.ts` gate Phase 2. New routes return
  `notFound()` in production until it is `true`, and are left out of the
  sitemap (`lib/routes.ts`, `platformOnly`) and nav. Preview deployments set
  it `true`.
- **Phase 2 config** is typed and empty by default in `lib/brand.ts`:
  `PLATFORM_APP_URL`, `PLATFORM_SIGNUP_URL`, `PLATFORM_LOGIN_URL`,
  `LIVE_DEMO_URL`, `BOOK_DEMO_URL` (read from the environment, `null` when
  unset) and `PRICE_BOOK` (`essentials`, `professional`, `enterprise`; price
  per user per month ex VAT, annual terms, included modules). An unset value
  renders the safe fallback `FALLBACK_CTA` ("Book a demo") and never an
  invented number. `test/brand.test.mjs` covers this.
- **Guards are kept, never deleted.** If a rule in `scripts/seo-audit.mjs`
  conflicts with a brief, change the rule in the same PR and explain why in
  the PR description. A file can opt out of one rule with a
  `seo-audit-ignore: <rule>` comment, and each one must say why.

## Where things live

| Concern | Path |
| --- | --- |
| Tokens, type roles, motion | `app/globals.css` |
| Constants (prices, URLs, trial, launch flag, Phase 2 config) | `lib/brand.ts` |
| Nav and footer config | `lib/site.ts` |
| Routes and sitemap dates | `lib/routes.ts` |
| Metadata and canonicals | `lib/seo.ts` |
| Open Graph images | `lib/og.tsx`, `app/**/opengraph-image.tsx` |
| JSON-LD | `lib/schema.ts` |
| Consent | `lib/consent.ts`, `components/site/consent-banner.tsx`, `components/site/analytics.tsx`, `app/cookies/page.tsx` |
| Component set | `components/ui/*`, `components/site/*` |
| Build guards | `scripts/seo-audit.mjs`, `test/seo.test.mjs`, `test/brand.test.mjs` |
| Accessibility and consent e2e | `e2e/*.spec.ts`, `playwright.config.ts`, `.github/workflows/ci.yml` |
| Screenshots | `scripts/screenshot-routes.mjs`, `docs/screenshots/` |
| Phase notes | `docs/PHASE-1.md` |
