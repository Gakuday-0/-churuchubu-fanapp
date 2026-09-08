/**
 * EmptyState — データが空のときの共通表示
 *
 * 使い方:
 *   <EmptyState message="現在ライブ情報はありません" />
 *   <EmptyState icon={Calendar} message="現在ライブ情報はありません" />
 */

import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface EmptyStateProps {
  /** Lucide アイコンコンポーネント。省略時は Inbox */
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  message,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-8 px-4 text-center',
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Icon size={20} className="text-muted-foreground" />
      </div>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
}
