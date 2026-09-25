#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — SEO and truth audit.
//
// Every defect fixed in the P0 sprint and in Phase 1 has a check here. The
// point is not to find problems once; it is to make it impossible to
// reintroduce them without the build going red.
//
// Zero dependencies. Runs on the Node already required to build the site.
//
//   npm run seo:audit          # human-readable report, exit 1 on any error
//   npm test                   # same checks, via node:test
//
// Escape hatch: a file may opt out of a single rule with a comment
//
//   // seo-audit-ignore: brand-casing
//
// which forces whoever writes it to say, in the file, why. Use it twice and you
// have a design problem, not a linting problem.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

/** Directories we never lint. `_legacy/` is a museum piece, not shipped code. */
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '_legacy', 'out', 'build', 'coverage'])
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.css'])

/** Files allowed to contain price literals: the source of truth, and the audit itself. */
const PRICE_LITERAL_ALLOWLIST = ['lib/brand.ts', 'scripts/seo-audit.mjs', 'test/seo.test.mjs']

/** The only file allowed to contain a colour literal (Workstream A). */
const COLOUR_LITERAL_ALLOWLIST = ['app/globals.css']

export const RULES = {
  BRAND_CASING: 'brand-casing',
  META_KEYWORDS: 'meta-keywords',
  AGGREGATE_RATING: 'aggregate-rating',
  PRICE_LITERAL: 'price-literal',
  SITEMAP_FRAGMENTS: 'sitemap-fragments',
  OG_IMAGE_DIMENSIONS: 'og-image-dimensions',
  META_DESCRIPTION: 'meta-description',
  NO_CHECKLISTS: 'no-checklists',
  CANONICAL_TRAILING_SLASH: 'canonical-trailing-slash',
  SINGLE_OFFER: 'single-offer',
  FAQ_SERVER_RENDERED: 'faq-server-rendered',
  // Phase 1
  OTTO_SCRIPT: 'otto-script',
  COLOUR_LITERAL: 'colour-literal',
  UNSOURCED_NUMBER: 'unsourced-number',
  TRIAL_CARD_CLAIM: 'trial-card-claim',
  MAKER_LINE: 'maker-line',
  VAT_SHOWN: 'vat-shown',
  CANONICAL_EVERYWHERE: 'canonical-everywhere',
}

// ── helpers ──────────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (SOURCE_EXTS.has(extname(entry))) out.push(full)
  }
  return out
}

function ignoresRule(source, rule) {
  return new RegExp(`seo-audit-ignore:\\s*${rule}\\b`).test(source)
}

/** Reads width/height from a PNG IHDR chunk. Returns null if not a PNG. */
export function pngDimensions(buffer) {
  const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(SIGNATURE)) return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

/** Every line of `source` matching `pattern`, as `{ line, text }`. */
function findLines(source, pattern) {
  const hits = []
  source.split('\n').forEach((text, i) => {
    if (pattern.test(text)) hits.push({ line: i + 1, text: text.trim() })
  })
  return hits
}

/** Generic "this pattern must not appear" rule over a file list. */
function forbid(files, root, { rule, pattern, message, skip = () => false, exts }) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (skip(rel)) continue
    if (exts && !exts.has(extname(file))) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, rule)) continue
    for (const { line, text } of findLines(source, pattern)) {
      violations.push({ rule, file: rel, line, message: `${message}: ${text.slice(0, 90)}` })
    }
  }
  return violations
}

const isTooling = (rel) => rel.startsWith('docs/') || rel.startsWith('patches/') || rel.startsWith('scripts/') || rel.startsWith('test/')

// ── the checks ───────────────────────────────────────────────────────────────

/**
 * Rule 1 (§0.1). The brand is `jobsafe`, lowercase, everywhere — copy,
 * headings, alt text, meta tags, JSON-LD, filenames, commit messages.
 *
 * Deliberately does not match `jobsafe` preceded by a word character, so
 * `JobsafeApp` style identifiers would still be caught, and does not match
 * inside a URL path segment where casing is not ours to choose.
 */
