export interface Meal {
  id: string;
  foodName: string;
  calories: number;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string;
  createdAt?: unknown;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  healthGoal: string;
  calorieGoal: string;
}
