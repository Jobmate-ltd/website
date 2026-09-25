import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import { GA4_MEASUREMENT_ID } from '@/lib/brand'
import { CONSENT_COOKIE, CONSENT_MAX_AGE_SECONDS } from '@/lib/consent'
import { LegalPage, LegalSection, LegalTable } from '@/components/site/legal-page'
import { CookieSettingsLink } from '@/components/site/cookie-settings-link'

const PATH = '/cookies'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Cookies',
  description:
    'Every cookie and script jobsafe.cloud uses, what each one is for, how long it lasts, and how to change your choice. Analytics loads only with your consent; there are no marketing cookies.',
})

const months = Math.round(CONSENT_MAX_AGE_SECONDS / 86400 / 30)

const COOKIES: readonly (readonly string[])[] = [
  [CONSENT_COOKIE, 'jobsafe (first party)', 'Remembers whether you accepted, rejected or chose analytics and marketing cookies, so we do not ask on every page.', 'Necessary', `${months} months`],
  ['_ga', 'Google Analytics 4', 'Distinguishes one visitor from another so page views can be counted. Set only after you allow analytics.', 'Analytics', '2 years'],
  [`_ga_${GA4_MEASUREMENT_ID.replace('G-', '')}`, 'Google Analytics 4', 'Keeps the state of the current visit for the same purpose. Set only after you allow analytics.', 'Analytics', '2 years'],
]

const SCRIPTS: readonly (readonly string[])[] = [
  ['Google tag (gtag.js)', 'Google', 'Loads Google Analytics 4 with IP anonymisation.', 'Analytics: after consent only'],
  ['Vercel Speed Insights', 'Vercel', 'Sends page-load timings to Vercel so we can see how fast the site is. Sets no cookie.', 'Analytics: after consent only'],
  ['YouTube embed (youtube-nocookie.com)', 'Google', 'Plays the product film and academy lessons. Nothing from YouTube loads until you press play, and the privacy-enhanced domain sets no advertising cookies before playback.', 'Loads on play only'],
  ['jobsafe chat widget', 'jobsafe', 'Answers questions from a fixed list in your browser. No network calls, no storage.', 'None'],
  ['Calendly', 'Calendly', '“Book a demo” opens calendly.com in a new tab. Nothing from Calendly loads on this site.', 'None on this site'],
]

export default function CookiesPage() {
  return (
    <LegalPage
      path={PATH}
      name="Cookies"
      title="Cookies and scripts"
      updated="25/09/2026"
      intro="What this site stores on your device and what it loads from elsewhere. Analytics is off until you say yes, and we run no marketing cookies at all."
    >
      <LegalSection id="your-choice" title="1. Your choice">
        <p>
          When you first visit we ask whether to allow analytics and marketing cookies. Accept and Reject carry equal weight,
          and &ldquo;Choose&rdquo; lets you pick by category. Your answer is kept for {months} months in one essential cookie.
          You can change it at any time:{' '}
          <CookieSettingsLink className="font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong">
            open cookie settings
          </CookieSettingsLink>
          .
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="2. Cookies">
        <LegalTable caption="Cookies set by this site" head={['Name', 'Set by', 'Purpose', 'Category', 'Lasts']} rows={COOKIES} />
        <p>
          Marketing: none. We do not run advertising or remarketing tags. The category exists in the consent panel so that if
          we ever add one, it cannot load without your say-so.
        </p>
      </LegalSection>

      <LegalSection id="scripts" title="3. Scripts and embedded services">
        <LegalTable caption="Third-party scripts and embeds" head={['Script or service', 'Provider', 'What it does', 'When it loads']} rows={SCRIPTS} />
      </LegalSection>

      <LegalSection id="forms" title="4. Forms">
        <p>
          The newsletter form and the toolkit form send what you type to our own server, which passes it to the providers named
          in the <Link href="/privacy-policy">privacy policy</Link>. Neither sets a cookie. The toolkit download link is a
          short-lived signed URL, not a cookie, and expires after 15 minutes.
        </p>
      </LegalSection>

      <LegalSection id="browser" title="5. Blocking cookies in your browser">
        <p>
          Every modern browser lets you block or delete cookies. If you block the consent cookie we will ask for your choice
          again on each visit; nothing else on the site depends on cookies.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
