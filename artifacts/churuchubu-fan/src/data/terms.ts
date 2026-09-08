// ============================================================
// 利用規約データ
// 本文を変更するときはこのファイルだけ編集してください。
// ============================================================

export interface TermsSection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface TermsContactLink {
  label: string;
  value: string;
  url: string;
}

export const TERMS_PAGE = {
  title: '利用規約',
  updatedAt: '最終更新日：2026年8月1日',
  sections: [
    {
      id: 'application',
      title: '第1条（適用）',
      paragraphs: [
        '本利用規約は、「ちゅ〜るちゅーぶ ファンによる非公式サイト」（以下「当サイト」）の利用条件を定めるものです。',
        '当サイトをご利用いただいた時点で、本規約に同意したものとみなします。',
      ],
    },
    {
      id: 'about',
      title: '第2条（当サイトについて）',
      paragraphs: [
        '当サイトはファンが個人で運営する非公式サイトです。',
        '所属事務所・運営会社・メンバー本人とは一切関係ありません。',
        '掲載内容について公式運営・所属事務所・メンバーへお問い合わせを行うことはお控えください。',
      ],
    },
    {
      id: 'information',
      title: '第3条（掲載情報）',
      paragraphs: [
        '当サイトではライブ情報・特典情報・メンバー情報・SNS・NEWSなどを掲載しています。',
        '掲載内容については十分注意しておりますが、正確性・最新性を保証するものではありません。',
        '最新情報は公式SNS・公式サイト等をご確認ください。',
      ],
    },
    {
      id: 'prohibited',
      title: '第4条（禁止事項）',
      paragraphs: ['利用者は以下の行為を行ってはいけません。'],
      items: [
        '法令または公序良俗に反する行為',
        '当サイトの運営を妨害する行為',
        '不正アクセスやシステムへの攻撃',
        '掲載内容の無断転載・再配布',
        '他の利用者や第三者への迷惑行為',
        'その他、運営者が不適切と判断する行為',
      ],
    },
    {
      id: 'copyright',
      title: '第5条（著作権）',
      paragraphs: [
        '当サイト内の文章・デザインなどの著作権は、運営者または各権利者に帰属します。',
        'メンバー写真・公式画像・ロゴ等の著作権・肖像権・商標権は各権利者に帰属します。',
        '権利者から修正・削除等のご連絡をいただいた場合は、速やかに対応いたします。',
      ],
    },
    {
      id: 'disclaimer',
      title: '第6条（免責事項）',
      paragraphs: [
        '当サイトの利用により発生したいかなる損害についても、運営者は責任を負いません。',
        '掲載情報は予告なく変更・削除される場合があります。',
      ],
    },
    {
      id: 'external-links',
      title: '第7条（外部リンク）',
      paragraphs: [
        '当サイトには外部サイトへのリンクが含まれます。',
        'リンク先サイトの内容・サービスについて、当サイトは責任を負いません。',
      ],
    },
    {
      id: 'changes',
      title: '第8条（利用規約の変更）',
      paragraphs: [
        '本規約は必要に応じて予告なく変更する場合があります。',
        '変更後は当サイトへ掲載した時点で効力を生じます。',
      ],
    },
    {
      id: 'contact',
      title: '第9条（お問い合わせ）',
      paragraphs: [
        '当サイトはファンが個人で運営する非公式サイトです。',
        'サイトの内容・掲載情報・不具合・修正依頼・ご意見などに関するお問い合わせは、当サイト運営者までお願いいたします。',
        '公式運営・所属事務所・メンバーへの当サイトに関するお問い合わせはご遠慮ください。',
      ],
    },
  ] satisfies TermsSection[],
  contactTitle: '【お問い合わせ先】',
  contactLinks: [
    {
      label: 'X（旧Twitter）',
      value: '@gakuday_o',
      url: 'https://x.com/gakuday_o',
    },
    {
      label: 'メール',
      value: 'gakuday.o0th@gmail.com',
      url: 'mailto:gakuday.o0th@gmail.com',
    },
  ] satisfies TermsContactLink[],
} as const;