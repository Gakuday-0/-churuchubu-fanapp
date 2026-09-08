import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MyDataProvider } from '@/contexts/MyDataContext';
import HomeLayout from '@/layouts/HomeLayout';
import MainLayout from '@/layouts/MainLayout';

import HomePage from '@/pages/HomePage';
import LivePage from '@/pages/LivePage';
import LiveCalendarPage from '@/pages/LiveCalendarPage';
import LiveDetailPage from '@/pages/LiveDetailPage';
import SpecialPageDetailPage from '@/pages/SpecialPageDetailPage';
import MembersPage from '@/pages/MembersPage';
import MemberProfilePage from '@/pages/MemberProfilePage';
import NewFormationNoticePage from '@/pages/NewFormationNoticePage';
import KarenBirthdayPage from '@/pages/KarenBirthdayPage';
import BenefitsPage from '@/pages/BenefitsPage';
import RegulationsPage from '@/pages/RegulationsPage';
import TermsPage from '@/pages/TermsPage';
import SetlistsPage from '@/pages/SetlistsPage';
import SetlistDetailPage from '@/pages/SetlistDetailPage';
import MyPage from '@/pages/MyPage';
import AboutPage from '@/pages/AboutPage';
import NewsPage from '@/pages/NewsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <MyDataProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          {/* Home uses its own layout (logo, hamburger menu, bottom nav) */}
          <Route element={<HomeLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* All other pages use the standard layout */}
          <Route element={<MainLayout />}>
            <Route path="live"                element={<LivePage />} />
            <Route path="live/calendar"       element={<LiveCalendarPage />} />
            <Route path="live-calendar"        element={<LiveCalendarPage />} />
            <Route path="live/detail"          element={<LiveDetailPage />} />
            <Route path="special/:specialPageId" element={<SpecialPageDetailPage />} />
            <Route path="karen-birthday-2026"   element={<KarenBirthdayPage />} />
            <Route path="members"             element={<MembersPage />} />
            <Route path="members/strengthened-hia" element={<NewFormationNoticePage />} />
            <Route path="members/:memberId"   element={<MemberProfilePage />} />
            <Route path="benefits"            element={<BenefitsPage />} />
            <Route path="regulations"         element={<RegulationsPage />} />
            <Route path="terms"               element={<TermsPage />} />
            <Route path="setlists/detail"     element={<SetlistDetailPage />} />
            <Route path="setlists"            element={<SetlistsPage />} />
            <Route path="mypage"              element={<MyPage />} />
            <Route path="about"               element={<AboutPage />} />
            <Route path="news"                element={<NewsPage />} />
            <Route path="*"                   element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MyDataProvider>
  );
}
