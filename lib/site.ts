// ─────────────────────────────────────────────────────────────────────────────
// Site configuration: the objects that drive <Header/> and <Footer/>.
//
// Phase 1 keeps today's navigation items. Phase 2 replaces `NAV.items` with
// the Platform / Solutions / Industries / Resources / Pricing mega-menu by
// editing this file only; the components do not change. Every URL that leaves
// the site is read from lib/brand.ts.
//
// seo-audit-ignore: no-checklists — PLATFORM_NAV and PLATFORM_FOOTER list the
// platform's Checklists & inspections module. They are only selected by
// `activeNav()`/`activeFooter()` when NEXT_PUBLIC_PLATFORM_LAUNCH is on, and
// `navForFlag()` drops the link until /platform/checklists exists. The Phase 1
// NAV and FOOTER objects do not mention checklists.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ADDRESS_LINE,
  BRAND,
  BROCHURE_PATH,
  DEMO_BOOKING_URL,
  EMAIL_SALES,
  EMAIL_SUPPORT,
  HOSTING_LINE,
  LEGAL_NAME,
  LOGIN_URL,
  MADE_IN_LINE,
  MAKER_LINE,
  PARENT_ORG_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PLATFORM_LAUNCH,
  SIGNUP_TRIAL_URL,
  SOCIAL,
} from './brand.ts'
import { routeExists } from './routes.ts'

// ── Navigation ───────────────────────────────────────────────────────────────

export interface NavChild {
  readonly label: string
  readonly href: string
  /** One line under the label in a dropdown panel. */
  readonly description?: string
}

export interface NavColumn {
  readonly heading: string
  readonly items: readonly NavChild[]
}

export interface NavItem {
  readonly label: string
  readonly href: string
  /** A single-column dropdown. */
  readonly children?: readonly NavChild[]
  /** A multi-column panel (Phase 2 mega-menu). Takes precedence over `children`. */
  readonly columns?: readonly NavColumn[]
}

export type NavActionKind = 'phone' | 'login' | 'signup' | 'demo'

export interface NavAction {
  readonly kind: NavActionKind
  readonly label: string
  readonly href: string
  /** Tailwind breakpoint the control appears from in the desktop bar. */
  readonly showFrom: 'always' | 'lg' | 'xl' | '2xl'
  /** Analytics placement for demo clicks. */
  readonly placement?: string
}

export interface NavConfig {
  readonly items: readonly NavItem[]
  readonly actions: readonly NavAction[]
}

export const INDUSTRY_LINKS: readonly NavChild[] = [
  {
    label: 'Window & door fitters',
    href: '/industries/window-door-fitters',
    description: 'Glazing and installation crews on site and up ladders.',
  },
  {
    label: 'Healthcare & social care',
    href: '/industries/healthcare',
    description: 'Care homes, home care and clinical staff on shift.',
  },
  {
    label: 'Field service',
    href: '/industries/field-services',
    description: 'Lone and mobile engineers on sites you do not control.',
  },
  {
    label: 'Transport & logistics',
    href: '/industries/transport-logistics',
    description: 'Depots, yards, cabs and warehouses.',
  },
] as const

/** Today's navigation. Anchors point at homepage sections, as they did before. */
export const NAV: NavConfig = {
  items: [
    { label: 'Home', href: '/#hero' },
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Industries', href: '/#industries', children: INDUSTRY_LINKS },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Insights', href: '/insights' },
    { label: 'Academy', href: '/academy' },
    { label: 'About', href: '/about' },
  ],
  actions: [
    { kind: 'phone', label: PHONE_DISPLAY, href: PHONE_HREF, showFrom: '2xl' },
    { kind: 'login', label: 'Log in', href: LOGIN_URL, showFrom: 'lg' },
    { kind: 'signup', label: 'Sign up now', href: SIGNUP_TRIAL_URL, showFrom: 'xl' },
    { kind: 'demo', label: 'Book a demo', href: DEMO_BOOKING_URL, showFrom: 'always', placement: 'navbar' },
  ],
} as const

// ── Footer ───────────────────────────────────────────────────────────────────

