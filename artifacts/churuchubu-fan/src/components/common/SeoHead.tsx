/**
 * SeoHead — ページごとの <head> メタタグを管理するコンポーネント
 *
 * 使い方:
 *   <SeoHead
 *     title={SEO_CONFIG.pages.live.title}
 *     description={SEO_CONFIG.pages.live.description}
 *     canonical="/live"
 *   />
 *
 * - title / description を省略するとデフォルト値が使われます。
 * - canonical に "/path" を渡すと SEO_CONFIG.siteUrl が設定済みの場合のみ
 *   <link rel="canonical"> が出力されます。
 * - noIndex={true} にすると robots が "noindex, nofollow" になります（404用）。
 */

import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG, SITE_CONFIG } from '@/data/config';

interface SeoHeadProps {
  title?: string;
  description?: string;
  /** public/ 配下のパス。省略時は SEO_CONFIG.ogImage を使用 */
  ogImage?: string;
  /** "/about" のようなパス文字列。siteUrl 未設定時は出力しない */
  canonical?: string;
  /** true にすると noindex, nofollow を設定（404 ページ等） */
  noIndex?: boolean;
}

export default function SeoHead({
  title,
  description,
  ogImage,
  canonical,
  noIndex = false,
}: SeoHeadProps) {
  const resolvedTitle       = title       ?? SEO_CONFIG.pages.home.title;
  const resolvedDescription = description ?? SEO_CONFIG.defaultDescription;
  const resolvedOgImagePath = ogImage     ?? SEO_CONFIG.ogImage;
  const robots              = noIndex ? 'noindex, nofollow' : SEO_CONFIG.defaultRobots;

  // siteUrl が設定済みのときだけ絶対 URL を組み立てる
  const hasBaseUrl    = Boolean(SEO_CONFIG.siteUrl);
  const canonicalUrl  = hasBaseUrl && canonical
    ? `${SEO_CONFIG.siteUrl}${canonical}`
    : null;
  const ogImageUrl    = hasBaseUrl
    ? `${SEO_CONFIG.siteUrl}${resolvedOgImagePath}`
    : resolvedOgImagePath;

  return (
    <Helmet>
      {/* ── 基本 ─────────────────────────── */}
      <html lang="ja" />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots"      content={robots} />

      {/* ── Canonical ────────────────────── */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* ── OGP ──────────────────────────── */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_CONFIG.name} />
      <meta property="og:title"       content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image"       content={ogImageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* ── Twitter Card ─────────────────── */}
      <meta name="twitter:card"        content={SEO_CONFIG.twitterCard} />
      <meta name="twitter:title"       content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image"       content={ogImageUrl} />
    </Helmet>
  );
}
