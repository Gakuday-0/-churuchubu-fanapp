/**
 * Google Sheets CSV サービス
 *
 * Google Sheets API は使用せず、公開 CSV URL を直接 fetch します。
 * 設定は src/data/config.ts の SHEETS_CONFIG.csv のみを参照します。
 *
 * ─────────────────────────────────────────────────────────────
 * 戻り値の規約（全 get* 関数共通）
 *   T[]   → 正常取得（空配列 = データが存在しない）
 *   null  → 取得失敗（ネットワークエラー・パースエラー等）
 *   ※ URL 未設定は「空」扱い（[]）で ErrorState にはなりません
 * ─────────────────────────────────────────────────────────────
 *
 * 将来シートを追加する場合:
 *   1. SHEETS_CONFIG.csv に url・skipRows を追加
 *   2. 型・列定数・get 関数をここに追加
 *   3. 呼び出し元で ErrorState / EmptyState / データ表示を分岐
 */

import { SHEETS_CONFIG } from '@/data/config';
import { normalizeExternalUrl } from '@/utils/externalUrl';
import { normalizeTicketUrl } from '@/utils/ticket';

// ── 型定義 ───────────────────────────────────────────────────

/**
 * ライブ情報 1 件
 * 列マッピング: A=日付 B=イベント名 C=会場 D=料金
 *              E=出演時間 F=チケットURL G=お目当て特典 H=開場時間 I=XポストURL
 */
export interface Live {
  date: string;       // A: 日付
  title: string;      // B: イベント名
  venue: string;      // C: 会場
  price: string;      // D: 料金
  startTime: string;  // E: 出演時間
  ticketUrl?: string; // F: チケットURL（空なら undefined）
  benefit: string;    // G: お目当て特典
  openTime: string;   // H: 開場時間
  xPostUrl?: string;  // I: XポストURL（空なら undefined）
}

/** お知らせ 1 件 */
export interface News {
  id: string;
  date: string;
  title: string;
  content: string;
  link?: string;
}

/** 過去ライブのセットリスト 1 件 */
export interface Setlist {
  date: string;       // A: 日付
  setlist: string;    // B: セットリスト
  note: string;       // C: 備考
}

/** ホームと専用ページで使用する特設イベント 1 件 */
export interface SpecialPage {
  id: string;                    // シート内の行番号から生成する内部ID
  title: string;                 // A: タイトル
  eventDate: string;             // B: 開催日（イベント詳細・残日数用）
  venue: string;                 // C: 会場
  openTime: string;              // D: 開場時間
  startTime: string;             // E: 開演時間
  performanceTime: string;       // F: 出演時間
  price: string;                 // G: 料金
  ticketUrl?: string;            // H: チケットURL
  xPostUrl?: string;             // I: XポストURL
  supportUrl?: string;           // J: 支援金URL
  supportReturnImageUrl?: string; // K: 支援金リターン画像URL
  body: string;                  // L: 本文
  startDate: string;             // M: 表示開始日（ホームバナー用）
  endDate: string;               // N: 表示終了日（ホームバナー用）
  mainImageUrl?: string;         // O: 特設イベントメイン画像URL
  closingMessage?: string;       // P: 締めメッセージ
}

// ── 列インデックス定数（0 始まり）─────────────────────────────
//
// ▼ 列を追加・並び替えたときはここだけ変更してください ▼

/**
 * ライブシートの列定義
 * A=日付, B=イベント名, C=会場, D=料金,
 * E=出演時間, F=チケットURL, G=お目当て特典, H=開場時間, I=XポストURL
 */
const LIVE_COL = {
  date:      0, // A
  title:     1, // B
  venue:     2, // C
  price:     3, // D
  startTime: 4, // E
  ticketUrl: 5, // F
  benefit:   6, // G
  openTime:  7, // H
  xPostUrl:  8, // I
} as const;

/**
 * お知らせシートの列定義
 * A=日付, B=タイトル, C=内容, D=リンク
 */
const NEWS_COL = {
  date:    0, // A
  title:   1, // B
  content: 2, // C
  link:    3, // D
} as const;

/**
 * セットリストシートの列定義
 * A=日付, B=セットリスト, C=備考
 */
