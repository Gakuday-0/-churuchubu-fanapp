import logoImage from '@/assets/images/churuchubu-logo.png';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface SiteLogoProps {
  className?: string;
}

/**
 * サイト共通ロゴ。
 *
 * 画像だけを表示し、各ヘッダー側でサイズ・配置を調整します。
 * 差し替え時は src/assets/images/churuchubu-logo.png を更新してください。
 */
export default function SiteLogo({ className }: SiteLogoProps) {
  return (
    <img
      src={logoImage}
      alt="ちゅ〜るちゅーぶ ファンサイト"
      className={cn(
        'block h-auto w-[clamp(240px,68vw,360px)] object-contain',
        className,
      )}
    />
  );
}