import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';
import { NAV_ITEMS } from '@/data/navigation';
import { APPROVED_FAN_SITE_LABEL } from '@/data/about';
import SiteLogo from '@/components/common/SiteLogo';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-50 bg-black/30 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="ナビゲーションメニュー"
      >
        {/* Drawer header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex flex-col items-center">
            <SiteLogo className="w-44" />
            <span className="mt-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.08em] text-muted-foreground">
              {APPROVED_FAN_SITE_LABEL}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1',
                   isActive
                     ? 'bg-accent text-accent-foreground'
                     : 'text-gray-600 hover:bg-secondary hover:text-foreground',
                )
              }
            >
              {item.labelJaLong}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
