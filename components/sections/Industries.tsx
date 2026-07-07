'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PiHardHat as HardHat, PiBuildings as Building2, PiFactory as Factory, PiLightning as Zap, PiTruck as Truck, PiBriefcase as Briefcase } from 'react-icons/pi'

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
  const [failed, setFailed] = useState<Set<number>>(new Set())

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
    <section id="industries" className="py-12 md:py-14 bg-surface-0">
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">Industries</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white">
          Built for industries where<br />safety is non-negotiable
        </h2>
        <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm">
          From construction site safety to logistics depot incident reporting, jobsafe is built for environments where a slow or paper-based process isn&apos;t good enough.
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
                  borderColor: isActive ? 'var(--color-brand)' : 'rgba(255,255,255,0.1)',
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
                {!failed.has(index) && (
                  <Image
                    src={option.image}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                    onError={() =>
                      setFailed((prev) => {
                        const next = new Set(prev)
                        next.add(index)
                        return next
                      })
                    }
                  />
                )}

                {/* Placeholder — visible when image is missing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/50 text-xs font-medium text-center px-2 leading-snug">
                    {option.title}
                  </span>
                </div>

                {/* Bottom gradient shadow */}
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    height: '180px',
                    background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)',
                  }}
                />

                {/* Label row */}
                <div className="absolute left-0 right-0 bottom-5 flex items-center px-4 gap-3 z-10 pointer-events-none backdrop-blur-sm">
                  {/* Icon bubble */}
                  <div className="shrink-0 w-[44px] h-[44px] flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
                    {option.icon}
                  </div>

                  {/* Title + description — slide in from right when active */}
                  <div className="overflow-hidden">
                    <div
                      className="font-bold text-lg text-white leading-tight"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
                      }}
                    >
                      {option.title}
                    </div>
                    <div
                      className="text-sm text-white/90 mt-1 leading-snug"
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
