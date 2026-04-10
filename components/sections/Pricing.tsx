'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TimelineContent } from '@/components/ui/timeline-animation'
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal'
import { cn } from '@/lib/utils'
import NumberFlow from '@number-flow/react'
import { CheckCheck } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useRef, useState } from 'react'

const plans = [
  {
    name: 'Starter',
    description: 'For small teams getting started with workplace safety reporting.',
    price: 2.99,
    yearlyPrice: 2.69,
    isCustom: false,
    buttonText: 'Start Free Trial',
    popular: false,
    includes: [
      'Everything you need to start:',
      'Up to 25 users',
      'Incident & near-miss reporting',
      'Photo, GPS & timestamp capture',
      'Supervisor notifications',
      'Basic analytics dashboard',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing teams that need deeper insights and compliance tooling.',
    price: 2.75,
    yearlyPrice: 2.48,
    isCustom: false,
    buttonText: 'Start Free Trial',
    popular: true,
    includes: [
      'Everything in Starter, plus:',
      'Unlimited users',
      'Custom report workflows',
      'Multi-site management',
      'HSSE audit-ready exports',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organisations with custom security, compliance, and integration needs.',
    price: 0,
    yearlyPrice: 0,
    isCustom: true,
    buttonText: 'Contact Sales',
    popular: false,
    includes: [
      'Everything in Professional, plus:',
      'SSO & custom auth',
      'Dedicated account manager',
      'Custom SLA & uptime guarantee',
      'API access & integrations',
      'On-site onboarding',
    ],
  },
]

const PricingSwitch = (props: { onSwitch: (value: string) => void; className?: string }) => {
  const [selected, setSelected] = useState('0')

  const handleSwitch = (value: string) => {
    setSelected(value)
    props.onSwitch(value)
  }

  return (
    <div className={cn('flex justify-center', props.className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white/5 border border-white/10 p-1">
        <button
          onClick={() => handleSwitch('0')}
          className={cn(
            'relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors',
            selected === '0' ? 'text-white' : 'text-white/40 hover:text-white',
          )}
        >
          {selected === '0' && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-white/10 border border-white/20"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch('1')}
          className={cn(
            'relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors',
            selected === '1' ? 'text-white' : 'text-white/40 hover:text-white',
          )}
        >
          {selected === '1' && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full bg-white/10 border border-white/20"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Annual
            <span className="rounded-full bg-[#e5342a]/20 border border-[#e5342a]/30 px-2 py-0.5 text-xs font-bold text-[#e5342a]">
              Save 10%
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(10px)',
      y: -20,
      opacity: 0,
    },
  }

  const togglePricingPeriod = (value: string) => setIsYearly(Number.parseInt(value) === 1)

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0a]">
      <div className="px-4 max-w-5xl mx-auto relative" ref={pricingRef}>

        <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between mb-12">
          <div className="text-left mb-6">
            <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4">
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.15}
                staggerFrom="first"
                reverse={true}
                containerClassName="justify-start flex-wrap"
                transition={{ type: 'spring', stiffness: 250, damping: 40, delay: 0 }}
              >
                Simple, per-license pricing
              </VerticalCutReveal>
            </h2>
            <TimelineContent
              as="p"
              animationNum={0}
              timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
              customVariants={revealVariants}
              className="text-white/50 text-sm max-w-xs"
            >
              No setup fees. No hidden costs. Cancel any time.
            </TimelineContent>
          </div>

          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
            customVariants={revealVariants}
          >
            <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
          </TimelineContent>
        </article>

        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
          customVariants={revealVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {plans.map((plan, index) => (
            <TimelineContent
              as="div"
              key={plan.name}
              animationNum={index + 3}
              timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
              customVariants={revealVariants}
            >
              <Card
                className={cn(
                  'relative flex flex-col justify-between h-full',
                  plan.popular
                    ? 'bg-[#111] border-[#e5342a] shadow-[0_0_40px_rgba(229,52,42,0.15)]'
                    : 'bg-transparent border-white/10'
                )}
              >
                <CardContent className="pt-6">
                  {plan.popular && (
                    <div className="mb-4">
                      <span className="bg-[#e5342a] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="pb-4">
                    {plan.isCustom ? (
                      <span className="text-4xl font-black text-white">Custom</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white">
                          £<NumberFlow
                            value={isYearly ? plan.yearlyPrice : plan.price}
                            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            className="text-4xl font-black text-white"
                          />
                        </span>
                        <span className="text-white/40 text-sm ml-1">/user/mo</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-6 leading-relaxed">{plan.description}</p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-white/30 mb-3">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-2">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#e5342a]/10 border border-[#e5342a]/20 flex items-center justify-center">
                            <CheckCheck className="w-3 h-3 text-[#e5342a]" />
                          </span>
                          <span className="text-sm text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <a
                    href={plan.isCustom ? '#contact' : '#get-started'}
                    className={cn(
                      'w-full text-center font-bold text-sm px-6 py-3 rounded-lg transition-colors',
                      plan.popular
                        ? 'bg-[#e5342a] hover:bg-[#c42d24] text-white'
                        : 'border border-white/20 hover:border-white/40 text-white'
                    )}
                  >
                    {plan.buttonText}
                  </a>
                </CardFooter>
              </Card>
            </TimelineContent>
          ))}
        </TimelineContent>

      </div>
    </section>
  )
}
