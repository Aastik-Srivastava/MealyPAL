import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle, Calendar, Utensils, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';
import { MealSelection } from './MealSelection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMealSelection } from '@/hooks/useMealSelection';

interface UserProfile {
  bmr: number;
  tdee: number;
  weight: number;
  height: number;
  activity_level: string;
  age: number;
  gender: string;
}

interface MealPlan {
  id: string;
  user_id: string | null;
  day: string;
  meal: string;
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  updated_at: string;
}

interface FetchError {
  type: 'profile' | 'meals';
  message: string;
}

interface MealRecommendation {
  portions: string[];
  modifications: string[];
  tips: string[];
  mealSpecific: {
    breakfast: string[];
    lunch: string[];
    snack: string[];
    dinner: string[];
  };
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

type FitnessGoal = 'bulk' | 'cut' | 'maintain';

const MEAL_TIMES = {
  breakfast: { start: '07:00', end: '09:30', label: 'Breakfast' },
  lunch: { start: '11:45', end: '14:15', label: 'Lunch' },
  snack: { start: '16:30', end: '18:00', label: 'Evening Snacks' },
  dinner: { start: '19:00', end: '21:30', label: 'Dinner' }
};

const getCurrentOrUpcomingMeal = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
  
  console.log('Current time:', currentTime);

  // First check if we're currently in a meal time
  for (const [type, time] of Object.entries(MEAL_TIMES)) {
    if (currentTime >= time.start && currentTime <= time.end) {
      console.log('Current meal time:', time.label);
      return { label: time.label, type: 'current' };
    }
  }

  // If not in a meal time, find the next upcoming meal
  let nextMeal = null;
  for (const [type, time] of Object.entries(MEAL_TIMES)) {
    if (currentTime < time.start) {
      if (!nextMeal || time.start < MEAL_TIMES[nextMeal].start) {
        nextMeal = type;
      }
    }
  }

  // If no upcoming meal today, return breakfast for tomorrow
  if (!nextMeal) {
    console.log('No more meals today, next meal is breakfast tomorrow');
    return { label: MEAL_TIMES.breakfast.label, type: 'upcoming', tomorrow: true };
  }

  console.log('Next meal:', MEAL_TIMES[nextMeal].label);
  return { label: MEAL_TIMES[nextMeal].label, type: 'upcoming', tomorrow: false };
};

const GOAL_CALORIES_MODIFIER = {
  bulk: 1.2, // 20% surplus
  cut: 0.8,  // 20% deficit
  maintain: 1
};

const GOAL_DESCRIPTIONS = {
  bulk: 'Build muscle mass with a caloric surplus',
  cut: 'Lose fat while preserving muscle',
  maintain: 'Maintain current weight and body composition'
};

const calculateMacros = (tdee: number, goal: FitnessGoal, weight: number) => {
  const adjustedCalories = Math.round(tdee * GOAL_CALORIES_MODIFIER[goal]);
  const proteinMultiplier = goal === 'cut' ? 2.2 : goal === 'bulk' ? 2.0 : 1.8; // g/kg
  const protein = Math.round(weight * proteinMultiplier);
  const fat = Math.round((adjustedCalories * 0.25) / 9); // 25% calories from fat
  const carbs = Math.round((adjustedCalories - (protein * 4) - (fat * 9)) / 4);

  return {
    calories: adjustedCalories,
    protein,
    carbs,
    fat
  };
};

