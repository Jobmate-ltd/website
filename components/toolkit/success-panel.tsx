'use client'

import { CircleCheck, Download } from 'lucide-react'
import { ENTRY_PRICE_EX_VAT_LABEL, PHONE_DISPLAY, PHONE_HREF, SIGNUP_TRIAL_URL } from '@/lib/brand'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * SuccessPanel — the moment of highest intent on the whole page. They have
 * the toolkit, they trust us enough to have typed their name, and they are
 * still looking at the screen. So this is where the sign-up ask goes.
 */
export function SuccessPanel({ firstName, downloadUrl }: { firstName: string; downloadUrl: string }) {
  return (
    <Card className="p-6 sm:p-8">
      <div aria-hidden="true" className="h-1 w-16 bg-brand" />
      <p role="status" className="type-eyebrow mt-5 flex items-center gap-2 text-good-text">
        <CircleCheck className="size-4" aria-hidden="true" />
        Download started
      </p>
      <h2 className="type-h3 mt-3 text-ink-1">It is on its way, {firstName}.</h2>
      <p className="type-small mt-2 text-ink-5">
        Nothing happened?{' '}
        <a href={downloadUrl} className="font-semibold text-brand-strong underline underline-offset-4">
          Download it again
        </a>
        . The link works for the next 15 minutes.
      </p>

      <div className="mt-8 border-t border-line-1 pt-8">
        <h3 className="text-lg font-bold text-ink-1">The template works. Paper is what breaks it.</h3>
        <p className="type-small mt-2 text-ink-5">
          A form on a clipboard gets filled in &ldquo;later&rdquo;, and later never comes. jobsafe records the same report on a
          phone, routes it, and tracks it to close-out.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line-1 py-5">
          {[
            [ENTRY_PRICE_EX_VAT_LABEL, 'per licence per month'],
            ['Offline', 'works with no signal'],
            ['GPS', 'and timestamp on every report'],
          ].map(([big, small]) => (
            <div key={big}>
              <dt className="type-mono text-[17px] font-medium leading-none text-ink-1">{big}</dt>
              <dd className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-5">{small}</dd>
            </div>
          ))}
        </dl>

        <Button variant="primary" size="lg" block asChild className="mt-6">
          <a href={SIGNUP_TRIAL_URL}>Start your free trial</a>
        </Button>

        <div className="mt-6 flex flex-col gap-3 border-t border-line-1 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <BookDemoButton placement="toolkit-success" variant="link">
              Book a demo
            </BookDemoButton>
            <a href={PHONE_HREF} className="w-max text-[13px] text-ink-5 hover:text-ink-1">
              Or call {PHONE_DISPLAY}
            </a>
          </div>
          <a href={downloadUrl} className="inline-flex items-center gap-2 text-ink-4 hover:text-ink-1">
            <Download className="size-4" aria-hidden="true" />
            Save the toolkit again
          </a>
        </div>
      </div>
    </Card>
  )
}

export default SuccessPanel
