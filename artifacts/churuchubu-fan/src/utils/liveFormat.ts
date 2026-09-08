/**
 * liveFormat — ライブ情報の表示用フォーマッター
 *
 * スプレッドシート（CSV）のデータは変更せず、
 * 表示時のみここで整形します。
 *
 * ─────────────────────────────────────────────────
 * formatDate   : 日付を「M月D日」形式へ統一
 * formatPrice  : 料金を「¥X,XXX」形式＋自動改行
 * formatPriceRows: 料金をラベル・値の行へ分解
 * formatSchedule: 出演時間を部ごとのスケジュールへ分解
 * stripGroupName: イベント名からグループ名を削除
 * ─────────────────────────────────────────────────
 */

// ── 内部ユーティリティ ────────────────────────────────────────

/** 数値に3桁カンマを付ける */
function addCommas(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ── 日付フォーマット ──────────────────────────────────────────

/**
 * 様々な日付文字列を「M月D日」に統一します。
 *
 * 対応入力例: 7/31  07/31  7月31日  2025/7/31  2025-07-31  2025年7月31日
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const s = dateStr.trim();

  // YYYY/M/D  YYYY-M-D  YYYY年M月D日
  let m = s.match(/^(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})/);
  if (m) return `${+m[2]}月${+m[3]}日`;

  // M/D  MM/DD  （年なし）
  m = s.match(/^0?(\d{1,2})\/0?(\d{1,2})/);
  if (m) return `${+m[1]}月${+m[2]}日`;

  // M月D日（すでに正しい形式）
  m = s.match(/^(\d{1,2})月(\d{1,2})日/);
  if (m) return `${+m[1]}月${+m[2]}日`;

  return s; // 認識できない場合はそのまま返す
}

// ── 会場名フォーマット ──────────────────────────────────────────

/**
 * 会場名を表示用に整形します。
 *
 * スプレッドシート上の「sound space DIVA」「sound space DEEP」は、
 * 表示時のみ「DIVA」「DEEP」に短縮します。
 */
export function formatVenue(venue: string): string {
  if (!venue) return '';

  const trimmed = venue.trim();
  const soundSpaceVenue = trimmed.match(/^sound\s+space\s+(DIVA|DEEP)$/i);
  return soundSpaceVenue ? soundSpaceVenue[1].toUpperCase() : trimmed;
}

// ── 料金フォーマット ──────────────────────────────────────────

/**
 * 料金文字列を整形します。
 *
 * - ¥/￥/円 → ¥ に統一
 * - 数値に3桁カンマを付け ¥X,XXX 形式に
 * - 複数料金種別の場合は自動で改行
 * - セル内の既存改行は保持
 * - +/- 付きの追加料金も保持
 *
 * 入力例: "優先 2500 一般 1000 当日+1000 各+D代600"
 * 出力例:
 *   優先 ¥2,500
 *   一般 ¥1,000
 *   当日+¥1,000
 *   各+D代 ¥600
 */
export function formatPrice(raw: string): string {
  if (!raw.trim()) return '';

  // 既存の改行で分割し、各行を処理してから結合
  const processedLines = raw
    .split('\n')
    .map((line) => processOnePriceLine(line.trim()))
    .filter(Boolean);

  // 単一行かつ長い場合は追加の改行を試みる
  if (processedLines.length === 1) {
    return autoBreakPriceLine(processedLines[0]);
  }

  return processedLines.map(autoBreakPriceLine).join('\n');
}

export interface PriceRow {
  label: string;
  value: string;
}

/**
 * 料金を表示用のラベル・値へ分解します。
 *
 * スプレッドシートの値は変更せず、表示時だけ
 * 「優先」「一般」「当日」などを縦に揃えます。
 */
export function formatPriceRows(raw: string): PriceRow[] {
  if (!raw.trim()) return [];

  const source = raw.replace(/\r\n?/g, '\n');
  const rows: PriceRow[] = [];
  const knownLabel =
    '前売り?当日共|前方優先(?:エリア)?|後方(?:エリア)?|前方(?:エリア)?|優先(?:エリア)?|一般(?:エリア)?|当日券?(?:\\s*[+＋]?\\s*各(?:エリア)?)?|前売り?|指定|VIP|スタンディング|着席';
  const pricePattern = new RegExp(
    `(${knownLabel})\\s*([+＋]?)\\s*(?:[¥￥]\\s*)?(\\d[\\d,]*|無料)(?:円)?`,
    'gi',
  );
  const bracketPricePattern =
    /[【［\[]\s*([^】］\]]+?)\s*[】］\]]\s*(?:[¥￥]\s*)?(\d[\d,]*|無料)(?:円)?/gi;
  const freeAdmissionPattern = /(観覧)\s*(無料)/gi;

  /**
   * 料金ラベルとして認識できない文字列も、料金セルに書かれている
   * 補足情報（例: Tシャツ割引券付き）として表示対象に残します。
   */
  const addRemainder = (value: string) => {
    const remainder = value
      .replace(/D代\s*(?:[¥￥]\s*)?[\d,]*/gi, '')
      .replace(/[+＋]?\s*D代別/gi, '')
      .trim();

    // 「各部」のような料金ラベルだけの前置きは行にしない。
    if (!remainder || !/[\d¥￥円]|無料/.test(remainder)) return;
    rows.push({ label: '', value: processOnePriceLine(remainder) });
  };

  for (const line of source.split('\n')) {
    if (!line.trim()) continue;

    const matches = [
      ...Array.from(line.matchAll(bracketPricePattern)).map((match) => ({
        index: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        label: match[1].trim(),
        sign: '',
        amount: match[2],
      })),
      ...Array.from(line.matchAll(pricePattern)).map((match) => ({
        index: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        label: match[1].replace(/\s+/g, ''),
        sign: match[2] === '+' || match[2] === '＋' ? '+' : '',
        amount: match[3],
      })),
      ...Array.from(line.matchAll(freeAdmissionPattern)).map((match) => ({
        index: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        label: match[1],
        sign: '',
        amount: match[2],
      })),
    ].sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      addRemainder(line);
      continue;
    }

    let cursor = 0;
    for (const match of matches) {
      addRemainder(line.slice(cursor, match.index));

      const amount = match.amount.toLowerCase() === '無料'
        ? '無料'
        : `¥${addCommas(Number(match.amount.replace(/,/g, '')))}`;
      rows.push({
        label: match.label,
        value: `${match.sign}${amount}`,
      });
      cursor = match.end;
    }
    addRemainder(line.slice(cursor));
  }

  if (rows.length === 0) return [];

  const drinkFee = source.match(/D代\s*(?:[¥￥]\s*)?(\d[\d,]*)?/i);
  if (drinkFee) {
    const drinkFeeValue = drinkFee[1]
      ? `¥${addCommas(Number(drinkFee[1].replace(/,/g, '')))}`
      : '別';
    const formattedFee = drinkFee[1]
      ? `各D代 ${drinkFeeValue}`
      : '各D代別';
    const generalRow = rows.find((row) => row.label.startsWith('一般'));

    if (generalRow) {
      generalRow.value = `${generalRow.value}（${formattedFee}）`;
    } else {
      rows.push({ label: '各D代', value: drinkFeeValue });
    }
  }

  return rows;
}

