'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LogMealsPage() {
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  const mealTypes = [
    { name: 'Breakfast', emoji: '🍳' },
    { name: 'Lunch', emoji: '🥗' },
    { name: 'Dinner', emoji: '🍽️' },
    { name: 'Snack', emoji: '🍎' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="bg-white px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Log Meal</h1>
          <p className="text-sm text-gray-400 mt-1">Track your food intake</p>
        </div>

        <div className="px-6 mt-4 space-y-6 pb-24">

          {/* Meal Type Selector */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-3">Meal Type</p>
            <div className="grid grid-cols-2 gap-3">
              {mealTypes.map((meal) => (
                <button
                  key={meal.name}
                  onClick={() => setSelectedMeal(meal.name)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition
                    ${selectedMeal === meal.name
                      ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                >
                  <span>{meal.emoji}</span>
                  {meal.name}
                </button>
              ))}
            </div>
          </div>

          {/* Food Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900 mb-4">Food Details</p>

            {/* Food Name */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Food Name</label>
              <input
                type="text"
                placeholder="e.g., Grilled Chicken Salad"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Calories */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Calories</label>
              <input
                type="number"
                placeholder="e.g., 450"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Add Photo */}
            <button className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Add Photo (Optional)
            </button>
          </div>

          {/* Save Meal Button */}
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-full transition">
            Save Meal
          </button>

        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/log-meals" className="flex flex-col items-center gap-1 text-yellow-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
            </svg>
            <span className="text-xs font-bold">Meals</span>
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