'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, WifiOff, Camera, MapPin, Bell, Lock } from 'lucide-react'

const TYPED_TEXT = 'Forklift came within 2m of pedestrian crossing at Bay 3…'

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
      'Every view, edit, comment, and status change is logged immutably. JobSafe creates a complete chain of evidence from first report to final closure.',
  },
]

type Phase = 'blank' | 'dropdown' | 'typing' | 'location' | 'submitting'

export default function AnimatedForm() {
  const [phase, setPhase] = useState<Phase>('blank')
  const [typedText, setTypedText] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSuccessText, setShowSuccessText] = useState(false)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let typingInterval: ReturnType<typeof setInterval> | null = null

    const runLoop = () => {
      // 0.0s — reset to blank
      setPhase('blank')
      setTypedText('')
      setShowForm(true)
      setShowSuccess(false)
      setShowSuccessText(false)

      // 0.5s — dropdown selects "Near Miss"
      timeouts.push(setTimeout(() => setPhase('dropdown'), 500))

      // 1.2s — start typing description
      timeouts.push(setTimeout(() => {
        setPhase('typing')
        let i = 0
        typingInterval = setInterval(() => {
          i++
          setTypedText(TYPED_TEXT.slice(0, i))
          if (i >= TYPED_TEXT.length && typingInterval) {
            clearInterval(typingInterval)
            typingInterval = null
          }
        }, 50) // 57 chars × 50ms ≈ 2.85s, finishes ~4.05s
      }, 1200))

      // 3.0s — location tag fades in
      timeouts.push(setTimeout(() => setPhase('location'), 3000))

      // 3.8s — submit button pulses
      timeouts.push(setTimeout(() => setPhase('submitting'), 3800))

      // 4.3s — form fades out
      timeouts.push(setTimeout(() => setShowForm(false), 4300))

      // 4.5s — success screen + checkmark draws
      timeouts.push(setTimeout(() => setShowSuccess(true), 4500))

      // 5.0s — "Report Submitted Successfully" fades up
      timeouts.push(setTimeout(() => setShowSuccessText(true), 5000))

      // 6.2s — loop restarts
      timeouts.push(setTimeout(() => {
        if (typingInterval) { clearInterval(typingInterval); typingInterval = null }
        runLoop()
      }, 6200))
    }

    runLoop()

    return () => {
      timeouts.forEach(clearTimeout)
      if (typingInterval) clearInterval(typingInterval)
    }
  }, [])

  const showDropdown = ['dropdown', 'typing', 'location', 'submitting'].includes(phase)
  const showLocation  = ['location', 'submitting'].includes(phase)
  const isSubmitting  = phase === 'submitting'

  return (
    <section className="py-28 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">In Depth</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            All Incidents Under One App
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            One structured capture flow that gives investigators, supervisors, and auditors exactly what they need — every time.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

          {/* Left — animated mockup */}
          <div className="flex items-stretch">
            <div className="w-full rounded-2xl border border-white/10 bg-[#111] overflow-hidden flex flex-col">

              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="ml-2 text-xs text-white/30 font-medium">New Report</span>
              </div>

              {/* Body — form and success share this space */}
              <div className="relative flex-1 min-h-[420px]">

                {/* Form */}
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-5 flex flex-col gap-4"
                    >
                      {/* Incident type */}
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Incident Type</label>
                        <div className={`rounded-lg border px-3 py-2.5 text-sm transition-all duration-500 ${
                          showDropdown
                            ? 'border-[#e5342a]/40 bg-[#e5342a]/5 text-white'
                            : 'border-white/10 bg-white/5 text-white/25'
                        }`}>
                          {showDropdown ? 'Near Miss' : 'Select type…'}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Description</label>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white min-h-[80px] leading-relaxed">
                          {typedText}
                          {phase === 'typing' && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="inline-block w-0.5 h-4 bg-[#e5342a] ml-0.5 align-middle"
                            />
                          )}
                        </div>
                      </div>

                      {/* Media buttons */}
                      <div className="flex gap-2">
                        {['Photo', 'Voice', 'Video'].map((label) => (
                          <div
                            key={label}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-center text-xs text-white/40"
                          >
                            {label}
                          </div>
                        ))}
                      </div>

                      {/* GPS location tag */}
                      <AnimatePresence>
                        {showLocation && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/60"
                          >
                            <MapPin className="size-3.5 text-[#e5342a] shrink-0" strokeWidth={1.5} />
                            Warehouse Bay 3 · 09:14 · Today
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit button */}
                      <motion.div
                        animate={isSubmitting ? { scale: [1, 0.97, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-lg py-3 text-center text-sm font-bold text-white cursor-pointer transition-colors ${
                          isSubmitting ? 'bg-[#c42d24]' : 'bg-[#e5342a]'
                        }`}
                      >
                        Submit Report →
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success screen */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8"
                    >
                      {/* Checkmark circle */}
                      <div className="w-16 h-16 rounded-full border-2 border-[#e5342a]/30 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <motion.path
                            d="M5 13l4 4L19 7"
                            stroke="#e5342a"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          />
                        </svg>
                      </div>

                      {/* Success text */}
                      <AnimatePresence>
                        {showSuccessText && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-center"
                          >
                            <p className="text-white font-semibold text-sm">Report Submitted Successfully</p>
                            <p className="text-white/40 text-xs mt-1">Supervisors have been notified</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>

          {/* Right — static feature list */}
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
