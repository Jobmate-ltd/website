import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import ComplianceNote from '@/components/sections/ComplianceNote'
import FeaturesMarquee from '@/components/sections/FeaturesMarquee'
import HowItWorks from '@/components/sections/HowItWorks'
import AnimatedForm from '@/components/sections/AnimatedForm'
import ResultsGrid from '@/components/sections/ResultsGrid'
import Industries from '@/components/sections/Industries'
import DemoStrip from '@/components/sections/DemoStrip'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import GetStarted from '@/components/sections/GetStarted'
import Footer from '@/components/sections/Footer'
import { CANONICAL_HOME } from '@/lib/brand'
import { graph, jsonLd, softwareApplicationSchema } from '@/lib/schema'

/**
 * Organization and WebSite are emitted once, from the root layout, and are
 * available to every route. The homepage adds SoftwareApplication, which
 * references the Organization by @id rather than restating it.
 *
 * FAQPage is NOT emitted here. It is emitted by <FAQ /> itself, from the same
 * array it renders, so the markup and the schema cannot fall out of step.
 */
const homeGraph = jsonLd(graph(softwareApplicationSchema(CANONICAL_HOME)))

export default function Page() {
  return (
    <main className="bg-surface-0 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeGraph }}
      />
      <Navbar />
      <Hero />
      <ComplianceNote />
      <Industries />
      <FeaturesMarquee />
      <HowItWorks />
      <AnimatedForm />
      <ResultsGrid />
      {/* Mid-page demo interception: the reader has just seen the outcomes and
          is about to hit a price. Whoever is convinced but not ready to
          self-serve otherwise leaves here. */}
      <DemoStrip />
      <Pricing />
      <FAQ />
      <GetStarted />
      <Footer />
    </main>
  )
}
