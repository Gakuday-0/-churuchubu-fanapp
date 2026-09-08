import { User } from 'lucide-react';
import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import OshiSection from '@/components/mypage/OshiSection';
import LiveRecordSection from '@/components/mypage/LiveRecordSection';
import ChekiSection from '@/components/mypage/ChekiSection';
import StatsSection from '@/components/mypage/StatsSection';
import DataManagementSection from '@/components/mypage/DataManagementSection';
import { SEO_CONFIG } from '@/data/config';

export default function MyPage() {
  return (
    <PageContainer spacing="lg">
      <SeoHead
        title={SEO_CONFIG.pages.mypage.title}
        description={SEO_CONFIG.pages.mypage.description}
        canonical="/mypage"
        noIndex
      />

      {/* ページタイトル */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <User size={16} className="text-muted-foreground" />
        </div>
        <h1 className="text-base font-bold text-gray-800">マイページ</h1>
      </div>

      <OshiSection />
      <LiveRecordSection />
      <ChekiSection />
      <StatsSection />
      <DataManagementSection />
    </PageContainer>
  );
}
