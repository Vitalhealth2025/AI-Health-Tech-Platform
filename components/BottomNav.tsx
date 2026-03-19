'use client';
import Link from 'next/link';

type Page = 'dashboard' | 'meals' | 'profile' | 'settings';

interface BottomNavProps {
  active: Page;
}

export default function BottomNav({ active }: BottomNavProps) {
  const linkClass = (page: Page) =>
    `flex flex-col items-center gap-1 ${active === page ? 'text-yellow-400' : 'text-gray-400'}`;

  const labelClass = (page: Page) =>
    `text-xs ${active === page ? 'font-bold' : ''}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
      <Link href="/dashboard" className={linkClass('dashboard')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span className={labelClass('dashboard')}>Dashboard</span>
      </Link>
      <Link href="/log-meals" className={linkClass('meals')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
        </svg>
        <span className={labelClass('meals')}>Meals</span>
      </Link>
      <Link href="/profile" className={linkClass('profile')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span className={labelClass('profile')}>Profile</span>
      </Link>
      <Link href="/settings" className={linkClass('settings')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span className={labelClass('settings')}>Settings</span>
      </Link>
    </div>
  );
}
