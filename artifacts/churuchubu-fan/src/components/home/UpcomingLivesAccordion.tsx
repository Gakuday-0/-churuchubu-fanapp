/**
 * UpcomingLivesAccordion — ホーム用「今後のライブ」一覧
 *
 * - 内側: 各ライブ行を個別に開閉してブレークダウン表示
 * - upcoming[1..3]（先頭は NextLiveCard で表示済み）を最大3件表示
 * - 4件目以降がある場合は「先のライブ予定を見る」→ /live
 */

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Gift, MapPin, Ticket } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import { LivePriceRows, LiveScheduleRows } from '@/components/live/LiveInfoRows';
import type { Live } from '@/services/googleSheets';
import { formatDate, formatVenue, stripGroupName } from '@/utils/liveFormat';
import { normalizeTicketUrl } from '@/utils/ticket';
import OfficialXPostButton from '@/components/live/OfficialXPostButton';

interface UpcomingLivesAccordionProps {
  /** useLives() の upcoming 全件（先頭1件は NextLiveCard が表示） */
  upcoming: Live[];
  isLoading: boolean;
}

export default function UpcomingLivesAccordion({
  upcoming,
  isLoading,
}: UpcomingLivesAccordionProps) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 先頭を除いた最大3件（先頭は NextLiveCard で表示済み）
  const lives = upcoming.slice(1, 4);
  const hasMoreLives = upcoming.length > 4;

  // ロード中 or 今後ライブが1件以下（先頭のみ）なら非表示
  if (isLoading || lives.length === 0) return null;

  const toggleItem = (idx: number) => {
    const isOpening = !expandedSet.has(idx);

    setExpandedSet((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

    if (isOpening) {
      // 詳細パネルの展開アニメーション後に、対象ライブを画面中央へ移動します。
      window.setTimeout(() => {
        const item = itemRefs.current[idx];
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const targetTop =
          window.scrollY +
          rect.top +
          rect.height / 2 -
          window.innerHeight / 2;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      }, 240);
    }
  };

  return (
    <section className="px-4 pt-3">
      <div className="overflow-hidden rounded-md border border-border bg-white">
        <div className="flex items-center gap-2 px-4 py-3.5">
          <span className="text-sm font-bold text-gray-800">今後のライブ</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-foreground">
            {lives.length}件
          </span>
        </div>

        <div className="border-t border-border">
              {lives.map((live, i) => {
                const isExpanded = expandedSet.has(i);
                const displayDate  = formatDate(live.date);
                const displayTitle = stripGroupName(live.title);
                const displayVenue = formatVenue(live.venue);
                const ticketUrl = normalizeTicketUrl(live.ticketUrl);
                const hasDetails =
                  live.openTime ||
                  live.startTime ||
                  live.price ||
                  live.benefit ||
                  ticketUrl ||
                  live.xPostUrl;

                return (
                  <div
                    key={`${live.date}-${i}`}
                    ref={(element) => {
                      itemRefs.current[i] = element;
                    }}
                    className="animate-in border-b border-border fade-in duration-300 last:border-b-0"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* 行ヘッダー */}
                    <button
                      type="button"
                      onClick={() => toggleItem(i)}
                      aria-expanded={isExpanded}
                      className="grid w-full grid-cols-[4rem_minmax(0,1fr)_5.5rem_auto] items-center gap-2 px-4 py-3 text-left transition-colors active:bg-secondary"
                    >
                      {/* 日付バッジ */}
                      <span className="min-w-[4rem] shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-center text-[11px] font-bold text-foreground whitespace-nowrap">
                        {displayDate || live.date}
                      </span>

                      {/* イベント名 + 会場 */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {displayTitle || live.title}
                        </p>
                      </div>

                      <p
                        className={cn(
                          'flex min-w-0 items-center gap-0.5 truncate text-[11px] text-gray-900',
                          !displayVenue && 'invisible',
                        )}
                        title={displayVenue}
                      >
                        <MapPin size={10} className="inline shrink-0 text-muted-foreground" />
                        <span className="truncate">{displayVenue || '会場未定'}</span>
                      </p>

                      {/* 展開シェブロン */}
                      {hasDetails && (
                        <ChevronDown
                          size={14}
                          className={cn(
                            'shrink-0 text-muted-foreground transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      )}
                    </button>

                    {/* 詳細パネル */}
                    {hasDetails && (
                      <div
                        className={cn(
                          'grid transition-all duration-200 ease-in-out',
                          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-4 space-y-2.5">
                            <LiveScheduleRows
                              startTime={live.startTime}
                              openTime={live.openTime}
                            />

                            <LivePriceRows price={live.price} />

                            {/* お目当て特典 */}
                            {live.benefit && (
                              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                                <Gift size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1">{live.benefit}</span>
                              </div>
                            )}

                            {/* チケットボタン */}
                            {ticketUrl ? (
                              <a
                                href={ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  'flex items-center justify-center gap-2 w-full rounded-xl',
                                  'mt-1 bg-accent py-2.5 text-sm font-semibold text-accent-foreground',
                                  'transition-all duration-150 hover:bg-accent/90',
                                  'active:scale-[0.97] active:bg-accent/80',
                                )}
                              >
                                <Ticket size={14} />
                                チケットを購入する
                              </a>
                            ) : (
                              <div className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-semibold text-muted-foreground">
                                <Ticket size={14} />
                                チケット情報準備中
                              </div>
                            )}
                            {live.xPostUrl && (
                              <OfficialXPostButton
                                href={live.xPostUrl}
                                compact
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── 4件目以降のライブ予定 ───────────────────── */}
              {hasMoreLives && (
                <div className="px-4 py-3">
                <Link
                  to="/live"
                  className={cn(
                    'flex w-full items-center justify-center gap-1.5 rounded-xl',
                    'border border-border bg-white py-2.5 text-sm font-semibold text-foreground',
                    'transition-colors duration-150 hover:bg-secondary active:bg-muted',
                  )}
                >
                  先のライブ予定を見る
                  <ArrowRight size={14} />
                </Link>
                </div>
              )}
        </div>
      </div>
    </section>
  );
}
