/**
 * liveDate — ライブ日付のパース・残日数・バッジ生成
 *
 * 対応フォーマット:
 *   YYYY/M/D   YYYY-M-D   YYYY年M月D日
 *   M/D        M月D日     (年なし → 当年)
 */

// ── パース ────────────────────────────────────────────────────

/**
 * CSV の日付文字列を Date オブジェクトに変換します。
 * 認識できない場合は null を返します。
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const s = dateStr.trim();

  // YYYY/M/D  YYYY-M-D  YYYY年M月D日
  let m = s.match(/^(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // M/D
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\D|$)/);
  if (m) {
    const now = new Date();
    return new Date(now.getFullYear(), +m[1] - 1, +m[2]);
  }

  // M月D日
  m = s.match(/^(\d{1,2})月(\d{1,2})日/);
  if (m) {
    const now = new Date();
    return new Date(now.getFullYear(), +m[1] - 1, +m[2]);
  }

  return null;
}

// ── 残日数 ────────────────────────────────────────────────────

/**
 * 今日の0時との差を日数で返します。
 *   0  → 今日
 *   1  → 明日
 *  -1  → 昨日（過去）
 */
export function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

/** 今日以降のライブか判定 */
export function isUpcomingDate(date: Date): boolean {
  return getDaysUntil(date) >= 0;
}

/** 今日が開始日・終了日を含む表示期間内か判定します。 */
export function isDateWithinRange(
  startDate: string,
  endDate: string,
  now = new Date(),
): boolean {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return false;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return today.getTime() >= start.getTime() && today.getTime() <= end.getTime();
}

// ── バッジ ────────────────────────────────────────────────────

export interface DayBadge {
  label: string;
  /** Tailwind クラス文字列 */
  className: string;
}

/**
 * 残日数からバッジ情報を生成します（upcoming のみ呼び出し）。
 *   0 → 本日開催（アクセント）
 *   1 → 明日開催（ニュートラル）
 *   N → あとN日（ニュートラル）
 */
export function getDayBadge(daysUntil: number): DayBadge {
  if (daysUntil === 0)
    return {
      label: '本日開催',
      className: 'border-2 border-accent bg-accent text-accent-foreground',
    };
  if (daysUntil === 1)
    return { label: '明日開催', className: 'bg-secondary text-secondary-foreground' };
  return { label: `あと${daysUntil}日`, className: 'bg-secondary text-secondary-foreground' };
}
