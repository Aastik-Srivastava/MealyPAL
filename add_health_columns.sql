-- Add new health-related columns to food_items table
ALTER TABLE food_items
ADD COLUMN pcos BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE food_items
ADD COLUMN gutwreaker BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE food_items
ADD COLUMN thyroid_friendly BOOLEAN NOT NULL DEFAULT false;

-- Update existing food items with appropriate values based on their characteristics
-- PCOS-friendly foods (low glycemic index, anti-inflammatory)
UPDATE food_items
SET pcos = true
WHERE name ILIKE '%avocado%'
   OR name ILIKE '%salmon%'
   OR name ILIKE '%nuts%'
   OR name ILIKE '%seeds%'
   OR name ILIKE '%olive oil%'
   OR name ILIKE '%berries%'
   OR name ILIKE '%leafy greens%'
   OR name ILIKE '%quinoa%'
   OR name ILIKE '%sweet potato%'
   OR name ILIKE '%turmeric%'
   OR name ILIKE '%ginger%'
   OR name ILIKE '%cinnamon%';

-- Gut wreaker foods (oily, fried, processed, unhealthy)
UPDATE food_items
SET gutwreaker = true
WHERE name ILIKE '%fried%'
   OR name ILIKE '%deep fried%'
   OR name ILIKE '%chips%'
   OR name ILIKE '%fries%'
   OR name ILIKE '%burger%'
   OR name ILIKE '%pizza%'
   OR name ILIKE '%processed meat%'
   OR name ILIKE '%sausage%'
   OR name ILIKE '%bacon%'
   OR name ILIKE '%hot dog%'
   OR name ILIKE '%soda%'
   OR name ILIKE '%energy drink%'
   OR name ILIKE '%candy%'
   OR name ILIKE '%chocolate%'
   OR name ILIKE '%ice cream%'
   OR name ILIKE '%donut%'
   OR name ILIKE '%cake%'
   OR name ILIKE '%cookie%'
   OR name ILIKE '%white bread%'
   OR name ILIKE '%white rice%'
   OR name ILIKE '%pasta%'
   OR name ILIKE '%mayonnaise%'
   OR name ILIKE '%ketchup%'
   OR name ILIKE '%sauce%';

-- Thyroid-friendly foods (iodine-rich, selenium-rich, anti-inflammatory)
UPDATE food_items
SET thyroid_friendly = true
WHERE name ILIKE '%fish%'
   OR name ILIKE '%seafood%'
   OR name ILIKE '%seaweed%'
   OR name ILIKE '%eggs%'
   OR name ILIKE '%dairy%'
   OR name ILIKE '%milk%'
   OR name ILIKE '%cheese%'
   OR name ILIKE '%yogurt%'
   OR name ILIKE '%nuts%'
   OR name ILIKE '%brazil nuts%'
   OR name ILIKE '%sunflower seeds%'
   OR name ILIKE '%pumpkin seeds%'
   OR name ILIKE '%legumes%'
   OR name ILIKE '%beans%'
   OR name ILIKE '%lentils%'
   OR name ILIKE '%chickpeas%'
   OR name ILIKE '%spinach%'
   OR name ILIKE '%kale%'
   OR name ILIKE '%broccoli%'
   OR name ILIKE '%cauliflower%'
   OR name ILIKE '%cabbage%'
   OR name ILIKE '%garlic%'
   OR name ILIKE '%onion%'
   OR name ILIKE '%ginger%'
   OR name ILIKE '%turmeric%'
   OR name ILIKE '%berries%'
   OR name ILIKE '%citrus%'
   OR name ILIKE '%orange%'
   OR name ILIKE '%lemon%'
   OR name ILIKE '%lime%'
   OR name ILIKE '%green tea%'
   OR name ILIKE '%herbal tea%';

-- Verify the changes
SELECT name, pcos, gutwreaker, thyroid_friendly 
FROM food_items 
WHERE pcos = true OR gutwreaker = true OR thyroid_friendly = true 
LIMIT 10; 