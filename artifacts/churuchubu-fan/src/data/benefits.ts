export interface BenefitSection {
  id: string;
  title: string;
  imagePath?: string;
  lead?: string;
  steps?: string[];
  gift?: string;
  body?: string;
  paragraphs?: string[];
  items?: string[];
  link?: {
    label: string;
    href: string;
  };
}

export interface MerchandiseMenuItem {
  id: string;
  title: string;
  price: string;
  notes: string[];
  bundleBenefits?: string[];
}

/**
 * 特典レギュレーション変更のお知らせ。
 *
 * ホームバナーの表示期間はここだけ変更すれば調整できます。
 * アップロードされた告知文に個別ポストURLが含まれていなかったため、
 * 現在は公式Xアカウントを設定しています。
 */
export const REGULATION_CHANGE_NOTICE = {
  id: 'regulation-change-notice',
  displayStartDate: '2026/8/8',
  displayEndDate: '2026/12/31',
  effectiveDate: '2026年9月1日',
  xUrl: 'https://x.com/tulle_tube2025',
  title: '特典内容変更のお知らせ',
  studentDiscount: {
    title: '学割',
    text: '高校生以下を対象に、チェキ券を通常1,000円から900円で販売します。',
    note: '学生証の提示が必須です。',
  },
  entryBenefit: {
    title: '入場特典の終了',
    text: `「握手券・交流30秒延長券・30秒撮影券」のいずれか1つをお選びいただく入場特典は終了します。

握手券および交流30秒延長券は、9月1日より各300円で販売し、チェキ券との併用で使用可能となります。`,
    distributionUntil: '2026年8月26日まで配布',
    usageUntil: '使用期限：2026年8月末',
    followUp: '入場特典の廃止に伴い、後日リニューアルした入場特典を発表予定です。',
  },
  chekiMenu: {
    title: 'チェキ券＋メニュー',
    text: '入場特典で配布しておりました握手券及び30秒交流延長券を一律300円、チェキ券との併用で使用可能なものへ変更します。',
  },
} as const;

export const MERCHANDISE_MENU: MerchandiseMenuItem[] = [
  {
    id: 'cheki-ticket',
    title: 'チェキ券 1枚',
    price: '¥1,000',
    notes: [
      '交流 1分30秒',
      '学割：高校生以下 ¥900（2026年9月1日より適用・学生証提示必須）',
    ],
    bundleBenefits: [
      '10枚 → 10秒動画券 + 2ポイント',
      '5枚 → 1ポイント',
    ],
  },
  {
    id: 'handshake-ticket',
    title: '握手券',
    price: '¥300',
    notes: ['2026年9月1日より適用', 'チェキ券との併用で使用可能'],
  },
  {
    id: 'interaction-extension-ticket',
    title: '30秒交流延長券',
    price: '¥300',
    notes: ['2026年9月1日より適用', 'チェキ券との併用で使用可能'],
  },
  {
    id: 'twenty-second-video',
    title: '20秒動画',
    price: '¥700',
    notes: ['交流なし'],
  },
  {
    id: 'ten-second-photo',
    title: '10秒間写メ',
    price: '¥500',
    notes: ['交流なし'],
  },
];

export const BENEFIT_SECTIONS: BenefitSection[] = [
  {
    id: 'new-member',
    title: '新規特典',
    lead: 'はじめて物販に来られた方',
    steps: [
      '① 公式X・メンバー全員をフォロー',
      '② チェキ券・20秒動画券・10秒間写メ券のいずれかを購入',
    ],
    gift: '🎁 チェキ券1枚 + 写メ券1枚 プレゼント',
  },
  {
    id: 'referral',
    title: 'ご新規様紹介特典',
    lead: 'ライブへ新規の方を1名連れてくると',
    gift: '🎁 チェキ券1枚プレゼント',
  },
  {
    id: 'student-discount',
    title: '学割（2026年9月1日より適用）',
    body: `高校生以下を対象に、チェキ券を通常1,000円から900円で販売します。

学生証の提示が必須です。`,
  },
  {
    id: 'entry',
    title: '入場特典',
    body: `「握手券・交流30秒延長券・30秒撮影券」のいずれか1つをお選びいただく入場特典は、2026年9月1日より終了します。

現在の入場特典は2026年8月26日まで配布します。
使用期限：2026年8月末

握手券および交流30秒延長券は、9月1日より各300円で販売し、チェキ券との併用で使用可能となります。

対バンライブなどで「ちゅ〜るちゅーぶ」をお目当てにして入場された方

「特典券」 1枚に加えて

「握手券」「30秒撮影券」「交流30秒延長券」

の中から

お好きな特典を1つプレゼントいたします。

入場特典の廃止に伴い、後日リニューアルした入場特典を発表予定です。

特典券について

チェキを撮影できる券ではありません。 集めた枚数に応じて、以下の特典と交換できる券です

1枚：写メ券1枚（ピンorツーショ） 
2枚：20秒写メ撮り放題（ピンorツーショット） 
3枚：チェキ券1枚
5枚：チェキ券2枚

＊4枚での交換はできません。

記載した入場特典は基本のものとなります。 ライブごとに変更がある可能性もありますので、最新情報を必ずご確認ください。`,
  },
  {
    id: 'cheki-menu-change',
    title: 'チェキ券＋メニュー（2026年9月1日より適用）',
    body: '入場特典で配布しておりました握手券及び30秒交流延長券を一律300円、チェキ券との併用で使用可能なものへ変更します。',
  },
  {
    id: 'cheki-film',
    title: 'チェキフィルム交換特典',
    imagePath: 'assets/cheki-film-exchange.jpeg',
    paragraphs: [
      'チェキフィルムの供給不足を受け、チェキフィルムをチェキ券と交換できる特典を実施しています。',
    ],
    link: {
      label: '交換早見表・詳細はこちら',
      href: 'https://x.com/tulle_tube2025/status/2083131337301700777?s=46',
    },
    items: [
      '2026年7月31日より交換枚数がさらに増え、お得になりました。',
    ],
  },
];

export const POINT_REWARDS = [
  '20pt：私物サイン',
  '30pt：デコチェキ1枚',
  '50pt：1分間撮影タイム',
  '100pt：推しからのお手紙',
  '150pt：推しとプリ同',
  '300pt：40分デート🎀',
];

export const POINT_EARNING_RULES = [
  'ライブで「ちゅ〜るちゅーぶ」をお目当てにすると1pt',
  'チェキを1枚撮るごとに1pt（ポイントカードをメンバーへお渡しください）',
  '動員重要ライブなどでは、通常より多くのポイントを獲得できる場合があります。',
];

export const POINT_REWARD_NOTE =
  '※100ptまでは通過制です。\n100pt以降は「推しからのお手紙」「推しとプリ同」「40分デート」のいずれかを選択する形式です。';
