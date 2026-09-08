import { AlertTriangle, CalendarDays, ExternalLink } from 'lucide-react';
import { Button } from '@workspace/churuchubu-design-system/components/ui/button';
import Card from '@/components/common/Card';
import BenefitText from '@/components/common/BenefitText';
import { REGULATION_CHANGE_NOTICE } from '@/data/benefits';

export default function RegulationChangeNotice() {
  const notice = REGULATION_CHANGE_NOTICE;

  return (
    <section
      id={notice.id}
      className="scroll-mt-6"
      aria-labelledby={`${notice.id}-title`}
    >
      <Card className="overflow-hidden border-accent/40">
        <div className="border-t-4 border-accent bg-accent/5 px-4 pb-5 pt-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <AlertTriangle size={18} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                重要なお知らせ
              </p>
              <h2
                id={`${notice.id}-title`}
                className="mt-1 text-lg font-bold leading-tight text-foreground"
              >
                {notice.title}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent/30 bg-white px-3 py-2.5">
            <CalendarDays size={16} className="shrink-0 text-accent" aria-hidden="true" />
            <p className="flex flex-wrap gap-x-1 text-sm font-bold text-foreground">
              <span className="whitespace-nowrap">{notice.effectiveDate}より</span>
              <span className="whitespace-nowrap">特典内容が変更になります</span>
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <NoticeBlock title={notice.studentDiscount.title}>
              <p>
                <BenefitText>{notice.studentDiscount.text}</BenefitText>
              </p>
              <p className="mt-1 font-semibold text-foreground">
                ※ <BenefitText>{notice.studentDiscount.note}</BenefitText>
              </p>
            </NoticeBlock>

            <NoticeBlock title={notice.entryBenefit.title}>
              <p>
                <BenefitText>{notice.entryBenefit.text}</BenefitText>
              </p>
              <div className="mt-2 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold leading-6 text-foreground">
                <p>
                  ※ <BenefitText>{notice.entryBenefit.distributionUntil}</BenefitText>
                </p>
                <p>
                  ※ <BenefitText>{notice.entryBenefit.usageUntil}</BenefitText>
                </p>
              </div>
              <p className="mt-2">
                <BenefitText>{notice.entryBenefit.followUp}</BenefitText>
              </p>
            </NoticeBlock>

            <NoticeBlock title={notice.chekiMenu.title}>
              <p>
                <BenefitText>{notice.chekiMenu.text}</BenefitText>
              </p>
            </NoticeBlock>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-4 w-full rounded-xl border-accent/40 bg-white"
            asChild
          >
            <a href={notice.xUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} />
              公式Xでのお知らせはこちら
            </a>
          </Button>
        </div>
      </Card>
    </section>
  );
}

function NoticeBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white px-3.5 py-3 text-sm leading-6 text-gray-600">
      <h3 className="mb-1 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}