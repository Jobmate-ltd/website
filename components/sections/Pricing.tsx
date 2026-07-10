'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TimelineContent } from '@/components/ui/timeline-animation'
import { cn } from '@/lib/utils'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import { PRICING_TIERS, TRIAL } from '@/lib/brand'
import AmbientGlow from '@/components/AmbientGlow'
import NumberFlow from '@number-flow/react'
import { PiChecks as CheckCheck } from 'react-icons/pi'
import { motion } from 'motion/react'
import React, { useRef, useState } from 'react'

const baseFeatures = [
  'Unlimited incident reports',
  'Dashboard analytics',
  'Offline mode & GPS tagging',
  'Photo, video & voice attachments',
  'Real-time supervisor alerts',
  'Full audit trail',
  'HSSE compliance tools',
  'Email support',
]

const plans = [
  {
    name: 'Starter',
    description: 'For teams of up to 500 users. Full access to every jobsafe feature from day one.',
    price: PRICING_TIERS[0].price as number,
    yearlyPrice: 2.70,
    isCustom: false,
    threshold: 'Up to 500 licences',
    buttonText: 'Sign up now',
    buttonHref: SIGNUP_TRIAL_URL,
    popular: false,
    featuresHeader: 'Everything included:',
    features: baseFeatures,
  },
  {
    name: 'Professional',
    description: 'For teams of 500–1,000 users. Same full feature set at a better per-licence rate.',
    price: PRICING_TIERS[1].price as number,
    yearlyPrice: 2.50,
    isCustom: false,
    threshold: '500–1,000 licences',
    buttonText: 'Sign up now',
    buttonHref: SIGNUP_TRIAL_URL,
    popular: true,
    featuresHeader: 'Everything included:',
    features: baseFeatures,
  },
  {
    name: 'Enterprise',
    description: 'For organisations with 1,000+ users. Dedicated support, SLA guarantees, and a tailored rollout for your organisation.',
    price: 0,
    yearlyPrice: 0,
    isCustom: true,
    threshold: '1,000+ licences',
    buttonText: 'Contact us',
    buttonHref: 'mailto:sales@jobsafe.cloud',
    popular: false,
    featuresHeader: 'Everything included, plus:',
    features: [
      ...baseFeatures,
      'Dedicated account manager',
      'Custom SLA guarantee',
      'GDPR data processing agreement',
      'Priority support',
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
      <div className="relative z-10 mx-auto grid grid-cols-2 rounded-full bg-white/5 border border-white/10 p-1">
        <button
          onClick={() => handleSwitch('0')}
          className={cn(
            'relative z-10 sm:h-12 h-10 cursor-pointer rounded-full sm:px-6 px-4 flex items-center justify-center font-medium transition-colors',
            selected === '0' ? 'text-white' : 'text-white/60 hover:text-white',
          )}
        >
          {selected === '0' && (
            <motion.span
              layoutId="switch"
              className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch('1')}
          className={cn(
            'relative z-10 sm:h-12 h-10 cursor-pointer rounded-full sm:px-6 px-4 flex items-center justify-center font-medium transition-colors',
            selected === '1' ? 'text-white' : 'text-white/60 hover:text-white',
          )}
        >
          {selected === '1' && (
            <motion.span
              layoutId="switch"
              className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Annual
            <span className="rounded-full bg-brand/20 border border-brand/30 px-2 py-0.5 text-xs font-bold text-brand">
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
    <section id="pricing" className="relative overflow-hidden bg-surface-0 py-12 md:py-14">
      <AmbientGlow position="bottom right" intensity={0.07} className="h-[520px]" />
      <div className="px-4 max-w-5xl mx-auto relative z-10" ref={pricingRef}>

        <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between mb-12">
          <div className="text-left mb-6">
            <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance leading-tight text-white mb-4">
              Simple, transparent pricing — one price per licence
            </h2>
            <TimelineContent
              as="p"
              animationNum={0}
              timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
              customVariants={revealVariants}
              className="text-white/50 text-sm max-w-xs"
            >
              No feature tiers. No hidden extras. Every team gets the full platform — incident reporting, analytics, offline mode, audit trail, and HSSE compliance tools included.
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
                    ? 'bg-surface-1 border-brand shadow-[0_0_40px_rgb(var(--brand-rgb)_/_0.15)]'
                    : 'bg-transparent border-white/10'
                )}
              >
                <CardContent className="pt-6">
                  {plan.popular && (
                    <div className="mb-4">
                      <span className="bg-brand text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="pb-4 min-h-[3.5rem]">
                    {plan.isCustom ? (
                      <span className="text-4xl font-black text-white">Contact us</span>
                    ) : (
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-4xl font-black text-white">
                          £<NumberFlow
                            value={isYearly ? plan.yearlyPrice : plan.price}
                            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            className="text-4xl font-black text-white"
                          />
                        </span>
                        <span className="text-white/60 text-sm ml-1">
                          {isYearly ? 'per licence / mo, billed annually' : 'per licence / mo'}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{plan.threshold}</h3>
                  <p className="text-sm text-white/50 mb-6 leading-relaxed min-h-[3.75rem] text-pretty">{plan.description}</p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-white/60 mb-3">
                      {plan.featuresHeader}
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                            <CheckCheck className="w-3 h-3 text-brand" />
                          </span>
                          <span className="text-sm text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <a
                    href={plan.buttonHref}
                    className={cn(
                      'w-full text-center font-bold text-sm px-6 py-3 rounded-lg transition active:scale-[0.97]',
                      plan.popular
                        ? 'bg-brand hover:bg-brand-hover text-white'
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

        <p className="text-center text-white/60 text-sm mt-8">
          {TRIAL.label}
        </p>

      </div>
    </section>
  )
}
