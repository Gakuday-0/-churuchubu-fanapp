/**
 * SectionTitle — 共通セクション見出し
 *
 * 使い方:
 *   <SectionTitle>メンバー</SectionTitle>        // h2, mb-3（デフォルト）
 *   <SectionTitle as="h1">特典</SectionTitle> // h1, mb-5
 *   <SectionTitle className="mb-0">ライブ</SectionTitle>
 */
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  /** 要素タグ。h1 のとき自動で mb-5 を適用。デフォルト h2 */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export default function SectionTitle({
  children,
  as: Tag = 'h2',
  className,
}: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        'text-base font-bold tracking-normal text-foreground',
        Tag === 'h1' ? 'mb-5' : 'mb-3',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
