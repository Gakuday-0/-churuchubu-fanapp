import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import PageContainer from '@/components/common/PageContainer';
import SeoHead from '@/components/common/SeoHead';
import LiveCard from '@/components/live/LiveCard';
import { SEO_CONFIG } from '@/data/config';
import { useLives } from '@/hooks/useLives';

export default function LiveDetailPage() {
  const [searchParams] = useSearchParams();
  const { upcoming, past, isLoading, isError, retry } = useLives();
  const date = searchParams.get('date') ?? '';
  const title = searchParams.get('title') ?? '';
  const venue = searchParams.get('venue') ?? '';

  const live = useMemo(
    () =>
      [...upcoming, ...past].find(
        (item) =>
          item.date === date &&
          item.title === title &&
          item.venue === venue,
      ),
    [date, past, title, upcoming, venue],
  );

  return (
    <PageContainer>
      <SeoHead
        title={`ライブ詳細 | ${SEO_CONFIG.pages.live.title}`}
        description={SEO_CONFIG.pages.live.description}
        noIndex
      />

      <h1 className="mb-5 text-xs font-semibold tracking-widest text-foreground">
        LIVE DETAIL
      </h1>

      {isLoading && (
        <div className="animate-pulse rounded-md border border-border bg-white p-5">
          <div className="mb-4 h-5 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
        </div>
      )}

      {isError && (
        <ErrorState
          message="ライブ情報の取得に失敗しました"
          onRetry={retry}
        />
      )}

      {!isLoading && !isError && !live && (
        <EmptyState message="指定されたライブ情報が見つかりません" />
      )}

      {!isLoading && !isError && live && <LiveCard live={live} />}
    </PageContainer>
  );
}