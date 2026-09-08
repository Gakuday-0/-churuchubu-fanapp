import { Banknote, Clock } from 'lucide-react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import {
  formatPriceRows,
  formatSchedule,
  type ScheduleSection,
} from '@/utils/liveFormat';

interface LiveInfoRowsProps {
  dimmed?: boolean;
}

export function LiveScheduleRows({
  startTime,
  openTime,
  dimmed = false,
}: LiveInfoRowsProps & { startTime: string; openTime: string }) {
  const sections = formatSchedule(startTime, openTime);
  if (sections.length === 0) return null;

  const hasMultipleParts = sections.filter((section) => section.part).length >= 2;

  return (
    <LiveInfoRow icon={Clock} dimmed={dimmed} align="start">
      <div className="space-y-3">
        {sections.map((section, index) => (
          <ScheduleSectionView
            key={`${section.part ?? 'single'}-${index}`}
            section={section}
            showPartHeading={hasMultipleParts}
          />
        ))}
      </div>
    </LiveInfoRow>
  );
}

export function LivePriceRows({
  price,
  dimmed = false,
}: LiveInfoRowsProps & { price: string }) {
  const rows = formatPriceRows(price);
  if (rows.length === 0) return null;

  return (
    <LiveInfoRow icon={Banknote} dimmed={dimmed} align="start">
      <div className="space-y-1.5">
        {rows.map((row, index) => (
          <div key={`${row.label}-${row.value}-${index}`} className="flex gap-3 leading-relaxed">
            <span className="w-[4.5rem] shrink-0 font-medium text-gray-500">
              {row.label}
            </span>
            <span className="min-w-0 tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </LiveInfoRow>
  );
}

function ScheduleSectionView({
  section,
  showPartHeading,
}: {
  section: ScheduleSection;
  showPartHeading: boolean;
}) {
  return (
    <div>
      {showPartHeading && section.part && (
        <div className="mb-1.5 text-xs font-bold text-gray-700">
          <span aria-hidden="true">🕒</span> {section.part}
        </div>
      )}
      <div className="space-y-1">
        {section.lines.map((line, index) => (
          <div key={`${line.label}-${line.value}-${index}`} className="flex gap-3 leading-relaxed">
            <span className="w-[4.5rem] shrink-0 font-medium text-gray-500">
              {line.label}
            </span>
            <span className="min-w-0 whitespace-pre-line">{line.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveInfoRow({
  icon: Icon,
  children,
  dimmed,
  align = 'center',
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  dimmed?: boolean;
  align?: 'center' | 'start';
}) {
  return (
    <div
      className={cn(
        'flex gap-2.5 text-sm',
        align === 'start' ? 'items-start' : 'items-center',
        dimmed ? 'text-gray-400' : 'text-gray-600',
      )}
    >
      <Icon
        size={15}
        className={cn(
          'shrink-0',
          align === 'start' && 'mt-0.5',
          dimmed ? 'text-gray-300' : 'text-muted-foreground',
        )}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}