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
          <Card key={type}>
            <CardHeader>
              <CardTitle className="capitalize">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div
                    key={`${type}-${meal.item}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{meal.item}</p>
                      <p className="text-sm text-gray-500">
                        {meal.calories} cal • {meal.protein}g protein
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddMeal(meal)}
                      className="h-8 w-8"
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
      <Card>
        <CardHeader>
          <CardTitle>Selected Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Meals List */}
            <div className="space-y-2">
              {selectedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{meal.item}</p>
                    <p className="text-sm text-gray-500">
                      {meal.calories} cal • {meal.protein}g protein
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMeal(meal.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Nutrition Summary */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="font-medium">{nutritionTotals.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="font-medium">{nutritionTotals.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="font-medium">{nutritionTotals.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="font-medium">{nutritionTotals.fat}g</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 