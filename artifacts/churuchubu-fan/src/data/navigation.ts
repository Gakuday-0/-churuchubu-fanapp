// ============================================================
// ナビゲーション定義
// Header と HamburgerMenu が共通でここを参照します。
// ページを追加したらここに項目を追加してください。
// ============================================================

export interface NavItem {
  /** ブラウザタブ・スクリーンリーダー向け English label */
  labelEn: string;
  /** 表示用日本語ラベル（短い） */
  labelJa: string;
  /** ハンバーガーメニュー用の日本語ラベル（より説明的） */
  labelJaLong: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { labelEn: 'MyPage',      labelJa: 'マイページ', labelJaLong: 'マイページ',         path: '/mypage'     },
  { labelEn: 'Home',        labelJa: 'ホーム',     labelJaLong: 'ホーム',             path: '/'           },
  { labelEn: 'Live',        labelJa: 'ライブ',     labelJaLong: 'ライブスケジュール',  path: '/live'       },
  { labelEn: 'Calendar',    labelJa: 'カレンダー', labelJaLong: 'ライブカレンダー',    path: '/live-calendar' },
  { labelEn: 'Members',     labelJa: 'メンバー',   labelJaLong: 'メンバー',           path: '/members'    },
  { labelEn: 'Benefits',    labelJa: '特典',       labelJaLong: '特典',               path: '/benefits'   },
  { labelEn: 'Regulations', labelJa: 'ルール',     labelJaLong: 'ルール',             path: '/regulations'},
  { labelEn: 'Setlists',    labelJa: '過去ライブセトリ', labelJaLong: '過去ライブセトリ', path: '/setlists' },
  { labelEn: 'About',       labelJa: 'このサイトについて', labelJaLong: 'このサイトについて', path: '/about'      },
  { labelEn: 'Terms',       labelJa: '利用規約',   labelJaLong: '利用規約',           path: '/terms'      },
];
