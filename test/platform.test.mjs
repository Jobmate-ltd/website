// node --test test/
//
// Phase 2 groundwork: the route manifest, the flag-aware navigation, the
// keyword map, the internal-link registry, the hero variants, the analytics
// gate, the platform content model and the product-image manifest. Every
// test here pins a rule from the Phase 2 brief:
//
//   · with the flag off, production renders exactly as after Phase 1;
//   · the nav and footer never link to a 404;
//   · Sign up and Log in keep today's labels and destinations in both states;
//   · every screenshot is a real export that exists on disk;
//   · nothing on the "never" or "once built" lists is claimed.
//
// Node 22 strips TypeScript types natively, so lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { STATIC_ROUTES, publicRoutes, routeExists } from '../lib/routes.ts'
import { NAV, FOOTER, PLATFORM_NAV, PLATFORM_FOOTER, activeNav, activeFooter, navForFlag, footerForFlag, navPromo } from '../lib/site.ts'
import { LOGIN_URL, SIGNUP_TRIAL_URL, DEMO_BOOKING_URL, BOOK_DEMO_URL, FALLBACK_CTA, ADDRESS_LINE, HOSTING_LINE, LEGAL_NAME, PHONE_DISPLAY, PRICE_BOOK, priceBookLabel } from '../lib/brand.ts'
import { KEYWORD_ROWS, findRow, rowFor, launchOnlyPaths } from '../lib/seo/keyword-map.ts'
import { LINK_REGISTRY, MODULE_PATHS, linksFrom, linksTo, clusterArticlesFor, moduleFor } from '../lib/seo/links.ts'
import { HERO_HEADLINES, heroVariant, heroHeadline } from '../lib/hero-variants.ts'
import { track } from '../lib/analytics.ts'
import { MODULES, FAMILIES, HOME_FAQS, HOME_PAA, INCIDENT_STORY, REGULATIONS, WHY_SWITCH, moduleById, modulesWithPages, modulesIn } from '../lib/platform.ts'
import { MODULE_PAGES, modulePage, modulePageByPath } from '../lib/platform-modules.ts'
import { PRODUCT_IMAGES, PRODUCT_IMAGE_IDS } from '../lib/product-images.ts'
import { getAllPosts } from '../lib/insights.ts'

const ROOT = join(import.meta.dirname, '..')
const PLATFORM_ROUTES = STATIC_ROUTES.filter((r) => r.platformOnly).map((r) => r.path)
const ARTICLE_PATHS = getAllPosts().map((p) => `/insights/${p.slug}`)
const ALL_ON = { compare: true, inputs: { checklistBuilderShipped: true, contractorCrudShipped: true, emailAlertsShipped: true, csvImportShipped: true, pdfExportShipped: true } }
const pageExists = (path) => routeExists(path, true, ALL_ON) || ARTICLE_PATHS.includes(path) || ['/insights', '/academy', '/toolkit'].includes(path)

/**
 * Phrases from the "never say" and "say once built" lists (docs/REBUILD.md §3
 * and the Phase 2 brief). None may appear in platform copy as a positive
 * claim. Negations ("not available yet", "does not") are checked by hand in
 * the copy, so the test asserts the phrase is absent outright, which is the
 * stricter reading.
 */
const NEVER_CLAIM = [
  /push notification/i,
  /push alert/i,
  /email alert/i,
  /voice note/i,
  /immutable/i,
  /ISO 45001/i,
  /HSSE compliant/i,
  /sign in with (google|apple)/i,
  /escalation rule/i,
  /App Store/,
  /Google Play/,
  /free trial/i,
  /checkout/i,
  /single sign-on|\bSSO\b/,
  /\bAPI access\b/i,
  /files? RIDDOR (with|to) (the )?HSE for you/i,
  /\d+× (faster|quicker)/i,
]

function assertNoForbiddenClaims(text, where) {
  for (const pattern of NEVER_CLAIM) {
    assert.ok(!pattern.test(text), `${where} claims "${pattern.source}": ${text.match(pattern)?.[0]}`)
  }
}

