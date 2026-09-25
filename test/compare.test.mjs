// node --test test/compare.test.mjs
//
// Phase 3, Part D: the comparison pages. These tests pin the CAP Code
// section 3 discipline the pages promise: the same fifteen rows on every
// page, a source URL and a DD/MM/YYYY date on every claim about the other
// product, at least one row per page where the other product is stronger,
// no knocking copy, no placeholders, no ratings, and nothing said about
// jobsafe that the claims checker would refuse.
//
// Node 22 strips TypeScript types natively, so lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { CAP_CODE, COMPARE_PAGES, comparePage, isoDateFromUk } from '../lib/compare.ts'
import { COMPARE_PATHS, LINK_REGISTRY } from '../lib/seo/links.ts'
import { routeExists } from '../lib/routes.ts'
import { FORBIDDEN, NEW_PAGE_ONLY, jobsafeSideStrings, scan } from '../scripts/claims-check.mjs'

const ROW_IDS = ['uk-hosting', 'gbp-prices', 'vat', 'riddor', 'permits', 'fleet', 'offline', 'free-or-demo', 'implementation', 'ai', 'sso', 'integrations', 'lone-worker', 'coshh', 'security']
const UK_DATE = /^\d\d\/\d\d\/\d{4}$/
const EDGES = new Set(['jobsafe', 'them', 'even', 'depends'])
const RULES = [...FORBIDDEN, ...NEW_PAGE_ONLY]

/** Every string anywhere in a value, with its path. */
function allStrings(value, path = '', out = []) {
  if (typeof value === 'string') out.push({ path, text: value })
  else if (Array.isArray(value)) value.forEach((item, i) => allStrings(item, `${path}[${i}]`, out))
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) allStrings(child, path ? `${path}.${key}` : key, out)
  return out
}

const positiveHits = (text) => scan(text, RULES).filter((hit) => !hit.negated)

// ── shape ────────────────────────────────────────────────────────────────────

describe('the three comparison pages', () => {
  test('are Mitti, Evotix and EcoOnline, at the paths the link registry declares', () => {
    assert.deepEqual(
      COMPARE_PAGES.map((page) => page.slug),
      ['mitti-safetyculture', 'evotix', 'ecoonline'],
    )
    assert.deepEqual(
      COMPARE_PAGES.map((page) => page.path),
      [COMPARE_PATHS.mitti, COMPARE_PATHS.evotix, COMPARE_PATHS.ecoonline],
    )
    for (const page of COMPARE_PAGES) assert.equal(page.path, `${COMPARE_PATHS.hub}/${page.slug}`)
  })

  test('comparePage() finds each by slug and nothing else', () => {
    for (const page of COMPARE_PAGES) assert.equal(comparePage(page.slug), page)
    assert.equal(comparePage('safetyculture'), undefined)
  })

  test('each has exactly the fifteen rows, in order', () => {
    for (const page of COMPARE_PAGES) {
      assert.deepEqual(
        page.rows.map((row) => row.id),
        ROW_IDS,
        `${page.slug} rows`,
      )
    }
  })

  test('every row has a topic, both cells, a valid edge and a tooltip', () => {
    for (const page of COMPARE_PAGES) {
      for (const row of page.rows) {
        assert.ok(row.topic.length > 0, `${page.slug} ${row.id} topic`)
        assert.ok(row.jobsafe.length > 20, `${page.slug} ${row.id} jobsafe cell`)
        assert.ok(row.them.length > 20, `${page.slug} ${row.id} competitor cell`)
        assert.ok(EDGES.has(row.edge), `${page.slug} ${row.id} edge ${row.edge}`)
        assert.ok(row.help && row.help.length > 0, `${page.slug} ${row.id} help`)
      }
    }
  })

  test('the CAP Code citation is section 3, rules 3.32 to 3.43, at the ASA URL', () => {
    assert.equal(CAP_CODE.url, 'https://www.asa.org.uk/type/non_broadcast/code_section/03.html')
    assert.equal(CAP_CODE.label, 'CAP Code section 3')
    assert.match(CAP_CODE.rules, /3\.32 to 3\.43/)
    assert.match(CAP_CODE.rules, /identifiable competitors/)
  })
})

// ── sources and dates ────────────────────────────────────────────────────────

