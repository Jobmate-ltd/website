import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EMAIL_SALES, PLATFORM_LAUNCH, canonicalFor, priceBookHasPrices } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, platformApplicationSchema, type FaqEntry } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Button } from '@/components/ui/button'
import { CtaBand } from '@/components/ui/cta-band'
import { PricingExplorer } from '@/components/pricing/pricing-explorer'
import { ComparisonTable } from '@/components/pricing/comparison-table'
import { CostOfPaper } from '@/components/pricing/cost-of-paper'
import { FaqAccordion } from '@/components/platform/faq-accordion'

const PATH = '/pricing'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: PATH },
]

/** The pricing FAQ. Contract and cancellation answers match the terms (S2, S4). */
const FAQS: readonly FaqEntry[] = [
  { q: 'Is VAT included?', a: 'No. Every price is shown ex VAT with “+ VAT” beside it, and VAT is added at the rate applicable on the invoice date.' },
  { q: 'Can we pay on invoice or by BACS?', a: 'On Enterprise, yes: invoicing and BACS are included. Essentials and Professional are paid monthly in advance by card through the subscription portal.' },
  { q: 'How long is the contract?', a: 'Monthly subscriptions roll month to month and can be cancelled through the portal. Contracted access runs for three to five years and needs six months’ written notice before the term ends; early termination means the fee for the remaining term is payable.' },
  { q: 'How do we cancel?', a: 'A monthly subscription is cancelled in the subscription portal. Your data is deleted six months after cancellation; a contracted customer’s data is held for twelve months. Export your registers to CSV first.' },
  { q: 'Can we take our data with us?', a: 'Yes. Every register exports to CSV at any time, with the filters you have applied.' },
  { q: 'What counts as a user?', a: 'A person with their own login to your organisation, in any of the six role levels. Someone who never logs in is not a user.' },
]

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  const priced = priceBookHasPrices()
  const schema = jsonLd(graph(platformApplicationSchema(canonicalFor(PATH)), breadcrumbSchema(breadcrumbsFromTrail(CRUMBS))))
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="Pricing"
          title={h1For(PATH)}
          lead={
            priced
              ? 'Health and safety software pricing per user per month, in pounds, VAT shown. Three tiers, one comparison table, and a calculator for what paper is costing you now. No form needed.'
              : 'Health and safety software pricing per user per month, in pounds, VAT shown. The price list is being finalised: the tiers, the comparison table and the cost-of-paper calculator are below, and the numbers come from the demo until it is published.'
          }
          actions={
            <>
              <BookDemoButton placement="pricing-hero" size="lg">
                Book a demo for pricing
              </BookDemoButton>
              <Button variant="secondary" size="lg" asChild>
                <Link href="#calculator">What does paper cost you?</Link>
              </Button>
            </>
          }
        />

        <Section id="tiers" tone="white">
          <PricingExplorer />
        </Section>

        <Section id="compare" tone="grey">
          <SectionHeading eyebrow="Compare" title="Every module and capability, by tier" lead="Hover or focus the info button on a row for what it means." tone="grey" />
          <div className="mt-10">
            <ComparisonTable />
          </div>
        </Section>

        <Section id="calculator" tone="white">
          <SectionHeading eyebrow="Cost of paper" title="What the forms are costing you now" lead="Reports a month × minutes per paper report × the hourly cost of the people doing it. The working is shown; nothing is gated." />
          <div className="mt-10">
            <CostOfPaper />
          </div>
        </Section>

        <FaqAccordion items={FAQS} tone="grey" lead="VAT, invoicing, contract length, cancelling, export and what a user is." />
        <CtaBand
          tone="white"
          placement="pricing-closing"
          title="Get the number for your team."
          copy={`A 30-minute walkthrough, then a written quote in pounds with VAT shown. Or email ${EMAIL_SALES}.`}
          secondary={{ label: 'How the demo works', href: '/demo' }}
          note={
            <>
              Hosting and security are on the <Link href="/security" className="font-semibold text-brand-strong hover:underline">security page</Link>; the product is on the{' '}
              <Link href="/platform" className="font-semibold text-brand-strong hover:underline">platform overview</Link>, and it{' '}
              <Link href="/platform/offline" className="font-semibold text-brand-strong hover:underline">works offline</Link>. Questions? <Link href="/contact" className="font-semibold text-brand-strong hover:underline">Contact us</Link>.
            </>
          }
        />
      </main>
      <Footer />
    </>
  )
}
