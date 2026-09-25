// Transport and logistics (Phase 3 rebuild). Words the sector uses: yard,
// depot, tail lift, banksman, curtain-sider, walkaround. Facts from HSE's
// transportation and storage series (road haulage, warehousing, post and
// courier), checked 25/09/2026. Not claimed anywhere on this page:
// telematics, tachograph analysis, O-licence management, FORS or CLOCS
// accreditation (the schemes are named only as schemes).

import type { IndustryContent } from './types.ts'

export const transportLogistics: IndustryContent = {
  path: '/industries/transport-logistics',
  name: 'Transport and logistics',
  placement: 'industry-transport',
  eyebrow: 'For UK hauliers, depot operators and warehouses',
  lead: 'The yard, the depot and the cab on one record. A driver reports a tail-lift injury from the trailer with no signal. The walkaround item that failed raises an action against the vehicle. The register shows which curtain-sider is due its MOT and which tail lift is due its LOLER examination. The hotspot chart shows which depot the near misses cluster in. Hosted in London, works offline, and the RIDDOR verdict is worked out before the transport manager has finished reading the report.',
  hero: 'fleet-list-desktop',
  factsLead: 'From HSE’s transportation and storage series, which covers road haulage, warehousing, post and courier. Latest years published; HSE marks them provisional.',
  facts: [
    {
      figure: '15',
      detail: 'workers killed in transportation and storage in 2025/26, out of 126 across all industries.',
      note: 'Provisional; HSE finalises the year in July 2027.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain',
        year: '2025/26',
        url: 'https://www.hse.gov.uk/statistics/fatals-overview.htm',
        checked: '25/09/2026',
        quote: '“126 workers killed in work-related accidents in 2025/26 (RIDDOR)” … table “Fatal injuries to workers by main industry, 2025/26”: “Transportation and storage 15”.',
      },
    },
    {
      figure: '30%',
      detail: 'of worker deaths in transportation and storage were being struck by a moving vehicle, against 17% across all industries.',
      note: 'Five-year average, 2021/22 to 2025/26p.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain, 2026 report',
        year: '2021/22 to 2025/26',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/fatalinjuries.pdf',
        checked: '25/09/2026',
        quote: '“While being struck by a moving vehicle accounted for around 17% of all deaths, this proportion was markedly higher in waste and recycling (48%), transportation and storage (30%) and agriculture, forestry and fishing (23%)”.',
      },
    },
    {
      figure: '7,698',
      detail: 'non-fatal injuries to employees reported under RIDDOR in transportation and storage in 2024/25. One in four was a specified injury.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Transportation and storage statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/transportation.pdf',
        checked: '25/09/2026',
        quote: '“There were 7,698 non-fatal injuries to employees reported by employers under RIDDOR in 2024/25p. 1,929 (25%) were specified injuries and 5,769 (75%) were injuries resulting in the incapacitation of a worker for over seven days”.',
      },
    },
  ],
  pains: [
    {
      pain: 'The walkaround was done, the defect was written on the sheet, and the sheet is in the cab.',
      module: 'fleet',
      outcome: 'The DVSA daily walkaround is a checklist on the driver’s phone. A failed item raises an action against that vehicle with an owner and a due date, so the defect is a job before the truck leaves the yard.',
    },
    {
      pain: 'MOT, tax, insurance, service and the tail-lift LOLER date live in a spreadsheet only the transport manager can read.',
      module: 'fleet',
      outcome: 'Every HGV, trailer, van and forklift carries its statutory dates. A date that has passed shows “do not use”, one due within 30 days is flagged, and the register filters by depot.',
    },
    {
      pain: 'The banksman near miss at bay 4 was mentioned at the brew and never written down.',
      module: 'incidents',
      outcome: 'A near miss is one of four report categories and the seven-step form is on every phone, offline included. The driver picks the site, the phone takes the GPS, the photo of the bay goes on the report.',
    },
    {
      pain: 'A tail-lift injury on Friday afternoon, and nobody is sure whether it is RIDDOR or what the deadline is.',
      module: 'riddor',
      outcome: 'The triage runs on the report itself: specified injury, over-seven-day incapacitation or not reportable, with the 10 or 15-day deadline worked out from the incident date. You submit to HSE; jobsafe keeps the record and the reference.',
    },
    {
      pain: 'Driver CPC, ADR and tail-lift training expire on different dates, and the matrix is a laminated sheet in the office.',
      module: 'training',
      outcome: 'The competency matrix shows who is in date for what, with course expiries flagged at 90 days. A critical course that has lapsed stops the work, and a gap raises an action.',
    },
    {
      pain: 'One depot has three times the near misses of the others. You find out at the quarterly review.',
      module: 'dashboards',
      outcome: 'Hotspots by site, the four KPIs and a 12-week trend on one screen, with a depot filter across the app. The pattern shows while it is still one depot’s problem.',
    },
  ],
  screens: [
    { id: 'fleet-list-desktop', caption: 'The fleet register: registration, type, site and keeper on every vehicle, with the MOT, service and inspection dates, the LOLER examination that is overdue in red and the statutory-date banner.' },
    { id: 'walkaround-fail-phone', caption: 'A failed walkaround item on the driver’s phone. The fail raises an action against the vehicle, due in seven days, with the photo attached.' },
    { id: 'dashboard-desktop', caption: 'Hotspots by depot beside the four KPIs and the live incident feed: where this month’s reports cluster, filtered to one depot or the whole network.' },
  ],
  legal: {
    title: 'What the record is for',
    lead: 'None of these questions are asked by the people driving the trucks. They are asked by a court, a customer’s bid team and an underwriter, and they are all asked of you.',
    points: [
      {
        title: 'The fine is set by turnover, and by the harm risked',
        body: 'Since 1 February 2016 the Sentencing Council guideline has set the starting point for a health and safety fine by the organisation’s turnover, with “large” meaning £50 million and over, and weighed the harm an operation risked as well as the harm it caused. The offence range runs to £10 million, and a court can go beyond it for a company whose turnover very greatly exceeds the large threshold. The forklift near miss nobody logged is the evidence you do not have.',
        source: { name: 'Sentencing Council, Health and Safety Offences guideline (organisations)', url: 'https://www.sentencingcouncil.org.uk/offences/magistrates-court/item/organisations-breach-of-duty-of-employer-towards-employees-and-non-employees-breach-of-duty-of-self-employed-to-others-breach-of-health-and-safety-regulations/', checked: '25/09/2026' },
      },
      {
        title: 'Directors carry it personally',
        body: 'Section 37 of the Health and Safety at Work etc. Act 1974 makes a director, manager or similar officer personally liable where an offence was committed with their consent or connivance, or is attributable to their neglect. What protects the people running the business is being able to show what was done: the walkaround record, the action that closed the defect, the training that was in date.',
        source: { name: 'Health and Safety at Work etc. Act 1974, section 37', url: 'https://www.legislation.gov.uk/ukpga/1974/37/section/37', checked: '25/09/2026' },
      },
      {
        title: 'Tenders score the record',
        body: 'Pre-qualification questionnaires ask for your accident frequency rate over three years, your RIDDOR history and any enforcement. FORS and CLOCS audits ask to see how incidents are reported, investigated and closed. jobsafe is not a FORS or CLOCS product and does not audit you against either scheme; it keeps the incident, action and fleet records the auditor asks to see.',
        source: { name: 'FORS, the Fleet Operator Recognition Scheme', url: 'https://www.fors-online.org.uk/', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Accident frequency rate calculator', href: '/tools/accident-frequency-rate', why: 'The PQQ figure, with the formula shown and the convention named.' },
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'The product’s own triage, one question at a time, with the deadline.' },
  ],
  faqLead: 'Straight answers for the people who sign the tender, hold the O-licence and carry the liability.',
  faqs: [
    {
      q: 'Is this telematics, tachograph analysis or O-licence software?',
      a: 'No. jobsafe does not track vehicles, read tachographs, score driving or manage your operator licence, and it sits alongside whatever does. It is the health and safety record: incidents and near misses from the yard and the cab, the RIDDOR verdict, the risk assessments, the permits, the training matrix and the fleet register with its statutory dates. Operators usually have plenty of vehicle data and very little on the near miss at bay 4 that nobody wrote down.',
    },
    {
      q: 'How does the DVSA daily walkaround work in jobsafe?',
      a: 'It is a checklist on the driver’s phone, worked through item by item with pass, fail or not applicable, a note and a photo, offline if the yard has no signal. A failed item raises an action against that vehicle with a due date, so the defect becomes a job with an owner rather than a note on a sheet. jobsafe does not send anything to DVSA; the record is yours to show at a roadside check or an audit.',
    },
    {
      q: 'Does a tail lift need a LOLER examination, and does jobsafe track it?',
      a: 'Yes on both. A tail lift is lifting equipment under the Lifting Operations and Lifting Equipment Regulations 1998, so it needs a thorough examination at least every 12 months for equipment lifting goods, or to a written examination scheme. jobsafe keeps the LOLER date on the vehicle beside its MOT, tax, insurance and service dates; a date that has passed shows “do not use” and one due within 30 days is flagged.',
    },
    {
      q: 'A driver is injured on a customer’s site. Is it RIDDOR reportable, and who reports it?',
      a: 'Under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 the responsible person for an injured employee is their employer, wherever the injury happened, so a haulier reports its own driver. Whether it is reportable turns on the injury: a specified injury such as a fracture is reported within 10 days, an injury that keeps the driver off normal work for more than seven days within 15 days, and anything under that is recorded but not reported. jobsafe works that out on the report; you submit to HSE.',
    },
    {
      q: 'A PQQ asks for our accident frequency rate. Can jobsafe produce it?',
      a: 'jobsafe keeps the half that is hard to reconstruct: every RIDDOR-reportable injury, dated, categorised and attributable to a depot, exportable to CSV. The hours worked come from your payroll, and the rate is the two put together: injuries multiplied by 100,000, divided by hours, which is the convention National Highways and the Office of Rail and Road define. jobsafe does not calculate the rate for you; the free calculator on this site shows the working.',
    },
    {
      q: 'What about risk assessments for the yard, reversing and the banksman?',
      a: 'Regulation 3 of the Management of Health and Safety at Work Regulations 1999 requires a suitable and sufficient assessment, and HSE’s workplace transport guidance is built around the site, the vehicle and the driver. In jobsafe a yard assessment is a general assessment scored 5×5, with hazards such as reversing and pedestrian segregation, controls tagged by the hierarchy of control with an owner, and an approval step before it goes live. A warning shows on any assessment that is not yet suitable and sufficient.',
    },
    {
      q: 'Does it work in the cold store, the trailer and the yard with no signal?',
      a: 'Yes, in every module. A report, a walkaround or a risk assessment saves to the phone first and shows “Pending sync” until signal returns, then syncs on its own. Steel-clad warehouses, cold stores and underground service yards are the normal case in this sector, not the edge case. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
    {
      q: 'Can drivers from an agency report through the same app as our own?',
      a: 'Yes. jobsafe has six role levels across your sites and depots, so agency drivers, employed drivers, yard staff and contractors report through the same app with the access their role allows. Every report carries who, where and when, which matters most for the people who are not on your payroll: section 3 of the Health and Safety at Work etc. Act 1974 makes your undertaking responsible for the risks to them, whoever pays their wages. Pricing is per user per month, in pounds, with VAT shown.',
    },
  ],
  closing: {
    title: 'Three years of evidence starts today.',
    copy: 'A 30-minute walkthrough on a UK haulier’s data: the yard, the fleet, the walkaround and the RIDDOR verdict, with someone who knows the product.',
  },
}
