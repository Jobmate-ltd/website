'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * NewsletterSignup — the footer form: one email field and a join button.
 * Posts to /api/newsletter, which adds the address to the Brevo list. Full
 * state cycle: idle, submitting, success (the form is replaced) and error.
 */
type Status = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterSignup() {
  const [status, setStatus] = React.useState<Status>('idle')
  const [error, setError] = React.useState('')
  const id = React.useId()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    const data = new FormData(event.currentTarget)
    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: String(data.get('email') ?? ''), company: String(data.get('company') ?? '') }),
      })
      const body = (await res.json()) as { ok: boolean; message: string }
      if (body.ok) setStatus('success')
      else {
        setStatus('error')
        setError(body.message)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again in a moment.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex items-center gap-3 rounded-control border border-line-1 bg-canvas px-4 py-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-good-tint text-good-text">
          <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="text-sm text-ink-1">You are on the list. See you in your inbox.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.co.uk"
          aria-invalid={status === 'error' || undefined}
          aria-describedby={status === 'error' ? `${id}-error` : `${id}-note`}
          className="min-h-11 min-w-0 flex-1 rounded-control border border-line-1 bg-canvas px-4 text-sm text-ink-1 placeholder:text-ink-5 focus:border-brand focus:outline-none"
        />
        {/* Honeypot: visually removed, ignored by screen readers and tab order. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0" />
        <Button type="submit" variant="dark" size="md" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Joining…' : 'Join'}
        </Button>
      </div>
      {status === 'error' ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-critical-text">
          {error}
        </p>
      ) : null}
      <p id={`${id}-note`} className="text-xs text-ink-5">
        One email a week. Unsubscribe any time.{' '}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ink-1">
          Privacy policy
        </Link>
      </p>
    </form>
  )
}

export default NewsletterSignup
