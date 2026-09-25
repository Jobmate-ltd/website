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
} from '@/lib/brand'
import { INDUSTRY_LINKS } from '@/lib/site'

/**
 * /llms.txt — a plain-text summary for AI crawlers, generated from
 * lib/brand.ts so it can never quote a price the site does not charge.
 * (The previous static file listed a volume tier that never existed.)
 */
export const dynamic = 'force-static'

export function GET(): Response {
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
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
