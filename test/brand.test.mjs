// node --test test/
//
// The constants file is the single source of truth for every price, URL and
// offer. These tests pin the values the Phase 1 brief confirmed against
// checkout on 25/09/2026, and the Phase 2 groundwork: the launch flag and the
// empty-by-default platform config that must never render an invented number.
//
// Node 22 strips TypeScript types natively, so lib/*.ts is imported directly.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  ADMIN_PRICE,
  ADMIN_PRICE_EX_VAT_LABEL,
  ANNUAL_MONTHS_CHARGED,
  ANNUAL_TERMS,
  BOOK_DEMO_URL,
  BRAND,
  DEMO_BOOKING_URL,
  ENTRY_PRICE,
  ENTRY_PRICE_EX_VAT_LABEL,
  ENTRY_PRICE_LABEL,
  FALLBACK_CTA,
  LICENCES,
  LIVE_DEMO_URL,
  LOGIN_URL,
  MAKER_LINE,
  PLATFORM_APP_URL,
  PLATFORM_LOGIN_URL,
  PLATFORM_SIGNUP_URL,
  PRICE_BOOK,
  PRICING_TIERS,
  SIGNUP_TRIAL_URL,
  TRIAL,
  VAT_SUFFIX,
  VOLUME_PRICE_LABEL,
  annualPrice,
  canonicalFor,
  ctaFor,
  formatPriceExVat,
  isPlatformLaunched,
  optionalUrl,
  priceBookLabel,
  priceBookHasPrices,
  trialSentence,
} from '../lib/brand.ts'
import { STATIC_ROUTES, publicRoutes, isoDate } from '../lib/routes.ts'
import { NAV, FOOTER } from '../lib/site.ts'
import { CONSENT_MAX_AGE_SECONDS, CONSENT_VERSION, parseConsent, serialiseConsent, readConsentFromCookieString } from '../lib/consent.ts'

describe('pricing, as checkout charges it (Inputs, 25/09/2026)', () => {
  test('Worker £3.00, Admin £12.00, per licence per month ex VAT', () => {
    assert.equal(LICENCES.worker.price, 3.0)
    assert.equal(LICENCES.admin.price, 12.0)
    assert.equal(ENTRY_PRICE, 3.0)
    assert.equal(ADMIN_PRICE, 12.0)
  })

  test('the labels carry VAT', () => {
    assert.equal(ENTRY_PRICE_LABEL, '£3.00')
    assert.equal(ENTRY_PRICE_EX_VAT_LABEL, '£3.00 + VAT')
    assert.equal(ADMIN_PRICE_EX_VAT_LABEL, '£12.00 + VAT')
    assert.equal(VAT_SUFFIX, '+ VAT')
    assert.equal(formatPriceExVat(2.75), '£2.75 + VAT')
  })

  test('the volume tier is £2.75 for 500–1,000, bespoke above', () => {
    assert.equal(VOLUME_PRICE_LABEL, '£2.75')
    assert.equal(PRICING_TIERS[1].threshold, '500–1,000 licences')
    assert.equal(PRICING_TIERS[2].price, null)
    assert.equal(LICENCES.worker.volume, PRICING_TIERS)
    assert.equal(LICENCES.admin.volume, undefined)
  })

  test('annual billing is "2 months free": twelve months for the price of ten', () => {
    assert.equal(ANNUAL_TERMS, '2 months free')
    assert.equal(ANNUAL_MONTHS_CHARGED, 10)
    assert.equal(annualPrice(3), 30)
    assert.equal(annualPrice(2.75), 27.5)
    assert.equal(annualPrice(12), 120)
  })
})

describe('the one offer', () => {
  test('14-day trial, card required, and the sentence says so', () => {
    assert.equal(TRIAL.days, 14)
    assert.equal(TRIAL.cardRequired, true)
    assert.equal(TRIAL.label, '14-day free trial')
    assert.match(trialSentence(), /card is taken at sign-up/)
    assert.doesNotMatch(trialSentence(), /no card/i)
  })
})

describe('links that must not change in Phase 1', () => {
  test('Sign up and Log in still point at the current app', () => {
    assert.equal(SIGNUP_TRIAL_URL, 'https://app.jobsafe.cloud/signup-trial')
    assert.equal(LOGIN_URL, 'https://app.jobsafe.cloud/login')
    const signup = NAV.actions.find((a) => a.kind === 'signup')
    const login = NAV.actions.find((a) => a.kind === 'login')
    assert.equal(signup?.href, SIGNUP_TRIAL_URL)
    assert.equal(login?.href, LOGIN_URL)
    const company = FOOTER.columns.find((c) => c.heading === 'Company')
    assert.ok(company?.links.some((l) => l.href === SIGNUP_TRIAL_URL))
    assert.ok(company?.links.some((l) => l.href === LOGIN_URL))
  })

  test('the footer carries the maker line and a cookie-settings control', () => {
    assert.equal(MAKER_LINE, `${BRAND} is made by Jobmate Ltd.`)
    assert.equal(FOOTER.brand.maker, MAKER_LINE)
    assert.equal(FOOTER.brand.madeIn, 'Made by Jobmate Ltd, Wolverhampton')
    assert.ok(FOOTER.legal.some((l) => l.action === 'cookie-settings'))
    assert.ok(FOOTER.legal.some((l) => l.href === '/cookies'))
  })
})

