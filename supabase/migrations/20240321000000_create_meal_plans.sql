-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  meal TEXT NOT NULL,
  item TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
  ON meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id); 