import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'JobSafe privacy policy — how we collect, use and protect your data in accordance with GDPR.',
}

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-[#e5342a] text-sm hover:underline mb-12 block">← Back to JobSafe</a>
        <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-white/60 text-sm mb-16">Last updated: January 2024</p>
        <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed space-y-8">

          <article>
            <h2 className="text-white font-bold text-lg mb-3">1. Data Protection</h2>
            <p className="text-white/60 leading-relaxed">We comply with the principles of the General Data Protection Regulation (GDPR) when dealing with all data received from customers or visitors to our website.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">2. Our Services</h2>
            <p className="text-white/60 leading-relaxed">We only hold the data necessary to offer services provided on our website. We do not ask for or use more data than necessary to provide you with a proper service. This means we only process and hold data related to purchases and subsequent support related to those purchases, in accordance with Article 6(1)(b) of the GDPR. Any processing of your data is only done to provide or perform the services or products you have purchased.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">3. Data Protection Register</h2>
            <p className="text-white/60 leading-relaxed">Data is only used for the purposes described in our entry on the Data Protection Register.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">4. Required Period</h2>
            <p className="text-white/60 leading-relaxed">We only hold personal data for as long as necessary. Once data is no longer needed we delete it.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">5. Card &amp; Payment Processing Data</h2>
            <p className="text-white/60 leading-relaxed">We use third-party payment providers to handle card and payment processing data securely. We never see or store any card or payment information. Any other data is only used to process your purchase securely in accordance with Article 6(1)(b) of the GDPR. We retain data related to all purchases to fulfil our legal obligations to account for tax and VAT on all transactions in accordance with Article 6(1)(c) of the GDPR.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">6. Backup &amp; Data Storage</h2>
            <p className="text-white/60 leading-relaxed">All JobSafe data is stored in UK-based AWS data centres. For administrative reasons, certain customer data may be passed to and stored securely with third-party service providers. This is done to backup and preserve your data where it is needed to continue offering a service to you.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">7. Customer Requests</h2>
            <p className="text-white/60 leading-relaxed">As a customer, you can at any time and free of charge request details of the data we hold relating to you — and you can also request any such data is amended or deleted. Please note that if you request deletion of your data, this may prevent us from offering any further support relating to your previous purchases.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">8. Email Updates</h2>
            <p className="text-white/60 leading-relaxed">We regularly email product news and information updates to those customers who have specifically subscribed to our email service. All subscription emails contain clear information on how to unsubscribe. Our email service is opt-in only, with your prior consent required in accordance with Article 6(1)(a) of the GDPR.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">9. Our Promise</h2>
            <p className="text-white/60 leading-relaxed">We never sell, rent or exchange mailing lists.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">10. Data Sharing With Partners</h2>
            <p className="text-white/60 leading-relaxed">We do not share commercial or technical data with our partners unless we have specifically sought and obtained your prior approval. Even when we have your specific consent, we only share data with partners that operate their own privacy policy in full accordance with GDPR.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">11. Spam</h2>
            <p className="text-white/60 leading-relaxed">In accordance with the Privacy and Electronic Communications (EC Directive) Regulations 2003, we never send bulk unsolicited emails to email addresses.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">12. Product Updates</h2>
            <p className="text-white/60 leading-relaxed">We may send emails to existing customers or prospective customers who have enquired or registered with us, regarding products or services directly provided by JobSafe.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">13. Email Content</h2>
            <p className="text-white/60 leading-relaxed">All emails sent by us will be clearly marked as originating from JobSafe. All such emails will include clear instructions on how to unsubscribe, either via an unsubscribe link or a valid reply-to address with unsubscribe as the subject heading.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">14. Cookies</h2>
            <p className="text-white/60 leading-relaxed">Our website uses cookies to track usage and allow customers to access our platform. These cookies do not contain or pass any personal, confidential or financial information. You are free to refuse cookies, however this may affect your ability to use certain features of the platform.</p>
          </article>

          <article>
            <h2 className="text-white font-bold text-lg mb-3">15. Contact Us</h2>
            <p className="text-white/60 leading-relaxed">If you have any questions relating to this Privacy Policy, please email us at <a href="mailto:support@jobsafe.cloud" className="text-[#e5342a] hover:underline">support@jobsafe.cloud</a>.</p>
          </article>

        </div>
      </div>
    </main>
  )
}
