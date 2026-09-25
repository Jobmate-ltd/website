import { appendToFile, emailConfigured, escapeHtml, postWebhook, sendEmail } from '../toolkit/leads.ts'
import { isWorkEmail, type DemoLead } from './schema.ts'

/**
 * Demo requests go to the same sinks as toolkit leads (lib/toolkit/leads.ts):
 * the CRM webhook (LEADS_WEBHOOK_URL), the JSONL file (LEADS_FILE) and a
 * sales notification (LEADS_NOTIFY_EMAIL via SendGrid or Resend). Nothing here
 * throws: a broken sink must never cost the visitor their confirmation.
 */
export interface StoredDemoLead extends Omit<DemoLead, 'companyWebsite'> {
  readonly kind: 'demo'
  readonly id: string
  readonly createdAt: string
  readonly workEmail: boolean
  readonly ip: string
  readonly userAgent: string | null
  readonly referer: string | null
}

export interface DemoDeliveryReport {
  webhook: 'ok' | 'skipped' | 'failed'
  file: 'ok' | 'skipped' | 'failed'
  notification: 'ok' | 'skipped' | 'failed'
}

export function toStoredDemoLead(lead: DemoLead, meta: { id: string; ip: string; userAgent: string | null; referer: string | null }): StoredDemoLead {
  const { companyWebsite: _honeypot, ...rest } = lead
  void _honeypot
  return {
    kind: 'demo',
    id: meta.id,
    createdAt: new Date().toISOString(),
    workEmail: isWorkEmail(lead.email),
    ip: meta.ip,
    userAgent: meta.userAgent,
    referer: meta.referer,
    ...rest,
  }
}

export async function deliverDemoLead(lead: StoredDemoLead): Promise<DemoDeliveryReport> {
  const [webhook, file, notification] = await Promise.all([postWebhook(lead), appendToFile(lead), notifySales(lead)])
  return { webhook, file, notification }
}

async function notifySales(lead: StoredDemoLead): Promise<DemoDeliveryReport['notification']> {
  const to = process.env.LEADS_NOTIFY_EMAIL
  const from = process.env.TOOLKIT_FROM_EMAIL
  if (!emailConfigured() || !to || !from) return 'skipped'
  const rows: Array<[string, string]> = [
    ['Name', lead.fullName],
    ['Email', lead.email],
    ['Company', lead.company],
    ['Team size', lead.teamSize],
    ['Main need', lead.need],
    ['Notes', lead.notes || '-'],
    ['Work email', lead.workEmail ? 'yes' : 'no (free-mail domain)'],
    ['Marketing consent', lead.marketingConsent ? 'yes' : 'no'],
    ['Page', lead.path ?? '-'],
    ['Campaign', lead.utm?.campaign ?? '-'],
    ['Source / medium', `${lead.utm?.source ?? '-'} / ${lead.utm?.medium ?? '-'}`],
    ['Referer', lead.referer ?? '-'],
    ['Requested at', lead.createdAt],
  ]
  const sent = await sendEmail({
    from,
    to: [to],
    subject: `Demo request: ${lead.fullName} (${lead.company}, ${lead.teamSize})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: `<h2 style="font:700 18px system-ui;margin:0 0 12px">New demo request</h2>
<table style="font:14px system-ui;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;opacity:.7">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join('')}
</table>`,
  })
  return sent ? 'ok' : 'failed'
}
