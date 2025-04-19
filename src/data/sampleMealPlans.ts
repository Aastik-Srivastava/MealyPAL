import { supabase } from '../lib/supabase/client';

const sampleMealPlans = [
  {
    day: 'Monday',
    meal: 'breakfast',
    item: 'Oatmeal with Berries',
    calories: 300,
    protein: 10,
    carbs: 45,
    fat: 8
  },
  {
    day: 'Monday',
    meal: 'lunch',
    item: 'Grilled Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25
  },
  {
    day: 'Monday',
    meal: 'snacks',
    item: 'Greek Yogurt with Almonds',
    calories: 200,
    protein: 15,
    carbs: 10,
    fat: 12
  },
  {
    day: 'Monday',
    meal: 'dinner',
    item: 'Salmon with Quinoa',
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 20
  },
  {
    day: 'Tuesday',
    meal: 'breakfast',
    item: 'Avocado Toast',
    calories: 350,
    protein: 12,
    carbs: 40,
    fat: 18
  },
  {
    day: 'Tuesday',
    meal: 'lunch',
    item: 'Turkey Wrap',
    calories: 400,
    protein: 25,
    carbs: 35,
    fat: 15
  },
  {
    day: 'Tuesday',
    meal: 'snacks',
    item: 'Protein Bar',
    calories: 250,
    protein: 20,
    carbs: 25,
    fat: 8
  },
  {
    day: 'Tuesday',
    meal: 'dinner',
    item: 'Beef Stir Fry',
    calories: 500,
    protein: 30,
    carbs: 40,
    fat: 22
  }
];

export const addSampleMealPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(sampleMealPlans);

    if (error) {
      console.error('Error adding sample meal plans:', error);
      return;
    }

    console.log('Successfully added sample meal plans!');
  } catch (error) {
    console.error('Error:', error);
  }
}; 