const SETLIST_COL = {
  date:    0, // A
  setlist: 1, // B
  note:    2, // C
} as const;

/**
 * 特設ページシートの列定義
 * A=タイトル, B=開催日, C=会場, D=開場時間, E=開演時間,
 * F=出演時間, G=料金, H=チケットURL, I=XポストURL,
 * J=支援金URL, K=支援金リターン画像URL, L=本文,
 * M=表示開始日, N=表示終了日, O=メイン画像URL, P=締めメッセージ
 *
 * O列・P列は既存データを壊さないよう末尾に追加する任意列です。
 */
const SPECIAL_PAGE_COL = {
  title:                 0,  // A
  eventDate:              1,  // B
  venue:                  2,  // C
  openTime:               3,  // D
  startTime:              4,  // E
  performanceTime:        5,  // F
  price:                  6,  // G
  ticketUrl:              7,  // H
  xPostUrl:               8,  // I
  supportUrl:             9,  // J
  supportReturnImageUrl: 10,  // K
  body:                  11,  // L
  startDate:             12,  // M
  endDate:               13,  // N
  mainImageUrl:          14,  // O
  closingMessage:        15,  // P
} as const;

// ── 内部ユーティリティ ────────────────────────────────────────

/** セル値を安全に取得する（undefined なら fallback を返す） */
function col(row: string[], index: number, fallback = ''): string {
  return row[index]?.trim() ?? fallback;
}

/** 特設ページでは「未定」を未入力として扱い、画面に表示しません。 */
function specialPageCol(row: string[], index: number): string {
  const value = col(row, index);
  return value === '未定' ? '' : value;
}

/**
 * RFC 4180 準拠の CSV 行パーサー
 * ダブルクォート内のカンマ・改行・エスケープ済みクォートを正しく処理します。
 */
function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // エスケープされたダブルクォート ("") → " に変換
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
}

/**
 * CSV テキストをレコードごとにパースして 2 次元配列を返します。
 * 引用符内の改行は同じレコードの一部として保持します。
 * BOM（\uFEFF）を除去し、空レコードをスキップします。
 */
function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let record = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (ch === '"') {
      record += ch;

      if (inQuotes && clean[i + 1] === '"') {
        // エスケープされたダブルクォートは、引用符内のまま扱う
        record += clean[i + 1];
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (record.trim() !== '') {
        records.push(parseCsvRow(record));
      }
      record = '';

      // CRLF は1つのレコード区切りとして扱う
      if (ch === '\r' && clean[i + 1] === '\n') {
        i++;
      }
      continue;
    }

    record += ch;
  }

  if (record.trim() !== '') {
    records.push(parseCsvRow(record));
  }

  return records;
}

/**
 * 汎用 CSV フェッチャー
 *
 * @param url      CSV の公開 URL
 * @param mapper   行（string[]）を型 T にマッピングする関数。null を返すとその行をスキップ
 * @param skipRows ヘッダー行をスキップする行数（デフォルト 0）
 * @returns
 *   T[]   → 正常取得（空配列 = データなし）
 *   null  → 取得失敗
 *   ※ url が空文字のときは [] を返します（未設定 = 空扱い）
 *
 * 将来シートを追加するときもこの関数を使ってください。
 * 例:
 *   return fetchCsv(SHEETS_CONFIG.csv.news.url, mapper, SHEETS_CONFIG.csv.news.skipRows);
 */
async function fetchCsv<T>(
  url: string,
  mapper: (row: string[], index: number) => T | null,
  skipRows = 0,
): Promise<T[] | null> {
  // URL 未設定 → 空配列（エラーではない）
  if (!url) {
    return [];
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const text = await res.text();
    const rows = parseCsv(text).slice(skipRows);

    const results: T[] = [];
    rows.forEach((row, idx) => {
      const item = mapper(row, idx);
      if (item !== null) results.push(item);
    });
    return results;
  } catch (err) {
    console.error('[fetchCsv] 取得失敗:', url, err);
    return null;
  }
}

// ── 公開サービス関数 ──────────────────────────────────────────

/**
 * ライブシートからライブ情報一覧を取得します。
 */