// ── routes ───────────────────────────────────────────────────────────────────

describe('route manifest (Phase 2 routes are held back by the flag)', () => {
  const PHASE_2 = ['/contact', '/demo', '/platform', '/platform/incident-reporting', '/platform/offline', '/platform/permits-to-work', '/platform/riddor', '/platform/risk-assessments', '/pricing', '/security']
  const PHASE_3 = ['/platform/investigations', '/platform/corrective-actions', '/platform/fleet-compliance', '/platform/training-competence', '/platform/document-control', '/platform/dashboards', '/platform/bowtie-analysis', '/industries/construction', '/industries/facilities-management', '/industries/manufacturing-warehousing', '/tools', '/tools/riddor-checker', '/tools/risk-matrix', '/tools/accident-frequency-rate']
  const GATED = ['/platform/checklists', '/platform/contractors']
  const COMPARE = ['/compare', '/compare/mitti-safetyculture', '/compare/evotix', '/compare/ecoonline']
  const EVERYTHING_ON = { compare: true, inputs: { checklistBuilderShipped: true, contractorCrudShipped: true, emailAlertsShipped: true, csvImportShipped: true, pdfExportShipped: true } }

  test('every Phase 2 and Phase 3 route is platformOnly and absent while the flag is off', () => {
    assert.deepEqual([...PLATFORM_ROUTES].sort(), [...PHASE_2, ...PHASE_3, ...GATED, ...COMPARE].sort())
    for (const path of PLATFORM_ROUTES) {
      assert.equal(routeExists(path, false, EVERYTHING_ON), false, `${path} must not exist with the flag off`)
    }
    for (const path of [...PHASE_2, ...PHASE_3]) assert.equal(routeExists(path, true), true, `${path} must exist with the flag on`)
  })

  test('comparison pages need NEXT_PUBLIC_COMPARE_PAGES as well, and gated modules need their input', () => {
    for (const path of COMPARE) {
      assert.equal(routeExists(path, true, { compare: false }), false, `${path} without the compare flag`)
      assert.equal(routeExists(path, true, { compare: true }), true, `${path} with the compare flag`)
    }
    const off = { checklistBuilderShipped: false, contractorCrudShipped: false, emailAlertsShipped: false, csvImportShipped: false, pdfExportShipped: false }
    assert.equal(routeExists('/platform/checklists', true, { inputs: off }), false)
    assert.equal(routeExists('/platform/contractors', true, { inputs: off }), false)
    assert.equal(routeExists('/platform/checklists', true, { inputs: { ...off, checklistBuilderShipped: true } }), true)
    assert.equal(routeExists('/platform/contractors', true, { inputs: { ...off, contractorCrudShipped: true } }), true)
    // The shipped defaults are the brief's inputs, all `no`.
    assert.equal(routeExists('/platform/checklists', true), false)
    assert.equal(routeExists('/platform/contractors', true), false)
  })

  test('no pre-existing URL changed: every Phase 1 route is still public with the flag off', () => {
    const phase1 = ['/', '/about', '/industries/window-door-fitters', '/industries/healthcare', '/industries/field-services', '/industries/transport-logistics', '/academy', '/insights', '/toolkit', '/privacy-policy', '/terms', '/cookies']
    const off = publicRoutes(false).map((r) => r.path)
    assert.deepEqual(off.sort(), phase1.sort())
  })

  test('every static route has a page file', () => {
    for (const route of STATIC_ROUTES) {
      const dir = route.path === '/' ? 'app' : join('app', route.path.slice(1))
      assert.ok(existsSync(join(ROOT, dir, 'page.tsx')), `${route.path} → ${dir}/page.tsx`)
    }
  })
})

// ── navigation ───────────────────────────────────────────────────────────────