export function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refresh: refreshProfile } = useUserProfile();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllMeals, setShowAllMeals] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FetchError[]>([]);
  const navigate = useNavigate();
  const [currentMealInfo, setCurrentMealInfo] = useState(() => getCurrentOrUpcomingMeal());
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>('maintain');
  const [recommendations, setRecommendations] = useState<MealRecommendation | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<Array<{ id: string; item: string }>>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const { addMeal, removeMeal } = useMealSelection();

  const handleAddMeal = (meal: MealPlan) => {
    setSelectedMeals(prev => [...prev, { id: meal.id, item: meal.item }]);
    setTotalCalories(prev => prev + meal.calories);
    setTotalProtein(prev => prev + meal.protein);
  };

  const handleRemoveMeal = (mealId: string, calories: number, protein: number) => {
    setSelectedMeals(prev => prev.filter(meal => meal.id !== mealId));
    setTotalCalories(prev => prev - calories);
    setTotalProtein(prev => prev - protein);
  };

  const updateDefaultMealPlans = async () => {
    try {
      console.log('Dashboard: Updating default meal plans for user:', user?.id);
      
      // First, fetch the default meal plans
      const { data: defaultPlans, error: fetchError } = await supabase
        .from('meal_plans')
        .select('*')
        .is('user_id', null);

      if (fetchError) {
        throw fetchError;
      }

      if (!defaultPlans || defaultPlans.length === 0) {
        console.log('Dashboard: No default meal plans found');
        return;
      }

      // Create new meal plans for the user based on default plans
      const newPlans = defaultPlans.map(plan => ({
        ...plan,
        user_id: user?.id,
        id: undefined // Let the database generate a new ID
      }));

      // Insert the new plans
      const { error: insertError } = await supabase
        .from('meal_plans')
        .insert(newPlans);

      if (insertError) {
        throw insertError;
      }

      console.log('Dashboard: Successfully created user-specific meal plans');
      // Refresh the meal plans after update
      fetchMealPlans();
    } catch (error: any) {
      console.error('Dashboard: Error updating default meal plans:', error);
      setErrors(prev => [...prev, { type: 'meals', message: error.message }]);
    }
  };

  const createDefaultMealPlans = async () => {
    console.log('=== CREATING DEFAULT MEAL PLANS ===');
    const defaultMeals = [
      // Saturday
      { 
        id: crypto.randomUUID(),
        user_id: null,
        day: 'Saturday', 
        meal: 'breakfast', 
        item: 'Oatmeal with Berries', 
        calories: 300, 
        protein: 10, 
        carbs: 45, 
        fat: 8 
      },
      { 
        id: crypto.randomUUID(),
        user_id: null,
        day: 'Saturday', 
        meal: 'lunch', 
        item: 'Grilled Chicken Salad', 
        calories: 450, 
        protein: 35, 
        carbs: 25, 
        fat: 20 
      },
      { 
        id: crypto.randomUUID(),
        user_id: null,
        day: 'Saturday', 
        meal: 'snack', 
        item: 'Greek Yogurt with Nuts', 
        calories: 200, 
        protein: 15, 
        carbs: 10, 
        fat: 12 
      },
      { 
        id: crypto.randomUUID(),
        user_id: null,
        day: 'Saturday', 
        meal: 'dinner', 
        item: 'Salmon with Quinoa', 
        calories: 550, 
        protein: 40, 
        carbs: 35, 
        fat: 25 
      }
    ];

    try {
      // First, check if default meals already exist
      const { data: existingDefaults, error: checkError } = await supabase
        .from('meal_plans')
        .select('*')
        .is('user_id', null);

      if (checkError) throw checkError;

      if (!existingDefaults || existingDefaults.length === 0) {
        console.log('No default meals found, creating them...');
        const { error: insertError } = await supabase
          .from('meal_plans')
          .insert(defaultMeals);

        if (insertError) throw insertError;
        console.log('Successfully created default meal plans');
        return true;
      } else {
        console.log('Default meals already exist:', existingDefaults);
        return false;
      }
    } catch (error) {
      console.error('Error creating default meal plans:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (authLoading) {
      console.log('Dashboard: Still loading auth...');
      return;
    }

    if (!user) {
      console.log('Dashboard: No user found, redirecting to sign in');
      navigate('/sign-in');
      return;
    }

    const fetchMealPlans = async () => {
      try {
        console.log('=== MEAL PLAN FETCH START ===');
        console.log('User ID:', user.id);
        setLoading(true);
        
        // First check if user has any meal plans
        console.log('Checking for existing user meal plans...');
        const { data: userPlans, error: userPlansError } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('user_id', user.id);

        console.log('User plans query result:', { userPlans, userPlansError });

        if (userPlansError) throw userPlansError;

        if (!userPlans || userPlans.length === 0) {
          console.log('No user plans found, checking default plans...');
          
          // First ensure default plans exist
          await createDefaultMealPlans();
          
          // Fetch default meal plans
          const { data: defaultPlans, error: defaultPlansError } = await supabase
            .from('meal_plans')
            .select('*')
            .is('user_id', null);

          console.log('Default plans query result:', { defaultPlans, defaultPlansError });

          if (defaultPlansError) throw defaultPlansError;

          if (defaultPlans && defaultPlans.length > 0) {
            console.log('Found default plans:', defaultPlans);
            // Create new plans for the user
            const newPlans = defaultPlans.map(plan => ({
              id: crypto.randomUUID(),
              user_id: user.id,
              day: plan.day,
              meal: plan.meal,
              item: plan.item,
              calories: plan.calories,
              protein: plan.protein,
              carbs: plan.carbs,
              fat: plan.fat,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));

            console.log('Prepared new plans:', newPlans);

            // Insert the new plans
            const { error: insertError } = await supabase
              .from('meal_plans')
              .insert(newPlans);

            console.log('Insert result:', { insertError });

            if (insertError) throw insertError;

            // Fetch the newly created plans
            console.log('Fetching newly created plans...');
            const { data: freshPlans, error: freshPlansError } = await supabase
              .from('meal_plans')
              .select('*')
              .eq('user_id', user.id)
              .order('day', { ascending: true });

            console.log('Fresh plans query result:', { freshPlans, freshPlansError });

            if (freshPlansError) throw freshPlansError;
            
            console.log('Setting fresh plans:', freshPlans);
            setMealPlans(freshPlans || []);
          } else {
            console.log('No default plans found in database');
            setMealPlans([]);
          }
        } else {
          console.log('Found existing user plans:', userPlans);
          setMealPlans(userPlans);
        }

        setErrors(prev => prev.filter(e => e.type !== 'meals'));
        console.log('=== MEAL PLAN FETCH COMPLETE ===');
      } catch (error: any) {
        console.error('=== MEAL PLAN FETCH ERROR ===');
        console.error('Error details:', error);
        setErrors(prev => [...prev, { type: 'meals', message: error.message }]);
        setMealPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profileError) {
      console.error('Dashboard: Profile error:', profileError);
      setErrors(prev => {
        const filtered = prev.filter(e => e.type !== 'profile');
        return [...filtered, { type: 'profile', message: profileError }];
      });
    } else {
      setErrors(prev => prev.filter(e => e.type !== 'profile'));
    }
  }, [profileError]);

  // Update current/upcoming meal every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMealInfo(getCurrentOrUpcomingMeal());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getMealsForDate = (date: Date): MealPlan[] => {
    if (!mealPlans) return [];
    
    const dayName = format(date, 'EEEE');
    console.log('🔍 Checking meals for:', dayName);
    console.log('📅 All meal plans:', mealPlans.length);
    
    const filteredMeals = mealPlans.filter(meal => {
      const mealDay = meal.day.trim().toLowerCase();
      const targetDay = dayName.toLowerCase();
      const matches = mealDay === targetDay;
      
      if (matches) {
        console.log('✅ MATCHING MEAL:', {
          day: mealDay,
          meal: meal.meal,
          item: meal.item
        });
      }
      
      return matches;
    });
    
    console.log('✨ Found meals for date:', filteredMeals.length);
    return filteredMeals;
  };

  const getMealsByType = (meals: MealPlan[]) => {
    console.log('🍽️ Sorting meals by type. Total meals:', meals.length);
    
    const grouped = {
      breakfast: meals.filter(meal => meal.meal.toLowerCase() === 'breakfast'),
      lunch: meals.filter(meal => meal.meal.toLowerCase() === 'lunch'),
      snack: meals.filter(meal => {
        const mealType = meal.meal.toLowerCase();
        return mealType === 'snack' || mealType === 'snacks';
      }),
      dinner: meals.filter(meal => meal.meal.toLowerCase() === 'dinner')
    };
    
    // Log each meal for debugging
    console.log('🍳 Breakfast items:', grouped.breakfast.map(m => m.item));
    console.log('🥪 Lunch items:', grouped.lunch.map(m => m.item));
    console.log('🍎 Snack items:', grouped.snack.map(m => m.item));
    console.log('🍽️ Dinner items:', grouped.dinner.map(m => m.item));
    
    console.log('✨ Grouped meals count:', {
      breakfast: grouped.breakfast.length,
      lunch: grouped.lunch.length,
      snack: grouped.snack.length,
      dinner: grouped.dinner.length
    });
    
    return grouped;
  };

  const handleUpdateHealthMetrics = () => {
    console.log('Dashboard: Navigating to BMR calculator with current values');
    navigate('/bmr-calculator', {
      state: {
        preFilledData: {
          age: profile?.age,
          gender: profile?.gender,
          height: profile?.height,
          weight: profile?.weight,
          activity_level: profile?.activity_level
        }
      }
    });
  };

  // Debug logging for meal filtering
  useEffect(() => {
    console.log('=== MEAL FILTERING DEBUG ===');
    console.log('Selected date:', format(selectedDate, 'EEEE'));
    console.log('All meal plans:', mealPlans);
    const currentDayMeals = getMealsForDate(selectedDate);
    console.log('Filtered meals for current day:', currentDayMeals);
    
    // Log meal types distribution
    const mealsByType = getMealsByType(currentDayMeals);
    console.log('Meals by type:', {
      breakfast: mealsByType.breakfast.length,
      lunch: mealsByType.lunch.length,
      snack: mealsByType.snack.length,
      dinner: mealsByType.dinner.length
    });
  }, [selectedDate, mealPlans]);

  const generateRecommendations = () => {
    if (!profile) return;

    console.log('🚀 GENERATING RECOMMENDATIONS');
    const macros = calculateMacros(profile.tdee, selectedGoal, profile.weight);

    console.log('📊 MACROS:', macros);

    // Get recommended meals for each meal type
    const getRecommendedMeals = (mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
      switch (mealType) {
        case 'breakfast':
          return [
            'Oatmeal with berries and nuts',
            'Greek yogurt with honey and granola',
            'Scrambled eggs with whole wheat toast',
            'Smoothie with protein powder and fruits',
            'Avocado toast with poached eggs'
          ];
        case 'lunch':
          return [
            'Grilled chicken salad with olive oil',
            'Quinoa bowl with roasted vegetables',
            'Brown rice with stir-fried vegetables',
            'Whole wheat wrap with lean protein',
            'Lentil soup with whole grain bread'
          ];
        case 'snack':
          return [
            'Mixed nuts and dried fruits',
            'Protein shake with banana',
            'Greek yogurt with berries',
            'Hard-boiled eggs',
            'Hummus with vegetable sticks'
          ];
        case 'dinner':
          return [
            'Grilled salmon with sweet potato',
            'Lean beef with roasted vegetables',
            'Tofu stir-fry with brown rice',
            'Baked chicken with quinoa',
            'Vegetable curry with whole grain naan'
          ];
      }
    };

    const recommendations: MealRecommendation = {
      portions: [
        `Total daily calories: ${macros.calories} kcal`,
        `Protein: ${macros.protein}g (${Math.round(macros.protein * 4)} kcal)`,
        `Carbs: ${macros.carbs}g (${Math.round(macros.carbs * 4)} kcal)`,
        `Fat: ${macros.fat}g (${Math.round(macros.fat * 9)} kcal)`
      ],
      modifications: getModificationsForGoal(selectedGoal),
      tips: getTipsForGoal(selectedGoal),
      mealSpecific: {
        breakfast: getRecommendedMeals('breakfast'),
        lunch: getRecommendedMeals('lunch'),
        snack: getRecommendedMeals('snack'),
        dinner: getRecommendedMeals('dinner')
      },
      macros
    };

    console.log('✅ FINAL RECOMMENDATIONS:', recommendations);
    setRecommendations(recommendations);
  };

  const getModificationsForGoal = (goal: FitnessGoal) => {
    switch (goal) {
      case 'bulk':
        return [
          'Consider larger portions of available meals',
          'Add extra protein sources when available',
          'Include healthy fats like nuts or avocado',
          'Choose calorie-dense options from the menu'
        ];
      case 'cut':
        return [
          'Choose smaller portions of available meals',
          'Focus on lean protein options',
          'Minimize added fats and oils',
          'Add extra vegetables when possible'
        ];
      default:
        return [
          'Maintain balanced portions',
          'Mix protein sources throughout the day',
          'Include a variety of vegetables',
          'Balance meals between protein, carbs, and fats'
        ];
    }
  };

  const getTipsForGoal = (goal: FitnessGoal) => {
    switch (goal) {
      case 'bulk':
        return [
          'Eat every 2-3 hours',
          'Choose higher calorie options when available',
          'Combine protein sources in meals',
          'Focus on post-workout nutrition'
        ];
      case 'cut':
        return [
          'Stay hydrated throughout the day',
          'Choose protein-rich, lower calorie options',
          'Time carbs around workouts',
          'Focus on fiber-rich foods'
        ];
      default:
        return [
          'Maintain consistent meal timing',
          'Balance your plate with all macronutrients',
          'Listen to hunger cues',
          'Stay consistent with portions'
        ];
    }
  };

  // Generate recommendations when goal, profile, or selected date changes
  useEffect(() => {
    generateRecommendations();
  }, [selectedGoal, profile, selectedDate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#51B73B] mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md w-full" role="alert">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Error loading dashboard</span>
          </div>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">
                {error.message}
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-200 text-red-700 py-2 px-4 rounded hover:bg-red-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No profile data found</h2>
          <p className="mt-2 text-gray-600">Please complete your BMR calculation</p>
          <button
            onClick={() => navigate('/bmr-calculator')}
            className="mt-4 bg-[#51B73B] text-white py-2 px-4 rounded hover:bg-[#3F8F2F] transition-colors"
          >
            Go to BMR Calculator
          </button>
        </div>
      </div>
    );
  }

  const todayMeals = getMealsForDate(selectedDate);
  const mealsByType = getMealsByType(todayMeals);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header with Nutrition Summary */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-8">
              {/* Nutrition Summary */}
              <div className="flex gap-6 items-center border-r pr-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Selected Items</p>
                  <p className="text-2xl font-bold text-[#51B73B]">{selectedMeals.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Calories</p>
                  <p className="text-2xl font-bold text-[#51B73B]">{totalCalories}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Protein</p>
                  <p className="text-2xl font-bold text-[#51B73B]">{totalProtein}g</p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Selected Items List */}
          {selectedMeals.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="flex flex-wrap gap-2">
                {selectedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1"
                  >
                    <span className="text-sm font-medium">{meal.item}</span>
                    <button
                      onClick={() => {
                        const mealPlan = mealPlans.find(m => m.id === meal.id);
                        if (mealPlan) {
                          handleRemoveMeal(meal.id, mealPlan.calories, mealPlan.protein);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Health Metrics</h2>
            <button
              onClick={handleUpdateHealthMetrics}
              className="text-sm text-[#51B73B] hover:text-[#3F8F2F] font-medium"
            >
              Update Metrics
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* BMR Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Basal Metabolic Rate (BMR)</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#51B73B]">{Math.round(profile.bmr)} kcal</dd>
                <p className="mt-2 text-sm text-gray-500">Your body's energy needs at rest</p>
              </div>
            </div>

            {/* TDEE Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Daily Energy Expenditure (TDEE)</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#51B73B]">{Math.round(profile.tdee)} kcal</dd>
                <p className="mt-2 text-sm text-gray-500">Daily calories needed based on activity level</p>
              </div>
            </div>

            {/* Activity Level Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Activity Level</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#51B73B] capitalize">{profile.activity_level}</dd>
                <p className="mt-2 text-sm text-gray-500">Your current activity level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <div className="mt-4 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.age} years</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{profile.gender}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Height</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.height} cm</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.weight} kg</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium">{format(selectedDate, 'MMMM yyyy')}</span>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - date.getDay() + i);
                const dayName = format(date, 'EEEE');
                const hasMeals = mealPlans.some(meal => meal.day.toLowerCase() === dayName.toLowerCase());
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 text-center rounded-full ${
                      isToday(date) ? 'bg-[#51B73B] text-white' : ''
                    } ${hasMeals ? 'border-2 border-[#51B73B]' : ''}`}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meal Plans and Recommendations */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h2>
                <button
                  onClick={() => setShowAllMeals(!showAllMeals)}
                  className="text-sm text-[#51B73B] hover:text-[#3F8F2F]"
                >
                  {showAllMeals ? 'Show Current Meal Only' : 'Show All Meals'}
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(MEAL_TIMES).map(([mealType, { label, start, end }]) => {
                  const meals = mealsByType[mealType as keyof typeof mealsByType];
                  const isCurrent = currentMealInfo.label === label;
                  const isUpcoming = currentMealInfo.type === 'upcoming' && currentMealInfo.label === label;
                  
                  if (!showAllMeals && !isCurrent && !isUpcoming) return null;

                  return (
                    <div
                      key={mealType}
                      className={`bg-white rounded-lg shadow p-4 ${
                        isCurrent ? 'border-2 border-[#51B73B]' : 
                        isUpcoming ? 'border-2 border-blue-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                        <div className="flex gap-2">
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs font-medium text-[#51B73B] bg-[#F0F9EE] rounded-full">
                              Current Meal
                            </span>
                          )}
                          {isUpcoming && (
                            <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                              {currentMealInfo.tomorrow ? 'Tomorrow' : 'Upcoming Meal'}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {start} - {end}
                          </span>
                        </div>
                      </div>

                      {meals.length > 0 ? (
                        <div className="space-y-2">
                          {meals.map((meal) => (
                            <div key={meal.id} className="border-t pt-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-gray-900">{meal.item}</h4>
                                  <p className="text-sm text-gray-500">
                                    {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleAddMeal(meal)}
                                  className="bg-[#51B73B] hover:bg-[#3F8F2F] text-white"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No meals planned for this time</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Meal Recommendations</h2>
                
                {/* Goal Selection */}
                <div className="flex flex-col space-y-4 mb-8">
                  <h3 className="text-lg font-medium text-gray-900">Select Your Goal</h3>
                  <div className="flex gap-4">
                    {(['bulk', 'cut', 'maintain'] as FitnessGoal[]).map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setSelectedGoal(goal)}
                        className={`px-12 py-3 rounded-lg font-medium transition-colors ${
                          selectedGoal === goal
                            ? 'bg-[#51B73B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{GOAL_DESCRIPTIONS[selectedGoal]}</p>
                </div>

                {/* Recommendations */}
                {recommendations && (
                  <div className="space-y-12">
                    {/* Macros Overview */}
                    <div className="grid grid-cols-4 gap-8">
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h4 className="font-medium text-gray-900">Daily Calories</h4>
                        <p className="text-4xl font-bold text-[#51B73B] mt-2">{recommendations.macros.calories}</p>
                        <p className="text-sm text-gray-500 mt-1">kcal</p>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h4 className="font-medium text-gray-900">Protein</h4>
                        <p className="text-4xl font-bold text-[#51B73B] mt-2">{recommendations.macros.protein}g</p>
                        <p className="text-sm text-gray-500 mt-1">{Math.round(recommendations.macros.protein * 4)} kcal</p>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h4 className="font-medium text-gray-900">Carbs</h4>
                        <p className="text-4xl font-bold text-[#51B73B] mt-2">{recommendations.macros.carbs}g</p>
                        <p className="text-sm text-gray-500 mt-1">{Math.round(recommendations.macros.carbs * 4)} kcal</p>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h4 className="font-medium text-gray-900">Fat</h4>
                        <p className="text-4xl font-bold text-[#51B73B] mt-2">{recommendations.macros.fat}g</p>
                        <p className="text-sm text-gray-500 mt-1">{Math.round(recommendations.macros.fat * 9)} kcal</p>
                      </div>
                    </div>

                    {/* Meal-Specific Recommendations */}
                    <div className="grid grid-cols-4 gap-8">
                      {Object.entries(recommendations.mealSpecific).map(([meal, foods]) => (
                        <div key={meal} className="bg-gray-50 p-8 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">{meal}</h3>
                          <ul className="space-y-3">
                            {foods.map((food, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-[#51B73B] rounded-full mr-2"></span>
                                <span className="text-gray-600">{food}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Tips and Modifications */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tips</h3>
                        <ul className="space-y-3">
                          {recommendations.tips.map((tip, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-[#51B73B] rounded-full mr-2"></span>
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Modifications</h3>
                        <ul className="space-y-3">
                          {recommendations.modifications.map((mod, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-[#51B73B] rounded-full mr-2"></span>
                              <span className="text-gray-600">{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 