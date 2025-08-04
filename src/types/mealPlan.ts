export interface MealPlan {
  id: string;
  created_at: string;
  day: string;
  meal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lactose: boolean; // true if contains lactose
  gluten: boolean; // true if contains gluten
} 