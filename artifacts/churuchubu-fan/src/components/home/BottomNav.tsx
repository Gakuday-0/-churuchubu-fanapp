import { Home, Calendar, UserRound, Users, Gift } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

const NAV_ITEMS: Array<{
  path: string;
  end: boolean;
  icon: typeof Home;
  label: string;
  featured?: boolean;
}> = [
  { path: '/',         end: true,  icon: Home,     label: 'ホーム' },
  { path: '/live',     end: false, icon: Calendar, label: 'ライブ' },
  { path: '/mypage',   end: false, icon: UserRound, label: 'マイページ', featured: true },
  { path: '/members',  end: false, icon: Users,    label: 'メンバー' },
  { path: '/benefits', end: false, icon: Gift,     label: '特典' },
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white safe-area-inset-bottom">
      <div className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map(({ path, end, icon: Icon, label, featured }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
                featured
                  ? 'border-x border-gray-200 text-gray-400'
                  : isActive
                  ? 'text-accent'
                    : 'text-gray-400',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  strokeWidth={featured ? 1.8 : isActive ? 2.5 : 1.8}
                  className={isActive && !featured ? 'text-accent' : 'text-gray-400'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
