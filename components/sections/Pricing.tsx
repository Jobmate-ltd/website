'use client'
import NumberFlow from '@number-flow/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'For small teams getting started with workplace safety reporting.',
    monthlyPrice: 2.99,
    annualPrice: 2.69,
    buttonText: 'Start Free Trial',
    popular: false,
    includes: 'Everything you need to get started:',
    features: [
      'Up to 25 users',
      'Incident & near-miss reporting',
      'Photo, GPS & timestamp capture',
      'Supervisor notifications',
      'Basic analytics dashboard',
      'UK data storage',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing teams that need deeper insights and compliance tooling.',
    monthlyPrice: 2.75,
    annualPrice: 2.48,
    buttonText: 'Start Free Trial',
    popular: true,
    includes: 'Everything in Starter, plus:',
    features: [
      'Unlimited users',
      'Custom report workflows',
      'Multi-site management',
      'Advanced analytics & trends',
      'HSSE audit-ready exports',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organisations with custom security, compliance, and integration needs.',
    monthlyPrice: null,
    annualPrice: null,
    buttonText: 'Contact Sales',
    popular: false,
    includes: 'Everything in Professional, plus:',
    features: [
      'SSO & custom auth',
      'Dedicated account manager',
      'Custom SLA & uptime guarantee',
      'API access & integrations',
      'On-site onboarding',
      'Custom contract & invoicing',
    ],
  },
]

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Simple, per-license pricing
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            No setup fees. No hidden costs. Cancel any time.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative flex bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className="relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors"
              style={{ color: !isAnnual ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
              {!isAnnual && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2"
              style={{ color: isAnnual ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
              {isAnnual && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">Annual</span>
              <span className="relative rounded-full bg-[#e5342a]/20 border border-[#e5342a]/30 text-[#e5342a] text-xs px-2 py-0.5 font-bold">
                Save 10%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl border p-8"
              style={{
                background: plan.popular ? '#111' : 'transparent',
                borderColor: plan.popular ? '#e5342a' : 'rgba(255,255,255,0.1)',
                boxShadow: plan.popular ? '0 0 40px rgba(229,52,42,0.12)' : 'none',
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#e5342a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {plan.monthlyPrice !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-4xl font-black">
                      £<NumberFlow
                        value={isAnnual ? plan.annualPrice! : plan.monthlyPrice}
                        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        className="text-4xl font-black"
                      />
                    </span>
                    <span className="text-white/40 text-sm">/user/mo</span>
                  </div>
                ) : (
                  <div className="text-4xl font-black text-white">Custom</div>
                )}
              </div>

              {/* Name + description */}
              <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">{plan.description}</p>

              {/* CTA */}
              <a
                href={plan.name === 'Enterprise' ? '#contact' : '#get-started'}
                className="block text-center font-bold text-sm px-6 py-3 rounded-lg mb-8 transition-colors"
                style={
                  plan.popular
                    ? { background: '#e5342a', color: '#fff' }
                    : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }
                }
              >
                {plan.buttonText}
              </a>

              {/* Features */}
              <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-4">
                {plan.includes}
              </p>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#e5342a]/10 border border-[#e5342a]/20 flex items-center justify-center">
                      <CheckCheck className="w-3 h-3 text-[#e5342a]" />
                    </span>
                    <span className="text-sm text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
