import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle } from 'lucide-react';

interface MealPlan {
  id?: string;
  user_id: string;
  day: string;
  meal: string;
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MealPlanner() {
  const [formData, setFormData] = useState<MealPlan>({
    user_id: '',
    day: new Date().toISOString().split('T')[0],
    meal: 'breakfast',
    item: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calories' || name === 'protein' || name === 'carbs' || name === 'fat'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const mealPlan = {
        ...formData,
        user_id: user.id
      };

      const { error } = await supabase
        .from('meal_plans')
        .insert(mealPlan);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F9EE] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-900">
            Add a Meal Plan
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="day" className="sr-only">Date</label>
              <input
                id="day"
                name="day"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                value={formData.day}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="meal" className="sr-only">Meal Type</label>
              <select
                id="meal"
                name="meal"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                value={formData.meal}
                onChange={handleChange}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label htmlFor="item" className="sr-only">Item Name</label>
              <input
                id="item"
                name="item"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Item Name"
                value={formData.item}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="calories" className="sr-only">Calories</label>
              <input
                id="calories"
                name="calories"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Calories"
                value={formData.calories}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="protein" className="sr-only">Protein (g)</label>
              <input
                id="protein"
                name="protein"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Protein (g)"
                value={formData.protein}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="carbs" className="sr-only">Carbs (g)</label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Carbs (g)"
                value={formData.carbs}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fat" className="sr-only">Fat (g)</label>
              <input
                id="fat"
                name="fat"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Fat (g)"
                value={formData.fat}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Add Meal Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 