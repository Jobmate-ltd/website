// llms.txt — the plain-text summary for AI crawlers. Two bodies: the Phase 1
// text (served while NEXT_PUBLIC_PLATFORM_LAUNCH is off) and the platform text.
//
// seo-audit-ignore: no-checklists — `platformBody()` lists the platform's
// modules, one of which is Checklists & inspections. It is only served when
// the flag is on; `phase1Body()` makes no such claim.

import {
  ADMIN_PRICE_EX_VAT_LABEL,
  ANNUAL_TERMS,
  BRAND,
  EMAIL_SUPPORT,
  ENTRY_PRICE_EX_VAT_LABEL,
  LEGAL_NAME,
  LOGIN_URL,
  MAKER_LINE,
  PARENT_ORG_URL,
  PHONE_DISPLAY,
  PRICING_TIERS,
  SIGNUP_TRIAL_URL,
  SITE_URL,
  VAT_SUFFIX,
  VOLUME_PRICE_LABEL,
  trialSentence,
  ADDRESS_LINE,
  DEMO_BOOKING_URL,
  HOSTING_DETAIL,
  HOSTING_LINE,
  PLATFORM_LAUNCH,
  PRICE_BOOK,
  priceBookLabel,
} from '@/lib/brand'
import { INDUSTRY_LINKS } from '@/lib/site'
import { MODULES } from '@/lib/platform'

/**
 * /llms.txt — a plain-text summary for AI crawlers, generated from
 * lib/brand.ts so it can never quote a price the site does not charge.
 * (The previous static file listed a volume tier that never existed.)
 */
export const dynamic = 'force-static'

export function GET(): Response {
  const body = PLATFORM_LAUNCH ? platformBody() : phase1Body()
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

/** The platform summary. No sign-up to the platform, no live demo, no trial: the call to action is a booked demo. */
function platformBody(): string {
  const modules = MODULES.map((m) => `- ${m.name}${m.status === 'expanding' ? ' (expanding)' : ''}: ${m.promise}${m.path ? ` ${SITE_URL}${m.path}` : ''}`).join('\n')
  const tiers = Object.values(PRICE_BOOK)
    .map((tier) => `- ${tier.name}: ${priceBookLabel(tier)}. Includes ${tier.includedModules.join(', ')}.`)
    .join('\n')
  return `# ${BRAND}

> ${BRAND} is the health and safety platform for UK operators whose work happens in yards, sites, depots and vans. ${MAKER_LINE} ${HOSTING_LINE}.

## What ${BRAND} does
Incidents and near misses, RIDDOR 2013 triage and register, investigations (ICAM), corrective actions, permits to work gated on contractor competence and a live risk assessment, risk assessments with 5x5 scoring and bowtie analysis, checklists and inspections, fleet and plant compliance dates, training and competence, document control and dashboards. Every module saves to the phone first and syncs when signal returns. Installable web app; no native store app yet. jobsafe records RIDDOR submissions and their references; the customer submits to HSE.

## Modules
${modules}

## Pricing (per user per month, ex VAT, quoted in pounds with VAT shown)
${tiers}
- Ask for pricing: ${SITE_URL}/pricing

## Industries
${INDUSTRY_LINKS.map((industry) => `- ${industry.label}: ${SITE_URL}${industry.href}`).join('\n')}

## Company
${MAKER_LINE} ${LEGAL_NAME} is based at ${ADDRESS_LINE}, United Kingdom. ${HOSTING_LINE}: ${HOSTING_DETAIL}.
- Platform: ${SITE_URL}/platform
- Book a demo: ${DEMO_BOOKING_URL} (${SITE_URL}/demo)
- Security and hosting: ${SITE_URL}/security
- Contact: ${SITE_URL}/contact
- Log in (current app): ${LOGIN_URL}
- Sign up (current app): ${SIGNUP_TRIAL_URL}
- Maker: ${PARENT_ORG_URL}
- Support: ${EMAIL_SUPPORT}
- Phone: ${PHONE_DISPLAY}
- Jurisdiction: United Kingdom
`
}

/** The Phase 1 summary, unchanged: what production serves while the flag is off. */
function phase1Body(): string {
  const body = `# ${BRAND}

> ${BRAND} is a UK workplace incident reporting app for field service, construction, care, transport and industrial teams. ${MAKER_LINE}

## What ${BRAND} does
Workers capture safety incidents, near misses, hazards and HSSE events from a phone, including offline. Reports carry photos, video, voice notes, GPS location and a timestamp. Supervisors are alerted when a report lands and resolve it from a dashboard. Every action is written to the report's audit trail.

## Key features
- One-tap mobile incident capture
- Works offline, syncs automatically
- Photo, video and voice attachments
- Automatic GPS and timestamp on every report
- Real-time supervisor alerts
- Full audit trail
- Dashboard analytics and site breakdowns
- Hosted in UK-based AWS infrastructure; handled under UK GDPR

## Pricing (per licence per month, ex VAT)
- Worker licence: ${ENTRY_PRICE_EX_VAT_LABEL} (${PRICING_TIERS[0].threshold.toLowerCase()}); ${VOLUME_PRICE_LABEL} ${VAT_SUFFIX} for ${PRICING_TIERS[1].threshold}; bespoke for ${PRICING_TIERS[2].threshold}
- Admin licence: ${ADMIN_PRICE_EX_VAT_LABEL}
- Annual billing: ${ANNUAL_TERMS}
- ${trialSentence()}

## Industries
${INDUSTRY_LINKS.map((industry) => `- ${industry.label}: ${SITE_URL}${industry.href}`).join('\n')}

## Company
${MAKER_LINE} ${LEGAL_NAME} is based in Wolverhampton, United Kingdom.
- Product: ${SITE_URL}
- Sign up: ${SIGNUP_TRIAL_URL}
- Log in: ${LOGIN_URL}
- Maker: ${PARENT_ORG_URL}
- Support: ${EMAIL_SUPPORT}
- Phone: ${PHONE_DISPLAY}
- Jurisdiction: United Kingdom
`
  return body
}
