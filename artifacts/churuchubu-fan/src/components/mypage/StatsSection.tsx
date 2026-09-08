import { BarChart2 } from 'lucide-react';
import Card from '@/components/common/Card';
import { useMyData } from '@/contexts/MyDataContext';
import { formatMonthKey, getMonthlyStats } from '@/store/myData';

export default function StatsSection() {
  const ctx = useMyData();
  if (!ctx) return null;

  const { data } = ctx;
  const stats = getMonthlyStats(data.lives, data.monthlyChekiByMember);

  const maxCount = Math.max(...stats.map((s) => s.count), 1);
  const maxCheki = Math.max(...stats.map((s) => s.cheki), 1);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <BarChart2 size={14} className="text-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          統計
        </h2>
      </div>

      <Card className="overflow-hidden">
        {stats.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <BarChart2 size={24} className="text-muted-foreground" />
            <p className="text-xs text-gray-400">
              ライブに参加チェックすると<br />月ごとの統計が表示されます
            </p>
          </div>
        ) : (
          <div>
            {/* ライブ参加回数 */}
            <div className="border-b border-border px-4 pb-4 pt-4">
              <p className="mb-3 text-xs font-semibold text-gray-700">
                月ごとのライブ参加回数
              </p>
              <div className="space-y-2.5">
                {stats.map((s) => (
                  <div key={s.monthKey} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-[11px] text-gray-500 tabular-nums">
                      {formatMonthKey(s.monthKey).replace('年', '/').replace('月', '')}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-5 rounded-full bg-foreground transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              8,
                              (s.count / maxCount) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-bold tabular-nums text-gray-700">
                        {s.count}回
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* チェキ枚数 */}
            <div className="px-4 pb-4 pt-4">
              <p className="mb-3 text-xs font-semibold text-gray-700">
                月ごとのチェキ枚数
              </p>
              <div className="space-y-2.5">
                {stats.map((s) => (
                  <div key={s.monthKey} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-[11px] text-gray-500 tabular-nums">
                      {formatMonthKey(s.monthKey).replace('年', '/').replace('月', '')}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-5 rounded-full bg-accent transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              s.cheki === 0 ? 0 : 8,
                              (s.cheki / maxCheki) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-bold tabular-nums text-gray-700">
                        {s.cheki}枚
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