function checkBrandCasing(files, root) {
  // `Jobmate`/`JobMate` are a different, correctly-capitalised legal entity.
  return forbid(files, root, {
    rule: RULES.BRAND_CASING,
    pattern: /\b(JobSafe|Jobsafe|JOBSAFE|JobSAFE|Job Safe)\b/,
    message: 'brand must be lowercase `jobsafe`',
    exts: new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md']),
  })
}

/** Defect T8. Google has ignored `<meta name="keywords">` since 2009. */
function checkMetaKeywords(files, root) {
  // Post-level `keywords` in lib/insights.ts is content metadata, not a meta
  // tag — but a page that passes it INTO Next's metadata renders the tag.
  return forbid(files, root, {
    rule: RULES.META_KEYWORDS,
    pattern: /^\s*keywords:/,
    message: 'Next renders this as <meta name="keywords">, which is ignored by Google and signals a thin strategy',
    skip: (rel) => !rel.startsWith('app/'),
  })
}

/** §8. No self-declared star ratings. There are no reviews yet. */
function checkAggregateRating(files, root) {
  // As a property key or a quoted string — i.e. actually emitted. Prose in a
  // comment explaining why we do not use it is exactly the documentation we
  // want to keep.
  return forbid(files, root, {
    rule: RULES.AGGREGATE_RATING,
    pattern: /aggregateRating\s*[:=]|['"]aggregateRating['"]/,
    message: 'aggregateRating without verifiable third-party reviews is a manual-action risk and a false claim (§8). Claim G2/Capterra first',
    skip: (rel) => rel === 'scripts/seo-audit.mjs' || rel === 'test/seo.test.mjs',
  })
}

/** Defect T2. One price, from one place. */
function checkPriceLiterals(files, root) {
  return forbid(files, root, {
    rule: RULES.PRICE_LITERAL,
    pattern: /£\s?\d+\.\d{2}/,
    message: 'hard-coded price. Import from lib/brand.ts instead',
    skip: (rel) => PRICE_LITERAL_ALLOWLIST.includes(rel) || rel.startsWith('docs/') || rel.startsWith('patches/'),
  })
}

/** A URL fragment is not a URL. Sitemaps have no concept of one. */
function checkSitemapFragments(root) {
  const file = join(root, 'app/sitemap.ts')
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  return findLines(source, /url:.*#/).map(({ line, text }) => ({
    rule: RULES.SITEMAP_FRAGMENTS,
    file: 'app/sitemap.ts',
    line,
    message: `fragment URLs collapse to duplicates of the homepage: ${text.slice(0, 70)}`,
  }))
}

/** Defect T5. The spec is 1200×630. The asset once shipped at 1203×633. */
function checkOgImage(root) {
  const file = join(root, 'public/images/og-image.png')
  if (!existsSync(file)) {
    return [{ rule: RULES.OG_IMAGE_DIMENSIONS, file: 'public/images/og-image.png', line: 0, severity: 'warn', message: 'not found — cannot verify dimensions. Expected 1200×630.' }]
  }
  const dims = pngDimensions(readFileSync(file))
  if (!dims) return [{ rule: RULES.OG_IMAGE_DIMENSIONS, file: 'public/images/og-image.png', line: 0, message: 'not a valid PNG.' }]
  if (dims.width !== 1200 || dims.height !== 630) {
    return [{ rule: RULES.OG_IMAGE_DIMENSIONS, file: 'public/images/og-image.png', line: 0, message: `is ${dims.width}×${dims.height}, must be 1200×630. Regenerate it from the /opengraph-image route.` }]
  }
  return []
}

/**
 * §5.1. 140–158 chars, quotes the entry price WITH VAT shown, never the volume
 * rate, and ends on a concrete verb.
 */
