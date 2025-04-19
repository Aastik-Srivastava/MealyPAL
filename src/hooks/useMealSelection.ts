import { useState, useCallback } from 'react';

interface SelectedMeal {
  id: string;
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function useMealSelection() {
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);
  const [nutritionTotals, setNutritionTotals] = useState<NutritionTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const addMeal = useCallback((meal: SelectedMeal) => {
    setSelectedMeals(prev => {
      const newMeals = [...prev, meal];
      updateNutritionTotals(newMeals);
      return newMeals;
    });
  }, []);

  const removeMeal = useCallback((mealId: string) => {
    setSelectedMeals(prev => {
      const newMeals = prev.filter(meal => meal.id !== mealId);
      updateNutritionTotals(newMeals);
      return newMeals;
    });
  }, []);

  const updateNutritionTotals = useCallback((meals: SelectedMeal[]) => {
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setNutritionTotals(totals);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMeals([]);
    setNutritionTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, []);

  return {
    selectedMeals,
    nutritionTotals,
    addMeal,
    removeMeal,
    clearSelection
  };
} 