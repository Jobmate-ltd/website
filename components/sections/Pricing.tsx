'use client'
import React, { useState } from 'react'

const STANDARD_RATE = 2.99
const VOLUME_RATE = 1.99
const STANDARD_THRESHOLD = 500
const MAX_LICENCES = 10000

function calculateMonthly(licences: number): number {
  if (licences <= STANDARD_THRESHOLD) {
    return licences * STANDARD_RATE
  }
  return (STANDARD_THRESHOLD * STANDARD_RATE) + ((licences - STANDARD_THRESHOLD) * VOLUME_RATE)
}

const features = [
  'Unlimited incident reports',
  'Dashboard analytics',
  'Photo, video & voice attachments',
  'Offline mode & GPS tagging',
  'Real-time supervisor alerts',
  'Email support',
]

export default function Pricing() {
  const [licences, setLicences] = useState(10)
  const [annual, setAnnual] = useState(false)

  const isCustom = licences >= MAX_LICENCES
  const monthlyBase = calculateMonthly(licences)
  const monthlyDisplay = annual ? monthlyBase * 0.9 : monthlyBase
  const annualTotal = monthlyDisplay * 12
  const isVolume = licences > STANDARD_THRESHOLD

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0a]">
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">Simple pricing. No surprises.</h2>
        <p className="text-white/50 mt-4 text-sm">
          Start for free. Scale when you&apos;re ready. No long-term contracts, no hidden fees.
        </p>
      </div>

      {/* Monthly / Annual toggle */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-1 bg-[#111] border border-white/10 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !annual ? 'bg-[#e5342a] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              annual ? 'bg-[#e5342a] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Annual <span className="text-xs opacity-70">–10%</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row gap-6">

        {/* Left card — slider */}
        <div className="flex-1 rounded-xl border border-white/10 bg-[#111] p-8">
          <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-6">
            Calculate your pricing
          </h3>

          <div className="text-3xl font-black text-white mb-2">
            {isCustom ? '10,000+' : licences.toLocaleString()}{' '}
            <span className="text-base font-normal text-white/50">licences</span>
          </div>

          <input
            type="range"
            min={1}
            max={MAX_LICENCES}
            step={1}
            value={licences}
            onChange={(e) => setLicences(Number(e.target.value))}
            className="w-full appearance-none h-2 rounded-full my-8"
            style={{
              background: `linear-gradient(to right, #e5342a 0%, #e5342a ${(licences / MAX_LICENCES) * 100}%, rgba(255,255,255,0.1) ${(licences / MAX_LICENCES) * 100}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />

          {isCustom && (
            <p className="text-sm text-white/50 mt-4">
              Need a custom solution?{' '}
              <a href="#" className="text-[#e5342a] font-medium hover:underline">
                Get in touch →
              </a>
            </p>
          )}
        </div>

        {/* Right card — plan summary (hidden at 10,000+) */}
        {!isCustom && (
          <div className="flex-1 rounded-xl border border-white/10 bg-[#111] p-8">
            <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-6">
              Your plan
            </h3>

            {/* Price */}
            <div className="text-4xl font-black text-white">
              £{monthlyDisplay.toFixed(2)}
              <span className="text-base font-normal text-white/50"> / mo</span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              {isVolume ? '£2.99 / £1.99 per licence' : '£2.99 per licence'}
            </p>
            {annual && (
              <p className="text-xs text-white/40 mt-0.5">
                Billed annually at £{annualTotal.toFixed(2)}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {isVolume && (
                <span className="bg-[#e5342a]/10 border border-[#e5342a]/20 text-[#e5342a] text-xs px-3 py-1 rounded-full">
                  Volume pricing above 500 licences
                </span>
              )}
              {annual && (
                <span className="bg-[#e5342a]/10 border border-[#e5342a]/20 text-[#e5342a] text-xs px-3 py-1 rounded-full">
                  10% annual discount applied
                </span>
              )}
            </div>

            {/* Feature checklist */}
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#e5342a] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="#"
              className="mt-8 block w-full text-center bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-6 py-4 rounded-md transition-colors"
            >
              START FREE — NO CARD NEEDED →
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-white/30 text-sm mt-8 px-4">
        Need more licences or enterprise features?{' '}
        <a href="#" className="text-white/50 hover:text-white underline transition-colors">
          Get in touch
        </a>{' '}
        — we&apos;ll put together a plan that fits.
      </p>
    </section>
  )
}
