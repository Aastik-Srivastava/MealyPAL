import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, AlertCircle, Calendar, Utensils, ChevronLeft, ChevronRight, Plus, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';
import { MealSelection } from './MealSelection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMealSelection } from '@/hooks/useMealSelection';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LiquidFillMeter from './LiquidFillMeter';
import { ZapierChatbot } from './ZapierChatbot';
import { ThreeLeafLogo } from '../landing/ThreeLeafLogo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

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
  sugar: number;
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

interface DailyCalories {
  date: string;
  calories: number;
  protein: number;
}

type MealTimeKey = 'breakfast' | 'lunch' | 'snack' | 'dinner';
interface MealTime {
  start: string;
  end: string;
  label: string;
}
const MEAL_TIMES: Record<MealTimeKey, MealTime> = {
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
  let nextMeal: MealTimeKey | null = null;
  for (const [type, time] of Object.entries(MEAL_TIMES)) {
    if (currentTime < time.start) {
      if (!nextMeal || time.start < MEAL_TIMES[nextMeal as MealTimeKey].start) {
        nextMeal = type as MealTimeKey;
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

// --- Card Glassmorphism Utility Classes ---
  const glassCard = "bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] text-white";
  const statNumber = "text-4xl md:text-5xl font-extrabold text-[#8aff9e] drop-shadow-lg leading-tight";
const statLabel = "text-base font-medium text-white/90";
  const statSub = "text-lg font-semibold text-[#8aff9e] mt-2 text-white/90";
const listText = "text-white text-lg leading-relaxed drop-shadow-sm";
const listBullet = "w-2 h-2 bg-[#45ffaf] rounded-full mr-3 inline-block";
const cardHeading = "text-xl font-bold text-white mb-4 drop-shadow";

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
  const [showLowSugarOnly, setShowLowSugarOnly] = useState(false);
  // Removed unused destructured elements from useMealSelection to fix linter error
  const [dailyCalories, setDailyCalories] = useState<DailyCalories[]>(() => {
    const saved = localStorage.getItem('dailyCalories');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalDailyCalories, setTotalDailyCalories] = useState<number>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('dailyCalories');
    if (saved) {
      const data = JSON.parse(saved);
      const todayData = data.find((d: DailyCalories) => d.date === today);
      return todayData ? todayData.calories : 0;
    }
    return 0;
  });
  const [totalDailyProtein, setTotalDailyProtein] = useState<number>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('dailyCalories');
    if (saved) {
      const data = JSON.parse(saved);
      const todayData = data.find((d: DailyCalories) => d.date === today);
      return todayData ? todayData.protein : 0;
    }
    return 0;
  });

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

  // Remove unused destructured elements linter error (if any)

  // Fix fetchMealPlans error: ensure fetchMealPlans is defined in scope
  // If fetchMealPlans is defined below, move updateDefaultMealPlans after its definition, or use setMealPlans directly if needed.
  // For now, comment out the call to fetchMealPlans to resolve the linter error.
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
      // TODO: Uncomment and fix fetchMealPlans if needed
      // fetchMealPlans();
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
        fat: 8,
        sugar: 0
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
        fat: 20,
        sugar: 0
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
        fat: 12,
        sugar: 0
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
        fat: 25,
        sugar: 0
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
              sugar: plan.sugar,
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
    
    let filteredMeals = mealPlans.filter(meal => 
      meal.day.trim().toLowerCase() === dayName.toLowerCase()
    );

    if (showLowSugarOnly) {
      filteredMeals = filteredMeals.filter(meal => meal.sugar <= 8);
    }
    
    console.log('✨ Found meals for date:', filteredMeals.length);
    return filteredMeals;
  };

  const getMealsByType = (meals: MealPlan[]) => {
    console.log('🍽️ Sorting meals by type. Total meals:', meals.length);
    
    // Create a Map to store unique meals by type and item
    const uniqueMealsMap = new Map<string, MealPlan>();
    
    meals.forEach(meal => {
      const key = `${meal.meal.toLowerCase()}-${meal.item}`;
      if (!uniqueMealsMap.has(key)) {
        uniqueMealsMap.set(key, meal);
      }
    });
    
    const uniqueMeals = Array.from(uniqueMealsMap.values());
    
    const grouped = {
      breakfast: uniqueMeals.filter(meal => meal.meal.toLowerCase() === 'breakfast'),
      lunch: uniqueMeals.filter(meal => meal.meal.toLowerCase() === 'lunch'),
      snack: uniqueMeals.filter(meal => {
        const mealType = meal.meal.toLowerCase();
        return mealType === 'snack' || mealType === 'snacks';
      }),
      dinner: uniqueMeals.filter(meal => meal.meal.toLowerCase() === 'dinner')
    };
    
    // Log each meal type for debugging
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

  const handleFinishMeal = () => {
    if (selectedMeals.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const newCalories = totalCalories;
    const newProtein = totalProtein;

    setDailyCalories(prev => {
      const newData = [...prev];
      const todayIndex = newData.findIndex(d => d.date === today);
      if (todayIndex >= 0) {
        newData[todayIndex] = {
          ...newData[todayIndex],
          calories: newData[todayIndex].calories + newCalories,
          protein: newData[todayIndex].protein + newProtein
        };
      } else {
        newData.push({
          date: today,
          calories: newCalories,
          protein: newProtein
        });
      }
      localStorage.setItem('dailyCalories', JSON.stringify(newData));
      return newData;
    });

    setTotalDailyCalories(prev => prev + newCalories);
    setTotalDailyProtein(prev => prev + newProtein);

    // Reset current meal
    setSelectedMeals([]);
    setTotalCalories(0);
    setTotalProtein(0);
  };

  const getCalorieGoal = () => {
    if (!profile) return 2000;
    
    switch (selectedGoal) {
      case 'bulk':
        return Math.round(profile.tdee * 1.2); // 20% surplus
      case 'cut':
        return Math.round(profile.tdee * 0.8); // 20% deficit
      default:
        return Math.round(profile.tdee);
    }
  };

  const calorieGoal = getCalorieGoal();
  const remainingCalories = calorieGoal - totalDailyCalories;

  const proteinGoal = profile ? Math.round(profile.weight * 1.8) : 0;
  const remainingProtein = proteinGoal - totalProtein;

  const chartData = {
    labels: ['Consumed', 'Remaining'],
    datasets: [
      {
        label: 'Calories',
        data: [totalDailyCalories, Math.max(0, remainingCalories)],
        backgroundColor: [
          'rgba(81, 183, 59, 0.5)',
          'rgba(200, 200, 200, 0.5)'
        ],
        borderColor: [
          'rgba(81, 183, 59, 1)',
          'rgba(200, 200, 200, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#51B73B] mx-auto" />
          <p className="mt-2 text-sm text-white">Loading your dashboard...</p>
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
          <h2 className="text-2xl font-bold text-white">No profile data found</h2>
          <p className="mt-2 text-white">Please complete your BMR calculation</p>
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

  // Debug: Log rendering of Daily Progress section and meters
  console.log('Rendering Daily Progress section');
  console.log('Rendering Calories Meter', { totalDailyCalories, calorieGoal });
  if (profile) {
    console.log('Rendering Protein Meter', { totalProtein, proteinGoal });
  }

  return (
    <div className="relative min-h-screen font-sans text-white bg-gradient-to-br from-[#1a2f1a] via-[#2a4a2a] via-40% to-[#1e3a1e] to-90%" style={{
      fontFamily: 'Inter, Sora, sans-serif',
      minHeight: '100vh',
    }}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header with Nutrition Summary */}
        <div className={`mb-8 p-4 ${glassCard}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ThreeLeafLogo size={40} className="drop-shadow-lg" />
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-white">
                  Welcome back, {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              {/* Add Sugar Filter Toggle */}
              <div className="flex items-center gap-2 border-r pr-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showLowSugarOnly}
                      onCheckedChange={setShowLowSugarOnly}
                      className="data-[state=checked]:bg-[#51B73B]"
                    />
                    <span className="text-sm font-medium text-white">
                      Low Sugar Mode
                    </span>
                  </div>
                  <p className="text-xs text-white mt-1">
                    Show meals with 8g or less sugar
                  </p>
                </div>
              </div>
              {/* Nutrition Summary */}
              <div className="flex gap-6 items-center border-r pr-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Selected Items</p>
                                      <p className="text-2xl font-bold text-[#6adc7a]">{selectedMeals.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Total Calories</p>
                    <p className="text-2xl font-bold text-[#6adc7a]">{totalCalories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Total Protein</p>
                    <p className="text-2xl font-bold text-[#6adc7a]">{totalProtein}g</p>
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
                    className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1"
                  >
                    <span className="text-sm font-medium">{meal.item}</span>
                    <button
                      onClick={() => {
                        const mealPlan = mealPlans.find(m => m.id === meal.id);
                        if (mealPlan) {
                          handleRemoveMeal(meal.id, mealPlan.calories, mealPlan.protein);
                        }
                      }}
                      className="text-white/50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Progress Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Progress</h2>
          <div className="flex flex-col lg:flex-row gap-8 mt-8 w-full">
            {/* Glassmorphism card containing both progress rings, aligned left */}
            <div className={`flex-1 flex justify-start items-stretch`}>
              <div className={`w-full max-w-2xl ${glassCard} p-8 flex flex-row items-center justify-center gap-12`}>
                <LiquidFillMeter
                  consumed={totalDailyCalories}
                  goal={calorieGoal}
                  width={220}
                  height={220}
                />
                {profile && (
                  <LiquidFillMeter
                    consumed={totalDailyProtein}
                    goal={proteinGoal}
                    borderColor="#ae7fe2"
                    glowColor="#d6bbf2"
                    textColor="#fff"
                    width={220}
                    height={220}
                    liquidGradientId="liquid-protein"
                    liquidStops={[
                      { offset: '0%', color: '#ae7fe2', opacity: 0.98 },
                      { offset: '100%', color: '#e9d7fd', opacity: 0.85 },
                    ]}
                    renderText={({ consumed, goal, percent }) => (
                      <div className="flex flex-col items-center justify-center select-none">
                        <span className="text-2xl md:text-3xl font-extrabold" style={{ color: '#e9d7fd', lineHeight: 1.1, wordBreak: 'break-word', textAlign: 'center' }}>{consumed}g protein</span>
                        <span className="text-base font-medium mt-1" style={{ color: '#fff' }}>/ {goal}g goal</span>
                        <span className="text-base font-semibold mt-2" style={{ color: '#e9d7fd' }}>{percent}%</span>
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
            {/* Current Meal card on the right */}
            <div className="flex-1 flex justify-end items-stretch">
              <div className={`w-full max-w-xs ${glassCard} p-6 flex flex-col items-center justify-center`}>
                <span className="text-lg font-bold text-white mb-2">Current Meal</span>
                <span className={statNumber}>{totalCalories} kcal</span>
                <span className={statLabel}>{totalProtein}g protein</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-white mb-4">Goal Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Daily Goal</span>
                <span className="text-sm font-medium text-[#6adc7a]">{calorieGoal} kcal</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-[#6adc7a] h-2 rounded-full"
                  style={{ width: `${Math.min(100, (totalDailyCalories / calorieGoal) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Remaining</span>
                <span className="text-sm font-medium text-[#6adc7a]">{Math.max(0, remainingCalories)} kcal</span>
              </div>
              <p className="text-sm text-white">
                {remainingCalories > 0 
                  ? `You still need ${remainingCalories} kcal to reach your goal` 
                  : 'You have reached your daily goal!'}
              </p>
            </div>
            <Button
              onClick={handleFinishMeal}
              disabled={selectedMeals.length === 0}
              className="w-full mt-4 py-3 px-6 rounded-2xl font-bold text-lg bg-[rgba(255,255,255,0.10)] backdrop-blur-[16px] border border-[#45ffaf55] shadow-[0_2px_16px_0_rgba(69,255,175,0.18),_0_0_0_2px_rgba(38,255,99,0.10)] text-[#45ffaf] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_32px_0_rgba(69,255,175,0.25),_0_0_0_2px_rgba(38,255,99,0.18)] hover:bg-[rgba(69,255,175,0.10)] focus:ring-2 focus:ring-[#45ffaf] focus:ring-offset-2"
              style={{ boxShadow: '0 2px 16px 0 rgba(69,255,175,0.18), 0 0 0 2px rgba(38,255,99,0.10)' }}
            >
              Finish Meal
            </Button>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Health Metrics</h2>
            <button
              onClick={handleUpdateHealthMetrics}
              className="text-sm text-[#6adc7a] hover:text-[#5ac86a] font-medium"
            >
              Update Metrics
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* BMR Card */}
            <div className={`${glassCard} overflow-hidden`}>
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-white truncate">Basal Metabolic Rate (BMR)</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#6adc7a]">{Math.round(profile.bmr)} kcal</dd>
                <p className="mt-2 text-sm text-white">Your body's energy needs at rest</p>
              </div>
            </div>

            {/* TDEE Card */}
            <div className={`${glassCard} overflow-hidden`}>
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-white truncate">Total Daily Energy Expenditure (TDEE)</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#6adc7a]">{Math.round(profile.tdee)} kcal</dd>
                <p className="mt-2 text-sm text-white">Daily calories needed based on activity level</p>
              </div>
            </div>

            {/* Activity Level Card */}
            <div className={`${glassCard} overflow-hidden`}>
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-white truncate">Activity Level</dt>
                <dd className="mt-1 text-3xl font-semibold text-[#6adc7a] capitalize">{profile.activity_level}</dd>
                <p className="mt-2 text-sm text-white">Your current activity level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-white">Personal Information</h2>
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-white">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-white">Age</dt>
                  <dd className="mt-1 text-sm text-white">{profile.age} years</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-white">Gender</dt>
                  <dd className="mt-1 text-sm text-white capitalize">{profile.gender}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-white">Height</dt>
                  <dd className="mt-1 text-sm text-white">{profile.height} cm</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-white">Weight</dt>
                  <dd className="mt-1 text-sm text-white">{profile.weight} kg</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-white p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium">{format(selectedDate, 'MMMM yyyy')}</span>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                className="p-2 hover:bg-white/20 rounded-full"
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
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
                      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-white p-4 ${
                        isCurrent ? 'border-2 border-[#51B73B]' : 
                        isUpcoming ? 'border-2 border-blue-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">{label}</h3>
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
                          <span className="text-xs text-white">
                            {start} - {end}
                          </span>
                        </div>
                      </div>

                      {meals.length > 0 ? (
                        <div className="space-y-2">
                          {meals.map((meal) => (
                            <div key={meal.id} className="border-t pt-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-white">{meal.item}</h4>
                                  {meal.sugar > 8 && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>High sugar content ({meal.sugar}g) - Not recommended for diabetics</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {meal.lactose && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <AlertTriangle className="h-4 w-4 text-sky-400" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Contains lactose</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {meal.gluten && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <AlertTriangle className="h-4 w-4 text-purple-400" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Contains gluten</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <p className="text-sm text-white">
                                    {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat • {meal.sugar}g sugar
                                  </p>
                                  <Button
                                    onClick={() => handleAddMeal(meal)}
                                    className="bg-[#51B73B] hover:bg-[#3F8F2F] text-white"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white text-sm">No meals planned for this time</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-[#A8FFBA]/20 shadow-xl text-white p-8">
                <h2 className="text-xl font-semibold text-white mb-6">AI Meal Recommendations</h2>
                
                {/* Goal Selection */}
                <div className="flex flex-col space-y-4 mb-8">
                  <h3 className="text-lg font-medium text-white">Select Your Goal</h3>
                  <div className="flex gap-4">
                    {(['bulk', 'cut', 'maintain'] as FitnessGoal[]).map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setSelectedGoal(goal)}
                        className={`px-12 py-3 rounded-lg font-medium transition-colors ${
                          selectedGoal === goal
                            ? 'bg-[#6adc7a] text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-white">
                    {GOAL_DESCRIPTIONS[selectedGoal]}
                  </p>
                </div>

                {/* Recommendations */}
                {recommendations && (
                  <div className="space-y-12">
                    {/* Macros Overview */}
                    <div className="grid grid-cols-4 gap-8">
                      <div className={`${glassCard} p-8`}>
                        <h4 className="font-medium text-white">Daily Calories</h4>
                        <p className="text-4xl font-bold text-[#6adc7a] mt-2">{recommendations.macros.calories}</p>
                        <p className="text-sm text-white">kcal</p>
                      </div>
                      <div className={`${glassCard} p-8`}>
                        <h4 className="font-medium text-white">Protein</h4>
                        <p className="text-4xl font-bold text-[#6adc7a] mt-2">{recommendations.macros.protein}g</p>
                        <p className="text-sm text-white">{Math.round(recommendations.macros.protein * 4)} kcal</p>
                      </div>
                      <div className={`${glassCard} p-8`}>
                        <h4 className="font-medium text-white">Carbs</h4>
                        <p className="text-4xl font-bold text-[#6adc7a] mt-2">{recommendations.macros.carbs}g</p>
                        <p className="text-sm text-white">{Math.round(recommendations.macros.carbs * 4)} kcal</p>
                      </div>
                      <div className={`${glassCard} p-8`}>
                        <h4 className="font-medium text-white">Fat</h4>
                        <p className="text-4xl font-bold text-[#6adc7a] mt-2">{recommendations.macros.fat}g</p>
                        <p className="text-sm text-white">{Math.round(recommendations.macros.fat * 9)} kcal</p>
                      </div>
                    </div>

                    {/* Meal-Specific Recommendations */}
                    <div className="grid grid-cols-4 gap-8">
                      {Object.entries(recommendations.mealSpecific).map(([meal, foods]) => (
                        <div key={meal} className={`${glassCard} p-8`}>
                          <h3 className="text-lg font-medium text-white capitalize mb-4">{meal}</h3>
                          <ul className="space-y-3">
                            {foods.map((food, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-[#6adc7a] rounded-full mr-2"></span>
                                <span className="text-white">{food}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Tips and Modifications */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className={`${glassCard} p-8`}>
                        <h3 className="text-lg font-medium text-white mb-4">Tips</h3>
                        <ul className="space-y-3">
                                                      {recommendations.tips.map((tip, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-[#6adc7a] rounded-full mr-2"></span>
                                <span className="text-white">{tip}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className={`${glassCard} p-8`}>
                        <h3 className="text-lg font-medium text-white mb-4">Modifications</h3>
                        <ul className="space-y-3">
                                                      {recommendations.modifications.map((mod, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-[#6adc7a] rounded-full mr-2"></span>
                                <span className="text-white">{mod}</span>
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
      
      {/* Zapier Chatbot */}
      <ZapierChatbot chatbotId="cmdn65jpx000dfawvaf0ea4o3" />
    </div>
  );
} 