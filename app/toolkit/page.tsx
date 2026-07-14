import type { Metadata } from "next";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { LeadForm } from "@/components/toolkit/LeadForm";
import "@/styles/toolkit.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jobsafe.cloud";

export const metadata: Metadata = {
  title: "The Site Incident & Near-Miss Reporting Toolkit | jobsafe",
  description:
    "Free for UK construction: a ready-to-use incident and near-miss report template, the RIDDOR decision flowchart, and near-miss triage. Record. Resolve. Prevent.",
  alternates: { canonical: `${SITE}/toolkit` },
  openGraph: {
    type: "website",
    url: `${SITE}/toolkit`,
    siteName: "jobsafe",
    locale: "en_GB",
    title: "The Site Incident & Near-Miss Reporting Toolkit",
    description:
      "The report template, the RIDDOR flowchart, and near-miss triage. Free, for UK sites.",
    images: [
      {
        url: `${SITE}/toolkit/og-toolkit.png`,
        width: 1200,
        height: 630,
        alt: "The Site Incident & Near-Miss Reporting Toolkit, by jobsafe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JobmateCloud",
    title: "The Site Incident & Near-Miss Reporting Toolkit",
    description: "The report template, the RIDDOR flowchart, and near-miss triage. Free, for UK sites.",
    images: [`${SITE}/toolkit/og-toolkit.png`],
  },
};

const INSIDE = [
  {
    n: "01",
    title: "The report template",
    body: "Every field an investigator needs, and none they do not. Print it, or fill it on-screen.",
    image: "/toolkit/page-template.png",
    alt: "The incident and near-miss report template page from the toolkit",
  },
  {
    n: "02",
    title: "Is it RIDDOR-reportable?",
    body: "Four questions. The first “yes” tells you whether it goes to the HSE, and by when.",
    image: "/toolkit/page-flowchart.png",
    alt: "The RIDDOR decision flowchart page from the toolkit",
  },
  {
    n: "03",
    title: "Near-miss triage",
    body: "What to do in the first 24 hours, from making it safe to naming the owner of the fix.",
    image: "/toolkit/page-triage.png",
    alt: "The near-miss triage page from the toolkit",
  },
] as const;

export default function ToolkitPage() {
  return (
    <main
      className={`tk ${manrope.variable} min-h-[100dvh] bg-[var(--tk-ink)] font-[family-name:var(--font-manrope)] text-[var(--tk-paper)] antialiased`}
    >
      {/* Hero: message left, gate right. The form is the CTA, so there is no second one here. */}
      <section className="relative overflow-hidden border-b border-[var(--tk-ink-line)]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-14 px-5 pb-20 pt-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-20">
          <div className="min-w-0">
            <a
              href="/"
              className="inline-block rounded-md transition-opacity hover:opacity-80"
              aria-label="jobsafe home"
            >
              <Image
                src="/toolkit/jobsafe-lockup.png"
                alt="jobsafe"
                width={148}
                height={53}
                priority
              />
            </a>

            <p
              className="tk-rise mt-12 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--tk-crimson)]"
              style={{ ["--tk-i" as string]: 0 }}
            >
              Free toolkit · UK construction
            </p>

            <h1
              className="tk-rise mt-4 text-[40px] font-extrabold leading-[1.06] tracking-tight sm:text-[50px] lg:text-[56px]"
              style={{ ["--tk-i" as string]: 1 }}
            >
              Most near-misses
              <br />
              <span className="text-[var(--tk-crimson)]">never get written down.</span>
            </h1>

            <div
              className="tk-rise tk-hazard mt-7 h-[7px] w-[190px] rounded-[1px]"
              style={{ ["--tk-i" as string]: 2 }}
              aria-hidden="true"
            />

            <p
              className="tk-rise mt-7 max-w-[46ch] text-[17px] leading-relaxed text-[var(--tk-muted)]"
              style={{ ["--tk-i" as string]: 3 }}
            >
              This is the toolkit that fixes that. The report template, the RIDDOR flowchart, and
              near-miss triage.
            </p>

            <div
              className="tk-rise mt-10 hidden max-w-[430px] lg:block"
              style={{ ["--tk-i" as string]: 4 }}
            >
              <Image
                src="/toolkit/page-cover.png"
                alt="The cover of the Site Incident and Near-Miss Reporting Toolkit"
                width={430}
                height={608}
                className="w-[230px] rounded-sm shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10"
              />
            </div>
          </div>

          <div className="min-w-0 lg:pt-[86px]">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* What is inside: three real pages, not three identical text cards. */}
      <section className="border-b border-[var(--tk-ink-line)]">
        <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-8 lg:py-24">
          <h2 className="max-w-[20ch] text-[30px] font-extrabold leading-[1.1] tracking-tight sm:text-[36px]">
            Seven pages. Nothing you have to read twice.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {INSIDE.map((item) => (
              <article key={item.n} className="min-w-0">
                <div className="overflow-hidden rounded-sm bg-[var(--tk-ink-raised)] ring-1 ring-white/10">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={640}
                    height={905}
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-6 text-[13px] font-extrabold text-[var(--tk-crimson)]">{item.n}</p>
                <h3 className="mt-1 text-[19px] font-extrabold tracking-tight">{item.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-[var(--tk-muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-14 max-w-[62ch] border-l-2 border-[var(--tk-crimson)] pl-5 text-[14px] leading-relaxed text-[var(--tk-muted)]">
            Guidance for UK workplaces, not legal advice. RIDDOR thresholds and deadlines change, so
            always check the current guidance at{" "}
            <a
              href="https://www.hse.gov.uk/riddor/"
              className="font-bold text-[var(--tk-paper)] underline decoration-[var(--tk-crimson)] underline-offset-4"
              rel="noreferrer noopener"
              target="_blank"
            >
              hse.gov.uk/riddor
            </a>
            .
          </p>
        </div>
      </section>

      {/* The offer. Full-bleed crimson, the way the carousels end. */}
      <section className="relative overflow-hidden bg-[var(--tk-crimson)] text-[var(--tk-ink)]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <h2 className="text-[32px] font-extrabold leading-[1.06] tracking-tight sm:text-[42px]">
              Now do all of that
              <br />
              <span className="text-[var(--tk-paper)]">from your phone.</span>
            </h2>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-[var(--tk-paper)]">
              Same report, same detail, about 30 seconds. It routes itself to the right person and
              tracks to close-out, from £3 per licence a month.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://app.jobsafe.cloud/signup-trial"
                className="inline-flex items-center rounded-md bg-[var(--tk-ink)] px-7 py-3.5 text-[15px] font-extrabold text-[var(--tk-paper)] transition-transform duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985]"
              >
                Start free
              </a>
              <p className="text-[13px] font-bold text-[var(--tk-ink)]">
                First 200 sign-ups get 6 months free.
              </p>
            </div>
          </div>

          <Image
            src="/toolkit/jobsafe-phones.png"
            alt="The jobsafe app: the incident capture screen and the reporting dashboard"
            width={520}
            height={527}
            className="mx-auto w-full max-w-[360px]"
          />
        </div>
        <div className="tk-hazard h-[10px] w-full" aria-hidden="true" />
      </section>

      <footer className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-10 text-[13px] text-[var(--tk-muted)] md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-extrabold uppercase tracking-[0.14em] text-[var(--tk-paper)]">
          Record. Resolve. Prevent.
        </p>
        <p>
          Part of jobmate Group ·{" "}
          <a href="/privacy-policy" className="underline underline-offset-4 hover:text-[var(--tk-paper)]">
            Privacy policy
          </a>
        </p>
      </footer>
    </main>
  );
}
