import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HomeHeader from '@/components/home/HomeHeader';
import HamburgerMenu from '@/components/home/HamburgerMenu';
import BottomNav from '@/components/home/BottomNav';

export default function HomeLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeHeader onMenuOpen={() => setIsMenuOpen(true)} />

      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Scrollable content — pad bottom to clear fixed nav */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
