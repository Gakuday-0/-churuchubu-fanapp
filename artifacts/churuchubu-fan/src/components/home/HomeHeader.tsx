import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MEMBERS, STRENGTHENED_MEMBERS } from '@/data/members';
import { APPROVED_FAN_SITE_LABEL } from '@/data/about';
import SiteLogo from '@/components/common/SiteLogo';

interface HomeHeaderProps {
  onMenuOpen: () => void;
}

export default function HomeHeader({ onMenuOpen }: HomeHeaderProps) {
  const homeMembers = [...MEMBERS, ...STRENGTHENED_MEMBERS];

  return (
    <header className="w-full bg-white border-b border-border">
      {/* ── ロゴ行 ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center px-4 py-3">
        <div className="flex flex-col items-center">
          <SiteLogo />
          <span className="mt-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.08em] text-muted-foreground">
            <span aria-hidden="true">✔ </span>
            {APPROVED_FAN_SITE_LABEL}
          </span>
        </div>

        {/* ハンバーガーボタン */}
          <button
          type="button"
          onClick={onMenuOpen}
          aria-label="メニューを開く"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── ワンマンライブ告知 ──────────────────────────────── */}
      <div className="border-t border-border px-4 py-2.5 text-center">
        <p className="text-[11px] font-bold tracking-[0.04em] text-foreground">
          1.5th Anniversary one man LIVE
        </p>
        <p className="mt-0.5 text-xs font-semibold text-foreground">
          伏見ライオンシアター
        </p>
        <p className="mt-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          2026.10.20(Tue)
        </p>
      </div>

      {/* ── メンバー列 ─────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-1 px-4 pb-3">
        {homeMembers.map((member) => (
          <Link
            key={member.id}
            to={`/members/${member.id}`}
            className="flex min-w-0 flex-col items-center rounded-md px-1 py-1.5 transition-all active:bg-secondary active:opacity-70"
            aria-label={`${member.name}のプロフィール`}
          >
            {/* 名前 */}
            <p className="min-h-[2rem] flex items-center text-[10px] font-semibold text-gray-800 text-center leading-tight">
              {member.name}
            </p>

            {/* メンバーカラーライン */}
            <span
              aria-label={`担当カラー：${member.colorName}`}
              className="mt-1 h-1 w-full rounded-full"
              style={{ backgroundColor: member.colorHex }}
            />

          </Link>
        ))}
      </div>
    </header>
  );
}