export interface ScheduleLine {
  label: string;
  value: string;
}

export interface ScheduleSection {
  part?: string;
  lines: ScheduleLine[];
}

const PART_PATTERN = /(第?\s*[1-9]\s*部)/g;
const SCHEDULE_LABEL_PATTERN =
  /^(?:[🎤♪♫]\s*)?(出演|開場|並行物販|終演後物販|前物販|後物販)\s*[:：]?\s*/;
const MERCHANDISE_LABELS = new Set(['並行物販', '終演後物販', '前物販', '後物販']);

function normalizePart(part: string): string {
  return part.replace(/\s/g, '').replace(/^第/, '');
}

function normalizeScheduleValue(value: string): string {
  return value
    .replace(/^[🎤♪♫]\s*/, '')
    .replace(/[～]/g, '〜')
    .replace(/\s+/g, ' ')
    .replace(/^[：:]\s*/, '')
    .trim();
}

function getScheduleLabel(value: string, fallback: string): {
  label: string;
  value: string;
} {
  const bracketLabel = value.match(/^【([^】]+)】\s*/);
  if (bracketLabel) {
    return {
      label: normalizeScheduleLabel(bracketLabel[1]),
      value: value.slice(bracketLabel[0].length),
    };
  }

  const labelMatch = value.match(SCHEDULE_LABEL_PATTERN);
  if (!labelMatch) {
    return { label: fallback, value };
  }

  return {
    label: normalizeScheduleLabel(labelMatch[1]),
    value: value.slice(labelMatch[0].length),
  };
}

