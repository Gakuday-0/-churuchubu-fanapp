/**
 * Accordion — 共通アコーディオンコンポーネント
 *
 * 使い方:
 *   const sections: AccordionSection[] = REGULATIONS.map(s => ({
 *     id: s.id,
 *     title: s.title,
 *     isSpecial: s.isSpecial,
 *     content: <ul>...</ul>,
 *   }));
 *   <Accordion sections={sections} />
 *   <Accordion sections={sections} defaultOpenId="first-id" />
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

export interface AccordionSection {
  id: string;
  title: string;
  content: React.ReactNode;
  /** true のとき特別カラーを適用 */
  isSpecial?: boolean;
}

interface AccordionProps {
  sections: AccordionSection[];
  /** 最初から開いておく section の id。省略時は最初の要素 */
  defaultOpenId?: string;
  className?: string;
}

export default function Accordion({ sections, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string>(
    defaultOpenId ?? sections[0]?.id ?? '',
  );

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? '' : id));

  return (
    <div className={cn('space-y-2', className)}>
      {sections.map((section) => {
        const isOpen = openId === section.id;

        return (
          <div
            key={section.id}
            className={cn(
              'rounded-md border overflow-hidden transition-colors',
               'border-border bg-white',
            )}
          >
            {/* ヘッダー */}
            <button
              type="button"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-4 py-4 text-left"
            >
              <span
                className={cn(
                  'text-sm font-bold',
                   section.isSpecial ? 'text-foreground' : 'text-gray-800',
                )}
              >
                {section.title}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                   'shrink-0 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>

            {/* コンテンツ（grid で高さアニメーション） */}
            <div
              className={cn(
                'grid transition-all duration-200 ease-in-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4">{section.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
