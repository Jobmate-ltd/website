'use client'

import * as React from 'react'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { SuccessPanel } from '@/components/toolkit/success-panel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * LeadForm — the toolkit gate: name, work email, company, phone. Posts to
 * /api/toolkit, which returns a signed download URL; the download starts the
 * moment the lead is captured.
 */
type FieldErrors = Partial<Record<'fullName' | 'email' | 'company' | 'phone', string>>

interface Success {
  downloadUrl: string
  firstName: string
}

/** Pull campaign attribution off the URL so sales knows which post earned the lead. */
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

function triggerDownload(url: string) {
  const link = document.createElement('a')
  link.href = url
  link.rel = 'noopener'
  link.download = 'jobsafe-incident-near-miss-toolkit.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function LeadForm() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'error'>('idle')
  const [success, setSuccess] = React.useState<Success | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const formRef = React.useRef<HTMLFormElement>(null)
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
      phone: String(data.get('phone') ?? ''),
      marketingConsent: data.get('marketingConsent') === 'on',
      companyWebsite: String(data.get('companyWebsite') ?? ''), // honeypot
      utm: readUtm(),
    }

    try {
      const res = await fetch('/api/toolkit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await res.json()
      if (!res.ok || !body?.ok) {
        setStatus('error')
        setFieldErrors(body?.fieldErrors ?? {})
        setFormError(body?.message ?? 'Something went wrong. Please try again.')
        return
      }
      triggerDownload(body.downloadUrl)
      setSuccess({ downloadUrl: body.downloadUrl, firstName: body.firstName })
      setStatus('idle')
      formRef.current?.reset()
    } catch {
      setStatus('error')
      setFormError('We could not reach the server. Check your connection and try again.')
    }
  }

  if (success) return <SuccessPanel firstName={success.firstName} downloadUrl={success.downloadUrl} />

  return (
    <Card className="p-6 sm:p-8">
      <div aria-hidden="true" className="h-1 w-16 bg-brand" />
      <h2 className="type-h3 mt-5 text-ink-1">Get the toolkit</h2>
      <p className="type-small mt-2 text-ink-5">The download starts as soon as you submit. No waiting for an email.</p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <Field id={`${uid}-name`} name="fullName" label="Full name" autoComplete="name" placeholder="Alex Whitfield" error={fieldErrors.fullName} />
        <Field id={`${uid}-email`} name="email" type="email" label="Work email" autoComplete="email" placeholder="alex@yourcompany.co.uk" error={fieldErrors.email} />
        <Field id={`${uid}-company`} name="company" label="Company" autoComplete="organization" placeholder="Whitfield Groundworks" error={fieldErrors.company} />
        <Field id={`${uid}-phone`} name="phone" type="tel" label="Phone number" autoComplete="tel" placeholder="07700 900123" error={fieldErrors.phone} />

        {/* Honeypot. Hidden from people, irresistible to bots. */}
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

        <Button type="submit" variant="primary" size="lg" block disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Preparing your download
            </>
          ) : (
            'Download the toolkit'
          )}
        </Button>

        <p className="text-xs leading-relaxed text-ink-5">
          We use your details to send the toolkit and to follow up about jobsafe. You can ask us to delete them at any time.
        </p>
      </form>
    </Card>
  )
}

interface FieldProps {
  id: string
  name: string
  label: string
  placeholder: string
  autoComplete: string
  type?: string
  error?: string
}

function Field({ id, name, label, placeholder, autoComplete, type = 'text', error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-bold text-ink-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full rounded-control border bg-canvas px-4 text-[15px] text-ink-1 placeholder:text-ink-5 focus:border-brand focus:outline-none ${error ? 'border-brand-strong' : 'border-line-1'}`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[12.5px] font-semibold text-critical-text">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default LeadForm