function normalizeScheduleLabel(label: string): string {
  return label.trim();
}

function addScheduleLine(
  sections: ScheduleSection[],
  part: string | undefined,
  label: string,
  value: string,
) {
  const normalizedValue = normalizeScheduleValue(value);
  if (!normalizedValue) {
    if (label === '終演後物販') {
      appendScheduleLine(sections, part, '物販', label);
    }
    return;
  }

  // 「出演 19:10〜19:35終演後物販」のように、
  // 終演後物販が出演時間の末尾に連結されている場合は表示上分離する。
  const afterShowMatch = normalizedValue.match(/^(.+?)\s*(終演後物販)(.*)$/);
  if (afterShowMatch && label === '出演') {
    addScheduleLine(sections, part, label, afterShowMatch[1]);
    appendScheduleLine(
      sections,
      part,
      '物販',
      `${afterShowMatch[2]}${afterShowMatch[3].trim() ? ` ${afterShowMatch[3].trim()}` : ''}`,
    );
    return;
  }

  if (MERCHANDISE_LABELS.has(label)) {
    appendScheduleLine(sections, part, '物販', `${label} ${normalizedValue}`);
    return;
  }

  appendScheduleLine(sections, part, label, normalizedValue);
}

function appendScheduleLine(
  sections: ScheduleSection[],
  part: string | undefined,
  label: string,
  value: string,
) {
  let section = sections.find((candidate) => candidate.part === part);
  if (!section) {
    section = { part, lines: [] };
    sections.push(section);
  }
  section.lines.push({ label, value });
}

function parseScheduleText(
  raw: string,
  defaultLabel: string,
  sections: ScheduleSection[],
) {
  let currentPart: string | undefined;
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // 「1部のみ」「2部だけ」のように、部名が出演時間の値そのもの
    // になっている記載は、部見出しとして分解せず元の値を保持する。
    const valueOnlyLine = line.replace(/^[🎤♪♫]\s*/, '');
    const parsedValueOnlyLine = getScheduleLabel(valueOnlyLine, defaultLabel);
    if (/^第?\s*[1-9]\s*部\s*(?:のみ|だけ)$/.test(parsedValueOnlyLine.value)) {
      addScheduleLine(
        sections,
        undefined,
        parsedValueOnlyLine.label,
        parsedValueOnlyLine.value,
      );
      currentPart = undefined;
      continue;
    }

    const matches = [...line.matchAll(PART_PATTERN)];
    if (matches.length === 0) {
      const parsed = getScheduleLabel(line, defaultLabel);
      addScheduleLine(sections, currentPart, parsed.label, parsed.value);
      continue;
    }

    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      const matchStart = match.index ?? 0;
      const contentStart = matchStart + match[0].length;
      const nextStart = matches[index + 1]?.index ?? line.length;
      const prefix = line.slice(index === 0 ? 0 : matchStart, contentStart);
      const content = line.slice(contentStart, nextStart);
      const part = normalizePart(match[1]);
      const parsedPrefix = getScheduleLabel(prefix.replace(match[0], ''), defaultLabel);
      const parsedContent = getScheduleLabel(content, parsedPrefix.label);

      currentPart = part;
      addScheduleLine(
        sections,
        part,
        parsedContent.label,
        parsedContent.value,
      );
    }
  }
}