export function checkMetaDescription(description) {
  const violations = []
  const len = description.length
  if (len < 140 || len > 158) {
    violations.push({ rule: RULES.META_DESCRIPTION, file: 'app/layout.tsx', line: 0, message: `description is ${len} chars, must be 140–158.` })
  }
  if (description.includes('£2.75')) {
    violations.push({ rule: RULES.META_DESCRIPTION, file: 'app/layout.tsx', line: 0, message: 'quotes the volume rate £2.75; a new customer pays the entry price. Snippet must match the landing page.' })
  }
  if (/£\d+\.\d{2}(?! \+ VAT)/.test(description)) {
    violations.push({ rule: RULES.META_DESCRIPTION, file: 'app/layout.tsx', line: 0, message: 'quotes a price without "+ VAT" beside it (Workstream C.4).' })
  }
  if (!/\b(Start|Report|Capture|Try|See)\b[^.]*\.$/.test(description)) {
    violations.push({ rule: RULES.META_DESCRIPTION, file: 'app/layout.tsx', line: 0, message: 'must end on a concrete verb (§5.1).' })
  }
  return violations
}

/**
 * Files that render only once `NEXT_PUBLIC_PLATFORM_LAUNCH` is on. With the
 * flag off (production today) every route in them answers 404 and the
 * build-time constant strips their imports, so a rule about what the live
 * site may claim does not apply to them. Kept as one list so the exemption
 * is visible and testable; add a path here only when the page or component
 * is gated by the flag, never because a rule is inconvenient.
 */
export const PLATFORM_ONLY_PATHS = [
  'app/platform/',
  'app/pricing/',
  'app/security/',
  'app/demo/',
  'app/contact/',
  'app/api/demo/',
  'components/platform/',
  'components/pricing/',
  'components/about/about-platform.tsx',
  'components/site/platform-header.tsx',
  'components/site/demo-form.tsx',
  'components/insights/module-backlink.tsx',
  'lib/platform.ts',
  'lib/platform-modules.ts',
  'lib/product-images.ts',
  'lib/demo/',
  'lib/seo/links.ts',
  'content/seo/',
]
export const isPlatformOnly = (rel) => PLATFORM_ONLY_PATHS.some((p) => (p.endsWith('/') ? rel.startsWith(p) : rel === p))

/**
 * §0.4, as re-scoped for Phase 2. The incident-reporting product sold on the
 * live site has no checklists feature, so no Phase 1 surface may claim one.
 * The platform behind `NEXT_PUBLIC_PLATFORM_LAUNCH` does have a Checklists &
 * inspections module, so the word is allowed in the platform-only files
 * (PLATFORM_ONLY_PATHS) and, with a stated reason, in the shared constants
 * files that carry a platform-only value next to Phase 1 ones.
 */
function checkNoChecklists(files, root) {
  return forbid(files, root, {
    rule: RULES.NO_CHECKLISTS,
    pattern: /\bchecklists?\b|\bform builder\b/i,
    message: 'the live product has no checklists feature (§0.4); only the platform behind NEXT_PUBLIC_PLATFORM_LAUNCH does. Keep the word in a platform-only file (PLATFORM_ONLY_PATHS) or, for a deliberate negative claim or a platform constant in a shared file, add "seo-audit-ignore: no-checklists" and say why',
    skip: (rel) => isTooling(rel) || isPlatformOnly(rel),
  })
}

/** Defect T3. Exactly one offer may be live. */
function checkSingleOffer(root) {
  const brandFile = join(root, 'lib/brand.ts')
  const pricingFile = join(root, 'components/site/pricing.tsx')
  if (!existsSync(brandFile)) return []
  const brand = readFileSync(brandFile, 'utf8')
  const launchEnabled = /LAUNCH_OFFER\s*=\s*\{[^}]*enabled:\s*true/s.test(brand)
  if (!launchEnabled) return []
  const trialVisible = existsSync(pricingFile) && /free trial|TRIAL\.label|trialSentence/i.test(readFileSync(pricingFile, 'utf8'))
  if (trialVisible) {
    return [{ rule: RULES.SINGLE_OFFER, file: 'lib/brand.ts', line: 0, message: 'LAUNCH_OFFER.enabled is true while the pricing section still advertises the free trial. Two contradictory offers ~400px apart (defect T3). Retire one.' }]
  }
  return []
}

