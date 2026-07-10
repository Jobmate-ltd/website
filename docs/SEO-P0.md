# P0 — SEO foundations

**Date:** 09/07/2026 · **Against:** live `jobsafe.cloud` HTML + the repository at HEAD

This sprint closes P0-3 through P0-7 of the SEO Operating Instructions, fixes
three defects the operating instructions do not list, and corrects three of its
factual claims.

---

## 1. Corrections to the operating instructions

Re-baseline §2 and §3.4 before quoting them again. Three statements are wrong.

### T1 — "fabricated testimonials on the homepage" — **not present**

The instructions describe testimonials from Crestline Energy, Apex Build Group,
Triton Utilities, Vantage Facilities, Summit Field Services and Ironside
Manufacturing as "a live liability on the homepage right now", and escalate them
to Chris and Wendy as the single most urgent item.

There is no testimonials component in the repository. `app/page.tsx` renders
twelve sections and none of them is one. The live HTML served from
`https://www.jobsafe.cloud/` on 09/07/2026 contains no testimonial, no customer
name, and no logo wall. The claim appears to describe an earlier draft, or the
`_legacy/index.html` static site, which is not deployed.

**P0-1 is already closed.** Nobody needs to escalate anything. Confirm against a
fresh crawl before you tell Chris and Wendy otherwise.

### §3.3 — "`/insights` exists as an empty shell" — **not true**

`/insights` has three published articles, all substantial and all sourced to
primary references (HSE INDG73, the Management of H&S at Work Regulations 1999,
HSE violence-at-work statistics, BS 8484):

| Slug | Words | Sources |
|---|---|---|
| `/insights/riddor-reporting-explained` | long-form | HSE RIDDOR |
| `/insights/near-miss-reporting-safety-culture` | long-form | HSG65, HSE cost data |
| `/insights/lone-worker-safety-guide` | long-form | INDG73, MHSWR 1999, BS 8484 |

They have `BlogPosting` + `BreadcrumbList` schema, canonical URLs, and correct
`en-GB` date formatting. Somebody did good work here.

**This changes the P2 plan.** The Tier 3 list proposes `/insights/what-is-riddor`
and `/insights/riddor-regulations-explained` as new URLs. Both would cannibalise
`/insights/riddor-reporting-explained`, which already targets that intent. Do not
build them. Expand the existing article and add `HowTo`/`FAQPage` blocks to it
instead — one strong URL beats three overlapping ones. Same for
`/insights/why-report-near-misses` against
`/insights/near-miss-reporting-safety-culture`, and for `/lone-worker-safety-app`,
which now has a natural internal link waiting for it.

### §2.3 — "The entire commercial site is four routes"

Five, once `/about` ships. And `app/sitemap.ts` and `app/robots.ts` already
existed — P0-5 was half-done. The sitemap was, however, broken. See T11.

---

## 2. Defects fixed

The instructions' own list, T1–T9, plus three found in the code.

| # | Defect | Status |
|---|---|---|
| T1 | Fabricated testimonials | **Does not exist.** See above. |
| T2 | Meta says £2.75, entry tier is £3.00 | Fixed. One price, from `lib/brand.ts`. |
| T3 | "6 months free" vs "3-day free trial" | **Blocked on Adam.** Counter removed; see T10. |
| T4 | `alt="The JobSafe app…"`, `alt="JobSafe"` | Fixed. Patch 2, 3. |
| T5 | `og:image` 1203×633 | Metadata fixed; **asset must be regenerated.** |
| T6 | Canonical missing trailing slash | Fixed. `CANONICAL_HOME`. |
| T7 | FAQ answers not server-rendered | **Confirmed, and fixed.** See below. |
| T8 | `<meta name="keywords">`, 15 terms | Deleted. |
| T9 | Zero videos | Out of scope for P0. Stays in P3. |
| **T10** | **Simulated scarcity counter** | **New. Removed.** |
| **T11** | **Sitemap contains fragment URLs** | **New. Removed.** |
| **T12** | **`aggregateRating` 4.8 / 47 reviews in live JSON-LD** | **New. Removed.** |

