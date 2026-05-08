'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ListChecks, WifiOff, Camera, MapPin, Bell, Lock } from 'lucide-react'

const features = [
  {
    icon: ListChecks,
    title: 'Guided capture',
    description:
      'Step-by-step prompts ensure nothing is missed. Workers follow a structured form that collects exactly the detail investigators need, reducing back-and-forth by over 70%.',
  },
  {
    icon: WifiOff,
    title: 'Offline sync',
    description:
      'Reports submitted without signal are stored locally and uploaded automatically when connectivity is restored. No data is ever lost between field and office.',
  },
  {
    icon: Camera,
    title: 'Media attachments',
    description:
      'Attach photos, videos, and voice notes directly within the report. Evidence is timestamped, geotagged, and permanently linked to the incident record.',
  },
  {
    icon: MapPin,
    title: 'GPS + timestamp',
    description:
      'Every report is automatically anchored to the exact location and time it was filed. Location integrity is maintained to preserve evidential value.',
  },
  {
    icon: Bell,
    title: 'Supervisor alerts',
    description:
      'Named supervisors receive an instant push notification and email the moment a report is submitted. Escalation rules apply automatically based on incident severity.',
  },
  {
    icon: Lock,
    title: 'Audit trail',
    description:
      'Every view, edit, comment, and status change is logged immutably. jobsafe creates a complete chain of evidence from first report to final closure.',
  },
]

export default function AnimatedForm() {
  return (
    <section className="py-12 md:py-14 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">In Depth</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            All Incidents Under One App
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            One structured capture flow that gives investigators, supervisors, and auditors exactly what they need — every time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — real employee app screenshot */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px]"
            >
              <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-[radial-gradient(circle,#e5342a,transparent_70%)] scale-110" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative drop-shadow-[0_20px_50px_rgba(229,52,42,0.25)]"
              >
                <Image
                  src="/images/screens/employee-app.png"
                  alt="jobsafe employee app — incident capture screen showing HSSE, Incident, Other, and Near Miss report tiles"
                  width={927}
                  height={1665}
                  className="w-full h-auto"
                  priority={false}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — feature list */}
          <div className="flex flex-col divide-y divide-white/10">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 py-6 first:pt-0 last:pb-0">
                <div className="shrink-0 mt-0.5">
                  <Icon className="size-4 text-[#e5342a]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{title}</p>
                  <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
