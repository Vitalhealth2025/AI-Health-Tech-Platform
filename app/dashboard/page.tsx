'use client';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm">

        {/* Yellow Header */}
        <div className="px-6 pt-10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back,<br />Moesha! 👋</h1>
              <p className="text-sm text-gray-700 mt-1">Here's your health summary</p>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6 space-y-4 pb-24">

          {/* Health Score Card */}
          <div className="bg-yellow-400 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Health Score</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-4xl font-bold text-gray-900">82</span>
                <span className="text-lg text-gray-700 mb-1">/ 100</span>
              </div>
              <p className="text-xs text-gray-700 mt-1">📈 +5 from last week</p>
            </div>
            {/* Donut Chart */}
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a1a" strokeWidth="3"
                  strokeDasharray="82 18" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Today's Calories */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900">Today's Calories</p>
              <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">+</button>
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl font-bold text-gray-900">1500</span>
              <span className="text-sm text-gray-400 mb-1">/ 2000 cal</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Consumed: 1500 cal</span>
              <span className="text-green-500">Remaining: 500 cal</span>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">AI Recommendations</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Drink more water today - stay hydrated! 💧</li>
              <li>• Great protein intake! Keep it up 💪</li>
              <li>• Try adding more vegetables to your meals 🥗</li>
            </ul>
          </div>

          {/* Recent Meals */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Recent Meals</h2>
            <div className="space-y-4">

              {/* Meal Item */}
              {[
                { name: 'Oatmeal + Banana', type: 'Breakfast', cal: 350, time: '8:00 AM', emoji: '🥣' },
                { name: 'Grilled Chicken Salad', type: 'Lunch', cal: 450, time: '12:30 PM', emoji: '🥗' },
                { name: 'Greek Yogurt', type: 'Snack', cal: 150, time: '3:00 PM', emoji: '🍎' },
                { name: 'Salmon with Vegetables', type: 'Dinner', cal: 550, time: '7:00 PM', emoji: '🍽️' },
              ].map((meal) => (
                <div key={meal.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                      {meal.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{meal.name}</p>
                      <p className="text-xs text-gray-400">{meal.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{meal.cal}</p>
                    <p className="text-xs text-gray-400">cal</p>
                    <p className="text-xs text-gray-400">{meal.time}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-yellow-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="text-xs font-bold">Dashboard</span>
          </Link>
          <Link href="/log-meals" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
            </svg>
            <span className="text-xs">Meals</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="text-xs">Profile</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-xs">Settings</span>
          </Link>
        </div>

      </div>
    </main>
  );
}