/**
 * Footer — MainLayout 用の共通フッター
 * コピーライト文言は src/data/config.ts で管理します。
 */
import { SITE_CONFIG } from '@/data/config';

export default function Footer() {
  return (
    <footer className="border-t py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} {SITE_CONFIG.copyright}
    </footer>
  );
}
