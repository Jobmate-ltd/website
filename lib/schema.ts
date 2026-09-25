// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — schema.org JSON-LD builders.
//
// Every structured-data node the site emits is constructed here, from the
// constants in `lib/brand.ts`. Nothing is hand-written into a page.
//
// seo-audit-ignore: no-checklists — `platformApplicationSchema()` describes
// the platform, which has a Checklists & inspections module. It is emitted
// only by pages behind NEXT_PUBLIC_PLATFORM_LAUNCH; the Phase 1 SoftwareApplication
// node (`softwareApplicationSchema`) does not mention checklists.
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
//     `components/ui/faq.tsx`, which emits its own FAQPage from the same array
//     it renders, so the schema and the DOM cannot drift apart.
//
// See SEO Operating Instructions §5.2 and §8.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ADDRESS,
  BRAND,
  CANONICAL_HOME,
  canonicalFor,
  CURRENCY,
  EMAIL_SALES,
  LEGAL_NAME,
  LICENCES,
  LOGO_PATH,
  OG_IMAGE,
  PARENT_ORG_URL,
  PHONE_E164,
  SAME_AS,
  SCHEMA_ID,
  SITE_URL,
  PRICE_BOOK,
} from './brand.ts'

export type JsonLdNode = Record<string, unknown>

/** The `Organization` node. Carried by every route from the root layout. */
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
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE_E164,
      email: EMAIL_SALES,
      contactType: 'sales',
      areaServed: 'GB',
      availableLanguage: 'en',
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

/** One `Offer` per licence type, ex VAT, per licence per month. */
function licenceOffers(): JsonLdNode[] {
  return Object.values(LICENCES).map((licence) => ({
    '@type': 'Offer',
    name: `${licence.name} licence`,
    price: licence.price.toFixed(2),
    priceCurrency: CURRENCY,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: licence.price.toFixed(2),
      priceCurrency: CURRENCY,
      unitText: 'licence per month',
      valueAddedTaxIncluded: false,
    },
  }))
}

/**
 * The `SoftwareApplication` node. Carried by `/` and every money page.
 *
 * `offers` lists the ENTRY price of each licence type — what a new customer
 * pays — never the volume rate. Quoting the volume rate in schema while the
 * landing page charges the entry rate is the same defect as quoting it in a
 * meta description.
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
      'Workplace incident reporting software for UK field service, construction, care and transport teams. Works offline, with photo, video, GPS and timestamp evidence on every report.',
    url,
    image: `${SITE_URL}${OG_IMAGE.path}`,
    publisher: { '@id': SCHEMA_ID.organization },
    offers: licenceOffers(),
    // NO aggregateRating. See the file header.
  }
}

/** One `Offer` per price-book tier that has a number. Empty while prices are unset. */
function priceBookOffers(): JsonLdNode[] {
  return Object.values(PRICE_BOOK)
    .filter((tier) => tier.pricePerUserMonthExVat !== null)
    .map((tier) => ({
      '@type': 'Offer',
      name: `${tier.name} plan`,
      price: (tier.pricePerUserMonthExVat as number).toFixed(2),
      priceCurrency: CURRENCY,
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: (tier.pricePerUserMonthExVat as number).toFixed(2),
        priceCurrency: CURRENCY,
        unitText: 'user per month',
        valueAddedTaxIncluded: false,
      },
    }))
}

/**
 * The `SoftwareApplication` node for the platform (Phase 2, flag on): home,
 * /platform and every module page. `operatingSystem` says what is true — an
 * installable web app — with no store links, and `offers` is present only
 * once PRICE_BOOK carries prices.
 */
