import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import { ADDRESS, EMAIL_PRIVACY, EMAIL_SUPPORT, LEGAL_NAME, MAKER_LINE, SITE_URL } from '@/lib/brand'
import { CONSENT_MAX_AGE_SECONDS } from '@/lib/consent'
import { LegalPage, LegalSection, LegalTable } from '@/components/site/legal-page'

const PATH = '/privacy-policy'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Privacy policy',
  description:
    'How Jobmate Ltd collects, uses and protects personal data on jobsafe.cloud: analytics, the chat widget, newsletter sign-up, toolkit downloads, demo booking and billing, and the sub-processors involved.',
})

/**
 * Drafted 25/09/2026 to replace the January 2024 notice, which did not cover
 * analytics, the chat widget, the newsletter, toolkit downloads, Calendly or
 * billing. Nothing here states a company number, ICO registration number or
 * retention period that has not been confirmed; those are for legal review
 * before publication (see the Phase 1 PR).
 */
const SUB_PROCESSORS: readonly (readonly string[])[] = [
  ['Amazon Web Services (UK region)', 'Hosting for the jobsafe app and customer data', 'United Kingdom'],
  ['Vercel Inc.', 'Hosting and delivery of this website; Speed Insights (only after analytics consent)', 'Global edge network; provider safeguards apply'],
  ['Google Ireland Ltd', 'Google Analytics 4, only after analytics consent, with IP anonymisation', 'EU / US under Google’s safeguards'],
  ['Brevo (Sendinblue SAS)', 'Newsletter list and sending', 'EU'],
  ['Calendly LLC', 'Demo booking, when you choose to book a slot', 'US under Calendly’s safeguards'],
  ['Chargebee Inc.', 'Subscriptions and billing for the jobsafe app', 'Provider safeguards apply'],
  ['Twilio SendGrid or Resend', 'Transactional email (toolkit confirmation and sales notification)', 'US under provider safeguards'],
  ['Google (YouTube)', 'Embedded video, loaded only when you press play, via youtube-nocookie.com', 'EU / US under Google’s safeguards'],
  ['Our customer relationship management system', 'Receiving toolkit and demo leads so sales can follow up', 'To be confirmed at legal review'],
]

const RIGHTS = [
  'access the personal data we hold about you;',
  'have inaccurate data corrected;',
  'have your data erased where there is no good reason for us to keep it;',
  'restrict or object to our processing, including any direct marketing;',
  'receive the data you gave us in a portable format;',
  'withdraw consent at any time where consent is the basis we rely on, without affecting what was done before.',
]

