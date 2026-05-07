import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'JobSafe terms and conditions of service.',
}

export default function Terms() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-[#e5342a] text-sm hover:underline mb-12 block">← Back to JobSafe</a>
        <h1 className="text-4xl font-black text-white mb-4">Terms &amp; Conditions</h1>
        <p className="text-white/60 text-sm mb-16">Last updated: January 2024</p>
        <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed space-y-8">

          <p className="text-white/60 leading-relaxed">All services provided by JobSafe and orders for software services are subject to the following terms and conditions. No additions or variations shall apply unless expressly agreed in writing by JobSafe. JobSafe is provided as a SaaS (Software as a Service) platform. Access is through web services or mobile applications.</p>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">Definitions</h2>
            <dl>
              <dt className="text-white font-semibold mt-3">Access date</dt>
              <dd className="text-white/60 ml-4">The date on which access to the Software is first provided to the Customer.</dd>
              <dt className="text-white font-semibold mt-3">Commencement date</dt>
              <dd className="text-white/60 ml-4">The date on which the Contract comes into force.</dd>
              <dt className="text-white font-semibold mt-3">Contract</dt>
              <dd className="text-white/60 ml-4">The agreement between JobSafe and the Customer for the provision of the Software under these terms and conditions.</dd>
              <dt className="text-white font-semibold mt-3">Customer</dt>
              <dd className="text-white/60 ml-4">The organisation or individual purchasing a Licence to use the Software.</dd>
              <dt className="text-white font-semibold mt-3">Data Protection Legislation</dt>
              <dd className="text-white/60 ml-4">All applicable data protection and privacy legislation in force from time to time in the UK, including the UK GDPR and the Data Protection Act 2018.</dd>
              <dt className="text-white font-semibold mt-3">GDPR</dt>
              <dd className="text-white/60 ml-4">The General Data Protection Regulation (EU) 2016/679 as retained in UK law.</dd>
              <dt className="text-white font-semibold mt-3">JobSafe</dt>
              <dd className="text-white/60 ml-4">The SaaS platform provided by Jobmate Ltd, a company registered in England and Wales.</dd>
              <dt className="text-white font-semibold mt-3">Licence</dt>
              <dd className="text-white/60 ml-4">The non-exclusive, non-transferable right granted to the Customer to use the Software in accordance with these terms.</dd>
              <dt className="text-white font-semibold mt-3">SaaS</dt>
              <dd className="text-white/60 ml-4">Software as a Service — software licensed on a subscription basis and centrally hosted.</dd>
              <dt className="text-white font-semibold mt-3">Software</dt>
              <dd className="text-white/60 ml-4">The JobSafe application and all associated modules, features, and updates provided under the Licence.</dd>
              <dt className="text-white font-semibold mt-3">Support</dt>
              <dd className="text-white/60 ml-4">Technical assistance provided by JobSafe to the Customer in connection with use of the Software.</dd>
              <dt className="text-white font-semibold mt-3">User Subscription</dt>
              <dd className="text-white/60 ml-4">A per-user licence fee paid monthly in advance entitling one named individual to access and use the Software.</dd>
            </dl>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S1. Agreement</h2>
            <p className="text-white/60 leading-relaxed">JobSafe agrees to provide the SaaS software in consideration for an agreed fee payable monthly in advance, including any additional features or services agreed upon as part of the subscription. Third-party software supplied by JobSafe will be subject to the third-party owner&apos;s licensing terms and conditions, which in the event of conflict shall prevail.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S2. Payment</h2>
            <p className="text-white/60 leading-relaxed">JobSafe subscriber licences are managed through a payment gateway. Users with permissions can increase or decrease the number of licences at any time through the portal. User Subscriptions are paid monthly in advance and increase each year at a minimum of the annual rate of inflation. JobSafe reserves the right to increase subscription charges above the inflation rate with one month&apos;s notice. Interest of 3% per month applies to overdue amounts. If payment is later than 3 months, JobSafe reserves the right to suspend the service. VAT will be payable at the rate applicable at the time of invoice.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S3. Subcontracting or Reselling</h2>
            <p className="text-white/60 leading-relaxed">The contract of use is between JobSafe and the Customer. You are not permitted to resell the service or allow unauthorised parties access to the software without prior written permission from JobSafe. The subscription licence is for one named user only and cannot be shared.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S4. Additional Features and Services</h2>
            <p className="text-white/60 leading-relaxed">Subject to the conditions of the commercial agreement, JobSafe will provide all support, training, and consultation defined in the offer. This may be subcontracted to approved individuals or bodies.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S5. Termination of the Agreement</h2>
            <p className="text-white/60 leading-relaxed">(a) Monthly subscriptions can be cancelled through the subscription portal. Data will be deleted after 6 months under GDPR regulations. (b) Contracted access (3–5 years) requires 6 months&apos; written notice before the contracted term ends. Data will be held for 12 months before deletion. (c) Early termination: the full contractual fee is payable for the remaining term. (d) Company dissolved: contact <a href="mailto:support@jobsafe.cloud" className="text-[#e5342a] hover:underline">support@jobsafe.cloud</a>.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S6. Service Provision</h2>
            <p className="text-white/60 leading-relaxed">JobSafe software and data are hosted in UK-based AWS cloud infrastructure. The service uptime of AWS is quoted at 99.9999+%. JobSafe does not accept liability for AWS system outages as these are outside of our control.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S7. Support &amp; Warranty</h2>
            <p className="text-white/60 leading-relaxed">JobSafe provides general training material as part of the Subscription Licence fee. Support cover is 09:00–17:00 UK time on weekdays only, excluding public holidays. Additional support packages are available for an additional fee.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S8. Limited Liability</h2>
            <p className="text-white/60 leading-relaxed">JobSafe limits its liability in the use of the software. It provides a cloud software service platform for the Customer to use in the management of their operational activities. JobSafe does not guarantee connectivity should the service not be available due to third-party failure, signal issues, or lack of internet coverage.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S9. Data Quality</h2>
            <p className="text-white/60 leading-relaxed">JobSafe does not restrict or monitor data entered into the software and therefore holds no liability if data is entered incorrectly, corrupted, or made offensive and sent to third parties through JobSafe.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S10. Connections and Integrations</h2>
            <p className="text-white/60 leading-relaxed">It is not recommended to connect JobSafe to other software through middleware that JobSafe has not approved. We are happy to work with clients to approve additional third-party software connections through our APIs.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S11. Ownership</h2>
            <p className="text-white/60 leading-relaxed">Any development enhancements, additional features, and integrations remain the intellectual property of JobSafe unless otherwise agreed in writing.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S12. Right to Make Changes</h2>
            <p className="text-white/60 leading-relaxed">JobSafe retains the right to make enhancements and improvements to the software for customers on standard monthly SaaS contracts by giving 6 weeks&apos; notice. Enterprise customers will be consulted on new features and asked if they wish to adopt them.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S13. Force Majeure</h2>
            <p className="text-white/60 leading-relaxed">Neither party shall be liable for failure to perform obligations under the contract if such failure results from circumstances beyond the party&apos;s reasonable control.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S14. Third Party Rights</h2>
            <p className="text-white/60 leading-relaxed">The contract does not create any rights enforceable by anyone other than the parties to the agreement or any person to whom it is lawfully assigned.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S15. Patents, Design and Copyright</h2>
            <p className="text-white/60 leading-relaxed">The design, operational features, and flows in the software remain under the sole ownership of JobSafe. All brand content and marketing material remain the copyright of JobSafe. Persons wishing to use the brand must contact JobSafe for permission before using any material. At no time shall any rights, interests or title in any intellectual property be passed to the Customer.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S16. Law</h2>
            <p className="text-white/60 leading-relaxed">Unless otherwise agreed in writing, the agreement shall be construed in accordance with the laws of England, and the parties submit to the exclusive jurisdiction of the English Courts.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S17. Transfer of Rights</h2>
            <p className="text-white/60 leading-relaxed">The agreement is made between the signing parties. Neither party has the right to transfer the agreement to another party without prior authorisation.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">S18. Data Protection</h2>
            <p className="text-white/60 leading-relaxed">Both parties will comply with all applicable requirements of Data Protection Legislation. The customer is the data controller and JobSafe is the data processor.</p>
          </article>

        </div>
      </div>
    </main>
  )
}
