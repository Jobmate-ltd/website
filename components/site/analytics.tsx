'use client'

import * as React from 'react'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GA4_MEASUREMENT_ID } from '@/lib/brand'
import { useConsent } from '@/components/site/consent-banner'

/**
 * Analytics — GA4 and Vercel Speed Insights, loaded only after analytics
 * consent. Nothing is requested from googletagmanager.com or vercel-insights
 * until `consent.analytics` is true; if consent is later withdrawn the GA
 * disable flag is set so an already-loaded tag stops sending.
 *
 * @example
 *   <Analytics />   // once, in the root layout, after <ConsentBanner/>
 */
export function Analytics() {
  const consent = useConsent()
  const granted = consent?.analytics === true

  React.useEffect(() => {
    ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = !granted
  }, [granted])

  if (!granted) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
      <SpeedInsights />
    </>
  )
}

export default Analytics
