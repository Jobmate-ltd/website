// node --test test/
//
// These tests assert two things:
//   1. the audit's rules actually fire on the exact defects found on 09/07/2026;
//   2. the repository is currently clean against those rules.
//
// (1) matters more than (2). A rule that cannot be shown to catch its bug is a
// rule nobody should trust.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { runAudit, checkMetaDescription, pngDimensions, RULES } from '../scripts/seo-audit.mjs'

/** Builds a throwaway repo from `{ path: contents }` and audits it. */
function auditFixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'jobsafe-seo-'))
  try {
    for (const [path, contents] of Object.entries(files)) {
      const full = join(root, path)
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, contents)
    }
    return runAudit(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const has = (violations, rule) => violations.some((v) => v.rule === rule)

// ── the defects, as found ────────────────────────────────────────────────────

describe('brand casing (§0.1)', () => {
  test('catches the hero alt text', () => {
    const v = auditFixture({
      'components/sections/Hero.tsx':
        'const alt = "The JobSafe app open on a smartphone"',
    })
    assert.ok(has(v, RULES.BRAND_CASING))
  })

  test('catches the footer logo alt', () => {
    const v = auditFixture({ 'components/sections/Footer.tsx': '<Image alt="JobSafe" />' })
    assert.ok(has(v, RULES.BRAND_CASING))
  })

  test('catches Job Safe, JOBSAFE and Jobsafe', () => {
    for (const bad of ['Job Safe', 'JOBSAFE', 'Jobsafe']) {
      const v = auditFixture({ 'lib/x.ts': `const s = "${bad}"` })
      assert.ok(has(v, RULES.BRAND_CASING), `${bad} should fail`)
    }
  })

  test('permits lowercase jobsafe', () => {
    const v = auditFixture({ 'lib/x.ts': 'const s = "jobsafe is live"' })
    assert.ok(!has(v, RULES.BRAND_CASING))
  })

  test('permits Jobmate Ltd, which is a different, correctly-capitalised entity', () => {
    const v = auditFixture({ 'lib/x.ts': 'const s = "Jobmate Ltd"' })
    assert.ok(!has(v, RULES.BRAND_CASING))
  })

  test('honours an explicit, documented ignore', () => {
    const v = auditFixture({
      'app/about/page.tsx': '// seo-audit-ignore: brand-casing\nconst other = "JobSafe safety gloves"',
    })
    assert.ok(!has(v, RULES.BRAND_CASING))
  })
})

describe('meta keywords (defect T8)', () => {
  test('catches the keywords array in root metadata', () => {
    const v = auditFixture({
      'app/layout.tsx': "export const metadata = {\n  keywords: ['incident reporting software UK'],\n}",
    })
    assert.ok(has(v, RULES.META_KEYWORDS))
  })

  test('ignores keywords in lib/, which are content metadata not meta tags', () => {
    const v = auditFixture({ 'lib/insights.ts': "  keywords: ['RIDDOR reporting']," })
    assert.ok(!has(v, RULES.META_KEYWORDS))
  })
})

describe('aggregateRating (§8)', () => {
  test('catches the 4.8-stars-from-47-reviews claim', () => {
    const v = auditFixture({
      'app/layout.tsx':
        "const ld = { aggregateRating: { ratingValue: '4.8', reviewCount: '47' } }",
    })
    assert.ok(has(v, RULES.AGGREGATE_RATING))
  })
})

describe('price literals (defect T2)', () => {
  test('catches a hard-coded £2.75 in the chat widget', () => {
    const v = auditFixture({
      'components/ChatWidget.tsx': "answer: 'Plans start at £2.75 per licence per month.'",
    })
    assert.ok(has(v, RULES.PRICE_LITERAL))
  })

  test('catches a hard-coded £3.00 too — the rule is about the source, not the number', () => {
    const v = auditFixture({ 'components/sections/Pricing.tsx': 'const p = "£3.00"' })
    assert.ok(has(v, RULES.PRICE_LITERAL))
  })

  test('permits price literals in lib/brand.ts, the source of truth', () => {
    const v = auditFixture({ 'lib/brand.ts': 'const ENTRY = "£3.00"' })
    assert.ok(!has(v, RULES.PRICE_LITERAL))
  })
})

describe('sitemap fragments', () => {
  test('catches /#features and friends', () => {
    const v = auditFixture({
      'app/sitemap.ts': 'export default function s() { return [{ url: `${SITE_URL}/#features` }] }',
    })
    assert.ok(has(v, RULES.SITEMAP_FRAGMENTS))
  })

  test('passes a fragment-free sitemap', () => {
    const v = auditFixture({
      'app/sitemap.ts': 'export default function s() { return [{ url: `${SITE_URL}/about` }] }',
    })
    assert.ok(!has(v, RULES.SITEMAP_FRAGMENTS))
  })
})

describe('meta description (§5.1)', () => {
  const good =
    'Incident reporting for UK construction, field and transport teams. HSSE compliant, offline-capable and ISO 45001 aligned. From £3.00 per licence. Start free.'

  test('the shipped description passes every clause', () => {
    assert.equal(checkMetaDescription(good).length, 0)
  })

  test('is between 140 and 158 characters', () => {
    assert.ok(good.length >= 140 && good.length <= 158, `got ${good.length}`)
  })

  test('rejects the old description, which promised £2.75', () => {
    const old =
      'Incident reporting for field teams & transport operators. HSSE compliant, offline-capable, ISO 45001 aligned. From £2.75/licence.'
    const v = checkMetaDescription(old)
    assert.ok(v.some((x) => /2\.75/.test(x.message)))
    assert.ok(v.some((x) => /140–158/.test(x.message)), 'and it is too short')
  })

  test('rejects a description that trails off without a verb', () => {
    const limp =
      'Incident reporting for UK construction, field and transport teams. HSSE compliant, offline-capable and ISO 45001 aligned, from £3.00 per licence today.'
    assert.ok(checkMetaDescription(limp).some((x) => /concrete verb/.test(x.message)))
  })
})

describe('no checklists (§0.4)', () => {
  test('catches a positive checklist claim', () => {
    const v = auditFixture({
      'components/sections/Features.tsx': 'title: "Inspection checklists"',
    })
    assert.ok(has(v, RULES.NO_CHECKLISTS))
  })

  test('catches "form builder"', () => {
    const v = auditFixture({ 'components/x.tsx': 'const s = "drag-and-drop form builder"' })
    assert.ok(has(v, RULES.NO_CHECKLISTS))
  })

  test('permits a documented negative claim', () => {
    const v = auditFixture({
      'app/about/page.tsx':
        '// seo-audit-ignore: no-checklists\nconst s = "jobsafe has no checklist module."',
    })
    assert.ok(!has(v, RULES.NO_CHECKLISTS))
  })
})

describe('single offer (defect T3)', () => {
  test('catches the launch promo running alongside the free trial', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const LAUNCH_OFFER = { enabled: true, headline: "6 months free" }',
      'components/sections/Pricing.tsx': 'All plans include a 3-day free trial.',
    })
    assert.ok(has(v, RULES.SINGLE_OFFER))
  })

  test('passes when the promo is off', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const LAUNCH_OFFER = { enabled: false, headline: "sign-ups now open" }',
      'components/sections/Pricing.tsx': 'All plans include a 3-day free trial.',
    })
    assert.ok(!has(v, RULES.SINGLE_OFFER))
  })
})

