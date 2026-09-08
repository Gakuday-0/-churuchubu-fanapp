/**
 * LivePage — ライブスケジュールページ
 *
 * - upcoming: 今日以降のライブ（近い順）
 * - past:     終了済みライブ → アコーディオンで折りたたみ表示
 *
 * CSV（SHEETS_CONFIG.csv.live.url）を更新するだけで
 * ホームページと共に自動反映されます。
 */

import { useState } from 'react';
import { CalendarDays, ChevronDown, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import SeoHead from '@/components/common/SeoHead';
import LiveCard from '@/components/live/LiveCard';
import { SEO_CONFIG } from '@/data/config';
import { useLives } from '@/hooks/useLives';

// スケルトンカード（ロード中）
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="animate-pulse rounded-md border border-border bg-white p-5"
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="space-y-3">
        <div className="h-4 w-24 rounded-full bg-secondary" />
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="mt-2 h-11 w-full rounded-xl bg-secondary" />
      </div>
    </div>
  );
}

export default function LivePage() {
  const { upcoming, past, isLoading, isError, retry } = useLives();
  const [isPastOpen, setIsPastOpen] = useState(false);

  return (
    <PageContainer>
      <SeoHead
        title={SEO_CONFIG.pages.live.title}
        description={SEO_CONFIG.pages.live.description}
        canonical="/live"
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <SectionTitle as="h1" className="mb-0 shrink-0 !text-sm">ライブスケジュール</SectionTitle>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Link
            to="/live-calendar"
            aria-label="ライブカレンダーを見る"
            className="flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
          >
            <CalendarDays size={13} />
            <span>カレンダー</span>
          </Link>
          {!isLoading && !isError && past.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPastOpen((open) => !open)}
              aria-expanded={isPastOpen}
              className="flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
            >
              <span>過去のライブ</span>
              <span className="text-muted-foreground">全{past.length}件</span>
              <ChevronDown
                size={14}
                className={cn(
                  'transition-transform duration-200',
                  isPastOpen && 'rotate-180',
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── 過去のライブ一覧（見出し横のボタンで開閉） ─────── */}
      {!isLoading && !isError && isPastOpen && past.length > 0 && (
        <div className="mb-5 space-y-3">
          {past.map((live, i) => (
            <LiveCard
              key={`${live.date}-${live.title}-${i}`}
              live={live}
              animationDelay={i * 60}
            />
          ))}
        </div>
      )}

      {/* ── ロード中 ────────────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonCard delay={0} />
          <SkeletonCard delay={80} />
          <SkeletonCard delay={160} />
        </div>
      )}

      {/* ── エラー ──────────────────────────────────────────── */}
      {isError && (
        <ErrorState
          message="ライブ情報の取得に失敗しました"
          onRetry={retry}
        />
      )}

      {/* ── データなし ──────────────────────────────────────── */}
      {!isLoading && !isError && upcoming.length === 0 && past.length === 0 && (
        <EmptyState icon={Ticket} message="現在公開されているライブ情報はありません" />
      )}

      {/* ── 直近ライブ一覧 ───────────────────────────────────── */}
      {!isLoading && !isError && upcoming.length > 0 && (
        <div className="space-y-4">
          {upcoming.map((live, i) => (
            <LiveCard
              key={`${live.date}-${live.title}-${i}`}
              live={live}
              animationDelay={i * 80}
            />
          ))}
        </div>
      )}

    </PageContainer>
  );
}
