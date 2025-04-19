-- Enable RLS if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can insert their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can update their own meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can delete their own meal plans" ON meal_plans;

-- Add unique constraint to user_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'user_profiles_user_id_key'
    ) THEN
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Recreate RLS policies for user_profiles
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

-- Recreate RLS policies for meal_plans
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