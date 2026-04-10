import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import FeaturesMarquee from '@/components/sections/FeaturesMarquee'
import HowItWorks from '@/components/sections/HowItWorks'
import AnimatedForm from '@/components/sections/AnimatedForm'
import ResultsGrid from '@/components/sections/ResultsGrid'
import Industries from '@/components/sections/Industries'
import Pricing from '@/components/sections/Pricing'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import GetStarted from '@/components/sections/GetStarted'
import Footer from '@/components/sections/Footer'

export default function Page() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <Industries />
      <FeaturesMarquee />
      <HowItWorks />
      <AnimatedForm />
      <ResultsGrid />
      <Pricing />
      <Testimonials />
      <FAQ />
      <GetStarted />
      <Footer />
    </main>
  )
}
