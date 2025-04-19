# MealyPAL - Your Personal Meal Planning Assistant

MealyPAL is a modern web application built with React, TypeScript, and Supabase that helps users plan and track their meals based on their fitness goals and dietary preferences.

## Features

- 🔐 Secure authentication with email/password
- 📊 Personal dashboard with meal tracking
- 📅 Weekly meal planning
- 📈 Calorie and macro tracking
- 📱 Responsive design
- 🌓 Light/dark mode
- 📤 Excel upload for meal plans

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase
- TailwindCSS
- Radix UI
- React Router
- React Hook Form
- Zod
- date-fns
- XLSX

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mealypal1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up your Supabase project:
   - Create a new project at https://supabase.com
   - Get your project URL and anon key from the project settings
   - Update the `.env` file with your credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following tables in Supabase:

### Users
- id (uuid, primary key)
- email (string)
- name (string)
- age (number)
- gender (enum: male, female, other)
- height (number, cm)
- weight (number, kg)
- activity_level (enum: sedentary, light, moderate, active, very_active)
- fitness_goal (enum: bulk, cut, maintain)
- bmr (number)

### Meals
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (string)
- type (enum: breakfast, lunch, evening_snacks, dinner)
- date (date)
- food_items (array of food_item_ids)

### Food Items
- id (uuid, primary key)
- name (string)
- calories (number)
- protein (number)
- carbs (number)
- fats (number)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
