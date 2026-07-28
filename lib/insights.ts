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

export { SITE_URL } from './brand'

const posts: InsightPost[] = [
  {
    slug: 'rams-risk-assessments-method-statements',
    title: 'RAMS Explained: Risk Assessments and Method Statements for UK Sites',
    description:
      'What a RAMS is, whether it is a legal requirement, the difference between a risk assessment and a method statement, what to include, and how to keep them live.',
    excerpt:
      "Ask ten site workers what RAMS stands for and you'll get ten answers. Here's what a risk assessment and method statement actually are, when the law requires them, and how to stop them becoming a document nobody reads.",
    category: 'Compliance',
    keywords: [
      'what is a RAMS',
      'risk assessment method statement',
      'how to write a method statement',
      'are RAMS a legal requirement',
      'difference between risk assessment and method statement',
      'RAMS construction',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 8,
    content: [
      {
        type: 'p',
        text: `On any UK construction site, "have you got the RAMS?" is one of the first questions a principal contractor will ask before your team sets foot on the job. Yet RAMS is one of the most misused acronyms in the industry — treated as a single form to be downloaded, signed and filed, rather than the two distinct safety documents it actually is. This guide sets out what a **risk assessment** and a **method statement** each do, when the law requires them, and how to keep them from going stale.`,
      },
      {
        type: 'stats',
        items: [
          { value: '5+', label: 'employees before a risk assessment must be written down' },
          { value: 'Reg 13', label: 'CDM 2015 duty to plan and manage construction work' },
          { value: '2', label: 'separate documents inside every "RAMS"' },
          { value: '1999', label: 'the regulations behind the risk-assessment duty' },
        ],
      },
      { type: 'h2', text: 'What does RAMS stand for?' },
      {
        type: 'p',
        text: `**RAMS** stands for **Risk Assessment and Method Statement** — two documents that almost always travel together, and are often bound into one. They answer two different questions about a task:`,
      },
      {
        type: 'ul',
        items: [
          `**The risk assessment** asks *what could go wrong, and how bad could it be?* It identifies the hazards, judges the risk, and sets the control measures that bring that risk down to an acceptable level.`,
          `**The method statement** asks *so how do we do this safely, step by step?* It describes the safe system of work — the sequence, the equipment, the people, the controls — that puts the risk assessment into practice on the ground.`,
        ],
      },
      {
        type: 'p',
        text: `Get the distinction and the whole thing makes sense: the risk assessment is the thinking, the method statement is the doing. One without the other is half a document.`,
      },
      { type: 'h2', text: 'Are RAMS a legal requirement?' },
      {
        type: 'p',
        text: `"RAMS" as a single named document is an industry convention, not a phrase you'll find in a statute. But the two duties underneath it are firmly in law:`,
      },
      {
        type: 'ul',
        items: [
          `**Risk assessment** is required by **regulation 3 of the Management of Health and Safety at Work Regulations 1999**. Every employer must assess the risks to workers and anyone else affected by the work. If you employ **five or more people**, the significant findings must be **recorded**.`,
          `**Method statements** are not named in law, but on construction work **regulation 13 of CDM 2015** requires contractors to plan, manage and monitor their work so it is carried out without risks to health and safety, so far as is reasonably practicable — and a written method statement is the recognised way to show you have done that for a high-risk task.`,
        ],
      },
      {
        type: 'callout',
        title: 'The practical reality',
        text: `Whatever the letter of the law, no principal contractor will let a subcontractor start high-risk work without approved RAMS. For work at height, excavation, lifting, hot works or confined spaces, they are effectively mandatory — the ticket onto the site.`,
      },
      { type: 'h2', text: 'How to write a risk assessment: the five steps' },
      {
        type: 'p',
        text: `The HSE's long-standing approach breaks a risk assessment into five plain steps:`,
      },
      {
        type: 'ol',
        items: [
          `**Identify the hazards** — walk the task and the site, and be honest about what could cause harm: the edge, the dust, the moving plant, the buried service.`,
          `**Decide who might be harmed and how** — your own crew, other trades, the public, lone workers, young or new workers.`,
          `**Evaluate the risks and decide on controls** — follow the hierarchy: eliminate the hazard if you can, then reduce, isolate and control, with PPE as the last line, not the first.`,
          `**Record your significant findings** — write down the hazards, who is at risk, and the controls. If you have five or more employees this is a legal duty, not an option.`,
          `**Review and update** — a risk assessment is not a document you write once. Revisit it when the work changes, when something goes wrong, or when a near miss tells you a control isn't holding.`,
        ],
      },
      { type: 'h2', text: 'What a good method statement contains' },
      {
        type: 'p',
        text: `A method statement should let someone who wasn't in the planning meeting carry out the task safely. In practice that means:`,
      },
      {
        type: 'ul',
        items: [
          `**The task and its sequence** — a clear, step-by-step description of the work, in the order it happens.`,
          `**Who does what** — roles, responsibilities, and the competence or training each step requires.`,
          `**Plant, equipment and materials** — what is used, and the safety checks it needs before use.`,
          `**The control measures from the risk assessment** — carried through into the actual method, not left behind on the other document.`,
          `**Emergency arrangements** — what happens if it goes wrong: rescue, first aid, who to call.`,
        ],
      },
      { type: 'h2', text: 'The RAMS problem nobody talks about' },
      {
        type: 'p',
        text: `The failure mode of RAMS is not writing them — it is what happens after. A method statement approved in an office, printed, signed at induction and never looked at again is a document that protects a filing cabinet, not a worker. The site changes, a new hazard appears, an incident happens — and the RAMS says none of it.`,
      },
      {
        type: 'p',
        text: `The regulations are clear that a risk assessment must be **reviewed** when circumstances change or when there is reason to think it is no longer valid. The single strongest reason to think that is your own incident and [near-miss data](/insights/near-miss-reporting-safety-culture). If workers keep reporting near misses around a task your RAMS calls "low risk", the document is wrong and the reports are right. A [toolbox talk](/insights/toolbox-talks-that-work) is how you brief the RAMS to the crew; an incident report is how the crew tells you the RAMS needs updating.`,
      },
      {
        type: 'callout',
        title: 'Keep RAMS alive',
        text: `Treat your RAMS as a living control, not a one-off admission ticket. Every incident and near miss your teams report is feedback on whether the controls are working — feed it straight back into the assessment, and the document starts protecting people instead of paperwork.`,
      },
      {
        type: 'p',
        text: `That feedback loop is exactly what jobsafe is built to power. Workers [capture incidents and near misses in seconds](/academy) from the phone in their pocket — with photos, location and time attached — and a live dashboard shows you where reports cluster, so you know which RAMS to revisit before the next job, not after the next injury. [See how reporting works](/academy), or call us on 0333 8000 883.`,
      },
    ],
    sources: [
      { label: 'Management of Health and Safety at Work Regulations 1999, reg. 3', href: 'https://www.legislation.gov.uk/uksi/1999/3242/regulation/3/made' },
      { label: 'Construction (Design and Management) Regulations 2015, reg. 13', href: 'https://www.legislation.gov.uk/uksi/2015/51/regulation/13/made' },
      { label: 'HSE — Risk assessment: Managing risks and risk assessment at work', href: 'https://www.hse.gov.uk/simple-health-safety/risk/index.htm' },
      { label: 'HSE — Method statements (construction)', href: 'https://www.hse.gov.uk/construction/lwp/method-statements.htm' },
    ],
    related: ['toolbox-talks-that-work', 'how-to-investigate-a-workplace-accident'],
  },

  {
    slug: 'how-to-investigate-a-workplace-accident',
    title: 'How to Investigate a Workplace Accident: Finding the Root Cause, Not the Blame',
    description:
      'A practical guide to accident investigation the HSE way: the four steps of HSG245, immediate vs underlying vs root causes, the 5 Whys, and how to prevent a repeat.',
    excerpt:
      "An accident investigation that ends at \"the worker wasn't careful\" hasn't found the cause — it's found somewhere to stop looking. Here's how to investigate the HSE way, and actually prevent the next one.",
    category: 'Safety Culture',
    keywords: [
      'accident investigation',
      'how to investigate an accident at work',
      'root cause analysis',
      '5 whys',
      'immediate underlying root cause',
      'HSG245',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 8,
    content: [
      {
        type: 'p',
        text: `When something goes wrong at work, there is a strong pull toward the quickest explanation: the worker was careless, they rushed, they didn't follow the rules. It feels like an answer, and it closes the file. It is also almost never the real cause — and an investigation that stops there guarantees the same thing happens again to someone else. This guide sets out how to investigate a workplace accident properly, using the HSE's own framework.`,
      },
      {
        type: 'p',
        text: `The prize is not paperwork. It is the third word of **Record. Resolve. Prevent.** — turning an incident into the specific, lasting change that stops the next one.`,
      },
      { type: 'h2', text: 'Why investigate at all?' },
      {
        type: 'p',
        text: `There are three reasons, and they reinforce each other:`,
      },
      {
        type: 'ul',
        items: [
          `**To prevent recurrence** — the only reason that actually matters. Every accident is a lesson already paid for; the investigation is how you collect it.`,
          `**To meet your legal duties** — investigating helps you show you are managing risk, and it underpins accurate [RIDDOR reporting](/insights/riddor-reporting-explained) where the incident is reportable.`,
          `**To protect the organisation** — a thorough, contemporaneous investigation is your evidence if a claim or prosecution follows months later.`,
        ],
      },
      { type: 'h2', text: 'The four steps of an investigation' },
      {
        type: 'p',
        text: `The HSE's guidance **HSG245, "Investigating accidents and incidents"**, sets out a four-step structure that scales from a near miss to a serious injury:`,
      },
      {
        type: 'ol',
        items: [
          `**Gather the information** — collect the facts while they are fresh: the scene, photographs, positions, equipment, and accounts from those involved and any witnesses. Physical evidence and memories both decay fast, so this step is urgent.`,
          `**Analyse the information** — work out what happened and why, separating the immediate cause from the deeper ones (see below). This is where most investigations either succeed or give up too early.`,
          `**Identify risk control measures** — decide what needs to change so it cannot happen again, choosing controls high up the hierarchy rather than another sign or another briefing.`,
          `**Action and implement** — turn those measures into a plan with owners and deadlines, then check they were actually done and that they worked.`,
        ],
      },
      { type: 'h2', text: 'The three levels of cause' },
      {
        type: 'p',
        text: `The heart of a good investigation is refusing to stop at the obvious. HSG245 asks you to find three layers of cause:`,
      },
      {
        type: 'ul',
        items: [
          `**Immediate cause** — the most obvious agent of harm. The guard was missing; the worker slipped; the load fell.`,
          `**Underlying cause** — the less obvious condition that let the immediate cause exist. The guard was removed because it slowed the job and nobody replaced it; the floor was wet because a leak went unreported.`,
          `**Root cause** — the failing in the management system from which the rest springs. There was no system to check guards were refitted; there was no easy way to report the leak, so nobody did.`,
        ],
      },
      {
        type: 'quote',
        text: `The immediate cause tells you what happened. The root cause tells you why your organisation let it happen — and it is the only level at which a fix actually prevents a repeat.`,
      },
      { type: 'h2', text: 'The 5 Whys: a simple tool that works' },
      {
        type: 'p',
        text: `You do not need complex methodology to reach a root cause. The **5 Whys** — asking "why?" of each answer until you run out of system failures to expose — is often enough:`,
      },
      {
        type: 'ol',
        items: [
          `A worker cut their hand on a machine. **Why?** The guard wasn't in place.`,
          `**Why?** It had been removed to clear a jam and not refitted.`,
          `**Why?** Clearing jams by hand is quicker, and it's done several times a shift.`,
          `**Why?** The machine jams often and nobody has reported it as a problem.`,
          `**Why?** Reporting a recurring fault is a hassle, so people just work around it.`,
        ],
      },
      {
        type: 'p',
        text: `"The worker was careless" would have stopped at the first line. Five questions later the real fix is obvious: make the machine jam less, and make reporting the fault easier than working around it. That is a root-cause fix; "be more careful" is not.`,
      },
      { type: 'h2', text: 'Investigate the system, not the person' },
      {
        type: 'p',
        text: `The fastest way to kill your own investigations is to use them to assign blame. The moment workers believe that reporting an incident, or telling the truth about one, will get someone disciplined, the information dries up — and information is the entire raw material of prevention. A **just culture** distinguishes an honest mistake from genuine recklessness, and treats the first as a chance to learn. It is not softness; it is the only way to keep the [near misses and reports flowing](/insights/near-miss-reporting-safety-culture) that let you see risk before it becomes injury.`,
      },
      { type: 'h2', text: 'The investigation is only as good as the data' },
      {
        type: 'p',
        text: `Step one — gather the information — is where most investigations are quietly lost. A report scribbled in a notebook hours later, with no photo of the scene, no exact time, no location, and a fading memory of who was where, cannot support a serious analysis. For a field workforce it is harder still: the incident happens miles from the office, and by the time anyone with a clipboard arrives, the scene is gone.`,
      },
      {
        type: 'p',
        text: `This is precisely the gap jobsafe closes. The person who was there [captures the incident in seconds](/academy), on the phone in their pocket — photos of the scene, automatic location and timestamp, an account while it is fresh — and it reaches a supervisor instantly. From there the built-in resolution flow carries the report from raised, to investigated, to closed, with actions assigned and a full audit trail, so the "action and implement" step doesn't quietly evaporate. [See how it works](/academy), and read [what RIDDOR requires](/insights/riddor-reporting-explained) when an investigated incident crosses the reporting threshold.`,
      },
    ],
    sources: [
      { label: 'HSE — HSG245: Investigating accidents and incidents', href: 'https://www.hse.gov.uk/pubns/priced/hsg245.pdf' },
      { label: 'HSE — Investigating accidents and incidents (overview)', href: 'https://www.hse.gov.uk/managing/re-active-monitoring.htm' },
      { label: 'HSE — Root causes and human factors', href: 'https://www.hse.gov.uk/humanfactors/topics/root-causes.htm' },
      { label: 'HSE — RIDDOR: reporting requirements', href: 'https://www.hse.gov.uk/riddor/' },
    ],
    related: ['near-miss-reporting-safety-culture', 'accident-book-requirements-uk'],
  },

  {
    slug: 'first-aid-at-work-requirements',
    title: 'First Aid at Work: How Many First Aiders Do You Actually Need?',
    description:
      'A plain guide to UK first-aid law: the needs assessment, how many first aiders are required for low and higher-hazard workplaces, and what appointed persons, EFAW and FAW mean.',
    excerpt:
      'There is no magic number of first aiders — the law hands you a needs assessment instead. Here is how to work out what your workplace actually requires, without guessing.',
    category: 'Compliance',
    keywords: [
      'first aid at work requirements',
      'how many first aiders do I need',
      'first aid needs assessment',
      'first aider ratio',
      'EFAW FAW appointed person',
      'first aid regulations 1981',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 7,
    content: [
      {
        type: 'p',
        text: `"How many first aiders do we need?" is one of the most common health-and-safety questions employers ask — and one of the few the law deliberately refuses to answer with a single number. Instead it hands you a duty: work it out for **your** workplace, based on **your** risks. This guide explains the legal requirement, how to carry out the needs assessment, and the numbers the HSE suggests as a starting point.`,
      },
      {
        type: 'stats',
        items: [
          { value: '1981', label: 'the First-Aid Regulations that set the duty' },
          { value: '1', label: 'first aider per 50 in higher-hazard workplaces (guide)' },
          { value: '1', label: 'first aider per 100 in low-hazard workplaces (guide)' },
          { value: '0', label: 'fixed legal minimum — the needs assessment decides' },
        ],
      },
      { type: 'h2', text: 'What the law actually requires' },
      {
        type: 'p',
        text: `The duty comes from the **Health and Safety (First-Aid) Regulations 1981**. Every employer must provide **adequate and appropriate** equipment, facilities and personnel so that employees who are injured or taken ill at work receive immediate attention. Note the two words doing the work: adequate and appropriate. The law does not set a ratio because a quiet office and a busy construction site plainly need different provision. What is "appropriate" is for you to determine — through a first-aid needs assessment.`,
      },
      { type: 'h2', text: 'The first-aid needs assessment' },
      {
        type: 'p',
        text: `The needs assessment is the starting point for all first-aid provision, and it is where the real thinking happens. The HSE expects you to weigh:`,
      },
      {
        type: 'ul',
        items: [
          `**The nature of the work and its hazards** — an office and a workshop with dangerous machinery are not the same risk.`,
          `**The size of the workforce** — more people, more provision.`,
          `**Your accident and ill-health history** — what has actually happened here, and what nearly did.`,
          `**The spread of the workforce** — multiple sites, remote locations, and work patterns like shifts and lone working.`,
          `**Distance from emergency services**, and the needs of any travelling, remote or lone workers.`,
        ],
      },
      { type: 'h2', text: 'The three types of first-aid personnel' },
      {
        type: 'p',
        text: `The rules distinguish three roles, and the jargon matters when you write your provision down:`,
      },
      {
        type: 'ul',
        items: [
          `**Appointed person** — takes charge of first-aid arrangements: looks after the equipment and calls the emergency services. An appointed person needs **no formal first-aid training**.`,
          `**EFAW (Emergency First Aid at Work)** — a one-day trained first aider, able to give emergency first aid.`,
          `**FAW (First Aid at Work)** — a three-day trained first aider, able to deal with a wider range of injuries and illnesses.`,
        ],
      },
      { type: 'h2', text: 'The HSE’s suggested numbers' },
      {
        type: 'p',
        text: `The HSE stresses these are a **guide**, not a legal ratio — your needs assessment can require more. But as a starting point:`,
      },
      { type: 'h3', text: 'Low-hazard workplaces (offices, shops, libraries)' },
      {
        type: 'ul',
        items: [
          `**Fewer than 25 employees** — at least one appointed person.`,
          `**25 to 50 employees** — at least one first aider trained in EFAW.`,
          `**More than 50 employees** — at least one FAW-trained first aider for every 100 employed (or part thereof).`,
        ],
      },
      { type: 'h3', text: 'Higher-hazard workplaces (construction, warehousing, engineering, manufacturing)' },
      {
        type: 'ul',
        items: [
          `**Fewer than 5 employees** — at least one appointed person.`,
          `**5 to 50 employees** — at least one first aider trained in EFAW or FAW, depending on the type of injuries that might occur.`,
          `**More than 50 employees** — at least one FAW-trained first aider for every 50 employed (or part thereof).`,
        ],
      },
      {
        type: 'callout',
        title: "Don't forget cover, not just count",
        text: `A single first aider is no cover at all once you account for holidays, sickness and shift patterns. Your assessment has to guarantee provision at all times people are at work — which usually means more trained people than the bare guide numbers suggest.`,
      },
      { type: 'h2', text: 'The field and lone-worker problem' },
      {
        type: 'p',
        text: `The suggested numbers assume people are gathered on one site. A dispersed field workforce breaks that assumption: an engineer working alone, an hour from the nearest colleague, cannot share the site's first aider. For [lone and remote workers](/insights/lone-worker-safety-guide) the needs assessment has to consider personal first-aid provision, training, and — critically — how an incident is raised and located when there is no one else there to raise it.`,
      },
      { type: 'h2', text: 'When first aid is given, record it' },
      {
        type: 'p',
        text: `First-aid provision and incident recording are two halves of the same duty. Every time first aid is administered, the details should be recorded — what happened, to whom, when, and what was done. That record feeds your [accident book obligations](/insights/accident-book-requirements-uk), informs the next needs assessment, and starts the clock on [RIDDOR reporting](/insights/riddor-reporting-explained) if the injury turns out to be reportable.`,
      },
      {
        type: 'p',
        text: `This is where jobsafe earns its place alongside the first-aid kit: the moment first aid is given, the incident is [captured in seconds](/academy) on a phone — with location, time and photos — reaches a supervisor instantly, and is stored with a full audit trail. For a lone worker miles from base, that automatic location on a report can be the fastest way to get help to the right place. [See how it works](/academy), or call us on 0333 8000 883.`,
      },
    ],
    sources: [
      { label: 'Health and Safety (First-Aid) Regulations 1981', href: 'https://www.legislation.gov.uk/uksi/1981/917/contents' },
      { label: 'HSE — First aid at work: your questions answered (INDG214)', href: 'https://www.hse.gov.uk/pubns/indg214.htm' },
      { label: 'HSE — First aid needs assessment', href: 'https://www.hse.gov.uk/first-aid/employer-responsibilities.htm' },
      { label: 'HSE — First aid at work (L74 Approved Code of Practice)', href: 'https://www.hse.gov.uk/pubns/priced/l74.pdf' },
    ],
    related: ['accident-book-requirements-uk', 'lone-worker-safety-guide'],
  },

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
    related: ['riddor-changes-2026-consultation', 'accident-book-requirements-uk'],
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

  {
    slug: 'accident-book-requirements-uk',
    title: "The Accident Book: What UK Law Actually Requires — and What It Doesn't",
    description:
      'Who must keep an accident book, what goes in an entry, how long to keep records, the GDPR rules, and whether an electronic accident book is legal in the UK.',
    excerpt:
      "Most workplaces have an accident book. Far fewer could say which law requires it, what belongs in an entry, or how long records must be kept. Here are the actual rules — including the one that says it doesn't have to be a book at all.",
    category: 'Compliance',
    keywords: [
      'accident book requirements',
      'is an accident book a legal requirement',
      'BI 510 accident book',
      'how long to keep accident book records',
      'electronic accident book',
      'accident book GDPR',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 7,
    content: [
      {
        type: 'p',
        text: `The accident book is one of the most familiar objects in British working life — a dog-eared pad in a drawer in the site office, half-filled in, rarely read. It is also one of the most misunderstood. The duty to keep it does not come from health and safety law at all, the rules about who needs one are more specific than most people think, and the regulation behind it explicitly allows something better than paper. This guide sets out what the law actually requires.`,
      },
      {
        type: 'stats',
        items: [
          { value: '10+', label: 'employees at premises where an accident book is required' },
          { value: '3 years', label: 'minimum retention, from the date of the entry' },
          { value: '1979', label: 'the regulations the duty comes from' },
          { value: '2018', label: 'current BI 510 edition, revised for GDPR' },
        ],
      },
      { type: 'h2', text: 'Is an accident book a legal requirement?' },
      {
        type: 'p',
        text: `Yes — for most employers of any size, though the duty comes from an unexpected place. It is not RIDDOR, and it is not the Health and Safety at Work Act. The accident book is required by **regulation 25 of the Social Security (Claims and Payments) Regulations 1979** — benefits law, not safety law. Its original purpose was to preserve the evidence an employee needs to claim industrial injuries benefit: an accident recorded at the time, in a form the Department for Work and Pensions will accept.`,
      },
      {
        type: 'p',
        text: `Regulation 25 applies to every owner or occupier of a **mine or quarry**, every employer at premises covered by the **Factories Act 1961**, and — the clause that catches nearly everyone else — every employer with **ten or more people normally employed at the same time on or about the same premises**.`,
      },
      {
        type: 'callout',
        title: 'Under ten employees?',
        text: `The regulation 25 duty may not bite, but you are not off the hook: RIDDOR separately requires you to keep records of reportable injuries and over-three-day injuries whatever your headcount, and an accident record is the first thing an insurer, a solicitor or an HSE inspector will ask for. In practice, every employer should keep one.`,
      },
      { type: 'h2', text: "It doesn't have to be a book" },
      {
        type: 'p',
        text: `The regulation's own wording is the part almost nobody quotes. Employers must keep readily accessible a means, **"whether in a book or books or by electronic means"**, by which employees can record the particulars of an accident. Electronic accident records are not a grey area or a workaround — they are named in the regulation itself. What matters is that the record is readily accessible to your workers, captures the required particulars, and is preserved.`,
      },
      { type: 'h2', text: 'What goes in an entry' },
      {
        type: 'p',
        text: `The "appropriate particulars" an accident record must capture are:`,
      },
      {
        type: 'ul',
        items: [
          `**Who was hurt** — the injured person's full name, address and occupation.`,
          `**What happened** — the date and time of the accident, where it happened, and the cause and nature of the injury.`,
          `**Who made the entry** — the name, address and occupation of the person recording it, if it was not the injured person themselves.`,
        ],
      },
      {
        type: 'p',
        text: `Note who is allowed to make the entry: the injured employee **or someone acting on their behalf**. A worker cannot be required to fill it in personally, and an entry made by a colleague or supervisor on their behalf is equally valid.`,
      },
      { type: 'h2', text: 'How long must accident records be kept?' },
      {
        type: 'p',
        text: `**At least three years from the date the entry was made.** Not three years from the end of the year, and not three years from the accident — from the entry. In practice, keeping records for longer is often sensible: personal injury claims can be brought up to three years from the date of injury (longer in some circumstances), and patterns across years are exactly what a good safety review looks for.`,
      },
      { type: 'h2', text: 'The GDPR problem with the traditional book' },
      {
        type: 'p',
        text: `An accident entry is personal data — a name, an address, and information about a person's health. A traditional accident book, where every previous entry is visible to whoever fills in the next one, sits badly with UK GDPR. This is why the current **BI 510 (2018 edition)** was redesigned with perforated, tear-out pages: the entry is completed, removed and stored confidentially, leaving no personal data in the book itself.`,
      },
      {
        type: 'p',
        text: `If you are still using an older book where entries accumulate in full view, that is worth fixing this week, not this quarter. An electronic record with proper access controls solves the same problem more cleanly: each entry is visible only to the people who need it, and nothing is left in a drawer.`,
      },
      { type: 'h2', text: 'Accident book vs RIDDOR: recording is not reporting' },
      {
        type: 'p',
        text: `The accident book and RIDDOR are separate duties that meet at the same incident. Every recordable accident goes in the book; only some of them must also be **reported** to the HSE. Deaths, specified injuries, over-seven-day incapacitation, certain occupational diseases and dangerous occurrences cross the reporting threshold — and the accident record is usually the evidence that starts the clock. If you are not confident where that threshold sits, read our [plain-English guide to RIDDOR reporting](/insights/riddor-reporting-explained) — and note that [RIDDOR itself is now changing](/insights/riddor-changes-2026-consultation).`,
      },
      { type: 'h2', text: 'Where paper falls down' },
      {
        type: 'p',
        text: `The legal minimum is a book in a drawer. The practical problem is everything the minimum does not do: a paper entry cannot alert a supervisor, cannot attach the photo that shows the unguarded edge, cannot be found from head office at 6pm on a Friday, and cannot tell you that this is the third hand injury in the same workshop this quarter. For a field workforce it is worse — the book is in the office, and the accident is forty miles away.`,
      },
      {
        type: 'p',
        text: `That gap is what jobsafe closes. Workers [record an incident in seconds](/academy) from the phone in their pocket — photos, location and time captured automatically, online or off — supervisors are alerted instantly, every record is stored confidentially with a full audit trail, and the three-year retention takes care of itself. The regulation has allowed "electronic means" since before smartphones existed; the tools have finally caught up.`,
      },
      {
        type: 'p',
        text: `Want the fastest way to see it? Watch the [60-second lessons in the jobsafe academy](/academy), or call us on 0333 8000 883.`,
      },
    ],
    sources: [
      { label: 'Social Security (Claims and Payments) Regulations 1979, reg. 25', href: 'https://www.legislation.gov.uk/uksi/1979/628/regulation/25' },
      { label: 'HSE — Accident book BI 510 (2018 edition)', href: 'https://www.hse.gov.uk/pubns/books/accident-book.htm' },
      { label: 'HSE — RIDDOR: What records must I keep?', href: 'https://www.hse.gov.uk/riddor/what-must-i-keep.htm' },
      { label: 'HSENI — Accident records', href: 'https://www.hseni.gov.uk/articles/accident-records' },
    ],
    related: ['riddor-reporting-explained', 'riddor-changes-2026-consultation'],
  },

  {
    slug: 'riddor-changes-2026-consultation',
    title: 'RIDDOR Is Changing: What the 2026 Reform Proposes — and How to Get Ahead of It',
    description:
      'The HSE has consulted on the biggest RIDDOR shake-up since 2013: reportable diseases up from 6 to 19, clearer definitions, revised dangerous occurrences. What to do now.',
    excerpt:
      'The HSE has just closed a consultation on the biggest overhaul of RIDDOR since 2013 — tripling the list of reportable diseases and rewriting definitions that have confused employers for a decade. Here is what is proposed, and what smart employers are doing before the rules land.',
    category: 'Compliance',
    keywords: [
      'RIDDOR changes 2026',
      'RIDDOR reform consultation',
      'new RIDDOR reportable diseases',
      'is silicosis reportable under RIDDOR',
      'noise induced hearing loss RIDDOR',
      'RIDDOR 2027',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 7,
    content: [
      {
        type: 'p',
        text: `RIDDOR has barely moved since 2013. That is about to change. On 7 April 2026 the Health and Safety Executive opened a public consultation on reforming the **Reporting of Injuries, Diseases and Dangerous Occurrences Regulations** — the first wholesale revisit in over a decade — and it closed on 30 June 2026. The headline proposal more than triples the list of reportable occupational diseases. If your teams work with dust, noise or fibrous materials, your reporting obligations are very likely about to grow.`,
      },
      {
        type: 'stats',
        items: [
          { value: '6 → 19', label: 'proposed reportable occupational diseases' },
          { value: '9', label: 'previously removed diseases set to return' },
          { value: '4', label: 'conditions reportable for the first time' },
          { value: '30 Jun 2026', label: 'consultation closed; response awaited' },
        ],
      },
      { type: 'h2', text: 'Why the HSE is reopening RIDDOR' },
      {
        type: 'p',
        text: `Two pressures have been building. The first is **occupational disease**: the 2013 reforms cut the reportable disease list hard, and the HSE has been criticised ever since for flying blind on long-latency conditions — most visibly the resurgence of **silicosis** linked to engineered-stone worktops, which prompted new enforcement measures on respirable silica dust in May 2026. The second is **clarity**: a decade of case law and inspector experience has shown which RIDDOR definitions employers consistently get wrong, and the consultation proposes rewriting the ambiguous ones.`,
      },
      { type: 'h2', text: 'What the consultation proposes' },
      { type: 'h3', text: 'A much longer disease list' },
      {
        type: 'p',
        text: `The list of reportable occupational diseases would grow from six conditions to **nineteen**. Nine diseases removed in 2013 return — including **asbestosis**, **pneumoconiosis** (which covers silicosis) and beryllium-related lung and skin disease. Four conditions become reportable for the first time, including **noise-induced hearing loss**, **bronchiolitis obliterans** and **occupational allergic rhinitis**.`,
      },
      { type: 'h3', text: 'More people able to diagnose' },
      {
        type: 'p',
        text: `Today a disease only becomes reportable once a **GMC-registered doctor** has diagnosed it in writing. The HSE proposes widening this to other registered healthcare practitioners — which would remove a bottleneck, and mean diagnoses reach the reporting threshold sooner and more often.`,
      },
      { type: 'h3', text: 'Clearer definitions, revised dangerous occurrences' },
      {
        type: 'p',
        text: `The consultation also proposes clarifying terminology that has proven ambiguous in practice, and revising the schedule of **dangerous occurrences** — the high-potential near misses that must be reported even when nobody is hurt — to better reflect modern workplace risk.`,
      },
      { type: 'h2', text: 'What this means for employers' },
      {
        type: 'ul',
        items: [
          `**More reports, from more trades.** Construction, stone and concrete work, foundries, manufacturing and any noisy environment should expect conditions they currently only record internally — if at all — to become legally reportable.`,
          `**Health surveillance becomes reporting-critical.** If noise-induced hearing loss becomes reportable, audiometry results stop being a private occupational-health matter and start feeding a legal duty.`,
          `**Exposure records matter more.** A disease report invites the obvious question: what was the exposure, when, and what did you do about it? Historic incident and near-miss records are the answer — if you have them.`,
        ],
      },
      { type: 'h2', text: 'When would the rules change?' },
      {
        type: 'p',
        text: `Nothing has changed yet. The consultation closed on 30 June 2026; the HSE is now analysing responses, and amended regulations are widely anticipated to follow — with commentators pointing to around 2027. Until then, [RIDDOR 2013 applies exactly as it stands](/insights/riddor-reporting-explained). But regulatory change of this shape rewards employers who move early, because disease reporting exposes the **history** of your record-keeping, not just its present.`,
      },
      {
        type: 'callout',
        title: 'Get ahead of it',
        text: `The employers this reform will hurt are the ones whose exposure history lives in memory and filing cabinets. Start now: capture every incident, near miss and health concern digitally, with dates, locations and photos attached, and the expanded list becomes an administrative update rather than a scramble.`,
      },
      {
        type: 'p',
        text: `That is the boring, decisive advantage of a system like jobsafe: every report your teams raise today — the dust complaint, the missing extraction, the noise concern — is timestamped, located and audit-ready years before anyone asks for it. [See how reports are raised in seconds](/academy), and make sure your [accident records meet the current rules](/insights/accident-book-requirements-uk) while you are at it.`,
      },
    ],
    sources: [
      { label: 'HSE Media Centre — consultation on workplace injury and illness reporting (07/04/2026)', href: 'https://press.hse.gov.uk/2026/04/07/hse-launches-consultation-on-workplace-injury-and-illness-reporting/' },
      { label: 'HSE — RIDDOR overview', href: 'https://www.hse.gov.uk/riddor/' },
      { label: 'DLA Piper — HSE consultation on RIDDOR reform', href: 'https://www.dlapiper.com/en-gb/insights/blogs/environment-health-safety-and-product-compliance/2026/hse-consultation-on-riddor-reform-what-you-need-to-know' },
      { label: 'Clyde & Co — proposed reform and expansion of RIDDOR', href: 'https://www.clydeco.com/en/insights/2026/april/hse-proposals-expand-reportable-occupational' },
      { label: 'British Safety Council — HSE proposes major overhaul to RIDDOR', href: 'https://www.britsafe.org/safety-management/2026/hse-proposes-major-overhaul-to-riddor-reporting-regulations' },
    ],
    related: ['riddor-reporting-explained', 'accident-book-requirements-uk'],
  },

  {
    slug: 'toolbox-talks-that-work',
    title: 'Toolbox Talks That Actually Work: A Practical Guide for UK Sites',
    description:
      'How long a toolbox talk should last, how often to run them, what to cover, the records inspectors expect to see, and how to stop site briefings going stale.',
    excerpt:
      'Every site runs toolbox talks. Most of them are ten minutes of being read at. Here is how to pick topics your crews actually need, keep talks short enough to stick, and keep the records that prove they happened.',
    category: 'Safety Culture',
    keywords: [
      'toolbox talks',
      'toolbox talk topics',
      'how long should a toolbox talk last',
      'toolbox talk frequency',
      'are toolbox talks a legal requirement',
      'toolbox talk records',
    ],
    author: 'The jobsafe Team',
    date: '2026-07-15',
    readingTime: 8,
    content: [
      {
        type: 'p',
        text: `A toolbox talk is the smallest unit of safety management: a short, informal briefing, delivered where the work happens, on one specific risk the crew is about to face. Done well, it is the most effective few minutes on the programme. Done badly — a laminated script read aloud to people looking at their boots — it is a signature-collection exercise that teaches one lesson only: safety here is paperwork. The difference is not budget. It is topic selection, length, and whether anyone follows up.`,
      },
      { type: 'h2', text: 'Are toolbox talks a legal requirement?' },
      {
        type: 'p',
        text: `Not by name — no regulation says "thou shalt hold toolbox talks". But the duties they discharge are very real. The **Health and Safety at Work etc. Act 1974** requires employers to provide the information, instruction and training needed to keep people safe. On construction sites, **CDM 2015** requires the principal contractor to ensure workers get a site induction and the ongoing information and training the work demands. Toolbox talks are the recognised, expected way of delivering that on a live site — and when an HSE inspector visits after an incident, evidence of relevant, recent briefings is among the first things they will ask to see.`,
      },
      { type: 'h2', text: 'How long, and how often?' },
      {
        type: 'p',
        text: `**Ten to fifteen minutes, one topic.** Shorter is better than longer: a five-minute talk that lands one point beats a half-hour tour of everything. Cover more ground by running them more often, not for longer.`,
      },
      {
        type: 'p',
        text: `There is no legally fixed frequency, so let risk set the rhythm. Weekly is a sensible baseline for most sites; fast-moving or high-risk phases justify daily. Beyond the routine, four triggers should always prompt a talk:`,
      },
      {
        type: 'ul',
        items: [
          `**A new task or phase starts** — brief the specific risks before the first hour, not after the first week.`,
          `**New people arrive** — an induction covers the site; a toolbox talk covers today.`,
          `**Conditions change** — weather, a new subcontractor overhead, a changed traffic route.`,
          `**Something just happened** — an incident or a near miss on your site, or on another site doing the same work, is the most compelling topic you will ever have.`,
        ],
      },
      { type: 'h2', text: 'Picking topics people actually need' },
      {
        type: 'p',
        text: `The stale rota — manual handling in January, ladders in February, round and round — is where toolbox talks go to die. The crews can predict the topic before the supervisor opens their mouth, which tells them the talk is about the calendar, not about them. Two better sources:`,
      },
      {
        type: 'p',
        text: `**Your own reports.** Your incident and [near-miss data](/insights/near-miss-reporting-safety-culture) is a ranked list of what is actually going wrong on your sites. Three reports about reversing plant in a month is next Monday's talk, with the photos from those reports on the screen. Nothing lands like "this happened here, last Tuesday".`,
      },
      {
        type: 'p',
        text: `**The work in front of you.** Brief what this crew does this week: work at height before the scaffold phase, silica dust before the chasing starts, buried services before the dig. The HSE publishes [free toolbox talk material](https://www.hse.gov.uk/construction/resources/toolboxtalks.htm) for the perennial construction risks — falls from height remain the biggest single killer of workers in Great Britain, accounting for roughly one death in four in the provisional 2025/26 figures — and it is a solid starting library to adapt to your site.`,
      },
      { type: 'h2', text: 'Delivering a talk that sticks' },
      {
        type: 'ul',
        items: [
          `**Hold it at the workface**, next to the risk you are describing, not in the canteen.`,
          `**Talk, don't read.** The script is your prompt, not your performance. If you cannot say it without the sheet, you don't know it yet.`,
          `**Make it two-way.** The people doing the task know where the real risk is. Ask what nearly went wrong last week, and be visibly pleased when someone answers.`,
          `**End on one action.** "From today, nobody walks behind the telehandler while it's loading" survives the morning. Seven bullet points do not.`,
          `**Close the loop.** If a talk surfaces a hazard, raise a report for it there and then, and act on it. A talk that changes nothing teaches that talking changes nothing.`,
        ],
      },
      { type: 'h2', text: 'The records that prove it happened' },
      {
        type: 'p',
        text: `For every talk, keep: the topic and a line on what was covered, the date, who delivered it, and who attended. This is the evidence chain that connects "we identified the risk" to "we briefed the people exposed to it" — the thing your principal contractor, your insurer and an inspector will each ask for, always after the fact, always in a hurry. A photographed sign-in sheet in a site WhatsApp is not a record system; a searchable, timestamped digital trail is.`,
      },
      {
        type: 'callout',
        title: 'The loop that makes talks self-improving',
        text: `Reports pick the topics; talks prompt the reports. Crews who see last week's near miss become this week's briefing start reporting more, because reporting visibly changes what the site pays attention to. That loop — record, resolve, prevent — is the whole game.`,
      },
      {
        type: 'p',
        text: `jobsafe powers that loop from the phone in every worker's pocket: incidents and near misses [reported in seconds](/academy), and a live dashboard that shows each site's pattern — so Monday's talk writes itself from what actually happened, not from what the rota says. [Watch how the reports come in](/academy), or read [what RIDDOR requires](/insights/riddor-reporting-explained) when a briefing topic turns into a reportable incident.`,
      },
    ],
    sources: [
      { label: 'HSE — Construction toolbox talks (free resources)', href: 'https://www.hse.gov.uk/construction/resources/toolboxtalks.htm' },
      { label: 'Construction (Design and Management) Regulations 2015', href: 'https://www.legislation.gov.uk/uksi/2015/51/contents' },
      { label: 'Health and Safety at Work etc. Act 1974, s.2', href: 'https://www.legislation.gov.uk/ukpga/1974/37/section/2' },
      { label: 'HSE — Fatal injury statistics', href: 'https://www.hse.gov.uk/statistics/fatals.htm' },
    ],
    related: ['near-miss-reporting-safety-culture', 'riddor-reporting-explained'],
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
