import { useCallback, useEffect, useState } from 'react';
import { getSpecialPages, type SpecialPage } from '@/services/googleSheets';
import { isDateWithinRange } from '@/utils/liveDate';

function getNextMidnightDelay(): number {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return Math.max(1_000, nextMidnight.getTime() - now.getTime() + 250);
}

export interface UseSpecialPagesResult {
  specialPages: SpecialPage[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

/**
 * 特設ページを取得し、現在の表示期間内のものだけ返します。
 * 日付が変わった際は再フェッチせず、表示条件だけ自動で再評価します。
 */
export function useSpecialPages(): UseSpecialPagesResult {
  const [data, setData] = useState<SpecialPage[] | null | undefined>(undefined);
  const [tick, setTick] = useState(0);
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setToday(new Date()),
      getNextMidnightDelay(),
    );
    return () => window.clearTimeout(timeout);
  }, [today]);

  useEffect(() => {
    let isCancelled = false;
    setData(undefined);

    getSpecialPages().then((result) => {
      if (!isCancelled) setData(result);
    });

    return () => {
      isCancelled = true;
    };
  }, [tick]);

  const retry = useCallback(() => setTick((value) => value + 1), []);
  const specialPages = (data ?? []).filter(
    (page) =>
      isDateWithinRange(page.startDate, page.endDate, today),
  );

  return {
    specialPages,
    isLoading: data === undefined,
    isError: data === null,
    retry,
  };
}