export function platformApplicationSchema(url: string): JsonLdNode {
  const offers = priceBookOffers()
  return {
    '@type': 'SoftwareApplication',
    '@id': SCHEMA_ID.software,
    name: BRAND,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Health and safety management',
    operatingSystem: 'Web (installable on iOS and Android)',
    description:
      'Health and safety platform for UK operators: incidents, RIDDOR, risk assessments with bowtie, permits to work, checklists, fleet and plant, training and documents in one offline-first record, hosted in the UK.',
    url,
    image: `${SITE_URL}${OG_IMAGE.path}`,
    publisher: { '@id': SCHEMA_ID.organization },
    ...(offers.length ? { offers } : {}),
    // NO aggregateRating. See the file header.
  }
}

export interface Crumb {
  name: string
  /** Absolute URL. */
  item: string
}

/** `BreadcrumbList` — required on every non-homepage route (§5.2). */
/** The visible trail (name + site path) → Crumb[] with absolute URLs. */
export function breadcrumbsFromTrail(trail: readonly { readonly name: string; readonly href: string }[]): Crumb[] {
  return trail.map((crumb) => ({ name: crumb.name, item: canonicalFor(crumb.href) }))
}

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

/**
 * `WebApplication` — the free tools (Phase 3). A tool is a page that computes
 * something in the browser; it is not the product, so it carries its own
 * `@id`, no offers and no rating. `isAccessibleForFree` states the obvious
 * for the rich-result validator.
 */
export function webApplicationSchema(tool: { readonly url: string; readonly name: string; readonly description: string }): JsonLdNode {
  return {
    '@type': 'WebApplication',
    '@id': `${tool.url}#tool`,
    name: tool.name,
    url: tool.url,
    description: tool.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: CURRENCY },
    publisher: { '@id': SCHEMA_ID.organization },
  }
}

export interface HowToStep {
  readonly name: string
  readonly text: string
}

/**
 * `HowTo` — the explainer under a tool. Only ever built from the steps the
 * page renders, so the schema and the visible text are the same text.
 */
export function howToSchema(howTo: { readonly url: string; readonly name: string; readonly description: string; readonly steps: readonly HowToStep[]; readonly totalTime?: string }): JsonLdNode {
  return {
    '@type': 'HowTo',
    '@id': `${howTo.url}#howto`,
    name: howTo.name,
    description: howTo.description,
    ...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${howTo.url}#step-${index + 1}`,
    })),
  }
}

export interface ArticleInput {
  readonly url: string
  readonly headline: string
  readonly description: string
  /** ISO date. */
  readonly datePublished: string
  readonly dateModified?: string
  readonly section: string
  /** Topic tags; rendered as schema.org `keywords` on the BlogPosting. */
  readonly tags: readonly string[]
  readonly author: string
  readonly image: string
}

/** `BlogPosting` for an insights article. */
export function blogPostingSchema(article: ArticleInput): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    articleSection: article.section,
    // schema.org `keywords`, not a <meta name="keywords"> tag (§5.1, T8).
    keywords: article.tags.join(', '),
    url: article.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.url },
    image: article.image,
    inLanguage: 'en-GB',
    author: { '@type': 'Organization', name: article.author, url: SITE_URL },
    publisher: { '@id': SCHEMA_ID.organization },
  }
}

/** `Blog` for the insights index. */
export function blogSchema(url: string, posts: readonly ArticleInput[]): JsonLdNode {
  return {
    '@type': 'Blog',
    '@id': url,
    name: `${BRAND} insights`,
    description: 'Practical guidance on workplace incident reporting, HSSE compliance and field safety.',
    url,
    inLanguage: 'en-GB',
    publisher: { '@id': SCHEMA_ID.organization },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.headline,
      description: post.description,
      datePublished: post.datePublished,
      url: post.url,
    })),
  }
}

export interface VideoInput {
  readonly name: string
  readonly description: string
  readonly thumbnailUrl: string
  readonly uploadDate: string
  readonly duration: string
  readonly embedUrl: string
  readonly url: string
}

/** `VideoObject` for an embedded film that really exists. */
export function videoObjectSchema(video: VideoInput): JsonLdNode {
  return { '@type': 'VideoObject', ...video }
}

/** `ItemList` of named, linked items. */
export function itemListSchema(name: string, items: readonly { name: string; url: string }[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
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
