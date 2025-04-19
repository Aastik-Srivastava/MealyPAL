-- Enable Row Level Security
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meal_plans ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    height NUMERIC NOT NULL,
    weight NUMERIC NOT NULL,
    activity_level TEXT NOT NULL,
    bmr NUMERIC NOT NULL,
    tdee NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

-- Create meal_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    day DATE NOT NULL,
    meal TEXT NOT NULL,
    item TEXT NOT NULL,
    calories NUMERIC NOT NULL,
    protein NUMERIC NOT NULL,
    carbs NUMERIC NOT NULL,
    fat NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
    ON user_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for meal_plans
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