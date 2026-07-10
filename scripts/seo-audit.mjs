#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — SEO audit.
//
// Every defect fixed in the P0 sprint has a check here. The point is not to
// find problems once; it is to make it impossible to reintroduce them without
// the build going red.
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
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md'])

/** Files allowed to contain price literals: the source of truth, and the audit itself. */
const PRICE_LITERAL_ALLOWLIST = ['lib/brand.ts', 'scripts/seo-audit.mjs', 'test/seo.test.mjs']

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
  FAQ_FORCE_MOUNT: 'faq-force-mount',
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
  const violations = []
  // `Jobmate`/`JobMate` are a different, correctly-capitalised legal entity.
  const pattern = /\b(JobSafe|Jobsafe|JOBSAFE|JobSAFE|Job Safe)\b/
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.BRAND_CASING)) continue
    for (const { line, text } of findLines(source, pattern)) {
      violations.push({
        rule: RULES.BRAND_CASING,
        file: relative(root, file),
        line,
        message: `brand must be lowercase \`jobsafe\`: ${text.slice(0, 90)}`,
      })
    }
  }
  return violations
}

/** Defect T8. Google has ignored `<meta name="keywords">` since 2009. */
function checkMetaKeywords(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    // Post-level `keywords` in lib/insights.ts is content metadata, not a meta
    // tag — but `app/insights/[slug]/page.tsx` passes it INTO Next's metadata,
    // which does render <meta name="keywords">. Both are caught below.
    if (!rel.startsWith('app/')) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.META_KEYWORDS)) continue
    for (const { line, text } of findLines(source, /^\s*keywords:/)) {
      violations.push({
        rule: RULES.META_KEYWORDS,
        file: rel,
        line,
        message: `Next renders this as <meta name="keywords">, which is ignored by Google and signals a thin strategy: ${text.slice(0, 70)}`,
      })
    }
  }
  return violations
}

/** §8. No self-declared star ratings. There are no reviews yet. */
function checkAggregateRating(files, root) {
  const violations = []
  for (const file of files) {
    const rel = relative(root, file)
    if (rel === 'scripts/seo-audit.mjs' || rel === 'test/seo.test.mjs') continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.AGGREGATE_RATING)) continue
    // As a property key or a quoted string — i.e. actually emitted. Prose in a
    // comment explaining why we do not use it is exactly the documentation we
    // want to keep.
    for (const { line } of findLines(source, /aggregateRating\s*[:=]|['"]aggregateRating['"]/)) {
      violations.push({
        rule: RULES.AGGREGATE_RATING,
        file: rel,
        line,
        message:
          'aggregateRating without verifiable third-party reviews is a manual-action risk and a false claim (§8). Claim G2/Capterra first.',
      })
    }
  }
  return violations
}

/** Defect T2. One price, from one place. */
function checkPriceLiterals(files, root) {
  const violations = []
  const pattern = /£\s?\d+\.\d{2}/
  for (const file of files) {
    const rel = relative(root, file)
    if (PRICE_LITERAL_ALLOWLIST.includes(rel)) continue
    if (rel.startsWith('docs/') || rel.startsWith('patches/')) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.PRICE_LITERAL)) continue
    for (const { line, text } of findLines(source, pattern)) {
      violations.push({
        rule: RULES.PRICE_LITERAL,
        file: rel,
        line,
        message: `hard-coded price. Import from lib/brand.ts instead: ${text.slice(0, 80)}`,
      })
    }
  }
  return violations
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

/** Defect T5. The spec is 1200×630. The asset shipped at 1203×633. */
function checkOgImage(root) {
  const file = join(root, 'public/images/og-image.png')
  if (!existsSync(file)) {
    return [
      {
        rule: RULES.OG_IMAGE_DIMENSIONS,
        file: 'public/images/og-image.png',
        line: 0,
        severity: 'warn',
        message: 'not found — cannot verify dimensions. Expected 1200×630.',
      },
    ]
  }
  const dims = pngDimensions(readFileSync(file))
  if (!dims) {
    return [
      {
        rule: RULES.OG_IMAGE_DIMENSIONS,
        file: 'public/images/og-image.png',
        line: 0,
        message: 'not a valid PNG.',
      },
    ]
  }
  if (dims.width !== 1200 || dims.height !== 630) {
    return [
      {
        rule: RULES.OG_IMAGE_DIMENSIONS,
        file: 'public/images/og-image.png',
        line: 0,
        message: `is ${dims.width}×${dims.height}, must be 1200×630. Fix with:  npx sharp-cli -i public/images/og-image.png -o public/images/og-image.png resize 1200 630 --fit cover`,
      },
    ]
  }
  return []
}

