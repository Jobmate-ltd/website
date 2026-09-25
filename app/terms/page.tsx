import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BRAND, EMAIL_SUPPORT, LEGAL_NAME } from '@/lib/brand'
import { LegalPage, LegalSection } from '@/components/site/legal-page'

const PATH = '/terms'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Terms and conditions',
  description: `The terms and conditions for using the ${BRAND} software as a service platform, made by ${LEGAL_NAME}: agreement, payment, termination, support, liability and data protection.`,
})

const DEFINITIONS: readonly [string, string][] = [
  ['Access date', 'The date on which access to the Software is first provided to the Customer.'],
  ['Commencement date', 'The date on which the Contract comes into force.'],
  ['Contract', `The agreement between ${BRAND} and the Customer for the provision of the Software under these terms and conditions.`],
  ['Customer', 'The organisation or individual purchasing a Licence to use the Software.'],
  ['Data Protection Legislation', 'All applicable data protection and privacy legislation in force from time to time in the UK, including the UK GDPR and the Data Protection Act 2018.'],
  ['GDPR', 'The General Data Protection Regulation (EU) 2016/679 as retained in UK law.'],
  [BRAND, `The SaaS platform provided by ${LEGAL_NAME}, a company registered in England and Wales.`],
  ['Licence', 'The non-exclusive, non-transferable right granted to the Customer to use the Software in accordance with these terms.'],
  ['SaaS', 'Software as a Service: software licensed on a subscription basis and centrally hosted.'],
  ['Software', `The ${BRAND} application and all associated modules, features, and updates provided under the Licence.`],
  ['Support', `Technical assistance provided by ${BRAND} to the Customer in connection with use of the Software.`],
  ['User Subscription', 'A per-user licence fee paid monthly in advance entitling one named individual to access and use the Software.'],
]

