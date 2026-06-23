'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/auth';
import { getUserProfile, getMealsByDate } from '@/lib/storage';
import BottomNav from '@/components/BottomNav';
import { Meal } from '@/lib/types';
import { DEFAULT_CALORIE_GOAL } from '@/lib/constants';
import { calculateBMI } from '@/lib/validation';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getTodayDate = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const getMealTypeStyle = (mealType: string) => {
  switch (mealType) {
    case 'Breakfast': return { bg: 'bg-amber-100',   color: 'text-amber-600'   };
    case 'Lunch':     return { bg: 'bg-green-100',   color: 'text-green-600'   };
    case 'Dinner':    return { bg: 'bg-sky-100',     color: 'text-sky-600'     };
    case 'Snack':     return { bg: 'bg-emerald-100', color: 'text-emerald-600' };
    default:          return { bg: 'bg-gray-100',    color: 'text-gray-500'    };
  }
};

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
  const [profileHeight, setProfileHeight] = useState('');
  const [profileWeight, setProfileWeight] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (!user) { router.push('/'); return; }

      const profile = getUserProfile(user.uid);
      setFirstName(profile.firstName || 'there');

      const savedGoal = parseInt(profile.calorieGoal || '');
      if (!isNaN(savedGoal) && savedGoal > 0) setCalorieGoal(savedGoal);
      setProfileHeight(profile.height || '');
      setProfileWeight(profile.weight || '');

      const today = new Date().toISOString().split('T')[0];
      const todaysMeals = getMealsByDate(user.uid, today);
      const calTotal = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

      setMeals(todaysMeals);
      setTotalCalories(calTotal);

      const userData = {
        firstName: profile.firstName || 'there',
        calorieGoal: Number(profile.calorieGoal || 2000),
        totalCalories: calTotal,
        meals: todaysMeals,
        activityLevel: profile.activityLevel || '',
        healthGoal: profile.healthGoal || '',
      };

      for (const key of Object.keys(localStorage)) {
        if (
          key.startsWith(`ai_cache_${user.uid}_`) &&
          !key.startsWith(`ai_cache_${user.uid}_${today}_`)
        ) localStorage.removeItem(key);
      }

      const cacheKey = `ai_cache_${user.uid}_${today}_${todaysMeals.length}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        setHealthScore(parsed.healthScore);
        setRecommendations(parsed.recommendations);
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
    if (diff <= 100)          return { label: 'On Track',  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  };
    if (remainingCalories > 100) return { label: 'Deficit',  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200'  };
    return                        { label: 'Surplus',  color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200'   };
  };
  const calorieStatus = getCalorieStatus();

  const bmiResult = calculateBMI(profileHeight, profileWeight);
  const bmiCatBg   = !bmiResult ? '' : bmiResult.bmi < 18.5 ? 'bg-sky-100'   : bmiResult.bmi < 25 ? 'bg-green-100' : bmiResult.bmi < 30 ? 'bg-amber-100' : 'bg-rose-100';
  const bmiCatText = !bmiResult ? '' : bmiResult.bmi < 18.5 ? 'text-sky-700' : bmiResult.bmi < 25 ? 'text-green-700' : bmiResult.bmi < 30 ? 'text-amber-700' : 'text-rose-700';

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: '#F59E0B', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full opacity-[0.06]" style={{ background: '#86EFAC', filter: 'blur(55px)' }} />
        <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: '#FCD34D', filter: 'blur(50px)' }} />
      </div>

      <div className="w-full max-w-sm relative">

        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">{getTodayDate()}</p>
          <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, {firstName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Here&apos;s your health overview</p>
        </div>

        <div className="px-6 space-y-4 pb-28">

          {/* Health Score Card */}
          <div className="relative rounded-3xl p-5 overflow-hidden flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}>
            {/* Faded heart in background */}
            <svg className="absolute right-0 bottom-0 translate-x-6 translate-y-4 opacity-[0.12]" width="140" height="140" fill="none" viewBox="0 0 24 24">
              <path fill="#92400E" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Health Score</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-5xl font-bold text-gray-900">
                  {aiLoading ? '—' : healthScore ?? '—'}
                </span>
                <span className="text-base text-amber-800 mb-2 font-medium">/ 100</span>
              </div>
              <p className="text-xs text-amber-800 mt-1 font-medium">
                {aiLoading ? 'Calculating your score...' : "Based on today's activity"}
              </p>
            </div>
            {/* Ring chart */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#78350F" strokeWidth="3"
                  strokeDasharray={`${healthScore ?? 0} ${100 - (healthScore ?? 0)}`}
                  strokeLinecap="round"/>
              </svg>
              {aiLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Today's Calories */}
          <div className="relative rounded-3xl p-5 overflow-hidden bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            {/* Faded flame in background */}
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 opacity-[0.06]" width="100" height="100" fill="none" viewBox="0 0 24 24">
              <path fill="#86EFAC" d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-800">Today&apos;s Calories</p>
              <Link href="/log-meals">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-80" style={{ background: '#FDE68A' }}>
                  <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                </div>
              </Link>
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl font-bold text-gray-900">{totalCalories}</span>
              <span className="text-sm text-gray-400 mb-1 font-medium">/ {calorieGoal} cal</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="h-2 rounded-full transition-all" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #86EFAC, #4ADE80)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Consumed: {totalCalories} cal</span>
              <span className={remainingCalories >= 0 ? 'text-green-500' : 'text-rose-400'}>
                {remainingCalories >= 0 ? `Remaining: ${remainingCalories} cal` : `Over by: ${Math.abs(remainingCalories)} cal`}
              </span>
            </div>
            <div className={`mt-3 flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2 border ${calorieStatus.bg} ${calorieStatus.border}`}>
              <span className={`text-xs font-bold ${calorieStatus.color}`}>{calorieStatus.label}</span>
              <span className="text-xs text-gray-400">
                {calorieStatus.label === 'On Track'
                  ? '— right on target'
                  : calorieStatus.label === 'Deficit'
                  ? `— ${remainingCalories} cal under goal`
                  : `— ${Math.abs(remainingCalories)} cal over goal`}
              </span>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="relative rounded-3xl p-5 overflow-hidden bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            {/* Faded lightbulb in background */}
            <svg className="absolute right-3 bottom-2 opacity-[0.06]" width="90" height="90" fill="none" viewBox="0 0 24 24">
              <path fill="#86EFAC" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
            </svg>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#86EFAC' }}>
                <svg className="w-4 h-4 text-green-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C12 7 16 11 21 12C16 13 12 17 12 22C12 17 8 13 3 12C8 11 12 7 12 2Z"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-800">AI Recommendations</p>
              {aiLoading && <div className="ml-auto w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />}
            </div>
            {aiLoading ? (
              <p className="text-sm text-gray-400">Generating personalized recommendations...</p>
            ) : recommendations.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#86EFAC' }} />
                    {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Log some meals to get personalized recommendations.</p>
            )}
          </div>

          {/* BMI Card */}
          {bmiResult && (
            <div className="relative rounded-3xl p-5 overflow-hidden bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
              {/* Faded person icon in background */}
              <svg className="absolute right-3 bottom-2 opacity-[0.06]" width="90" height="90" viewBox="0 0 24 24" fill="none">
                <path fill="#F59E0B" d="M12 4a4 4 0 100 8 4 4 0 000-8zm-6 16v-2a6 6 0 0112 0v2H6z"/>
              </svg>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-800">Body Mass Index</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bmiCatBg} ${bmiCatText}`}>
                  {bmiResult.category}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">{bmiResult.bmi.toFixed(1)}</span>
                <span className="text-sm text-gray-400 mb-1">kg/m²</span>
              </div>
              {/* Range bar — segments proportional to BMI zones 15–40 */}
              <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-2">
                <div className="rounded-l-full" style={{ flex: 14, background: '#7DD3FC', opacity: bmiResult.bmi < 18.5 ? 1 : 0.3 }} />
                <div style={{ flex: 26, background: '#4ADE80', opacity: bmiResult.bmi >= 18.5 && bmiResult.bmi < 25 ? 1 : 0.3 }} />
                <div style={{ flex: 20, background: '#FCD34D', opacity: bmiResult.bmi >= 25 && bmiResult.bmi < 30 ? 1 : 0.3 }} />
                <div className="rounded-r-full" style={{ flex: 40, background: '#FDA4AF', opacity: bmiResult.bmi >= 30 ? 1 : 0.3 }} />
              </div>
              <div className="flex justify-between text-xs text-gray-300 mb-2.5">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
              </div>
              <p className="text-xs text-gray-400">Calculated from height (cm) and weight (kg) in your profile</p>
            </div>
          )}

          {/* Recent Meals */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Recent Meals</h2>

            {meals.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-3">No meals logged today yet.</p>
                <Link href="/log-meals">
                  <button className="font-bold px-6 py-2 rounded-full text-sm transition text-amber-800 hover:opacity-80" style={{ background: '#FDE68A' }}>
                    Log your first meal
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map((meal) => {
                  const style = getMealTypeStyle(meal.mealType);
                  return (
                    <div key={meal.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                          <svg className={`w-5 h-5 ${style.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{meal.foodName}</p>
                          <p className="text-xs text-gray-400">{meal.mealType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{meal.calories}</p>
                        <p className="text-xs text-gray-400">cal · {formatTime(meal.time)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        <BottomNav active="dashboard" />
      </div>
    </main>
  );
}
