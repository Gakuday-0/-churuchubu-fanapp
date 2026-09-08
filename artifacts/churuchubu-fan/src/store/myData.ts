// ============================================================
// マイページデータ管理
//
// データはブラウザの localStorage へ保存します。
// スプレッドシートへは一切アクセスしません。
// ============================================================

export const MYDATA_KEY = 'churetube_mydata_v1';
export const CURRENT_VERSION = 1;

// ── 型定義 ───────────────────────────────────────────────────

/** ライブごとの参加・チェキ記録 */
export interface LiveRecord {
  attended: boolean;
  chekiCount: number;
  /** 表示用（検索・集計に使用） */
  date: string;
  title: string;
  venue: string;
}

/** マイページ全データ */
export interface MyData {
  version: number;
  /** 推し設定 */
  oshi: {
    memberId: string | null;
    registeredAt: string | null; // ISO 8601
  };
  /** ライブ参加記録 liveKey -> LiveRecord */
  lives: Record<string, LiveRecord>;
  /** メンバー別チェキ枚数（累計・手動入力） memberId -> count */
  chekiByMember: Record<string, number>;
  /** 月ごとのメンバー別チェキ枚数 monthKey -> memberId -> count */
  monthlyChekiByMember: Record<string, Record<string, number>>;
  /** 累計リセット後に新たに加算するための月別基準値 */
  chekiTotalResetBaselineByMonth: Record<string, Record<string, number>>;
}

// ── ユーティリティ ────────────────────────────────────────────

/** ライブデータの一意キーを生成します（date と title は CSV 原文） */
export function makeLiveKey(date: string, title: string): string {
  return `${date.trim()}||${title.trim()}`;
}

/** 空のデータ構造を返します */
export function makeEmptyData(): MyData {
  return {
    version: CURRENT_VERSION,
    oshi: { memberId: null, registeredAt: null },
    lives: {},
    chekiByMember: {},
    monthlyChekiByMember: {},
    chekiTotalResetBaselineByMonth: {},
  };
}

// ── localStorage 入出力 ───────────────────────────────────────

export function loadMyData(): MyData {
  try {
    const raw = localStorage.getItem(MYDATA_KEY);
    if (!raw) return makeEmptyData();
    const parsed: MyData = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION) return makeEmptyData();
    return normalizeMyData(parsed);
  } catch {
    return makeEmptyData();
  }
}

/** 旧バックアップにも対応しながら保存データを正規化します */
export function normalizeMyData(
  parsed: Partial<MyData> & { version?: number },
): MyData {
  const empty = makeEmptyData();
  return {
    ...empty,
    ...parsed,
    oshi: { ...empty.oshi, ...(parsed.oshi ?? {}) },
    lives: parsed.lives ?? {},
    chekiByMember: parsed.chekiByMember ?? {},
    monthlyChekiByMember: parsed.monthlyChekiByMember ?? {},
    chekiTotalResetBaselineByMonth:
      parsed.chekiTotalResetBaselineByMonth ?? {},
  };
}

export function saveMyData(data: MyData): void {
  try {
    localStorage.setItem(MYDATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[MyData] 保存失敗:', e);
  }
}

// ── 集計ヘルパー ──────────────────────────────────────────────

/** 「YYYY/MM」形式の月キーを返します */
export function toMonthKey(dateStr: string): string {
  const m = dateStr.match(/(\d{4})[\/\-年](\d{1,2})/);
  if (m) return `${m[1]}/${String(+m[2]).padStart(2, '0')}`;
  // M/D 形式（年なし） → 当年
  const m2 = dateStr.match(/^(\d{1,2})\/(\d{1,2})/);
  if (m2) return `${new Date().getFullYear()}/${String(+m2[1]).padStart(2, '0')}`;
  return '';
}

/** 今月の YYYY/MM キーを返します */
export function thisMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** 月キーを「YYYY年M月」表示形式に変換します */
export function formatMonthKey(key: string): string {
  const [y, m] = key.split('/');
  return `${y}年${+m}月`;
}

/** 参加済みライブから月別集計を返します（降順） */
export function getMonthlyStats(
  lives: Record<string, LiveRecord>,
  monthlyChekiByMember: Record<string, Record<string, number>> = {},
): Array<{ monthKey: string; count: number; cheki: number }> {
  const map: Record<string, { count: number; cheki: number }> = {};
  for (const rec of Object.values(lives)) {
    if (!rec.attended) continue;
    const mk = toMonthKey(rec.date);
    if (!mk) continue;
    if (!map[mk]) map[mk] = { count: 0, cheki: 0 };
    map[mk].count++;
    // チェキはメンバー別の累計管理へ移行したため、
    // ライブ記録から月別チェキ数は集計しません。
  }
  for (const [monthKey, memberCounts] of Object.entries(monthlyChekiByMember)) {
    if (!map[monthKey]) map[monthKey] = { count: 0, cheki: 0 };
    map[monthKey].cheki = Object.values(memberCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, v]) => ({ monthKey, ...v }));
}
