// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 module pages: the remaining modules and the bowtie page. One typed
// object per page, rendered by components/platform/module-page.tsx. Every
// fact comes from the Phase 3 brief's per-page notes, which come from the
// product code; nothing under `doNotClaim` is rendered. Two pages are gated
// on PHASE_3_INPUTS (`gate`): they exist only once the product ships the
// capability, and until then they are 404, out of the menu and the sitemap.
//
// Inputs assumed `no` (docs/PHASE-3.md): owners see overdue items in the
// in-app bell, never "are emailed"; nothing generates a PDF; nothing imports.
// ─────────────────────────────────────────────────────────────────────────────

import type { ModulePage } from './platform-modules.ts'

export const PHASE_3_MODULE_PAGES: readonly ModulePage[] = [
  {
    id: 'investigations',
    path: '/platform/investigations',
    display: 'Four levels down, on the report itself.',
    lead: 'Incident investigation software that runs a four-level ICAM root-cause analysis on the report, with the evidence gallery, the people involved, the activity timeline and the comments beside it. Investigating and sign-off are gated by role, and every finding becomes a corrective action.',
    hero: 'report-detail-desktop',
    proof: ['Four-level ICAM analysis', 'Evidence gallery on the report', 'Similar past reports', 'Role-gated sign-off', 'Actions raised from findings'],
    pains: [
      { pain: 'The investigation is a Word document in a folder, and the report it belongs to is somewhere else.', outcome: 'The analysis is a section of the report itself, next to the photos, the people and the timeline, so nothing has to be reconciled later.' },
      { pain: '“Operator error” is the root cause of everything, because that is where the form stops.', outcome: 'ICAM asks four levels of question: which defence was absent or failed, what the individual or team did, what the task and environment were like, and what the organisation set up.' },
      { pain: 'Nobody remembers that the same thing happened at the Leeds depot last spring.', outcome: 'Similar past reports appear on the record, matched by category, vehicle, area or site, so the pattern is in front of the investigator before they start.' },
    ],
    features: [
      {
        title: 'Four levels of ICAM, in order',
        lead: 'Absent or failed defences. Individual or team actions. Task and environmental conditions. Organisational factors. Each level is its own field on the report, so the analysis reads from the failed control back to what let it fail.',
        points: [
          { icon: 'shield-alert', title: 'Absent or failed defences', detail: 'The guard, the procedure or the check that should have stopped it.' },
          { icon: 'users', title: 'Individual or team actions', detail: 'What people did and did not do, without stopping there.' },
          { icon: 'search', title: 'Task, environment, organisation', detail: 'The conditions and the decisions that shaped the day.' },
        ],
        screenshot: 'report-detail-desktop',
      },
      {
        title: 'The evidence is on the record, not on a phone',
        lead: 'Photos, video and documents attached at the time of the report sit in the evidence gallery on the investigation. The people involved, the activity timeline and the comments sit on the same page.',
        points: [
          { icon: 'camera', title: 'Gallery on the record', detail: 'Every attachment on the report, where the investigator is working.' },
          { icon: 'users', title: 'People involved', detail: 'Injured, witness, first aider and involved, with their roles.' },
          { icon: 'clock', title: 'Timeline and comments', detail: 'Who did what to the record, and the discussion beside it.' },
        ],
        screenshot: 'report-detail-desktop',
      },
      {
        title: 'Similar past reports, and a lifecycle gated by role',
        lead: 'Rule-based matches on category, vehicle, area or site surface earlier reports as you work. Moving a report into investigation needs level 2 or above; signing it off needs level 3 or above, so the record shows who decided it was done.',
        points: [
          { icon: 'search', title: 'Similar past reports', detail: 'Matched on category, vehicle, area or site. No guesswork, no machine learning.' },
          { icon: 'lock', title: 'Investigating: level 2 and up', detail: 'Supervisors and above can take a report into investigation.' },
          { icon: 'check', title: 'Sign-off: level 3 and up', detail: 'Managers and above close it, and the record keeps who and when.' },
        ],
        screenshot: 'reports-register-desktop',
      },
    ],
    connected: ['incidents', 'actions', 'riddor', 'risk'],
    regulation: {
      title: 'Investigating, in UK law',
      paragraphs: [
        'The Management of Health and Safety at Work Regulations 1999 require employers to have arrangements for the effective planning, organisation, control, monitoring and review of their preventive and protective measures. Investigating what went wrong is how the review part is done.',
        'HSE’s guidance on investigating accidents and incidents (HSG245) describes a structured investigation from gathering information to analysing it and acting on the findings. ICAM, the Incident Cause Analysis Method, is one recognised way of doing the analysis: it works back from the failed defence to the organisational factors behind it.',
        'jobsafe records the analysis and the actions. It does not decide whether an incident is RIDDOR reportable for you; that is the RIDDOR module’s triage, and the submission to HSE is yours.',
      ],
    },
    faqs: [
      { q: 'What is ICAM in an incident investigation?', a: 'ICAM, the Incident Cause Analysis Method, works back from the failed defence through what people did, the conditions of the task and the organisational factors behind them. jobsafe records those four levels as fields on the report so the investigation is on the same record as the evidence.' },
      { q: 'Does jobsafe support 5-Whys or fishbone analysis?', a: 'No. The investigation is a four-level ICAM analysis. Other methods are not built into the product.' },
      { q: 'Who can investigate and who can sign off?', a: 'Moving a report into investigation needs role level 2 or above. Signing it off needs level 3 or above. The record keeps who did each.' },
      { q: 'How does jobsafe find similar past reports?', a: 'By rules, not machine learning: it matches on category, vehicle, area or site and lists the matches on the report.' },
      { q: 'Where do the findings go?', a: 'Each finding raises a corrective action with an owner and a due date on the action register, linked back to the report.' },
      { q: 'Does it work offline?', a: 'Yes, like every module. The analysis saves to the phone first and syncs when signal returns.' },
    ],
    doNotClaim: ['5-Whys, fishbone or other methods', 'machine-learning matching', 'push or email alerts', 'generated PDFs'],
    industries: ['/industries/transport-logistics', '/industries/construction', '/industries/manufacturing-warehousing'],
  },
  {
    id: 'actions',
    path: '/platform/corrective-actions',
    display: 'Every action from every module, on one register.',
    lead: 'Corrective action software with one register fed from reports, hazards, bowtie barriers, permits, fleet assets, checklist failures and training gaps. Each action has an owner, a due date and a status; overdue is worked out from the date, and the board shows where the work is stuck.',
    hero: 'actions-board-desktop',
    proof: ['One register, seven sources', 'Open, In progress, Closed', 'Overdue from the due date', 'List or board view', 'CSV export'],
    pains: [
      { pain: 'Actions live in the minutes of the meeting that raised them.', outcome: 'A report, a hazard, a barrier, a permit, an asset, a checklist failure or a training gap raises the action itself, and it lands on the one register with its source attached.' },
      { pain: 'Overdue means whoever noticed first.', outcome: 'Overdue is worked out from the due date, not from a status somebody has to remember to change, and owners see their overdue items in the in-app bell.' },
      { pain: 'The spreadsheet says who owns it; the owner has never seen the spreadsheet.', outcome: 'Owner and status change inline on the action, the notes timeline records the conversation, and the Assigned to me tab shows each person their own list.' },
    ],
    features: [
      {
        title: 'Fed from everywhere the record is made',
        lead: 'An investigation finding, a hazard on a risk assessment, a bowtie barrier, a permit’s “Chase pack”, a fleet asset, a failed checklist item or a training gap (“Book via action”) each raise an action. The source stays on it.',
        points: [
          { icon: 'clipboard-list', title: 'Reports and hazards', detail: 'Investigation findings and risk-assessment controls with owners.' },
          { icon: 'file-badge', title: 'Permits, fleet and checklists', detail: '“Chase pack” on a permit, an asset date, a failed walkaround item.' },
          { icon: 'graduation-cap', title: 'Training gaps', detail: '“Book via action” turns a gap in the matrix into work with a date.' },
        ],
        screenshot: 'actions-list-desktop',
      },
      {
        title: 'Three statuses, five tabs, two views',
        lead: 'Open, In progress and Closed are the statuses; Overdue is a fact about the due date. Tabs for Open, Overdue, Assigned to me, Closed and All, as a list or a board.',
        points: [
          { icon: 'circle-check', title: 'Open, In progress, Closed', detail: 'Three states. Overdue is computed, never typed.' },
          { icon: 'layout-dashboard', title: 'List or board', detail: 'The same actions as a filterable table or as columns.' },
          { icon: 'users', title: 'Assigned to me', detail: 'Each person’s own list, without a filter to set up.' },
        ],
        screenshot: 'actions-board-desktop',
      },
      {
        title: 'Change it where you read it',
        lead: 'Owner and status change inline. A notes timeline holds the conversation and the evidence of closure. Export the register to CSV for the board pack or the auditor.',
        points: [
          { icon: 'users', title: 'Inline owner and status', detail: 'No edit screen, no form to reopen.' },
          { icon: 'clock', title: 'Notes timeline', detail: 'What was done, by whom, when, on the action.' },
          { icon: 'download', title: 'CSV export', detail: 'The register, as a file, whenever you want it.' },
        ],
        screenshot: 'action-detail-desktop',
      },
    ],
    connected: ['investigations', 'risk', 'permits', 'fleet', 'training', 'dashboards'],
    regulation: {
      title: 'Closing the loop, in UK law',
      paragraphs: [
        'The Management of Health and Safety at Work Regulations 1999 require the preventive and protective measures that a risk assessment identifies to be put in place and reviewed. An action register is the evidence that the measure was assigned, done and checked.',
        'HSE’s management guidance (HSG65) frames it as plan, do, check, act. Corrective actions are the “act”, and the record of them is what an inspector, an insurer or a customer’s auditor asks to see after an incident.',
        'jobsafe keeps the actions and their history. It does not email anyone; owners see what is due and overdue in the in-app bell.',
      ],
    },
    faqs: [
      { q: 'What can raise a corrective action in jobsafe?', a: 'A report or investigation finding, a hazard on a risk assessment, a bowtie barrier, a permit (“Chase pack”), a fleet asset, a failed checklist item, and a training gap (“Book via action”). Each keeps its source.' },
      { q: 'What are the action statuses?', a: 'Open, In progress and Closed. Overdue is not a status you set: it is worked out from the due date.' },
      { q: 'Are owners emailed when an action is overdue?', a: 'No. Owners see overdue items in their in-app bell. Nothing is sent by email.' },
      { q: 'Can we see actions as a board?', a: 'Yes. The register has a list view and a board view, with tabs for Open, Overdue, Assigned to me, Closed and All.' },
      { q: 'Can we export the register?', a: 'Yes, to CSV, from the register.' },
    ],
    doNotClaim: ['email or push alerts', 'automatic escalation rules', 'generated PDFs'],
    industries: ['/industries/facilities-management', '/industries/manufacturing-warehousing', '/industries/construction'],
  },
  {
    id: 'fleet',
    path: '/platform/fleet-compliance',
    display: 'Every statutory date on every vehicle, before it lapses.',
    lead: 'Fleet compliance software for HGV tractor units, trailers, vans, forklifts, MEWPs and other plant: MOT or plating, road tax, insurance, next service and next safety inspection or LOLER thorough examination on each asset, with a keeper, odometer or hours, a history log, and a DVSA daily walkaround that raises an action when an item fails.',
    hero: 'fleet-cards-desktop',
    proof: ['HGVs, trailers, vans, forklifts, MEWPs, plant', 'MOT, tax, insurance, service, inspection', 'Statutory date passed: do not use', 'Due within 30 days', 'DVSA walkaround as a checklist'],
    pains: [
      { pain: 'The MOT date is in the transport office diary; the truck is in Glasgow.', outcome: 'Each asset card carries its MOT or plating, tax, insurance, service and inspection dates. Anything within 30 days shows as due soon; a passed statutory date is flagged, and the asset must not be used.' },
      { pain: 'The forklift’s thorough examination certificate is in a lever-arch file nobody has opened since the last audit.', outcome: 'The next safety inspection date on lifting plant is the LOLER thorough examination, kept on the asset with the rest of its history.' },
      { pain: 'The driver found the defect at 06:10 and told someone at 17:00.', outcome: 'The DVSA daily walkaround runs as a checklist on the phone, and a failed item raises an action on the register with the asset attached.' },
    ],
    features: [
      {
        title: 'One card per asset, with the dates that matter',
        lead: 'Asset types cover HGV tractor units, trailers, vans, forklifts, MEWPs and other plant, each with a readable ID like HGV-118 and, on vehicles, the registration. Statuses are In service, Service due, Off road and Disposed.',
        points: [
          { icon: 'truck', title: 'Vehicles and plant together', detail: 'Tractor units, trailers, vans, forklifts, MEWPs and other plant on one register.' },
          { icon: 'calendar', title: 'Five dates tracked', detail: 'MOT or plating, road tax, insurance, next service, next safety inspection.' },
          { icon: 'users', title: 'Keeper, odometer, hours', detail: 'Who has it, how far or how long it has run, and its history log.' },
        ],
        screenshot: 'asset-detail-desktop',
      },
      {
        title: 'Statutory means statutory',
        lead: 'MOT, insurance and the safety inspection are statutory dates: once one has passed, the asset must not be used, and the register says so. Anything within 30 days shows as due soon. The history log keeps every inspection, service, defect and compliance entry.',
        points: [
          { icon: 'shield-alert', title: 'Passed date, flagged', detail: 'A statutory date in the past is red on the card and in the list.' },
          { icon: 'clock', title: 'Due within 30 days', detail: 'Amber before it lapses, so the booking gets made.' },
          { icon: 'folder-open', title: 'History log', detail: 'Inspection, service, defect and compliance entries on the asset.' },
        ],
        screenshot: 'fleet-list-desktop',
      },
      {
        title: 'The daily walkaround, as a checklist',
        lead: 'DVSA daily walkaround checks run as a checklist on the driver’s phone, offline included. A failed item raises an action with the asset on it, so the defect is on the register before the truck leaves the yard.',
        points: [
          { icon: 'list-checks', title: 'DVSA walkaround', detail: 'The daily check, item by item, on the phone.' },
          { icon: 'circle-check', title: 'A fail raises an action', detail: 'Owner, due date and the asset, on the register.' },
          { icon: 'wifi-off', title: 'Works offline', detail: 'The yard at 06:00 rarely has signal. The check does not need it.' },
        ],
        screenshot: 'walkaround-fail-phone',
      },
    ],
    connected: ['actions', 'incidents', 'training', 'dashboards'],
    regulation: {
      title: 'Vehicles and lifting plant, in UK law',
      paragraphs: [
        'Lifting equipment used at work must be thoroughly examined under the Lifting Operations and Lifting Equipment Regulations 1998: every six months for equipment that lifts people and its accessories, every twelve months for other lifting equipment, or to a written scheme. Forklifts, MEWPs and tail lifts are lifting equipment. The Provision and Use of Work Equipment Regulations 1998 add the duty to keep work equipment maintained and inspected.',
        'Vehicles carry their own statutory dates: MOT or plating, road tax and insurance. HSE and DVSA guidance both expect a daily walkaround check before a heavy goods vehicle is driven and a record of defects found.',
        'jobsafe keeps the dates, the checks, the defects and the history on each asset. It is not telematics, it does not read tachograph data, and it does not claim to manage O-licence compliance or FORS or CLOCS accreditation.',
      ],
    },
    faqs: [
      { q: 'Which assets can jobsafe track?', a: 'HGV tractor units, trailers, vans, forklifts, MEWPs and other plant, each with a readable ID like HGV-118, a keeper, odometer or hours, and a history log.' },
      { q: 'Which dates does it track?', a: 'MOT or plating, road tax, insurance, next service and next safety inspection, which for lifting plant is the LOLER thorough examination. Anything within 30 days shows as due soon.' },
      { q: 'What happens when an MOT date passes?', a: 'MOT, insurance and inspection are statutory: once one has passed, the asset is flagged and must not be used.' },
      { q: 'Does it do the DVSA daily walkaround?', a: 'Yes. The walkaround runs as a checklist on the phone, offline included, and a failed item raises an action with the asset attached.' },
      { q: 'Is jobsafe telematics?', a: 'No. It does not track vehicles, read the tachograph or score driving, and it does not claim O-licence, FORS or CLOCS features. It keeps the dates, the checks and the incidents on each asset.' },
      { q: 'What are the asset statuses?', a: 'In service, Service due, Off road and Disposed.' },
    ],
    doNotClaim: ['telematics', 'tachograph data', 'O-licence compliance', 'FORS or CLOCS features', 'email or push reminders'],
    industries: ['/industries/transport-logistics', '/industries/manufacturing-warehousing', '/industries/field-services'],
    tools: [{ label: 'Accident frequency rate calculator', href: '/tools/accident-frequency-rate' }],
  },
  {
    id: 'training',
    path: '/platform/training-competence',
    display: 'Who is capable, who is in date, and where the gaps are.',
    lead: 'Training matrix software with two matrices: a competency matrix that scores each skill X or 1 to 4 against the target for the role, and a course matrix that shows Valid, Expiring, Expired, Booked, Not held or Not required for every course, with critical courses flagging the gaps that stop work. Gaps raise actions.',
    hero: 'training-matrix-desktop',
    proof: ['Competency scores X or 1–4', 'Role targets, gauges and charts', 'Course expiries at 90 days', 'Critical courses stop work', 'Gaps raise actions'],
    pains: [
      { pain: 'The training matrix is a spreadsheet with conditional formatting, and the colours were last right in March.', outcome: 'The course matrix works the status out from the dates: Valid, Expiring at 90 days or less, Expired, Booked, Not held, Not required.' },
      { pain: 'The banksman’s certificate expired, and the first person to notice was the auditor.', outcome: 'Critical courses flag the gaps that stop work, and a gap raises an action with an owner and a date.' },
      { pain: '“Competent” means whoever has been here longest.', outcome: 'Skills are scored against role targets, with gap and key-person flags and an assessment log with certificate references behind each score.' },
    ],
    features: [
      {
        title: 'The competency matrix',
        lead: 'Each skill is scored X or 1 to 4 against the target for the role. Gauges and charts show the team against target; gap and key-person flags show where one person is the only cover.',
        points: [
          { icon: 'graduation-cap', title: 'Scored against role targets', detail: 'X, or 1 to 4, per skill per person.' },
          { icon: 'layout-dashboard', title: 'Gauges and charts', detail: 'Team capability against target, at a glance.' },
          { icon: 'shield-alert', title: 'Gap and key-person flags', detail: 'Where the target is missed, and where one person is the only cover.' },
        ],
        screenshot: 'training-matrix-desktop',
      },
      {
        title: 'The course matrix',
        lead: 'Valid, Expiring (90 days or less), Expired, Booked, Not held or Not required, for every course and every person. Critical courses flag the gaps that stop work. Add your own courses beside IOSH, NEBOSH, Driver CPC, LOLER, forklift, banksman, confined space, first aid and fire marshal.',
        points: [
          { icon: 'calendar', title: 'Six statuses from the dates', detail: 'Expiring at 90 days; Expired the day after.' },
          { icon: 'shield-alert', title: 'Critical courses', detail: 'A gap on a critical course is a gap that stops work.' },
          { icon: 'list-checks', title: 'Custom courses', detail: 'Your own courses alongside the standard ones.' },
        ],
        screenshot: 'course-matrix-desktop',
      },
      {
        title: 'The log behind the score, and the plan ahead of it',
        lead: 'An assessment log holds each assessment with its certificate reference. A rule-based development plan lists what each person needs next. Gaps raise actions on the register, and “Book via action” puts the booking on someone’s list.',
        points: [
          { icon: 'folder-open', title: 'Assessment log', detail: 'Each assessment, dated, with the certificate reference.' },
          { icon: 'clipboard-list', title: 'Rule-based development plan', detail: 'What each person needs next, from the gaps.' },
          { icon: 'circle-check', title: 'Gaps raise actions', detail: '“Book via action”: the booking becomes an action with a date.' },
        ],
        screenshot: 'development-plan-desktop',
      },
    ],
    connected: ['actions', 'permits', 'fleet', 'documents'],
    regulation: {
      title: 'Competence, in UK law',
      paragraphs: [
        'The Health and Safety at Work etc. Act 1974 requires employers to provide the information, instruction, training and supervision needed for employees’ health and safety. The Management of Health and Safety at Work Regulations 1999 add that employers must take capabilities into account when giving tasks and must provide adequate training on recruitment, on a change of role, and when new equipment, technology or systems of work are introduced.',
        'Some competence is also statutory in its own right: forklift and MEWP operators need training and authorisation, and a lifting operation must be planned by a competent person. Driver CPC is a legal requirement for professional lorry and bus drivers.',
        'jobsafe records the scores, the courses, the assessments and the certificates. It does not connect to any card scheme or training provider; a CSCS-type card appears as a course record you enter.',
      ],
    },
    faqs: [
      { q: 'What is a training matrix?', a: 'A table of people against courses or skills showing who holds what and when it expires. jobsafe keeps two: a competency matrix scored against role targets, and a course matrix with Valid, Expiring, Expired, Booked, Not held and Not required statuses.' },
      { q: 'When does a course show as expiring?', a: 'At 90 days or less before its expiry date. The day after the date it shows as Expired.' },
      { q: 'What is a critical course?', a: 'A course marked critical flags a gap that stops work, so it is visible before the person is rostered on.' },
      { q: 'Can we add our own courses?', a: 'Yes. Custom courses sit beside the standard ones such as IOSH, NEBOSH, Driver CPC, LOLER, forklift, banksman, confined space, first aid and fire marshal.' },
      { q: 'What happens when there is a gap?', a: 'It raises an action on the register. “Book via action” turns the booking into an action with an owner and a date.' },
      { q: 'Does jobsafe connect to CSCS or a training provider?', a: 'No. Cards and certificates are course records you enter, with the certificate reference in the assessment log.' },
    ],
    doNotClaim: ['card scheme integration', 'training provider integration', 'email or push reminders', 'e-learning content'],
    industries: ['/industries/healthcare', '/industries/construction', '/industries/transport-logistics'],
  },
  {
    id: 'documents',
    path: '/platform/document-control',
    display: 'The current version, in front of the people allowed to see it.',
    lead: 'Document control software with a folder tree, a minimum access level per folder, drag-and-drop upload, automatic versioning when a file with the same name is uploaded, tags, and search that respects who is allowed to see what. Move, download and delete, with the version history kept.',
    hero: 'documents-tree-desktop',
    proof: ['Folder tree with access levels', 'Drag-and-drop upload', 'Same name, new version', 'Tags and search', 'Move, download, delete'],
    pains: [
      { pain: 'There are four versions of the manual handling procedure and three of them are on the noticeboard.', outcome: 'Uploading a file with the same name creates a new version; the folder shows the current one and keeps the history.' },
      { pain: 'The contractor can see the incident photos because the shared drive has one permission.', outcome: 'Each folder has a minimum access level, and search returns only what the person asking is allowed to see.' },
      { pain: 'The RAMS the client asked for is in someone’s email.', outcome: 'Drag it in, tag it, and it is in the folder tree with the rest of the site’s documents.' },
    ],
    features: [
      {
        title: 'Folders with a minimum access level',
        lead: 'The folder tree mirrors how the business files things. Each folder has a minimum role level to see it, so policies can be open to everyone while investigation files are not.',
        points: [
          { icon: 'folder-open', title: 'Folder tree', detail: 'Nest folders the way the business already thinks.' },
          { icon: 'lock', title: 'Minimum access level', detail: 'Per folder. Below the level, the folder is not there.' },
          { icon: 'search', title: 'Search that respects access', detail: 'Results only include what the searcher may see.' },
        ],
        screenshot: 'documents-tree-desktop',
      },
      {
        title: 'Same name, new version',
        lead: 'Drag and drop a file to upload it. Upload a file with the same name and it becomes a new version of the same document, with the previous versions kept.',
        points: [
          { icon: 'arrow-up-from-line', title: 'Drag-and-drop upload', detail: 'From the desktop into the folder.' },
          { icon: 'refresh-cw', title: 'Automatic versioning', detail: 'The same name means the next version, not a duplicate.' },
          { icon: 'clock', title: 'History kept', detail: 'Earlier versions stay on the record.' },
        ],
        screenshot: 'document-versions-desktop',
      },
      {
        title: 'Move, tag, download, delete',
        lead: 'Move documents between folders, tag them so search finds them, download them for the inspector or the client, and delete what should go.',
        points: [
          { icon: 'folder-open', title: 'Move and delete', detail: 'Housekeeping without a support ticket.' },
          { icon: 'list-checks', title: 'Tags', detail: 'Cross-cutting labels, for search.' },
          { icon: 'download', title: 'Download', detail: 'The current version, as the file it is.' },
        ],
        screenshot: 'documents-tree-desktop',
      },
    ],
    connected: ['risk', 'training', 'permits', 'dashboards'],
    regulation: {
      title: 'Written procedures, in UK law',
      paragraphs: [
        'An employer with five or more employees must have a written health and safety policy under section 2(3) of the Health and Safety at Work etc. Act 1974, and must record the significant findings of risk assessments under the Management of Health and Safety at Work Regulations 1999. Method statements, permits, certificates and procedures are the documents an inspector or a client asks to see.',
        'jobsafe keeps them in folders with access levels and versions. It does not manage review dates, approval workflows, read-and-sign or expiry reminders; those are not built.',
      ],
    },
    faqs: [
      { q: 'How does versioning work?', a: 'Upload a file with the same name as an existing document and it becomes a new version of that document. The earlier versions are kept.' },
      { q: 'Can we restrict who sees a folder?', a: 'Yes. Each folder has a minimum access level. People below it do not see the folder, and search never returns its contents to them.' },
      { q: 'Does jobsafe track review dates or approvals?', a: 'No. Review dates, approval workflows, read-and-sign and expiry reminders are not built.' },
      { q: 'How do we find a document?', a: 'Browse the folder tree, or search by name and tag. Search respects access levels.' },
      { q: 'Can we download or delete documents?', a: 'Yes. Move, download and delete are available on each document.' },
    ],
    doNotClaim: ['review dates', 'approval workflows', 'read-and-sign', 'expiry reminders'],
    industries: ['/industries/facilities-management', '/industries/field-services', '/industries/healthcare'],
  },
  {
    id: 'dashboards',
    path: '/platform/dashboards',
    display: 'The four numbers a director asks for, live.',
    lead: 'Health and safety dashboards with the KPIs that matter on a Monday: open high-severity reports, overdue actions, incidents this week against last, and days since the last lost-time injury. A live incident feed, the category mix for 30 days, 90 days and year to date, hotspots by site, a 12-week trend, and a depot filter that applies across the whole app.',
    hero: 'dashboard-desktop',
    proof: ['Four KPIs', 'Live incident feed', 'Hotspots by site', '12-week trend', 'Depot filter across the app'],
    pains: [
      { pain: 'The monthly report is a week old the day it is sent.', outcome: 'The dashboard reads the record as it is now: open high-severity reports, overdue actions, incidents this week against last, and days since the last lost-time injury.' },
      { pain: 'Nobody can say which depot the incidents are coming from.', outcome: 'Hotspots by site show where, and a click filters the dashboard to that site.' },
      { pain: 'Is it getting better? Depends who you ask.', outcome: 'The 12-week trend, weekly or monthly, and the category mix over 30 days, 90 days and the year to date answer it the same way every time.' },
    ],
    features: [
      {
        title: 'Four KPIs and the live feed',
        lead: 'Open high-severity reports. Overdue actions. Incidents this week against last week. Days since the last lost-time injury. Under them, the live incident feed as reports come in.',
        points: [
          { icon: 'shield-alert', title: 'Open high-severity', detail: 'The reports that need someone today.' },
          { icon: 'circle-check', title: 'Overdue actions', detail: 'Worked out from due dates, never typed.' },
          { icon: 'clock', title: 'Days since the last LTI', detail: 'Counted from the record, reset by the record.' },
        ],
        screenshot: 'dashboard-desktop',
      },
      {
        title: 'Mix, hotspots and trend',
        lead: 'The category mix for 30 days, 90 days and year to date. Hotspots by site, where a click filters the dashboard. A 12-week trend, weekly or monthly.',
        points: [
          { icon: 'layout-dashboard', title: 'Category mix', detail: '30 days, 90 days, year to date.' },
          { icon: 'map-pin', title: 'Hotspots by site', detail: 'Click a site to see only its record.' },
          { icon: 'search', title: '12-week trend', detail: 'Weekly or monthly, the direction of travel.' },
        ],
        screenshot: 'dashboard-trend-desktop',
      },
      {
        title: 'One depot filter, everywhere',
        lead: 'Pick a depot and the whole app follows: the dashboard, the registers, the boards. A depot manager sees their depot; head office sees all of them.',
        points: [
          { icon: 'map-pin', title: 'Filter across the app', detail: 'Set once, applied to every screen.' },
          { icon: 'users', title: 'Depot managers see their depot', detail: 'Head office sees the network.' },
          { icon: 'smartphone', title: 'On the phone too', detail: 'The same KPIs, one-handed on site.' },
        ],
        screenshot: 'dashboard-phone',
      },
    ],
    connected: ['incidents', 'actions', 'riddor', 'fleet'],
    regulation: {
      title: 'Measuring performance, in UK law',
      paragraphs: [
        'The Management of Health and Safety at Work Regulations 1999 require arrangements for monitoring and review. HSE’s guidance on managing for health and safety (HSG65) describes measuring performance as the “check” in plan, do, check, act, using both active measures such as overdue actions and reactive measures such as incident counts.',
        'jobsafe shows the measures its record supports. It does not calculate TRIR or LTIFR, build custom dashboards or schedule reports; those are not built.',
      ],
    },
    faqs: [
      { q: 'What are the dashboard KPIs?', a: 'Open high-severity reports, overdue actions, incidents this week against last week, and days since the last lost-time injury.' },
      { q: 'Does jobsafe calculate TRIR or LTIFR?', a: 'No. Neither rate is built. The accident frequency rate calculator on this site shows the working for an AFR from your own figures.' },
      { q: 'Can we filter by depot?', a: 'Yes. The depot filter applies across the whole app, and clicking a site in the hotspots chart filters the dashboard to it.' },
      { q: 'Can we build our own dashboard or schedule a report?', a: 'No. Custom dashboards and scheduled reports are not built.' },
      { q: 'What periods does the category mix cover?', a: '30 days, 90 days and year to date. The trend covers 12 weeks, weekly or monthly.' },
    ],
    doNotClaim: ['custom dashboards', 'TRIR or LTIFR', 'scheduled reports', 'email digests'],
    industries: ['/industries/facilities-management', '/industries/manufacturing-warehousing'],
    tools: [{ label: 'Accident frequency rate calculator', href: '/tools/accident-frequency-rate' }],
  },
  {
    id: 'bowtie',
    path: '/platform/bowtie-analysis',
    display: 'Threats, consequences and the barriers between them.',
    lead: 'Bowtie analysis software that lives inside your risk assessments. Threats on the left, consequences on the right, and on every leg the barriers that stop the top event or limit the harm, typed, rated Effective, Degraded, Failed or Missing, with escalation factors recorded and a residual score you can adopt into the worksheet.',
    hero: 'risk-bowtie-desktop',
    proof: ['Inside the risk assessment', 'Five barrier types', 'Effective, Degraded, Failed, Not in place', 'Escalation factors', 'Barrier audit'],
    pains: [
      { pain: 'The bowtie was drawn in a workshop, photographed, and never looked at again.', outcome: 'The bowtie is a view of the risk assessment itself, so it is where the hazard, the controls and the actions already are.' },
      { pain: 'Every barrier on the diagram is drawn the same, whether it is a guard rail or a toolbox talk.', outcome: 'Each barrier is typed: passive hardware, active hardware, hardware and human, human procedural, or continuous. The type feeds the score.' },
      { pain: 'The leg with one barrier looks the same as the leg with four.', outcome: 'The barrier audit flags legs with no barrier or a single barrier, and every barrier rated failed or degraded.' },
    ],
    features: [
      {
        title: 'What a bowtie holds',
        lead: 'Threats on the left, consequences on the right, the top event in the middle. On each threat leg the preventive barriers; on each consequence leg the recovery barriers. Every barrier has a type: passive hardware, active hardware, hardware and human, human procedural, or continuous.',
        points: [
          { icon: 'shield-alert', title: 'Threats and consequences', detail: 'Each with its own barriers, left and right of the top event.' },
          { icon: 'list-checks', title: 'Five barrier types', detail: 'Passive hardware to continuous, so a guard rail and a briefing are not the same thing.' },
          { icon: 'clipboard-list', title: 'Inside the worksheet', detail: 'A view of the risk assessment, not a separate drawing.' },
        ],
        screenshot: 'risk-bowtie-desktop',
      },
      {
        title: 'Effectiveness and escalation',
        lead: 'Each barrier is rated Effective, Degraded, Failed or Not in place. Escalation factors, the things that make a barrier fail, are recorded against it. A barrier can carry a link to the permit, risk assessment, training record, asset or document that keeps it standing, shown on the diagram.',
        points: [
          { icon: 'check', title: 'Effective, Degraded, Failed, Not in place', detail: 'The rating that drives the score.' },
          { icon: 'shield-alert', title: 'Escalation factors', detail: 'Recorded against the barrier they weaken.' },
          { icon: 'file-badge', title: 'Linked evidence', detail: 'A link on the diagram to the permit, assessment, training record, asset or document.' },
        ],
        screenshot: 'bowtie-barrier-desktop',
      },
      {
        title: 'The score, and the audit',
        lead: 'A residual score is computed from the barriers and can be adopted into the worksheet, so the bowtie and the 5×5 agree. The barrier audit lists legs with no barrier or a single barrier and every barrier that is failed or degraded, each of which can raise an action.',
        points: [
          { icon: 'layout-dashboard', title: 'Computed residual score', detail: 'From the barriers. Adopt it into the worksheet in one step.' },
          { icon: 'search', title: 'Barrier audit', detail: 'No barrier, single barrier, failed, degraded: listed.' },
          { icon: 'circle-check', title: 'Findings raise actions', detail: 'Each weak point becomes work with an owner and a date.' },
        ],
        screenshot: 'bowtie-audit-desktop',
      },
    ],
    connected: ['risk', 'actions', 'permits', 'training', 'documents'],
    regulation: {
      title: 'Bowties and the duty to assess',
      paragraphs: [
        'Regulation 3 of the Management of Health and Safety at Work Regulations 1999 requires a suitable and sufficient assessment of the risks to employees and others. A bowtie is one way to show, for the risks that deserve it, which barriers stand between a threat and the top event and between the top event and its consequences, and how much can be relied on each.',
        'Bowtie analysis is a barrier-based method used widely in high-hazard industries, where safety cases have to demonstrate that the barriers are in place and effective. In jobsafe it is a view inside the risk assessment, not a separate tool, so the barriers, the actions and the score stay on one record.',
      ],
    },
    faqs: [
      { q: 'What is a bowtie assessment?', a: 'A bowtie assessment shows one hazard’s top event in the middle, the threats that could cause it on the left and the consequences on the right, with the barriers on each leg. It answers what stops the event, what limits the harm if it happens, and how much each barrier can be relied on.' },
      { q: 'What is the bow tie method?', a: 'The bow tie method combines a fault tree (causes, on the left) and an event tree (outcomes, on the right) around a single top event, then places barriers on every path. Rating each barrier’s effectiveness and recording its escalation factors shows where the defence is thin.' },
      { q: 'What are the six components of a bow tie diagram?', a: 'The hazard, the top event, the threats, the consequences, the preventive barriers on the threat side and the recovery barriers on the consequence side. Escalation factors, the things that weaken a barrier, are often shown as a seventh.' },
      { q: 'Is the bowtie a separate module?', a: 'No. It is a view inside a risk assessment in jobsafe, so it shares the hazard, the controls, the actions and the score with the worksheet.' },
      { q: 'How is the score worked out?', a: 'A residual score is computed from the barriers on each leg, their types and their effectiveness, and can be adopted into the 5×5 worksheet in one step.' },
      { q: 'What does the barrier audit flag?', a: 'Legs with no barrier, legs with a single barrier, and barriers rated failed or degraded.' },
    ],
    doNotClaim: ['a standalone bowtie tool', 'quantitative risk analysis or LOPA', 'AI-generated bowties'],
    industries: ['/industries/manufacturing-warehousing', '/industries/construction'],
    tools: [{ label: '5×5 risk matrix calculator', href: '/tools/risk-matrix' }],
  },
  {
    id: 'checklists',
    path: '/platform/checklists',
    gate: 'checklistBuilderShipped',
    display: 'Pass, fail or N/A, with the photo, offline.',
    lead: 'Safety inspection software for the checks that keep work going: run a check offline with pass, fail or N/A and a note and photo per item, autosaving and resuming as you go, and sign it by drawing or typing a name. A failed item raises an action due in seven days.',
    hero: 'checklist-templates-desktop',
    proof: ['Offline', 'Pass, fail, N/A with note and photo', 'Autosaves and resumes', 'Drawn or typed signature', 'A fail raises an action due in 7 days'],
    pains: [
      { pain: 'The pre-use check is a tick sheet on a clipboard that lives in the cab.', outcome: 'The check runs on the phone, offline, with a photo and a note on any item that needs one.' },
      { pain: 'A failed item is a line on a sheet until someone types it up.', outcome: 'A failed item raises an action due in seven days, with the asset or the site attached.' },
      { pain: 'Half-finished checks are lost when the phone locks.', outcome: 'Every check autosaves and resumes where it stopped, and is signed by drawing or typing a name.' },
    ],
    features: [
      {
        title: 'Running a check',
        lead: 'Each item is pass, fail or N/A with a note and a photo where needed. The check autosaves and resumes, works without signal, and ends with a signature drawn or typed.',
        points: [
          { icon: 'list-checks', title: 'Pass, fail, N/A', detail: 'A note and a photo per item.' },
          { icon: 'wifi-off', title: 'Offline', detail: 'The yard, the basement, the plant room.' },
          { icon: 'refresh-cw', title: 'Autosaves and resumes', detail: 'Pick it up where it stopped.' },
        ],
        screenshot: 'walkaround-fail-phone',
      },
      {
        title: 'Signed, and exportable',
        lead: 'The completed check is signed by drawing or typing a name. Completions export to CSV for the auditor or the client.',
        points: [
          { icon: 'check', title: 'Drawn or typed signature', detail: 'On the phone, at the end of the check.' },
          { icon: 'download', title: 'CSV export of completions', detail: 'The record of checks done, as a file.' },
          { icon: 'clock', title: 'Timestamped', detail: 'When it was started, finished and signed.' },
        ],
        screenshot: 'checklist-signoff-phone',
      },
      {
        title: 'A fail is an action, seven days out',
        lead: 'A failed item raises an action due in seven days on the register, with its source. Templates cover the DVSA HGV daily walkaround, forklift pre-use, MEWP pre-use, the weekly fire warden walk-round, site induction and hot works close-out.',
        points: [
          { icon: 'circle-check', title: 'Action due in 7 days', detail: 'Raised from the failed item, on the register.' },
          { icon: 'truck', title: 'Pre-use checks', detail: 'DVSA walkaround, forklift, MEWP.' },
          { icon: 'flask-conical', title: 'Site checks', detail: 'Fire warden walk-round, site induction, hot works close-out.' },
        ],
        screenshot: 'actions-list-desktop',
      },
    ],
    connected: ['actions', 'fleet', 'incidents', 'training'],
    regulation: {
      title: 'Inspections, in UK law',
      paragraphs: [
        'The Provision and Use of Work Equipment Regulations 1998 require work equipment to be inspected where its safety depends on installation conditions or where deterioration could lead to danger. DVSA expects a daily walkaround check before a heavy goods vehicle is driven. The Regulatory Reform (Fire Safety) Order 2005 requires fire safety arrangements to be maintained, which is what a fire warden walk-round records.',
        'jobsafe records the checks, the fails and the actions they raise. It keeps the completions; the judgement in them is yours.',
      ],
    },
    faqs: [
      { q: 'Does a check work offline?', a: 'Yes. It saves to the phone as you go and syncs when signal returns.' },
      { q: 'What happens when an item fails?', a: 'It raises an action due in seven days on the register, with the check and its asset or site attached.' },
      { q: 'How is a check signed?', a: 'By drawing a signature or typing a name at the end of the check.' },
      { q: 'Which templates are there?', a: 'DVSA HGV daily walkaround, forklift pre-use, MEWP pre-use, weekly fire warden walk-round, site induction and hot works close-out, among others.' },
      { q: 'Can we export completions?', a: 'Yes, to CSV.' },
    ],
    doNotClaim: ['scheduled or recurring checks', 'email or push reminders', 'generated PDFs'],
    industries: ['/industries/transport-logistics', '/industries/manufacturing-warehousing'],
  },
  {
    id: 'contractors',
    path: '/platform/contractors',
    gate: 'contractorCrudShipped',
    display: 'Insurance, RAMS, accreditation and the last audit, checked at the gate.',
    lead: 'Contractor management software that keeps each contractor’s competence evidence, employer’s liability insurance, RAMS, accreditation and the last audit, with a status of Approved, Review due or Suspended and the permit history. “Chase pack” raises an action to get what is missing, and the permit gate checks the record before any permit issues.',
    hero: 'contractor-detail-desktop',
    proof: ['Insurance, RAMS, accreditation, last audit', 'Approved, Review due, Suspended', 'Permit history', '“Chase pack” raises an action', 'Checked at the permit gate'],
    pains: [
      { pain: 'The contractor’s insurance certificate is a PDF in last year’s email.', outcome: 'Employer’s liability insurance, RAMS, accreditation and the last audit date are on the contractor record, with their expiry.' },
      { pain: 'Nobody knows which contractors are approved and which are just familiar.', outcome: 'Each contractor is Approved, Review due or Suspended, and the permit gate reads that status before a permit issues.' },
      { pain: 'Chasing the paperwork is a job nobody owns.', outcome: '“Chase pack” raises an action with an owner and a date.' },
    ],
    features: [
      {
        title: 'The competence evidence',
        lead: 'Employer’s liability insurance, RAMS, accreditation and the date of the last audit, on each contractor record, with the dates that make them current.',
        points: [
          { icon: 'file-badge', title: 'Insurance and accreditation', detail: 'With expiry dates on the record.' },
          { icon: 'clipboard-list', title: 'RAMS', detail: 'Held against the contractor, dated.' },
          { icon: 'calendar', title: 'Last audit', detail: 'When they were last audited, and by when the next is due.' },
        ],
        screenshot: 'contractor-detail-desktop',
      },
      {
        title: 'Status and chase',
        lead: 'Approved, Review due or Suspended. When something is missing or expired, “Chase pack” raises an action so someone owns getting it.',
        points: [
          { icon: 'check', title: 'Approved, Review due, Suspended', detail: 'One status, read by the permit gate.' },
          { icon: 'circle-check', title: '“Chase pack”', detail: 'An action with an owner and a date.' },
          { icon: 'clock', title: 'Permit history', detail: 'Every permit the contractor has held.' },
        ],
        screenshot: 'contractor-detail-desktop',
      },
      {
        title: 'Checked at the permit gate',
        lead: 'Before a permit issues, the gate checks the contractor is not suspended and that insurance, RAMS, accreditation and the audit are in date. Blocked is worked out for you.',
        points: [
          { icon: 'file-badge', title: 'Read by the gate', detail: 'A suspended contractor cannot be issued a permit.' },
          { icon: 'shield-alert', title: 'Expired evidence blocks', detail: 'Insurance, RAMS, accreditation or audit out of date: blocked.' },
          { icon: 'search', title: 'The reason shown', detail: 'The gate says which check failed.' },
        ],
        screenshot: 'permits-gate-desktop',
      },
    ],
    connected: ['permits', 'actions', 'documents', 'training'],
    regulation: {
      title: 'Contractors, in UK law',
      paragraphs: [
        'The Health and Safety at Work etc. Act 1974 places duties on employers towards people who are not their employees but may be affected by their work, and the Management of Health and Safety at Work Regulations 1999 require employers sharing a workplace to co-operate and co-ordinate. Where the Construction (Design and Management) Regulations 2015 apply, the client and the principal contractor must satisfy themselves that those they appoint are competent.',
        'jobsafe keeps the evidence and the status, and the permit gate reads them. It does not check a contractor against any external scheme.',
      ],
    },
    faqs: [
      { q: 'What does jobsafe track for a contractor?', a: 'Employer’s liability insurance, RAMS, accreditation and the last audit, the status (Approved, Review due or Suspended), and the permit history.' },
      { q: 'What does “Chase pack” do?', a: 'It raises an action with an owner and a date to get the missing or expired evidence.' },
      { q: 'How does it connect to permits?', a: 'The permit gate checks the contractor is not suspended and that the evidence is in date before a permit issues. If not, the permit is blocked and the gate says why.' },
      { q: 'Does jobsafe check contractors against CHAS, SafeContractor or Constructionline?', a: 'No. It holds the evidence you enter; it does not connect to any scheme.' },
      { q: 'Does it work offline?', a: 'Yes, like every module.' },
    ],
    doNotClaim: ['scheme integrations (CHAS, SafeContractor, Constructionline)', 'contractor self-service portals', 'email reminders'],
    industries: ['/industries/construction', '/industries/facilities-management'],
  },
]
