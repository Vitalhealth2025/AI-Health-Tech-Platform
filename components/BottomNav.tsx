'use client';
import Link from 'next/link';

type Page = 'dashboard' | 'meals' | 'profile' | 'settings';

interface BottomNavProps {
  active: Page;
}

const navItems: { page: Page; href: string; label: string; icon: string }[] = [
  {
    page: 'dashboard',
    href: '/dashboard',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    page: 'meals',
    href: '/log-meals',
    label: 'Meals',
    icon: 'M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2',
  },
  {
    page: 'profile',
    href: '/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    page: 'settings',
    href: '/settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around px-2 py-2 pb-3">
          {navItems.map(({ page, href, label, icon }) => {
            const isActive = active === page;
            return (
              <Link key={page} href={href} className="flex flex-col items-center gap-0.5 min-w-[56px]">
                <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-amber-100' : 'bg-transparent'}`}>
                  <svg
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-600' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isActive ? 2.25 : 1.75}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon}/>
                  </svg>
                </div>
                <span className={`text-xs transition-colors ${isActive ? 'font-bold text-amber-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
