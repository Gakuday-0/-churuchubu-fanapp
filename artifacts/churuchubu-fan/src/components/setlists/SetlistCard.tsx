import { useEffect, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import Card from '@/components/common/Card';
import { formatDate, formatVenue } from '@/utils/liveFormat';
import type { SetlistWithLive } from '@/hooks/useSetlists';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

interface SetlistCardProps {
  item: SetlistWithLive;
  id?: string;
  initialOpen?: boolean;
  highlightedSong?: string | null;
}

function normalizeSongLine(value: string): string {
  return value
    .trim()
    .replace(/^(?:\d+\s*[.)、:：-]\s*|[-・●○]\s*)/, '')
    .trim();
}

export default function SetlistCard({
  item,
  id,
  initialOpen = false,
  highlightedSong,
}: SetlistCardProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  useEffect(() => {
    if (initialOpen) setIsOpen(true);
  }, [initialOpen]);

  const songs = item.setlist
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((song) => song.trim())
    .filter(Boolean);

  return (
    <div id={id}>
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex w-full items-start gap-3 px-4 py-4 text-left"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{formatDate(item.date)}</p>
            <p className="text-sm font-bold leading-relaxed text-gray-800">
              {item.live?.title ?? 'ライブ情報なし'}
            </p>
            {item.live?.venue && formatVenue(item.live.venue) && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} className="shrink-0 text-muted-foreground" />
                {formatVenue(item.live.venue)}
              </p>
            )}
          </div>
          <ChevronDown
            size={18}
            className={cn(
              'mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border px-4 pb-4 pt-4">
              <h2 className="mb-3 text-xs font-semibold tracking-widest text-foreground">
                セットリスト
              </h2>
              <ol className="space-y-2.5">
                {songs.map((song, index) => (
                  <li
                    key={`${song}-${index}`}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-sm leading-relaxed text-gray-600"
                  >
                    <span className="font-semibold tabular-nums text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span
                      className={cn(
                        'whitespace-pre-line',
                        highlightedSong &&
                          normalizeSongLine(song).includes(highlightedSong) &&
                          'rounded-sm bg-primary/10 px-1 font-semibold text-foreground',
                      )}
                    >
                      {song}
                    </span>
                  </li>
                ))}
              </ol>

              {item.note && (
                <div className="mt-5 border-t border-border pt-4">
                  <h2 className="mb-2 text-xs font-semibold tracking-widest text-foreground">
                    備考
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {item.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}