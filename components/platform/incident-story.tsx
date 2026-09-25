import { INCIDENT_STORY } from '@/lib/platform'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { ProductShot } from '@/components/platform/product-shot'

/**
 * IncidentStory — section 5 of the homepage, "One incident, end to end": six
 * steps on the Aceternity sticky-scroll, each with the real screen it
 * happens on. The `id` is what "See how it works" scrolls to.
 */
export function IncidentStory() {
  return (
    <Section id="how-it-works" tone="grey">
      <SectionHeading
        eyebrow="One incident, end to end"
        title="From a tail lift in the yard to a closed training gap"
        lead="One incident at a UK haulier, followed through the platform. Every screen is the product, on a real setup."
        tone="grey"
      />
      <div className="mt-12">
        <StickyScroll
          steps={INCIDENT_STORY.map((step, i) => ({
            label: `Step ${i + 1}`,
            title: step.title,
            description: step.description,
            media: <ProductShot id={step.screenshot} frame className={step.screenshot.endsWith('-phone') ? 'mx-auto max-w-[300px]' : undefined} />,
          }))}
        />
      </div>
    </Section>
  )
}

export default IncidentStory
