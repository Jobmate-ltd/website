'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

const col1: Testimonial[] = [
  {
    name: 'James Whitfield',
    role: 'HSSE Manager · Meridian FM',
    image: 'https://avatar.vercel.sh/james',
    text: 'We cut incident reporting time by more than half. The offline mode alone was a game changer for our field teams.',
  },
  {
    name: 'Sarah Okafor',
    role: 'Health & Safety Lead · Crestline Energy',
    image: 'https://avatar.vercel.sh/sarah',
    text: "Audit prep used to take days. With jobsafe everything is already documented and exportable — it's transformed how we work.",
  },
  {
    name: 'Tom Bradshaw',
    role: 'Operations Director · Apex Build Group',
    image: 'https://avatar.vercel.sh/tom',
    text: "Our engineers actually use it. That's never happened with any safety tool we've tried before.",
  },
]

const col2: Testimonial[] = [
  {
    name: 'Priya Nandha',
    role: 'Compliance Officer · Triton Utilities',
    image: 'https://avatar.vercel.sh/priya',
    text: 'The real-time alerts mean supervisors are on top of incidents before the shift even ends. Brilliant.',
  },
  {
    name: 'Daniel Marsh',
    role: 'Site Manager · Foundry Logistics',
    image: 'https://avatar.vercel.sh/daniel',
    text: 'Simple enough for every person on the shop floor. No training required — they just picked it up.',
  },
  {
    name: 'Claire Hennessy',
    role: 'Safety Co-ordinator · Vantage Facilities',
    image: 'https://avatar.vercel.sh/claire',
    text: "jobsafe gave us visibility across all our sites in one place. We couldn't go back to spreadsheets now.",
  },
]

const col3: Testimonial[] = [
  {
    name: 'Ryan Collier',
    role: 'Fleet & Safety Manager · Summit Field Services',
    image: 'https://avatar.vercel.sh/ryan',
    text: 'Lone worker reporting went from a headache to completely seamless. GPS and timestamps on every report too.',
  },
  {
    name: 'Amara Diallo',
    role: 'Quality & Safety Lead · Ironside Manufacturing',
    image: 'https://avatar.vercel.sh/amara',
    text: 'The audit trail is immaculate. Every regulator visit since we switched has gone without issue.',
  },
  {
    name: 'Pete Donoghue',
    role: 'Director · Greenfield Construction',
    image: 'https://avatar.vercel.sh/pete',
    text: 'Rolled it out to 40 engineers in a morning. That tells you everything about how easy it is to use.',
  },
]

const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-white/10 bg-[#111] max-w-xs w-full"
                style={{ boxShadow: '0 8px 32px rgba(229,52,42,0.08)' }}
              >
                <p className="text-white/80 text-sm leading-relaxed">{text}</p>
                <div className="flex items-center gap-3 mt-5">
                  <Image
                    width={40}
                    height={40}
                    src={image}
                    alt={`${name}, ${role}`}
                    className="h-10 w-10 rounded-full"
                    unoptimized
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium tracking-tight leading-5">{name}</span>
                    <span className="text-white/50 text-xs leading-5 tracking-tight">{role}</span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="relative py-12 md:py-14 bg-[#0a0a0a] overflow-hidden">
      {/* Red glow — centred behind columns */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(229,52,42,0.12) 0%, transparent 70%)' }}
      />

      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Testimonials</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Trusted by safety teams<br />across the UK
        </h2>
      </div>

      <div className="relative flex gap-6 justify-center max-h-[600px] overflow-hidden">
        {/* Top fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 z-10"
          style={{ background: 'linear-gradient(to bottom, #0a0a0a, transparent)' }}
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 z-10"
          style={{ background: 'linear-gradient(to top, #0a0a0a, transparent)' }}
        />

        <TestimonialsColumn testimonials={col1} duration={25} />
        <TestimonialsColumn testimonials={col2} duration={18} className="hidden md:block" />
        <TestimonialsColumn testimonials={col3} duration={22} className="hidden lg:block" />
      </div>
    </section>
  )
}