### T7 — why the FAQ answers are missing, precisely

`components/sections/FAQ.tsx` is a client component. Its accordion state starts
at `''`, so every item is closed on first render, and Radix's
`<Accordion.Content>` **unmounts** when closed. The server-rendered HTML
therefore contains six questions and zero answers. That is why the Brand Vault
crawl and the live fetch both show `QDoes jobsafe work without internet? +` and
nothing else.

Adding `FAQPage` schema in that state would have declared answer text that does
not appear on the page — invalid markup under Google's structured data policy,
and grounds for a manual action. The instructions were right to gate P0-4 on
this.

The fix (patch 1) sets `forceMount` so the answers land in the HTML collapsed to
zero height — which Google explicitly permits for accordions — and emits the
`FAQPage` JSON-LD **from inside `FAQ.tsx`, off the same array it renders**. The
schema and the visible text are now the same text, by construction. They cannot
drift. That is stronger than §5.2 asks for and it costs nothing.

### T10 — the scarcity counter

`LaunchTicker.tsx` rendered *"the first 200 sign-ups get 6 months free · 200
spots remaining"*. The number was not real. It was computed:

```ts
const START = 200
const FLOOR = 11 // keep some urgency; never hit zero
const WINDOW_DAYS = 30 // deplete 200 → FLOOR across ~30 days
```

A deterministic countdown, floored so it never reaches zero, unconnected to any
sign-up. That is a fabricated statistic under §0.7 of your own rules. It is also,
presented to a consumer as remaining availability, the sort of false-urgency
claim the Digital Markets, Competition and Consumers Act 2024 and the CPUTRs
treat as a banned commercial practice — on the homepage of a product sold to
compliance professionals.

I did not make it accurate. I removed it. `LaunchTicker` is now a server
component with no state, no timer, and one line of copy read from
`LAUNCH_OFFER` in `lib/brand.ts`.

### T12 — the star rating

`app/layout.tsx` shipped this to every page on the site:

```json
"aggregateRating": { "ratingValue": "4.8", "reviewCount": "47" }
```

jobsafe has no reviews. It is absent from G2, Capterra, GetApp and Software
Advice, and the App Store reports "not enough ratings". §8 of the instructions
forbids exactly this, and the instructions never noticed it was already live.
Removed, and the audit now fails the build if it returns.

---

## 3. What shipped

```
lib/brand.ts                  new   single source of truth: NAP, pricing, offers, sameAs
lib/schema.ts                 new   every JSON-LD node, built from lib/brand.ts
app/layout.tsx                rw    -meta-keywords, -aggregateRating, +Organization, +WebSite
app/page.tsx                  rw    +SoftwareApplication
app/about/page.tsx            new   P0-7 entity disambiguation, ~940 words
app/sitemap.ts                rw    -fragment URLs, +route manifest, +/about
app/robots.ts                 rw    +disallow /api/
scripts/seo-audit.mjs         new   11 rules, zero dependencies
test/seo.test.mjs             new   33 tests
patches/PATCHES.md            new   8 surgical edits to files not replaced wholesale
patches/LaunchTicker.tsx      new   replacement, counter removed
```

### `package.json`

```diff
   "scripts": {
     "dev": "next dev",
-    "build": "next build",
+    "build": "npm run seo:audit && next build",
     "start": "next start",
-    "lint": "eslint"
+    "lint": "eslint",
+    "test": "node --test \"test/*.test.mjs\"",
+    "seo:audit": "node scripts/seo-audit.mjs"
   },
```

Wiring `seo:audit` into `build` is the point of the whole exercise. Every defect
above is now a build failure if reintroduced, on Vercel as well as locally.

### Audit rules

`brand-casing` · `meta-keywords` · `aggregate-rating` · `price-literal` ·
`sitemap-fragments` · `og-image-dimensions` · `meta-description` ·
`no-checklists` · `single-offer` · `faq-force-mount` · `canonical-trailing-slash`

