/**
 * Header — MainLayout 用の最小ヘッダー
 *
 * メインナビゲーションは共通の下部ナビに集約し、
 * ここでは現在ページ名と戻る操作だけを表示します。
 */
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-border bg-white">
      <div className="relative mx-auto flex h-12 max-w-lg items-center px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="前のページに戻る"
          className="absolute left-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary active:opacity-70"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
    </header>
  );
}
