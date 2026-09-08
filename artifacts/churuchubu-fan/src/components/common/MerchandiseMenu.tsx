import Card from '@/components/common/Card';
import BenefitText from '@/components/common/BenefitText';
import SectionTitle from '@/components/common/SectionTitle';
import { MERCHANDISE_MENU } from '@/data/benefits';

interface MerchandiseMenuProps {
  compact?: boolean;
}

export default function MerchandiseMenu({ compact = false }: MerchandiseMenuProps) {
  return (
    <section className={compact ? 'mt-4' : 'mt-6'} aria-label="物販メニュー">
      <SectionTitle as="h2" className={compact ? 'mb-3' : 'mb-4'}>
        物販メニュー
      </SectionTitle>

      <Card className="overflow-hidden">
        <div
          className={
            compact
              ? 'border-t-4 border-border px-3 pb-3 pt-3'
              : 'border-t-4 border-border px-4 pb-4 pt-4'
          }
        >
          <div className="divide-y divide-border">
            {MERCHANDISE_MENU.map((item) => (
              <div
                key={item.id}
                className={compact ? 'py-3 first:pt-0 last:pb-0' : 'py-4 first:pt-0 last:pb-0'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-semibold text-gray-800">
                      <BenefitText>{item.title}</BenefitText>
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {item.notes.map((note) => (
                        <p key={note} className="text-xs text-gray-500">
                          <BenefitText>{note}</BenefitText>
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="shrink-0 text-base font-bold tracking-wide text-foreground">
                    {item.price}
                  </p>
                </div>

                {item.bundleBenefits && (
                  <div className="mt-3 rounded-xl bg-secondary px-3 py-2.5">
                    <p className="mb-1.5 text-xs font-semibold text-foreground">
                      まとめ買い特典
                    </p>
                    <div className="space-y-0.5">
                      {item.bundleBenefits.map((benefit) => (
                        <p key={benefit} className="text-xs leading-relaxed text-gray-600">
                          <BenefitText>{benefit}</BenefitText>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}