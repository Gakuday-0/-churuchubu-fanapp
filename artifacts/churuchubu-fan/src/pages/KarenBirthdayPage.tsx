/**
 * 東雲かれん 生誕祭2026 専用特設ページ
 *
 * イベントデータは src/data/karenBirthday2026.ts で一元管理。
 * URL・画像などが決まったらそちらを更新してください。
 */

import { useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  ExternalLink,
  HandCoins,
  MapPin,
  Music,
  ShoppingBag,
  Star,
  Ticket,
} from 'lucide-react';
import { Button } from '@workspace/churuchubu-design-system/components/ui/button';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import PageContainer from '@/components/common/PageContainer';
import SeoHead from '@/components/common/SeoHead';
import { KAREN_BIRTHDAY_2026 } from '@/data/karenBirthday2026';

const EVENT = KAREN_BIRTHDAY_2026;
const ACCENT = EVENT.accentColor;
const ACCENT_TEXT = EVENT.accentTextColor;

// ── カウントダウン計算 ───────────────────────────────────────────
function useCountdown(dateStr: string): number | null {
  return useMemo(() => {
    const target = new Date(`${dateStr}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((target.getTime() - now.getTime()) / 86_400_000);
    return diff >= 0 ? diff : null;
  }, [dateStr]);
}

// ── 金額フォーマット ─────────────────────────────────────────────
function formatPrice(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`;
}

// ── セクション見出し ─────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-4 border-l-2 pl-3 text-base font-bold leading-6 text-foreground"
      style={{ borderColor: ACCENT }}
    >
      {children}
    </h2>
  );
}

// ── チケットカード ─────────────────────────────────────────────
function TicketCard({
  ticket,
}: {
  ticket: (typeof EVENT.tickets)[number];
}) {
  if (ticket.isFeatured) {
    return (
      <div
        className="relative overflow-hidden rounded-md border-2 border-l-4 bg-white px-5 py-5"
        style={{ borderColor: ACCENT }}
      >
        <div className="mt-1 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider"
              style={{ backgroundColor: `${ACCENT}33`, color: ACCENT_TEXT }}
            >
              S TICKET
            </span>
            <p className="mt-2 text-[11px] font-medium text-muted-foreground">
              {ticket.label}
            </p>
          </div>
          <p
            className="shrink-0 text-2xl font-bold tabular-nums"
            style={{ color: ACCENT_TEXT }}
          >
            {formatPrice(ticket.price)}
          </p>
        </div>
        {ticket.includes.length > 0 && (
          <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: `${ACCENT}55` }}>
            {ticket.includes.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${ACCENT}44` }}
                >
                  <Star size={9} style={{ color: ACCENT_TEXT }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-white px-4 py-3.5">
      <p className="text-sm font-semibold text-foreground">{ticket.label}</p>
      <p className="text-base font-bold tabular-nums text-foreground">
        {formatPrice(ticket.price)}
      </p>
    </div>
  );
}

// ── 支援金プランカード ─────────────────────────────────────────
function SupportPlanCard({
  plan,
}: {
  plan: (typeof EVENT.supportPlans)[number];
}) {
  const isFeatured = plan.amount === 50000;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md border bg-white px-5 py-5',
        isFeatured ? 'border-l-4' : 'border',
      )}
      style={{ borderColor: isFeatured ? ACCENT : 'hsl(var(--border))' }}
    >
      <div className="mt-0.5 flex items-center justify-between gap-3">
        <p
          className="text-2xl font-bold tabular-nums"
          style={{ color: ACCENT_TEXT }}
        >
          ¥{plan.amount.toLocaleString('ja-JP')}
        </p>
        {isFeatured && (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider"
            style={{ backgroundColor: `${ACCENT}33`, color: ACCENT_TEXT }}
          >
            PREMIUM
          </span>
        )}
      </div>
      <ul
        className="mt-3.5 space-y-2 border-t pt-3.5"
        style={{ borderColor: `${ACCENT}44` }}
      >
        {plan.returns.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${ACCENT}44` }}
            >
              <Star size={9} style={{ color: ACCENT_TEXT }} />
            </span>
            <span className="whitespace-nowrap">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── タイムライン行 ─────────────────────────────────────────────
function TimelineRow({
  entry,
  isLast,
}: {
  entry: (typeof EVENT.timetable)[number];
  isLast: boolean;
}) {
  const isHighlight = entry.isHighlight;
  const isMerch = entry.isMerchandise;
  const isOpen = entry.isOpen;

  return (
    <div className="relative flex gap-3">
      {/* 縦線 */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-8 bottom-0 w-px"
          style={{ backgroundColor: isHighlight ? `${ACCENT}99` : '#e5e7eb' }}
        />
      )}

      {/* ドット */}
      <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
        {isHighlight ? (
            <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: ACCENT }}
          >
            <Music size={15} style={{ color: ACCENT_TEXT }} />
          </div>
        ) : isMerch ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
            <ShoppingBag size={14} className="text-muted-foreground" />
          </div>
        ) : isOpen ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white">
            <Clock size={14} className="text-muted-foreground" />
          </div>
        ) : (
          <div
            className="h-3 w-3 rounded-full border-2 bg-white"
            style={{ borderColor: `${ACCENT}99` }}
          />
        )}
      </div>

      {/* コンテンツ */}
      <div
        className={cn(
          'mb-3.5 min-w-0 flex-1 rounded-md px-4 py-3',
          isHighlight
            ? 'border-l-2'
            : 'border border-transparent',
        )}
        style={
          isHighlight
            ? { borderColor: `${ACCENT}88`, backgroundColor: `${ACCENT}11` }
            : {}
        }
      >
        <p className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {entry.time}
        </p>
        <p
          className={cn(
            'mt-0.5 font-semibold leading-snug',
            isHighlight ? 'text-base' : 'text-sm',
            isMerch && 'text-muted-foreground',
          )}
          style={isHighlight ? { color: ACCENT_TEXT } : {}}
        >
          {entry.act}
        </p>
        {entry.sub && (
          <p
            className="mt-0.5 text-xs font-medium"
            style={{ color: ACCENT_TEXT }}
          >
            {entry.sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── メインページ ───────────────────────────────────────────────
export default function KarenBirthdayPage() {
  const daysLeft = useCountdown(EVENT.date);

  return (
    <PageContainer>
      <SeoHead
        title={`${EVENT.title} | 特設ページ`}
        description={`${EVENT.dateLabel} ${EVENT.venue} で開催される${EVENT.title}の特設ページです。`}
        noIndex
      />

        <div className="space-y-8">
        {/* ─ 1. メインビジュアル ─────────────────────────────────── */}
        {EVENT.mainImageUrl && (
          <div
            className="overflow-hidden rounded-md border bg-white"
            style={{ borderColor: `${ACCENT}88` }}
          >
            <img
              src={EVENT.mainImageUrl}
              alt={`${EVENT.title} 告知ビジュアル`}
              className="w-full object-contain"
              style={{ maxHeight: '36rem' }}
            />
          </div>
        )}

        {/* ─ 2. イベント概要 ────────────────────────────────────── */}
        <div
          className="border-y border-l-2 px-4 py-5"
          style={{ borderLeftColor: ACCENT }}
        >
          <p className="mb-2 text-sm font-semibold text-muted-foreground">
            生誕祭のお知らせ
          </p>

          <h1 className="whitespace-nowrap text-xl font-bold leading-tight text-foreground">
            {EVENT.title}
          </h1>

          <dl className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays size={14} className="shrink-0 text-muted-foreground" />
              <span className="whitespace-nowrap font-semibold text-foreground">
                {EVENT.dateLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={14} className="shrink-0 text-muted-foreground" />
              <span className="whitespace-nowrap font-semibold text-foreground">
                {EVENT.venue}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={14} className="shrink-0 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                OPEN {EVENT.openTime}　START {EVENT.startTime}
              </span>
            </div>
          </dl>
        </div>

        {/* ─ 3. カウントダウン ────────────────────────────────────── */}
        {daysLeft !== null && (
          <div
            className="flex flex-col items-center justify-center border-y py-5 text-center"
            style={{ borderColor: `${ACCENT}66` }}
          >
            <p className="text-sm font-semibold text-muted-foreground">開催まで</p>
            {daysLeft === 0 ? (
              <p
                className="mt-2 text-2xl font-bold"
                style={{ color: ACCENT_TEXT }}
              >
                本日開催！
              </p>
            ) : (
              <>
                <p className="mt-2 leading-none">
                  <span
                    className="text-5xl font-bold tabular-nums"
                    style={{ color: ACCENT_TEXT }}
                  >
                    {daysLeft}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-muted-foreground">日</span>
                </p>
              </>
            )}
          </div>
        )}

        {/* ─ 4. チケット情報 ──────────────────────────────────────── */}
        <div>
          <SectionHeading>チケット</SectionHeading>
          <div className="space-y-3">
            {EVENT.tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
          {EVENT.ticketNotes.length > 0 && (
            <ul className="mt-3 space-y-1 px-1">
              {EVENT.ticketNotes.map((note) => (
                <li
                  key={note}
                  className="text-xs text-muted-foreground before:content-['※'] before:mr-0.5"
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ─ 5. アクションボタン ──────────────────────────────────── */}
        {(EVENT.ticketPurchaseUrl || EVENT.xPostUrl) && (
          <div className="space-y-2.5">
            {EVENT.ticketPurchaseUrl && (
              <Button
                variant="accent"
                size="lg"
                className="w-full rounded-md"
                asChild
              >
                <a
                  href={EVENT.ticketPurchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Ticket size={15} />
                  チケットを購入する
                </a>
              </Button>
            )}
            {EVENT.xPostUrl && (
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-md"
                asChild
              >
                <a
                  href={EVENT.xPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={15} />
                  公式X 告知を見る
                </a>
              </Button>
            )}
          </div>
        )}

        {/* ─ 6. タイムテーブル ────────────────────────────────────── */}
        <div>
          <SectionHeading>タイムテーブル</SectionHeading>
          <div
            className="border-y bg-white px-1 py-5"
            style={{ borderColor: `${ACCENT}55` }}
          >
            {EVENT.timetable.map((entry, index) => (
              <TimelineRow
                key={`${entry.time}-${entry.act}`}
                entry={entry}
                isLast={index === EVENT.timetable.length - 1}
              />
            ))}
          </div>
        </div>

        {/* ─ 7. 支援金・リターン ─────────────────────────────────── */}
        <div>
          <SectionHeading>支援金・リターン</SectionHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            東雲かれん生誕祭2026の開催に向け、支援金のご協力を募集しています。
            <br />
            ご支援いただいた金額に応じて、以下のリターンをご用意しています。
          </p>
          <div className="space-y-3">
            {EVENT.supportPlans.map((plan) => (
              <SupportPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="mt-4">
            {EVENT.supportUrl ? (
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-md"
                asChild
              >
                <a
                  href={EVENT.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HandCoins size={15} />
                  支援金を申し込む
                </a>
              </Button>
            ) : (
              <div
                className="flex items-center justify-center gap-2 rounded-md border py-3.5 text-sm font-medium text-muted-foreground"
                style={{ borderColor: `${ACCENT}55`, backgroundColor: `${ACCENT}0a` }}
              >
                <HandCoins size={15} className="shrink-0" />
                支援金ページ準備中
              </div>
            )}
          </div>
        </div>

        {/* ─ 8. 注意事項 ──────────────────────────────────────────── */}
        <div
          className="border-y border-border bg-muted/40 px-1 py-4"
        >
          <p className="mb-2 text-sm font-bold text-foreground">注意事項</p>
          <ul className="space-y-1.5">
            {EVENT.ticketNotes.map((note) => (
              <li key={note} className="text-xs leading-relaxed text-muted-foreground">
                ※{note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