const SECTIONS: readonly { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 's1',
    title: 'S1. Agreement',
    body: `${BRAND} agrees to provide the SaaS software in consideration for an agreed fee payable monthly in advance, including any additional features or services agreed upon as part of the subscription. Third-party software supplied by ${BRAND} will be subject to the third-party owner's licensing terms and conditions, which in the event of conflict shall prevail.`,
  },
  {
    id: 's2',
    title: 'S2. Payment',
    body: `${BRAND} subscriber licences are managed through a payment gateway. Users with permissions can increase or decrease the number of licences at any time through the portal. User Subscriptions are paid monthly in advance and increase each year at a minimum of the annual rate of inflation. ${BRAND} reserves the right to increase subscription charges above the inflation rate with one month's notice. Interest of 3% per month applies to overdue amounts. If payment is later than 3 months, ${BRAND} reserves the right to suspend the service. VAT will be payable at the rate applicable at the time of invoice.`,
  },
  {
    id: 's3',
    title: 'S3. Subcontracting or reselling',
    body: `The contract of use is between ${BRAND} and the Customer. You are not permitted to resell the service or allow unauthorised parties access to the software without prior written permission from ${BRAND}. The subscription licence is for one named user only and cannot be shared.`,
  },
  {
    id: 's4',
    title: 'S4. Additional features and services',
    body: `Subject to the conditions of the commercial agreement, ${BRAND} will provide all support, training, and consultation defined in the offer. This may be subcontracted to approved individuals or bodies.`,
  },
  {
    id: 's5',
    title: 'S5. Termination of the agreement',
    body: (
      <>
        (a) Monthly subscriptions can be cancelled through the subscription portal. Data will be deleted after 6 months under
        GDPR regulations. (b) Contracted access (3–5 years) requires 6 months&apos; written notice before the contracted term
        ends. Data will be held for 12 months before deletion. (c) Early termination: the full contractual fee is payable for
        the remaining term. (d) Company dissolved: contact <a href={`mailto:${EMAIL_SUPPORT}`}>{EMAIL_SUPPORT}</a>.
      </>
    ),
  },
  {
    id: 's6',
    title: 'S6. Service provision',
    body: `${BRAND} software and data are hosted in UK-based AWS cloud infrastructure. The service uptime of AWS is quoted at 99.9999+%. ${BRAND} does not accept liability for AWS system outages as these are outside of our control.`,
  },
  {
    id: 's7',
    title: 'S7. Support and warranty',
    body: `${BRAND} provides general training material as part of the Subscription Licence fee. Support cover is 09:00–17:00 UK time on weekdays only, excluding public holidays. Additional support packages are available for an additional fee.`,
  },
  {
    id: 's8',
    title: 'S8. Limited liability',
    body: `${BRAND} limits its liability in the use of the software. It provides a cloud software service platform for the Customer to use in the management of their operational activities. ${BRAND} does not guarantee connectivity should the service not be available due to third-party failure, signal issues, or lack of internet coverage.`,
  },
  {
    id: 's9',
    title: 'S9. Data quality',
    body: `${BRAND} does not restrict or monitor data entered into the software and therefore holds no liability if data is entered incorrectly, corrupted, or made offensive and sent to third parties through ${BRAND}.`,
  },
  {
    id: 's10',
    title: 'S10. Connections and integrations',
    body: `It is not recommended to connect ${BRAND} to other software through middleware that ${BRAND} has not approved. We are happy to work with clients to approve additional third-party software connections through our APIs.`,
  },
  {
    id: 's11',
    title: 'S11. Ownership',
    body: `Any development enhancements, additional features, and integrations remain the intellectual property of ${BRAND} unless otherwise agreed in writing.`,
  },
  {
    id: 's12',
    title: 'S12. Right to make changes',
    body: `${BRAND} retains the right to make enhancements and improvements to the software for customers on standard monthly SaaS contracts by giving 6 weeks' notice. Enterprise customers will be consulted on new features and asked if they wish to adopt them.`,
  },
  {
    id: 's13',
    title: 'S13. Force majeure',
    body: "Neither party shall be liable for failure to perform obligations under the contract if such failure results from circumstances beyond the party's reasonable control.",
  },
  {
    id: 's14',
    title: 'S14. Third party rights',
    body: 'The contract does not create any rights enforceable by anyone other than the parties to the agreement or any person to whom it is lawfully assigned.',
  },
  {
    id: 's15',
    title: 'S15. Patents, design and copyright',
    body: `The design, operational features, and flows in the software remain under the sole ownership of ${BRAND}. All brand content and marketing material remain the copyright of ${BRAND}. Persons wishing to use the brand must contact ${BRAND} for permission before using any material. At no time shall any rights, interests or title in any intellectual property be passed to the Customer.`,
  },
  {
    id: 's16',
    title: 'S16. Law',
    body: 'Unless otherwise agreed in writing, the agreement shall be construed in accordance with the laws of England, and the parties submit to the exclusive jurisdiction of the English Courts.',
  },
  {
    id: 's17',
    title: 'S17. Transfer of rights',
    body: 'The agreement is made between the signing parties. Neither party has the right to transfer the agreement to another party without prior authorisation.',
  },
  {
    id: 's18',
    title: 'S18. Data protection',
    body: `Both parties will comply with all applicable requirements of Data Protection Legislation. The customer is the data controller and ${BRAND} is the data processor.`,
  },
]

export default function Terms() {
  return (
    <LegalPage
      path={PATH}
      name="Terms and conditions"
      title="Terms and conditions"
      updated="January 2024"
      intro={`All services provided by ${BRAND} and orders for software services are subject to the following terms and conditions. No additions or variations shall apply unless expressly agreed in writing by ${BRAND}. ${BRAND} is provided as a SaaS (Software as a Service) platform. Access is through web services or mobile applications.`}
    >
      <LegalSection id="definitions" title="Definitions">
        <dl className="flex flex-col gap-3">
          {DEFINITIONS.map(([term, definition]) => (
            <div key={term}>
              <dt className="font-bold text-ink-1">{term}</dt>
              <dd className="text-ink-3">{definition}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>
      {SECTIONS.map((section) => (
        <LegalSection key={section.id} id={section.id} title={section.title}>
          <p>{section.body}</p>
        </LegalSection>
      ))}
    </LegalPage>
  )
}
