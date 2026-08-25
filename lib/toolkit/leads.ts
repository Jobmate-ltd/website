import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Lead } from "./schema";
import { isWorkEmail } from "./schema";

export interface StoredLead extends Omit<Lead, "companyWebsite"> {
  id: string;
  createdAt: string;      // ISO 8601
  source: "toolkit-landing-page";
  workEmail: boolean;
  ip?: string;
  userAgent?: string;
  referer?: string;
}

export interface DeliveryReport {
  webhook: "ok" | "skipped" | "failed";
  file: "ok" | "skipped" | "failed";
  notification: "ok" | "skipped" | "failed";
  welcomeEmail: "ok" | "skipped" | "failed";
}

/**
 * Fan the lead out to every configured sink. Nothing here is allowed to throw:
 * a broken CRM webhook must never cost us the download the user just asked for.
 */
export async function deliverLead(lead: StoredLead): Promise<DeliveryReport> {
  const [webhook, file, notification, welcomeEmail] = await Promise.all([
    postWebhook(lead),
    appendToFile(lead),
    notifySales(lead),
    sendWelcomeEmail(lead),
  ]);
  return { webhook, file, notification, welcomeEmail };
}

/** 1. Forward to a CRM / Zapier / Make / n8n endpoint. */
async function postWebhook(lead: StoredLead): Promise<DeliveryReport["webhook"]> {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return "skipped";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEADS_WEBHOOK_SECRET
          ? { authorization: `Bearer ${process.env.LEADS_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok ? "ok" : "failed";
  } catch (err) {
    console.error("[toolkit] webhook failed", err);
    return "failed";
  }
}

/**
 * 2. Local JSONL fallback so a lead is never lost while the CRM is being wired up.
 * Note: serverless filesystems are ephemeral. This is a dev/self-host convenience,
 * not the system of record. Set LEADS_FILE to enable it.
 */
async function appendToFile(lead: StoredLead): Promise<DeliveryReport["file"]> {
  const target = process.env.LEADS_FILE;
  if (!target) return "skipped";
  try {
    await mkdir(path.dirname(target), { recursive: true });
    await appendFile(target, `${JSON.stringify(lead)}\n`, "utf8");
    return "ok";
  } catch (err) {
    console.error("[toolkit] file append failed", err);
    return "failed";
  }
}

/** 3. Tell sales, immediately, by email (SendGrid or Resend — whichever is set). */
async function notifySales(lead: StoredLead): Promise<DeliveryReport["notification"]> {
  const to = process.env.LEADS_NOTIFY_EMAIL;
  const from = process.env.TOOLKIT_FROM_EMAIL;
  if (!emailConfigured() || !to || !from) return "skipped";

  const rows: Array<[string, string]> = [
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Work email", lead.workEmail ? "yes" : "no (free-mail domain)"],
    ["Marketing consent", lead.marketingConsent ? "yes" : "no"],
    ["Campaign", lead.utm?.campaign ?? "-"],
    ["Source / medium", `${lead.utm?.source ?? "-"} / ${lead.utm?.medium ?? "-"}`],
    ["Referer", lead.referer ?? "-"],
    ["Downloaded at", lead.createdAt],
  ];

  const sent = await sendEmail({
    from,
    to: [to],
    subject: `Toolkit download: ${lead.fullName} (${lead.company})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<h2 style="font:700 18px system-ui;margin:0 0 12px">New toolkit download</h2>
<table style="font:14px system-ui;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6E6E6E">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join("")}
</table>`,
  });
  return sent ? "ok" : "failed";
}

/**
 * 4. Optional welcome email with a second copy of the toolkit link.
 * Off by default: delivery is instant-download, so this is a nurture touch,
 * not the gate. Turn on with TOOLKIT_SEND_WELCOME_EMAIL=true.
 */
async function sendWelcomeEmail(lead: StoredLead): Promise<DeliveryReport["welcomeEmail"]> {
  if (process.env.TOOLKIT_SEND_WELCOME_EMAIL !== "true") return "skipped";
  const from = process.env.TOOLKIT_FROM_EMAIL;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jobsafe.cloud";
  if (!emailConfigured() || !from) return "skipped";

  const firstName = lead.fullName.split(" ")[0];
  const sent = await sendEmail({
    from,
    to: [lead.email],
    subject: "Your Site Incident & Near-Miss Reporting Toolkit",
    text:
      `Hi ${firstName},\n\n` +
      `Thanks for downloading the Site Incident & Near-Miss Reporting Toolkit. ` +
      `If the download did not start, grab it again here: ${site}/toolkit\n\n` +
      `Two things worth doing this week:\n` +
      `1. Print the report template and put copies in the cabin.\n` +
      `2. Pin the RIDDOR flowchart next to the accident book.\n\n` +
      `When you are ready to stop doing this on paper, jobsafe records the same report in about 30 seconds ` +
      `on a phone, from £3 per licence a month: ${site}\n\n` +
      `Record. Resolve. Prevent.\nThe jobsafe team`,
  });
  return sent ? "ok" : "failed";
}

interface OutboundEmail {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

/** True when any email provider is configured. */
function emailConfigured(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
}

/**
 * Send one email through whichever provider is configured. SendGrid is tried
 * first because its single-sender verification needs no DNS at all (verify one
 * address by clicking a link); Resend is the fallback. Never throws — a failed
 * alert must never cost the download.
 */
async function sendEmail(email: OutboundEmail): Promise<boolean> {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) return sendViaSendGrid(sendgridKey, email);
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) return sendViaResend(resendKey, email);
  return false;
}

/** SendGrid v3 REST API. Verify a single sender (no DNS) and send from it. */
async function sendViaSendGrid(apiKey: string, email: OutboundEmail): Promise<boolean> {
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: email.to.map((address) => ({ email: address })) }],
        from: { email: email.from },
        subject: email.subject,
        // SendGrid requires plain text before html.
        content: [
          { type: "text/plain", value: email.text },
          ...(email.html ? [{ type: "text/html", value: email.html }] : []),
        ],
      }),
    });
    if (!res.ok) console.error("[toolkit] sendgrid failed", res.status, await res.text());
    return res.ok; // 202 Accepted on success
  } catch (err) {
    console.error("[toolkit] sendgrid threw", err);
    return false;
  }
}

/** Resend's REST API directly, so there is no SDK dependency in the bundle. */
async function sendViaResend(apiKey: string, email: OutboundEmail): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(email),
    });
    if (!res.ok) console.error("[toolkit] resend failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[toolkit] resend threw", err);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function toStoredLead(
  lead: Lead,
  meta: { id: string; ip?: string; userAgent?: string; referer?: string },
): StoredLead {
  return {
    id: meta.id,
    createdAt: new Date().toISOString(),
    source: "toolkit-landing-page",
    fullName: lead.fullName,
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    marketingConsent: lead.marketingConsent,
    workEmail: isWorkEmail(lead.email),
    utm: lead.utm,
    ip: meta.ip,
    userAgent: meta.userAgent,
    referer: meta.referer,
  };
}
