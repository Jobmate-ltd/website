import { PiShieldWarning as ShieldAlert } from 'react-icons/pi'

export default function ComplianceNote() {
  return (
    <section className="bg-surface-0 border-y border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
          <div className="shrink-0 w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
            <ShieldAlert className="size-5 text-brand" strokeWidth={1.75} />
          </div>
          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            <span className="font-bold text-white">Compliance risk —</span>{' '}
            A single HSE enforcement notice can cost{' '}
            <span className="font-bold text-brand">£10,000+</span>.
            Jobmate&apos;s jobsafe HSSE module gives you a full digital, geo-tagged, timestamped incident trail.
            That&apos;s not just good practice, it&apos;s an insurance policy.
          </p>
        </div>
      </div>
    </section>
  )
}