describe('FAQ server rendering (defect T7)', () => {
  test('catches FAQPage schema emitted without forceMount', () => {
    const v = auditFixture({
      'components/sections/FAQ.tsx':
        'import { faqPageSchema } from "@/lib/schema"\n<AccordionPrimitive.Content className="overflow-hidden">',
    })
    assert.ok(has(v, RULES.FAQ_FORCE_MOUNT))
  })

  test('catches forceMount without the collapse class, which renders every answer open', () => {
    const v = auditFixture({
      'components/sections/FAQ.tsx':
        'import { faqPageSchema } from "@/lib/schema"\n<AccordionPrimitive.Content forceMount className="overflow-hidden">',
    })
    assert.ok(has(v, RULES.FAQ_FORCE_MOUNT))
  })

  test('passes when both are present', () => {
    const v = auditFixture({
      'components/sections/FAQ.tsx':
        'import { faqPageSchema } from "@/lib/schema"\n<AccordionPrimitive.Content forceMount className="overflow-hidden data-[state=closed]:h-0">',
    })
    assert.ok(!has(v, RULES.FAQ_FORCE_MOUNT))
  })
})

describe('canonical (defect T6)', () => {
  test('catches a homepage canonical with no trailing slash', () => {
    const v = auditFixture({
      'lib/brand.ts': "export const CANONICAL_HOME = 'https://www.jobsafe.cloud'",
    })
    assert.ok(has(v, RULES.CANONICAL_TRAILING_SLASH))
  })

  test('passes the templated form', () => {
    const v = auditFixture({ 'lib/brand.ts': 'export const CANONICAL_HOME = `${SITE_URL}/`' })
    assert.ok(!has(v, RULES.CANONICAL_TRAILING_SLASH))
  })
})

describe('og:image (defect T5)', () => {
  /** Minimal PNG: signature + IHDR length/type + width/height. */
  function png(width, height) {
    const buf = Buffer.alloc(24)
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0)
    buf.writeUInt32BE(width, 16)
    buf.writeUInt32BE(height, 20)
    return buf
  }

  test('reads dimensions from the IHDR chunk', () => {
    assert.deepEqual(pngDimensions(png(1200, 630)), { width: 1200, height: 630 })
  })

  test('catches the shipped 1203×633 asset', () => {
    const v = auditFixture({ 'public/images/og-image.png': png(1203, 633) })
    assert.ok(has(v, RULES.OG_IMAGE_DIMENSIONS))
  })

  test('passes a spec-compliant asset', () => {
    const v = auditFixture({ 'public/images/og-image.png': png(1200, 630) })
    assert.ok(!v.some((x) => x.rule === RULES.OG_IMAGE_DIMENSIONS && x.severity !== 'warn'))
  })

  test('returns null for a non-PNG', () => {
    assert.equal(pngDimensions(Buffer.from('not a png')), null)
  })
})

// ── the repository, as it stands ─────────────────────────────────────────────

describe('the repository is clean', () => {
  test('no errors from any rule', () => {
    const errors = runAudit(process.cwd()).filter((v) => v.severity !== 'warn')
    assert.deepEqual(
      errors,
      [],
      `\n${errors.map((e) => `[${e.rule}] ${e.file}:${e.line} — ${e.message}`).join('\n')}\n`,
    )
  })
})
