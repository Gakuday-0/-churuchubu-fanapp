import { Camera, Minus, Plus } from 'lucide-react';
import Card from '@/components/common/Card';
import { MEMBERS } from '@/data/members';
import { useMyData } from '@/contexts/MyDataContext';
import { formatMonthKey, thisMonthKey } from '@/store/myData';

export default function ChekiSection() {
  const ctx = useMyData();
  if (!ctx) return null;

  const {
    data,
    updateChekiByMember,
    resetMonthlyCheki,
    resetTotalCheki,
  } = ctx;
  const mk = thisMonthKey();

  const currentMonthCheki = data.monthlyChekiByMember[mk] ?? {};
  const monthlyCheki = Object.values(currentMonthCheki).reduce(
    (sum, count) => sum + count,
    0,
  );
  const totalCheki = Object.values(data.chekiByMember).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Camera size={14} className="text-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          チェキ統計
        </h2>
      </div>

      {/* 合計カード */}
      <Card className="mb-3 px-5 py-4">
        <div className="flex divide-x divide-border">
          <div className="flex-1 pr-5 text-center">
            <p className="text-[10px] text-gray-400">今月のチェキ枚数</p>
            <p className="mt-1 text-3xl font-black text-foreground">
              {monthlyCheki}
            </p>
            <p className="text-[10px] text-gray-400">枚</p>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `${formatMonthKey(mk)}のチェキ枚数をすべて削除しますか？`,
                  )
                ) {
                  resetMonthlyCheki();
                }
              }}
              className="mt-2 text-[10px] text-gray-400 underline underline-offset-2 transition-colors hover:text-foreground"
            >
              月の枚数をリセット
            </button>
          </div>
          <div className="flex-1 pl-5 text-center">
            <p className="text-[10px] text-gray-400">累計チェキ枚数</p>
            <p className="mt-1 text-3xl font-black text-gray-800">
              {totalCheki}
            </p>
            <p className="text-[10px] text-gray-400">枚</p>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    '累計チェキ枚数をすべて削除しますか？\n今月の枚数はそのまま残ります。',
                  )
                ) {
                  resetTotalCheki();
                }
              }}
              className="mt-2 text-[10px] text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              累計をリセット
            </button>
          </div>
        </div>
      </Card>

      {/* メンバー別チェキ */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-semibold text-gray-700">
            メンバー別チェキ枚数
          </p>
          <p className="mt-0.5 text-[10px] text-gray-400">
            {formatMonthKey(mk)}の枚数を記録できます（累計は別管理）
          </p>
        </div>
        <ul className="divide-y divide-border">
          {MEMBERS.map((member) => {
            const count = currentMonthCheki[member.id] ?? 0;
            return (
              <li
                key={member.id}
                className="flex items-stretch gap-3 px-4 py-2.5"
              >
                <div
                  className="w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: member.colorHex }}
                >
                </div>
                <div className="flex min-w-0 flex-1 items-center">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {member.name}
                  </p>
                </div>
                {/* カウンター */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateChekiByMember(member.id, count - 1)
                    }
                    disabled={count === 0}
                    aria-label={`${member.name}のチェキを減らす`}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:border-gray-200 disabled:text-gray-300 active:opacity-70"
                  >
                    <Minus size={13} strokeWidth={2.25} />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums text-gray-800">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateChekiByMember(member.id, count + 1)
                    }
                    aria-label={`${member.name}のチェキを増やす`}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
                  >
                    <Plus size={13} strokeWidth={2.25} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