export interface FooterLink {
  readonly label: string
  readonly href: string
  /** Renders as a button that opens the consent panel instead of navigating. */
  readonly action?: 'cookie-settings'
  readonly external?: boolean
  readonly download?: boolean
}

export interface FooterColumn {
  readonly heading: string
  readonly links: readonly FooterLink[]
}

export interface FooterConfig {
  readonly brand: {
    readonly blurb: string
    readonly maker: string
    readonly madeIn: string
  }
  readonly contacts: readonly FooterLink[]
  readonly social: readonly { readonly label: 'LinkedIn' | 'X' | 'Instagram'; readonly href: string }[]
  readonly columns: readonly FooterColumn[]
  readonly legal: readonly FooterLink[]
  readonly newsletter: {
    readonly eyebrow: string
    readonly title: string
    readonly blurb: string
  }
  readonly copyright: string
}

export const FOOTER: FooterConfig = {
  brand: {
    blurb:
      'Record. Resolve. Prevent. Mobile incident reporting for field teams, transport operators and industrial sites across the UK.',
    maker: MAKER_LINE,
    madeIn: MADE_IN_LINE,
  },
  contacts: [
    { label: PHONE_DISPLAY, href: PHONE_HREF },
    { label: EMAIL_SALES, href: `mailto:${EMAIL_SALES}` },
    { label: EMAIL_SUPPORT, href: `mailto:${EMAIL_SUPPORT}` },
    { label: 'Download brochure (PDF)', href: BROCHURE_PATH, download: true },
    { label: LEGAL_NAME, href: PARENT_ORG_URL, external: true },
  ],
  social: [
    { label: 'LinkedIn', href: SOCIAL.linkedin },
    { label: 'X', href: SOCIAL.x },
    { label: 'Instagram', href: SOCIAL.instagram },
  ],
  columns: [
    {
      heading: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'How it works', href: '/#how-it-works' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Free toolkit', href: '/toolkit' },
      ],
    },
    {
      heading: 'Industries',
      links: INDUSTRY_LINKS.map(({ label, href }) => ({ label, href })),
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Insights', href: '/insights' },
        { label: 'Academy', href: '/academy' },
        { label: 'Log in', href: LOGIN_URL },
        { label: 'Sign up now', href: SIGNUP_TRIAL_URL },
      ],
    },
  ],
  legal: [
    { label: 'Privacy policy', href: '/privacy-policy' },
    { label: 'Terms and conditions', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Cookie settings', href: '/cookies', action: 'cookie-settings' },
  ],
  newsletter: {
    eyebrow: 'The weekly briefing',
    title: 'Beyond Compliance',
    blurb:
      'This week in HSE: the rulings, the compliance deadlines and the numbers behind them. Written for the people running the sites.',
  },
  copyright: `© ${BRAND}`,
} as const

// ── Phase 2: the platform navigation and footer (behind the flag) ───────────
// Every href below is checked against lib/routes.ts before it renders: an item
// whose page arrives in a later phase is listed here so the structure is
// decided once, and hidden until the page exists. Never link to a 404.

export interface NavPromo {
  readonly eyebrow: string
  readonly title: string
  readonly href: string
  readonly cta: string
}

const MODULE_DESCRIPTIONS = {
  incidents: 'Seven steps from any phone, offline included.',
  riddor: 'Live verdict, deadlines, F2508 register.',
  checklists: 'Walkarounds and inspections that raise actions.',
  fleet: 'MOT, tax, insurance, service and LOLER dates.',
  investigations: 'Four-level ICAM on the report itself.',
  actions: 'Owners, dates and a board.',
  permits: 'Gated on competence and a live risk assessment.',
  contractors: 'Insurance, RAMS, accreditation, audits.',
  risk: '5×5 scoring, hierarchy of control, bowtie.',
  training: 'The competency matrix.',
  documents: 'Current versions in front of the right people.',
  dashboards: 'Open incidents, RIDDOR due, overdue actions.',
} as const

