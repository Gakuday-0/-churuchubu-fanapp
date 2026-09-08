import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ExternalLink,
  HandCoins,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@workspace/churuchubu-design-system/components/ui/button';
import { Separator } from '@workspace/churuchubu-design-system/components/ui/separator';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import PageContainer from '@/components/common/PageContainer';
import SeoHead from '@/components/common/SeoHead';
import { ALL_MEMBERS } from '@/data/members';
import { SPECIAL_PAGE_LINK_OVERRIDES } from '@/data/specialPageLinks';
import { useSpecialPages } from '@/hooks/useSpecialPages';
import { formatDate } from '@/utils/liveFormat';
import { getDaysUntil, parseDate } from '@/utils/liveDate';

// ── ローディングスケルトン ──────────────────────────────────────
function SpecialPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* eyebrow + title area */}
      <div className="px-2 pt-2 space-y-3">
        <div className="h-3 w-24 rounded-full bg-muted" />
        <div className="h-8 w-3/4 rounded-lg bg-muted" />
        <div className="h-5 w-1/3 rounded-full bg-muted" />
      </div>
      {/* detail block */}
      <div className="rounded-md border border-border bg-card p-6 space-y-3">
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      {/* button block */}
      <div className="space-y-2.5">
        <div className="h-11 w-full rounded-xl bg-muted" />
        <div className="h-11 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function getDaysLabel(dateStr: string): string | null {
  const parsed = parseDate(dateStr);
  if (!parsed) return null;
  const days = getDaysUntil(parsed);
  if (days < 0) return null;
  if (days === 0) return '本日開催';
  return `あと${days}日`;
}

function getEventAccent(title: string): string {
  const matchedMember = ALL_MEMBERS.find(
    (member) =>
      title.includes(member.name) || title.includes(member.shortName),
  );
  return matchedMember?.colorHex ?? 'hsl(var(--accent))';
}

function EventInfoCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  accent: string;
}) {
  return (
      <div
        className="min-w-0 rounded-md border bg-white px-2.5 py-3 text-center"
      style={{ borderColor: `${accent}66` }}
    >
      <Icon
        size={15}
        className="mx-auto mb-1.5"
        style={{ color: accent }}
        aria-hidden="true"
      />
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold leading-5 text-foreground">
        {value}
      </p>
    </div>
  );
}

// ── アクション行（条件付き表示）────────────────────────────────
interface ActionButtonsProps {
  ticketUrl?: string;
  xPostUrl?: string;
  supportUrl?: string;
}

function ActionButtons({ ticketUrl, xPostUrl, supportUrl }: ActionButtonsProps) {
  const hasActions = ticketUrl || xPostUrl || supportUrl;
  if (!hasActions) return null;

  return (
    <div className="space-y-2.5">
      {ticketUrl && (
        <Button
          variant="accent"
          size="lg"
          className="w-full rounded-md"
          asChild
        >
          <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
            <Ticket size={15} />
            チケットを購入する
          </a>
        </Button>
      )}

       {xPostUrl && (
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-md"
          asChild
        >
          <a href={xPostUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} />
             公式X 告知を見る
          </a>
        </Button>
      )}

      {supportUrl && (
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-md"
          asChild
        >
          <a href={supportUrl} target="_blank" rel="noopener noreferrer">
            <HandCoins size={15} />
            支援金募集はこちら
          </a>
        </Button>
      )}
    </div>
  );
}

