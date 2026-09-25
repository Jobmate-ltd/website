import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Database, Download, FileText, History, Lock, MapPin, Trash2, Users } from 'lucide-react'
import { EMAIL_PRIVACY, EMAIL_SUPPORT, HOSTING_DETAIL, PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, type FaqEntry } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { CtaBand } from '@/components/ui/cta-band'
import { FaqAccordion } from '@/components/platform/faq-accordion'

const PATH = '/security'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Security', href: PATH },
]

const ROLES = ['Admin', 'HSSE manager', 'Site manager', 'Supervisor', 'Operative', 'Contractor'] as const

const FAQS: readonly FaqEntry[] = [
  { q: 'Where exactly is our data?', a: `In the ${HOSTING_DETAIL}. It does not leave the UK region for storage or processing by jobsafe.` },
  { q: 'Can another customer see our records?', a: 'No. Each organisation is walled off by row-level security in the database and has its own private file storage. A query from one organisation cannot return another’s rows.' },
  { q: 'Can we get everything out?', a: 'Yes. Every register exports to CSV, so your records are yours to take at any time.' },
  { q: 'What happens when a record is deleted?', a: 'Deletes are soft: the record is marked deleted and kept, so an audit can still see what was there and who removed it.' },
  { q: 'Do you have a data processing agreement?', a: `Yes, on request from ${EMAIL_PRIVACY}. The sub-processors are listed in the privacy notice.` },
]

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
          eyebrow="Security and hosting"
          title={h1For(PATH)}
          lead="UK hosted health and safety software: where jobsafe keeps your records, who inside your organisation can see what, and how you get it all out."
          actions={<BookDemoButton placement="security-hero" size="lg" />}
        />

        <Section id="where" tone="white">
          <SectionHeading eyebrow="Where the data lives" title="London, and nowhere else" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Card className="flex flex-col gap-3 p-6">
              <MapPin className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">The London region</p>
              <p className="type-small text-ink-4">{HOSTING_DETAIL}. Storage and processing by jobsafe stay in the UK.</p>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <Lock className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">Each organisation walled off</p>
              <p className="type-small text-ink-4">Row-level security in the database: a query from your organisation can only ever return your organisation’s rows.</p>
            </Card>
            <Card className="flex flex-col gap-3 p-6">
              <Database className="size-6 text-brand" aria-hidden="true" />
              <p className="text-base font-bold text-ink-1">Private file storage</p>
              <p className="type-small text-ink-4">Photos, videos and PDFs sit in a private bucket per organisation, served only to signed-in members of it.</p>
            </Card>
          </div>
          <p className="type-small mt-6 text-ink-5">
            Data is encrypted in transit (TLS) and at rest by the hosting provider, which also takes the backups. The exact encryption and backup terms are those of the hosting plan; ask for the current statement before relying on it.
          </p>
        </Section>

        <Section id="access" tone="grey">
          <SectionHeading eyebrow="Access" title="Six role levels, and a history on every record" tone="grey" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-4">
              <p className="type-body text-ink-2">Who can open, edit, approve and close is decided by role, not by asking nicely. The six levels:</p>
              <ul className="flex flex-wrap gap-2" aria-label="Role levels">
                {ROLES.map((role, i) => (
                  <li key={role}>
                    <Chip status={i < 2 ? 'brand' : 'outline'}>{role}</Chip>
                  </li>
                ))}
              </ul>
              <p className="type-small text-ink-5">Contractor is a role level of its own, so a contractor sees the permit and the site they are on, not your registers.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: <History />, title: 'Per-record history', body: 'Who changed what and when, on every record.' },
                { icon: <Trash2 />, title: 'Soft deletes', body: 'Nothing vanishes; a deleted record is marked and kept.' },
                { icon: <Users />, title: 'Roles and multi-site', body: 'Sites and depots with their own people; role decides what each sees.' },
                { icon: <Download />, title: 'CSV export', body: 'Every register exports, with the filters you applied.' },
              ].map((item) => (
                <li key={item.title}>
                  <Card className="flex h-full flex-col gap-2 p-5">
                    <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{item.icon}</span>
                    <p className="text-base font-bold text-ink-1">{item.title}</p>
                    <p className="type-small text-ink-4">{item.body}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="certifications" tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="Certifications" title="Only what is held" />
            <Card className="flex flex-col gap-3 p-6 md:p-8">
              <p className="type-body text-ink-2">This page lists a certification only once it is held. None is listed today; that line changes the day one is.</p>
              <p className="type-small text-ink-5">
                Ask <a href={`mailto:${EMAIL_SUPPORT}`} className="font-semibold text-brand-strong hover:underline">{EMAIL_SUPPORT}</a> for the current position, and for a security questionnaire to be completed.
              </p>
            </Card>
          </div>
        </Section>

        <Section id="documents" tone="grey">
          <SectionHeading eyebrow="Documents" title="What you can ask for, and where it is" tone="grey" />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <FileText />, title: 'Data processing agreement', body: `On request from ${EMAIL_PRIVACY}.`, href: `mailto:${EMAIL_PRIVACY}` },
              { icon: <Users />, title: 'Sub-processors', body: 'Listed in the privacy notice.', href: '/privacy-policy' },
              { icon: <FileText />, title: 'Privacy notice', body: 'What is collected, why, and for how long.', href: '/privacy-policy' },
              { icon: <Lock />, title: 'Security contact', body: `Report a concern to ${EMAIL_SUPPORT}.`, href: `mailto:${EMAIL_SUPPORT}` },
            ].map((doc) => (
              <li key={doc.title}>
                {doc.href.startsWith('/') ? (
                  <Link href={doc.href} className="flex h-full flex-col gap-2 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="text-brand [&>svg]:size-5">{doc.icon}</span>
                    <span className="text-base font-bold text-ink-1">{doc.title}</span>
                    <span className="type-small text-ink-4">{doc.body}</span>
                  </Link>
                ) : (
                  <a href={doc.href} className="flex h-full flex-col gap-2 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="text-brand [&>svg]:size-5">{doc.icon}</span>
                    <span className="text-base font-bold text-ink-1">{doc.title}</span>
                    <span className="type-small text-ink-4">{doc.body}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="type-small mt-8 text-ink-5">
            Related: <Link href="/platform/offline" className="font-semibold text-brand-strong hover:underline">how offline records reach the cloud</Link> ·{' '}
            <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">pricing</Link> ·{' '}
            <Link href="/contact" className="font-semibold text-brand-strong hover:underline">contact</Link>
          </p>
        </Section>

        <FaqAccordion items={FAQS} tone="white" lead="The questions an IT lead asks before sign-off." />
        <CtaBand tone="grey" placement="security-closing" title="Bring your IT lead to the demo." copy="Thirty minutes, and we will answer the security questionnaire on the call." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}
