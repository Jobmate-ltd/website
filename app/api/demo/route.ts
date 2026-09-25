import { randomUUID } from 'node:crypto'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { demoLeadSchema } from '@/lib/demo/schema'
import { deliverDemoLead, toStoredDemoLead } from '@/lib/demo/leads'
import { clientIp, rateLimit } from '@/lib/toolkit/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Success {
  ok: true
  firstName: string
}
interface Failure {
  ok: false
  message: string
  fieldErrors?: Record<string, string>
}

function json(body: Success | Failure, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), { ...init, headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) } })
}

/**
 * POST /api/demo — the /demo page's form. Server-side validation, a honeypot
 * that answers like a generic failure, a per-IP rate limit, then the same
 * lead sinks as the toolkit. Only live once the platform launch flag is on.
 */
export async function POST(request: Request): Promise<Response> {
  if (!PLATFORM_LAUNCH) return json({ ok: false, message: 'Not available.' }, { status: 404 })
  const ip = clientIp(request.headers)
  const limit = rateLimit(`demo:${ip}`, 6, 60 * 60 * 1000)
  if (!limit.allowed) {
    return json({ ok: false, message: 'Too many requests. Try again in a little while.' }, { status: 429, headers: { 'retry-after': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, message: 'Malformed request.' }, { status: 400 })
  }

  const parsed = demoLeadSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    if (fieldErrors.companyWebsite) {
      return json({ ok: false, message: 'Something went wrong. Please try again.' }, { status: 400 })
    }
    return json({ ok: false, message: 'Check the highlighted fields.', fieldErrors }, { status: 422 })
  }

  const lead = toStoredDemoLead(parsed.data, {
    id: randomUUID(),
    ip,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
  })
  const report = await deliverDemoLead(lead)
  console.info('[demo] lead', lead.id, report)
  return json({ ok: true, firstName: lead.fullName.split(' ')[0] })
}
