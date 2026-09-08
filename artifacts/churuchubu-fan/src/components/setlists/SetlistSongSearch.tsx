import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SetlistWithLive } from '@/hooks/useSetlists';
import { SONGS } from '@/data/songs';
import { formatDate, formatVenue, stripGroupName } from '@/utils/liveFormat';

interface SetlistSongSearchProps {
  setlists: SetlistWithLive[];
  isLoading: boolean;
  isError: boolean;
}

function normalizeSongLine(value: string): string {
  return value
    .trim()
    .replace(/^(?:\d+\s*[.)、:：-]\s*|[-・●○]\s*)/, '')
    .trim();
}

function containsSong(setlist: string, song: string): boolean {
  return setlist
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .some((line) => normalizeSongLine(line).includes(song));
}

function getSetlistPath(date: string, song: string): string {
  const params = new URLSearchParams({
    date,
    song,
  });
  return `/setlists/detail?${params.toString()}`;
}

export default function SetlistSongSearch({
  setlists,
  isLoading,
  isError,
}: SetlistSongSearchProps) {
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const matchingSetlists = selectedSong
    ? setlists.filter((item) => containsSong(item.setlist, selectedSong))
    : [];

  const chooseSong = (song: string) => {
    setSelectedSong(song);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setSelectedSong(null);
    setIsOpen(false);
  };

  return (
    <section ref={searchRef} className="mb-6">
      <h2 className="mb-3 text-sm font-bold text-foreground">
        過去セトリから曲を探す
      </h2>

      <div className="relative">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
        />
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="setlist-song-options"
          aria-haspopup="listbox"
          className="flex h-11 w-full items-center rounded-md border border-input bg-white pl-10 pr-10 text-left text-sm text-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {selectedSong ?? '曲名を選択'}
        </button>
        {selectedSong && (
          <button
            type="button"
            onClick={clearSelection}
            aria-label="曲名をクリア"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary active:opacity-70"
          >
            <X size={16} />
          </button>
        )}

        {isOpen && (
          <div
            id="setlist-song-options"
            role="listbox"
            className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto border border-border bg-white"
          >
            {SONGS.length > 0 ? (
              SONGS.map((song) => (
                <button
                  key={song}
                  type="button"
                  role="option"
                  aria-selected={song === selectedSong}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseSong(song)}
                  className="flex min-h-11 w-full items-center border-b border-border px-4 py-3 text-left text-sm text-gray-800 last:border-b-0 hover:bg-secondary active:bg-muted"
                >
                  {song}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                該当する曲がありません
              </p>
            )}
          </div>
        )}
      </div>

      {selectedSong && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            「{selectedSong}」が披露されたライブ
          </p>

          {isLoading && (
            <p className="border-t border-border py-4 text-sm text-muted-foreground">
              セトリ情報を取得中...
            </p>
          )}

          {isError && (
            <p className="border-t border-border py-4 text-sm text-muted-foreground">
              セトリ情報を取得できませんでした
            </p>
          )}

          {!isLoading && !isError && matchingSetlists.length === 0 && (
            <p className="border-t border-border py-4 text-sm text-muted-foreground">
              この曲の過去セトリはありません
            </p>
          )}

          {!isLoading && !isError && matchingSetlists.length > 0 && (
            <div className="border-t border-border">
              {matchingSetlists.map((item, index) => {
                const live = item.live;
                const result = (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatDate(item.date)}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-relaxed text-gray-800">
                        {live ? stripGroupName(live.title) : 'ライブ情報なし'}
                      </p>
                      {live && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={12} className="shrink-0 text-muted-foreground" />
                          {formatVenue(live.venue) || '会場情報なし'}
                        </p>
                      )}
                    </div>
                    {live && (
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                    )}
                  </>
                );

                return (
                  <Link
                    key={`${item.date}-${index}`}
                    to={getSetlistPath(item.date, selectedSong)}
                    className="flex min-h-20 items-start gap-3 border-b border-border px-1 py-4 last:border-b-0 hover:bg-secondary active:opacity-70"
                  >
                    {result}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}