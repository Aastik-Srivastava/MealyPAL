-- Create enums
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE activity_level_type AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE fitness_goal_type AS ENUM ('bulk', 'cut', 'maintain');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'evening_snacks', 'dinner');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16),
    gender gender_type NOT NULL,
    height DECIMAL NOT NULL CHECK (height >= 100), -- in cm
    weight DECIMAL NOT NULL CHECK (weight >= 30),  -- in kg
    activity_level activity_level_type NOT NULL,
    fitness_goal fitness_goal_type NOT NULL,
    bmr INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create food_items table
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein DECIMAL NOT NULL CHECK (protein >= 0),
    carbs DECIMAL NOT NULL CHECK (carbs >= 0),
    fats DECIMAL NOT NULL CHECK (fats >= 0),
    lactose BOOLEAN NOT NULL DEFAULT false, -- 1 means contains lactose
    gluten BOOLEAN NOT NULL DEFAULT false, -- 1 means contains gluten
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create meals table
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type meal_type NOT NULL,
    date DATE NOT NULL,
    food_items UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX meals_user_id_idx ON meals(user_id);
CREATE INDEX meals_date_idx ON meals(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at
    BEFORE UPDATE ON food_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Food items policies
CREATE POLICY "Anyone can view food items"
    ON food_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can create food items"
    ON food_items FOR INSERT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Meals policies
CREATE POLICY "Users can view own meals"
    ON meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meals"
    ON meals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
    ON meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
    ON meals FOR DELETE
    USING (auth.uid() = user_id); 