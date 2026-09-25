// node --test test/
//
// Phase 3 industry pages and the Phase 3 module pages: every statistic has a
// source with a URL and the date it was checked; every pain links a module
// page that exists; every screen is a real capture; eight FAQs each; nothing
// on the "never" or "once built" lists; the module pages' "built for" and
// "try it free" links are real pages.
//
// Node 22 strips TypeScript types natively, so lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { routeExists } from '../lib/routes.ts'
import { PRODUCT_IMAGE_IDS } from '../lib/product-images.ts'
import { MODULE_PAGES, liveModulePages, modulePage, modulePageLive, modulePageName } from '../lib/platform-modules.ts'
import { PHASE_3_MODULE_PAGES } from '../lib/platform-modules-phase-3.ts'
import { INDUSTRY_PATHS, LINK_REGISTRY, TOOL_PATHS } from '../lib/seo/links.ts'
import { KEYWORD_ROWS } from '../lib/seo/keyword-map.ts'
import { transportLogistics } from '../lib/industries/transport-logistics.ts'
import { construction } from '../lib/industries/construction.ts'
import { fieldServices } from '../lib/industries/field-services.ts'
import { facilitiesManagement } from '../lib/industries/facilities-management.ts'
import { manufacturingWarehousing } from '../lib/industries/manufacturing-warehousing.ts'
import { care } from '../lib/industries/care.ts'
import { windowDoorFitters } from '../lib/industries/window-door-fitters.ts'
import { FORBIDDEN, NEW_PAGE_ONLY, scan } from '../scripts/claims-check.mjs'

const INDUSTRIES = [transportLogistics, construction, fieldServices, facilitiesManagement, manufacturingWarehousing, care, windowDoorFitters]
const ALL_ON = { compare: true, inputs: { checklistBuilderShipped: true, contractorCrudShipped: true, emailAlertsShipped: true, csvImportShipped: true, pdfExportShipped: true } }
const DATE = /^\d\d\/\d\d\/\d{4}$/

/** Every string in an object, for the claims scan. */
function strings(value, out = []) {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out))
  return out
}

function assertNoPositiveClaims(value, where) {
  for (const text of strings(value)) {
    const positive = scan(text, [...FORBIDDEN, ...NEW_PAGE_ONLY].filter((r) => !r.renderedOnly)).filter((hit) => !hit.negated)
    assert.deepEqual(positive, [], `${where}: ${positive.map((h) => `${h.rule} "${h.match}"`).join(', ')}`)
  }
}

