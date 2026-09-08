import { Calendar } from 'lucide-react';
import Card from '@/components/common/Card';
import { useMyData } from '@/contexts/MyDataContext';
import { thisMonthKey, toMonthKey } from '@/store/myData';
import { formatDate, formatVenue } from '@/utils/liveFormat';

export default function LiveRecordSection() {
  const ctx = useMyData();
  if (!ctx) return null;

  const { data } = ctx;
  const mk = thisMonthKey();

  const attendedList = Object.values(data.lives)
    .filter((r) => r.attended)
    .sort((a, b) => {
      // 日付降順
      const ta = toMonthKey(a.date) + a.date;
      const tb = toMonthKey(b.date) + b.date;
      return tb.localeCompare(ta);
    });

  const monthlyCount = attendedList.filter(
    (r) => toMonthKey(r.date) === mk,
  ).length;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Calendar size={14} className="text-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          ライブ記録
        </h2>
      </div>

      {/* カウント */}
      <Card className="mb-3 px-5 py-4">
        <div className="flex divide-x divide-border">
          <div className="flex-1 pr-5 text-center">
            <p className="text-[10px] text-gray-400">今月の参加回数</p>
            <p className="mt-1 text-3xl font-black text-foreground">
              {monthlyCount}
            </p>
            <p className="text-[10px] text-gray-400">回</p>
          </div>
          <div className="flex-1 pl-5 text-center">
            <p className="text-[10px] text-gray-400">累計参加回数</p>
            <p className="mt-1 text-3xl font-black text-gray-800">
              {attendedList.length}
            </p>
            <p className="text-[10px] text-gray-400">回</p>
          </div>
        </div>
      </Card>

      {/* 参加済みライブ一覧 */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-semibold text-gray-700">参加したライブ</p>
        </div>
        {attendedList.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <Calendar size={24} className="text-muted-foreground" />
            <p className="text-xs text-gray-400">
              ライブカードで参加チェックをすると<br />ここに記録されます
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {attendedList.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 px-4 py-3"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <span className="text-[9px] font-bold text-foreground">✓</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {rec.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(rec.date)}</span>
                    {rec.venue && formatVenue(rec.venue) && (
                      <>
                        <span>·</span>
                        <span className="truncate">{formatVenue(rec.venue)}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
