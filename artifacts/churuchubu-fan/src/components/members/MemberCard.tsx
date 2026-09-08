/**
 * MemberCard — メンバーページ用カード
 *
 * - カード全体タップ → メンバー詳細ページへ遷移
 * - X / TikTok アイコンタップ → 各 SNS へ遷移（伝播を止める）
 * - TikTok がないメンバーも同じカード高さを維持
 */

import { useNavigate } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import type { Member } from '@/data/members';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const navigate = useNavigate();
  const hasOfficialColor = Boolean(member.colorHex && member.colorName);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/members/${member.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/members/${member.id}`)}
      aria-label={`${member.name}のプロフィールを見る`}
        className="flex flex-row rounded-md border border-border bg-white overflow-hidden cursor-pointer select-none transition-colors duration-200 hover:bg-muted/30 active:opacity-90"
    >
      {/* ── 左縦カラーライン ─────────────────────────────── */}
      <div
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: member.colorHex ?? 'hsl(var(--border))' }}
      />

      {/* ── 右側コンテンツ ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

      {/* ── メインコンテンツ ──────────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-3 gap-2">
        {/* メンバー名・サポメンバッジ（椿木あのんのみ） */}
        <div className="flex flex-nowrap items-center gap-2">
          <p className="text-sm font-bold text-gray-900 leading-snug whitespace-nowrap">
            {member.name}
          </p>
          {member.isSupport && (
            <span className="shrink-0 text-[10px] font-bold tracking-wide text-purple-400 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5">
              サポメン
            </span>
          )}
          {member.isStrengthened && (
            <span className="shrink-0 text-[10px] font-bold tracking-wide text-accent bg-accent/10 border border-accent/25 rounded-full px-2.5 py-0.5">
              強化メンバー
            </span>
          )}
        </div>

        {/* メンバーカラーまたは所属 */}
        <div className="flex min-h-4 items-center gap-1.5">
          {hasOfficialColor ? (
            <>
              <span
                className="shrink-0 w-2.5 h-2.5 rounded-full ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: member.colorHex }}
              />
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                {member.colorName}
              </span>
            </>
          ) : member.affiliation ? (
            <span className="truncate text-[10px] text-muted-foreground font-medium">
              {member.affiliation}
            </span>
          ) : null}
        </div>
      </div>

      {/* ── SNS エリア（高さ統一） ────────────────────────── */}
      <div className="border-t border-gray-100 mx-0" />
      <div className="flex items-center gap-2 px-4 py-3 min-h-[46px]">
        {/* X ボタン */}
        {member.xUrl ? (
          <a
            href={member.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.shortName}のX`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-xs font-black hover:bg-gray-200 transition-colors"
          >
            𝕏
          </a>
        ) : (
          <span className="w-8 h-8 opacity-0 pointer-events-none" aria-hidden />
        )}

        {/* TikTok ボタン（あるメンバーのみ表示、ないメンバーは同サイズの透明プレースホルダー） */}
        {member.tiktokUrl ? (
          <a
            href={member.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.shortName}のTikTok`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Music2 size={13} />
          </a>
        ) : (
          <span className="w-8 h-8 opacity-0 pointer-events-none" aria-hidden />
        )}
      </div>
      </div>{/* 右側コンテンツ end */}
    </div>
  );
}