export default function PrivacyPolicy() {
  return (
    <LegalPage
      path={PATH}
      name="Privacy policy"
      title="Privacy policy"
      updated="25/09/2026"
      intro={`${MAKER_LINE} This notice explains what personal data we collect through ${SITE_URL.replace('https://', '')}, why, who we share it with, and the rights you have over it.`}
    >
      <LegalSection id="who-we-are" title="1. Who we are">
        <p>
          {LEGAL_NAME} is the data controller for personal data collected through this website. We are a company registered in
          England and Wales, based at {ADDRESS.streetAddress}, {ADDRESS.addressLocality} {ADDRESS.postalCode}, United Kingdom.
          Questions about this notice, or about your data, go to{' '}
          <a href={`mailto:${EMAIL_PRIVACY}`}>{EMAIL_PRIVACY}</a>.
        </p>
        <p>
          When a customer uses the jobsafe app to record incidents, the customer is the data controller for that content and
          {' '}{LEGAL_NAME} is the data processor. That relationship is governed by our{' '}
          <Link href="/terms">terms and conditions</Link> and, on request, a data processing agreement.
        </p>
      </LegalSection>

      <LegalSection id="what-this-covers" title="2. What this notice covers">
        <p>
          This notice covers the marketing website at {SITE_URL.replace('https://', '')}: visiting it, reading it, using the
          chat widget, joining the newsletter, downloading the free toolkit, booking a demo and starting a subscription. The
          jobsafe app and its sign-up pages carry their own terms.
        </p>
      </LegalSection>

      <LegalSection id="what-we-collect" title="3. What we collect, why, and on what basis">
        <h3>Visiting the site</h3>
        <p>
          Our hosting provider records the technical information any web server needs to deliver a page: your IP address, the
          page requested, the time, and your browser type. We use this to run the site securely and to diagnose faults
          (legitimate interests). We do not use it to identify you.
        </p>

        <h3>Analytics</h3>
        <p>
          With your consent, we use Google Analytics 4 to see which pages are read and how visitors move through the site, and
          Vercel Speed Insights to measure how fast pages load. Neither loads until you allow analytics cookies through the
          consent banner. IP addresses are anonymised. You can withdraw consent at any time from &ldquo;Cookie settings&rdquo;
          in the footer, and our <Link href="/cookies">cookie notice</Link> lists every cookie and script.
        </p>

        <h3>The chat widget</h3>
        <p>
          The assistant in the corner of every page runs entirely in your browser. It answers from a fixed set of questions on
          this site, sends nothing to us or to any third party, and stores nothing on your device.
        </p>

        <h3>Newsletter</h3>
        <p>
          If you join the weekly briefing we collect your email address and pass it to Brevo, the email service that sends the
          newsletter. The basis is your consent; every email carries an unsubscribe link and unsubscribing removes you from the
          list.
        </p>

        <h3>The free toolkit</h3>
        <p>
          To download the toolkit we ask for your name, work email, company and phone number, and record when and from which
          page you downloaded it (including any campaign tags in the link). We use this to deliver the toolkit and to follow
          up about jobsafe, which is our legitimate interest as a business-to-business supplier; you can object at any time
          and we will stop. If you tick the box asking for occasional safety emails we send them on the basis of your consent.
          Lead details are passed to our sales team and to the customer relationship management system we use to work them.
        </p>

        <h3>Booking a demo</h3>
        <p>
          &ldquo;Book a demo&rdquo; opens Calendly in a new tab. The details you enter there are collected by Calendly under
          its own privacy notice and shared with us so we can hold the call.
        </p>

        <h3>Signing up and billing</h3>
        <p>
          Subscriptions are managed by Chargebee. Card and payment details are entered into and held by Chargebee and its
          payment partners; they never touch our servers. We keep the records we need to account for tax and VAT on every
          transaction (legal obligation) and to run your subscription (contract).
        </p>

        <h3>Emailing or phoning us</h3>
        <p>
          If you contact <a href={`mailto:${EMAIL_SUPPORT}`}>{EMAIL_SUPPORT}</a>, sales, or the office number, we keep the
          correspondence for as long as we need it to deal with your enquiry and any follow-up (legitimate interests).
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="4. Who we share data with">
        <p>
          We do not sell, rent or exchange personal data. We share it only with the suppliers below, who process it on our
          instructions, and where the law requires.
        </p>
        <LegalTable caption="Sub-processors" head={['Provider', 'What for', 'Where']} rows={SUB_PROCESSORS} />
        <p>
          Where a supplier processes data outside the United Kingdom, we rely on the UK&apos;s adequacy regulations or the
          International Data Transfer Addendum to the EU standard contractual clauses.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="5. How long we keep it">
        <ul>
          <li>Server logs: for as long as needed to keep the site secure and diagnose faults, then deleted.</li>
          <li>Analytics data: as set by the consent you gave; the cookies themselves expire as listed in the cookie notice.</li>
          <li>Newsletter: until you unsubscribe, after which your address is removed from the list.</li>
          <li>Toolkit and demo leads: for as long as we are in contact about jobsafe, then reviewed and deleted when no longer needed.</li>
          <li>Billing records: for the period tax law requires.</li>
          <li>Your consent choice: one cookie, for {Math.round(CONSENT_MAX_AGE_SECONDS / 86400 / 30)} months.</li>
        </ul>
      </LegalSection>

      <LegalSection id="rights" title="6. Your rights">
        <p>Under the UK GDPR you can ask us to:</p>
        <ul>
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
        <p>
          Email <a href={`mailto:${EMAIL_PRIVACY}`}>{EMAIL_PRIVACY}</a> and we will respond within one month. If you are
          unhappy with how we have handled your data you can complain to the Information Commissioner&apos;s Office at{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="7. Cookies">
        <p>
          We use one essential cookie to remember your consent choice, and analytics cookies only if you allow them. The{' '}
          <Link href="/cookies">cookie notice</Link> lists every cookie and script, its purpose and how long it lasts.
        </p>
      </LegalSection>

      <LegalSection id="security" title="8. Security">
        <p>
          Customer data in the jobsafe app is held in UK-based Amazon Web Services infrastructure, encrypted in transit and at
          rest, and backed up automatically. Access is limited to the people who need it to run the service.
        </p>
      </LegalSection>

      <LegalSection id="children" title="9. Children">
        <p>This website and the jobsafe app are for businesses and their staff. We do not knowingly collect data from anyone under 16.</p>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes to this notice">
        <p>
          We will update this notice when our processing changes and show the date at the top. The previous version was dated
          January 2024.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
