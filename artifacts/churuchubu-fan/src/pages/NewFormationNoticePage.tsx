import { ArrowUpRight } from 'lucide-react';
import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import Card from '@/components/common/Card';
import { NEW_FORMATION_NOTICE } from '@/data/newFormation';

export default function NewFormationNoticePage() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <PageContainer className="pt-3">
      <SeoHead
        title={`${NEW_FORMATION_NOTICE.title} | ちゅ〜るちゅーぶ`}
        description="恋羽音ひあさんの期間限定強化メンバー加入と新体制お披露目のお知らせです。"
        canonical="/members/strengthened-hia"
      />

      <Link
        to="/"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← ホームに戻る
      </Link>

      <Card className="overflow-hidden">
        <div className="h-1 bg-accent" />
        <div className="space-y-5 px-5 py-5">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              新体制のお知らせ
            </p>
            <h1 className="mt-2 text-xl font-bold leading-8 text-foreground">
              {NEW_FORMATION_NOTICE.memberName}
            </h1>
            <p className="mt-1 text-sm font-semibold text-accent">
              期間限定 強化メンバー加入
            </p>
          </div>

          <section aria-label="強化メンバー加入のお知らせ" className="space-y-3">
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {`${NEW_FORMATION_NOTICE.memberName}が、${NEW_FORMATION_NOTICE.affiliation}より${NEW_FORMATION_NOTICE.periodLabel}で
ちゅ〜るちゅーぶの「強化メンバー」として加入します。`}
            </p>
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {`※活動期間は期間限定となりますが、
終了時期は未定です。`}
            </p>
          </section>

          <section aria-labelledby="debut-heading" className="space-y-3">
            <h2 id="debut-heading" className="text-sm font-bold text-foreground">
              新体制お披露目
            </h2>
            <div className="space-y-3 border-y border-border bg-muted/30 px-4 py-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="shrink-0 text-sm text-muted-foreground" aria-hidden="true">日付</span>
                <span className="font-semibold text-foreground">
                  {NEW_FORMATION_NOTICE.debutDate}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="shrink-0 text-sm text-muted-foreground" aria-hidden="true">会場</span>
                <span className="text-foreground">{NEW_FORMATION_NOTICE.venue}</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              新たな体制でのちゅ〜るちゅーぶを
              <br />
              ぜひ楽しみにお待ちください。
            </p>
          </section>

          <div className="space-y-3 border-t border-border pt-5">
            <a
              href={NEW_FORMATION_NOTICE.hiaXUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-between rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <span>恋羽音ひあ Xはこちら</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              href={NEW_FORMATION_NOTICE.officialXUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-between rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent/10"
            >
              <span>公式Xの告知はこちら</span>
              <ArrowUpRight size={16} className="text-accent" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}