import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  });
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Test the connection
supabase
  .from('meal_plans')
  .select('count')
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  });

// Test the connection with retry logic
const testConnection = async (retries = 3) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error testing Supabase connection:', error);
      if (retries > 0) {
        console.log(`Retrying connection (${retries} attempts remaining)...`);
        setTimeout(() => testConnection(retries - 1), 1000);
      }
    } else {
      console.log('Supabase connection successful, session:', session ? 'exists' : 'none');
    }
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
    if (retries > 0) {
      console.log(`Retrying connection (${retries} attempts remaining)...`);
      setTimeout(() => testConnection(retries - 1), 1000);
    }
  }
};

testConnection();

export async function hasCompletedBMRCalculation(userId: string): Promise<boolean> {
  try {
    console.log('Checking BMR calculation for user:', userId)
    
    // Check for the user's profile, ordering by created_at desc to get the most recent
    const { data, error } = await supabase
      .from('user_profiles')
      .select('bmr, tdee')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error checking BMR:', error)
      if (error.code === 'PGRST116') {
        // No rows found
        console.log('No user profile found for user:', userId)
        return false
      }
      throw error
    }

    console.log('BMR data found:', data)
    const hasBMR = data?.bmr !== null && data?.bmr > 0
    console.log('Has BMR:', hasBMR)
    return hasBMR
  } catch (error) {
    console.error('Error in hasCompletedBMRCalculation:', error)
    return false
  }
} 