A file may opt out of one rule with `// seo-audit-ignore: <rule>`, which forces
the author to write down why. `app/about/page.tsx` uses it twice, correctly: it
names the competing `jobsafe` entities in their own casing, and it states that
jobsafe has no checklists module.

---

## 4. Still needs a human

Four things I could not and should not do alone.

**P0-2 — which offer is real?** *(Adam)*
The ticker promised six months free. The pricing section promises a 3-day trial
with no card. The Chargebee configuration reportedly requires a card at signup,
so the site may currently be advertising two offers, neither of which is true.
The ticker's promotional copy is disabled until you say. Set
`LAUNCH_OFFER.enabled = true` **and** delete the trial line from `Pricing.tsx` if
the promotion is real — the audit fails if both are live. Reconcile
`TRIAL.cardRequired` against Chargebee either way.

**T5 — regenerate the og:image.** *(Harrison)*
`public/` was not in the repository I was given, so I could not resize it. The
metadata now declares 1200×630 and the audit reads the PNG header and fails the
build until the asset matches:

```bash
npx sharp-cli -i public/images/og-image.png -o public/images/og-image.png resize 1200 630 --fit cover
```

**`twitter:site` points at an account that may not exist.** *(Adam)*
The site declared `@jobsafecloud`. The verified handle in the footer and in
`sameAs` is `@JobmateCloud`. I have changed it to the one that resolves. If a
jobsafe-specific account exists, put it in `lib/brand.ts` and nowhere else.

**P0-8 — claim G2, Capterra, GetApp, Software Advice.** *(Adam)*
Nothing in this sprint substitutes for it. Gemini and Google AI Mode sit at 0%
visibility, and their citation sources skew hard towards review-platform-
corroborated entities. The `Organization` schema shipped here is half the signal;
those four listings are the other half. Add each claimed profile URL to `SAME_AS`.

---

## 5. Verify before logging the GSC event

Do not run `gsc_create_event` until all six pass. An event logged against a
half-deployed change corrupts the attribution dataset for ninety days, and §7.2
is right that the dataset is the only thing that will let you attribute a ranking
move to a cause in three months' time.

1. `npm test` — 33 passing.
2. `npm run seo:audit` — clean, zero warnings once `public/` is present.
3. `curl -s https://www.jobsafe.cloud/ | grep -c 'stores reports locally'` → ≥ 1
   *(the FAQ answers are now in the HTML)*
4. `curl -s https://www.jobsafe.cloud/ | grep -c 'name="keywords"'` → 0
5. `curl -s https://www.jobsafe.cloud/ | grep -c 'aggregateRating'` → 0
6. Rich Results Test on `/` → valid `Organization`, `WebSite`,
   `SoftwareApplication`, `FAQPage`. On `/about` → those plus `BreadcrumbList`.

Then, and only then:

```
gsc_create_event(mode='automatic', is_sitewide=true,
                 name='SEO foundations — schema, sitemap, entity fixes')
```

and submit `https://www.jobsafe.cloud/sitemap.xml` in Search Console.

Twenty-eight days later:

```
gsc_compare_performance(property='https://www.jobsafe.cloud/',
                        event_date='<deploy date>', days_before=28, days_after=28)
```

---

## 6. A note on sequencing

§6 puts the seven industry pages at P1 and calls them "the highest-leverage
change on the site". I do not think that is right, and the instructions half-know
it — §5.6 marks entity disambiguation as P0 and then buries the industry pages
above it in the backlog.

`jobsafe` sits at position 11 in the UK for its own exact brand name, behind a
New Zealand platform with twenty years of authority, a separate product called
jobsafe Pro, a Swedish entity, and a Polish glove brand. Roughly 90% of
impressions are brand or brand-adjacent, and a meaningful slice of those belong
to somebody else. Seven industry pages compete for keywords nobody currently
associates with us. `/about`, consistent NAP, `sameAs`, and four directory
listings fix *who we are* — which is upstream of every other ranking on the site,
and upstream of the 0% Gemini visibility in particular.

Entity first. Then industry pages. The industry pages will rank better for having
waited.