/**
 * Defect T7. FAQPage is only valid if the answers are in the HTML. Any
 * component that emits `faqPageSchema` must render the answers server-side:
 * either a native <details> (collapsed by the browser, never unmounted) or a
 * Radix accordion with `forceMount` and the `data-[state=closed]:h-0` collapse.
 */
const SHARED_ACCORDION = 'components/ui/accordion.tsx'
const SHARED_ACCORDION_IMPORT = /from\s+['"]@\/components\/ui\/accordion['"]/

function checkFaqServerRendered(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (!rel.startsWith('components/')) continue
    let source = readFileSync(file, 'utf8')
    if (!/faqPageSchema\(/.test(source)) continue
    // Since Phase 2 the collapse may live in the shared shadcn/ui accordion
    // the component imports; audit that primitive as part of this file.
    if (SHARED_ACCORDION_IMPORT.test(source)) {
      const shared = join(root, SHARED_ACCORDION)
      if (existsSync(shared)) source += '\n' + readFileSync(shared, 'utf8')
    }
    const usesDetails = /<details\b/.test(source)
    const forcesMount = /forceMount/.test(source)
    if (!usesDetails && !forcesMount) {
      violations.push({ rule: RULES.FAQ_SERVER_RENDERED, file: rel, line: 0, message: 'emits FAQPage schema but the answers are not in the server-rendered HTML. Use <details>, or forceMount with a CSS collapse (in the file or in components/ui/accordion.tsx).' })
    } else if (forcesMount && !usesDetails && !/data-\[state=closed\]:h-0/.test(source)) {
      violations.push({ rule: RULES.FAQ_SERVER_RENDERED, file: rel, line: 0, message: 'forceMount without `data-[state=closed]:h-0` renders every answer open on first paint.' })
    }
  }
  return violations
}

/** §5.1. The homepage canonical must be self-referential and exact. */
function checkCanonicalTrailingSlash(root) {
  const file = join(root, 'lib/brand.ts')
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  const match = source.match(/CANONICAL_HOME\s*=\s*`?['"`]?([^'"`\n]*)/)
  const value = match?.[1] ?? ''
  if (!/\/`?$/.test(value.trim())) {
    return [{ rule: RULES.CANONICAL_TRAILING_SLASH, file: 'lib/brand.ts', line: 0, message: `CANONICAL_HOME must end with a trailing slash to match the served URL and the GSC property (defect T6). Got: ${value}` }]
  }
  return []
}

// ── Phase 1 rules ────────────────────────────────────────────────────────────

/**
 * Workstream C.1. The Search Atlas "OTTO" dynamic-optimisation script rewrote
 * titles and H1s in the browser, injected hidden AI-written text and a hidden
 * 30-question FAQ, and added a keyword list that included "job safe pro". It
 * must never come back, under any of its names.
 */
function checkOttoScript(files, root) {
  return forbid(files, root, {
    rule: RULES.OTTO_SCRIPT,
    pattern: /sa-dynamic-optimization|dynamic_optimization\.js|searchatlas\.com\/scripts|data-uuid="09a87fea/,
    message: 'Search Atlas OTTO dynamic-optimisation script. It rewrites pages in the browser and injects hidden text (Workstream C.1)',
    skip: isTooling,
  })
}

/**
 * Workstream A. app/globals.css is the only file allowed to contain a colour
 * literal. Components reach colour through the token utilities. The default
 * Tailwind palette is removed, so a `bg-black` or `text-white` silently does
 * nothing — which is exactly why it is also caught here.
 */
export const COLOUR_LITERAL = /(?:[:(,=\[\s'"`])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\(\s*\d/
export const DARK_UTILITY = /\b(?:bg|text|border|from|to|via|divide|ring|fill|stroke|outline|decoration|placeholder|accent|shadow)-(?:black|white|zinc-\d+|gray-\d+|slate-\d+|neutral-\d+|stone-\d+|red-\d+|surface-\d)(?:\/\d+|\/\[[^\]]+\])?\b/

function checkColourLiterals(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (COLOUR_LITERAL_ALLOWLIST.includes(rel) || isTooling(rel)) continue
    if (extname(file) === '.md') continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.COLOUR_LITERAL)) continue
    for (const { line, text } of findLines(source, COLOUR_LITERAL)) {
      violations.push({ rule: RULES.COLOUR_LITERAL, file: rel, line, message: `colour literal outside app/globals.css. Use a token utility or lib/tokens.ts: ${text.slice(0, 80)}` })
    }
    for (const { line, text } of findLines(source, DARK_UTILITY)) {
      violations.push({ rule: RULES.COLOUR_LITERAL, file: rel, line, message: `dark-world / default-palette utility. The palette is tokens only (bg-canvas, text-ink-1 …): ${text.slice(0, 80)}` })
    }
  }
  return violations
}

