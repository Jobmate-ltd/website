'use client'
import { motion, useInView } from 'motion/react'
import React from 'react'
import type { Variants } from 'motion/react'

type TimelineContentProps = {
  children?: React.ReactNode
  animationNum: number
  className?: string
  timelineRef: React.RefObject<HTMLElement | null>
  as?: string
  customVariants?: Variants
  once?: boolean
  style?: React.CSSProperties
  [key: string]: unknown
}

export const TimelineContent = ({
  children,
  animationNum,
  timelineRef,
  className,
  as = 'div',
  customVariants,
  once = true,
  ...props
}: TimelineContentProps) => {
  const defaultSequenceVariants: Variants = {
    visible: (i: number) => ({
      filter: 'blur(0px)',
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.5,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(20px)',
      y: 0,
      opacity: 0,
    },
  }

  const sequenceVariants = customVariants || defaultSequenceVariants
  const isInView = useInView(timelineRef, { once })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent = (motion as any)[as]

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      variants={sequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
