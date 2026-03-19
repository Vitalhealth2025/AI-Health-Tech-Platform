'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import BottomNav from '@/components/BottomNav';
import { Meal } from '@/lib/types';
import { DEFAULT_CALORIE_GOAL } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(DEFAULT_CALORIE_GOAL);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      // Load user's first name
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || 'there');
        const savedGoal = parseInt(data.calorieGoal);
        if (!isNaN(savedGoal) && savedGoal > 0) {
          setCalorieGoal(savedGoal);
        }
      }

      // Load today's meals
      const today = new Date().toISOString().split('T')[0];
      const mealsRef = collection(db, 'users', user.uid, 'meals');
      const q = query(mealsRef, where('date', '==', today));
      const querySnapshot = await getDocs(q);

      const todaysMeals: Meal[] = [];
      let calTotal = 0;

      querySnapshot.forEach((snap) => {
        const meal = { id: snap.id, ...snap.data() } as Meal;
        todaysMeals.push(meal);
        calTotal += meal.calories || 0;
      });

      // Sort meals by time
      todaysMeals.sort((a, b) => a.time?.localeCompare(b.time));

      setMeals(todaysMeals);
      setTotalCalories(calTotal);
      
const userData = {
  firstName: docSnap.exists() ? docSnap.data().firstName : 'there',
  calorieGoal: Number(docSnap.exists() ? docSnap.data().calorieGoal : 2000),
  totalCalories: calTotal,
  meals: todaysMeals,
  activityLevel: docSnap.exists() ? docSnap.data().activityLevel : '',
  healthGoal: docSnap.exists() ? docSnap.data().healthGoal : '',
};

// Check cache first — key includes meal count so it refreshes when meals change
const cacheKey = `ai_cache_${user.uid}_${today}_${todaysMeals.length}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  const parsedCache = JSON.parse(cached);
  setHealthScore(parsedCache.healthScore);
  setRecommendations(parsedCache.recommendations);
} else {
  setAiLoading(true);
  try {
    const res = await fetch('/api/health-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const aiData = await res.json();
    setHealthScore(aiData.healthScore);
    setRecommendations(aiData.recommendations);

    // Cache for today
    localStorage.setItem(cacheKey, JSON.stringify(aiData));
  } catch (err) {
    console.error('AI fetch error:', err);
  } finally {
    setAiLoading(false);
  }
}
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const remainingCalories = calorieGoal - totalCalories;
  const progressPercent = Math.min((totalCalories / calorieGoal) * 100, 100);

  const getCalorieStatus = () => {
    const diff = Math.abs(remainingCalories);
    if (diff <= 100) return { label: 'Maintenance', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (remainingCalories > 100) return { label: 'Deficit', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    return { label: 'Surplus', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  };
  const calorieStatus = getCalorieStatus();

  const getMealEmoji = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast': return '🍳';
      case 'Lunch': return '🥗';
      case 'Dinner': return '🍽️';
      case 'Snack': return '🍎';
      default: return '🍴';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's your health summary</p>
        </div>

        <div className="px-6 space-y-4 pb-24">

          {/* Health Score Card */}
          <div className="bg-yellow-400 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Health Score</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-4xl font-bold text-gray-900">
                  {aiLoading ? '...' : healthScore ?? '—'}
                </span>
                <span className="text-lg text-gray-700 mb-1">/ 100</span>
              </div>
              <p className="text-xs text-gray-700 mt-1">
                {aiLoading ? 'Calculating...' : '📈 Based on your activity today'}
              </p>
            </div>
            {/* Donut Chart */}
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a1a" strokeWidth="3"
                  strokeDasharray={`${healthScore ?? 0} ${100 - (healthScore ?? 0)}`}
                  strokeLinecap="round"/>
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
              <Link href="/log-meals">
                <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">+</button>
              </Link>
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl font-bold text-gray-900">{totalCalories}</span>
              <span className="text-sm text-gray-400 mb-1">/ {calorieGoal} cal</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Consumed: {totalCalories} cal</span>
              <span className={remainingCalories >= 0 ? 'text-green-500' : 'text-red-400'}>
                {remainingCalories >= 0 ? `Remaining: ${remainingCalories} cal` : `Over by: ${Math.abs(remainingCalories)} cal`}
              </span>
            </div>
            <div className={`mt-3 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 border ${calorieStatus.bg} ${calorieStatus.border}`}>
              <span className={`text-xs font-bold ${calorieStatus.color}`}>{calorieStatus.label}</span>
              <span className="text-xs text-gray-400">
                {calorieStatus.label === 'Maintenance'
                  ? '— on track with your goal'
                  : calorieStatus.label === 'Deficit'
                  ? `— ${remainingCalories} cal under goal`
                  : `— ${Math.abs(remainingCalories)} cal over goal`}
              </span>
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
            {aiLoading ? (
              <p className="text-sm text-gray-400">Generating your personalized recommendations...</p>
            ) : recommendations.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Log some meals to get personalized recommendations!</p>
            )}
          </div>

          {/* Recent Meals */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Recent Meals</h2>

            {meals.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm">No meals logged today yet.</p>
                <Link href="/log-meals">
                  <button className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-full text-sm transition">
                    Log your first meal
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                        {getMealEmoji(meal.mealType)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{meal.foodName}</p>
                        <p className="text-xs text-gray-400">{meal.mealType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{meal.calories}</p>
                      <p className="text-xs text-gray-400">cal</p>
                      <p className="text-xs text-gray-400">{formatTime(meal.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <BottomNav active="dashboard" />

      </div>
    </main>
  );
}