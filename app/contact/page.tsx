import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ADDRESS, EMAIL_SALES, EMAIL_SUPPORT, LEGAL_NAME, PHONE_DISPLAY, PHONE_HREF, PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Button } from '@/components/ui/button'

const PATH = '/contact'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: PATH },
]

/** Matches S7 of the terms: support cover is 09:00–17:00 UK time on weekdays, excluding public holidays. */
const SUPPORT_HOURS = '09:00–17:00 UK time, Monday to Friday, excluding public holidays'

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  const schema = jsonLd(graph(breadcrumbSchema(breadcrumbsFromTrail(CRUMBS))))
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="Contact"
          title={h1For(PATH)}
          lead="Contact jobsafe sales or support by email or phone. If you would rather see the product than talk about it, book a 30-minute walkthrough."
          actions={
            <>
              <BookDemoButton placement="contact-hero" size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="/demo">How the demo works</Link>
              </Button>
            </>
          }
        />
        <Section tone="white">
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="flex flex-col gap-3 p-6">
              <Mail className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">Sales</p>
              <p className="type-small text-ink-4">Pricing, a quote for your team size, a demo on your own sites.</p>
              <a href={`mailto:${EMAIL_SALES}`} className="font-bold text-brand-strong hover:underline">
                {EMAIL_SALES}
              </a>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <Mail className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">Support</p>
              <p className="type-small text-ink-4">Anything in the product, data requests and security questions.</p>
              <a href={`mailto:${EMAIL_SUPPORT}`} className="font-bold text-brand-strong hover:underline">
                {EMAIL_SUPPORT}
              </a>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <Phone className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">Phone</p>
              <a href={PHONE_HREF} className="type-mono text-lg font-medium text-ink-1 hover:text-brand-strong">
                {PHONE_DISPLAY}
              </a>
              <p className="type-small flex items-center gap-2 text-ink-5">
                <Clock className="size-3.5" aria-hidden="true" />
                Support hours: {SUPPORT_HOURS}
              </p>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <MapPin className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">{LEGAL_NAME}</p>
              <address className="type-small not-italic text-ink-4">
                {ADDRESS.streetAddress}
                <br />
                {ADDRESS.addressLocality}
                <br />
                {ADDRESS.postalCode}
                <br />
                United Kingdom
              </address>
            </Card>
          </div>
          <p className="type-small mt-8 text-ink-5">
            Security and hosting questions are answered on the <Link href="/security" className="font-semibold text-brand-strong hover:underline">security page</Link>; the company is described on the <Link href="/about" className="font-semibold text-brand-strong hover:underline">about page</Link>; prices are on the <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">pricing page</Link>.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  )
}