/**
 * 出演時間・開場時間を、部ごとの表示用データへ分解します。
 */
export function formatSchedule(
  startTime: string,
  openTime: string,
): ScheduleSection[] {
  const sections: ScheduleSection[] = [];
  if (openTime.trim()) parseScheduleText(openTime, '開場', sections);
  if (startTime.trim()) parseScheduleText(startTime, '出演', sections);
  return sections.filter((section) => section.lines.length > 0);
}

/** 1行分の料金文字列を数値フォーマットする */
function processOnePriceLine(line: string): string {
  if (!line) return '';

  // 全角¥ → 半角¥
  let s = line.replace(/[￥]/g, '¥');

  // ¥NUM → ¥X,XXX（スペース可）
  s = s.replace(/¥\s*(\d[\d,]*)/g, (_, n) =>
    `¥${addCommas(parseInt(n.replace(/,/g, ''), 10))}`,
  );

  // NUM円 → ¥X,XXX
  s = s.replace(/(\d[\d,]*)円/g, (_, n) =>
    `¥${addCommas(parseInt(n.replace(/,/g, ''), 10))}`,
  );

  // 残った単独の数値（¥/数字/カンマが前置されていない）を ¥X,XXX に変換
  // lookbehind で ¥・数字・カンマの直後は対象外にし二重変換を防ぐ
  s = s.replace(/(?<![¥\d,])(\d[\d,]*)(?![\d,])/g, (match, n) => {
    const num = parseInt(n.replace(/,/g, ''), 10);
    // 100未満はコード・番号の可能性があるためスキップ
    if (isNaN(num) || num < 100) return match;
    return `¥${addCommas(num)}`;
  });

  return s;
}

/**
 * 料金ラベル（優先/一般/当日 など）の前で改行を挿入する。
 * 「¥X,XXX ラベル」のパターンを検出して分割する。
 */
function autoBreakPriceLine(line: string): string {
  const BREAK_BEFORE = ['優先', '一般', '当日券?', '前売', '指定', 'VIP', 'スタンディング', '着席'];
  let s = line;
  for (const label of BREAK_BEFORE) {
    s = s.replace(
      new RegExp(`(¥[\\d,]+)\\s+(${label})`, 'g'),
      `$1\n$2`,
    );
  }
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

// ── イベント名フォーマット ────────────────────────────────────

/**
 * イベント名からグループ名を除去します（表示時のみ）。
 *
 * 除去対象（長いものを優先してマッチ）:
 *   ちゅ〜るちゅーぶ  /  tulle alive  /  tulle
 *
 * スプレッドシートのデータは変更しません。
 */
export function stripGroupName(title: string): string {
  if (!title) return '';
  let s = title.trim();
  const original = s;

  // 順序重要: "tulle alive" を "tulle" より先に処理
  const GROUPS = ['tulle alive', 'ちゅ〜るちゅーぶ', 'tulle'];

  for (const g of GROUPS) {
    const esc = g.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');

    // 先頭のグループ名 + 後続の区切り文字を削除
    s = s.replace(
      new RegExp(`^${esc}\\s*[「『【（(\\s～〜\\-]*`, 'i'),
      '',
    );

    // 末尾のグループ名 + 前置の区切り文字を削除
    s = s.replace(
      new RegExp(`[」』】）)\\s～〜\\-]*${esc}\\s*$`, 'i'),
      '',
    );
  }

  // 残った先頭・末尾の括弧・記号を整理
  s = s
    .replace(/^[\s「『【（(～〜\-・]+/, '')
    .replace(/[\s」』】）)～〜\-・]+$/, '')
    .trim();

  // 空になった場合は元のタイトルを返す
  return s || original;
}
