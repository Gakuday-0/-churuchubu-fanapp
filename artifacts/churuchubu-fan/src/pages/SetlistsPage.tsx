import { ListMusic } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import SeoHead from '@/components/common/SeoHead';
import SetlistCard from '@/components/setlists/SetlistCard';
import SetlistSongSearch from '@/components/setlists/SetlistSongSearch';
import { SEO_CONFIG } from '@/data/config';
import { useSetlists } from '@/hooks/useSetlists';

export default function SetlistsPage() {
  const { setlists, isLoading, isError, retry } = useSetlists();

  return (
    <PageContainer spacing="md">
      <SeoHead
        title={SEO_CONFIG.pages.setlists.title}
        description={SEO_CONFIG.pages.setlists.description}
        canonical="/setlists"
      />

      <SectionTitle as="h1">過去ライブセトリ</SectionTitle>

      <SetlistSongSearch
        setlists={setlists}
        isLoading={isLoading}
        isError={isError}
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="セットリストを取得中..." />
        </div>
      )}

      {isError && (
        <ErrorState
          message="セットリストの取得に失敗しました"
          onRetry={retry}
        />
      )}

      {!isLoading && !isError && setlists.length === 0 && (
        <div className="rounded-md border border-border bg-white">
          <EmptyState
            icon={ListMusic}
            message="現在公開されているセットリストはありません"
          />
        </div>
      )}

      {!isLoading && !isError && setlists.length > 0 && (
        <div className="space-y-3">
          {setlists.map((item, index) => (
            <SetlistCard
              key={`${item.date}-${index}`}
              item={item}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}