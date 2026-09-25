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
node scripts/seo-check.mjs --flag on --compare off

NEXT_PUBLIC_PLATFORM_LAUNCH=true NEXT_PUBLIC_COMPARE_PAGES=true npm run build && npm run start &
node scripts/seo-check.mjs --flag on --compare on

npm run build && npm run start &
node scripts/seo-check.mjs --flag off
```

Against a running production build it checks, per row: `<title>`, meta
description and the single H1 equal the row for that state; the canonical
is self-referencing; a page that does not exist in that state is a 404
(every launch-only page with the flag off, the comparisons with
`--compare off`, a module page whose Phase 3 input in `lib/brand.ts` is
false); with the flag on every declared link is inside `<main>` and every
platform page that exists has ≥ 3 in / ≥ 3 out, counted over the registry
filtered to the pages that exist (`registryFor()`); and in both states
every URL that existed before Phase 2 still returns 200. It exits 1 on any
miss and runs in CI for all three states.

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

## 8. Phase 3: modules, industries, tools and comparisons

Twenty-two rows joined the map on 25/09/2026, each with the title, meta
description and H1 the Phase 3 brief set verbatim: the seven remaining
module pages and the two gated ones, the seven industry pages (four rebuilt,
three new), the `/tools` hub and its three tools, and the `/compare` hub and
its three comparisons. The four rebuilt industry rows carry a `prelaunch`
copy of their Phase 1 metadata so the flag-off render is unchanged; the
comparison rows carry `compare: true` and the two gated module rows carry
`gated: <input>`, which `seo-check` reads to expect a 404 in the states
where those pages do not exist.

### Who owns which query

Two pages must never compete for the same query. The owner is the page
whose title and H1 carry the phrase; the other page links to it and does
not use the phrase in its title.

| Query | Owner | Not the owner |
| --- | --- | --- |
| riddor reportable incidents, is it riddor reportable | `/tools/riddor-checker` | `/insights/riddor-reporting-explained` (links the checker) |
| riddor reporting, what is riddor | `/insights/riddor-reporting-explained` | `/tools/riddor-checker` |
| riddor reporting software (software intent) | `/platform/riddor` | both of the above (they link it) |
| accident investigation, how to investigate | `/insights/how-to-investigate-a-workplace-accident` | `/platform/investigations` |
| incident investigation software (software intent) | `/platform/investigations` | the article (it links the module) |
| 5x5 risk matrix, risk matrix calculator | `/tools/risk-matrix` | `/platform/risk-assessments` (links the tool) |
| five steps to risk assessment | a Phase 4 guide | `/tools/risk-matrix` (explains the five steps, links HSE) |
| accident frequency rate calculation | `/tools/accident-frequency-rate` | `/industries/transport-logistics` (links the tool) |
| bowtie diagram, bowtie analysis | `/platform/bowtie-analysis` | `/platform/risk-assessments` (links it both ways) |
| <competitor> alternative | `/compare/<competitor>` | `/pricing` (links the hub) |

### Internal-link rules

- Every module page links `/platform`, its connected modules, every other
  live module page (the "rest of the platform" list), the industries it is
  "built for", the tool that runs its logic, its cluster articles and
  `/demo`. The bowtie page and `/platform/risk-assessments` link each other.
- Every industry page links the module behind each of its six pains, two
  tools, `/platform` and `/demo`. The homepage links all seven industries.
- Every tool links the module it is built from, its article(s), the other
  two tools, the hub and `/demo`. Articles that cluster around a tool link
  it back through `ModuleBacklink`.
- Every comparison links `/pricing`, `/demo`, the hub, its two siblings,
  the modules its rows cite, `/security` and `/platform/offline`.
- Gated module pages (`/platform/checklists`, `/platform/contractors`) are
  in the registry so their links are ready the day they exist; until then
  `registryFor()` drops them everywhere.
- Every new page has ≥ 3 contextual links in and out; `seo-check` proves it.

### Schema by page type

| Page type | Nodes |
| --- | --- |
| Module page, industry page | `SoftwareApplication` (the platform node) + `BreadcrumbList`; the FAQ component adds `FAQPage` |
| Tool | `WebApplication` (its own `@id`, free, no rating) + `HowTo` (built from the rendered steps) + `BreadcrumbList` + `FAQPage` |
| Tools hub, compare hub | `ItemList` + `BreadcrumbList` |
| Comparison | `BreadcrumbList` + `FAQPage`; no node of any kind for the competitor, no rating |

`schema-check` validates the required properties of every node on every
route in the state under test, including the comparisons with
`--compare on`.

### Comparative advertising

The comparison pages follow CAP Code section 3, rules 3.32 to 3.43: every
competitor claim carries its source URL and the date it was checked, the
pages say where the competitor is better, no competitor is rated, and no
competitor logo or screenshot appears. Competitor-side copy lives in the
fields `scripts/claims-check.mjs` names in `COMPETITOR_FIELDS` and renders
inside elements marked `data-claims="competitor"`, so the checker scans
only what the pages say about jobsafe. `docs/MONITORING.md` lists the
pages to re-check and the rows each one affects.

### Publications to pitch

Five titles whose readers are the buyers these pages are written for, each
with the page that fits its audience:

1. Transport Operator (hauliers, transport managers): `/industries/transport-logistics` and the accident frequency rate calculator.
2. SHP (safety and health practitioners): the RIDDOR checker and `/platform/bowtie-analysis`.
3. IOSH Magazine (members, mostly practitioners): the 5×5 risk matrix calculator and the RIDDOR checker.
4. Logistics UK, the association's member titles: `/industries/transport-logistics` and `/platform/fleet-compliance`.
5. RHA's Roadway (Road Haulage Association members): `/industries/transport-logistics` and the walkaround-to-action story.

A pitch offers the tool or the page as a resource the title can link, not
a product announcement.
