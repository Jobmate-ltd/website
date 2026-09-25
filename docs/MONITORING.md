# Monitoring the comparison pages

The three comparison pages (`/compare/mitti-safetyculture`, `/compare/evotix`, `/compare/ecoonline`) state facts about other companies' products. Under CAP Code section 3, rules 3.32 to 3.43 (https://www.asa.org.uk/type/non_broadcast/code_section/03.html), a comparison with an identifiable competitor must not mislead, must compare verifiable features and must not denigrate. A comparison that was true on 25/09/2026 stops being true the day the competitor changes its pricing page. So the pages we compare against are monitored, and a change on a monitored page triggers a re-check of the rows that page backs and a new "Last checked" date on the comparison page.

Every competitor fact lives in `lib/compare.ts`, one row at a time, each with `source.url`, `source.checked` (DD/MM/YYYY) and, where the page gives one, a verbatim `source.quote`. The page's `lastChecked` is the visible date at the top. This document lists what is monitored, what a change affects, how to re-check, and every source URL the pages cite.

## Status: monitors defined, not yet created

The monitors below are defined but **not yet created**. On 25/09/2026 the one permitted attempt to create the first of them with the Firecrawl MCP tool returned:

```
Insufficient credits to perform this request. For more credits, you can upgrade your plan at https://firecrawl.dev/pricing or try changing the request limit to a lower value.
```

This is the same response the researcher received on the same day. No retry was made. Until credits exist, the re-check falls back to the manual procedure below, run monthly and before any change to a comparison page.

## Monitors

Six monitors, weekly, change detection with diffs. Each watches one competitor page and names the row ids in `lib/compare.ts` that a change there would put in question.

| # | Competitor | Page | URL | Rows a change affects | Frequency | Status |
|---|---|---|---|---|---|---|
| 1 | Mitti (formerly SafetyCulture) | Pricing | https://mitti.com/pricing | `gbp-prices`, `vat`, `fleet`, `free-or-demo`, `implementation`, `ai`, `sso`, `integrations`, `lone-worker` | weekly | pending (no credits) |
| 2 | Mitti (formerly SafetyCulture) | Platform | https://mitti.com/platform | `permits`, `fleet`, `offline`, `lone-worker`, `coshh` | weekly | pending (no credits) |
| 3 | Evotix | Pricing request | https://www.evotix.com/pricing-request | `gbp-prices`, `vat`, `implementation`, `free-or-demo` | weekly | pending (no credits) |
| 4 | Evotix | Solutions | https://www.evotix.com/solutions | `permits`, `fleet`, `lone-worker`, `coshh`, `riddor`, `ai` | weekly | pending (no credits) |
| 5 | EcoOnline | EHS software | https://www.ecoonline.com/ehs-software/ | `gbp-prices`, `vat`, `permits`, `fleet`, `offline`, `sso`, `coshh`, `lone-worker` | weekly | pending (no credits) |
| 6 | EcoOnline | Certifications | https://www.ecoonline.com/certifications/ | `security`, `lone-worker` | weekly | pending (no credits) |

