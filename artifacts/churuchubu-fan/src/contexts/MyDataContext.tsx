// ============================================================
// MyDataContext — マイページデータのグローバル管理
//
// - アプリ全体を MyDataProvider で囲むことで、
//   LiveCard など深いコンポーネントからでもデータにアクセスできます。
// - データは localStorage へ自動保存されます。
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type MyData,
  loadMyData,
  makeEmptyData,
  makeLiveKey,
  normalizeMyData,
  saveMyData,
  thisMonthKey,
} from '@/store/myData';

// ── コンテキスト型 ────────────────────────────────────────────

interface MyDataContextValue {
  data: MyData;
  /** 推しを設定する（推し始めた日を起点に推し歴を計算） */
  setOshi: (memberId: string | null, startedAt?: string) => void;
  /** ライブ参加チェックを切り替える */
  toggleAttended: (date: string, title: string, venue: string) => void;
  /** ライブのチェキ枚数を更新する */
  updateCheki: (date: string, title: string, count: number) => void;
  /** 今月のメンバー別チェキ枚数と累計を更新する */
  updateChekiByMember: (memberId: string, count: number) => void;
  /** 今月のメンバー別チェキ枚数をリセットする */
  resetMonthlyCheki: () => void;
  /** 累計チェキ枚数をリセットする */
  resetTotalCheki: () => void;
  /** データを JSON でダウンロードする */
  backupData: () => void;
  /** JSON 文字列からデータを復元する。成功時 true */
  restoreData: (json: string) => boolean;
  /** すべてのデータを初期化する */
  resetData: () => void;
}

// ── コンテキスト ──────────────────────────────────────────────

const MyDataContext = createContext<MyDataContextValue | null>(null);

// ── プロバイダー ──────────────────────────────────────────────

export function MyDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MyData>(() => loadMyData());

  // data が変わるたびに localStorage へ保存（初回マウント時はスキップ）
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    saveMyData(data);
  }, [data]);

  // ── 推し設定 ─────────────────────────────────────────────

  const setOshi = useCallback((memberId: string | null, startedAt?: string) => {
    setData((prev) => ({
      ...prev,
      oshi: {
        memberId,
        registeredAt:
          memberId === null
            ? null
            : prev.oshi.memberId === memberId
            ? prev.oshi.registeredAt // 同じ推し → 登録日を保持
            : startedAt ?? new Date().toISOString(), // 推し始めた日を保存
      },
    }));
  }, []);

  // ── ライブ参加 ────────────────────────────────────────────

  const toggleAttended = useCallback(
    (date: string, title: string, venue: string) => {
      const key = makeLiveKey(date, title);
      setData((prev) => {
        const existing = prev.lives[key];
        const wasAttended = existing?.attended ?? false;
        return {
          ...prev,
          lives: {
            ...prev.lives,
            [key]: {
              date,
              title,
              venue,
              attended: !wasAttended,
              chekiCount: existing?.chekiCount ?? 0,
            },
          },
        };
      });
    },
    [],
  );

  // ── チェキ枚数（ライブ別） ─────────────────────────────────

  const updateCheki = useCallback(
    (date: string, title: string, count: number) => {
      const key = makeLiveKey(date, title);
      setData((prev) => {
        const existing = prev.lives[key];
        if (!existing) return prev;
        return {
          ...prev,
          lives: {
            ...prev.lives,
            [key]: { ...existing, chekiCount: Math.max(0, count) },
          },
        };
      });
    },
    [],
  );

  // ── チェキ枚数（メンバー別・累計） ──────────────────────────

  const updateChekiByMember = useCallback(
    (memberId: string, count: number) => {
      const monthKey = thisMonthKey();
      const nextCount = Math.max(0, count);
      setData((prev) => {
        const currentMonth = prev.monthlyChekiByMember[monthKey] ?? {};
        const previousMonthCount = currentMonth[memberId] ?? 0;
        const previousTotal = prev.chekiByMember[memberId] ?? 0;
        const resetBaseline =
          prev.chekiTotalResetBaselineByMonth[monthKey]?.[memberId] ?? 0;
        const previousContribution = Math.max(
          0,
          previousMonthCount - resetBaseline,
        );
        const nextContribution = Math.max(0, nextCount - resetBaseline);

        return {
          ...prev,
          chekiByMember: {
            ...prev.chekiByMember,
            [memberId]: Math.max(
              0,
              previousTotal - previousContribution + nextContribution,
            ),
          },
          monthlyChekiByMember: {
            ...prev.monthlyChekiByMember,
            [monthKey]: {
              ...currentMonth,
              [memberId]: nextCount,
            },
          },
        };
      });
    },
    [],
  );

  const resetMonthlyCheki = useCallback(() => {
    const monthKey = thisMonthKey();
    setData((prev) => {
      const nextMonthly = { ...prev.monthlyChekiByMember };
      delete nextMonthly[monthKey];

      // 累計を先にリセットしていた場合は、今月も新規集計に戻します。
      const nextBaselines = { ...prev.chekiTotalResetBaselineByMonth };
      if (nextBaselines[monthKey]) {
        nextBaselines[monthKey] = {};
      }

      return {
        ...prev,
        monthlyChekiByMember: nextMonthly,
        chekiTotalResetBaselineByMonth: nextBaselines,
      };
    });
  }, []);

  const resetTotalCheki = useCallback(() => {
    const monthKey = thisMonthKey();
    setData((prev) => ({
      ...prev,
      chekiByMember: {},
      chekiTotalResetBaselineByMonth: {
        ...prev.chekiTotalResetBaselineByMonth,
        [monthKey]: {
          ...(prev.monthlyChekiByMember[monthKey] ?? {}),
        },
      },
    }));
  }, []);

  // ── バックアップ / 復元 / リセット ───────────────────────────

  const backupData = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `churetube_backup_${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const restoreData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as MyData;
      if (
        typeof parsed !== 'object' ||
        !parsed.version ||
        !parsed.oshi ||
        !parsed.lives
      )
        return false;
      setData(normalizeMyData(parsed));
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    setData(makeEmptyData());
  }, []);

  return (
    <MyDataContext.Provider
      value={{
        data,
        setOshi,
        toggleAttended,
        updateCheki,
        updateChekiByMember,
        resetMonthlyCheki,
        resetTotalCheki,
        backupData,
        restoreData,
        resetData,
      }}
    >
      {children}
    </MyDataContext.Provider>
  );
}

// ── フック ────────────────────────────────────────────────────

/** MyDataContext を使用します。MyDataProvider の外では null を返します。 */
export function useMyData(): MyDataContextValue | null {
  return useContext(MyDataContext);
}
