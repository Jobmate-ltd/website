import { randomUUID } from "node:crypto";
import { leadSchema, isDisposableEmail } from "@/lib/toolkit/schema";
import { createDownloadToken } from "@/lib/toolkit/token";
import { deliverLead, toStoredLead } from "@/lib/toolkit/leads";
import { rateLimit, clientIp } from "@/lib/toolkit/rate-limit";

export const runtime = "nodejs";           // needs node:crypto and node:fs
export const dynamic = "force-dynamic";

export interface ToolkitSuccess {
  ok: true;
  downloadUrl: string;
  firstName: string;
}

export interface ToolkitFailure {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string>;
}

function json(body: ToolkitSuccess | ToolkitFailure, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request.headers);

  const limit = rateLimit(`toolkit:${ip}`, 8, 60 * 60 * 1000);
  if (!limit.allowed) {
    return json(
      { ok: false, message: "Too many requests. Try again in a little while." },
      {
        status: 429,
        headers: { "retry-after": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot is a bot. Answer with the same shape a human gets for a
    // generic failure, so it learns nothing, and never touch the CRM.
    if (fieldErrors.companyWebsite) {
      return json({ ok: false, message: "Something went wrong. Please try again." }, { status: 400 });
    }
    return json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  if (isDisposableEmail(lead.email)) {
    return json(
      {
        ok: false,
        message: "Please use a permanent email address.",
        fieldErrors: { email: "Please use a permanent email address" },
      },
      { status: 422 },
    );
  }

  const stored = toStoredLead(lead, {
    id: randomUUID(),
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
    referer: request.headers.get("referer") ?? undefined,
  });

  // Delivery must never block the download. If the CRM is down, the lead is in
  // the server log and the user still gets the PDF they were promised.
  const report = await deliverLead(stored);
  if (Object.values(report).every((result) => result !== "ok")) {
    console.warn("[toolkit] no sink accepted lead", stored.id, report);
  }

  return json({
    ok: true,
    downloadUrl: `/api/toolkit/download?t=${encodeURIComponent(createDownloadToken(lead.email))}`,
    firstName: lead.fullName.split(" ")[0],
  });
}

export function GET(): Response {
  return json({ ok: false, message: "Method not allowed." }, { status: 405 });
}