/** The free tools (Phase 3). Each runs a module's own logic in the browser; the hub explains where each comes from. */
export const FREE_TOOL_LINKS: readonly NavChild[] = [
  { label: 'RIDDOR checker', href: '/tools/riddor-checker', description: 'Is it reportable, and by when? One question at a time.' },
  { label: '5×5 risk matrix', href: '/tools/risk-matrix', description: 'Score it on the product’s scales and read the band.' },
  { label: 'Accident frequency rate', href: '/tools/accident-frequency-rate', description: 'The PQQ figure, with the working shown.' },
  { label: 'All free tools', href: '/tools', description: 'Where each tool comes from in the product.' },
]

/** The comparisons (Phase 3). Behind NEXT_PUBLIC_COMPARE_PAGES; every claim on them is sourced and dated. */
export const COMPARE_LINKS: readonly NavChild[] = [
  { label: 'Compare', href: '/compare', description: 'Fifteen rows, every claim sourced and dated.' },
  { label: 'jobsafe vs Mitti', href: '/compare/mitti-safetyculture', description: 'Formerly SafetyCulture.' },
  { label: 'jobsafe vs Evotix', href: '/compare/evotix' },
  { label: 'jobsafe vs EcoOnline', href: '/compare/ecoonline' },
]

export const PLATFORM_INDUSTRY_LINKS: readonly NavChild[] = [
  { label: 'Transport & logistics', href: '/industries/transport-logistics', description: 'Depots, yards, cabs and warehouses.' },
  { label: 'Construction & trades', href: '/industries/construction', description: 'Sites, principal contractors and plant.' },
  { label: 'Field services', href: '/industries/field-services', description: 'Lone and mobile engineers on sites you do not control.' },
  { label: 'Facilities management', href: '/industries/facilities-management', description: 'Estates, contractors and the public.' },
  { label: 'Manufacturing & warehousing', href: '/industries/manufacturing-warehousing', description: 'Lines, high bays, MHE and FLTs.' },
  { label: 'Care homes & home care', href: '/industries/healthcare', description: 'Staff safety in care homes, home care and supported living.' },
  { label: 'Window & door fitters', href: '/industries/window-door-fitters', description: 'Glazing and installation crews on site and up ladders.' },
]

