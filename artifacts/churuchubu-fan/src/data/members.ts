export interface Member {
  id: string;
  name: string;
  /** Short/given name shown in compact UI (e.g. home scroll) */
  shortName: string;
  /** Official member color. Strengthened members may not have one yet. */
  colorName?: string;
  /** Tailwind bg class for the avatar circle */
  avatarBgClass?: string;
  /** Tailwind text class for color label */
  colorTextClass?: string;
  /** Hex value shown as the color swatch */
  colorHex?: string;
  isSupport: boolean;
  /** A temporary strengthened member is kept separate from the regular roster. */
  isStrengthened?: boolean;
  affiliation?: string;
  role?: string;
  /** X (Twitter) profile URL — set to '' to hide */
  xUrl: string;
  /** TikTok profile URL — set to '' to hide */
  tiktokUrl: string;
}

export interface RegularMember extends Member {
  colorName: string;
  avatarBgClass: string;
  colorTextClass: string;
  colorHex: string;
}

// 小泉おとは is intentionally excluded.
export const MEMBERS: RegularMember[] = [
  {
    id: 'marin',
    name: '一ノ瀬まりん',
    shortName: 'まりん',
    colorName: 'ミヌエットイエロー',
    avatarBgClass: 'bg-yellow-200',
    colorTextClass: 'text-yellow-500',
    colorHex: '#FDE047',
    isSupport: false,
    xUrl: 'https://x.com/tulle_tube_mrn?s=21',
    tiktokUrl: 'https://www.tiktok.com/@tulle_tube_marin?_r=1&_t=ZS-98UQEBDP87E',
  },
  {
    id: 'karen',
    name: '東雲かれん',
    shortName: 'かれん',
    colorName: 'ペルシャグリーン',
    avatarBgClass: 'bg-green-200',
    colorTextClass: 'text-green-600',
    colorHex: '#86EFAC',
    isSupport: false,
    xUrl: 'https://x.com/tulletube_karen?s=21',
    tiktokUrl: 'https://www.tiktok.com/@karen_nemu?_r=1&_t=ZS-98Uv0qdXeni',
  },
  {
    id: 'kuna',
    name: '泣久那くな',
    shortName: 'くな',
    colorName: 'スコティッシュホワイト',
    avatarBgClass: 'bg-gray-100',
    colorTextClass: 'text-gray-500',
    colorHex: '#F3F4F6',
    isSupport: false,
    xUrl: 'https://x.com/tulletube_kuna?s=21',
    tiktokUrl: 'https://www.tiktok.com/@kun_san00?_r=1&_t=ZS-98UQH1h6EHI',
  },
  {
    id: 'anon',
    name: '椿木あのん',
    shortName: 'あのん',
    colorName: 'ロシアンパープル',
    avatarBgClass: 'bg-purple-200',
    colorTextClass: 'text-purple-500',
    colorHex: '#D8B4FE',
    isSupport: true,
    xUrl: 'https://x.com/tulle_tube_anon?s=21',
    tiktokUrl: '',
  },
];

/**
 * 期間限定の強化メンバー。
 *
 * 正式メンバーとは別配列で管理する。
 */
export const STRENGTHENED_MEMBERS: Member[] = [
  {
    id: 'hia',
    name: '恋羽音ひあ',
    shortName: 'ひあ',
    colorName: 'ピンク',
    avatarBgClass: 'bg-pink-200',
    colorTextClass: 'text-pink-500',
    colorHex: '#F9A8D4',
    isSupport: false,
    isStrengthened: true,
    affiliation: 'すたでぃ→PIT',
    role: '期間限定 強化メンバー',
    xUrl: 'https://x.com/study_pit_hia?s=21',
    tiktokUrl: '',
  },
];

/** プロフィール詳細の検索用。表示上は正式メンバーと強化メンバーを分ける。 */
export const ALL_MEMBERS: Member[] = [...MEMBERS, ...STRENGTHENED_MEMBERS];

export function getMemberById(id: string): Member | undefined {
  return ALL_MEMBERS.find((m) => m.id === id);
}
