/**
 * useLives — ライブデータ取得・分類の共有フック
 *
 * - getLives() で CSV を 1 回だけ fetch
 * - upcoming: 今日以降（近い順）
 * - past:     終了済み（直近順・降順）
 * - isLoading / isError / retry を提供
 *
 * ホームページ・ライブページ両方でこのフックを使うことで
 * CSV 更新だけで両画面が自動反映されます。
 */

import { useCallback, useEffect, useState } from 'react';
import { getLives, type Live } from '@/services/googleSheets';
import { getDaysUntil, parseDate } from '@/utils/liveDate';

export interface UseLivesResult {
  /** 今日以降のライブ（近い順） */
  upcoming: Live[];
  /** 終了済みライブ（直近順・降順） */
  past: Live[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useLives(): UseLivesResult {
  // undefined = ロード中 / null = エラー / Live[] = 取得済み
  const [data, setData] = useState<Live[] | null | undefined>(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setData(undefined);
    getLives().then(setData);
  }, [tick]);

  const retry = useCallback(() => setTick((n) => n + 1), []);

  const isLoading = data === undefined;
  const isError = data === null;

  // ── 分類 ──────────────────────────────────────────────────
  const upcoming: Live[] = [];
  const past: Live[] = [];

  for (const live of data ?? []) {
    const d = parseDate(live.date);
    // 日付が解析できない行は upcoming 扱い（表示側で柔軟対応）
    if (!d || getDaysUntil(d) >= 0) {
      upcoming.push(live);
    } else {
      past.push(live);
    }
  }

  // 近い順（昇順）
  upcoming.sort((a, b) => {
    const ta = parseDate(a.date)?.getTime() ?? 0;
    const tb = parseDate(b.date)?.getTime() ?? 0;
    return ta - tb;
  });

  // 直近順（降順）
  past.sort((a, b) => {
    const ta = parseDate(a.date)?.getTime() ?? 0;
    const tb = parseDate(b.date)?.getTime() ?? 0;
    return tb - ta;
  });

  return { upcoming, past, isLoading, isError, retry };
}