/** The mega-menu. Structure per the Phase 2 brief; only existing pages render. */
export const PLATFORM_NAV: NavConfig & { readonly promos: Readonly<Record<string, NavPromo>> } = {
  items: [
    {
      label: 'Platform',
      href: '/platform',
      columns: [
        {
          heading: 'Record',
          items: [
            { label: 'Incident & near-miss reporting', href: '/platform/incident-reporting', description: MODULE_DESCRIPTIONS.incidents },
            { label: 'RIDDOR 2013', href: '/platform/riddor', description: MODULE_DESCRIPTIONS.riddor },
            { label: 'Checklists & inspections', href: '/platform/checklists', description: MODULE_DESCRIPTIONS.checklists },
            { label: 'Fleet & plant', href: '/platform/fleet-compliance', description: MODULE_DESCRIPTIONS.fleet },
          ],
        },
        {
          heading: 'Resolve',
          items: [
            { label: 'Investigations', href: '/platform/investigations', description: MODULE_DESCRIPTIONS.investigations },
            { label: 'Corrective actions', href: '/platform/corrective-actions', description: MODULE_DESCRIPTIONS.actions },
            { label: 'Permits to work', href: '/platform/permits-to-work', description: MODULE_DESCRIPTIONS.permits },
            { label: 'Contractors', href: '/platform/contractors', description: MODULE_DESCRIPTIONS.contractors },
          ],
        },
        {
          heading: 'Prevent',
          items: [
            { label: 'Risk assessments & bowtie', href: '/platform/risk-assessments', description: MODULE_DESCRIPTIONS.risk },
            { label: 'Training & competence', href: '/platform/training-competence', description: MODULE_DESCRIPTIONS.training },
            { label: 'Document control', href: '/platform/document-control', description: MODULE_DESCRIPTIONS.documents },
            { label: 'Dashboards', href: '/platform/dashboards', description: MODULE_DESCRIPTIONS.dashboards },
          ],
        },
      ],
    },
    {
      label: 'Solutions',
      href: '/solutions',
      columns: [
        {
          heading: 'By need',
          items: [
            { label: 'RIDDOR compliance', href: '/solutions/riddor-compliance' },
            { label: 'Contractor control', href: '/solutions/contractor-control' },
            { label: 'Fleet & plant compliance', href: '/solutions/fleet-and-plant-compliance' },
            { label: 'Replace paper and spreadsheets', href: '/solutions/replace-paper-and-spreadsheets' },
            { label: 'Multi-site visibility', href: '/solutions/multi-site-visibility' },
          ],
        },
        {
          heading: 'By role',
          items: [
            { label: 'H&S managers', href: '/solutions/hs-managers' },
            { label: 'Operations directors', href: '/solutions/operations-directors' },
            { label: 'Transport managers', href: '/solutions/transport-managers' },
            { label: 'Site and depot managers', href: '/solutions/site-and-depot-managers' },
          ],
        },
        {
          heading: 'By size',
          items: [
            { label: 'Growing businesses', href: '/solutions/growing-businesses' },
            { label: 'Multi-site operators', href: '/solutions/multi-site-operators' },
          ],
        },
      ],
    },
    { label: 'Industries', href: '/#industries', children: PLATFORM_INDUSTRY_LINKS },
    {
      label: 'Resources',
      href: '/insights',
      columns: [
        {
          heading: 'Learn',
          items: [
            { label: 'Insights', href: '/insights', description: 'Plain-English guides to RIDDOR, near misses, lone working and more.' },
            { label: 'Academy', href: '/academy', description: 'Short recordings of jobsafe, exactly as your team will use it.' },
            { label: 'Toolkit', href: '/toolkit', description: 'The free incident and near-miss reporting toolkit (PDF).' },
          ],
        },
        {
          heading: 'Free tools',
          items: FREE_TOOL_LINKS,
        },
        {
          // Rendered only with NEXT_PUBLIC_COMPARE_PAGES on; navForFlag drops the column while the pages are 404.
          heading: 'Compare',
          items: COMPARE_LINKS,
        },
      ],
    },
    { label: 'Pricing', href: '/pricing' },
  ],
  actions: [
    { kind: 'login', label: 'Log in', href: LOGIN_URL, showFrom: 'lg' },
    { kind: 'signup', label: 'Sign up now', href: SIGNUP_TRIAL_URL, showFrom: 'xl' },
    { kind: 'demo', label: 'Book a demo', href: DEMO_BOOKING_URL, showFrom: 'always', placement: 'navbar' },
  ],
  promos: {
    Platform: {
      eyebrow: 'Take the 2-minute tour',
      title: 'Real screens from a UK haulier’s setup.',
      href: '/platform#tour',
      cta: 'Start the tour',
    },
  },
} as const