describe('every competitor claim carries a source and a date', () => {
  test('source.url is https and source.checked is DD/MM/YYYY', () => {
    for (const page of COMPARE_PAGES) {
      for (const row of page.rows) {
        assert.match(row.source.url, /^https:\/\//, `${page.slug} ${row.id} source url`)
        assert.match(row.source.checked, UK_DATE, `${page.slug} ${row.id} checked`)
        if (row.source.quote) assert.ok(row.source.quote.length < 200, `${page.slug} ${row.id} quote under 200 characters`)
      }
    }
  })

  test('lastChecked is DD/MM/YYYY and converts to an ISO date for <time>', () => {
    for (const page of COMPARE_PAGES) {
      assert.match(page.lastChecked, UK_DATE, `${page.slug} lastChecked`)
      assert.match(isoDateFromUk(page.lastChecked), /^\d{4}-\d\d-\d\d$/)
    }
    assert.equal(isoDateFromUk('25/09/2026'), '2026-09-25')
  })

  test('every source belongs to the competitor being compared, or to the ASA', () => {
    const HOSTS = {
      'mitti-safetyculture': /(^|\.)mitti\.com$/,
      evotix: /(^|\.)evotix\.com$/,
      ecoonline: /(^|\.)ecoonline\.com$/,
    }
    for (const page of COMPARE_PAGES) {
      for (const row of page.rows) {
        const host = new URL(row.source.url).host
        assert.ok(HOSTS[page.slug].test(host) || host === 'www.asa.org.uk', `${page.slug} ${row.id} cites ${host}`)
      }
      for (const monitor of page.competitor.monitor) assert.ok(HOSTS[page.slug].test(new URL(monitor.url).host), `${page.slug} monitors ${monitor.url}`)
    }
  })
})

// ── honesty ──────────────────────────────────────────────────────────────────

describe('the comparisons are honest', () => {
  test('every page has at least one row where the competitor is stronger', () => {
    for (const page of COMPARE_PAGES) {
      assert.ok(
        page.rows.some((row) => row.edge === 'them'),
        `${page.slug} has no row with edge "them"`,
      )
    }
  })

  test('every page lists reasons to choose the competitor, and reasons to choose jobsafe', () => {
    for (const page of COMPARE_PAGES) {
      assert.ok(page.chooseThem.length >= 3, `${page.slug} chooseThem`)
      assert.ok(page.chooseJobsafe.length >= 3, `${page.slug} chooseJobsafe`)
      assert.ok(page.summary.length > 40, `${page.slug} summary`)
    }
  })

  test('no placeholder, star rating or knocking word anywhere on a page', () => {
    const KNOCKING = /\b(worse|inferior|clunky|outdated)\b/i
    const RATING = /★|☆|\b\d(\.\d)?\s*(stars?|\/\s?5)\b/i
    for (const page of COMPARE_PAGES) {
      for (const { path, text } of allStrings(page)) {
        assert.ok(!text.includes('['), `${page.slug} ${path} contains a placeholder: ${text}`)
        assert.ok(!KNOCKING.test(text), `${page.slug} ${path} knocks: ${text.match(KNOCKING)?.[0]}`)
        assert.ok(!RATING.test(text), `${page.slug} ${path} rates: ${text.match(RATING)?.[0]}`)
      }
    }
  })

  test('the Mitti page says "formerly SafetyCulture"', () => {
    const mitti = comparePage('mitti-safetyculture')
    const text = [mitti.summary, mitti.competitor.name, ...mitti.rows.map((row) => `${row.jobsafe} ${row.them}`)].join(' ')
    assert.ok(text.includes('formerly SafetyCulture'))
    assert.equal(mitti.competitor.name, 'Mitti (formerly SafetyCulture)')
    assert.equal(mitti.competitor.shortName, 'Mitti')
  })

  test('the switching section has the fixed title and never says migrate', () => {
    for (const page of COMPARE_PAGES) {
      assert.equal(page.switching.title, 'Talk to us about moving your records')
      assert.ok(!/migrat/i.test(page.switching.body), `${page.slug} switching body`)
      assert.ok(/CSV/.test(page.switching.body), `${page.slug} switching body mentions CSV export`)
    }
  })

  test('every page has at least six FAQs covering price, data location, offline, RIDDOR and moving records', () => {
    for (const page of COMPARE_PAGES) {
      assert.ok(page.faqs.length >= 6, `${page.slug} has ${page.faqs.length} FAQs`)
      const questions = page.faqs.map((faq) => faq.q).join(' ')
      for (const topic of [/cheaper/i, /data/i, /offline/i, /RIDDOR/, /records/i]) assert.match(questions, topic, `${page.slug} FAQ covers ${topic}`)
      for (const faq of page.faqs) assert.ok(faq.a.length > 40, `${page.slug} answer to "${faq.q}"`)
    }
  })
})

// ── what jobsafe says about itself ───────────────────────────────────────────

describe('jobsafe-side copy passes the claims checker', () => {
  test('jobsafe cells, chooseJobsafe, switching.body and FAQ answers make no positive forbidden claim', () => {
    for (const page of COMPARE_PAGES) {
      const strings = [
        ...page.rows.map((row) => ({ where: `${row.id}.jobsafe`, text: row.jobsafe })),
        ...page.chooseJobsafe.map((text, i) => ({ where: `chooseJobsafe[${i}]`, text })),
        { where: 'switching.body', text: page.switching.body },
        ...page.faqs.map((faq, i) => ({ where: `faqs[${i}].a`, text: faq.a })),
      ]
      for (const { where, text } of strings) {
        const hits = positiveHits(text)
        assert.deepEqual(hits, [], `${page.slug} ${where}: ${hits.map((hit) => `[${hit.rule}] "${hit.match}"`).join(', ')}`)
      }
    }
  })

  test('every string the checker scans (everything outside the competitor fields) is clean', () => {
    // Identifiers are not claims: the row id `sso` is required by the brief and is not a sentence about jobsafe.
    const IDENTIFIER_KEYS = /(^|\.)(id|slug|path|href|website)$/
    for (const page of COMPARE_PAGES) {
      for (const { path, text } of jobsafeSideStrings(page)) {
        if (IDENTIFIER_KEYS.test(path)) continue
        const hits = positiveHits(text)
        assert.deepEqual(hits, [], `${page.slug} ${path}: ${hits.map((hit) => `[${hit.rule}] "${hit.match}"`).join(', ')}`)
      }
    }
  })

  test('the price row says what the price book allows and nothing more', () => {
    for (const page of COMPARE_PAGES) {
      const row = page.rows.find((r) => r.id === 'gbp-prices')
      assert.match(row.jobsafe, /Quoted in pounds per user per month, VAT shown separately; no price list published yet/)
      assert.ok(!/£\s?\d/.test(row.jobsafe), `${page.slug} price row quotes a number`)
    }
  })

  test('the security row claims no certification', () => {
    for (const page of COMPARE_PAGES) {
      const row = page.rows.find((r) => r.id === 'security')
      assert.match(row.jobsafe, /^None held/)
      assert.match(row.jobsafe, /London region/)
    }
  })
})

// ── links ────────────────────────────────────────────────────────────────────

describe('the jobsafe-side links are real pages', () => {
  test('every jobsafeSource.href is a route that exists with the platform launched', () => {
    for (const page of COMPARE_PAGES) {
      for (const row of page.rows) {
        if (!row.jobsafeSource) continue
        assert.ok(routeExists(row.jobsafeSource.href, true), `${page.slug} ${row.id} links ${row.jobsafeSource.href}, which is not a route`)
        assert.ok(row.jobsafeSource.label.length > 0, `${page.slug} ${row.id} link label`)
      }
    }
  })

  test('every page links /security and /platform/offline from its rows', () => {
    for (const page of COMPARE_PAGES) {
      const hrefs = new Set(page.rows.map((row) => row.jobsafeSource?.href).filter(Boolean))
      assert.ok(hrefs.has('/security'), `${page.slug} rows link /security`)
      assert.ok(hrefs.has('/platform/offline'), `${page.slug} rows link /platform/offline`)
    }
  })

  test('the module links the registry requires of each page are on its rows', () => {
    for (const page of COMPARE_PAGES) {
      const hrefs = new Set(page.rows.map((row) => row.jobsafeSource?.href).filter(Boolean))
      const required = LINK_REGISTRY[page.path].filter((href) => href.startsWith('/platform/') || href === '/security')
      for (const href of required) assert.ok(hrefs.has(href), `${page.slug} rows must link ${href}`)
    }
  })
})