export async function getLives(): Promise<Live[] | null> {
  const { url, skipRows } = SHEETS_CONFIG.csv.live;
  return fetchCsv<Live>(
    url,
    (row) => {
      // タイトルが空の行はスキップ
      const title = col(row, LIVE_COL.title);
      if (!title) return null;

      return {
        date:      col(row, LIVE_COL.date),
        title,
        venue:     col(row, LIVE_COL.venue),
        price:     col(row, LIVE_COL.price),
        startTime: col(row, LIVE_COL.startTime),
        ticketUrl: normalizeTicketUrl(col(row, LIVE_COL.ticketUrl)),
        benefit:   col(row, LIVE_COL.benefit),
        openTime:  col(row, LIVE_COL.openTime),
        xPostUrl:  normalizeExternalUrl(col(row, LIVE_COL.xPostUrl)),
      };
    },
    skipRows,
  );
}

/**
 * NEWSシートからお知らせ一覧を取得します。
 */
export async function getNews(): Promise<News[] | null> {
  const { url, skipRows } = SHEETS_CONFIG.csv.news;
  return fetchCsv<News>(
    url,
    (row, idx) => {
      const title = col(row, NEWS_COL.title);
      if (!title) return null;
      return {
        id:      String(idx + 1),
        date:    col(row, NEWS_COL.date),
        title,
        content: col(row, NEWS_COL.content),
        link:    col(row, NEWS_COL.link) || undefined,
      };
    },
    skipRows,
  );
}

/**
 * SETLISTシートからセットリスト一覧を取得します。
 * セル内改行は共通CSVパーサーによって保持されます。
 */
export async function getSetlists(): Promise<Setlist[] | null> {
  const { url, skipRows } = SHEETS_CONFIG.csv.setlist;
  return fetchCsv<Setlist>(
    url,
    (row) => {
      const date = col(row, SETLIST_COL.date);
      const setlist = col(row, SETLIST_COL.setlist);
      if (!date || !setlist) return null;

      return {
        date,
        setlist,
        note: col(row, SETLIST_COL.note),
      };
    },
    skipRows,
  );
}

/**
 * 特設ページシートからバナー候補を取得します。
 * 表示期間の判定は日付が変わると再評価できるよう、呼び出し元で行います。
 */
export async function getSpecialPages(): Promise<SpecialPage[] | null> {
  const { url, skipRows } = SHEETS_CONFIG.csv.specialPage;
  return fetchCsv<SpecialPage>(
    url,
    (row, index) => {
      const title = specialPageCol(row, SPECIAL_PAGE_COL.title);
      if (!title) return null;

      return {
        id: String(index + 2),
        title,
        eventDate: specialPageCol(row, SPECIAL_PAGE_COL.eventDate),
        venue: specialPageCol(row, SPECIAL_PAGE_COL.venue),
        openTime: specialPageCol(row, SPECIAL_PAGE_COL.openTime),
        startTime: specialPageCol(row, SPECIAL_PAGE_COL.startTime),
        performanceTime: specialPageCol(row, SPECIAL_PAGE_COL.performanceTime),
        price: specialPageCol(row, SPECIAL_PAGE_COL.price),
        ticketUrl: normalizeExternalUrl(
          specialPageCol(row, SPECIAL_PAGE_COL.ticketUrl),
        ),
        xPostUrl: normalizeExternalUrl(
          specialPageCol(row, SPECIAL_PAGE_COL.xPostUrl),
        ),
        supportUrl: normalizeExternalUrl(
          specialPageCol(row, SPECIAL_PAGE_COL.supportUrl),
        ),
        supportReturnImageUrl: normalizeExternalUrl(
          specialPageCol(row, SPECIAL_PAGE_COL.supportReturnImageUrl),
        ),
        body: specialPageCol(row, SPECIAL_PAGE_COL.body),
        startDate: specialPageCol(row, SPECIAL_PAGE_COL.startDate),
        endDate: specialPageCol(row, SPECIAL_PAGE_COL.endDate),
        mainImageUrl: normalizeExternalUrl(
          specialPageCol(row, SPECIAL_PAGE_COL.mainImageUrl),
        ),
        closingMessage: specialPageCol(row, SPECIAL_PAGE_COL.closingMessage),
      };
    },
    skipRows,
  );
}

