# Phase 1 — light theme, component system and truth fixes

The record of what the Phase 1 PR changed, what it measured, what it could
not do, and what a person still has to do by hand. `docs/REBUILD.md` is the
standing brief for every phase; this file is the Phase 1 changelog.

Inputs the phase was built on (all in `lib/brand.ts`):

| Input | Value |
| --- | --- |
| Worker licence | £3.00 + VAT per licence per month (up to 500); £2.75 + VAT for 500–1,000; bespoke above 1,000 |
| Admin licence | £12.00 + VAT per licence per month |
| Annual terms | 2 months free (10 months charged) |
| Trial | 14-day free trial; a payment card is taken at sign-up |
| Search Atlas OTTO | Removed entirely |
| Phone | 0333 8000 883 |

## What changed

### Workstream A — the light design system

- `app/globals.css` is now the only file with a colour literal. Tailwind v4
  `@theme` carries the product's tokens (canvas, bg, canvas-muted, ink-1…5,
  line-1…3, grey-400, brand, brand-strong, brand-dark, brand-tint-04/08/18,
  the five status pairs), the three radii (4px control, 8px frame, 9999px
  pill; Tailwind's default radius scale is removed), the three shadows, the
  `ease-out-expo` curve and the 160–220ms durations. The default Tailwind
  palette is removed (`--color-*: initial`), so `bg-zinc-900` and friends do
  not exist.
- Manrope (400–800, features cv02/cv03/cv04/cv11) and JetBrains Mono (400,
  500, tabular numbers) load through `next/font/local` from
  `assets/fonts/` (SIL OFL, see `assets/fonts/LICENSE.md`). Geist is gone.
  Vendoring instead of `next/font/google` because a build must not depend on
  Google Fonts answering (one build in this phase failed exactly that way).
- Type roles are utilities: `type-display`, `type-h2`, `type-h3`,
  `type-lead`, `type-body`, `type-small`, `type-eyebrow`, `type-mono`,
  `measure`.
- The 60px grid is ink at 4.5% behind heroes only, masked out downwards, with
  one crimson radial per hero (`HeroBackdrop`). The grain overlay, ambient
  glow, border beams and `MotionProvider` are deleted.
- `Reveal` never hides content: it renders visible and only marks an element
  `pending` once an IntersectionObserver has confirmed it is below the fold.
  Everything is instant under `prefers-reduced-motion`.
- The wordmark on light is exported at 1× and 2× as PNG and WebP
  (`public/images/brand/`) with `alt="jobsafe"`. Favicon and app icon are
  unchanged.

### Workstream B — the component set

`components/ui`: `Container`, `Section`, `Eyebrow`, `SectionHeading`,
`Button` (primary / secondary / ghost / dark / link; sm / md / lg / icon, all
≥ 44px), `Chip` / `StatusPill`, `MediaFrame` / `BrowserFrame` / `PhoneFrame`,
`FactStrip`, `FeatureRow`, `Faq` (native `<details name>`, FAQPage JSON-LD
from the same array), `CtaBand`, `Card`, `Marquee`, `Reveal`, `Wordmark`,
`HeroBackdrop`, `VideoDialog` (+ lazily loaded `VideoModal`), `LazyVideo`,
`NavigationMenu` (the restyled 21st.dev nav-06, ready for the Phase 2
mega-menu), `Sheet`.

`components/site`: `Header` (driven by `NAV` in `lib/site.ts`), `Footer`
(driven by `FOOTER`, with "Made by Jobmate Ltd, Wolverhampton" and the
"Cookie settings" control), `ConsentBanner`, `Analytics`, `LateWidgets`,
`Breadcrumbs`, `PageHero`, `Pricing`, `StickyDemoBar`, `ChatWidget`,
`IndustryPage`, `LegalPage` / `LegalSection` / `LegalTable`,
`NewsletterSignup`, `CookieSettingsLink`.

Every page is re-skinned from these: home, about, academy, insights and all
nine articles, the four industry pages, toolkit, privacy, terms and the new
cookies page. `components/sections/*`, the old ChatWidget, StickyDemoBar,
GrainOverlay, AmbientGlow, MotionProvider, border-beam, timeline-animation,
vertical-cut-reveal, the old accordion / faq / video-modal and
`styles/toolkit.css` are deleted.

### Workstream C — things that were wrong whatever we sell

| # | Item | Status |
| --- | --- | --- |
| C.1 | Remove the OTTO `sa-dynamic-optimization` script | Done. `app/layout.tsx` no longer loads it. |
| C.1 | Reviewed titles and descriptions written into code | Done. Every page uses `pageMetadata()`; the article `seoTitle` fields carry the reviewed titles. |
| C.1 | Build check against it coming back | Done. `otto-script` rule in `scripts/seo-audit.mjs`. |
| C.1 | List the dashboard switch-offs | Done — see **Manual steps**. |
| C.2 | `ConsentBanner` with equal-weight Accept / Reject and a Choose panel | Done. Both `dark` buttons; per-category switches; `role="dialog"`. |
| C.2 | No non-essential script before consent | Done. GA4 and Speed Insights mount only from the consent store; proven in `docs/screenshots/phase-1/consent-network-log.png` and `e2e/consent.spec.ts`. |
| C.2 | Store the choice for 6 months | Done. `jobsafe_consent`, 182 days, versioned. |
| C.2 | `/cookies` page listing every cookie and script | Done. |
| C.2 | "Cookie settings" in the footer | Done. Reopens the panel. |
| C.3 | Privacy notice: analytics, chat, newsletter, toolkit leads, Calendly, billing, sub-processors | Drafted, dated 25/09/2026. **Needs legal sign-off.** No company number, ICO number or wording invented. |
| C.3 | Canonicals on privacy and terms | Done. Self-referencing everywhere via `canonicalFor()`. |
| C.4 | One price, one trial, from `lib/brand.ts` | Done. Pricing blocks, meta descriptions, JSON-LD offers, chat widget and `/llms.txt` (now a route built from the constants; the static file with the £2.50 tier is deleted). |
| C.4 | "+ VAT" next to every price | Done. `vat-shown` rule. |
| C.4 | Annual terms match checkout | Done. `ANNUAL_TERMS = '2 months free'`, `annualPrice()` charges 10 months. |
| C.4 | "No card required" only if true | Done. `trialSentence()` says a card is taken; `trial-card-claim` rule forbids the claim while `cardRequired` is true. |
| C.5 | Remove "3× faster", "<60s", "over 70%", "£10,000+", "live within 30 minutes", "in 24 hours" | Done. `unsourced-number` rule keeps them out. |
| C.5 | Hero stat row → verifiable facts | Done. Works offline · photo and video evidence · GPS and timestamp · UK data hosting. |
| C.5 | HSE statistics name source and year | Done where kept (articles cite HSE and the year). |
| C.6 | Healthcare H1 | Done. "Every shift, every incident, on the record." |
| C.6 | One maker line | Done. `MAKER_LINE = 'jobsafe is made by Jobmate Ltd.'`; `maker-line` rule. |
| C.6 | Toolkit "Seven pages" and the doubled title | Done. The PDF is seven pages; the page says "Seven pages, three tools."; the title is templated once. |
| C.7 | Apex → www permanent | Done in code (`next.config.ts` redirect, 308). Vercel domain setting is a manual step. |
| C.7 | Self-referencing canonicals | Done. `canonical-everywhere` rule. |
| C.7 | Per-page OG images with `next/og`, light | Done. `opengraph-image.tsx` on every route, rendered by `lib/og.tsx` from tokens. |
| C.7 | Twitter tags per page | Done (`summary_large_image`, per-page title, description and image). |
| C.7 | `/toolkit` in the sitemap | Done. |
| C.7 | Real `lastmod` | Done. `lib/routes.ts` holds dates per route; articles use `updated ?? date`; `npm run lastmod` refreshes from git. |
| C.7 | Industry cards link; Window & door fitters in the grid | Done. |
| C.7 | Brochure phone number | Flagged — see **Manual steps**. |
| C.8 | Academy "Recording in production" ×4 | Done. One line: "More lessons are being recorded." |
| C.8 | 404 video thumbnail | Done. `hqdefault.jpg` (exists for every upload) via `lib/youtube.ts`. |

### Workstream E — groundwork for Phase 2

- `NEXT_PUBLIC_PLATFORM_LAUNCH` and `isPlatformLaunched()`; `lib/routes.ts`
  has a `platformOnly` flag that `publicRoutes()` honours for the sitemap.
- `PLATFORM_APP_URL`, `PLATFORM_SIGNUP_URL`, `PLATFORM_LOGIN_URL`,
  `LIVE_DEMO_URL`, `BOOK_DEMO_URL` read from the environment, `null` when
  unset; `ctaFor()` returns `FALLBACK_CTA` ("Book a demo") for a null.
- `PRICE_BOOK` with `essentials`, `professional`, `enterprise` (price per
  user per month ex VAT, annual terms, included modules), all empty;
  `priceBookLabel()` never invents a number.
- `test/brand.test.mjs` covers all of it, plus the unchanged Sign up / Log
  in links, the trial sentence, the price labels and the consent cookie.
- `docs/REBUILD.md` written.

## Guard changes (`scripts/seo-audit.mjs`)

Every prior rule still runs. Two were reshaped rather than deleted, and
eight were added.

| Rule | Change | Why |
| --- | --- | --- |
| `faq-force-mount` → `faq-server-rendered` | Renamed and widened | The old rule demanded Radix `forceMount`. The new `Faq` uses native `<details>`, which is server-rendered by construction; the rule now accepts either `<details` or `forceMount` + `h-0`. |
| `single-offer` | Path updated | The pricing component moved from `components/sections/Pricing.tsx` to `components/site/pricing.tsx`. The rule (one `Offer` per licence, none hand-written) is unchanged. |
| `colour-literal` | Added | Workstream A. Hex / rgb / hsl literals and default-palette utilities (`bg-zinc-900`, `text-white`…) outside `app/globals.css` fail the build. `grey-400` is a token, not the default palette, so it is allowed. |
| `otto-script` | Added | C.1. Any `sa-dynamic-optimization`, `searchatlas` or `otto` script tag fails the build. |
| `unsourced-number` | Added | C.5. The retired multipliers cannot come back. |
| `trial-card-claim` | Added | C.4. "No card required" is only legal while `TRIAL.cardRequired` is false. |
| `maker-line` | Added | C.6. Forbids "Jobmate's jobsafe HSSE module" and "Part of the Jobmate platform". |
| `vat-shown` | Added | C.4. A price expression must have "VAT" within four lines. An import list is not a price shown. |
| `canonical-everywhere` | Added | C.7. Every `app/**/page.tsx` must build its metadata with `pageMetadata()`. |
| `meta-description` | Tightened | Now also rejects a price without "+ VAT". The description is 153 characters and ends on a verb. |

`app/about/page.tsx` keeps its two `seo-audit-ignore` comments
(`brand-casing`, because it quotes the company name "Jobmate" in prose, and
`no-checklists`, because the page lists what the company does).

## Evidence

- **Screenshots**: `docs/screenshots/phase-1/before/` (the dark site, 40
  images) and `docs/screenshots/phase-1/after/` (42 images plus
  `consent-banner-1440.jpg` / `-390.jpg`), every route at 1440 and 390.
  `node scripts/screenshot-routes.mjs --out … --consent reject --banner`.
- **axe** at 320, 768 and 1280 on all 22 routes: 0 violations
  (`npm run test:e2e`, WCAG 2.2 AA + best-practice tags; also in CI).
- **Lighthouse** (mobile), `docs/lighthouse/phase-1/summary.md`:

  | Route | Performance | Accessibility | Best practices | SEO |
  | --- | ---: | ---: | ---: | ---: |
  | `/` | 91 | 100 | 100 | 100 |
  | `/industries/healthcare` | 92 | 100 | 100 | 100 |
  | `/insights/riddor-reporting-explained` | 95 | 100 | 100 | 100 |

  Single runs on a shared container; performance moves a few points between
  runs. `node scripts/lighthouse-routes.mjs` reproduces it and fails below
  the targets.
- **Consent**: `docs/screenshots/phase-1/consent-network-log.png` (and
  `.json`): 0 non-essential requests before a choice, 0 after "Reject all",
  the GA4 tag and Speed Insights only after "Accept all".
- **Checks**: `npm run lint`, `npm run typecheck`, `npm test` (69 tests),
  `npm run build` (which runs `seo:audit` first) all pass.

### What the performance score took

The first Lighthouse run scored 78 / 86 / 92. The fixes, in order of effect:

1. The homepage's initial JavaScript fell by ~55 KB gzipped. The header no
   longer uses Radix NavigationMenu + Sheet (a click-to-open disclosure and a
   native `<dialog>` do the same job in a few hundred bytes); the video
   dialog loads Radix Dialog on first click; the chat widget, demo bar,
   consent banner and analytics mount from `LateWidgets` after
   `requestIdleCallback`.
2. `Reveal` no longer calls `getBoundingClientRect()` after hydration (a
   forced reflow per element).
3. The industry hero videos are `LazyVideo`: a real `next/image` poster
   (AVIF) with the 0.6–1.3 MB clip fetched only after idle and never under
   reduced motion.
4. `images.formats` includes AVIF; JetBrains Mono is subset to the
   characters it sets and not preloaded.
5. `experimental.inlineCss` was tried and reverted: Next serialises the
   inlined sheet into the RSC payload too, so the homepage HTML grew from
   220 KB to 383 KB and first paint moved later.

## Manual steps

1. **Search Atlas.** In the OTTO project for `www.jobsafe.cloud`
   (`09a87fea-bb62-4d82-a03e-d09e7a4ad5b2`): disengage or freeze the
   project, turn autopilot off, and undeploy every fix type the script used
   to apply — `page_title`, `meta_description`, `h1`, `nlp_faq` (the hidden
   30-question FAQ and second FAQPage schema), `missing_keywords` (the
   hidden keyword list with "job safe pro") and the injected paragraphs on
   About, Academy, Insights, Privacy, Terms and every article. Keep the
   project only if it is wanted for tracking; the site no longer loads its
   script either way.
2. **Vercel.** Set the domain-level redirect `jobsafe.cloud` →
   `www.jobsafe.cloud` (308). The app now does this itself, but the edge
   should do it first.
3. **Legal sign-off** on `app/privacy-policy/page.tsx` (new sections:
   analytics, chat widget, newsletter, toolkit leads, Calendly, billing, the
   sub-processor table; dated 25/09/2026) and `app/cookies/page.tsx`. Add
   the company number and ICO registration number if they are to be shown;
   none was invented.
4. **Wordmark SVG.** Design owes a vector of the wordmark on light. The PNG /
   WebP exports came from the strategy artifact's 600×194 raster; nothing
   was traced by hand.
5. **Brochure.** `public/jobsafe-brochure.pdf` prints 0333 8000 880; the
   site says 0333 8000 883. Reissue the PDF.
6. **GA4.** The property `G-72H4Q5HDVL` now receives data only from
   consenting visitors; expect the drop.

## Images to replace

All of these are the old site's dark-graded or product-generated imagery,
kept for now and framed on light. Replace with colour, natural-light
photographs of UK yards, depots, sites and vans, with people working.

| Asset | Where | Replace with |
| --- | --- | --- |
| `public/images/jobsafe-hero-duo.png` | Home hero | Real product screens on real phones (Phase 2 supplies the screens). |
| `public/videos/healthcare-hero.mp4` + poster | Healthcare hero | Colour clip of care staff at a shift handover or on a home visit. |
| `public/videos/window-fitter-hero.mp4` + poster | Window & door fitters hero; home industries card | Colour clip of fitters on a job with the van in shot. |
| `public/images/industries/field-services-hero.jpg` | Field services hero | Engineer at a customer site, natural light. |
| `public/images/industries/transport-logistics-hero.jpg` | Transport hero | Yard, tail lift, banksman. |
| `public/images/industries/{construction,energy,facilities,field-services,healthcare,logistics,manufacturing}.png` | Home industries grid | One colour photograph per sector. |
| `public/images/screens/employee-app.png`, `jobsafe-admin-dashboard.png` | How it works, all incidents | Phase 2 product screenshots (real UI only). |
| `public/toolkit/jobsafe-phones.png`, `jobsafe-lockup.png` | Toolkit | Re-export on light once the vector wordmark exists. |
| `public/images/og-image.png` | Fallback OG | Regenerated from `/opengraph-image`; replace the wordmark inside it when the SVG arrives. |
| YouTube thumbnail of the product film (`EWk11JQAjqA`, `CqywS1hnPvw`) | Academy featured film, home "See how it works" | The uploads' own thumbnails are the dark brand on black; set a light custom thumbnail in YouTube Studio, or pass a `poster` from `public/` to `LessonPlayer`. |

Unreferenced files left in `public/` for a human to delete or keep:
`images/Jobsafe Logo Design 1.png`, `images/jobsafe_logo-removebg-preview.png`
(the white-lettered logo), `images/jobsafe-js-mark.png`,
`toolkit/jobsafe-js-mark.png`, `toolkit/jobsafe-lockup.png`,
`toolkit/jobsafe-phones.png`, `toolkit/og-toolkit.png` (the toolkit OG image
is now generated). The create-next-app sample SVGs (`file`, `globe`, `next`,
`vercel`, `window`) are deleted. `googlece15d21ec80f1d0d.html` is the Search
Console verification and stays.

## Not done, and why

- **21st.dev Logo Cloud Marquee and Scroll Reveal** could not be fetched:
  the free tier allows two component reads a day and both were spent on the
  Navigation Menu and Background Grid Beam. `FactStrip` / `Marquee` and
  `Reveal` were built from the same patterns and restyled to the tokens;
  swap in the references later if there is a reason to.
- **`Jobmate-ltd/jobsafe` has no `docs/website-strategy/`** on its default
  branch, so the wordmark was recovered from the strategy artifact's
  embedded image instead of the named file.
- **Lighthouse is a single run** per route on a shared machine, not a lab
  median. The margin on the homepage is a few points; treat 90 as a floor to
  keep, not a ceiling reached.

## How to run everything

```
npm run lint && npm run typecheck && npm test && npm run build
npm run start &                          # production server on :3000
npm run test:e2e                         # axe ×3 widths + consent gate
node scripts/lighthouse-routes.mjs       # needs Chrome; CHROME_PATH=…
node scripts/consent-network-log.mjs     # the PECR proof
node scripts/screenshot-routes.mjs --out docs/screenshots/<phase>/after --consent reject --banner
node scripts/axe-route.mjs /path 320     # one route, one width, failing nodes
npm run lastmod                          # refresh lib/routes.ts dates from git
```

On a machine with a pre-installed Chromium and no download access, set
`PLAYWRIGHT_CHROMIUM_PATH` (Playwright) and `CHROME_PATH` (Lighthouse).