describe('navigation for each flag state', () => {
  test('flag off: the Phase 1 nav and footer are returned unchanged', () => {
    assert.equal(activeNav(false), NAV)
    assert.equal(activeFooter(false), FOOTER)
  })

  test('Sign up and Log in keep today\'s labels and destinations in both states', () => {
    const today = { login: NAV.actions.find((a) => a.kind === 'login'), signup: NAV.actions.find((a) => a.kind === 'signup') }
    assert.equal(today.login?.href, 'https://app.jobsafe.cloud/login')
    assert.equal(today.signup?.href, 'https://app.jobsafe.cloud/signup-trial')
    for (const nav of [activeNav(false), activeNav(true)]) {
      const login = nav.actions.find((a) => a.kind === 'login')
      const signup = nav.actions.find((a) => a.kind === 'signup')
      assert.equal(login?.href, LOGIN_URL)
      assert.equal(signup?.href, SIGNUP_TRIAL_URL)
      assert.equal(login?.label, today.login.label)
      assert.equal(signup?.label, today.signup.label)
      assert.equal(login?.href, today.login.href)
      assert.equal(signup?.href, today.signup.href)
    }
  })

  test('flag on: Book a demo is a nav action pointing at the Calendly booking page', () => {
    const demo = activeNav(true).actions.find((a) => a.kind === 'demo')
    assert.equal(demo?.href, DEMO_BOOKING_URL)
    assert.equal(demo?.href, 'https://calendly.com/jobmate-sales/30min')
    assert.match(demo?.label ?? '', /^Book a demo$/)
    // NEXT_PUBLIC_BOOK_DEMO_URL is unset in tests; the fallback is the same page.
    assert.equal(BOOK_DEMO_URL ?? FALLBACK_CTA.href, DEMO_BOOKING_URL)
  })

  const hrefsOf = (nav) => nav.items.flatMap((item) => [item.href, ...(item.children ?? []).map((c) => c.href), ...(item.columns ?? []).flatMap((col) => col.items.map((c) => c.href))]).filter(Boolean)

  test('flag on: the nav never links to a page that does not exist', () => {
    const hrefs = hrefsOf(activeNav(true))
    assert.ok(hrefs.length > 10)
    for (const href of hrefs) {
      if (!href.startsWith('/') || href.includes('#')) continue
      assert.ok(pageExists(href), `nav links to ${href}, which is not a page`)
    }
  })

  test('flag on: the footer never links to a page that does not exist, and carries Cookie settings and the address line', () => {
    const footer = activeFooter(true)
    const links = footer.columns.flatMap((c) => c.links)
    for (const link of links) {
      if (link.action || !link.href?.startsWith('/') || link.href.includes('#')) continue
      assert.ok(pageExists(link.href), `footer links to ${link.href}, which is not a page`)
    }
    assert.ok(links.some((l) => l.action === 'cookie-settings' || /cookie settings/i.test(l.label)), 'Cookie settings missing from the footer')
    assert.equal(footer.addressLine, `${HOSTING_LINE} · Made by ${LEGAL_NAME}, ${ADDRESS_LINE} · ${PHONE_DISPLAY}`)
    assert.equal(footer.addressLine, 'Hosted in London · Made by Jobmate Ltd, 86 Tettenhall Road, Wolverhampton WV1 4TF · 0333 8000 883')
  })

  test('navForFlag drops the menus whose pages are all missing (Solutions today) and keeps Platform, Industries, Resources, Pricing', () => {
    const labels = navForFlag(PLATFORM_NAV, true).items.map((i) => i.label)
    assert.deepEqual(labels, ['Platform', 'Industries', 'Resources', 'Pricing'])
    const raw = PLATFORM_NAV.items.map((i) => i.label)
    assert.ok(raw.includes('Solutions'), 'Solutions is configured, ready for its pages')
  })

  test('navForFlag with the flag off strips every platform link and leaves nothing that 404s', () => {
    const off = navForFlag(PLATFORM_NAV, false)
    for (const href of hrefsOf(off)) {
      if (!href.startsWith('/') || href.includes('#')) continue
      assert.ok(routeExists(href, false) || ARTICLE_PATHS.includes(href) || ['/insights', '/academy', '/toolkit'].includes(href), `${href} would 404 with the flag off`)
    }
    const offFooter = footerForFlag(PLATFORM_FOOTER, false)
    for (const link of offFooter.columns.flatMap((c) => c.links)) {
      if (link.action || !link.href?.startsWith('/') || link.href.includes('#')) continue
      assert.ok(routeExists(link.href, false) || ['/insights', '/academy', '/toolkit'].includes(link.href), `${link.href} would 404 with the flag off`)
    }
  })

  test('flag on: Resources carries the Free tools column; the Compare column and footer column exist only with the compare flag', () => {
    const resources = navForFlag(PLATFORM_NAV, true).items.find((i) => i.label === 'Resources')
    const headings = (resources?.columns ?? []).map((c) => c.heading)
    assert.ok(headings.includes('Free tools'), 'Free tools column missing')
    // NEXT_PUBLIC_COMPARE_PAGES is unset in tests, so the comparisons are 404 and the column is dropped.
    assert.ok(!headings.includes('Compare'), 'Compare column must not render while the comparison pages are 404')
    const tools = resources?.columns?.find((c) => c.heading === 'Free tools')?.items.map((i) => i.href) ?? []
    assert.deepEqual(tools, ['/tools/riddor-checker', '/tools/risk-matrix', '/tools/accident-frequency-rate', '/tools'])
    const footer = footerForFlag(PLATFORM_FOOTER, true)
    assert.ok(!footer.columns.some((c) => c.heading === 'Compare'), 'Compare footer column must not render while the comparison pages are 404')
    assert.ok(footer.columns.find((c) => c.heading === 'Resources')?.links.some((l) => l.href === '/tools'), 'the footer lists the free tools')
    assert.ok(footer.columns.find((c) => c.heading === 'Platform')?.links.some((l) => l.href === '/platform/bowtie-analysis'), 'the footer lists the bowtie page')
  })

  test('the Platform promo card points at the tour anchor on /platform', () => {
    assert.equal(navPromo('Platform')?.href, '/platform#tour')
    assert.equal(navPromo('Nowhere'), null)
  })

  test('the nav never links to the platform app or a live demo', () => {
    const all = JSON.stringify([PLATFORM_NAV, PLATFORM_FOOTER])
    assert.ok(!/platform\.jobsafe|demo\.jobsafe|\/signup(?!-trial)/.test(all), 'a platform or live-demo URL leaked into the nav')
  })
})

