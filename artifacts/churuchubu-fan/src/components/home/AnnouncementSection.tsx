import { ChevronRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import SectionTitle from '@/components/common/SectionTitle';
import NewsCard from '@/components/news/NewsCard';
import { useNews } from '@/hooks/useNews';

export default function AnnouncementSection() {
  const { news, isLoading, isError, retry } = useNews();

  return (
    <section className="px-4 pt-6">
      <div className="flex items-center justify-between mb-3">
        <SectionTitle as="h2" className="mb-0">お知らせ</SectionTitle>
        <Link
          to="/news"
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
        >
          もっと見る <ChevronRight size={13} />
        </Link>
      </div>

      <div className="overflow-hidden border-y border-border bg-white">
        {isLoading ? (
          /* Skeleton */
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
                <div className="mt-0.5 h-4 w-20 shrink-0 rounded bg-secondary" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-12 rounded-full bg-muted" />
                  <div className="h-4 w-full rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            message="お知らせの取得に失敗しました"
            onRetry={retry}
          />
        ) : news.length === 0 ? (
          <EmptyState icon={Bell} message="現在お知らせはありません" />
        ) : (
          <div className="space-y-2 p-2">
            {news.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
