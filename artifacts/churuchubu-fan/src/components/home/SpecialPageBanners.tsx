import { ArrowRight, Cake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import { ALL_MEMBERS } from '@/data/members';
import { KAREN_BIRTHDAY_2026_PATH } from '@/data/karenBirthday2026';
import { useSpecialPages } from '@/hooks/useSpecialPages';

/**
 * スプレッドシートの特設ページ ID ではなく専用ルートへ飛ばしたいページの
 * タイトル → パス マッピング。
 * 東雲かれん生誕祭2026 はコード側で管理するため、ここで上書きする。
 */
const DEDICATED_ROUTES: Record<string, string> = {
  '東雲かれん生誕祭2026': KAREN_BIRTHDAY_2026_PATH,
};

function getMemberColor(title: string): string {
  const matchedMember = ALL_MEMBERS.find(
    (member) =>
      title.includes(member.name) || title.includes(member.shortName),
  );

  return matchedMember?.colorHex ?? 'hsl(var(--accent))';
}

function splitSpecialTitle(title: string): {
  memberName: string;
  eventName: string;
} {
  const matchedMember = ALL_MEMBERS.find(
    (member) =>
      title.includes(member.name) || title.includes(member.shortName),
  );

  if (!matchedMember) {
    return { memberName: '', eventName: title };
  }

  const memberName = title.includes(matchedMember.name)
    ? matchedMember.name
    : matchedMember.shortName;
  const eventName = title
    .slice(title.indexOf(memberName) + memberName.length)
    .trim();

  return {
    memberName,
    eventName: eventName || title,
  };
}

export default function SpecialPageBanners() {
  const { specialPages } = useSpecialPages();

  if (specialPages.length === 0) return null;

  return (
    <section className="px-4 pt-3" aria-label="特設ページ">
      <div className="divide-y divide-border border-y border-border bg-white">
        {specialPages.map((page) => {
          const { memberName, eventName } = splitSpecialTitle(page.title);

          const dedicatedPath = DEDICATED_ROUTES[page.title];

          return (
            <Link
              key={page.id}
              to={dedicatedPath ?? `/special/${page.id}`}
              style={{ '--special-member-color': getMemberColor(page.title) } as React.CSSProperties}
              className={cn(
                'relative flex min-h-14 w-full items-center overflow-hidden pl-4 pr-12 py-2.5',
                'text-foreground',
                'transition-colors hover:bg-accent/5 active:bg-accent/10',
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[var(--special-member-color)]"
              />
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground"
              >
                <Cake size={16} strokeWidth={1.9} />
              </span>
              <span className="grid min-w-0 flex-1 grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-1 pl-3 text-left">
                <span className="truncate text-sm font-semibold leading-5">
                  {memberName}
                </span>
                <span className="min-w-0 truncate text-sm font-semibold leading-5">
                  {eventName}
                </span>
                <span className="col-span-2 mt-0.5 block text-[10px] font-medium tracking-[0.14em] text-muted-foreground">
                   生誕祭・特設ページ
                </span>
              </span>
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}