// ── keyword map ──────────────────────────────────────────────────────────────

describe('keyword map (content/seo/keyword-map.json)', () => {
  test('has a row for every platform page, the homepage and /about', () => {
    const paths = KEYWORD_ROWS.map((r) => r.path)
    for (const p of [...PLATFORM_ROUTES, '/', '/about']) assert.ok(paths.includes(p), `no keyword row for ${p}`)
  })

  test('every row points at a real page and its copy is within the limits', () => {
    const seen = new Set()
    for (const row of KEYWORD_ROWS) {
      assert.ok(routeExists(row.path, true, ALL_ON), `${row.path} is not a route`)
      assert.ok(!seen.has(row.h1), `duplicate H1 "${row.h1}"`)
      seen.add(row.h1)
      assert.ok(row.title.length <= 70, `${row.path} title is ${row.title.length} chars`)
      assert.ok(row.description.length >= 70 && row.description.length <= 160, `${row.path} description is ${row.description.length} chars`)
      assert.ok(row.primary.keyword.length > 0)
      if (row.prelaunch) {
        // The pre-launch copy is the Phase 1 page's metadata, verbatim, so the flag-off render never changes; it is not held to the launch limits.
        assert.ok(row.prelaunch.title.length <= 80)
        assert.ok(row.prelaunch.description.length <= 180)
      }
    }
  })

  test('rowFor returns the prelaunch copy with the flag off and the launch copy with it on', () => {
    const home = findRow('/')
    assert.ok(home?.prelaunch)
    assert.equal(rowFor('/', false)?.title, home.prelaunch.title)
    assert.equal(rowFor('/', true)?.title, home.title)
    assert.equal(rowFor('/', false)?.h1, 'Record. Resolve. Prevent.')
    assert.equal(rowFor('/platform', false), null, 'a launch-only page has no copy with the flag off')
    assert.equal(rowFor('/platform', true)?.h1, findRow('/platform').h1)
    assert.equal(rowFor('/nowhere', true), null)
  })

  test('launchOnlyPaths is exactly the set of platformOnly routes in the map', () => {
    assert.deepEqual([...launchOnlyPaths()].sort(), PLATFORM_ROUTES.sort())
  })

  test('titles carry the brand once, lowercase', () => {
    for (const row of KEYWORD_ROWS) {
      for (const copy of [row, row.prelaunch].filter(Boolean)) {
        assert.ok(!/JobSafe|Jobsafe|JOBSAFE/.test(copy.title + copy.description + copy.h1), `${row.path}: brand miscased`)
        assert.ok(/jobsafe/.test(copy.title), `${row.path}: title "${copy.title}" does not name the brand`)
      }
    }
  })
})

