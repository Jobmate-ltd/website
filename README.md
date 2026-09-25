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
| `npm run test:e2e` | Playwright: axe (WCAG 2.2 AA) on every route at 320 / 768 / 1280, and the consent gate |
| `node scripts/lighthouse-routes.mjs` | Lighthouse on home, an industry page and an article, with the Phase 1 targets |
| `node scripts/consent-network-log.mjs` | Proves nothing non-essential loads before consent |
| `node scripts/screenshot-routes.mjs` | Every route at 1440 and 390 |
| `node scripts/axe-route.mjs /path 320` | One route, one width, the failing nodes |
| `npm run lastmod` | Refresh sitemap `lastmod` dates from git |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, the audit, the
build and the Playwright suite on every pull request.

## Where things live

| Concern | Path |
| --- | --- |
| Every price, URL, phone number, trial rule, launch flag | `lib/brand.ts` (the only place) |
| Nav and footer | `lib/site.ts` |
| Routes and sitemap dates | `lib/routes.ts` |
| Tokens, type roles, motion | `app/globals.css` |
| Metadata, Open Graph, JSON-LD | `lib/seo.ts`, `lib/og.tsx`, `lib/schema.ts` |
| Consent | `lib/consent.ts`, `components/site/consent-banner.tsx` |
| Component set | `components/ui/*`, `components/site/*` |
| Articles, lessons | `lib/insights.ts`, `lib/academy.ts` |
| Build guards | `scripts/seo-audit.mjs`, `test/*.test.mjs` |
