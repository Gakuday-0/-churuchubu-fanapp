/**
 * PageContainer — ページ共通のコンテナ幅・余白
 *
 * 使い方:
 *   <PageContainer>...</PageContainer>
 *   <PageContainer spacing="lg">...</PageContainer>
 *   <PageContainer className="space-y-8">...</PageContainer>
 */
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  /**
   * 縦方向のセクション間スペース
   * 'none' は自分で className で指定したいとき
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  as?: React.ElementType;
}

const SPACING = {
  none: '',
  sm:   'space-y-4',
  md:   'space-y-6',
  lg:   'space-y-8',
} as const;

export default function PageContainer({
  children,
  spacing = 'none',
  className,
  as: Tag = 'section',
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto max-w-lg px-4 py-6',
        SPACING[spacing],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
