import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import ComplianceNote from '@/components/sections/ComplianceNote'
import FeaturesMarquee from '@/components/sections/FeaturesMarquee'
import HowItWorks from '@/components/sections/HowItWorks'
import AnimatedForm from '@/components/sections/AnimatedForm'
import ResultsGrid from '@/components/sections/ResultsGrid'
import Industries from '@/components/sections/Industries'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import GetStarted from '@/components/sections/GetStarted'
import Footer from '@/components/sections/Footer'

export default function Page() {
  return (
    <main className="bg-surface-0 min-h-screen">
      <Navbar />
      <Hero />
      <ComplianceNote />
      <Industries />
      <FeaturesMarquee />
      <HowItWorks />
      <AnimatedForm />
      <ResultsGrid />
      <Pricing />
      <FAQ />
      <GetStarted />
      <Footer />
    </main>
  )
}
