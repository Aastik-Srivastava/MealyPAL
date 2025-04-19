import { supabase } from '../lib/supabaseClient';
import { MealPlan } from '../types/mealPlan';

export const mealPlanService = {
  async getAllMealPlans() {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getMealPlansByDay(day: string): Promise<MealPlan[]> {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('day', day)
      .order('meal', { ascending: true });

    if (error) throw error;
    return data as MealPlan[];
  },

  async getMealPlansByMeal(meal: MealPlan['meal']): Promise<MealPlan[]> {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('meal', meal)
      .order('day', { ascending: true });

    if (error) throw error;
    return data as MealPlan[];
  },

  async getMealPlanById(id: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMealPlansByTags(tags: string[]): Promise<MealPlan[]> {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .contains('tags', tags)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MealPlan[];
  },

  async getMealPlansByDietaryRestrictions(
    isVegetarian?: boolean,
    isVegan?: boolean,
    isGlutenFree?: boolean
  ): Promise<MealPlan[]> {
    let query = supabase
      .from('meal_plans')
      .select('*');

    if (isVegetarian !== undefined) {
      query = query.eq('is_vegetarian', isVegetarian);
    }
    if (isVegan !== undefined) {
      query = query.eq('is_vegan', isVegan);
    }
    if (isGlutenFree !== undefined) {
      query = query.eq('is_gluten_free', isGlutenFree);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as MealPlan[];
  }
}; 