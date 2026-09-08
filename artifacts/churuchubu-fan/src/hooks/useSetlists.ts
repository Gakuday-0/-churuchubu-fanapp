import { useCallback, useEffect, useState } from 'react';
import { getLives, getSetlists, type Live, type Setlist } from '@/services/googleSheets';
import { parseDate } from '@/utils/liveDate';

export interface SetlistWithLive extends Setlist {
  live?: Live;
}

function dateKey(value: string): string {
  const date = parseDate(value);
  if (!date) return value.trim();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function sortSetlists(items: SetlistWithLive[]): SetlistWithLive[] {
  return [...items].sort((a, b) => {
    const aTime = parseDate(a.date)?.getTime();
    const bTime = parseDate(b.date)?.getTime();

    if (aTime === undefined && bTime === undefined) return 0;
    if (aTime === undefined) return 1;
    if (bTime === undefined) return -1;
    return bTime - aTime;
  });
}

function connectLiveInfo(setlists: Setlist[], lives: Live[]): SetlistWithLive[] {
  return setlists.map((setlist) => ({
    ...setlist,
    live: lives.find((live) => dateKey(live.date) === dateKey(setlist.date)),
  }));
}

export interface UseSetlistsResult {
  setlists: SetlistWithLive[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useSetlists(): UseSetlistsResult {
  const [data, setData] = useState<SetlistWithLive[] | null | undefined>(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    setData(undefined);

    async function load() {
      const setlists = await getSetlists();
      if (isCancelled) return;

      if (setlists === null) {
        setData(null);
        return;
      }

      if (setlists.length === 0) {
        setData([]);
        return;
      }

      const lives = await getLives();
      if (isCancelled) return;
      setData(lives === null ? null : sortSetlists(connectLiveInfo(setlists, lives)));
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, [tick]);

  const retry = useCallback(() => setTick((value) => value + 1), []);

  return {
    setlists: data ?? [],
    isLoading: data === undefined,
    isError: data === null,
    retry,
  };
}