// ── link registry ────────────────────────────────────────────────────────────

describe('internal link registry (lib/seo/links.ts)', () => {
  test('every source and target is a page that exists once the flag is on', () => {
    for (const [source, targets] of Object.entries(LINK_REGISTRY)) {
      assert.ok(pageExists(source), `registry source ${source} is not a page`)
      for (const target of targets) assert.ok(pageExists(target), `${source} → ${target} is not a page`)
      assert.ok(!targets.includes(source), `${source} links to itself`)
      assert.equal(new Set(targets).size, targets.length, `${source} lists a target twice`)
    }
  })

  test('every platform page has at least three contextual links in and three out', () => {
    for (const path of PLATFORM_ROUTES) {
      assert.ok(linksFrom(path).length >= 3, `${path} has ${linksFrom(path).length} links out`)
      assert.ok(linksTo(path).length >= 3, `${path} has ${linksTo(path).length} links in`)
    }
  })

  test('each module page links /platform and its cluster articles, and every article links back to a module page that lists it', () => {
    for (const path of Object.values(MODULE_PATHS)) {
      assert.ok(linksFrom(path).includes('/platform'), `${path} does not link /platform`)
      for (const article of clusterArticlesFor(path)) {
        assert.ok(linksFrom(path).includes(article), `${path} does not link its article ${article}`)
        // An article may cluster around two modules (investigations and incidents both list the
        // investigation guide); its backlink goes to one of them, and that one must list it.
        const back = moduleFor(article)
        assert.ok(back && clusterArticlesFor(back).includes(article), `${article} links back to ${back}, which does not list it`)
      }
    }
  })

  test('the toolkit clusters around incident reporting', () => {
    assert.equal(moduleFor('/toolkit'), MODULE_PATHS.incidents)
    assert.equal(moduleFor('/privacy-policy'), null)
  })
})

// ── hero variants ────────────────────────────────────────────────────────────

describe('hero variants (NEXT_PUBLIC_HERO_VARIANT)', () => {
  test('A by default, B or C by env, anything else falls back to A', () => {
    assert.equal(heroVariant({}), 'A')
    assert.equal(heroVariant({ NEXT_PUBLIC_HERO_VARIANT: 'b' }), 'B')
    assert.equal(heroVariant({ NEXT_PUBLIC_HERO_VARIANT: ' C ' }), 'C')
    assert.equal(heroVariant({ NEXT_PUBLIC_HERO_VARIANT: 'D' }), 'A')
    assert.equal(heroHeadline({ NEXT_PUBLIC_HERO_VARIANT: 'B' }), HERO_HEADLINES.B)
  })

  test('every variant keeps "health and safety" and none claims what is not built', () => {
    for (const [variant, headline] of Object.entries(HERO_HEADLINES)) {
      assert.match(headline, /health and safety/i, `variant ${variant}`)
      assertNoForbiddenClaims(headline, `hero ${variant}`)
    }
  })
})

