// node --test test/
//
// These tests assert two things:
//   1. the audit's rules actually fire on the exact defects found on 09/07/2026
//      and in the Phase 1 brief of 25/09/2026;
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
    const v = auditFixture({ 'components/sections/Hero.tsx': 'const alt = "The JobSafe app open on a smartphone"' })
    assert.ok(has(v, RULES.BRAND_CASING))
  })

  test('catches Job Safe, JOBSAFE and Jobsafe', () => {
    for (const bad of ['Job Safe', 'JOBSAFE', 'Jobsafe']) {
      const v = auditFixture({ 'lib/x.ts': `const s = "${bad}"` })
      assert.ok(has(v, RULES.BRAND_CASING), `${bad} should fail`)
    }
  })

  test('permits lowercase jobsafe and Jobmate Ltd', () => {
    assert.ok(!has(auditFixture({ 'lib/x.ts': 'const s = "jobsafe is live"' }), RULES.BRAND_CASING))
    assert.ok(!has(auditFixture({ 'lib/x.ts': 'const s = "Jobmate Ltd"' }), RULES.BRAND_CASING))
  })

  test('honours an explicit, documented ignore', () => {
    const v = auditFixture({ 'app/about/page.tsx': '// seo-audit-ignore: brand-casing\nconst other = "JobSafe safety gloves"' })
    assert.ok(!has(v, RULES.BRAND_CASING))
  })
})

describe('meta keywords (defect T8)', () => {
  test('catches the keywords array in root metadata', () => {
    const v = auditFixture({ 'app/layout.tsx': "export const metadata = {\n  keywords: ['incident reporting software UK'],\n}" })
    assert.ok(has(v, RULES.META_KEYWORDS))
  })

  test('ignores keywords in lib/, which are content metadata not meta tags', () => {
    assert.ok(!has(auditFixture({ 'lib/insights.ts': "  keywords: ['RIDDOR reporting']," }), RULES.META_KEYWORDS))
  })
})

describe('aggregateRating (§8)', () => {
  test('catches the 4.8-stars-from-47-reviews claim', () => {
    const v = auditFixture({ 'app/layout.tsx': "const ld = { aggregateRating: { ratingValue: '4.8', reviewCount: '47' } }" })
    assert.ok(has(v, RULES.AGGREGATE_RATING))
  })
})

describe('price literals (defect T2)', () => {
  test('catches a hard-coded £2.75 in the chat widget', () => {
    assert.ok(has(auditFixture({ 'components/ChatWidget.tsx': "answer: 'Plans start at £2.75 per licence per month.'" }), RULES.PRICE_LITERAL))
  })

  test('catches a hard-coded £3.00 too — the rule is about the source, not the number', () => {
    assert.ok(has(auditFixture({ 'components/site/pricing.tsx': 'const p = "£3.00"' }), RULES.PRICE_LITERAL))
  })

  test('permits price literals in lib/brand.ts, the source of truth', () => {
    assert.ok(!has(auditFixture({ 'lib/brand.ts': 'const ENTRY = "£3.00"' }), RULES.PRICE_LITERAL))
  })
})

describe('sitemap fragments', () => {
  test('catches /#features and friends', () => {
    assert.ok(has(auditFixture({ 'app/sitemap.ts': 'export default function s() { return [{ url: `${SITE_URL}/#features` }] }' }), RULES.SITEMAP_FRAGMENTS))
  })

  test('passes a fragment-free sitemap', () => {
    assert.ok(!has(auditFixture({ 'app/sitemap.ts': 'export default function s() { return [{ url: `${SITE_URL}/about` }] }' }), RULES.SITEMAP_FRAGMENTS))
  })
})

