/**
 * Card — サイト共通のカード UI
 *
 * variant:
 *   'default'  — 白背景（デフォルト）
 *   'gradient' — 次回ライブなどの重要カード（外観は共通）
 *   'special'  — 特別強調（外観は共通）
 *
 * 使い方:
 *   <Card>コンテンツ</Card>
 *   <Card variant="gradient" className="p-5">コンテンツ</Card>
 *   <Card variant="special">コンテンツ</Card>
 */
import { Card as DesignSystemCard } from '@workspace/churuchubu-design-system/components/ui/card';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

type CardVariant = 'default' | 'gradient' | 'special';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:  'bg-white border-border',
  gradient: 'bg-white border-border',
  special:  'bg-white border-border',
};

export default function Card({ children, variant = 'default', className }: CardProps) {
  return (
    <DesignSystemCard
      className={cn(
        'rounded-lg shadow-none',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </DesignSystemCard>
  );
}
