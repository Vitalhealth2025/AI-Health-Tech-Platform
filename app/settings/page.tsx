'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from '@/lib/auth';
import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => { signOut(); router.push('/'); };

  const RowIcon = ({ d }: { d: string }) => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
    </svg>
  );

  const ChevronRight = () => (
    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  );

  return (
    <main className="min-h-screen flex justify-center" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your app preferences</p>
        </div>

        <div className="px-6 space-y-4 pb-28">

          {/* Preferences */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Preferences</p>
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] divide-y divide-gray-50">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  <span className="text-sm text-gray-700">Notifications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Enabled</span>
                  <ChevronRight />
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  <span className="text-sm text-gray-700">Dark Mode</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Off</span>
                  <ChevronRight />
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <span className="text-sm text-gray-700">Language</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">English</span>
                  <ChevronRight />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Security</p>
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] divide-y divide-gray-50">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  <span className="text-sm text-gray-700">Change Password</span>
                </div>
                <ChevronRight />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  <span className="text-sm text-gray-700">Privacy Settings</span>
                </div>
                <ChevronRight />
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Support</p>
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] divide-y divide-gray-50">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <span className="text-sm text-gray-700">Help Center</span>
                </div>
                <ChevronRight />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <RowIcon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <span className="text-sm text-gray-700">About</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Version 1.0.0</span>
                  <ChevronRight />
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full border border-rose-200 text-rose-500 hover:bg-rose-50 font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition bg-white/60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>

        </div>

        <BottomNav active="settings" />
      </div>
    </main>
  );
}
