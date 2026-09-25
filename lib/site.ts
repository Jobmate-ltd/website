// ─────────────────────────────────────────────────────────────────────────────
// Site configuration: the objects that drive <Header/> and <Footer/>.
//
// Phase 1 keeps today's navigation items. Phase 2 replaces `NAV.items` with
// the Platform / Solutions / Industries / Resources / Pricing mega-menu by
// editing this file only; the components do not change. Every URL that leaves
// the site is read from lib/brand.ts.
// ─────────────────────────────────────────────────────────────────────────────

import {
  BRAND,
  BROCHURE_PATH,
  DEMO_BOOKING_URL,
  EMAIL_SALES,
  EMAIL_SUPPORT,
  LEGAL_NAME,
  LOGIN_URL,
  MADE_IN_LINE,
  MAKER_LINE,
  PARENT_ORG_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  SIGNUP_TRIAL_URL,
  SOCIAL,
} from './brand.ts'

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