The `uk-hosting` rows are backed by the three sub-processor and data-residency pages (https://help.mitti.com/003569, https://www.evotix.com/en-subprocessor-policy, https://www.ecoonline.com/sub-processors/). They are not in the six monitors the brief asked for; re-check them by hand on the same schedule, or add three more monitors with the same call when credits allow.

### The exact tool calls to create them once credits exist

Tool: `mcp__Firecrawl__firecrawl_monitor_create` (load its schema first with ToolSearch `select:mcp__Firecrawl__firecrawl_monitor_create,mcp__Firecrawl__firecrawl_monitor_list`). One call per monitor; `firecrawl_monitor_list` afterwards to confirm all six exist and to record their ids here.

```json
{ "name": "jobsafe compare: Mitti pricing", "page": "https://mitti.com/pricing", "goal": "Detect any change to Mitti's plans, prices, currencies, tax wording, AI credits, SSO, integrations, lone worker or onboarding rows so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

```json
{ "name": "jobsafe compare: Mitti platform", "page": "https://mitti.com/platform", "goal": "Detect any change to the Mitti feature list (permits, assets and fleet, offline, lone worker, chemicals) so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

```json
{ "name": "jobsafe compare: Evotix pricing request", "page": "https://www.evotix.com/pricing-request", "goal": "Detect any change to Evotix pricing wording, published prices, currency, tax treatment, implementation fee or free plan so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

```json
{ "name": "jobsafe compare: Evotix solutions", "page": "https://www.evotix.com/solutions", "goal": "Detect any change to the Evotix solutions list (permit to work, asset management, lone worker, chemicals, incident management, EvoAI) so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

```json
{ "name": "jobsafe compare: EcoOnline EHS software", "page": "https://www.ecoonline.com/ehs-software/", "goal": "Detect any change to the EcoOnline EHS product list, pricing FAQ, permits, fleet, offline, SSO, COSHH or lone worker wording so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

```json
{ "name": "jobsafe compare: EcoOnline certifications", "page": "https://www.ecoonline.com/certifications/", "goal": "Detect any change to the certifications EcoOnline lists (ISO 9001, ISO 22301, ISO/IEC 27001, Cyber Essentials, BS 8484) so the jobsafe comparison page can be re-checked.", "scheduleText": "every week", "includeDiffs": true }
```

Optional, with the same shape: `https://help.mitti.com/003569`, `https://www.evotix.com/en-subprocessor-policy` and `https://www.ecoonline.com/sub-processors/` for the `uk-hosting` rows.

When a monitor fires it delivers a diff by the configured email or webhook. Route it to the person who owns the comparison pages; do not let it land in a shared inbox nobody reads.

## Re-check procedure

Run this when a monitor reports a change, monthly while the monitors are pending, and before any edit to a comparison page.

1. **Re-fetch the page** the monitor names, live, with no cache. Save the text alongside the date. Read the whole page, not the diff alone: a changed sentence can change the meaning of an unchanged one.
2. **Find the affected rows** in `lib/compare.ts` (the table above, or search the file for the URL). For each, ask: is `them` still true, word for word? Is `source.quote` still on the page, verbatim? Has the `edge` changed?
3. **Update the rows.** Change `them` and `quote` to what the page now says. Where a fact can no longer be verified, say the safer thing or remove it; never keep a claim on the strength of what the page used to say. Set `source.checked` on every row you re-verified (including rows that did not change) to the new date, DD/MM/YYYY.
4. **Move `lastChecked`** on the page to the same date. This is the visible "Last checked" line at the top of the page and the `<time>` element beside it.
5. **Keep the jobsafe side honest too.** If the product has shipped something since (see `PHASE_3_INPUTS` in `lib/brand.ts` and the `doNotClaim` lists in `lib/platform-modules*.ts`), update the `jobsafe` cell only from the product as it ships, never from a roadmap.
6. **Run the checks:**
   ```
   npm run typecheck
   npm run lint
   node scripts/seo-audit.mjs
   node scripts/claims-check.mjs
   node --test test/compare.test.mjs
   ```
   Then, against a build with `NEXT_PUBLIC_PLATFORM_LAUNCH=true NEXT_PUBLIC_COMPARE_PAGES=true`, `node scripts/claims-check.mjs --base http://localhost:3000 --compare on`, `node scripts/seo-check.mjs --flag on --compare on` and `node scripts/schema-check.mjs --flag on --compare on`.
7. **Regenerate the source list** at the end of this document (`node <scratchpad>/gen-monitoring-sources.mjs`, or any script that reads `COMPARE_PAGES` from `lib/compare.ts` and prints the table) and paste it in.
8. **Ship**, with the commit message naming the competitor, the rows changed and the new date.

If a competitor page disappears or redirects (as https://www.ecoonline.com/integrations/ and https://www.evotix.com/pricing already do), keep the row, cite the page that now carries the fact, and say in `them` what happened if it is relevant to the reader.

## Source URLs per page (generated from `lib/compare.ts`)

Regenerate with `node <scratchpad>/gen-monitoring-sources.mjs` after editing `lib/compare.ts`; do not hand-edit this section.

### /compare/mitti-safetyculture (last checked 25/09/2026)

| Row id | Source URL | Checked | Quote |
|---|---|---|---|
| `uk-hosting` | https://help.mitti.com/003569 | 25/09/2026 | located in the U.S., EU (Ireland), and Australia |
| `gbp-prices` | https://mitti.com/pricing | 25/09/2026 | We support billing in AUD for Australian and New Zealander customers and USD for all other international customers. |
| `vat` | https://mitti.com/pricing | 25/09/2026 | Excl. all applicable taxes |
| `riddor` | https://mitti.com/topics/riddor | 25/09/2026 | Browse RIDDOR report templates |
| `permits` | https://mitti.com/apps/permit-to-work-software | 25/09/2026 | Mitti supports a configurable digital checklist for: Hot work, Confined space entry, Lockout/tagout (LOTO), Working at height, Cold work and electrical work |
| `fleet` | https://mitti.com/pricing | 25/09/2026 | Maintain a digital register of your assets, conduct inspections and raise issues related to them, automate maintenance and view utilization across your fleet |
| `offline` | https://help.mitti.com/002907 | 25/09/2026 | Using Mitti while offline is only supported on the mobile app. |
| `free-or-demo` | https://mitti.com/pricing | 25/09/2026 | Up to 10 seats |
| `implementation` | https://mitti.com/pricing | 25/09/2026 | Onboarding services and training |
| `ai` | https://mitti.com/pricing | 25/09/2026 | NEW - AI included in every plan |
| `sso` | https://mitti.com/pricing | 25/09/2026 | Advanced security, including SSO |
| `integrations` | https://developer.mitti.com | 25/09/2026 | Full REST API and webhook coverage |
| `lone-worker` | https://help.mitti.com/004645 | 25/09/2026 | Organizations on Free Plan can only have 1 job type and 1 alert escalation |
| `coshh` | https://mitti.com/safety-and-compliance/hazcom | 25/09/2026 | Establish a reliable HazCom system using Mitti (by SafetyCulture) |
| `security` | https://mitti.com/security | 25/09/2026 | Mitti (by SafetyCulture) is ISO 27001:2022 certified. |

Distinct URLs cited on this page: 9.

Monitored pages for this competitor:

- Pricing: https://mitti.com/pricing
- Platform: https://mitti.com/platform

### /compare/evotix (last checked 25/09/2026)

| Row id | Source URL | Checked | Quote |
|---|---|---|---|
| `uk-hosting` | https://www.evotix.com/en-subprocessor-policy | 25/09/2026 | London Region for UK and EU customers |
| `gbp-prices` | https://www.evotix.com/pricing-request | 25/09/2026 | Pricing built around your organization's size, sites and EHS needs, not rigid plans. |
| `vat` | https://www.evotix.com/pricing-request | 25/09/2026 |  |
| `riddor` | https://www.evotix.com/solutions/safety/incident-management | 25/09/2026 | Automate OSHA, RIDDOR, etc. tracking to cut admin work, avoid fines and breeze through audits. |
| `permits` | https://www.evotix.com/solutions/operational-risk/permit-to-work | 25/09/2026 | EHS Permit to Work Software |
| `fleet` | https://www.evotix.com/solutions/evotix-assure | 25/09/2026 | Track equipment, plant, and assets, including inspections, maintenance activities, and associated safety records |
| `offline` | https://www.evotix.com/platform/mobile | 25/09/2026 | Submit reports online or offline and sync automatically when connected |
| `free-or-demo` | https://www.evotix.com/book-demo | 25/09/2026 | Book a personalized demo |
| `implementation` | https://www.evotix.com/pricing-request | 25/09/2026 | Implementation is a separate, one-time fee. |
| `ai` | https://www.evotix.com/evo-ai | 25/09/2026 | EvoAI is delivered through a set of assistive AI agents embedded directly into everyday EHS workflows |
| `sso` | https://www.evotix.com/integrations | 25/09/2026 | Availability varies by product. Your Evotix team can help confirm what applies in your environment. |
| `integrations` | https://www.evotix.com/integrations | 25/09/2026 | Integrations are supported through inbound and outbound APIs, scheduled file-based imports, and SCIM for identity lifecycle management. |
| `lone-worker` | https://www.evotix.com/solutions/safety/journey-planning | 25/09/2026 | missed-check-in alerts and simple escalation |
| `coshh` | https://www.evotix.com/solutions/esg-and-sustainability/chemical-and-sds-management | 25/09/2026 | Access millions of up-to-date SDSs through our SDS Manager integration |
| `security` | https://www.evotix.com/ | 25/09/2026 | SOC 2 Type II Attestation |

Distinct URLs cited on this page: 12.

Monitored pages for this competitor:

- Pricing request: https://www.evotix.com/pricing-request
- Solutions: https://www.evotix.com/solutions

### /compare/ecoonline (last checked 25/09/2026)

| Row id | Source URL | Checked | Quote |
|---|---|---|---|
| `uk-hosting` | https://www.ecoonline.com/sub-processors/ | 25/09/2026 |  |
| `gbp-prices` | https://www.ecoonline.com/ehs-software/ | 25/09/2026 | As our EHS software is bespoke, the price will depend on the features, users, and customisation we include for your business. |
| `vat` | https://www.ecoonline.com/ehs-software/ | 25/09/2026 |  |
| `riddor` | https://www.ecoonline.com/ehs-software/incident-management-software/ | 25/09/2026 | Meet compliance requirements and stay updated on evolving regulations. |
| `permits` | https://www.ecoonline.com/ehs-software/control-of-work/epermits/ | 25/09/2026 | Real-time permit tracking and validation |
| `fleet` | https://www.ecoonline.com/industries/transport-and-logistics/ | 25/09/2026 | maintain a defensible audit trail for DVSA and HSE inspections |
| `offline` | https://www.ecoonline.com/ehs-software/audits-inspections/ | 25/09/2026 | Continue to work offline in areas of low signal. |
| `free-or-demo` | https://www.ecoonline.com/book-a-demo/ | 25/09/2026 |  |
| `implementation` | https://www.ecoonline.com/ehs-software/control-of-work/epermits/ | 25/09/2026 | Most organisations can implement EcoOnline ePermits in under one week |
| `ai` | https://www.ecoonline.com/ai/ | 25/09/2026 | Assist, the AI-powered assistant embedded across EcoOne |
| `sso` | https://www.ecoonline.com/ehs-software/ | 25/09/2026 |  |
| `integrations` | https://www.ecoonline.com/ehs-software/control-of-work/epermits/ | 25/09/2026 | can connect with your existing CMMS, EHS, or ERP systems through secure APIs |
| `lone-worker` | https://www.ecoonline.com/ehs-software/lone-worker/ | 25/09/2026 | Lone worker software to protect your lone workers 24/7, powered by StaySafe. |
| `coshh` | https://www.ecoonline.com/chemical-safety/coshh-risk-assessment/ | 25/09/2026 | COSHH risk assessments produced by a team of qualified safety professionals as you need them. |
| `security` | https://www.ecoonline.com/certifications/ | 25/09/2026 | StaySafe is certified to BS 8484:2022, the British Standard Code of Practice for the provision of lone worker services. |

Distinct URLs cited on this page: 11.

Monitored pages for this competitor:

- EHS software: https://www.ecoonline.com/ehs-software/
- Certifications: https://www.ecoonline.com/certifications/