describe('canonicals', () => {
  test('the homepage keeps its trailing slash; sub-routes do not', () => {
    assert.equal(canonicalFor('/'), 'https://www.jobsafe.cloud/')
    assert.equal(canonicalFor('/about'), 'https://www.jobsafe.cloud/about')
  })
})

describe('Phase 2 groundwork (Workstream E)', () => {
  test('the launch flag defaults to false and reads only an exact "true"', () => {
    assert.equal(isPlatformLaunched({}), false)
    assert.equal(isPlatformLaunched({ NEXT_PUBLIC_PLATFORM_LAUNCH: 'TRUE' }), false)
    assert.equal(isPlatformLaunched({ NEXT_PUBLIC_PLATFORM_LAUNCH: '1' }), false)
    assert.equal(isPlatformLaunched({ NEXT_PUBLIC_PLATFORM_LAUNCH: 'true' }), true)
  })

  test('platform URLs are empty by default', () => {
    assert.equal(PLATFORM_APP_URL, null)
    assert.equal(PLATFORM_SIGNUP_URL, null)
    assert.equal(PLATFORM_LOGIN_URL, null)
    assert.equal(LIVE_DEMO_URL, null)
    assert.equal(BOOK_DEMO_URL, null)
  })

  test('optionalUrl accepts only absolute http(s) URLs', () => {
    assert.equal(optionalUrl('X', {}), null)
    assert.equal(optionalUrl('X', { X: '   ' }), null)
    assert.equal(optionalUrl('X', { X: 'not a url' }), null)
    assert.equal(optionalUrl('X', { X: 'javascript:alert(1)' }), null)
    assert.equal(optionalUrl('X', { X: 'https://demo.jobsafe.cloud/' }), 'https://demo.jobsafe.cloud/')
  })

  test('an unset URL renders the safe fallback, never a dead link', () => {
    assert.deepEqual(ctaFor(null, 'Open the live demo'), FALLBACK_CTA)
    assert.equal(FALLBACK_CTA.label, 'Book a demo')
    assert.equal(FALLBACK_CTA.href, DEMO_BOOKING_URL)
    assert.deepEqual(ctaFor('https://demo.jobsafe.cloud/', 'Open the live demo'), { label: 'Open the live demo', href: 'https://demo.jobsafe.cloud/' })
  })

  test('the price book has the three tiers with no prices set, and never invents a number', () => {
    assert.deepEqual(Object.keys(PRICE_BOOK), ['essentials', 'professional', 'enterprise'])
    for (const tier of Object.values(PRICE_BOOK)) {
      assert.equal(tier.pricePerUserMonthExVat, null, `${tier.id} must not carry a price until the inputs are agreed`)
      assert.equal(tier.annualTerms, null)
      assert.ok(tier.includedModules.length > 0, `${tier.id} lists what it includes`)
    }
    assert.equal(priceBookLabel(PRICE_BOOK.essentials), 'Book a demo for pricing')
    assert.equal(priceBookLabel(PRICE_BOOK.professional), 'Book a demo for pricing')
    assert.equal(priceBookLabel(PRICE_BOOK.enterprise), 'Talk to us')
    assert.equal(priceBookHasPrices(), false)
    assert.equal(priceBookLabel({ ...PRICE_BOOK.essentials, pricePerUserMonthExVat: 4 }), '£4.00 + VAT per user per month')
  })
})

describe('route manifest (lib/routes.ts)', () => {
  test('every route has a unique path and a real, non-future ISO date', () => {
    const paths = STATIC_ROUTES.map((r) => r.path)
    assert.equal(new Set(paths).size, paths.length)
    const today = new Date()
    for (const route of STATIC_ROUTES) {
      assert.match(route.updated, /^\d{4}-\d{2}-\d{2}$/, route.path)
      assert.ok(isoDate(route.updated) <= today, `${route.path} is dated in the future`)
    }
  })

  test('/toolkit and /cookies are in the sitemap; Phase 2 routes are held back', () => {
    const live = publicRoutes(false).map((r) => r.path)
    assert.ok(live.includes('/toolkit'))
    assert.ok(live.includes('/cookies'))
    assert.ok(live.includes('/'))
    const withPlatform = publicRoutes(true).map((r) => r.path)
    assert.ok(withPlatform.length >= live.length)
    assert.ok(!live.some((p) => STATIC_ROUTES.find((r) => r.path === p)?.platformOnly))
  })
})

describe('consent (lib/consent.ts)', () => {
  test('the choice is kept for six months', () => {
    assert.equal(CONSENT_MAX_AGE_SECONDS, 182 * 24 * 60 * 60)
  })

  test('round-trips through the cookie and rejects old versions', () => {
    const consent = { version: CONSENT_VERSION, at: '2026-09-25T00:00:00.000Z', analytics: true, marketing: false }
    assert.deepEqual(parseConsent(serialiseConsent(consent)), consent)
    assert.equal(parseConsent(encodeURIComponent(JSON.stringify({ ...consent, version: 0 }))), null)
    assert.equal(parseConsent('garbage'), null)
    assert.equal(parseConsent(null), null)
  })

  test('reads its own cookie out of a cookie string', () => {
    const consent = { version: CONSENT_VERSION, at: '2026-09-25T00:00:00.000Z', analytics: false, marketing: false }
    const cookie = `other=1; jobsafe_consent=${serialiseConsent(consent)}; z=2`
    assert.deepEqual(readConsentFromCookieString(cookie), consent)
    assert.equal(readConsentFromCookieString('other=1'), null)
  })
})
