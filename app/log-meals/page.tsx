'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/auth';
import { addMeal, getWaterIntake, saveWaterIntake } from '@/lib/storage';
import BottomNav from '@/components/BottomNav';
import { validateFoodName, validateNumber } from '@/lib/validation';

interface Suggestion {
  name: string;
  calories: number;
  instructions: string;
}

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

const getMealIcon = (meal: string) => {
  switch (meal) {
    case 'Breakfast':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      );
    case 'Lunch':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 10c0 4.418 3.582 8 8 8s8-3.582 8-8M12 18v2m-3 0h6"/>
        </svg>
      );
    case 'Dinner':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      );
    case 'Snack':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c-3 0-5 2.5-5 5.5C7 15 9.5 18 12 18s5-3 5-6.5C17 8.5 15 6 12 6z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c0 0 1-1.5 2.5-1"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function LogMealsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'suggest'>('manual');
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ foodName: '', calories: '', time: '' });

  const [ingredients, setIngredients] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) { router.push('/'); return; }
      setUserId(user.uid);
      const today = new Date().toISOString().split('T')[0];
      setTodayDate(today);
      setWaterGlasses(getWaterIntake(user.uid, today));
    });
    return () => unsubscribe();
  }, [router]);

  const handleWaterTap = (index: number) => {
    const next = index < waterGlasses ? index : index + 1;
    setWaterGlasses(next);
    if (userId && todayDate) saveWaterIntake(userId, todayDate, next);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMeal = () => {
    setError('');
    setSuccess(false);

    if (!formData.foodName || !formData.calories || !formData.time) {
      setError('Please fill in all fields.');
      return;
    }

    const foodNameError = validateFoodName(formData.foodName);
    if (foodNameError) { setError(foodNameError); return; }

    const calorieError = validateNumber(formData.calories, 1, 10000, 'Calories');
    if (calorieError) { setError(calorieError); return; }

    setLoading(true);
    try {
      addMeal(userId, {
        foodName: formData.foodName.trim(),
        calories: Number(formData.calories),
        time: formData.time,
        mealType: selectedMeal as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack',
        date: new Date().toISOString().split('T')[0],
      });
      setFormData({ foodName: '', calories: '', time: '' });
      setSelectedMeal('Breakfast');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving meal:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setSuggestError('');
    setSuggestions([]);

    if (!ingredients.trim()) {
      setSuggestError('Please enter at least one ingredient.');
      return;
    }

    setSuggestLoading(true);
    try {
      const res = await fetch('/api/meal-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, mealType: selectedMeal }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestion error:', err);
      setSuggestError('Could not generate suggestions. Please try again.');
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion: Suggestion) => {
    setFormData({ foodName: suggestion.name, calories: String(suggestion.calories), time: '' });
    setSuggestions([]);
    setIngredients('');
    setActiveTab('manual');
  };

  const inputClass = "w-full rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 border border-gray-100 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

  return (
    <main className="min-h-screen flex justify-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.07]" style={{ background: '#FCD34D', filter: 'blur(55px)' }} />
        <div className="absolute bottom-40 -right-12 w-56 h-56 rounded-full opacity-[0.06]" style={{ background: '#86EFAC', filter: 'blur(50px)' }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-[0.04]" style={{ background: '#F59E0B', filter: 'blur(45px)' }} />
      </div>

      <div className="w-full max-w-sm relative">

        {/* Header */}
        <div className="px-6 pt-10 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Log Meal</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your food intake</p>
        </div>

        {/* Tab Toggle */}
        <div className="px-6">
          <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('suggest')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'suggest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              AI Suggest
            </button>
          </div>
        </div>

        {/* Meal Type Selector — shared between both tabs */}
        <div className="px-6 mt-4">
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-bold text-gray-800 mb-3">Meal Type</p>
            <div className="grid grid-cols-2 gap-3">
              {mealTypes.map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-sm font-semibold transition ${
                    selectedMeal === meal
                      ? 'border-amber-300 text-amber-800'
                      : 'bg-white/60 border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                  style={selectedMeal === meal ? { background: '#FDE68A' } : {}}
                >
                  {getMealIcon(meal)}
                  {meal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Water Intake */}
        <div className="px-6 mt-4">
          <div className="relative rounded-3xl p-5 overflow-hidden bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <svg className="absolute right-3 bottom-2 opacity-[0.06]" width="90" height="90" viewBox="0 0 24 24" fill="none">
              <path fill="#38BDF8" d="M12 2C6 10 4 14 4 16a8 8 0 0016 0c0-2-2-6-8-14z"/>
            </svg>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E0F2FE' }}>
                  <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6 10 4 14 4 16a8 8 0 0016 0c0-2-2-6-8-14z"/>
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-800">Water Intake</p>
              </div>
              <span className="text-sm font-bold text-sky-600">{waterGlasses} / 8 glasses</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleWaterTap(i)}
                  className="flex flex-col items-center gap-1"
                  aria-label={`${i < waterGlasses ? 'Remove' : 'Add'} glass ${i + 1}`}
                >
                  <svg viewBox="0 0 24 32" className="w-8 h-10 transition-all" fill="none">
                    <path d="M4 4 L6 30 Q6 31 7 31 L17 31 Q18 31 18 30 L20 4 Z"
                      stroke={i < waterGlasses ? '#38BDF8' : '#D1D5DB'}
                      strokeWidth="1.75" strokeLinejoin="round"
                      fill={i < waterGlasses ? '#E0F2FE' : 'none'}
                    />
                    {i < waterGlasses && (
                      <path d="M6.5 16 L7.5 30 Q7.5 30.5 8 30.5 L16 30.5 Q16.5 30.5 16.5 30 L17.5 16 Z"
                        fill="#38BDF8" opacity="0.6"
                      />
                    )}
                  </svg>
                  <span className={`text-xs font-medium ${i < waterGlasses ? 'text-sky-500' : 'text-gray-300'}`}>{i + 1}</span>
                </button>
              ))}
            </div>
            {waterGlasses === 8 && (
              <div className="flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2 bg-sky-50 border border-sky-200">
                <svg className="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-xs font-bold text-sky-700">Daily goal reached</span>
              </div>
            )}
          </div>
        </div>

        {/* ── MANUAL ENTRY TAB ── */}
        {activeTab === 'manual' && (
          <div className="px-6 mt-4 space-y-4 pb-28">

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Meal logged successfully
              </div>
            )}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Food Details */}
            <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
              <p className="text-sm font-bold text-gray-800 mb-4">Food Details</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Food Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Grilled Chicken Salad"
                    value={formData.foodName}
                    onChange={(e) => handleChange('foodName', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Calories</label>
                  <input
                    type="number"
                    placeholder="e.g., 450"
                    value={formData.calories}
                    onChange={(e) => handleChange('calories', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveMeal}
              disabled={loading}
              className="w-full font-bold py-4 rounded-full transition disabled:opacity-50 text-amber-900 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}
            >
              {loading ? 'Saving...' : 'Save Meal'}
            </button>
          </div>
        )}

        {/* ── AI SUGGEST TAB ── */}
        {activeTab === 'suggest' && (
          <div className="px-6 mt-4 space-y-4 pb-28">

            {/* Ingredients Input */}
            <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
              <p className="text-sm font-bold text-gray-800 mb-1">What&apos;s in your fridge?</p>
              <p className="text-xs text-gray-400 mb-3">List the ingredients you have available</p>
              <textarea
                rows={3}
                placeholder="e.g., chicken breast, rice, broccoli, garlic, olive oil"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className={`${inputClass} resize-none`}
              />
              {suggestError && (
                <p className="text-xs text-rose-500 mt-2">{suggestError}</p>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={suggestLoading}
              className="w-full font-bold py-4 rounded-full transition disabled:opacity-50 flex items-center justify-center gap-2 text-amber-900 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              {suggestLoading ? 'Generating ideas...' : 'Generate Meal Ideas'}
            </button>

            {/* Suggestion Cards */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-800">Suggested for you</p>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-bold text-gray-800">{suggestion.name}</h3>
                      <span className="text-sm font-bold text-green-600 whitespace-nowrap">~{suggestion.calories} cal</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">{suggestion.instructions}</p>
                    <button
                      onClick={() => handleUseSuggestion(suggestion)}
                      className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2.5 rounded-2xl transition"
                    >
                      Use This Meal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <BottomNav active="meals" />
      </div>
    </main>
  );
}
