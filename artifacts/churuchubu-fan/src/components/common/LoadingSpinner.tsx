/**
 * LoadingSpinner — ページ・セクションレベルの読み込み中表示
 *
 * 使い方:
 *   <LoadingSpinner />
 *   <LoadingSpinner message="データを取得中..." size="lg" />
 */

import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
} as const;

export default function LoadingSpinner({
  message,
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-border border-t-muted-foreground',
          SIZE[size],
        )}
      />
      {message && (
        <p className="text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
}
