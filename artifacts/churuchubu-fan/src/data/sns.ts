// ============================================================
// SNS links
// href を変更して各公式アカウントURLを設定してください
// ============================================================

export type SnsIconId =
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'ytmusic'
  | 'applemusic';

export interface SnsLink {
  id: string;
  label: string;
  href: string;
  iconId: SnsIconId;
  colorClass: string;
}

export const SNS_LINKS: SnsLink[] = [
  {
    id: 'twitter',
    label: 'X',
    href: 'https://x.com/',
    iconId: 'twitter',
    colorClass: 'bg-black text-white',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    iconId: 'instagram',
    colorClass: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    iconId: 'youtube',
    colorClass: 'bg-red-500 text-white',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/',
    iconId: 'tiktok',
    colorClass: 'bg-gray-900 text-white',
  },
  {
    id: 'ytmusic',
    label: 'YT Music',
    href: 'https://music.youtube.com/',
    iconId: 'ytmusic',
    colorClass: 'bg-red-600 text-white',
  },
  {
    id: 'applemusic',
    label: 'Apple Music',
    href: 'https://music.apple.com/',
    iconId: 'applemusic',
    colorClass: 'bg-gradient-to-br from-pink-500 to-red-500 text-white',
  },
];
