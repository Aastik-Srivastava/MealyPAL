import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMealSelection } from '@/hooks/useMealSelection';
import { MealPlan } from '@/types/meal';

interface MealSelectionProps {
  mealPlans: MealPlan[];
}

export function MealSelection({ mealPlans }: MealSelectionProps) {
  const { selectedMeals, nutritionTotals, addMeal, removeMeal } = useMealSelection();

  // Group meals by type
  const mealsByType = mealPlans.reduce((acc, meal) => {
    const type = meal.meal.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, MealPlan[]>);

  const handleAddMeal = (meal: MealPlan) => {
    addMeal({
      id: `${meal.meal}-${meal.item}`,
      item: meal.item,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat
    });
  };

  const handleRemoveMeal = (mealId: string) => {
    removeMeal(mealId);
  };

  return (
    <div className="space-y-6">
      {/* Meal Selection */}
      <div className="grid gap-4">
        {Object.entries(mealsByType).map(([type, meals]) => (
          <Card key={type} className="bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-gray-300">
            <CardHeader>
              <CardTitle className="capitalize text-white font-display tracking-tight">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div
                    key={`${type}-${meal.item}`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-medium text-white">{meal.item}</p>
                      <p className="text-sm text-gray-400">
                        {meal.calories} cal • {meal.protein}g protein
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddMeal(meal)}
                      className="h-8 w-8 text-[#A8FFBA] hover:bg-[#A8FFBA]/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Meals and Nutrition Summary */}
      <Card className="bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-gray-300">
        <CardHeader>
          <CardTitle className="text-white font-display tracking-tight">Selected Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Meals List */}
            <div className="space-y-2">
              {selectedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5"
                >
                  <div>
                    <p className="font-medium text-white">{meal.item}</p>
                    <p className="text-sm text-gray-400">
                      {meal.calories} cal • {meal.protein}g protein
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMeal(meal.id)}
                    className="h-8 w-8 text-[#A8FFBA] hover:bg-[#A8FFBA]/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Nutrition Summary */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-sm text-gray-400">Calories</p>
                <p className="font-medium text-white">{nutritionTotals.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Protein</p>
                <p className="font-medium text-white">{nutritionTotals.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Carbs</p>
                <p className="font-medium text-white">{nutritionTotals.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Fat</p>
                <p className="font-medium text-white">{nutritionTotals.fat}g</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 