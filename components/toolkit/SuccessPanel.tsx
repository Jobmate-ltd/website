"use client";

import { CheckCircle2, Download } from "lucide-react";

interface Props {
  firstName: string;
  downloadUrl: string;
}

/**
 * The moment of highest intent on the whole page. They have the toolkit, they
 * trust us enough to have typed their name, and they are still looking at the
 * screen. So this is where the sign-up ask goes, not in the hero.
 */
export function SuccessPanel({ firstName, downloadUrl }: Props) {
  return (
    <div className="tk-swap rounded-lg bg-[var(--tk-ink-raised)] p-6 ring-1 ring-white/10 sm:p-8">
      <div className="tk-hazard h-[6px] w-16 rounded-[1px]" aria-hidden="true" />

      <p
        role="status"
        className="mt-5 flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[var(--tk-crimson)]"
      >
        <CheckCircle2 size={18} aria-hidden="true" />
        Download started
      </p>

      <h2 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight">
        It is on its way, {firstName}.
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--tk-muted)]">
        Nothing happened?{" "}
        <a
          href={downloadUrl}
          className="font-bold text-[var(--tk-paper)] underline decoration-[var(--tk-crimson)] underline-offset-4"
        >
          Download it again
        </a>
        . The link works for the next 15 minutes.
      </p>

      <div className="mt-8 border-t border-[var(--tk-ink-line)] pt-8">
        <h3 className="text-[19px] font-extrabold leading-snug tracking-tight">
          The template works. Paper is what breaks it.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--tk-muted)]">
          A form on a clipboard gets filled in “later”, and later never comes. jobsafe records the
          same report in about 30 seconds on a phone, routes it, and tracks it to close-out.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-[var(--tk-ink-line)] py-5">
          {[
            ["£3", "per licence / mo"],
            ["Days", "to go live"],
            ["30 sec", "to file a report"],
          ].map(([big, small]) => (
            <div key={big}>
              <dt className="text-[20px] font-extrabold leading-none">{big}</dt>
              <dd className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--tk-muted)]">
                {small}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href="https://app.jobsafe.cloud/signup-trial"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--tk-crimson)] px-7 py-4 text-[15px] font-extrabold whitespace-nowrap text-[var(--tk-paper)] transition-transform duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985]"
        >
          Start free
        </a>
        <p className="mt-3 text-center text-[13px] font-bold text-[var(--tk-paper)]">
          First 200 sign-ups get 6 months free.
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--tk-ink-line)] pt-6 text-[14px] sm:flex-row sm:items-center sm:justify-between">
          <a
            href="tel:03338000883"
            className="font-bold text-[var(--tk-paper)] underline decoration-[var(--tk-ink-line)] underline-offset-4 hover:decoration-[var(--tk-crimson)]"
          >
            Book a demo: 0333 8000 883
          </a>
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 text-[var(--tk-muted)] hover:text-[var(--tk-paper)]"
          >
            <Download size={16} aria-hidden="true" />
            Save the toolkit again
          </a>
        </div>
      </div>
    </div>
  );
}
