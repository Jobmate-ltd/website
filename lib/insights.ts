// Insights / blog content for jobsafe.
//
// Posts are authored as structured, dependency-free content blocks (no MDX, no
// CMS) and rendered by components/insights/PostBody.tsx. Inline emphasis and
// links use a tiny markdown subset: **bold** and [label](href).
//
// Facts in these posts are grounded in HSE and other primary UK sources; the
// citations for each post live in its `sources` array and are surfaced at the
// foot of the article.

export type InsightBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'stats'; items: { value: string; label: string }[] }

export interface InsightSource {
  label: string
  href: string
}

export interface InsightPost {
  slug: string
  title: string
  /** <head> meta description — keep ≤ ~160 chars. */
  description: string
  /** Short summary used on listing cards. */
  excerpt: string
  category: string
  keywords: string[]
  author: string
  /** ISO yyyy-mm-dd. */
  date: string
  /** Estimated reading time in minutes. */
  readingTime: number
  content: InsightBlock[]
  sources: InsightSource[]
  /** Slugs of related posts. */
  related: string[]
}

export const SITE_URL = 'https://www.jobsafe.cloud'

const posts: InsightPost[] = [
  {
    slug: 'riddor-reporting-explained',
    title: 'RIDDOR Reporting Explained: What UK Employers Must Report — and the Deadlines',
    description:
      'A plain-English guide to RIDDOR reporting for UK employers: who must report, what counts as reportable, the exact deadlines, and how to stay audit-ready.',
    excerpt:
      'RIDDOR catches out more employers than almost any other piece of health and safety law. Here is what is reportable, the deadlines that actually matter, and how to stay on the right side of the HSE.',
    category: 'Compliance',
    keywords: [
      'RIDDOR reporting',
      'what is reportable under RIDDOR',
      'RIDDOR reporting deadlines',
      'RIDDOR specified injuries',
      'how to report a RIDDOR incident',
      'RIDDOR record keeping',
    ],
    author: 'The jobsafe Team',
    date: '2026-06-09',
    readingTime: 9,
    content: [
      {
        type: 'p',
        text: `If you employ people in the UK, RIDDOR is one of the few pieces of health and safety law that turns a bad day into a legal obligation with a deadline attached. Get it right and it is a routine form. Get it wrong — report late, report the wrong thing, or fail to report at all — and you are exposed to enforcement action from the Health and Safety Executive (HSE). This guide breaks down exactly what RIDDOR requires, in plain English.`,
      },
      {
        type: 'stats',
        items: [
          { value: '124', label: 'Worker deaths (GB, 2024/25)' },
          { value: '59,219', label: 'RIDDOR injuries reported by employers' },
          { value: '£22.9bn', label: 'Annual cost of injury & ill health (2023/24)' },
          { value: '40.1m', label: 'Working days lost (2024/25)' },
        ],
      },
      { type: 'h2', text: 'What is RIDDOR?' },
      {
        type: 'p',
        text: `RIDDOR stands for the **Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013**. It places a legal duty on certain people to report — and keep records of — specific workplace incidents to the relevant enforcing authority, usually the HSE or your local authority. It is the mechanism that turns what happened on site into the national picture of workplace risk. RIDDOR 2013 is the version currently in force; you can read the official guidance on the [HSE's RIDDOR pages](https://www.hse.gov.uk/riddor/).`,
      },
      { type: 'h2', text: 'Who has to report? The "responsible person"' },
      {
        type: 'p',
        text: `RIDDOR duties fall on the **responsible person** — not on the injured worker, and not on a member of the public who was hurt. The responsible person is usually one of:`,
      },
      {
        type: 'ul',
        items: [
          `**Employers** — responsible for reporting incidents involving their employees, wherever they are working.`,
          `**The self-employed** — responsible for reporting certain incidents involving themselves.`,
          `**People in control of work premises** — responsible where the incident happens at premises under their control.`,
        ],
      },
      {
        type: 'p',
        text: `For a dispersed field workforce, that "wherever they are working" clause matters: an engineer injured on a customer's site three counties away is still your responsibility to report.`,
      },
      { type: 'h2', text: "What's reportable under RIDDOR?" },
      {
        type: 'p',
        text: `Not every accident is reportable, and this is where most confusion starts. RIDDOR covers seven broad categories.`,
      },
      { type: 'h3', text: 'Deaths' },
      {
        type: 'p',
        text: `Any work-related death — of a worker or a non-worker — arising from a work-related accident, including a death caused by an act of violence to a worker. Suicides and deaths from natural causes are generally outside RIDDOR.`,
      },
      { type: 'h3', text: 'Specified injuries to workers' },
      {
        type: 'p',
        text: `"Specified injuries" are the serious injuries listed in the regulations. They include:`,
      },
      {
        type: 'ul',
        items: [
          `Fractures, other than to fingers, thumbs and toes`,
          `Amputation of an arm, hand, finger, thumb, leg, foot or toe`,
          `Any injury likely to cause permanent loss of, or reduction in, sight`,
          `A crush injury to the head or torso causing damage to the brain or internal organs`,
          `Serious burns covering more than 10% of the body, or affecting the eyes, respiratory system or other vital organs`,
          `Any scalping requiring hospital treatment`,
          `Loss of consciousness caused by head injury or asphyxia`,
          `Any injury from working in an enclosed space leading to hypothermia, heat illness, or requiring resuscitation or 24+ hours in hospital`,
        ],
      },
      { type: 'h3', text: 'Over-seven-day injuries' },
      {
        type: 'p',
        text: `If a worker is incapacitated — away from work or unable to perform their normal duties — for **more than seven consecutive days** as a result of a workplace accident, that is reportable. The seven days do not include the day of the accident, but they **do include weekends and rest days**.`,
      },
      { type: 'h3', text: 'Injuries to members of the public' },
      {
        type: 'p',
        text: `Where a work-related accident injures a member of the public and they are **taken directly from the scene to hospital for treatment**, it is reportable. A diagnostic test such as an X-ray does not, on its own, count as "treatment".`,
      },
      { type: 'h3', text: 'Occupational diseases' },
      {
        type: 'p',
        text: `Following a written diagnosis, certain work-related diseases are reportable, including carpal tunnel syndrome, hand-arm vibration syndrome (HAVS), occupational dermatitis, occupational asthma, tendonitis or tenosynovitis of the hand or forearm, occupational cancer, and disease from exposure to a biological agent.`,
      },
      { type: 'h3', text: 'Dangerous occurrences' },
      {
        type: 'p',
        text: `These are specified near-miss events with a high potential to cause death or serious injury, listed in Schedule 2 of the regulations — they are reportable even when nobody is hurt. Examples include:`,
      },
      {
        type: 'ul',
        items: [
          `Collapse or failure of lifting equipment`,
          `Failure of a pressure system`,
          `Plant or equipment contacting overhead power lines`,
          `Collapse of scaffolding over five metres high`,
          `An electrical short circuit or overload causing a fire or explosion`,
          `Accidental release of a substance that could cause injury to health`,
        ],
      },
      { type: 'h3', text: 'Gas incidents' },
      {
        type: 'p',
        text: `Suppliers of flammable gas must report incidents involving death, loss of consciousness or hospital treatment connected with the gas, and Gas Safe registered engineers must report dangerous gas fittings.`,
      },
      {
        type: 'callout',
        title: 'The one distinction everyone gets wrong',
        text: `**Recording is not the same as reporting.** An injury that keeps a worker off normal duties for **more than three** consecutive days must be **recorded** — but it is only **reported** to the HSE if the absence passes **more than seven** days. Over-three-day: record. Over-seven-day: report. Mix these up and you will either flood the HSE with reports you did not need to make, or miss the ones you did.`,
      },
      { type: 'h2', text: 'RIDDOR reporting deadlines — the clock that catches people out' },
      {
        type: 'p',
        text: `Each category has its own deadline, and the clock usually starts on the date of the incident:`,
      },
      {
        type: 'ul',
        items: [
          `**Deaths, specified injuries and dangerous occurrences:** notify the HSE **without delay** (by phone or online), then ensure a report is **received within 10 days** of the incident.`,
          `**Over-seven-day injuries:** report **within 15 days** of the accident.`,
          `**Occupational diseases:** report **as soon as** you receive the written diagnosis.`,
          `**Over-three-day injuries:** do not report — but you must **record** them.`,
        ],
      },
      {
        type: 'p',
        text: `The 15-day over-seven-day deadline is the silent trap. A worker is hurt, takes a few days off, and the case looks minor — then the absence quietly rolls past seven days while nobody is watching the calendar. By the time anyone notices, the reporting window is already running.`,
      },
      { type: 'h2', text: 'How to make a RIDDOR report' },
      {
        type: 'p',
        text: `Most reports are made through the [HSE's online RIDDOR forms](https://www.hse.gov.uk/riddor/report.htm), with separate forms for injuries, dangerous occurrences, diseases and gas incidents. A telephone line (0345 300 9923) is reserved for **fatal and specified-injury** incidents only — everything else goes online. When you submit, you receive a confirmation and a reference number; keep it.`,
      },
      { type: 'h2', text: 'Keeping records' },
      {
        type: 'p',
        text: `You must keep a record of every reportable incident **and** every over-three-day injury for **at least three years**. A record should capture the date and method of reporting; the date, time and place of the event; the personal details of those involved; and a brief description of what happened. Because those records contain personal data, store them in line with your GDPR obligations.`,
      },
      { type: 'h2', text: "What happens if you don't report?" },
      {
        type: 'p',
        text: `Failing to report a reportable incident is a criminal offence under the **Health and Safety at Work etc. Act 1974**, with penalties strengthened by the **Health and Safety (Offences) Act 2008**. Serious breaches can carry an unlimited fine and, in the most serious cases, imprisonment of up to two years. Under section 37 of the 1974 Act, directors and managers can be prosecuted personally where an offence results from their consent, connivance or neglect. Enforcement often targets a pattern of non-compliance — but a missed fatality report is a category of its own.`,
      },
      { type: 'h2', text: "The real problem isn't the rules — it's the data" },
      {
        type: 'p',
        text: `Read the regulations and RIDDOR is clear enough. What breaks compliance in practice is the gap between an incident happening on a remote site and the office finding out about it in time to act. Paper forms get left in vans. Details fade. Absence isn't tracked against the seven-day line. The information you need to decide whether something is reportable — and to prove you reported it — simply isn't captured cleanly.`,
      },
      {
        type: 'p',
        text: `That is exactly the gap jobsafe is built to close. Incidents are [captured at the point they happen](/#how-it-works), with photos, GPS and a timestamp, even offline — and every action is held in an immutable [audit trail](/#features) you can put in front of an HSE inspector or your insurer. If you are also working on getting ahead of incidents before they become RIDDOR reports, our guide to [near miss reporting](/insights/near-miss-reporting-safety-culture) is the natural next read.`,
      },
      { type: 'h2', text: 'Staying audit-ready' },
      {
        type: 'p',
        text: `RIDDOR compliance is not really about knowing the rules — most safety managers already do. It is about having a fast, reliable way to capture every incident, flag the ones that cross a reporting threshold, hit the deadline, and prove all of it after the fact. Build that into how your teams already work and RIDDOR stops being a risk and becomes routine.`,
      },
      {
        type: 'p',
        text: `Want to see how jobsafe handles incident capture and audit trails across a dispersed field team? [Take a look at how it works](/#how-it-works), or call us on 0333 8000 883.`,
      },
    ],
    sources: [
      { label: 'HSE — RIDDOR overview', href: 'https://www.hse.gov.uk/riddor/' },
      { label: 'HSE — Types of reportable incidents', href: 'https://www.hse.gov.uk/riddor/types-of-reportable-incidents.htm' },
      { label: 'HSE — Specified injuries', href: 'https://www.hse.gov.uk/riddor/specified-injuries.htm' },
      { label: 'HSE — When do I need to report?', href: 'https://www.hse.gov.uk/riddor/when-do-i-report.htm' },
      { label: 'HSE — What records must I keep?', href: 'https://www.hse.gov.uk/riddor/what-must-i-keep.htm' },
      { label: 'HSE — Workplace health & safety statistics (GB 2024/25)', href: 'https://www.hse.gov.uk/statistics/overview.htm' },
    ],
    related: ['near-miss-reporting-safety-culture', 'lone-worker-safety-guide'],
  },

  {
    slug: 'near-miss-reporting-safety-culture',
    title: "Near Miss Reporting: The Cheapest Safety Win You're Probably Ignoring",
    description:
      'Why near miss reporting matters, what the safety triangle really tells us, and how to build a reporting culture your field teams will actually use.',
    excerpt:
      'A near miss is a free lesson — an accident that warned you instead of hurting someone. So why do so few of them ever get reported, and how do you fix that?',
    category: 'Safety Culture',
    keywords: [
      'near miss reporting',
      'how to improve near miss reporting',
      'what is a near miss',
      'safety triangle',
      'leading vs lagging safety indicators',
      'safety reporting culture',
    ],
    author: 'The jobsafe Team',
    date: '2026-05-28',
    readingTime: 8,
    content: [
      {
        type: 'p',
        text: `Every serious workplace injury is usually preceded by a string of moments where things almost went wrong — the load that swung but missed, the slip that didn't quite become a fall, the tool that failed without anyone underneath it. Each of those is a **near miss**: a free lesson, delivered at no cost in blood. The organisations that get safety right are the ones that treat near misses as the cheap, early-warning data they are. Most workplaces let them evaporate.`,
      },
      { type: 'h2', text: 'What is a near miss?' },
      {
        type: 'p',
        text: `A near miss is an unplanned event that **did not** cause injury, illness or damage — but **had the potential to**. It is worth being precise, because the words get used loosely:`,
      },
      {
        type: 'ul',
        items: [
          `**Hazard** — a condition with the potential to cause harm that exists but hasn't yet produced an event (a trailing cable, an unguarded edge).`,
          `**Near miss** — an event that happened and could have caused harm, but by luck or timing didn't.`,
          `**Accident** — an unplanned event that **did** result in injury, ill health or damage.`,
          `**Dangerous occurrence** — a specific, legally defined high-potential near miss that **must** be reported to the HSE under RIDDOR.`,
        ],
      },
      {
        type: 'p',
        text: `Most near misses are not legally reportable — only those that meet the [dangerous occurrence](/insights/riddor-reporting-explained) criteria are. That is the whole point: near miss reporting is largely **voluntary, internal and proactive**, which is exactly why culture, not compliance, decides whether it happens.`,
      },
      { type: 'h2', text: 'The safety triangle: a useful idea, not a law' },
      {
        type: 'p',
        text: `In 1931, Herbert Heinrich published an analysis suggesting that for every major injury there were roughly **29 minor injuries and 300 no-injury accidents** — the original "safety triangle". In 1969, Frank Bird Jr. studied around 1.7 million incident reports and produced a four-tier version: for every serious injury, about **10 minor injuries, 30 property-damage events and 600 near misses**. Bird's contribution was to put near misses explicitly at the broad base of the pyramid.`,
      },
      {
        type: 'p',
        text: `Treat the triangle as an argument, not a formula. Modern research is rightly sceptical of reading it as a predictive law: the causes of a paper cut are often not the causes of a fatality, so driving down minor injuries does not automatically prevent catastrophic ones. The honest takeaway is narrower but still powerful — beneath every serious incident sits a large population of smaller signals, and a workplace that listens to those signals has more chances to intervene before someone is hurt.`,
      },
      { type: 'h2', text: 'Leading vs lagging indicators' },
      {
        type: 'p',
        text: `Safety metrics come in two flavours. **Lagging indicators** measure outcomes that have already happened — injury rates, lost-time incidents, RIDDOR reports. By the time they move, someone is already hurt. **Leading indicators** measure the activities and conditions that prevent harm — hazard observations, inspections, training, and near miss reports. They are forward-looking.`,
      },
      {
        type: 'p',
        text: `Near misses are the purest leading indicator you have: the system handed you a warning at zero cost in injury. The HSE's own management guidance, [HSG65](https://www.hse.gov.uk/pubns/books/hsg65.htm), tells organisations to look beyond accident figures and combine active monitoring (checking controls are working **before** an incident) with reactive monitoring (investigating incidents after the fact).`,
      },
      {
        type: 'callout',
        title: 'A counter-intuitive warning sign',
        text: `A **high** near miss reporting rate is usually a sign of a **healthy** safety culture, not a dangerous workplace. The opposite is the danger: when near miss reports fall while everything looks calm, it often means people have **stopped reporting** — not that risk has gone away. Silence is not safety.`,
      },
      { type: 'h2', text: "Why people don't report near misses" },
      {
        type: 'p',
        text: `If near misses are so valuable, why does the field stay quiet? The barriers are remarkably consistent across industries:`,
      },
      {
        type: 'ul',
        items: [
          `**Fear of blame** — worry about discipline, looking incompetent, or getting a colleague in trouble. The single most-cited barrier worldwide.`,
          `**No feedback loop** — "I reported something once and nothing happened." Reports that vanish into a black hole stop coming.`,
          `**"Nothing actually happened"** — because no one was hurt, the event feels too trivial to bother logging.`,
          `**Friction** — paper forms, clunky portals back at the depot, having to stop work and find a supervisor. For a mobile workforce this is fatal to reporting.`,
          `**Uncertainty** — not knowing what counts as a near miss or how to report it.`,
        ],
      },
      { type: 'h3', text: 'The slow drift: normalisation of deviance' },
      {
        type: 'p',
        text: `There is a deeper failure mode the sociologist Diane Vaughan identified while studying the 1986 Challenger disaster: **normalisation of deviance**. When an unsafe shortcut repeatedly fails to cause a catastrophe, it gradually becomes accepted as "the way we do things". Each uneventful shortcut shifts the baseline a little, until genuine near misses stop being seen as near misses at all. People aren't choosing not to report — they no longer notice there is anything to report.`,
      },
      { type: 'h2', text: 'What near misses cost you when you ignore them' },
      {
        type: 'p',
        text: `The HSE estimates that workplace injuries and ill health cost Great Britain **£22.9 billion** in 2023/24, at roughly **£10,000 per injury case**. Those are the realised costs of failure — the lagging number. A near miss reporting programme attacks that cost **before** it is incurred, at the price of a few minutes' logging and a fix. Prevent a handful of incidents a year and the programme has more than paid for itself.`,
      },
      { type: 'h2', text: 'How to build a near miss reporting culture that sticks' },
      {
        type: 'p',
        text: `Culture change is the goal, but it is built from concrete mechanics. The ones that move the needle:`,
      },
      {
        type: 'ol',
        items: [
          `**Make reporting frictionless.** Reduce it to seconds, on the device already in the worker's hand — a photo and a few taps in the field, not a form to fill in back at base. Friction is the number-one practical killer of reporting volume.`,
          `**Adopt a just culture.** Honest reporting of error and near misses is non-punitive; only genuinely reckless behaviour is sanctioned. Without that foundation, fear quietly suppresses everything.`,
          `**Close the loop.** Tell people what happened to their report and what changed because of it. Visible action is the single biggest driver of sustained reporting.`,
          `**Get leaders engaged.** When managers report their own near misses and thank reporters rather than punishing them, the message lands.`,
          `**Track and trend.** Treat near misses as leading-indicator data: categorise, count and watch the trend.`,
          `**Act on patterns, not just individual reports.** Aggregate the data to find recurring hazards and fix the systemic cause.`,
        ],
      },
      { type: 'h2', text: 'Start with the friction' },
      {
        type: 'p',
        text: `Every one of those practices depends on the first one. A just culture and a tight feedback loop still produce nothing if reporting means a paper form that never makes it off site. That is why jobsafe puts capture in the worker's pocket: one-tap reporting that [works offline](/#features), syncs automatically, and feeds a dashboard built to surface the patterns hiding in your near miss data. Make reporting effortless and the culture has room to grow.`,
      },
      {
        type: 'p',
        text: `Closely related reading: once you are capturing incidents well, make sure you know [exactly what RIDDOR requires you to report](/insights/riddor-reporting-explained) — and if your teams work alone, [how to keep lone workers safe](/insights/lone-worker-safety-guide).`,
      },
    ],
    sources: [
      { label: 'HSE — Managing for health and safety (HSG65)', href: 'https://www.hse.gov.uk/pubns/books/hsg65.htm' },
      { label: 'HSE — Costs to GB of workplace injury & ill health', href: 'https://www.hse.gov.uk/statistics/cost.htm' },
      { label: 'HSE — Dangerous occurrences (RIDDOR)', href: 'https://www.hse.gov.uk/riddor/dangerous-occurences.htm' },
      { label: 'The accident triangle (Heinrich & Bird) — overview', href: 'https://en.wikipedia.org/wiki/Accident_triangle' },
      { label: 'Normalisation of deviance (Vaughan / Challenger)', href: 'https://en.wikipedia.org/wiki/Normalization_of_deviance' },
    ],
    related: ['riddor-reporting-explained', 'lone-worker-safety-guide'],
  },

  {
    slug: 'lone-worker-safety-guide',
    title: 'Lone Worker Safety: Your Legal Duties and How to Protect Field Teams',
    description:
      'A practical guide to lone worker safety in the UK: what the law requires, the risks field teams face, and how to keep dispersed and offline workers safe.',
    excerpt:
      "Lone working isn't illegal — but ignoring the risks is a fast route to an incident you can't defend. Here's what UK law requires and how to actually protect your field team.",
    category: 'Field Safety',
    keywords: [
      'lone worker safety',
      'lone working risk assessment',
      'lone worker law UK',
      'how to keep lone workers safe',
      'lone worker app',
      'protecting lone workers',
    ],
    author: 'The jobsafe Team',
    date: '2026-05-14',
    readingTime: 9,
    content: [
      {
        type: 'p',
        text: `The engineer on a roadside callout. The technician alone in a plant room. The service rep walking into a stranger's home. Lone workers are everywhere in field service, energy, logistics and facilities work — the British Security Industry Association estimates as many as **8 million** people in the UK work alone at least some of the time. They face the same hazards as everyone else, but with one crucial difference: when something goes wrong, there is nobody beside them to help.`,
      },
      { type: 'h2', text: 'What counts as a lone worker?' },
      {
        type: 'p',
        text: `The HSE defines a lone worker as **"someone who works by themselves without close or direct supervision"**. That is a much wider group than people picture. It includes those who:`,
      },
      {
        type: 'ul',
        items: [
          `Work away from a fixed base — field engineers, maintenance and repair staff, delivery and HGV drivers`,
          `Visit people's homes or premises — care workers, surveyors, service and sales reps`,
          `Work separately from colleagues or outside normal hours — security, cleaning and out-of-hours staff`,
          `Work at a fixed base alone — a single person in a depot, warehouse or remote site`,
          `Work from home`,
        ],
      },
      { type: 'h2', text: 'Is lone working legal? What the law actually says' },
      {
        type: 'p',
        text: `There is **no law that prohibits lone working**, and no requirement to do a separate, standalone lone-worker risk assessment. But that does not mean it is unregulated. Under the **Health and Safety at Work etc. Act 1974** and the **Management of Health and Safety at Work Regulations 1999**, employers must assess the risks to lone workers and put reasonable controls in place before allowing people to work alone.`,
      },
      {
        type: 'ul',
        items: [
          `You must include lone workers in your **general risk assessment** and control the risks you find.`,
          `If you employ **five or more** people, you must **write down** the significant findings.`,
          `These duties **cannot be transferred** to the lone worker — the responsibility stays with you, and extends to contractors and the self-employed working on your premises.`,
        ],
      },
      {
        type: 'p',
        text: `The HSE's free guidance [INDG73 "Protecting lone workers"](https://www.hse.gov.uk/pubns/indg73.htm) is the definitive plain-English reference and is well worth reading in full.`,
      },
      { type: 'h2', text: 'The risks lone workers face' },
      {
        type: 'p',
        text: `Working alone doesn't create new hazards so much as it removes the safety net. The risks that matter most:`,
      },
      {
        type: 'ul',
        items: [
          `**An accident with no one to help** — the core multiplier behind every other risk.`,
          `**Violence and aggression** — especially in public-facing and home-visit roles, and during late or early hours when fewer people are around.`,
          `**Medical emergencies** — a sudden illness or collapse with nobody to raise the alarm.`,
          `**No way to summon help** — dead phone signal, a panic alarm that can't connect, a check-in nobody is monitoring.`,
          `**Fatigue and manual handling** — long, unsociable hours and tasks meant for two people.`,
          `**Isolation** — poor contact can leave workers feeling cut off, with real effects on stress and mental health.`,
        ],
      },
      {
        type: 'stats',
        items: [
          { value: '689,000', label: 'Incidents of violence at work (GB, 2024/25)' },
          { value: '370,000', label: 'Of those were physical assaults' },
          { value: '38%', label: 'Of assaults resulted in injury' },
          { value: '124', label: 'Worker deaths (GB, 2024/25)' },
        ],
      },
      {
        type: 'p',
        text: `Several of the highest-risk occupations in the national figures — drivers, and health and social care visitors — are classic lone-worker roles. The HSE does not publish a separate "lone worker" cut of these numbers, but the pattern is clear: the people most exposed to work-related violence are often the ones working alone.`,
      },
      { type: 'h2', text: 'What a lone worker risk assessment should cover' },
      {
        type: 'p',
        text: `The HSE frames a good assessment around three questions:`,
      },
      {
        type: 'ol',
        items: [
          `**The worker and other people** — their experience and training, and whether they are more vulnerable (new, young, pregnant, or a trainee).`,
          `**The environment and equipment** — is the location itself risky, rural or isolated? Are they entering someone else's home? Do they have a **reliable means of communication and a way to call for help**?`,
          `**How the work could trigger an incident** — roles involving authority over the public, or carrying cash or valuable equipment.`,
        ],
      },
      {
        type: 'p',
        text: `From there, the HSE expects four kinds of control: **training** (lone workers can't ask the person next to them, so they need more of it), **supervision** (the higher the risk, the more is required), **monitoring and keeping in touch** (regular check-ins, and a system that confirms a worker got home safely), and a reliable **means to raise the alarm** in an emergency.`,
      },
      { type: 'h2', text: 'BS 8484 and lone worker technology' },
      {
        type: 'p',
        text: `**BS 8484** is the British Standard for lone worker device and app services (current version BS 8484:2022). It is voluntary, not law, but it is the de-facto procurement benchmark and covers what a good lone-worker service should provide: a discreet panic alarm, two-way audio, location, and escalation to a monitoring centre. In practice the building blocks that protect a lone worker are **GPS location**, **check-in / "I'm safe" timers**, **panic and man-down alarms**, and fast **incident reporting** that captures what happened — photo, location, timestamp — for the records you are required to keep.`,
      },
      { type: 'h2', text: "Why paper and 'no signal' let lone workers down" },
      {
        type: 'p',
        text: `Here is where most lone-worker systems quietly fail. The HSE requires a **reliable** means of communication that is **regularly tested** — but lone workers are disproportionately in exactly the places mobile coverage drops: rural sites, basements, plant rooms, the roadside. A check-in app or alarm that depends on a live connection silently stops protecting people in the dead zones where they are most exposed.`,
      },
      {
        type: 'p',
        text: `Paper systems fail differently. A handwritten incident form filled in back at the depot loses detail, drifts on timestamps, and often never gets logged at all — so the incident record the HSE expects you to review simply doesn't exist. And a manual check-in routine relies on someone noticing an absence in time to act.`,
      },
      { type: 'h2', text: 'Protecting your field team in practice' },
      {
        type: 'p',
        text: `Protecting lone workers comes down to closing the distance between an incident and someone who can respond — even when there is no signal and no witness. That is the problem jobsafe is built around: incident capture that [works fully offline](/#features) and syncs the moment a connection returns, automatic GPS and timestamps on every report, real-time alerts to supervisors, and an immutable audit trail that proves you met your duty of care. It is designed for [the industries where people work alone and far from base](/#industries) — and your engineers will actually use it, because it lives on the phone already in their pocket.`,
      },
      {
        type: 'p',
        text: `Keep reading: make sure you know [what RIDDOR requires you to report](/insights/riddor-reporting-explained) when a lone-worker incident does happen, and how [near miss reporting](/insights/near-miss-reporting-safety-culture) helps you catch risks before they reach your most exposed workers. Or call us on 0333 8000 883 to talk it through.`,
      },
    ],
    sources: [
      { label: 'HSE — Protecting lone workers (INDG73)', href: 'https://www.hse.gov.uk/pubns/indg73.htm' },
      { label: 'HSE — Lone working: manage the risks', href: 'https://www.hse.gov.uk/lone-working/employer/manage-the-risks-of-working-alone.htm' },
      { label: 'Management of H&S at Work Regulations 1999, reg. 3', href: 'https://www.legislation.gov.uk/uksi/1999/3242/regulation/3/made' },
      { label: 'HSE — Violence at work statistics (2024/25)', href: 'https://www.hse.gov.uk/statistics/causinj/violence/index.htm' },
      { label: 'BSI — BS 8484 lone worker services standard', href: 'https://standardsdevelopment.bsigroup.com/projects/9020-04879' },
    ],
    related: ['riddor-reporting-explained', 'near-miss-reporting-safety-culture'],
  },
]

export function getAllPosts(): InsightPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): InsightPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string): InsightPost[] {
  const post = getPostBySlug(slug)
  if (!post) return []
  return post.related
    .map((s) => getPostBySlug(s))
    .filter((p): p is InsightPost => Boolean(p))
}

/** UK-style display date, e.g. "9 June 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`))
}