// ── メインページ ───────────────────────────────────────────────
export default function SpecialPageDetailPage() {
  const { specialPageId = '' } = useParams();
  const { specialPages, isLoading, isError, retry } = useSpecialPages();
  const [isImageOpen, setIsImageOpen] = useState(false);

  const page = useMemo(
    () => specialPages.find((item) => item.id === specialPageId),
    [specialPageId, specialPages],
  );
  const linkOverrides = page
    ? SPECIAL_PAGE_LINK_OVERRIDES[page.title as keyof typeof SPECIAL_PAGE_LINK_OVERRIDES]
    : undefined;

  // 開催日とホームバナーの表示開始日は別管理。
  const eventDate = page?.eventDate ? formatDate(page.eventDate) : '';
  const eventAccent = page ? getEventAccent(page.title) : 'hsl(var(--accent))';
  const daysLabel = page?.eventDate ? getDaysLabel(page.eventDate) : null;

  return (
    <PageContainer>
      <SeoHead
        title={page ? `${page.title} | 特設ページ` : '特設ページ'}
        description={page?.body || 'ちゅ〜るちゅーぶの特設イベントページです。'}
        noIndex
      />

      {/* ── ローディング ── */}
      {isLoading && <SpecialPageSkeleton />}

      {/* ── エラー ── */}
      {isError && (
        <ErrorState
          message="特設ページの取得に失敗しました"
          onRetry={retry}
        />
      )}

      {/* ── 見つからない ── */}
      {!isLoading && !isError && !page && (
        <EmptyState message="指定された特設ページが見つかりません" />
      )}

      {/* ── コンテンツ ── */}
      {!isLoading && !isError && page && (
        <div
          className="space-y-6"
        >
          {/* ─ メインビジュアル ───────────────────────────────────── */}
          {page.mainImageUrl && (
            <div
              className="overflow-hidden rounded-md border bg-white p-1.5"
              style={{ borderColor: `${eventAccent}99` }}
            >
              <img
                src={page.mainImageUrl}
                alt={`${page.title} メインビジュアル`}
                className="max-h-[34rem] w-full rounded-md object-contain"
              />
            </div>
          )}

          {/* ─ ヒーローヘッダー ─────────────────────────────────── */}
          <div
            className="border-y border-l-2 px-4 py-5"
            style={{
              borderColor: `${eventAccent}99`,
            }}
          >
            {/* ページ種別 */}
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              特設ページ
            </p>

            {/* イベント名 */}
            <h1 className="text-xl font-bold leading-tight text-foreground">
              {page.title}
            </h1>

            {/* 時間・料金の追加情報 */}
            <dl className="mt-4 space-y-2.5">
              {page.openTime.trim() && (
                <DetailRow label="開場" value={page.openTime} />
              )}
              {page.startTime.trim() && (
                <DetailRow label="開演" value={page.startTime} />
              )}
              {page.performanceTime.trim() && (
                <DetailRow label="出演" value={page.performanceTime} />
              )}
              {page.price.trim() && (
                <DetailRow label="料金" value={page.price} />
              )}
            </dl>
          </div>

          {/* ─ 開催情報カード ───────────────────────────────────── */}
          {(eventDate || page.venue.trim() || daysLabel) && (
            <div className="grid grid-cols-3 gap-2">
              {eventDate && (
                <EventInfoCard
                  icon={CalendarDays}
                  label="開催日"
                  value={eventDate}
                  accent={eventAccent}
                />
              )}
              {page.venue.trim() && (
                <EventInfoCard
                  icon={MapPin}
                  label="会場"
                  value={page.venue}
                  accent={eventAccent}
                />
              )}
              {daysLabel && (
                <EventInfoCard
                  icon={Sparkles}
                  label="開催まで"
                  value={daysLabel}
                  accent={eventAccent}
                />
              )}
            </div>
          )}

          {/* ─ アクションボタン ──────────────────────────────────── */}
          <ActionButtons
            ticketUrl={linkOverrides?.ticketUrl ?? page.ticketUrl}
            xPostUrl={linkOverrides?.xPostUrl ?? page.xPostUrl}
            supportUrl={page.supportUrl}
          />

          {/* ─ 支援金リターン画像 ────────────────────────────────── */}
          {page.supportReturnImageUrl && (
            <div
              className={cn(
                'rounded-md border px-5 pb-5 pt-5',
              )}
              style={{
                borderColor: `${eventAccent}66`,
                backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, ${eventAccent} 6%, transparent), transparent)`,
              }}
            >
              <h2
                className="mb-3 flex items-center gap-2 text-sm font-bold"
                style={{ color: eventAccent }}
              >
                <ImageIcon size={13} />
                支援金リターン
              </h2>
              <button
                type="button"
                onClick={() => setIsImageOpen(true)}
                className="block w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="支援金リターン画像を拡大表示"
              >
                <img
                  src={page.supportReturnImageUrl}
                  alt={`${page.title} 支援金リターン`}
                  className="w-full rounded-md border border-border object-contain"
                />
              </button>
            </div>
          )}

          {/* ─ イベント概要本文 ───────────────────────────────────── */}
          {page.body.trim() && (
            <div className="rounded-md border border-border bg-white px-6 py-5">
              <h2
                className="mb-3 flex items-center gap-2 text-sm font-bold"
                style={{ color: eventAccent }}
              >
                <Sparkles size={13} aria-hidden="true" />
                イベントについて
              </h2>
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {page.body}
              </p>
            </div>
          )}

          {/* ─ 締めメッセージ ─────────────────────────────────────── */}
          {page.closingMessage?.trim() && (
            <p
              className="border-t px-4 pt-5 text-center text-sm font-medium leading-7 text-muted-foreground"
              style={{ borderColor: `${eventAccent}66` }}
            >
              {page.closingMessage}
            </p>
          )}
        </div>
      )}

      {/* ─ 画像拡大オーバーレイ ───────────────────────────────────── */}
      {isImageOpen && page?.supportReturnImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="支援金リターン画像"
          onClick={() => setIsImageOpen(false)}
        >
          <button
            type="button"
            className="max-h-full max-w-full rounded-xl bg-white p-2 shadow-xl"
            onClick={(event) => event.stopPropagation()}
            aria-label="画像を閉じる"
          >
            <img
              src={page.supportReturnImageUrl}
              alt={`${page.title} 支援金リターン`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </button>
        </div>
      )}
    </PageContainer>
  );
}

// ── 詳細行（内部コンポーネント）────────────────────────────────
interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 text-sm leading-relaxed">
      <dt className="w-10 shrink-0 font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 whitespace-pre-line text-foreground">{value}</dd>
    </div>
  );
}
