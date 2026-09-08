import { useState } from 'react';
import { Heart } from 'lucide-react';
import { MEMBERS } from '@/data/members';
import { useMyData } from '@/contexts/MyDataContext';

// ── 推し歴（日数）計算 ────────────────────────────────────────

function calcOshiDays(registeredAt: string | null): number | null {
  if (!registeredAt) return null;
  // date input の YYYY-MM-DD は UTC として解釈されるため、ローカル日付として扱う
  const dateOnly = registeredAt.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const reg = dateOnly
    ? new Date(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3])
    : new Date(registeredAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  reg.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - reg.getTime()) / 86_400_000);
}

function getTodayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ── メインコンポーネント ───────────────────────────────────────

export default function OshiSection() {
  const ctx = useMyData();
  if (!ctx) return null;

  const { data, setOshi } = ctx;
  const [startedAt, setStartedAt] = useState(getTodayInputValue);
  const todayInputValue = getTodayInputValue();
  const currentOshi = MEMBERS.find((m) => m.id === data.oshi.memberId);
  const oshiDays = calcOshiDays(data.oshi.registeredAt);
  const isRegistered = currentOshi !== undefined;

  return (
    <section>
      {/* セクションラベル */}
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <Heart size={12} className="text-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          推し設定
        </h2>
      </div>

      {currentOshi ? (
        /* ── 登録済み: シンプルな情報表示 ── */
        <div>
          <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
            {/* 推し */}
            <Row
              label="推し"
              value={currentOshi.name}
              accentColor={currentOshi.colorHex}
            />
            <Divider />
            {/* メンバーカラー */}
            <Row
              label="メンバーカラー"
              value={currentOshi.colorName}
              accentColor={currentOshi.colorHex}
            />
            <Divider />
            {/* 推し歴 */}
            <Row
              label="推し歴"
              value={oshiDays !== null ? `${oshiDays}日` : '—'}
              accentColor={currentOshi.colorHex}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  '現在の推し設定を解除しますか？\n解除後は再度推しを設定できます。',
                )
              ) {
                setOshi(null);
                setStartedAt(todayInputValue);
              }
            }}
            className="mt-2.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 active:opacity-70"
          >
            現在の推しを解除
          </button>
        </div>
      ) : (
        /* ── 未登録: メンバー選択リスト ── */
        <div>
          <p className="mb-3 px-1 text-sm font-semibold text-gray-800">
            推しを選択してください
          </p>
          <label className="mb-3 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-[13px] font-medium text-gray-600">
              推し始めた日
            </span>
            <input
              type="date"
              value={startedAt}
              max={todayInputValue}
              onChange={(event) => setStartedAt(event.target.value)}
              className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-ring focus:ring-2 focus:ring-ring"
              aria-label="推し始めた日"
            />
          </label>
          <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
            {MEMBERS.map((member, i) => (
              <div key={member.id}>
                <button
                  type="button"
                  onClick={() => setOshi(member.id, startedAt || todayInputValue)}
                  className="flex w-full items-center gap-0 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  {/* カラーアクセントライン */}
                  <span
                    className="h-14 w-1 shrink-0 rounded-r-full"
                    style={{ backgroundColor: member.colorHex }}
                  />
                  {/* テキスト */}
                  <div className="flex-1 px-4 py-3">
                    <p className="text-[15px] font-semibold leading-snug text-gray-900">
                      {member.name}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-none text-gray-400">
                      {member.colorName}
                    </p>
                  </div>
                </button>
                {i < MEMBERS.length - 1 && (
                  <div className="ml-5 border-b border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── サブコンポーネント ────────────────────────────────────────

function Row({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string;
  accentColor: string;
}) {
  return (
    <div className="flex items-center gap-0">
      {/* カラーアクセントライン */}
      <span
        className="h-12 w-1 shrink-0 rounded-r-full"
        style={{ backgroundColor: accentColor }}
      />
      {/* ラベルと値 */}
      <div className="flex flex-1 items-center justify-between px-4 py-3">
        <span className="text-[13px] text-gray-500">{label}</span>
        <span className="text-[15px] font-semibold text-gray-900">
          {value}
        </span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="ml-5 border-b border-gray-100" />;
}
