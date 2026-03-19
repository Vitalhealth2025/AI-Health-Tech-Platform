'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import BottomNav from '@/components/BottomNav';
import { validateFoodName, validateNumber } from '@/lib/validation';

export default function LogMealsPage() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    time: '',
  });

  const mealTypes = [
    { name: 'Breakfast', emoji: '🍳' },
    { name: 'Lunch', emoji: '🥗' },
    { name: 'Dinner', emoji: '🍽️' },
    { name: 'Snack', emoji: '🍎' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      setUserId(user.uid);
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMeal = async () => {
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
      await addDoc(collection(db, 'users', userId, 'meals'), {
        foodName: formData.foodName.trim(),
        calories: Number(formData.calories),
        time: formData.time,
        mealType: selectedMeal,
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
      });

      // Reset form
      setFormData({ foodName: '', calories: '', time: '' });
      setSelectedMeal('Breakfast');
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving meal:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="bg-white px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Log Meal</h1>
          <p className="text-sm text-gray-400 mt-1">Track your food intake</p>
        </div>

        <div className="px-6 mt-4 space-y-6 pb-24">

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl p-3">
              ✅ Meal saved successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

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
                value={formData.foodName}
                onChange={(e) => handleChange('foodName', e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Calories */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Calories</label>
              <input
                type="number"
                placeholder="e.g., 450"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
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
          <button
            onClick={handleSaveMeal}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-full transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </button>

        </div>

        <BottomNav active="meals" />

      </div>
    </main>
  );
}