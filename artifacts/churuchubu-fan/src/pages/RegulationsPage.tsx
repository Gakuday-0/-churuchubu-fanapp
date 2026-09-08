import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import Accordion, { type AccordionSection } from '@/components/common/Accordion';
import { REGULATIONS } from '@/data/regulations';
import { SEO_CONFIG } from '@/data/config';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

export default function RegulationsPage() {
  const sections: AccordionSection[] = REGULATIONS.map((section) => ({
    id: section.id,
    title: section.title,
    isSpecial: section.isSpecial,
    content: (
      <ul className="space-y-2.5">
        {section.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed"
          >
            <span
              className={cn(
                'mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full',
                 section.isSpecial ? 'bg-accent' : 'bg-muted-foreground',
              )}
            />
            {item.text}
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <PageContainer>
      <SeoHead
        title={SEO_CONFIG.pages.regulations.title}
        description={SEO_CONFIG.pages.regulations.description}
        canonical="/regulations"
      />

      <SectionTitle as="h1">ご利用案内</SectionTitle>

      <Accordion sections={sections} />
    </PageContainer>
  );
}
