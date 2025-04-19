import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const insertSampleData = async () => {
  try {
    // First, check if the table exists
    const { error: tableError } = await supabase
      .from('meal_plans')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('Table does not exist. Please create the table in the Supabase dashboard with the following structure:');
      console.log(`
        Table name: meal_plans
        Columns:
        - id: uuid (primary key)
        - created_at: timestamp with time zone (default: now())
        - day: text
        - meal: text
        - item: text
        - calories: integer
        - protein: integer
        - carbs: integer
        - fat: integer
      `);
      return;
    }

    // Insert the data
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(sampleMealPlans)
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      return;
    }

    console.log('Successfully inserted sample meal plans!');
    console.log('Inserted data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the insertion
insertSampleData(); 