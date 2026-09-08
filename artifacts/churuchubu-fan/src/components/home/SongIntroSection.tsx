import { useEffect, useState } from 'react';
import { SONGS } from '@/data/songs';

const SONG_CHANGE_INTERVAL = 3500;
const songs: readonly string[] = SONGS;

export default function SongIntroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (songs.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % songs.length);
    }, SONG_CHANGE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  if (songs.length === 0) return null;

  return (
    <section className="px-4 pt-4" aria-label="楽曲紹介">
      <div className="flex h-9 min-w-0 items-center rounded-md border border-border bg-white px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="shrink-0 text-sm leading-none text-muted-foreground"
            aria-hidden="true"
          >
            ♪
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              key={currentIndex}
              className="song-title-fade truncate text-center text-sm font-medium tracking-wide text-foreground"
              title={songs[currentIndex]}
            >
              {songs[currentIndex]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}