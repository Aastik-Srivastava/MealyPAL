import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Meal, FoodItem } from '@/types'

export function useMeals(userId: string) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchTodaysMeals()
    }
  }, [userId])

  const fetchTodaysMeals = async () => {
    setLoading(true)
    setError(null)

    try {
      const today = new Date().toISOString().split('T')[0]

      // Fetch meals for today
      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select(`
          id,
          name,
          type,
          date,
          food_items (
            id,
            name,
            calories,
            protein,
            carbs,
            fats
          )
        `)
        .eq('user_id', userId)
        .eq('date', today)

      if (mealsError) throw mealsError

      setMeals(mealsData || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch meals'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentMeal = (): Meal | null => {
    const now = new Date()
    const hour = now.getHours()

    // Define meal time ranges
    const mealTimes = {
      breakfast: { start: 7, end: 9.5 },
      lunch: { start: 11.75, end: 14.25 },
      evening_snacks: { start: 16.5, end: 18 },
      dinner: { start: 19, end: 21.5 }
    }

    // Find the current meal type based on time
    let currentMealType: Meal['type'] | null = null
    for (const [type, time] of Object.entries(mealTimes)) {
      if (hour >= time.start && hour <= time.end) {
        currentMealType = type as Meal['type']
        break
      }
    }

    if (!currentMealType) return null

    return meals.find(meal => meal.type === currentMealType) || null
  }

  const getMealByType = (type: Meal['type']): Meal | null => {
    return meals.find(meal => meal.type === type) || null
  }

  const getMealsByDate = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select(`
          id,
          name,
          type,
          date,
          food_items (
            id,
            name,
            calories,
            protein,
            carbs,
            fats
          )
        `)
        .eq('user_id', userId)
        .eq('date', date)

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch meals'
      return { data: null, error: message }
    }
  }

  const calculateMealMacros = (foodItems: FoodItem[]) => {
    return foodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
  }

  return {
    meals,
    loading,
    error,
    getCurrentMeal,
    getMealByType,
    getMealsByDate,
    calculateMealMacros,
    refreshMeals: fetchTodaysMeals
  }
} 