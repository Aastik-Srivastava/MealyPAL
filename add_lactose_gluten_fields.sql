-- Add lactose and gluten fields to food_items table
-- Run these commands in your Supabase SQL editor

-- Add the new columns with default values
ALTER TABLE food_items 
ADD COLUMN lactose BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE food_items 
ADD COLUMN gluten BOOLEAN NOT NULL DEFAULT false;

-- Update existing records if needed (optional)
-- Set lactose = true for dairy products
UPDATE food_items 
SET lactose = true 
WHERE name ILIKE '%milk%' 
   OR name ILIKE '%cheese%' 
   OR name ILIKE '%yogurt%' 
   OR name ILIKE '%cream%' 
   OR name ILIKE '%butter%' 
   OR name ILIKE '%ice cream%';

-- Set gluten = true for wheat/gluten-containing products
UPDATE food_items 
SET gluten = true 
WHERE name ILIKE '%bread%' 
   OR name ILIKE '%pasta%' 
   OR name ILIKE '%wheat%' 
   OR name ILIKE '%flour%' 
   OR name ILIKE '%cereal%' 
   OR name ILIKE '%cake%' 
   OR name ILIKE '%cookie%' 
   OR name ILIKE '%biscuit%';

-- Verify the changes
SELECT name, lactose, gluten FROM food_items LIMIT 10; 