// ── analytics ────────────────────────────────────────────────────────────────

describe('analytics gate', () => {
  test('track() is a silent no-op outside a browser', () => {
    assert.equal(typeof window, 'undefined')
    assert.equal(track('book_demo_click', { placement: 'test' }), false)
  })
})

// ── platform content model ───────────────────────────────────────────────────

describe('platform content model (lib/platform.ts)', () => {
  test('twelve modules across the three families; every module page is in the registry, and the gated two wait on their input', () => {
    assert.equal(MODULES.length, 12)
    assert.deepEqual(Object.keys(FAMILIES), ['record', 'resolve', 'prevent'])
    for (const family of Object.keys(FAMILIES)) assert.equal(modulesIn(family).length, 4)
    const gated = [MODULE_PATHS.checklists, MODULE_PATHS.contractors]
    const expected = Object.values(MODULE_PATHS).filter((p) => p !== MODULE_PATHS.bowtie && !gated.includes(p))
    assert.deepEqual(modulesWithPages().map((m) => m.path).sort(), expected.sort())
    assert.equal(moduleById('checklists').path, null, 'checklists has no page until the builder ships')
    assert.equal(moduleById('contractors').path, null, 'contractors has no page until in-app records ship')
  })

  test('every module with a page is a route, and only Checklists and Contractors are "expanding"', () => {
    for (const m of modulesWithPages()) assert.ok(routeExists(m.path, true), m.path)
    assert.deepEqual(MODULES.filter((m) => m.status === 'expanding').map((m) => m.id).sort(), ['checklists', 'contractors'])
    assert.throws(() => moduleById('nowhere'))
  })

  test('every screenshot referenced exists in the manifest', () => {
    const ids = new Set(PRODUCT_IMAGE_IDS)
    for (const f of Object.values(FAMILIES)) assert.ok(ids.has(f.screenshot), f.screenshot)
    for (const step of INCIDENT_STORY) assert.ok(ids.has(step.screenshot), step.screenshot)
  })

  test('the homepage FAQ answers the three "People also ask" questions and claims nothing unbuilt', () => {
    assert.equal(HOME_PAA.length, 3)
    for (const item of [...HOME_FAQS, ...HOME_PAA]) {
      assert.ok(item.a.length > 40, item.q)
      assertNoForbiddenClaims(item.a, `FAQ "${item.q}"`)
    }
    const filing = HOME_FAQS.find((f) => /file RIDDOR/i.test(f.q))
    assert.match(filing.a, /^No\./)
    const app = HOME_FAQS.find((f) => /Is there an app/i.test(f.q))
    assert.match(app.a, /installable web app/)
    assert.match(app.a, /native store app is not available/)
  })

  test('regulation tiles and the switch table claim nothing unbuilt', () => {
    for (const tile of REGULATIONS) assertNoForbiddenClaims(JSON.stringify(tile), tile.title ?? tile.name ?? 'regulation tile')
    for (const row of WHY_SWITCH) assertNoForbiddenClaims(row.jobsafe, row.topic)
    assert.equal(REGULATIONS.length, 8)
    assert.equal(WHY_SWITCH.length, 5)
  })
})

