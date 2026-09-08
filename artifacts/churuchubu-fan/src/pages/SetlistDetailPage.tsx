import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListMusic } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import SeoHead from '@/components/common/SeoHead';
import SetlistCard from '@/components/setlists/SetlistCard';
import { SEO_CONFIG } from '@/data/config';
import { useSetlists } from '@/hooks/useSetlists';

export default function SetlistDetailPage() {
  const [searchParams] = useSearchParams();
  const { setlists, isLoading, isError, retry } = useSetlists();
  const targetDate = searchParams.get('date') ?? '';
  const targetSong = searchParams.get('song');

  const setlist = useMemo(
    () => setlists.find((item) => item.date === targetDate),
    [setlists, targetDate],
  );

  return (
    <PageContainer spacing="md">
      <SeoHead
        title={`セトリ詳細 | ${SEO_CONFIG.pages.setlists.title}`}
        description={SEO_CONFIG.pages.setlists.description}
        noIndex
      />

      <SectionTitle as="h1">この日のセトリ</SectionTitle>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="セットリストを取得中..." />
        </div>
      )}

      {isError && (
        <ErrorState
          message="セトリ情報を取得できませんでした"
          onRetry={retry}
        />
      )}

      {!isLoading && !isError && !setlist && (
        <div className="rounded-md border border-border bg-white">
          <EmptyState
            icon={ListMusic}
            message="指定された日のセトリが見つかりません"
          />
        </div>
      )}

      {!isLoading && !isError && setlist && (
        <SetlistCard
          item={setlist}
          initialOpen
          highlightedSong={targetSong}
        />
      )}
    </PageContainer>
  );
}