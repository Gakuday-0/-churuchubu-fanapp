/**
 * Button — サイト共通ボタン
 *
 * buttonVariants をエクスポートしているので <Link> や <a> にも適用できます:
 *   import { buttonVariants } from '@/components/common/Button';
 *   <Link to="/" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
 *     ホームに戻る
 *   </Link>
 *
 * 使い方:
 *   <Button>送信</Button>
 *   <Button variant="outline" size="sm">キャンセル</Button>
 *   <Button variant="ghost" onClick={handleRetry}>再試行</Button>
 */
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80',
        outline: 'border border-border bg-white text-foreground hover:bg-secondary active:opacity-70',
        ghost:   'text-muted-foreground hover:text-foreground active:opacity-70',
      },
      size: {
        sm: 'text-xs px-3 py-2 rounded-lg',
        md: 'text-sm px-4 py-2.5 rounded-xl',
        lg: 'text-sm px-6 py-3 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export default function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
