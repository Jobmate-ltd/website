# www.jobsafe.cloud

The marketing site for jobsafe, the UK health, safety, security and
environment product made by Jobmate Ltd, Wolverhampton. Next.js App Router,
React 19, TypeScript, Tailwind v4.

jobsafe is always lowercase, including at the start of a sentence.

## Start here

- `docs/REBUILD.md` — the standing brief: positioning, claims ladder, voice,
  the design system and the build rules every phase follows.
- `docs/PHASE-1.md` — what Phase 1 changed, measured and left for a human.
- `AGENTS.md` — read the Next.js docs in `node_modules/next/dist/docs/`
  before using an API; this version has breaking changes.

## Run it

```
npm ci
npm run dev          # http://localhost:3000
```

`TOOLKIT_DOWNLOAD_SECRET` (32+ characters) is needed for the toolkit
download route; the other environment variables are documented where they
are read (`lib/brand.ts`, `lib/newsletter.ts`, `lib/toolkit/leads.ts`).

## Check it

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests for the constants, routes, consent store and every audit rule |
| `npm run seo:audit` | The build guard: brand casing, one price with VAT, no OTTO script, no colour literals outside `app/globals.css`, no unsourced numbers, canonicals everywhere… |
| `npm run build` | `seo:audit` then `next build` |
| `npm run test:e2e` | Playwright: axe (WCAG 2.2 AA) on every route at 320 / 768 / 1280, the consent gate and, with `E2E_PLATFORM=on` against a flag-on build, the Phase 2 routes and the keyboard-only flows |
| `npm run seo:check -- --flag on\|off` | Against a running build: titles, descriptions, H1s and canonicals match `content/seo/keyword-map.json`; Phase 2 routes 404 with the flag off; ≥ 3 contextual links in and out with it on |
| `npm run schema:check -- --flag on\|off` | Against a running build: every JSON-LD node validates (required properties, breadcrumb URLs resolve, FAQ text is in the HTML) |
| `npm run claims:check [-- --base URL]` | Nothing on the "never" or "once built" lists in platform copy, JSON-LD or `llms.txt`; the Sign up / Log in / Book a demo destinations |
| `npm run capture:product` | Real product screenshots from the jobsafe demo seed into `public/product/` and `lib/product-images.ts` (see the script header) |
| `node scripts/lighthouse-routes.mjs [--routes phase-2]` | Lighthouse on the Phase 1 or Phase 2 route set, with the targets |
| `node scripts/consent-network-log.mjs` | Proves nothing non-essential loads before consent |
| `node scripts/screenshot-routes.mjs` | Every route at 1440 and 390 |
| `node scripts/axe-route.mjs /path 320` | One route, one width, the failing nodes |
| `npm run lastmod` | Refresh sitemap `lastmod` dates from git |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, the audit, the
claims check, the flag-off build with `seo:check` and `schema:check`, the
Playwright suite, and then a second build with
`NEXT_PUBLIC_PLATFORM_LAUNCH=true` with the same checks plus the Phase 2
routes and the keyboard flows, on every pull request.

## Where things live

| Concern | Path |
| --- | --- |
| Every price, URL, phone number, trial rule, launch flag | `lib/brand.ts` (the only place) |
| Nav and footer (both flag states) | `lib/site.ts` |
| Routes, sitemap dates, `platformOnly` | `lib/routes.ts` |
| Tokens, type roles, motion | `app/globals.css` |
| Metadata, Open Graph, JSON-LD | `lib/seo/` (`buildMetadata()` reads the keyword map), `lib/og.tsx`, `lib/schema.ts` |
| Keyword map and link registry | `content/seo/keyword-map.json`, `lib/seo/links.ts`, `docs/SEO.md` |
| Platform content model, module pages | `lib/platform.ts`, `lib/platform-modules.ts`, `components/platform/` |
| Product screenshots | `public/product/`, `lib/product-images.ts` (generated), `scripts/capture-product.mjs`, `assets/product-source/` |
| Analytics events, hero variants | `lib/analytics.ts`, `lib/hero-variants.ts` |
| Imported components and their licences | `docs/COMPONENTS.md` |
| Consent | `lib/consent.ts`, `components/site/consent-banner.tsx` |
| Component set | `components/ui/*`, `components/site/*` |
| Articles, lessons | `lib/insights.ts`, `lib/academy.ts` |
| Build guards | `scripts/seo-audit.mjs`, `scripts/claims-check.mjs`, `scripts/seo-check.mjs`, `scripts/schema-check.mjs`, `test/*.test.mjs` |
