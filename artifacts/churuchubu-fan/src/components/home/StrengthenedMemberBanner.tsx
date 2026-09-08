import { ArrowRight, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEW_FORMATION_NOTICE } from '@/data/newFormation';

export default function StrengthenedMemberBanner() {
  return (
    <section className="px-4 pt-3" aria-label={NEW_FORMATION_NOTICE.title}>
      <Link
        to="/members/strengthened-hia"
        className="relative flex min-h-16 w-full items-center overflow-hidden border-y border-border bg-white px-4 py-2.5 pr-12 text-foreground transition-colors hover:bg-accent/5 active:bg-accent/10"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-accent"
        />
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground"
        >
          <UsersRound size={16} strokeWidth={1.9} />
        </span>
        <span className="ml-3 min-w-0 text-left">
          <span className="block text-[10px] font-bold tracking-[0.14em] text-accent">
            {NEW_FORMATION_NOTICE.title}
          </span>
          <span className="mt-0.5 block truncate text-sm font-bold leading-5">
            恋羽音ひあ 期間限定加入
          </span>
          <span className="mt-0.5 block text-[10px] font-medium leading-4 text-muted-foreground">
            {NEW_FORMATION_NOTICE.debutDate}
          </span>
          <span className="block text-[10px] font-medium leading-4 text-muted-foreground">
            {NEW_FORMATION_NOTICE.venue}
          </span>
        </span>
        <ArrowRight
          size={16}
          strokeWidth={2.25}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}