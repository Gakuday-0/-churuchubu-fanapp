import { Bell } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import SeoHead from '@/components/common/SeoHead';
import NewsCard from '@/components/news/NewsCard';
import { SEO_CONFIG } from '@/data/config';
import { useNews } from '@/hooks/useNews';

export default function NewsPage() {
  const { news, isLoading, isError, retry } = useNews();

  return (
    <PageContainer spacing="md">
      <SeoHead
        title={SEO_CONFIG.pages.news.title}
        description={SEO_CONFIG.pages.news.description}
        canonical="/news"
      />

      <SectionTitle as="h1">お知らせ</SectionTitle>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {isError && (
        <ErrorState
          message="お知らせの取得に失敗しました"
          onRetry={retry}
        />
      )}

      {!isLoading && !isError && news.length === 0 && (
        <div className="rounded-md border border-border bg-white">
          <EmptyState icon={Bell} message="現在お知らせはありません" />
        </div>
      )}

      {!isLoading && !isError && news.length > 0 && (
        <div className="space-y-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}