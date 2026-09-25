'use client'

import * as React from 'react'
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { DEMO_BOOKING_URL } from '@/lib/brand'
import { NEEDS, TEAM_SIZES } from '@/lib/demo/schema'
import { track } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * DemoForm — the short form under the booking link on /demo: name, work
 * email, company, team size, main need. Posts to /api/demo (server-side
 * validation, honeypot, rate limit, the same lead sinks as the toolkit).
 * On success it says what happens next and offers the calendar again.
 * Fires `lead_form_submitted` after a successful post.
 */
type FieldErrors = Partial<Record<'fullName' | 'email' | 'company' | 'teamSize' | 'need' | 'notes', string>>

function readUtm(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['source', 'medium', 'campaign', 'content']) {
    const value = params.get(`utm_${key}`)
    if (value) utm[key] = value.slice(0, 80)
  }
  return Object.keys(utm).length > 0 ? utm : undefined
}

const inputClass = (error?: string) =>
  `min-h-11 w-full rounded-control border bg-canvas px-4 text-[15px] text-ink-1 placeholder:text-ink-5 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${error ? 'border-brand-strong' : 'border-line-1'}`

export function DemoForm() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'error' | 'done'>('idle')
  const [firstName, setFirstName] = React.useState('')
  const [formError, setFormError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const uid = React.useId()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setFormError(null)
    setFieldErrors({})
    const data = new FormData(event.currentTarget)
    const payload = {
      fullName: String(data.get('fullName') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      teamSize: String(data.get('teamSize') ?? ''),
      need: String(data.get('need') ?? ''),
      notes: String(data.get('notes') ?? ''),
      marketingConsent: data.get('marketingConsent') === 'on',
      companyWebsite: String(data.get('companyWebsite') ?? ''),
      utm: readUtm(),
      path: window.location.pathname,
    }
    try {
      const res = await fetch('/api/demo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await res.json()
      if (!res.ok || !body?.ok) {
        setStatus('error')
        setFieldErrors(body?.fieldErrors ?? {})
        setFormError(body?.message ?? 'Something went wrong. Please try again.')
        return
      }
      setFirstName(body.firstName)
      setStatus('done')
      track('lead_form_submitted', { form: 'demo', team_size: payload.teamSize, need: payload.need })
    } catch {
      setStatus('error')
      setFormError('We could not reach the server. Check your connection and try again.')
    }
  }

  if (status === 'done') {
    return (
      <Card className="flex flex-col gap-4 p-6 sm:p-8" role="status">
        <span className="flex size-10 items-center justify-center rounded-pill bg-good-tint text-good-text">
          <CircleCheck className="size-5" aria-hidden="true" />
        </span>
        <h2 className="type-h3 text-ink-1">Thanks{firstName ? `, ${firstName}` : ''}. We have it.</h2>
        <p className="type-body text-ink-4">Someone who knows the product will reply within one working day with two or three times. If you would rather pick a slot now, the calendar is open.</p>
        <BookDemoButton placement="demo-form-success" size="lg" className="sm:w-max" />
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      <div aria-hidden="true" className="h-1 w-16 bg-brand" />
      <h2 className="type-h3 mt-5 text-ink-1">Or tell us a little first</h2>
      <p className="type-small mt-2 text-ink-5">Five fields. We reply within one working day with times, or you can <a href={DEMO_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-strong hover:underline">pick a slot now<span className="sr-only"> (opens in a new tab)</span></a>.</p>

      <form onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-name`} className="text-[13px] font-bold text-ink-1">
            Full name
          </label>
          <input id={`${uid}-name`} name="fullName" required autoComplete="name" placeholder="Alex Whitfield" aria-invalid={fieldErrors.fullName ? true : undefined} aria-describedby={fieldErrors.fullName ? `${uid}-name-error` : undefined} className={inputClass(fieldErrors.fullName)} />
          {fieldErrors.fullName ? <p id={`${uid}-name-error`} className="text-[12.5px] font-semibold text-critical-text">{fieldErrors.fullName}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-email`} className="text-[13px] font-bold text-ink-1">
            Work email
          </label>
          <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder="alex@yourcompany.co.uk" aria-invalid={fieldErrors.email ? true : undefined} aria-describedby={fieldErrors.email ? `${uid}-email-error` : undefined} className={inputClass(fieldErrors.email)} />
          {fieldErrors.email ? <p id={`${uid}-email-error`} className="text-[12.5px] font-semibold text-critical-text">{fieldErrors.email}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-company`} className="text-[13px] font-bold text-ink-1">
            Company
          </label>
          <input id={`${uid}-company`} name="company" required autoComplete="organization" placeholder="Whitfield Haulage" aria-invalid={fieldErrors.company ? true : undefined} aria-describedby={fieldErrors.company ? `${uid}-company-error` : undefined} className={inputClass(fieldErrors.company)} />
          {fieldErrors.company ? <p id={`${uid}-company-error`} className="text-[12.5px] font-semibold text-critical-text">{fieldErrors.company}</p> : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-size`} className="text-[13px] font-bold text-ink-1">
              Team size
            </label>
            <select id={`${uid}-size`} name="teamSize" required defaultValue="" aria-invalid={fieldErrors.teamSize ? true : undefined} className={inputClass(fieldErrors.teamSize)}>
              <option value="" disabled>
                Choose
              </option>
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} people
                </option>
              ))}
            </select>
            {fieldErrors.teamSize ? <p className="text-[12.5px] font-semibold text-critical-text">{fieldErrors.teamSize}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-need`} className="text-[13px] font-bold text-ink-1">
              Main need
            </label>
            <select id={`${uid}-need`} name="need" required defaultValue="" aria-invalid={fieldErrors.need ? true : undefined} className={inputClass(fieldErrors.need)}>
              <option value="" disabled>
                Choose
              </option>
              {NEEDS.map((need) => (
                <option key={need} value={need}>
                  {need}
                </option>
              ))}
            </select>
            {fieldErrors.need ? <p className="text-[12.5px] font-semibold text-critical-text">{fieldErrors.need}</p> : null}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-notes`} className="text-[13px] font-bold text-ink-1">
            Anything we should know <span className="font-normal text-ink-5">(optional)</span>
          </label>
          <textarea id={`${uid}-notes`} name="notes" rows={3} maxLength={600} placeholder="Four depots, mixed fleet, moving off a spreadsheet." className={`${inputClass(fieldErrors.notes)} py-3`} />
        </div>

        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Company website</label>
          <input id={`${uid}-website`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex cursor-pointer items-start gap-3 type-small text-ink-4">
          <input name="marketingConsent" type="checkbox" className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-strong" />
          <span>Send me the occasional plain-English safety email from jobsafe. No newsletters, no spam, unsubscribe in one click.</span>
        </label>

        {formError ? (
          <p role="alert" className="flex items-start gap-2 rounded-control bg-critical-tint px-4 py-3 text-sm font-semibold text-critical-text">
            <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
            {formError}
          </p>
        ) : null}

        <Button type="submit" variant="dark" size="lg" block disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            'Ask for times'
          )}
        </Button>
        <p className="text-xs leading-relaxed text-ink-5">We use your details to arrange the walkthrough and to follow up about jobsafe. You can ask us to delete them at any time.</p>
      </form>
    </Card>
  )
}

export default DemoForm