describe('industry pages (lib/industries/*.ts)', () => {
  test('one content object per industry route, with a keyword row', () => {
    assert.deepEqual(INDUSTRIES.map((i) => i.path).sort(), [...INDUSTRY_PATHS].sort())
    for (const industry of INDUSTRIES) {
      assert.ok(routeExists(industry.path, true), industry.path)
      assert.ok(KEYWORD_ROWS.some((row) => row.path === industry.path), `${industry.path} has no keyword row`)
    }
  })

  test('every statistic names its source, year, URL, quote and the date it was checked, and no figure is reused across industries', () => {
    const seen = new Map()
    for (const industry of INDUSTRIES) {
      assert.ok(industry.facts.length >= 1 && industry.facts.length <= 3, `${industry.path} has ${industry.facts.length} facts`)
      for (const fact of industry.facts) {
        assert.ok(fact.figure.length > 0 && fact.detail.length > 20, `${industry.path}: ${fact.figure}`)
        assert.ok(fact.source.name.length > 10 && fact.source.year.length >= 4, `${industry.path}: ${fact.figure} source`)
        assert.match(fact.source.url, /^https:\/\/(www\.)?(hse\.gov\.uk|gov\.uk)\//, `${industry.path}: ${fact.figure} must come from HSE or GOV.UK`)
        assert.match(fact.source.checked, DATE, `${industry.path}: ${fact.figure} checked date`)
        assert.ok(fact.source.quote.length > 20, `${industry.path}: ${fact.figure} quote`)
        const key = `${fact.figure}|${fact.detail}`
        assert.ok(!seen.has(key), `${industry.path} reuses "${fact.figure}" from ${seen.get(key)}`)
        seen.set(key, industry.path)
      }
    }
  })

  test('six pains, each answered by a module page that exists; three real screens; eight FAQs; two tools; sources on the legal framing', () => {
    for (const industry of INDUSTRIES) {
      assert.equal(industry.pains.length, 6, `${industry.path} pains`)
      for (const pain of industry.pains) {
        const page = modulePage(pain.module)
        assert.ok(page && modulePageLive(page), `${industry.path}: pain "${pain.pain.slice(0, 40)}" links ${pain.module}, which has no live page`)
        assert.ok(pain.outcome.length > 60, `${industry.path}: outcome for "${pain.pain.slice(0, 40)}" is thin`)
      }
      assert.equal(industry.screens.length, 3, `${industry.path} screens`)
      for (const screen of industry.screens) {
        assert.ok(PRODUCT_IMAGE_IDS.includes(screen.id), `${industry.path}: screen ${screen.id} is not a capture`)
        assert.ok(screen.caption.length > 30)
      }
      assert.ok(PRODUCT_IMAGE_IDS.includes(industry.hero), `${industry.path}: hero ${industry.hero}`)
      assert.equal(industry.faqs.length, 8, `${industry.path} FAQs`)
      const REGULATION = /Regulations?|Act\b|CDM|RIDDOR|LOLER|PUWER|COSHH|CQC|HSE|DVSA|Order|guideline|Code|SSIP|GDPR/
      let named = 0
      for (const faq of industry.faqs) {
        assert.ok(faq.a.length > 80, `${industry.path}: "${faq.q}" is thin`)
        if (REGULATION.test(faq.a + ' ' + faq.q)) named++
      }
      // The brief asks for FAQs that name the regulation they answer; a "how do we get started" question has none to name.
      assert.ok(named >= 7, `${industry.path}: only ${named} of ${industry.faqs.length} FAQs name a regulation or authority`)
      assert.equal(industry.tools.length, 2, `${industry.path} tools`)
      for (const tool of industry.tools) assert.ok(Object.values(TOOL_PATHS).includes(tool.href), `${industry.path}: tool ${tool.href}`)
      assert.equal(industry.legal.points.length, 3, `${industry.path} legal points`)
      for (const point of industry.legal.points) {
        assert.ok(point.source, `${industry.path}: "${point.title}" has no source`)
        assert.match(point.source.url, /^https:\/\//)
        assert.match(point.source.checked, DATE)
      }
    }
  })

  test('the registry entry for each industry is what the page renders: its pains’ modules, its tools, the platform and the demo', () => {
    for (const industry of INDUSTRIES) {
      const rendered = new Set([...industry.pains.map((p) => modulePage(p.module).path), ...industry.tools.map((t) => t.href), '/platform', '/demo'])
      for (const target of LINK_REGISTRY[industry.path]) assert.ok(rendered.has(target), `${industry.path} declares ${target} but does not render it`)
    }
  })

  test('nothing on the "never" or "once built" lists, and no bracketed placeholder, in any industry copy', () => {
    for (const industry of INDUSTRIES) {
      assertNoPositiveClaims(industry, industry.path)
      for (const text of strings(industry)) assert.ok(!/\[[^\]]*\]/.test(text), `${industry.path}: placeholder in "${text.slice(0, 60)}"`)
    }
  })

  test('the sector words the brief asked for are on the transport page', () => {
    const text = strings(transportLogistics).join(' ').toLowerCase()
    for (const word of ['yard', 'depot', 'tail lift', 'banksman', 'curtain-sider', 'walkaround']) assert.ok(text.includes(word), word)
  })

  test('field services still says it is not a lone-worker alarm, and names the schemes only as schemes', () => {
    const text = strings(fieldServices).join(' ')
    assert.match(text, /not a lone-worker alarm/i)
    assert.match(text, /not an accreditation and is not affiliated with any scheme/)
  })

  test('the care page is about staff, not residents, and cites Regulation 17 as a records duty', () => {
    const text = strings(care).join(' ')
    assert.match(care.faqs[0].q, /clinical or resident safety/)
    assert.match(care.faqs[0].a, /^No/)
    assert.match(text, /Regulation 17/)
  })
})

describe('Phase 3 module pages (lib/platform-modules-phase-3.ts)', () => {
  test('nine pages: seven live, two gated on a product input', () => {
    assert.equal(PHASE_3_MODULE_PAGES.length, 9)
    const gated = PHASE_3_MODULE_PAGES.filter((p) => p.gate)
    assert.deepEqual(gated.map((p) => p.id).sort(), ['checklists', 'contractors'])
    for (const page of gated) assert.equal(modulePageLive(page), false, `${page.id} is gated and the input is false`)
    assert.equal(liveModulePages().length, MODULE_PAGES.length - gated.length)
  })

  test('live pages run Record, Resolve, Prevent with the bowtie page after risk assessments', () => {
    const ids = liveModulePages().map((p) => p.id)
    assert.deepEqual(ids, ['incidents', 'riddor', 'fleet', 'investigations', 'actions', 'permits', 'risk', 'bowtie', 'training', 'documents', 'dashboards'])
    assert.equal(modulePageName('bowtie'), 'Bowtie analysis')
    assert.equal(modulePageName('fleet'), 'Fleet & plant')
  })

  test('every "built for" industry and "try it free" tool is a page that exists', () => {
    for (const page of MODULE_PAGES) {
      for (const href of page.industries ?? []) assert.ok(routeExists(href, true, ALL_ON), `${page.id} → ${href}`)
      for (const tool of page.tools ?? []) assert.ok(Object.values(TOOL_PATHS).includes(tool.href), `${page.id} → ${tool.href}`)
    }
  })

  test('the per-page do-not-claim lists hold: no telematics, review dates, custom dashboards or generated PDFs claimed in rendered copy', () => {
    // A sentence that denies the capability ("It is not telematics") is the honest "not yet"; a sentence that asserts it fails.
    const NEGATED = /\b(not|no|never|nor|without|does not|is not|are not|cannot|rather than|instead of)\b/i
    const check = (id, patterns) => {
      const { doNotClaim, ...rendered } = modulePage(id)
      void doNotClaim
      const sentences = strings(rendered).flatMap((text) => text.split(/(?<=[.!?])\s+/))
      for (const pattern of patterns) {
        // A question ('Is jobsafe telematics?') is not a claim; its answer is checked as a sentence of its own.
        const positive = sentences.filter((sentence) => pattern.test(sentence) && !NEGATED.test(sentence) && !sentence.trim().endsWith('?'))
        assert.deepEqual(positive, [], `${id} claims ${pattern.source}`)
      }
    }
    check('fleet', [/telematics/i, /tachograph/i, /O-licence management/i, /FORS accredit/i])
    check('documents', [/review date/i, /read[- ]and[- ]sign/i, /approval workflow/i, /expiry reminder/i])
    check('dashboards', [/custom dashboard/i, /\bTRIR\b/, /\bLTIFR\b/, /scheduled report/i])
    check('investigations', [/5[- ]whys/i, /fishbone/i, /lightbox/i])
    check('actions', [/emails? (you|the owner)/i, /generates? (a )?PDF/i])
  })
})
