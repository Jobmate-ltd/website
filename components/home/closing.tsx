import { ChartLine, ShieldCheck, Smartphone, Users } from 'lucide-react'
import { DEMO_DURATION_LABEL, PHONE_DISPLAY, PHONE_HREF, SIGNUP_TRIAL_URL } from '@/lib/brand'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Card } from '@/components/ui/card'

/**
 * The closing conversion section: leads on the calendar and says what the
 * half hour is actually made of, because the objection to a demo is never the
 * demo, it is not knowing what the call costs you.
 */
const AGENDA = [
  { icon: <Smartphone />, title: 'A report, filed live', body: 'An incident and a near miss captured on a phone, with no signal.' },
  { icon: <ChartLine />, title: 'The dashboard behind it', body: 'Reports by category, the site breakdown, and the twelve-week trend.' },
  { icon: <ShieldCheck />, title: 'The audit trail', body: 'The record an insurer, a client or the HSE would be handed.' },
  { icon: <Users />, title: 'Rollout, realistically', body: 'Your sites, your supervisors, and how the first week is set up.' },
] as const

export function Closing() {
  return (
    <Section id="get-started" divider>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SectionHeading
            eyebrow="Book a demo"
            title={
              <>
                See it running on
                <br />
                your own sites
              </>
            }
            lead={`Book ${DEMO_DURATION_LABEL} with someone who knows the product. We walk a real report end to end, then show you the dashboard and the audit trail sitting behind it.`}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookDemoButton placement="home-closing" size="lg" />
            <Button variant="secondary" size="lg" asChild>
              <a href={SIGNUP_TRIAL_URL}>Sign up now</a>
            </Button>
          </div>
          <p className="type-small text-ink-5">
            No slide deck, no obligation. Pick a slot that suits your day, or call{' '}
            <a href={PHONE_HREF} className="font-semibold text-ink-3 underline decoration-line-1 underline-offset-4 hover:text-ink-1 hover:decoration-brand-strong">
              {PHONE_DISPLAY}
            </a>{' '}
            if you would rather talk now.
          </p>
        </div>
        <Card className="p-2 lg:col-span-7">
          <p className="px-4 pb-4 pt-3 text-sm font-bold text-ink-1">What the call covers</p>
          <ul className="grid gap-px overflow-hidden rounded-control bg-line-1 sm:grid-cols-2">
            {AGENDA.map((item) => (
              <li key={item.title} className="bg-canvas p-5">
                <span aria-hidden="true" className="mb-4 flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">
                  {item.icon}
                </span>
                <p className="text-[15px] font-bold text-ink-1">{item.title}</p>
                <p className="type-small mt-1 text-ink-5">{item.body}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  )
}

export default Closing
