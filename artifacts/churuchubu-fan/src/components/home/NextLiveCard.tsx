/**
 * NextLiveCard — ホーム用「次のライブ」カード
 *
 * Props で upcoming / isLoading / isError / retry を受け取ります。
 * データの fetch は HomePage 側の useLives() に一本化しています。
 */

import { useState } from 'react';
import { Calendar, Gift, MapPin, Ticket } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import SectionTitle from '@/components/common/SectionTitle';
import Card from '@/components/common/Card';
import { LivePriceRows, LiveScheduleRows } from '@/components/live/LiveInfoRows';
import { formatDate, formatVenue, stripGroupName } from '@/utils/liveFormat';
import { getDayBadge, getDaysUntil, parseDate } from '@/utils/liveDate';
import { normalizeTicketUrl } from '@/utils/ticket';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import type { Live } from '@/services/googleSheets';
import OfficialXPostButton from '@/components/live/OfficialXPostButton';

interface NextLiveCardProps {
  upcoming: Live[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export default function NextLiveCard({
  upcoming,
  isLoading,
  isError,
  retry,
}: NextLiveCardProps) {
  return (
    <section className="px-4 pt-5">
      <SectionTitle as="h2">次回ライブ</SectionTitle>

      {isLoading ? (
        /* Skeleton */
        <div className="rounded-md border border-border bg-white p-5">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-24 rounded-full bg-secondary" />
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="mt-2 h-11 w-full rounded-xl bg-secondary" />
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-md border border-border bg-white p-5">
          <ErrorState
            message="ライブ情報の取得に失敗しました"
            onRetry={retry}
          />
        </div>
      ) : upcoming.length === 0 ? (
        <div className="rounded-md border border-border bg-white p-5">
          <EmptyState icon={Ticket} message="現在ライブ予定はありません" />
        </div>
      ) : (
        <HomeNextLiveCard live={upcoming[0]} />
      )}
    </section>
  );
}

function HomeNextLiveCard({ live }: { live: Live }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const date = parseDate(live.date);
  const daysUntil = date !== null ? Math.max(0, getDaysUntil(date)) : null;
  const dayBadge = daysUntil !== null ? getDayBadge(daysUntil) : null;
  const ticketUrl = normalizeTicketUrl(live.ticketUrl);
  const displayTitle = stripGroupName(live.title) || live.title;
  const displayDate = formatDate(live.date);
  const displayVenue = formatVenue(live.venue);

  return (
    <Card variant="gradient" className="overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        {dayBadge && (
          <span
            className={cn(
              'mb-2.5 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider',
              dayBadge.className,
            )}
          >
            {dayBadge.label}
          </span>
        )}

        <div className="flex min-w-0 items-baseline gap-1.5">
          <h3 className="min-w-0 max-w-[58%] shrink-0 truncate text-[15px] font-bold leading-snug text-gray-900">
            {displayTitle}
          </h3>
          {displayVenue && (
            <span
              className="flex max-w-[42%] shrink-0 items-center gap-0.5 truncate text-[11px] text-gray-900"
              title={displayVenue}
            >
              <MapPin size={10} className="shrink-0 text-muted-foreground" />
              <span className="truncate">{displayVenue}</span>
            </span>
          )}
        </div>

        {displayDate && (
          <div className="mt-4 flex items-center gap-2.5 text-sm text-gray-600">
            <Calendar size={15} className="shrink-0 text-muted-foreground" />
            <span className="font-medium">{displayDate}</span>
          </div>
        )}
      </div>

      {ticketUrl && (
        <div className="px-5 pb-4">
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl',
              'bg-accent py-3 text-sm font-semibold text-accent-foreground',
              'transition-all duration-150 hover:bg-accent/90',
              'active:scale-[0.97] active:bg-accent/80',
            )}
          >
            <Ticket size={15} />
            チケットを購入する
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsDetailsOpen((open) => !open)}
        aria-expanded={isDetailsOpen}
        className="flex w-full items-center justify-center gap-1 border-t border-border px-5 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary active:bg-muted"
      >
        {isDetailsOpen ? '詳細を閉じる ▲' : '詳細を見る ▼'}
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isDetailsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-2.5 border-t border-border px-5 py-4">
            <LiveScheduleRows
              startTime={live.startTime}
              openTime={live.openTime}
            />
            <LivePriceRows price={live.price} />
            {live.benefit && (
              <div className="flex items-start gap-2.5 text-sm text-gray-600">
                <Gift size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 whitespace-pre-line">{live.benefit}</span>
              </div>
            )}
            {live.xPostUrl && (
              <OfficialXPostButton href={live.xPostUrl} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
