import { AlertTriangle, ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isDateWithinRange } from '@/utils/liveDate';
import { REGULATION_CHANGE_NOTICE } from '@/data/benefits';

export default function RegulationChangeBanner() {
  const notice = REGULATION_CHANGE_NOTICE;

  if (!isDateWithinRange(notice.displayStartDate, notice.displayEndDate)) {
    return null;
  }

  return (
    <section className="px-4 pt-3" aria-label="特典レギュレーション変更のお知らせ">
      <Link
        to={`/benefits#${notice.id}`}
        className="relative flex min-h-16 w-full items-center overflow-hidden border-y border-border bg-white px-4 py-3 pr-12 text-foreground transition-colors hover:bg-accent/5 active:bg-accent/10"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-accent"
        />
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-accent"
        >
          <AlertTriangle size={17} strokeWidth={2.2} />
        </span>
        <span className="ml-3 min-w-0 text-left">
          <span className="block text-[10px] font-bold tracking-[0.14em] text-accent uppercase">
            お知らせ
          </span>
          <span className="mt-0.5 block truncate text-sm font-bold leading-5">
            特典レギュレーション変更
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <CalendarDays size={12} aria-hidden="true" />
            {notice.effectiveDate}より
          </span>
        </span>
        <ArrowRight
          size={17}
          strokeWidth={2.25}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}