/**
 * Workstream C.5. Numbers nobody can stand behind. Each of these appeared on
 * the site without a source; none may return. HSE statistics in the insights
 * articles are allowed because they name their source and year on the page.
 */
export const UNSOURCED = /\b3\s?[×x]\s?faster|<\s?60\s?s\b|under 60 seconds|over 70%|£10,000\+|live within 30 minutes|\bin 24 hours\b|sixty-second|about 30 seconds|\b30 sec\b|in under a minute|3× faster/i

function checkUnsourcedNumbers(files, root) {
  return forbid(files, root, {
    rule: RULES.UNSOURCED_NUMBER,
    pattern: UNSOURCED,
    message: 'unsourced number (Workstream C.5). Replace with a verifiable product fact, or name the source and year on the page',
    skip: isTooling,
  })
}

/**
 * Workstream C.4. "No card required" may only be said if checkout agrees.
 * `TRIAL.cardRequired` in lib/brand.ts is the switch; `trialSentence()` is
 * the only place the wording lives.
 */
function checkTrialCardClaim(files, root) {
  const brandFile = join(root, 'lib/brand.ts')
  if (!existsSync(brandFile)) return []
  const cardRequired = /cardRequired:\s*true/.test(readFileSync(brandFile, 'utf8'))
  if (!cardRequired) return []
  return forbid(files, root, {
    rule: RULES.TRIAL_CARD_CLAIM,
    pattern: /no (?:credit )?card (?:is )?required|without a (?:credit )?card|no credit card|card-free/i,
    message: 'checkout takes a card at sign-up (TRIAL.cardRequired = true). Use trialSentence() and never say otherwise',
    skip: (rel) => rel === 'lib/brand.ts' || isTooling(rel),
  })
}

/** Workstream C.6. One maker line everywhere: "jobsafe is made by Jobmate Ltd." */
function checkMakerLine(files, root) {
  return forbid(files, root, {
    rule: RULES.MAKER_LINE,
    pattern: /Jobmate['’]s jobsafe|jobsafe HSSE module|Part of the Jobmate platform|Part of jobmate Group|a product of Jobmate/i,
    message: 'retired maker line. Use MAKER_LINE from lib/brand.ts ("jobsafe is made by Jobmate Ltd.")',
    skip: isTooling,
  })
}

/**
 * Workstream C.4. Every price shown carries "+ VAT". A price expression in a
 * page or component must have VAT on the same line or within the next three
 * (JSX wraps). The _EX_VAT_ labels carry it themselves.
 */
const PRICE_EXPRESSION = /\bENTRY_PRICE_LABEL\b|\bVOLUME_PRICE_LABEL\b|\bADMIN_PRICE_LABEL\b|\bformatPrice\(/

function checkVatShown(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (!(rel.startsWith('app/') || rel.startsWith('components/'))) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.VAT_SHOWN)) continue
    const lines = source.split('\n')
    lines.forEach((text, i) => {
      if (!PRICE_EXPRESSION.test(text)) return
      // A bare identifier on its own line is an import list, not a price shown.
      if (/^\s*[A-Z_]+,?\s*$/.test(text) || /^\s*import\b/.test(text)) return
      const window = lines.slice(i, i + 4).join('\n')
      if (!/VAT/.test(window)) {
        violations.push({ rule: RULES.VAT_SHOWN, file: rel, line: i + 1, message: `price shown without "+ VAT" beside it (Workstream C.4): ${text.trim().slice(0, 80)}` })
      }
    })
  }
  return violations
}

