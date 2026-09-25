import { REGULATIONS } from '@/lib/platform'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { PlatformIcon } from '@/components/platform/icons'

/**
 * RegulationBento — section 6 of the homepage, "Built for UK law": one tile
 * per regulation on the Magic UI bento grid, each naming exactly what the
 * product does with it. No certification claims.
 */
export function RegulationBento({ tone = 'white' }: { tone?: 'white' | 'grey' }) {
  return (
    <Section id="uk-law" tone={tone}>
      <SectionHeading
        eyebrow="Built for UK law"
        title="Written for the regulations you are inspected against"
        lead="Not a generic form with a UK flag on it. Each regulation below has a place in the product, and this is what that place does."
        tone={tone}
      />
      <BentoGrid className="mt-10">
        {REGULATIONS.map((reg) => (
          <BentoCard
            key={reg.id}
            name={reg.name}
            eyebrow={reg.short}
            icon={<PlatformIcon name={reg.icon} />}
            description={reg.does}
            href={reg.href ?? undefined}
            cta={reg.href ? 'See the module' : undefined}
            className={reg.span === 2 ? 'sm:col-span-2' : undefined}
          />
        ))}
      </BentoGrid>
    </Section>
  )
}

export default RegulationBento
