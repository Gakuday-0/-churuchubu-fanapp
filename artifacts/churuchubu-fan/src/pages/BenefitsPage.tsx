import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import Card from '@/components/common/Card';
import BenefitText from '@/components/common/BenefitText';
import MerchandiseMenu from '@/components/common/MerchandiseMenu';
import RegulationChangeNotice from '@/components/common/RegulationChangeNotice';
import {
  BENEFIT_SECTIONS,
  POINT_EARNING_RULES,
  POINT_REWARD_NOTE,
  POINT_REWARDS,
} from '@/data/benefits';
import { SEO_CONFIG } from '@/data/config';

export default function BenefitsPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== '#regulation-change-notice') return;

    requestAnimationFrame(() => {
      document
        .getElementById('regulation-change-notice')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.hash]);

  return (
    <PageContainer spacing="md">
      <SeoHead
        title={SEO_CONFIG.pages.benefits.title}
        description={SEO_CONFIG.pages.benefits.description}
        canonical="/benefits"
      />

      <SectionTitle as="h1">特典</SectionTitle>

      <RegulationChangeNotice />

      <MerchandiseMenu />

      <div className="space-y-3">
        {BENEFIT_SECTIONS.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <div className="border-t-4 border-border px-4 pb-4 pt-4">
              <h2 className="mb-4 text-base font-bold text-gray-900">
                {section.title}
              </h2>

              {section.imagePath && (
                <img
                  src={`${import.meta.env.BASE_URL}${section.imagePath}`}
                  alt={`${section.title}の交換早見表`}
                  className="mb-4 w-full rounded-xl border border-border object-contain"
                />
              )}

              {section.lead && (
                <p className="mb-3 text-sm font-semibold leading-relaxed text-gray-700">
                  {section.lead}
                </p>
              )}

              {section.steps && (
                <div className="mb-4 space-y-2 text-sm leading-relaxed text-gray-600">
                  {section.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2">
                      <span>
                        <BenefitText>{step}</BenefitText>
                      </span>
                    </li>
                  ))}
                </div>
              )}

              {section.body && (
                <p className="text-sm leading-7 text-gray-600">
                  <BenefitText>{section.body}</BenefitText>
                </p>
              )}

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-3 text-sm leading-7 text-gray-600 last:mb-0"
                >
                  <BenefitText>{paragraph}</BenefitText>
                </p>
              ))}

              {section.link && (
                <a
                  href={section.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-foreground underline underline-offset-4"
                >
                  {section.link.label}
                </a>
              )}

              {section.items && (
                <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                  {section.items.map((item, index) => (
                    <li
                      key={item}
                      className={index === 0 && section.id === 'entry' ? 'pt-1' : 'flex items-start gap-2'}
                    >
                      {index === 0 && section.id === 'entry' ? (
                        <BenefitText>{item}</BenefitText>
                      ) : (
                        <>
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                          <span>
                            <BenefitText>{item}</BenefitText>
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {section.gift && (
                <p className="mt-4 rounded-xl bg-secondary px-3 py-3 text-sm font-bold leading-relaxed text-foreground">
                  <BenefitText>{section.gift}</BenefitText>
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="border-t-4 border-border px-4 pb-4 pt-4">
          <h2 className="mb-4 text-base font-bold text-gray-900">ポイントカード</h2>

          <h3 className="mb-3 text-sm font-bold text-gray-800">■ ポイントの貯め方</h3>
          <ul className="mb-5 space-y-2 text-sm leading-relaxed text-gray-600">
            {POINT_EARNING_RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  <BenefitText>{rule}</BenefitText>
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 text-sm font-bold text-gray-800">■ ポイントカード特典</h3>
          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            ポイントカードを貯めると、以下の特典と交換できます。
          </p>
          <div className="grid grid-cols-1 gap-2">
            {POINT_REWARDS.map((reward) => (
              <div
                key={reward}
                className="rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm font-semibold text-gray-700"
              >
                <BenefitText>{reward}</BenefitText>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            <BenefitText>{POINT_REWARD_NOTE}</BenefitText>
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