/**
 * Workstream C.7. Every page sets a self-referencing canonical, Open Graph and
 * Twitter block through `pageMetadata()` from lib/seo, which cannot forget
 * any of them — or, since Phase 2, through `buildMetadata()`, which reads the
 * keyword map and calls `pageMetadata()` itself.
 */
function checkCanonicalEverywhere(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (!rel.startsWith('app/') || !/\/page\.tsx$/.test(rel)) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.CANONICAL_EVERYWHERE)) continue
    if (!/\b(?:pageMetadata|buildMetadata)\(/.test(source)) {
      violations.push({ rule: RULES.CANONICAL_EVERYWHERE, file: rel, line: 0, message: 'page does not build its metadata with pageMetadata() or buildMetadata() from lib/seo, so its canonical, OG and Twitter tags are not guaranteed.' })
    }
  }
  return violations
}

// ── runner ───────────────────────────────────────────────────────────────────

export function runAudit(root = process.cwd()) {
  const files = ['app', 'components', 'lib']
    .map((d) => join(root, d))
    .filter(existsSync)
    .flatMap((d) => walk(d))
  const configFile = join(root, 'next.config.ts')
  if (existsSync(configFile)) files.push(configFile)

  let description = ''
  const layout = join(root, 'app/layout.tsx')
  if (existsSync(layout)) {
    const m = readFileSync(layout, 'utf8').match(/const SITE_DESCRIPTION\s*=\s*\n?\s*`([^`]*)`/)
    if (m) {
      // Resolve the interpolations we allow in the description.
      description = m[1].replace(/\$\{ENTRY_PRICE_EX_VAT_LABEL\}/g, '£3.00 + VAT').replace(/\$\{ENTRY_PRICE_LABEL\}/g, '£3.00')
    }
  }

  return [
    ...checkBrandCasing(files, root),
    ...checkMetaKeywords(files, root),
    ...checkAggregateRating(files, root),
    ...checkPriceLiterals(files, root),
    ...checkSitemapFragments(root),
    ...checkOgImage(root),
    ...(description ? checkMetaDescription(description) : []),
    ...checkNoChecklists(files, root),
    ...checkSingleOffer(root),
    ...checkFaqServerRendered(files, root),
    ...checkCanonicalTrailingSlash(root),
    ...checkOttoScript(files, root),
    ...checkColourLiterals(files, root),
    ...checkUnsourcedNumbers(files, root),
    ...checkTrialCardClaim(files, root),
    ...checkMakerLine(files, root),
    ...checkVatShown(files, root),
    ...checkCanonicalEverywhere(files, root),
  ]
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const violations = runAudit()
  const errors = violations.filter((v) => v.severity !== 'warn')
  const warnings = violations.filter((v) => v.severity === 'warn')

  for (const v of violations) {
    const tag = v.severity === 'warn' ? 'warn ' : 'ERROR'
    const at = v.line ? `${v.file}:${v.line}` : v.file
    console.error(`${tag}  [${v.rule}]  ${at}\n        ${v.message}\n`)
  }

  if (errors.length === 0) {
    console.log(`✔ seo:audit clean${warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : ''}`)
    process.exit(0)
  }
  console.error(`✘ ${errors.length} SEO violation${errors.length > 1 ? 's' : ''}.`)
  process.exit(1)
}
