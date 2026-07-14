"use client";

import { useId, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { SuccessPanel } from "./SuccessPanel";

type FieldErrors = Partial<Record<"fullName" | "email" | "company" | "phone", string>>;

interface Success {
  downloadUrl: string;
  firstName: string;
}

/** Pull campaign attribution off the URL so sales knows which post earned the lead. */
function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign", "content"]) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value.slice(0, 80);
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [success, setSuccess] = useState<Success | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setFormError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const payload = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      phone: String(data.get("phone") ?? ""),
      marketingConsent: data.get("marketingConsent") === "on",
      companyWebsite: String(data.get("companyWebsite") ?? ""), // honeypot
      utm: readUtm(),
    };

    try {
      const res = await fetch("/api/toolkit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok || !body?.ok) {
        setStatus("error");
        setFieldErrors(body?.fieldErrors ?? {});
        setFormError(body?.message ?? "Something went wrong. Please try again.");
        return;
      }

      // Instant delivery: kick the download off the moment the lead is captured.
      triggerDownload(body.downloadUrl);
      setSuccess({ downloadUrl: body.downloadUrl, firstName: body.firstName });
      setStatus("idle");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setFormError("We could not reach the server. Check your connection and try again.");
    }
  }

  if (success) {
    return <SuccessPanel firstName={success.firstName} downloadUrl={success.downloadUrl} />;
  }

  return (
    <div className="tk-swap rounded-lg bg-[var(--tk-ink-raised)] p-6 ring-1 ring-white/10 sm:p-8">
      <div className="tk-hazard h-[6px] w-16 rounded-[1px]" aria-hidden="true" />
      <h2 className="mt-5 text-[24px] font-extrabold leading-tight tracking-tight">
        Get the toolkit
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--tk-muted)]">
        The download starts as soon as you submit. No waiting for an email.
      </p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <Field
          id={`${uid}-name`}
          name="fullName"
          label="Full name"
          autoComplete="name"
          placeholder="Alex Whitfield"
          error={fieldErrors.fullName}
        />
        <Field
          id={`${uid}-email`}
          name="email"
          type="email"
          label="Work email"
          autoComplete="email"
          placeholder="alex@yourcompany.co.uk"
          error={fieldErrors.email}
        />
        <Field
          id={`${uid}-company`}
          name="company"
          label="Company"
          autoComplete="organization"
          placeholder="Whitfield Groundworks"
          error={fieldErrors.company}
        />
        <Field
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          label="Phone number"
          autoComplete="tel"
          placeholder="07700 900123"
          error={fieldErrors.phone}
        />

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Company website</label>
          <input
            id={`${uid}-website`}
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-[var(--tk-muted)]">
          <input
            name="marketingConsent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--tk-crimson)]"
          />
          <span>
            Send me the occasional plain-English safety email from jobsafe. No newsletters, no
            spam, unsubscribe in one click.
          </span>
        </label>

        {formError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-md bg-[var(--tk-crimson)]/15 px-4 py-3 text-[13px] font-bold text-[#FFB3B9]"
          >
            <AlertCircle size={18} className="mt-px shrink-0" aria-hidden="true" />
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-[var(--tk-crimson)] px-7 py-4 text-[15px] font-extrabold whitespace-nowrap text-[var(--tk-paper)] transition-transform duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Preparing your download
            </>
          ) : (
            "Download the toolkit"
          )}
        </button>

        <p className="text-[12px] leading-relaxed text-[var(--tk-muted)]">
          We use your details to send the toolkit and to follow up about jobsafe. You can ask us to
          delete them at any time.
        </p>
      </form>
    </div>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  error?: string;
}

function Field({ id, name, label, placeholder, autoComplete, type = "text", error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-extrabold text-[var(--tk-paper)]">
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
        className={`w-full rounded-md border bg-[#1c1c1c] px-4 py-3.5 text-[15px] text-[var(--tk-paper)] placeholder:text-[#7c7671] focus:border-[var(--tk-crimson)] focus:outline-none ${
          error ? "border-[var(--tk-crimson)]" : "border-[var(--tk-ink-line)]"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-[12.5px] font-bold text-[#FFB3B9]">
          {error}
        </p>
      )}
    </div>
  );
}

function triggerDownload(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  link.download = "jobsafe-incident-near-miss-toolkit.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
