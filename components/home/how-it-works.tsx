import Image from 'next/image'
import { Bell, Camera, ChartLine, ListChecks, Lock, MapPin, Search, WifiOff, Wrench } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { FeatureRow } from '@/components/ui/feature-row'
import { PhoneFrame } from '@/components/ui/frame'

const STEPS = [
  { icon: <Camera />, title: '01 · Capture', detail: 'Workers log incidents with guided prompts, media uploads and automatic location tagging, even offline.' },
  { icon: <Search />, title: '02 · Review', detail: 'Supervisors receive an alert, verify the details, and forward the report to the relevant department.' },
  { icon: <Wrench />, title: '03 · Resolve', detail: 'Track every reported issue through to resolution with reminders and status updates.' },
  { icon: <ChartLine />, title: '04 · Analyse', detail: 'Dashboard analytics surface patterns, high-risk areas and trends, so you can act before the next incident.' },
] as const

const IN_DEPTH = [
  { icon: <ListChecks />, title: 'Guided capture', detail: 'Step-by-step prompts collect exactly the detail investigators need, so nothing is missed.' },
  { icon: <WifiOff />, title: 'Offline sync', detail: 'Reports submitted without signal are stored on the device and uploaded when connectivity returns.' },
  { icon: <Camera />, title: 'Media attachments', detail: 'Photos, video and voice notes are timestamped, geotagged and permanently linked to the record.' },
  { icon: <MapPin />, title: 'GPS and timestamp', detail: 'Every report is anchored to the location and time it was filed, to preserve its evidential value.' },
  { icon: <Bell />, title: 'Supervisor alerts', detail: 'Named supervisors receive a push notification and email the moment a report is submitted.' },
  { icon: <Lock />, title: 'Audit trail', detail: 'Every view, edit, comment and status change is logged, from first report to final closure.' },
] as const

export function HowItWorks() {
  return (
    <>
      <Section id="how-it-works" tone="grey" divider>
        <FeatureRow
          eyebrow="How it works"
          title="Four steps from incident to insight"
          lead="jobsafe guides your team through a proven process, from the moment something happens to the changes that stop it happening again."
          points={STEPS}
          link={{ label: 'See it in the academy', href: '/academy' }}
          media={
            <PhoneFrame caption="The admin dashboard: reports by category, weekly site breakdown and the depot incident summary.">
              <Image
                src="/images/screens/jobsafe-admin-dashboard.png"
                alt="jobsafe admin dashboard showing reports by category, a weekly site breakdown and the depot incident summary"
                width={379}
                height={842}
                sizes="300px"
              />
            </PhoneFrame>
          }
        />
      </Section>
      <Section id="in-depth" divider>
        <FeatureRow
          eyebrow="In depth"
          title="All incidents under one app"
          lead="One structured capture flow that gives investigators, supervisors and auditors exactly what they need, every time."
          points={IN_DEPTH}
          reverse
          media={
            <PhoneFrame caption="The employee app: HSSE, incident, other and near-miss report tiles.">
              <Image
                src="/images/screens/employee-app.png"
                alt="jobsafe employee app incident capture screen showing HSSE, Incident, Other and Near Miss report tiles"
                width={927}
                height={1665}
                sizes="300px"
              />
            </PhoneFrame>
          }
        />
      </Section>
    </>
  )
}

export default HowItWorks
