/**
 * ErrorState — データ取得失敗時の共通表示
 *
 * 使い方:
 *   <ErrorState />
 *   <ErrorState message="ライブ情報の取得に失敗しました" onRetry={handleRetry} />
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message = 'データの取得に失敗しました',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-8 px-4 text-center',
        className,
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={20} className="text-red-400" />
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw size={12} />
          再読み込み
        </button>
      )}
    </div>
  );
}
