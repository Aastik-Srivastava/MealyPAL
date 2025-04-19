import { useEffect, useState } from 'react';
import { MealPlan } from '../types/mealPlan';
import { mealPlanService } from '../services/mealPlanService';

export const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const data = await mealPlanService.getAllMealPlans();
        setMealPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  if (loading) return <div className="text-center p-4">Loading meal plans...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (mealPlans.length === 0) return <div className="text-center p-4">No meal plans found</div>;

  // Get unique days for the filter
  const uniqueDays = Array.from(new Set(mealPlans.map(plan => plan.day)));

  // Filter meals by selected day
  const filteredMeals = selectedDay
    ? mealPlans.filter(plan => plan.day === selectedDay)
    : mealPlans;

  // Group meals by day
  const mealsByDay = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.day]) {
      acc[meal.day] = [];
    }
    acc[meal.day].push(meal);
    return acc;
  }, {} as Record<string, MealPlan[]>);

  return (
    <div className="space-y-4">
      {/* Day Filter */}
      <div className="flex gap-2 p-4">
        <button
          onClick={() => setSelectedDay('')}
          className={`px-4 py-2 rounded ${
            selectedDay === ''
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Days
        </button>
        {uniqueDays.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded ${
              selectedDay === day
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein (g)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbs (g)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fat (g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(mealsByDay).map(([day, meals]) => (
              meals.map((meal, index) => (
                <tr key={meal.id} className={index === 0 ? 'bg-gray-50' : ''}>
                  {index === 0 && (
                    <td rowSpan={meals.length} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{meal.meal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meal.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.calories}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.protein}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.carbs}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.fat}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 