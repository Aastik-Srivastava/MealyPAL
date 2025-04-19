import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase/client'
import { FoodItem, Meal, WeeklyMealPlan } from '@/types'

interface ExcelMealData {
  date: string
  type: Meal['type']
  name: string
  foods: {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }[]
}

export function useExcelUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processExcelFile = async (file: File, userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await readExcelFile(file)
      const mealPlan = await saveMealPlan(data, userId)
      return { data: mealPlan, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process Excel file'
      setError(message)
      return { data: null, error: message }
    } finally {
      setLoading(false)
    }
  }

  const readExcelFile = (file: File): Promise<ExcelMealData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          const meals: ExcelMealData[] = jsonData.map((row: any) => ({
            date: row.date,
            type: row.type.toLowerCase(),
            name: row.name,
            foods: [{
              name: row.food_name,
              calories: Number(row.calories),
              protein: Number(row.protein),
              carbs: Number(row.carbs),
              fats: Number(row.fats)
            }]
          }))

          resolve(meals)
        } catch (err) {
          reject(new Error('Invalid Excel file format'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  const saveMealPlan = async (mealData: ExcelMealData[], userId: string): Promise<WeeklyMealPlan> => {
    // Group meals by date
    const mealsByDate = mealData.reduce((acc, meal) => {
      if (!acc[meal.date]) {
        acc[meal.date] = []
      }
      acc[meal.date].push(meal)
      return acc
    }, {} as Record<string, ExcelMealData[]>)

    const dates = Object.keys(mealsByDate).sort()
    const startDate = dates[0]
    const endDate = dates[dates.length - 1]

    // Create meal plan
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from('meal_plans')
      .insert([{
        user_id: userId,
        start_date: startDate,
        end_date: endDate
      }])
      .select()
      .single()

    if (mealPlanError) throw mealPlanError

    // Create meals and food items
    for (const meal of mealData) {
      // Insert food items
      const { data: foodItems, error: foodError } = await supabase
        .from('food_items')
        .insert(meal.foods.map(food => ({
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats
        })))
        .select()

      if (foodError) throw foodError

      // Insert meal
      const { error: mealError } = await supabase
        .from('meals')
        .insert({
          meal_plan_id: mealPlan.id,
          user_id: userId,
          name: meal.name,
          type: meal.type,
          date: meal.date,
          food_items: foodItems.map(item => item.id)
        })

      if (mealError) throw mealError
    }

    return mealPlan
  }

  return {
    processExcelFile,
    loading,
    error
  }
} 