describe('meta description (§5.1, C.4)', () => {
  const good =
    'Incident reporting software for UK field teams. Works offline, with photo, GPS and timestamp evidence. From £3.00 + VAT a licence. Start your free trial.'

  test('the shipped description passes every clause', () => {
    assert.deepEqual(checkMetaDescription(good), [])
  })

  test('is between 140 and 158 characters', () => {
    assert.ok(good.length >= 140 && good.length <= 158, `got ${good.length}`)
  })

  test('rejects the old description, which promised £2.75', () => {
    const old = 'Incident reporting for field teams & transport operators. HSSE compliant, offline-capable, ISO 45001 aligned. From £2.75/licence.'
    const v = checkMetaDescription(old)
    assert.ok(v.some((x) => /2\.75/.test(x.message)))
    assert.ok(v.some((x) => /140–158/.test(x.message)), 'and it is too short')
  })

  test('rejects a price without VAT beside it', () => {
    const noVat = 'Incident reporting for UK construction, field and transport teams. HSSE compliant, offline-capable and ISO 45001 aligned. From £3.00 per licence. Start free.'
    assert.ok(checkMetaDescription(noVat).some((x) => /VAT/.test(x.message)))
  })

  test('rejects a description that trails off without a verb', () => {
    const limp = 'Incident reporting for UK construction, field and transport teams. Works offline with photo, GPS and timestamp evidence, from £3.00 + VAT per licence today.'
    assert.ok(checkMetaDescription(limp).some((x) => /concrete verb/.test(x.message)))
  })
})

describe('no checklists (§0.4)', () => {
  test('catches a positive checklist claim', () => {
    assert.ok(has(auditFixture({ 'components/sections/Features.tsx': 'title: "Inspection checklists"' }), RULES.NO_CHECKLISTS))
  })

  test('catches "form builder"', () => {
    assert.ok(has(auditFixture({ 'components/x.tsx': 'const s = "drag-and-drop form builder"' }), RULES.NO_CHECKLISTS))
  })

  test('permits a documented negative claim', () => {
    assert.ok(!has(auditFixture({ 'app/about/page.tsx': '// seo-audit-ignore: no-checklists\nconst s = "jobsafe has no checklist module."' }), RULES.NO_CHECKLISTS))
  })
})

describe('single offer (defect T3)', () => {
  test('catches the launch promo running alongside the free trial', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const LAUNCH_OFFER = { enabled: true, headline: "6 months free" }',
      'components/site/pricing.tsx': '{trialSentence()}',
    })
    assert.ok(has(v, RULES.SINGLE_OFFER))
  })

  test('passes when the promo is off', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const LAUNCH_OFFER = { enabled: false, headline: "sign-ups now open" }',
      'components/site/pricing.tsx': '{trialSentence()}',
    })
    assert.ok(!has(v, RULES.SINGLE_OFFER))
  })
})

describe('FAQ server rendering (defect T7)', () => {
  test('catches FAQPage schema emitted without forceMount or <details>', () => {
    const v = auditFixture({ 'components/ui/faq.tsx': 'faqPageSchema(items)\n<AccordionPrimitive.Content className="overflow-hidden">' })
    assert.ok(has(v, RULES.FAQ_SERVER_RENDERED))
  })

  test('catches forceMount without the collapse class, which renders every answer open', () => {
    const v = auditFixture({ 'components/ui/faq.tsx': 'faqPageSchema(items)\n<AccordionPrimitive.Content forceMount className="overflow-hidden">' })
    assert.ok(has(v, RULES.FAQ_SERVER_RENDERED))
  })

  test('passes a Radix accordion with forceMount and the collapse class', () => {
    const v = auditFixture({ 'components/ui/faq.tsx': 'faqPageSchema(items)\n<AccordionPrimitive.Content forceMount className="overflow-hidden data-[state=closed]:h-0">' })
    assert.ok(!has(v, RULES.FAQ_SERVER_RENDERED))
  })

  test('passes a native <details>, which the browser collapses and never unmounts', () => {
    const v = auditFixture({ 'components/ui/faq.tsx': 'faqPageSchema(items)\n<details className="faq"><summary>{q}</summary><p>{a}</p></details>' })
    assert.ok(!has(v, RULES.FAQ_SERVER_RENDERED))
  })
})

describe('canonical (defect T6)', () => {
  test('catches a homepage canonical with no trailing slash', () => {
    assert.ok(has(auditFixture({ 'lib/brand.ts': "export const CANONICAL_HOME = 'https://www.jobsafe.cloud'" }), RULES.CANONICAL_TRAILING_SLASH))
  })

  test('passes the templated form', () => {
    assert.ok(!has(auditFixture({ 'lib/brand.ts': 'export const CANONICAL_HOME = `${SITE_URL}/`' }), RULES.CANONICAL_TRAILING_SLASH))
  })
})

