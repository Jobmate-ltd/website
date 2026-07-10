// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — schema.org JSON-LD builders.
//
// Every structured-data node the site emits is constructed here, from the
// constants in `lib/brand.ts`. Nothing is hand-written into a page.
//
// Two hard rules:
//
//   • NO `aggregateRating`. The previous homepage declared 4.8 stars from 47
//     reviews. There are no reviews: jobsafe is absent from G2, Capterra,
//     GetApp and Software Advice, and the App Store reports "not enough
//     ratings". Self-declared ratings are a Google manual-action risk under the
//     structured-data spam policy, and — more to the point — untrue. Do not add
//     `aggregateRating` until real reviews exist on a third-party platform.
//
//   • NO `FAQPage` unless the answer text is server-rendered and visible. See
//     `components/sections/FAQ.tsx`, which emits its own FAQPage from the same
//     array it renders, so the schema and the DOM cannot drift apart.
//
// See SEO Operating Instructions §5.2 and §8.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ADDRESS,
  BRAND,
  CANONICAL_HOME,
  CURRENCY,
  EMAIL_SALES,
  ENTRY_PRICE,
  LEGAL_NAME,
  LOGO_PATH,
  PARENT_ORG_URL,
  PHONE_E164,
  SAME_AS,
  SCHEMA_ID,
  SITE_URL,
} from './brand'

type JsonLdNode = Record<string, unknown>

/** The `Organization` node. Carried by `/` and `/about`. */
export function organizationSchema(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': SCHEMA_ID.organization,
    name: BRAND,
    legalName: LEGAL_NAME,
    url: CANONICAL_HOME,
    logo: `${SITE_URL}${LOGO_PATH}`,
    telephone: PHONE_E164,
    email: EMAIL_SALES,
    address: {
      '@type': 'PostalAddress',
      ...ADDRESS,
    },
    parentOrganization: {
      '@type': 'Organization',
      name: LEGAL_NAME,
      url: PARENT_ORG_URL,
    },
    sameAs: [...SAME_AS],
  }
}

/** The `WebSite` node. Ties every URL on the host back to the organisation. */
export function websiteSchema(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_ID.website,
    url: CANONICAL_HOME,
    name: BRAND,
    inLanguage: 'en-GB',
    publisher: { '@id': SCHEMA_ID.organization },
  }
}

/**
 * The `SoftwareApplication` node. Carried by `/` and every money page.
 *
 * `offers.price` is the ENTRY price — what a new customer pays — not the
 * volume rate. Quoting the volume rate in schema while the landing page charges
 * the entry rate is the same defect as quoting it in a meta description.
 */
export function softwareApplicationSchema(url: string = CANONICAL_HOME): JsonLdNode {
  return {
    '@type': 'SoftwareApplication',
    '@id': SCHEMA_ID.software,
    name: BRAND,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Health and Safety Incident Reporting',
    operatingSystem: 'iOS, Android, Web',
    description:
      'Workplace incident reporting software for field service, construction and transport teams. HSSE compliant, offline-capable, ISO 45001 aligned.',
    url,
    publisher: { '@id': SCHEMA_ID.organization },
    offers: {
      '@type': 'Offer',
      price: ENTRY_PRICE.toFixed(2),
      priceCurrency: CURRENCY,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: ENTRY_PRICE.toFixed(2),
        priceCurrency: CURRENCY,
        unitText: 'licence per month',
      },
    },
    // NO aggregateRating. See the file header.
  }
}

export interface Crumb {
  name: string
  /** Absolute URL. */
  item: string
}

/** `BreadcrumbList` — required on every non-homepage route (§5.2). */
export function breadcrumbSchema(crumbs: readonly Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }
}

export interface FaqEntry {
  q: string
  a: string
}

/**
 * `FAQPage`. Only ever called from a component that renders the *same* array
 * into the DOM, with the answer text present in the server-rendered HTML.
 */
export function faqPageSchema(entries: readonly FaqEntry[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** Wraps nodes into a single `@graph` document. */
export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/**
 * Serialises for `dangerouslySetInnerHTML`. Escapes `<` so a `</script>`
 * sequence inside any string value cannot terminate the script element early.
 */
export function jsonLd(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, '\\u003c')
}
