import { ExternalLink } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface OfficialXPostButtonProps {
  href: string;
  compact?: boolean;
}

export default function OfficialXPostButton({
  href,
  compact = false,
}: OfficialXPostButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl',
        'border border-border bg-white text-foreground text-sm font-semibold',
        compact ? 'py-2.5' : 'py-3',
        'transition-all duration-150 hover:bg-secondary',
        'active:scale-[0.97] active:bg-muted',
      )}
    >
      <ExternalLink size={compact ? 14 : 15} />
      公式X 告知ポストはこちら
    </a>
  );
}