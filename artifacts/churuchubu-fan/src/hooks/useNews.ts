import { useCallback, useEffect, useState } from 'react';
import { getNews, type News } from '@/services/googleSheets';
import { parseDate } from '@/utils/liveDate';

function sortNews(items: News[]): News[] {
  return [...items].sort((a, b) => {
    const aTime = parseDate(a.date)?.getTime();
    const bTime = parseDate(b.date)?.getTime();

    if (aTime === undefined && bTime === undefined) return 0;
    if (aTime === undefined) return 1;
    if (bTime === undefined) return -1;
    return bTime - aTime;
  });
}

export interface UseNewsResult {
  news: News[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useNews(): UseNewsResult {
  const [data, setData] = useState<News[] | null | undefined>(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setData(undefined);
    getNews().then((result) => setData(result === null ? null : sortNews(result)));
  }, [tick]);

  const retry = useCallback(() => setTick((value) => value + 1), []);

  return {
    news: data ?? [],
    isLoading: data === undefined,
    isError: data === null,
    retry,
  };
}