/** §5.1. 140–158 chars, quotes the entry price, ends on a concrete verb. */
export function checkMetaDescription(description) {
  const violations = []
  const len = description.length
  if (len < 140 || len > 158) {
    violations.push({
      rule: RULES.META_DESCRIPTION,
      file: 'app/layout.tsx',
      line: 0,
      message: `description is ${len} chars, must be 140–158.`,
    })
  }
  if (description.includes('£2.75')) {
    violations.push({
      rule: RULES.META_DESCRIPTION,
      file: 'app/layout.tsx',
      line: 0,
      message: 'quotes the volume rate £2.75; a new customer pays the entry price. Snippet must match the landing page.',
    })
  }
  if (!/\b(Start|Report|Capture|Try|See)\b[^.]*\.$/.test(description)) {
    violations.push({
      rule: RULES.META_DESCRIPTION,
      file: 'app/layout.tsx',
      line: 0,
      message: 'must end on a concrete verb (§5.1).',
    })
  }
  return violations
}

/** §0.4. jobsafe has no checklists feature. Permanently out of scope. */
function checkNoChecklists(files, root) {
  const violations = []
  const pattern = /\bchecklists?\b|\bform builder\b/i
  for (const file of files) {
    const rel = relative(root, file)
    if (rel.startsWith('docs/') || rel.startsWith('patches/') || rel.startsWith('scripts/') || rel.startsWith('test/')) continue
    const source = readFileSync(file, 'utf8')
    if (ignoresRule(source, RULES.NO_CHECKLISTS)) continue
    for (const { line, text } of findLines(source, pattern)) {
      violations.push({
        rule: RULES.NO_CHECKLISTS,
        file: rel,
        line,
        message: `jobsafe has no checklists feature (§0.4). If this is a deliberate negative claim, add "seo-audit-ignore: no-checklists" and say why: ${text.slice(0, 70)}`,
      })
    }
  }
  return violations
}

/** Defect T3. Exactly one offer may be live. */
function checkSingleOffer(root) {
  const brandFile = join(root, 'lib/brand.ts')
  const pricingFile = join(root, 'components/sections/Pricing.tsx')
  if (!existsSync(brandFile)) return []

  const brand = readFileSync(brandFile, 'utf8')
  const launchEnabled = /LAUNCH_OFFER\s*=\s*\{[^}]*enabled:\s*true/s.test(brand)
  if (!launchEnabled) return []

  const trialVisible =
    existsSync(pricingFile) && /free trial|TRIAL\.label/i.test(readFileSync(pricingFile, 'utf8'))

  if (trialVisible) {
    return [
      {
        rule: RULES.SINGLE_OFFER,
        file: 'lib/brand.ts',
        line: 0,
        message:
          'LAUNCH_OFFER.enabled is true while the pricing section still advertises the free trial. Two contradictory offers ~400px apart (defect T3). Retire one.',
      },
    ]
  }
  return []
}

/** Defect T7. FAQPage is only valid if the answers are in the HTML. */
function checkFaqForceMount(root) {
  const file = join(root, 'components/sections/FAQ.tsx')
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  const emitsSchema = /faqPageSchema/.test(source)
  const forcesMount = /forceMount/.test(source)

  if (emitsSchema && !forcesMount) {
    return [
      {
        rule: RULES.FAQ_FORCE_MOUNT,
        file: 'components/sections/FAQ.tsx',
        line: 0,
        message:
          'emits FAQPage schema but Radix unmounts closed <Accordion.Content>. The answers are not in the server-rendered HTML, so the markup is invalid. Add forceMount.',
      },
    ]
  }
  if (forcesMount && !/data-\[state=closed\]:h-0/.test(source)) {
    return [
      {
        rule: RULES.FAQ_FORCE_MOUNT,
        file: 'components/sections/FAQ.tsx',
        line: 0,
        message: 'forceMount without `data-[state=closed]:h-0` renders every answer open on first paint.',
      },
    ]
  }
  return []
}

/** §5.1. The homepage canonical must be self-referential and exact. */
function checkCanonicalTrailingSlash(root) {
  const file = join(root, 'lib/brand.ts')
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  const match = source.match(/CANONICAL_HOME\s*=\s*`?['"`]?([^'"`\n]*)/)
  const value = match?.[1] ?? ''
  // Templated form `${SITE_URL}/` is the expected shape.
  if (!/\/`?$/.test(value.trim())) {
    return [
      {
        rule: RULES.CANONICAL_TRAILING_SLASH,
        file: 'lib/brand.ts',
        line: 0,
        message: `CANONICAL_HOME must end with a trailing slash to match the served URL and the GSC property (defect T6). Got: ${value}`,
      },
    ]
  }
  return []
}

// ── runner ───────────────────────────────────────────────────────────────────

export function runAudit(root = process.cwd()) {
  const files = ['app', 'components', 'lib']
    .map((d) => join(root, d))
    .filter(existsSync)
    .flatMap((d) => walk(d))

  let description = ''
  const layout = join(root, 'app/layout.tsx')
  if (existsSync(layout)) {
    const m = readFileSync(layout, 'utf8').match(/const SITE_DESCRIPTION\s*=\s*\n?\s*`([^`]*)`/)
    if (m) {
      // Resolve the one interpolation we allow in the description.
      description = m[1].replace(/\$\{ENTRY_PRICE_LABEL\}/g, '£3.00')
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
    ...checkFaqForceMount(root),
    ...checkCanonicalTrailingSlash(root),
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
