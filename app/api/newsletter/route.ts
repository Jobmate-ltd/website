import { z } from 'zod'
import { subscribe } from '@/lib/newsletter'
import { isDisposableEmail } from '@/lib/toolkit/schema'
import { rateLimit, clientIp } from '@/lib/toolkit/rate-limit'
import { EMAIL_SALES } from '@/lib/brand'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export interface NewsletterResponse {
  ok: boolean
  message: string
}

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, 'Please enter your email address')
    .max(160, 'That email is too long')
    .email('That does not look like a valid email'),
  // Honeypot: named like a real field so bots fill it; humans never see it.
  company: z.string().max(0).optional().default(''),
})

function json(body: NewsletterResponse, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request.headers)

  const limit = rateLimit(`newsletter:${ip}`, 6, 60 * 60 * 1000)
  if (!limit.allowed) {
    return json(
      { ok: false, message: 'Too many attempts. Try again in a little while.' },
      {
        status: 429,
        headers: { 'retry-after': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, message: 'Malformed request.' }, { status: 400 })
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    // A filled honeypot gets the same generic answer a human gets, so the bot
    // learns nothing; either way the address never reaches Brevo.
    const honeypot = parsed.error.issues.some((issue) => issue.path[0] === 'company')
    return json(
      {
        ok: false,
        message: honeypot
          ? 'Something went wrong. Please try again.'
          : parsed.error.issues[0]?.message ?? 'Please check your email address.',
      },
      { status: honeypot ? 400 : 422 },
    )
  }

  if (isDisposableEmail(parsed.data.email)) {
    return json(
      { ok: false, message: 'Please use a permanent email address.' },
      { status: 422 },
    )
  }

  const result = await subscribe(parsed.data.email)

  if (result === 'unconfigured') {
    // Honest failure beats silently dropping the address: without the Brevo
    // keys nothing is stored, and pretending otherwise breaks the promise.
    return json(
      { ok: false, message: `Sign-up is not available right now. Email ${EMAIL_SALES} and we will add you.` },
      { status: 503 },
    )
  }
  if (result === 'failed') {
    return json(
      { ok: false, message: 'Something went wrong. Please try again in a moment.' },
      { status: 502 },
    )
  }

  return json({ ok: true, message: 'You are on the list.' })
}

export function GET(): Response {
  return json({ ok: false, message: 'Method not allowed.' }, { status: 405 })
}
