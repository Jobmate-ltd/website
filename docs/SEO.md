# Search: how this site's SEO is built and checked

Phase 1 fixed the technical layer (canonicals, Open Graph, sitemap dates,
one price, no hidden text). Phase 2 added the keyword map, the link
registry and a checker that proves the served pages match both. This file
is the reference for all of it. `docs/SEO-P0.md` is the earlier audit that
led here.

## 1. The keyword map

`content/seo/keyword-map.json` has one row per page that is targeted in
search. Each row carries:

| Field | Meaning |
| --- | --- |
| `path` | The page. Never changes once published. |
| `phase` | The phase the page arrives in. A Phase 2 row is a 404 while the launch flag is off. |
| `primary`, `supporting` | The keyword the page is written for and the ones its H2s pick up. Volumes are UK monthly searches; `null` where the tool had none. |
| `title`, `description`, `h1` | The exact copy the page must render after launch. |
| `prelaunch` | For a page that already exists, the copy it renders while the flag is off (the Phase 1 state). |
| `paa` | "People also ask" questions the page's FAQ answers, answer-first. |

**The row wins.** If a brief, a draft or a designer's mock disagrees with a
row on title, meta description or H1, the row is what ships. Change the row
first, in its own commit, if it is wrong.

Rules for copy on the page itself:

- the primary keyword appears in the first 100 words;
- supporting keywords go in H2s where they read naturally, never forced;
- one H1 per page, equal to the row;
- descriptions state what the page offers and end on an action.

## 2. `buildMetadata()`

```ts
import { buildMetadata } from '@/lib/seo'
export const metadata = buildMetadata('/platform/riddor')
```

`buildMetadata(path)` (lib/seo/index.ts) looks the path up in the map,
chooses the pre-launch or post-launch row for the current value of
`NEXT_PUBLIC_PLATFORM_LAUNCH`, and passes it to `pageMetadata()`
(lib/seo/metadata.ts), which produces the self-referencing canonical, the
Open Graph block and the Twitter card the same way for every route. The
title is used verbatim.

`h1For(path)` returns the H1 for the same state so the page and the map
cannot drift.

A page that is not in the map (an article, a legal page) calls
`pageMetadata()` directly with its own copy. `npm run seo:audit` fails any
page under `app/` that uses neither.

Open Graph images come from `opengraph-image.tsx` next to each page,
rendered by `lib/og.tsx` from the tokens. Copy the file from a sibling
route when adding a page.

## 3. Schema

`lib/schema.ts` is the only place JSON-LD is written:

| Page | Nodes |
| --- | --- |
| Every page (root layout) | `Organization`, `WebSite` |
| Home, `/platform`, module pages | `SoftwareApplication` (`operatingSystem`: "Web (installable on iOS and Android)", no store links; `offers` only when `PRICE_BOOK` has prices) |
| Sub-pages | `BreadcrumbList` |
| Any page with a FAQ | `FAQPage`, emitted by the FAQ component from the array it renders |
| Articles | `BlogPosting` |
| `/pricing` | `offers` from `PRICE_BOOK`, only if prices are set |

Never hand-write JSON-LD in a page; never add `aggregateRating`, ratings
or review counts.

## 4. The link registry

`lib/seo/links.ts` declares the contextual links each page renders — the
ones in its own copy, not the header or footer:

- `linksFrom(path)` — what a page links to; module pages render their
  "Connected to" row and cluster articles from it;
- `linksTo(path)` — who links to a page;
- `moduleFor(article)` — the module an article clusters around.

Every Phase 2 page has at least three contextual links in and three out.
Add a page to the registry when you add it to the map.

## 5. `scripts/seo-check.mjs`

```
NEXT_PUBLIC_PLATFORM_LAUNCH=true npm run build && npm run start &
node scripts/seo-check.mjs --flag on

npm run build && npm run start &
node scripts/seo-check.mjs --flag off
```

Against a running production build it checks, per row: `<title>`, meta
description and the single H1 equal the row for that state; the canonical
is self-referencing; with the flag off every launch-only page is a 404;
with the flag on every declared link is inside `<main>` and every Phase 2
page has ≥ 3 in / ≥ 3 out; and in both states every URL that existed before
Phase 2 still returns 200. It exits 1 on any miss and runs in CI for both
states.

## 6. Build-time guards

`npm run seo:audit` (scripts/seo-audit.mjs) runs before every build. The
rules that matter for search: `brand-casing`, `meta-keywords`,
`aggregate-rating`, `price-literal`, `sitemap-fragments`,
`og-image-dimensions`, `meta-description`, `no-checklists`, `single-offer`,
`faq-server-rendered`, `canonical-trailing-slash`, `otto-script`,
`unsourced-number`, `maker-line`, `vat-shown`, `canonical-everywhere`.
Change a rule in the same PR as the change that needs it, and say why.

Two rules were re-scoped in Phase 2, because the platform has what the
incident-reporting product did not:

- `no-checklists` now guards the live (flag-off) surfaces only. Files in
  `PLATFORM_ONLY_PATHS` are skipped, and the shared files that carry a
  platform-only value (`lib/brand.ts`, `lib/schema.ts`, `lib/site.ts`,
  `components/site/chat-widget.tsx`, `app/llms.txt/route.ts`) opt out with
  a reasoned `seo-audit-ignore: no-checklists` comment.
- `faq-server-rendered` follows an import of `@/components/ui/accordion`
  and audits that primitive for `forceMount` and the `h-0` collapse, so a
  FAQ built on the shared accordion is held to the same rule as one that
  inlines it.

Two more checks run against a served build (both flag states, in CI):

- `npm run schema:check -- --flag on|off` parses every JSON-LD block on
  every route and validates each node's required properties, breadcrumb
  URLs (must resolve 200), FAQ text (must be in the HTML), the platform
  `operatingSystem` string and the absence of ratings and store links on
  the `SoftwareApplication` node.
- `npm run claims:check [-- --base URL]` proves no platform copy, JSON-LD
  or `llms.txt` line claims anything on the "never" or "once built" lists,
  and reports every Sign up / Log in / Book a demo destination and every
  external host the pages link to.

## 7. The launch-flag runbook

`NEXT_PUBLIC_PLATFORM_LAUNCH` stays off in production until a person flips
it. When they do:

1. Turn the flag on and redeploy. `buildMetadata()` switches every page to
   its post-launch row, the sitemap adds the new routes, the rewrites that
   hid them are dropped, and the nav, footer, chat widget, `llms.txt` and
   industry pages switch to their platform variants.
2. Submit the sitemap in Search Console. Request indexing for `/`,
   `/platform`, the four module pages and `/pricing`.
3. Run `node scripts/seo-check.mjs --flag on --base https://www.jobsafe.cloud`,
   `node scripts/schema-check.mjs --flag on --base https://www.jobsafe.cloud`
   and `node scripts/claims-check.mjs --base https://www.jobsafe.cloud`
   against production.
4. Watch coverage and queries daily for two weeks, then weekly for two
   months, against the Phase 1 baseline.
5. Don't flip it on a Friday.

Pointing Sign up and Log in at the platform, and adding a live demo, are
separate decisions made after the flag, not with it.
