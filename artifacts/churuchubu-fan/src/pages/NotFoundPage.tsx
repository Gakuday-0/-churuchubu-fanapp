import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import SeoHead from '@/components/common/SeoHead';
import { buttonVariants } from '@/components/common/Button';
import { SEO_CONFIG } from '@/data/config';

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <SeoHead
        title={SEO_CONFIG.pages.notFound.title}
        description={SEO_CONFIG.pages.notFound.description}
        noIndex
      />

      {/* アイコン */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <SearchX size={36} className="text-muted-foreground" />
      </div>

      {/* ステータスコード */}
      <p className="mb-3 text-5xl font-black leading-none text-muted-foreground">404</p>

      {/* メッセージ */}
      <h1 className="text-base font-bold text-gray-700 mb-2">
        ページが見つかりません
      </h1>
      <p className="text-xs text-gray-400 leading-relaxed mb-8">
        お探しのページは存在しないか、<br />移動した可能性があります。
      </p>

      {/* 戻るリンク */}
      <Link to="/" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
        ホームに戻る
      </Link>
    </section>
  );
}
