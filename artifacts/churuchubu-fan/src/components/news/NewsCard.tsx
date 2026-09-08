import { ExternalLink } from 'lucide-react';
import type { News } from '@/services/googleSheets';
import { formatDate } from '@/utils/liveFormat';

interface NewsCardProps {
  item: News;
  compact?: boolean;
}

export default function NewsCard({ item, compact = false }: NewsCardProps) {
  return (
    <article className="rounded-md border border-border bg-white p-4">
      <time className="text-[11px] font-medium tracking-wide text-muted-foreground">
        {formatDate(item.date)}
      </time>
      <h2 className={`${compact ? 'mt-1 text-sm' : 'mt-2 text-base'} font-bold leading-relaxed text-gray-800`}>
        {item.title}
      </h2>
      <p className={`${compact ? 'mt-1 line-clamp-2 text-xs' : 'mt-2 text-sm'} whitespace-pre-line leading-relaxed text-gray-600`}>
        {item.content}
      </p>
      {!compact && item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:opacity-70"
        >
          詳細を見る
          <ExternalLink size={13} />
        </a>
      )}
    </article>
  );
}