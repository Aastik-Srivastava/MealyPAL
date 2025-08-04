export interface User {
  id: string
  email: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  weight: number // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  fitnessGoal: 'bulk' | 'cut' | 'maintain'
  bmr?: number // Basal Metabolic Rate
}

export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  lactose: boolean // true if contains lactose
  gluten: boolean // true if contains gluten
}

export interface Meal {
  id: string
  userId: string
  name: string
  type: 'breakfast' | 'lunch' | 'evening_snacks' | 'dinner'
  date: string
  foodItems: FoodItem[]
}

export interface WeeklyMealPlan {
  id: string
  userId: string
  startDate: string
  endDate: string
  meals: Meal[]
}

export interface UserProfile {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  bmr: number;
  tdee: number;
  created_at: string;
  updated_at: string;
}

export type GoalType = 'weight_loss' | 'muscle_gain' | 'maintenance';

export interface UserGoals {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_weight?: number;
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fat?: number;
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  day: string;
  meal: string;
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lactose: boolean; // true if contains lactose
  gluten: boolean; // true if contains gluten
  created_at: string;
  updated_at: string;
}

export interface MealSuggestion {
  id: string;
  user_id: string;
  meal_id: string;
  suggestion: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  error: string | null;
} 