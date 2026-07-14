'use client'

/**
 * Footer newsletter form: one email field and a join button in a single pill.
 * Posts to /api/newsletter, which adds the address to the Brevo list the
 * weekly campaign sends to. Full state cycle: idle, submitting, success
 * (form is replaced by confirmation) and inline error.
 */

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('submitting')
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          company: String(data.get('company') ?? ''),
        }),
      })
      const body = (await res.json()) as { ok: boolean; message: string }
      if (body.ok) {
        setStatus('success')
      } else {
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
      <div role="status" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <CheckIcon />
        </span>
        <p className="text-sm text-white">
          You&apos;re on the list. See you in your inbox.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-5 transition-colors focus-within:border-brand/50">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.co.uk"
            aria-invalid={status === 'error' || undefined}
            aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          {/* Honeypot: visually removed, ignored by screen readers and tab order. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 overflow-hidden opacity-0"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-bold whitespace-nowrap text-white transition hover:bg-brand-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Joining…' : 'Join'}
          </button>
        </div>

        {status === 'error' && (
          <p id="newsletter-error" role="alert" className="mt-2.5 pl-5 text-sm font-medium text-brand">
            {error}
          </p>
        )}
      </form>

      <p className="mt-3 pl-5 text-xs text-white/40">
        One email a week. Unsubscribe any time.{' '}
        <a href="/privacy-policy" className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white/70">
          Privacy policy
        </a>
      </p>
    </div>
  )
}
