import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import PageContainer from '@/components/common/PageContainer';
import SeoHead from '@/components/common/SeoHead';
import { SEO_CONFIG } from '@/data/config';
import { useLives, type UseLivesResult } from '@/hooks/useLives';
import { parseDate } from '@/utils/liveDate';
import { formatVenue, stripGroupName } from '@/utils/liveFormat';
import type { Live } from '@/services/googleSheets';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function displayVenue(venue: string): string {
  return formatVenue(venue) || '会場未定';
}

function toDetailHref(live: Live): string {
  const params = new URLSearchParams({
    date: live.date,
    title: live.title,
    venue: live.venue,
  });
  return `/live/detail?${params.toString()}`;
}

export default function LiveCalendarPage() {
  const liveData = useLives();

  return (
    <PageContainer>
      <SeoHead
        title={SEO_CONFIG.pages.liveCalendar.title}
        description={SEO_CONFIG.pages.liveCalendar.description}
        canonical="/live-calendar"
      />
      <LiveCalendarContent {...liveData} />
    </PageContainer>
  );
}

export function LiveCalendarContent({
  upcoming,
  past,
  isLoading,
  isError,
  retry,
  embedded = false,
}: UseLivesResult & { embedded?: boolean }) {
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const lives = useMemo(() => [...upcoming, ...past], [upcoming, past]);
  const livesByDate = useMemo(() => {
    const grouped = new Map<string, Live[]>();
    for (const live of lives) {
      const date = parseDate(live.date);
      if (!date) continue;
      const key = dateKey(date);
      const current = grouped.get(key) ?? [];
      current.push(live);
      grouped.set(key, current);
    }
    return grouped;
  }, [lives]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const today = dateKey(new Date());
  const selectedLives = useMemo(() => {
    if (!selectedDate) return [];

    return [...(livesByDate.get(selectedDate) ?? [])].sort(
      (a, b) => getStartMinutes(a) - getStartMinutes(b),
    );
  }, [livesByDate, selectedDate]);
  const selectedDateValue = selectedDate ? dateFromKey(selectedDate) : null;

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const selectDate = (key: string) => {
    clearCloseTimer();
    setSelectedDate(key);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    clearCloseTimer();
    setIsSheetOpen(false);
    closeTimer.current = window.setTimeout(() => {
      setSelectedDate(null);
      closeTimer.current = null;
    }, 240);
  };

  const changeMonth = (amount: number) => {
    setVisibleMonth((current) => addMonths(current, amount));
    closeSheet();
  };

  useEffect(() => {
    if (!selectedDate || !isSheetOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSheet();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSheetOpen, selectedDate]);

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div className={embedded ? 'px-4 pt-5' : undefined}>
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={15} className="text-foreground" />
        <h1 className="text-base font-bold text-foreground">
          ライブカレンダー
        </h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse rounded-md border border-border bg-white p-4">
          <div className="mx-auto mb-5 h-6 w-40 rounded-full bg-muted" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, index) => (
              <div key={index} className="h-16 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          message="ライブ情報の取得に失敗しました"
          onRetry={retry}
        />
      ) : lives.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          message="現在公開されているライブ情報はありません"
        />
      ) : (
        <>
          <section className="overflow-hidden rounded-md border border-border bg-white">
            <div className="flex items-center justify-between border-b border-border px-3 py-3">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="前月へ"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tabular-nums text-gray-800">
                  {year}年{month + 1}月
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setVisibleMonth(monthStart(new Date()));
                    closeSheet();
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
                >
                  <RotateCcw size={11} />
                  今日
                </button>
              </div>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="翌月へ"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-border bg-muted">
              {WEEKDAYS.map((weekday, index) => (
                <div
                  key={weekday}
                  className={cn(
                    'py-2 text-center text-[10px] font-bold',
                    index === 0 ? 'text-muted-foreground' : index === 6 ? 'text-muted-foreground' : 'text-gray-400',
                  )}
                >
                  {weekday}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-border">
              {Array.from({ length: cellCount }, (_, index) => {
                const day = index - firstWeekday + 1;
                const isInMonth = day >= 1 && day <= daysInMonth;
                const date = isInMonth ? new Date(year, month, day) : null;
                const key = date ? dateKey(date) : '';
                const dayLives = key ? livesByDate.get(key) ?? [] : [];
                const isSelected = key !== '' && selectedDate === key;
                const isToday = key !== '' && today === key;
                const hasLives = dayLives.length > 0;

                return (
                  <button
                    key={`${year}-${month}-${index}`}
                    type="button"
                    disabled={!isInMonth || !hasLives}
                    onClick={() => key && hasLives && selectDate(key)}
                    aria-label={
                      isInMonth
                        ? `${year}年${month + 1}月${day}日${hasLives ? ' ライブあり' : ''}`
                        : undefined
                    }
                    className={cn(
                      'flex min-h-[52px] flex-col items-center justify-center gap-1 bg-white p-1 transition-colors sm:min-h-[58px]',
                      !isInMonth && 'bg-gray-50/60',
                      hasLives && 'cursor-pointer hover:bg-secondary',
                      isSelected && 'bg-secondary ring-2 ring-inset ring-accent',
                    )}
                  >
                    {isInMonth && (
                      <>
                        <span
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold',
                            isToday
                               ? 'bg-accent text-accent-foreground'
                               : 'text-gray-600',
                          )}
                        >
                          {day}
                        </span>
                        {hasLives ? (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-accent"
                          />
                        ) : (
                          <span className="h-1.5 w-1.5" aria-hidden="true" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

        </>
      )}

      {selectedDate && selectedDateValue && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-end justify-center transition-colors duration-200',
            isSheetOpen ? 'bg-gray-900/25' : 'bg-transparent',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="選択した日のライブ一覧"
        >
          <button
            type="button"
            aria-label="ライブ一覧を閉じる"
            onClick={closeSheet}
            className="absolute inset-0 cursor-default"
          />
          <section
            className={cn(
              'relative z-10 w-full max-w-lg overflow-hidden rounded-t-[28px] bg-white shadow-[0_-12px_40px_rgba(221,112,157,0.18)] transition-transform duration-300 ease-out',
              'max-h-[min(72vh,560px)]',
              isSheetOpen ? 'translate-y-0' : 'translate-y-full',
            )}
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between border-b border-border px-5 pb-3 pt-2">
              <h2 className="text-base font-bold text-gray-800">
                {formatJapaneseDate(selectedDateValue)}
              </h2>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="閉じる"
                className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-muted active:opacity-70"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[calc(min(72vh,560px)-76px)] overflow-y-auto px-4 pb-8 pt-3">
              <div className="space-y-2">
                {selectedLives.map((live, index) => (
                  <div
                    key={`${live.date}-${live.title}-${live.venue}-${index}`}
                    className="rounded-md border border-border bg-muted px-4 py-3"
                  >
                    <p className="break-words text-sm font-bold leading-snug text-gray-800">
                      {stripGroupName(live.title) || live.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                      <span className="break-words">{displayVenue(live.venue)}</span>
                        <span className="whitespace-pre-line font-medium text-foreground">
                        {live.startTime || '出演時間未定'}
                      </span>
                    </div>
                    <Link
                      to={toDetailHref(live)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90 active:bg-accent/80"
                    >
                      詳細を見る
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function dateFromKey(key: string): Date {
  return new Date(
    Number(key.slice(0, 4)),
    Number(key.slice(5, 7)) - 1,
    Number(key.slice(8, 10)),
  );
}

function formatJapaneseDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`;
}

function getStartMinutes(live: Live): number {
  const time = live.startTime.match(/(\d{1,2})[:：](\d{2})/);
  if (!time) return Number.MAX_SAFE_INTEGER;
  return Number(time[1]) * 60 + Number(time[2]);
}