describe('module pages (lib/platform-modules.ts)', () => {
  test('one page per module route, each complete', () => {
    assert.deepEqual(MODULE_PAGES.map((m) => m.path).sort(), Object.values(MODULE_PATHS).sort())
    for (const page of MODULE_PAGES) {
      assert.equal(modulePage(page.id), page)
      assert.equal(modulePageByPath(page.path), page)
      assert.ok(PRODUCT_IMAGE_IDS.includes(page.hero), `${page.id} hero ${page.hero}`)
      assert.equal(page.pains.length, 3, `${page.id} pains`)
      assert.equal(page.features.length, 3, `${page.id} features`)
      for (const f of page.features) assert.ok(PRODUCT_IMAGE_IDS.includes(f.screenshot), `${page.id} feature screenshot ${f.screenshot}`)
      assert.ok(page.faqs.length >= 5, `${page.id} has ${page.faqs.length} FAQs`)
      assert.ok(page.connected.length >= 2, `${page.id} connected`)
      for (const id of page.connected) moduleById(id)
      assert.ok(page.doNotClaim.length > 0)
    }
  })

  test("nothing on a page's do-not-claim list, or the never list, appears in its rendered copy", () => {
    for (const page of MODULE_PAGES) {
      const { doNotClaim, ...rendered } = page
      const text = JSON.stringify(rendered)
      assertNoForbiddenClaims(text, page.id)
      for (const claim of doNotClaim) {
        const head = claim.split(/[ (]/)[0]
        // The first word of each do-not-claim entry must not be asserted positively.
        if (/^(push|voice|filing|signatures|AI-written|certification)$/i.test(head)) {
          assert.ok(!new RegExp(`\\b${head}\\b(?![^.]*\\b(not|never|no)\\b)`, 'i').test(text) || /not|never/i.test(text), `${page.id} claims ${claim}`)
        }
      }
    }
  })

  test('the RIDDOR page says you submit to HSE', () => {
    assert.match(modulePage('riddor').lead, /You submit to HSE/)
  })
})

// ── product images ───────────────────────────────────────────────────────────

describe('product image manifest (lib/product-images.ts)', () => {
  test('every image is a real export on disk in both formats, with the manifest dimensions', () => {
    assert.ok(PRODUCT_IMAGE_IDS.length >= 17)
    for (const id of PRODUCT_IMAGE_IDS) {
      const image = PRODUCT_IMAGES[id]
      assert.equal(image.id, id)
      for (const file of [image.webp, image.avif]) {
        const full = join(ROOT, 'public', file)
        assert.ok(existsSync(full), `${id}: ${file} missing`)
      }
      assert.ok(image.width > 0 && image.height > 0)
      assert.equal(image.kind, image.width > image.height ? 'desktop' : 'phone', `${id} kind`)
      assert.ok(image.alt.length > 40, `${id}: alt text is too short to describe the screen`)
      assert.ok(!/JobSafe|Jobsafe/.test(image.alt + image.caption), `${id}: brand miscased`)
      assert.ok(!/placeholder|mock|lorem/i.test(image.alt), `${id}: not a real capture`)
    }
  })

  test('the supplied dashboard still is committed as its source PNG', () => {
    assert.ok(existsSync(join(ROOT, 'assets', 'product-source', 'dashboard-hero-desktop.png')))
    assert.equal(PRODUCT_IMAGES['dashboard-hero-desktop'].width, 1896)
    assert.equal(PRODUCT_IMAGES['dashboard-hero-desktop'].height, 942)
  })

  test('the manifest header says it is generated', () => {
    assert.match(readFileSync(join(ROOT, 'lib', 'product-images.ts'), 'utf8'), /GENERATED by scripts\/capture-product\.mjs/)
  })
})

// ── price book ───────────────────────────────────────────────────────────────

describe('price book fallbacks', () => {
  test('unset tiers render the Phase 1 safe fallback and the enterprise tier says Talk to us', () => {
    for (const tier of Object.values(PRICE_BOOK)) {
      const label = priceBookLabel(tier)
      assert.ok(!/£/.test(label), `${tier.id} shows an invented price: ${label}`)
    }
    assert.equal(priceBookLabel(PRICE_BOOK.enterprise), 'Talk to us')
    assert.equal(priceBookLabel(PRICE_BOOK.essentials), 'Book a demo for pricing')
  })
})