/** The platform footer. Columns per the brief; the "Compare" column renders only when the comparison pages exist. */
export const PLATFORM_FOOTER: FooterConfig & { readonly addressLine: string } = {
  brand: {
    blurb: 'Record. Resolve. Prevent. The health and safety platform for UK operators whose work happens in yards, sites, depots and vans.',
    maker: MAKER_LINE,
    madeIn: MADE_IN_LINE,
  },
  contacts: [
    { label: PHONE_DISPLAY, href: PHONE_HREF },
    { label: EMAIL_SALES, href: `mailto:${EMAIL_SALES}` },
    { label: EMAIL_SUPPORT, href: `mailto:${EMAIL_SUPPORT}` },
    { label: LEGAL_NAME, href: PARENT_ORG_URL, external: true },
  ],
  social: [
    { label: 'LinkedIn', href: SOCIAL.linkedin },
    { label: 'X', href: SOCIAL.x },
    { label: 'Instagram', href: SOCIAL.instagram },
  ],
  columns: [
    {
      heading: 'Platform',
      links: [
        { label: 'Platform overview', href: '/platform' },
        { label: 'Incident & near-miss reporting', href: '/platform/incident-reporting' },
        { label: 'RIDDOR 2013', href: '/platform/riddor' },
        { label: 'Risk assessments & bowtie', href: '/platform/risk-assessments' },
        { label: 'Permits to work', href: '/platform/permits-to-work' },
        { label: 'Checklists & inspections', href: '/platform/checklists' },
        { label: 'Fleet & plant', href: '/platform/fleet-compliance' },
        { label: 'Bowtie analysis', href: '/platform/bowtie-analysis' },
        { label: 'Works offline', href: '/platform/offline' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      heading: 'Industries',
      links: PLATFORM_INDUSTRY_LINKS.map(({ label, href }) => ({ label, href })),
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Insights', href: '/insights' },
        { label: 'Academy', href: '/academy' },
        { label: 'Toolkit', href: '/toolkit' },
        { label: 'Free tools', href: '/tools' },
        { label: 'RIDDOR checker', href: '/tools/riddor-checker' },
        { label: 'Risk matrix', href: '/tools/risk-matrix' },
        { label: 'AFR calculator', href: '/tools/accident-frequency-rate' },
        { label: 'Book a demo', href: '/demo' },
      ],
    },
    {
      // Phase 3: rendered only with NEXT_PUBLIC_COMPARE_PAGES on; footerForFlag drops the column otherwise.
      heading: 'Compare',
      links: COMPARE_LINKS.map(({ label, href }) => ({ label, href })),
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Security', href: '/security' },
        { label: 'Contact', href: '/contact' },
        { label: 'Log in', href: LOGIN_URL },
        { label: 'Sign up now', href: SIGNUP_TRIAL_URL },
        { label: 'Cookie settings', href: '/cookies', action: 'cookie-settings' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy policy', href: '/privacy-policy' },
        { label: 'Terms and conditions', href: '/terms' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
  ],
  // Cookie settings lives in the Company column above; one control per page.
  legal: [
    { label: 'Privacy policy', href: '/privacy-policy' },
    { label: 'Terms and conditions', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
  newsletter: {
    eyebrow: 'The weekly briefing',
    title: 'Beyond Compliance',
    blurb:
      'This week in HSE: the rulings, the compliance deadlines and the numbers behind them. Written for the people running the sites.',
  },
  copyright: `© ${BRAND}`,
  addressLine: `${HOSTING_LINE} · Made by ${LEGAL_NAME}, ${ADDRESS_LINE} · ${PHONE_DISPLAY}`,
} as const

// ── Which nav and footer render, and with which links ───────────────────────

const isSiteLink = (href: string) => href.startsWith('/') && !href.startsWith('/#') && !href.includes('#')
const exists = (href: string, launched: boolean) =>
  !isSiteLink(href) || routeExists(href, launched) || href === '/insights' || href === '/academy' || href === '/toolkit'

/** Drops every link whose page does not exist in this flag state, then every menu left empty. */
export function navForFlag(nav: NavConfig, launched: boolean): NavConfig {
  const items = nav.items.flatMap((item) => {
    if (item.columns?.length) {
      const columns = item.columns.map((column) => ({ ...column, items: column.items.filter((child) => exists(child.href, launched)) })).filter((column) => column.items.length > 0)
      return columns.length ? [{ ...item, columns }] : []
    }
    if (item.children?.length) {
      const children = item.children.filter((child) => exists(child.href, launched))
      return children.length ? [{ ...item, children }] : []
    }
    return exists(item.href, launched) ? [item] : []
  })
  return { ...nav, items }
}

/** Drops footer links whose page does not exist in this flag state. */
export function footerForFlag<T extends FooterConfig>(footer: T, launched: boolean): T {
  return {
    ...footer,
    columns: footer.columns.map((column) => ({ ...column, links: column.links.filter((link) => exists(link.href, launched)) })).filter((column) => column.links.length > 0),
    legal: footer.legal.filter((link) => exists(link.href, launched)),
  }
}

/** The nav for the current build: Phase 1's until the platform launches. */
export function activeNav(launched: boolean = PLATFORM_LAUNCH): NavConfig {
  return launched ? navForFlag(PLATFORM_NAV, true) : NAV
}

/** The footer for the current build. */
export function activeFooter(launched: boolean = PLATFORM_LAUNCH): FooterConfig & { readonly addressLine?: string } {
  return launched ? footerForFlag(PLATFORM_FOOTER, true) : FOOTER
}

/** The promo card for a mega-menu panel, if one is configured. */
export function navPromo(label: string): NavPromo | null {
  return PLATFORM_NAV.promos[label] ?? null
}
