// ============================================================
// サイト全体の設定
// ============================================================

export const SITE_CONFIG = {
  name: 'ちゅ〜るちゅーぶ',
  subtitle: 'ファン運営サイト',
  copyright: 'ちゅ〜るちゅーぶ ファン運営サイト',
} as const;

// ============================================================
// SEO / OGP 設定
//
// ▼ 本番公開時に siteUrl だけ変更すれば canonical・OGP画像URL
//   がすべてのページで自動的に更新されます。
// ============================================================

export const SEO_CONFIG = {
  /**
   * 本番ドメイン（末尾スラッシュなし）
   * 例: 'https://churuchubu-fan.example.com'
   * 空のままの場合、canonical タグは出力されません。
   */
  siteUrl: '',

  /**
   * OGP・Twitter Card 用画像
   * public/ 配下のパスで指定してください。
   * 推奨サイズ: 1200×630px
   */
  ogImage: '/og-image.png',

  /** Twitter Card の種類 */
  twitterCard: 'summary_large_image' as const,

  /** デフォルトの robots 設定（404 ページは個別に noindex を設定） */
  defaultRobots: 'index, follow',

  /** サイト共通のデフォルト説明文 */
  defaultDescription:
    'ちゅ〜るちゅーぶのファンによる非公式応援サイト。ライブ情報・メンバープロフィール・特典など最新情報を発信しています。',

  /**
   * ページごとの title・description
   * title はブラウザタブとOGPに使用されます。
   */
  pages: {
    home: {
      title: 'ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶのファンによる非公式応援サイト。ライブ情報・メンバープロフィール・特典など最新情報を発信しています。',
    },
    live: {
      title: 'ライブ情報 | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶの最新ライブスケジュール・チケット情報をお届けします。',
    },
    liveCalendar: {
      title: 'ライブカレンダー | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶのライブ予定を月ごとのカレンダーで確認できます。',
    },
    members: {
      title: 'メンバー | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶのメンバープロフィール一覧。担当カラー・SNSリンクをご確認いただけます。',
    },
    memberProfile: {
      /** {name} はページ側でメンバー名に置換する */
      title: '{name} | メンバー | ちゅ〜るちゅーぶ ファン運営サイト',
      description: '{name}のプロフィールページ。担当カラー・SNSリンクをご確認いただけます。',
    },
    benefits: {
      title: '特典 | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶの特典情報。新規特典・ポイント交換・入場特典など詳細はこちら。',
    },
    regulations: {
      title: '必読 | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ライブ中の撮影・プレゼント・特典会についての注意事項をご確認ください。',
    },
    terms: {
      title: '利用規約 | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶ ファンによる非公式サイトの利用規約をご案内します。',
    },
    setlists: {
      title: '過去ライブセトリ | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶの過去ライブのセットリストをご確認いただけます。',
    },
    about: {
      title: 'このサイトについて | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶ ファン運営サイトの運営概要・サイト管理者へのお問い合わせ先をご案内します。',
    },
    news: {
      title: 'NEWS | ちゅ〜るちゅーぶ ファン運営サイト',
      description:
        'ちゅ〜るちゅーぶからのお知らせを掲載しています。',
    },
    mypage: {
      title: 'マイページ | ちゅ〜るちゅーぶ ファン運営サイト',
      description: '推し登録・ライブ参加記録・チェキ枚数を管理するマイページです。',
    },
    notFound: {
      title: 'ページが見つかりません | ちゅ〜るちゅーぶ ファン運営サイト',
      description: 'お探しのページは存在しないか、移動した可能性があります。',
    },
  },
} as const;

// ============================================================
// Google Sheets CSV 取得設定
//
// Google Sheets API は使用せず、スプレッドシートの
// 「CSV 公開 URL」を直接 fetch します。
//
// CSV URL の取得方法:
//   スプレッドシート → ファイル → 共有 → ウェブに公開
//   形式: CSV、シートを選択してリンクを取得
//
//   または gviz 形式（公開設定不要・閲覧権限があれば OK）:
//   https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&sheet={タブ名}
//
// skipRows: ヘッダー行をスキップする行数（ヘッダーあり → 1、なし → 0）
//
// 列を追加・並び替えした場合は googleSheets.ts の
// 各 *_COL 定数のインデックスを更新してください。
// ============================================================

export const SHEETS_CONFIG = {
  csv: {
    /** ライブ情報シート */
    live: {
      url: 'https://docs.google.com/spreadsheets/d/10XGEnM_8wjyUoMKgYjcVYWP9XMkk64XuHrdPpR3VIQU/gviz/tq?tqx=out:csv&sheet=Sheet1',
      skipRows: 1, // 1行目がヘッダーの場合は 1、データのみなら 0
    },
    /** NEWSシート */
    news: {
      url: 'https://docs.google.com/spreadsheets/d/10XGEnM_8wjyUoMKgYjcVYWP9XMkk64XuHrdPpR3VIQU/gviz/tq?tqx=out:csv&sheet=NEWS',
      skipRows: 1,
    },
    /** 過去ライブのセットリストシート */
    setlist: {
      url: 'https://docs.google.com/spreadsheets/d/10XGEnM_8wjyUoMKgYjcVYWP9XMkk64XuHrdPpR3VIQU/gviz/tq?tqx=out:csv&sheet=SETLIST',
      skipRows: 1,
    },
    /** ホームに表示する特設ページシート */
    specialPage: {
      url: 'https://docs.google.com/spreadsheets/d/10XGEnM_8wjyUoMKgYjcVYWP9XMkk64XuHrdPpR3VIQU/gviz/tq?tqx=out:csv&sheet=%E7%89%B9%E8%A8%AD%E3%83%9A%E3%83%BC%E3%82%B8',
      skipRows: 1,
    },
  },
} as const;
