'use client'
import React, { useState, useEffect } from 'react'
import { HardHat, Building2, Factory, Zap, Truck, Briefcase } from 'lucide-react'

const options = [
  {
    title: 'Construction',
    description: 'Track near misses, falls, and equipment incidents across complex, multi-site builds before they become HSE notifications.',
    image: '/images/industries/construction.png',
    icon: <HardHat size={20} strokeWidth={1.5} className="text-white" />,
  },
  {
    title: 'Facilities Management',
    description: 'Manage contractor safety, maintenance hazards, and compliance across your entire portfolio from a single dashboard.',
    image: '/images/industries/facilities.png',
    icon: <Building2 size={20} strokeWidth={1.5} className="text-white" />,
  },
  {
    title: 'Manufacturing',
    description: 'Log machinery faults, COSHH exposures, and production-line hazards in real time, with evidence attached at the point of capture.',
    image: '/images/industries/manufacturing.png',
    icon: <Factory size={20} strokeWidth={1.5} className="text-white" />,
  },
  {
    title: 'Energy & Utilities',
    description: 'Capture high-consequence incidents with the regulatory detail required — from site to submission, fully audit-ready.',
    image: '/images/industries/energy.png',
    icon: <Zap size={20} strokeWidth={1.5} className="text-white" />,
  },
  {
    title: 'Logistics & Warehousing',
    description: 'Report forklift incidents, manual handling injuries, and loading bay hazards the moment they happen — before shift handover.',
    image: '/images/industries/logistics.png',
    icon: <Truck size={20} strokeWidth={1.5} className="text-white" />,
  },
  {
    title: 'Field Services',
    description: 'Give lone workers a fast, offline-capable way to report incidents wherever the job takes them — no signal required.',
    image: '/images/industries/field-services.png',
    icon: <Briefcase size={20} strokeWidth={1.5} className="text-white" />,
  },
]

export default function Industries() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animated, setAnimated] = useState<number[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    options.forEach((_, i) => {
      timers.push(
        setTimeout(() => setAnimated((prev) => [...prev, i]), 180 * i)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section id="industries" className="py-24 bg-[#0a0a0a]">
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Industries</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Built for industries where<br />safety is non-negotiable
        </h2>
        <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm">
          From construction sites to field service vehicles, JobSafe is designed to work in the places where incidents actually happen.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 overflow-x-auto">
        <div
          className="flex h-[400px] items-stretch"
          style={{ minWidth: '600px' }}
        >
          {options.map((option, index) => {
            const isActive = activeIndex === index
            const isVisible = animated.includes(index)

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                className="relative flex flex-col justify-end overflow-hidden cursor-pointer"
                style={{
                  flex: isActive ? '7 1 0%' : '1 1 0%',
                  minWidth: '60px',
                  backgroundColor: '#1a1a1a',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: isActive ? '#e5342a' : 'rgba(255,255,255,0.1)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-60px)',
                  boxShadow: isActive
                    ? '0 20px 60px rgba(0,0,0,0.5)'
                    : '0 10px 30px rgba(0,0,0,0.3)',
                  zIndex: isActive ? 10 : 1,
                  transition:
                    'flex 700ms ease-in-out, border-color 700ms ease-in-out, box-shadow 700ms ease-in-out, opacity 400ms ease-in-out, transform 400ms ease-in-out',
                  willChange: 'flex',
                }}
              >
                {/* Image — hides itself on 404, placeholder shows through */}
                <img
                  src={option.image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />

                {/* Placeholder — visible when image is missing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/20 text-xs font-medium text-center px-2 leading-snug">
                    {option.title}
                  </span>
                </div>

                {/* Bottom gradient shadow */}
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    bottom: isActive ? '0' : '-40px',
                    height: '120px',
                    boxShadow: isActive
                      ? 'inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000'
                      : 'inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000',
                    transition: 'bottom 700ms ease-in-out, box-shadow 700ms ease-in-out',
                  }}
                />

                {/* Label row */}
                <div className="absolute left-0 right-0 bottom-5 flex items-center px-4 gap-3 z-10 pointer-events-none">
                  {/* Icon bubble */}
                  <div className="shrink-0 w-[44px] h-[44px] flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                    {option.icon}
                  </div>

                  {/* Title + description — slide in from right when active */}
                  <div className="overflow-hidden">
                    <div
                      className="font-bold text-base text-white leading-tight"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
                      }}
                    >
                      {option.title}
                    </div>
                    <div
                      className="text-sm text-white/60 mt-1 leading-snug"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'opacity 700ms ease-in-out 60ms, transform 700ms ease-in-out 60ms',
                        maxWidth: '260px',
                      }}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