describe('og:image (defect T5)', () => {
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
    assert.ok(has(auditFixture({ 'public/images/og-image.png': png(1203, 633) }), RULES.OG_IMAGE_DIMENSIONS))
  })

  test('passes a spec-compliant asset', () => {
    const v = auditFixture({ 'public/images/og-image.png': png(1200, 630) })
    assert.ok(!v.some((x) => x.rule === RULES.OG_IMAGE_DIMENSIONS && x.severity !== 'warn'))
  })

  test('returns null for a non-PNG', () => {
    assert.equal(pngDimensions(Buffer.from('not a png')), null)
  })
})

// ── Phase 1 (25/09/2026) ─────────────────────────────────────────────────────

describe('OTTO script (Workstream C.1)', () => {
  test('catches the loader as it was shipped in app/layout.tsx', () => {
    const v = auditFixture({ 'app/layout.tsx': `<script id="sa-dynamic-optimization" data-uuid="09a87fea-bb62-4d82-a03e-d09e7a4ad5b2" />` })
    assert.ok(has(v, RULES.OTTO_SCRIPT))
  })

  test('catches the script URL it loads', () => {
    assert.ok(has(auditFixture({ 'components/x.tsx': 'src="https://dashboard.searchatlas.com/scripts/dynamic_optimization.js"' }), RULES.OTTO_SCRIPT))
  })

  test('catches a base64-decoded loader by its script name', () => {
    assert.ok(has(auditFixture({ 'app/layout.tsx': 'script.src = "https://x/dynamic_optimization.js"' }), RULES.OTTO_SCRIPT))
  })
})

describe('colour literals (Workstream A)', () => {
  test('catches a hex literal in a component', () => {
    assert.ok(has(auditFixture({ 'components/ui/card.tsx': "style={{ background: '#0a0a0a' }}" }), RULES.COLOUR_LITERAL))
  })

  test('catches a Tailwind arbitrary hex value', () => {
    assert.ok(has(auditFixture({ 'components/x.tsx': 'className="bg-[#111111]"' }), RULES.COLOUR_LITERAL))
  })

  test('catches rgba() and hsl()', () => {
    assert.ok(has(auditFixture({ 'components/x.tsx': "boxShadow: '0 0 0 rgba(0,0,0,0.5)'" }), RULES.COLOUR_LITERAL))
    assert.ok(has(auditFixture({ 'components/x.tsx': "color: 'hsl(0 0% 100%)'" }), RULES.COLOUR_LITERAL))
  })

  test('catches dark-world utilities: bg-black, text-white, border-white/10, bg-surface-0', () => {
    for (const cls of ['bg-black', 'text-white', 'border-white/10', 'bg-surface-0', 'bg-white/[0.03]', 'text-zinc-600']) {
      assert.ok(has(auditFixture({ 'components/x.tsx': `className="${cls}"` }), RULES.COLOUR_LITERAL), `${cls} should fail`)
    }
  })

  test('permits the token file, token utilities, anchors and SVG url() references', () => {
    assert.ok(!has(auditFixture({ 'app/globals.css': '--color-brand: #e63946;' }), RULES.COLOUR_LITERAL))
    assert.ok(!has(auditFixture({ 'components/x.tsx': 'className="bg-canvas text-ink-1 border-line-1 bg-brand-tint-08"' }), RULES.COLOUR_LITERAL))
    // grey-400 is a token in globals.css; gray-400 is Tailwind's default palette.
    assert.ok(!has(auditFixture({ 'components/x.tsx': 'className="text-grey-400 hover:border-grey-400"' }), RULES.COLOUR_LITERAL))
    assert.ok(has(auditFixture({ 'components/x.tsx': 'className="text-gray-400"' }), RULES.COLOUR_LITERAL))
    assert.ok(!has(auditFixture({ 'components/x.tsx': '<a href="/#faq">FAQ</a> <a href="#content">skip</a>' }), RULES.COLOUR_LITERAL))
    assert.ok(!has(auditFixture({ 'components/x.tsx': 'stroke="url(#hero-beam)"' }), RULES.COLOUR_LITERAL))
    assert.ok(!has(auditFixture({ 'components/x.tsx': "background: 'radial-gradient(circle, var(--color-brand-tint-08), transparent)'" }), RULES.COLOUR_LITERAL))
  })
})

