import { Meal, UserProfile } from './types';

const profileKey = (uid: string) => `hsai_profile_${uid}`;
const mealsKey = (uid: string) => `hsai_meals_${uid}`;

export function getUserProfile(uid: string): Partial<UserProfile> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(profileKey(uid)) || '{}');
  } catch {
    return {};
  }
}

export function saveUserProfile(uid: string, data: Partial<UserProfile>): void {
  const existing = getUserProfile(uid);
  localStorage.setItem(profileKey(uid), JSON.stringify({ ...existing, ...data }));
}

export function getMealsByDate(uid: string, date: string): Meal[] {
  if (typeof window === 'undefined') return [];
  try {
    const all: Meal[] = JSON.parse(localStorage.getItem(mealsKey(uid)) || '[]');
    return all
      .filter((m) => m.date === date)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  } catch {
    return [];
  }
}

const waterKey = (uid: string, date: string) => `hsai_water_${uid}_${date}`;

export function getWaterIntake(uid: string, date: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = parseInt(localStorage.getItem(waterKey(uid, date)) || '0', 10);
    return isNaN(val) ? 0 : Math.min(Math.max(val, 0), 8);
  } catch {
    return 0;
  }
}

export function saveWaterIntake(uid: string, date: string, glasses: number): void {
  localStorage.setItem(waterKey(uid, date), String(Math.min(Math.max(glasses, 0), 8)));
}

export function addMeal(uid: string, meal: Omit<Meal, 'id'>): Meal {
  const newMeal: Meal = {
    ...meal,
    id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  };
  try {
    const all: Meal[] = JSON.parse(localStorage.getItem(mealsKey(uid)) || '[]');
    all.push(newMeal);
    localStorage.setItem(mealsKey(uid), JSON.stringify(all));
  } catch {
    // ignore write errors
  }
  return newMeal;
}
