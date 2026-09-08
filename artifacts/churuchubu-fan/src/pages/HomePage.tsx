import SeoHead from '@/components/common/SeoHead';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import MembersScroll from '@/components/home/MembersScroll';
import NextLiveCard from '@/components/home/NextLiveCard';
import RegulationChangeBanner from '@/components/home/RegulationChangeBanner';
import SnsButtons from '@/components/home/SnsButtons';
import SongIntroSection from '@/components/home/SongIntroSection';
import SpecialPageBanners from '@/components/home/SpecialPageBanners';
import UpcomingLivesAccordion from '@/components/home/UpcomingLivesAccordion';
import { SEO_CONFIG } from '@/data/config';
import { useLives } from '@/hooks/useLives';
import { LiveCalendarContent } from '@/pages/LiveCalendarPage';

export default function HomePage() {
  // ライブデータを 1 回だけ fetch し、子コンポーネントへ渡す
  const { upcoming, past, isLoading, isError, retry } = useLives();

  return (
    <div className="max-w-lg mx-auto pb-4">
      <SeoHead
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        canonical="/"
      />

      <SongIntroSection />

      {/* 表示期間内の特設ページ（複数可） */}
      <SpecialPageBanners />

      {/* 特典レギュレーション変更のお知らせ */}
      <RegulationChangeBanner />

      {/* 次回ライブ（1件・大） */}
      <NextLiveCard
        upcoming={upcoming}
        isLoading={isLoading}
        isError={isError}
        retry={retry}
      />

      {/* ライブカレンダー */}
      <LiveCalendarContent
        upcoming={upcoming}
          past={past}
        isLoading={isLoading}
        isError={isError}
        retry={retry}
        embedded
      />

      {/* 今後のライブ（アコーディオン・最大5件） */}
      <UpcomingLivesAccordion upcoming={upcoming} isLoading={isLoading} />

      <AnnouncementSection />
      <MembersScroll />
      <SnsButtons />

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
}