describe('unsourced numbers (Workstream C.5)', () => {
  test('catches every number the brief named', () => {
    for (const bad of ['3× faster reporting', '<60s per report', 'over 70%', '£10,000+ enforcement notice', 'live within 30 minutes', 'set up in 24 hours']) {
      assert.ok(has(auditFixture({ 'components/x.tsx': `const s = "${bad}"` }), RULES.UNSOURCED_NUMBER), `${bad} should fail`)
    }
  })

  test('permits a sourced statistic and legal deadlines', () => {
    assert.ok(!has(auditFixture({ 'lib/insights.ts': "text: 'Over-seven-day injuries: report within 15 days (HSE, RIDDOR 2013).'" }), RULES.UNSOURCED_NUMBER))
    assert.ok(!has(auditFixture({ 'app/toolkit/page.tsx': "body: 'What to do in the first 24 hours after a near miss.'" }), RULES.UNSOURCED_NUMBER))
  })
})

describe('trial card claim (Workstream C.4)', () => {
  test('catches "no credit card required" when checkout takes a card', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const TRIAL = { days: 14, cardRequired: true }',
      'components/x.tsx': "const s = '14-day free trial. No credit card required.'",
    })
    assert.ok(has(v, RULES.TRIAL_CARD_CLAIM))
  })

  test('permits it when checkout does not', () => {
    const v = auditFixture({
      'lib/brand.ts': 'export const TRIAL = { days: 14, cardRequired: false }',
      'components/x.tsx': "const s = '14-day free trial. No credit card required.'",
    })
    assert.ok(!has(v, RULES.TRIAL_CARD_CLAIM))
  })
})

describe('maker line (Workstream C.6)', () => {
  test('catches the retired phrasings', () => {
    for (const bad of ["Jobmate's jobsafe HSSE module", 'Part of the Jobmate platform', 'Part of jobmate Group', 'jobsafe is a product of Jobmate Ltd']) {
      assert.ok(has(auditFixture({ 'components/x.tsx': `const s = "${bad}"` }), RULES.MAKER_LINE), `${bad} should fail`)
    }
  })

  test('permits the one maker line', () => {
    assert.ok(!has(auditFixture({ 'components/x.tsx': 'const s = "jobsafe is made by Jobmate Ltd."' }), RULES.MAKER_LINE))
  })
})

describe('VAT shown (Workstream C.4)', () => {
  test('catches a price rendered without VAT nearby', () => {
    assert.ok(has(auditFixture({ 'components/x.tsx': '<p>From {ENTRY_PRICE_LABEL} per licence</p>' }), RULES.VAT_SHOWN))
  })

  test('permits a price with VAT on the same line or within the JSX that follows', () => {
    assert.ok(!has(auditFixture({ 'components/x.tsx': '<p>From {ENTRY_PRICE_LABEL} {VAT_SUFFIX} per licence</p>' }), RULES.VAT_SHOWN))
    assert.ok(!has(auditFixture({ 'components/x.tsx': '<span>{formatPrice(monthly)}</span>\n</div>\n<span>{VAT_SUFFIX}</span>' }), RULES.VAT_SHOWN))
    assert.ok(!has(auditFixture({ 'components/x.tsx': '<p>From {ENTRY_PRICE_EX_VAT_LABEL} per licence</p>' }), RULES.VAT_SHOWN))
    // An import list names the constant without showing it.
    assert.ok(!has(auditFixture({ 'components/x.tsx': "import {\n  ENTRY_PRICE_LABEL,\n  VOLUME_PRICE_LABEL,\n} from '@/lib/brand'\n\n\n\n\nexport const x = 1" }), RULES.VAT_SHOWN))
  })
})

describe('canonical everywhere (Workstream C.7)', () => {
  test('catches a page that hand-rolls its metadata', () => {
    assert.ok(has(auditFixture({ 'app/terms/page.tsx': "export const metadata = { title: 'Terms' }" }), RULES.CANONICAL_EVERYWHERE))
  })

  test('passes a page built with pageMetadata()', () => {
    assert.ok(!has(auditFixture({ 'app/terms/page.tsx': "export const metadata = pageMetadata({ path: '/terms', title: 'Terms', description: '…' })" }), RULES.CANONICAL_EVERYWHERE))
  })
})

// ── the repository, as it stands ─────────────────────────────────────────────

describe('the repository is clean', () => {
  test('no errors from any rule', () => {
    const errors = runAudit(process.cwd()).filter((v) => v.severity !== 'warn')
    assert.deepEqual(errors, [], `\n${errors.map((e) => `[${e.rule}] ${e.file}:${e.line} — ${e.message}`).join('\n')}\n`)
  })
})
