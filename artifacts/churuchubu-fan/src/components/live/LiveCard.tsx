/**
 * LiveCard — ライブ情報カード（ホーム・ライブページ共通）
 *
 * - formatDate / formatPrice / stripGroupName を適用（表示のみ）
 * - startTime / price はセル内改行を whitespace-pre-line で保持
 * - 日数バッジ（本日開催 / 明日開催 / あとN日）
 */

import { Calendar, Check, Gift, MapPin, Ticket } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import Card from '@/components/common/Card';
import { LivePriceRows, LiveScheduleRows } from '@/components/live/LiveInfoRows';
import { getDayBadge, getDaysUntil, parseDate } from '@/utils/liveDate';
import { formatDate, formatVenue, stripGroupName } from '@/utils/liveFormat';
import { normalizeTicketUrl } from '@/utils/ticket';
import type { Live } from '@/services/googleSheets';
import { makeLiveKey } from '@/store/myData';
import { useMyData } from '@/contexts/MyDataContext';
import OfficialXPostButton from '@/components/live/OfficialXPostButton';

interface LiveCardProps {
  live: Live;
  /** フェードインの遅延 ms（スタガー用） */
  animationDelay?: number;
  className?: string;
}

export default function LiveCard({
  live,
  animationDelay = 0,
  className,
}: LiveCardProps) {
  const date       = parseDate(live.date);
  const daysUntil  = date !== null ? getDaysUntil(date) : null;
  const isUpcoming = daysUntil !== null && daysUntil >= 0;
  const badge      = isUpcoming && daysUntil !== null ? getDayBadge(daysUntil) : null;

  // 表示用に整形（スプレッドシートのデータは変更しない）
  const displayDate    = formatDate(live.date);
  const displayTitle   = stripGroupName(live.title);
  const displayVenue   = formatVenue(live.venue);
  const ticketUrl      = normalizeTicketUrl(live.ticketUrl);

  // ── 参加記録（MyDataContext が提供されている場合のみ有効） ─
  const ctx        = useMyData();
  const liveKey    = makeLiveKey(live.date, live.title);
  const liveRecord = ctx?.data.lives[liveKey];
  const attended   = liveRecord?.attended ?? false;
  // 過去ライブ（今日以前）にのみ参加記録を表示する
  const showTracking = ctx !== null && daysUntil !== null && daysUntil <= 0;

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-3 duration-500',
        className,
      )}
      style={animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <Card
        variant={isUpcoming ? 'gradient' : 'default'}
        className={cn(
          'transition-shadow duration-200 hover:shadow-md overflow-hidden',
          !isUpcoming && 'opacity-75',
        )}
      >
        {/* ── ヘッダー（バッジ + イベント名） ──────────────── */}
        <div className="border-b border-border px-5 pb-4 pt-5">
          {/* バッジ */}
          <div className="flex items-center gap-2 mb-2.5">
            {badge ? (
              <span
                className={cn(
                  'inline-block rounded-full text-[10px] font-bold px-3 py-0.5 tracking-wider',
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            ) : (
              <span className="inline-block rounded-full text-[10px] font-bold px-3 py-0.5 tracking-wider bg-gray-100 text-gray-400">
                終了
              </span>
            )}
          </div>

          {/* イベント名 + 会場 */}
          <div className="flex min-w-0 items-baseline gap-1.5">
            <h3
              className={cn(
                'min-w-0 max-w-[58%] shrink-0 truncate text-[15px] font-bold leading-snug',
                isUpcoming ? 'text-gray-900' : 'text-gray-500',
              )}
            >
              {displayTitle || live.title}
            </h3>
            {displayVenue && (
              <span
                className={cn(
                  'flex max-w-[42%] shrink-0 items-center gap-0.5 truncate text-[11px]',
                  isUpcoming ? 'text-gray-900' : 'text-gray-700',
                )}
                title={displayVenue}
              >
                <MapPin size={10} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{displayVenue}</span>
              </span>
            )}
          </div>
        </div>

        {/* ── 詳細情報 ─────────────────────────────────────── */}
        <div className="px-5 py-4 space-y-2.5">
          {/* 日付 */}
          {displayDate && (
            <InfoRow icon={Calendar} dimmed={!isUpcoming}>
              <span className="font-medium">{displayDate}</span>
            </InfoRow>
          )}

          <LiveScheduleRows
            startTime={live.startTime}
            openTime={live.openTime}
            dimmed={!isUpcoming}
          />

          <LivePriceRows price={live.price} dimmed={!isUpcoming} />

          {/* お目当て特典 */}
          {live.benefit && (
            <InfoRow icon={Gift} dimmed={!isUpcoming}>
              {live.benefit}
            </InfoRow>
          )}
        </div>

        {/* ── チケットボタン ────────────────────────────────── */}
        <div className="px-5 pb-5">
          {isUpcoming ? (
            ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center gap-2 w-full rounded-xl',
                  'bg-accent py-3 text-sm font-semibold text-accent-foreground',
                  'transition-all duration-150 hover:bg-accent/90',
                  'active:scale-[0.97] active:bg-accent/80',
                )}
              >
                <Ticket size={15} />
                チケットを購入する
              </a>
            ) : (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-muted-foreground">
                <Ticket size={15} />
                チケット情報準備中
              </div>
            )
          ) : (
            <div className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold py-3">
              <Ticket size={15} />
              販売終了
            </div>
          )}
          {live.xPostUrl && (
            <div className="mt-2">
              <OfficialXPostButton href={live.xPostUrl} />
            </div>
          )}
        </div>

        {/* ── 参加記録（過去ライブのみ表示） ─────────────── */}
        {showTracking && (
          <div className="border-t border-border px-5 pb-4 pt-3.5">
            {/* 参加チェック */}
            <button
              type="button"
              onClick={() =>
                ctx?.toggleAttended(live.date, live.title, live.venue ?? '')
              }
              className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-left transition-colors hover:bg-muted active:opacity-70"
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  attended
                    ? 'border-accent bg-accent'
                    : 'border-gray-300 bg-white',
                )}
              >
                {attended && (
                  <Check size={11} strokeWidth={3} className="text-white" />
                )}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold',
                  attended ? 'text-foreground' : 'text-gray-500',
                )}
              >
                このライブに参加した
              </span>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── 内部: アイコン付き情報行 ──────────────────────────────────

function InfoRow({
  icon: Icon,
  children,
  dimmed,
  align = 'center',
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  dimmed?: boolean;
  align?: 'center' | 'start';
}) {
  return (
    <div
      className={cn(
        'flex gap-2.5 text-sm',
        align === 'start' ? 'items-start' : 'items-center',
        dimmed ? 'text-gray-400' : 'text-gray-600',
      )}
    >
      <Icon
        size={15}
        className={cn(
          'shrink-0',
          align === 'start' && 'mt-0.5',
          dimmed ? 'text-gray-300' : 'text-muted-foreground',
        )}
      />
      <span className="flex-1">{children}</span>
    </div>
  );
}
