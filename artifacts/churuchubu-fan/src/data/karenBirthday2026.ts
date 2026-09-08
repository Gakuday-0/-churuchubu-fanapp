/**
 * 東雲かれん 生誕祭2026 イベントデータ
 *
 * ここだけ変更すればページ全体が更新されます。
 * URL が判明したら ticketUrl / xPostUrl / supportUrl に設定してください。
 */

export interface KarenTicket {
  id: string;
  label: string;
  price: number;
  isFeatured: boolean;
  includes: string[];
}

export interface KarenSupportPlan {
  id: string;
  amount: number;
  returns: string[];
}

export interface KarenTimetableEntry {
  time: string;
  act: string;
  sub?: string;
  isHighlight?: boolean;
  isMerchandise?: boolean;
  isOpen?: boolean;
}

export const KAREN_BIRTHDAY_2026 = {
  // ── 基本情報 ──────────────────────────────────────────────────
  title: '東雲かれん 生誕祭2026',
  memberName: '東雲かれん',
  /** ISO 形式の開催日（カウントダウン計算に使用） */
  date: '2026-08-26',
  dateLabel: '2026年8月26日（水）',
  venue: '伏見ライオンシアター',
  openTime: '18:00',
  startTime: '18:20',
  /** 担当カラー（ペルシャグリーン） */
  accentColor: '#86EFAC',
  /** アクセントのテキスト色（暗め） */
  accentTextColor: '#16a34a',

  // ── 外部リンク（判明次第設定） ─────────────────────────────
  /** チケット購入 URL。未設定なら undefined のまま */
  ticketUrl: undefined as string | undefined,
  /** 公式 X 告知 URL。未設定なら undefined のまま */
  xPostUrl: 'https://x.com/tulle_tube2025/status/2087509552447271026?s=46' as string | undefined,
  /** 支援金 URL。未設定なら undefined のまま */
  supportUrl: 'https://irexone.official.ec/' as string | undefined,
  /** チケット購入ページURL（別途設定） */
  ticketPurchaseUrl: 'https://ticketdive.com/event/karen_seitan0826' as string | undefined,

  // ── メインビジュアル ────────────────────────────────────────
  /**
   * 告知画像 URL。
   * public/ 配下に画像を配置した場合は '/karen-birthday-2026-visual.jpg' のように設定。
   * 未設定（undefined）の場合はビジュアルセクションを非表示にします。
   */
  mainImageUrl: undefined as string | undefined,

  // ── チケット情報 ────────────────────────────────────────────
  tickets: [
    {
      id: 's-ticket',
      label: 'Sチケット',
      price: 8000,
      isFeatured: true,
      includes: ['優先エリア', '生誕Tシャツ', 'お手紙'],
    },
    {
      id: 'priority',
      label: '優先エリア',
      price: 2500,
      isFeatured: false,
      includes: [],
    },
    {
      id: 'general',
      label: '一般エリア',
      price: 1000,
      isFeatured: false,
      includes: [],
    },
  ] as KarenTicket[],

  ticketNotes: [
    '各チケット＋D代',
    '当日は各エリア＋500円',
  ],

  // ── 支援金プラン ────────────────────────────────────────────
  /**
   * 支援金募集ページ URL。
   * 判明次第ここに設定してください。未設定なら undefined のまま。
   */
  // supportUrl は上の外部リンク欄で管理済み

  supportPlans: [
    {
      id: 'plan-50000',
      amount: 50000,
      returns: [
        '1時間デート',
        'プリ同',
        'ファストパス',
        '生誕アクスタ',
        '生誕デコチェキ',
        '生誕ブロマイド',
      ],
    },
    {
      id: 'plan-30000',
      amount: 30000,
      returns: [
        'プリ同',
        'ファストパス',
        '生誕アクスタ',
        '生誕デコチェキ',
        '生誕ブロマイド',
      ],
    },
    {
      id: 'plan-10000',
      amount: 10000,
      returns: [
        '生誕アクスタ',
        '生誕デコチェキ',
        '生誕ブロマイド',
      ],
    },
    {
      id: 'plan-3000',
      amount: 3000,
      returns: [
        'お礼メッセージカード',
        '生誕ブロマイド',
      ],
    },
  ] as KarenSupportPlan[],

  // ── タイムテーブル ──────────────────────────────────────────
  timetable: [
    { time: '18:00',        act: 'OPEN',                                 isOpen: true },
    { time: '18:20〜18:30', act: '如月えま' },
    { time: '18:30〜18:50', act: 'すたでぃ→PIT' },
    { time: '18:50〜19:10', act: 'アリビオ' },
    { time: '19:10〜19:30', act: '東雲かれんステージ', sub: '茉白レイ コラボ', isHighlight: true },
    { time: '19:30〜19:50', act: 'きっずりたーん！' },
    { time: '19:50〜20:10', act: 'みありー' },
    { time: '20:10〜20:30', act: 'ちゅ〜るちゅーぶ' },
    { time: '20:30〜21:50', act: '終演後物販', isMerchandise: true },
  ] as KarenTimetableEntry[],
} as const;

/** 専用ページの URL パス */
export const KAREN_BIRTHDAY_2026_PATH = '/karen-birthday-2026';
