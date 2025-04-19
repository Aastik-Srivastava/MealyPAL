import { User } from '@/types'

// Activity level multipliers
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise/sports 1-3 days/week
  moderate: 1.55, // Moderate exercise/sports 3-5 days/week
  active: 1.725, // Hard exercise/sports 6-7 days/week
  very_active: 1.9, // Very hard exercise/sports & physical job or training twice per day
}

/**
 * Calculate BMR using the Mifflin-St Jeor formula
 * For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 * For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
 */
export function calculateBMR(user: User): number {
  const { weight, height, age, gender, activityLevel, fitnessGoal } = user
  
  // Base BMR calculation
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161)
  
  // Adjust BMR based on activity level
  const tdee = baseBMR * ACTIVITY_MULTIPLIERS[activityLevel]
  
  // Adjust calories based on fitness goal
  let adjustedCalories = tdee
  switch (fitnessGoal) {
    case 'bulk':
      adjustedCalories += 500 // Caloric surplus for bulking
      break
    case 'cut':
      adjustedCalories -= 500 // Caloric deficit for cutting
      break
    case 'maintain':
    default:
      // No adjustment needed for maintenance
      break
  }
  
  return Math.round(adjustedCalories)
} 