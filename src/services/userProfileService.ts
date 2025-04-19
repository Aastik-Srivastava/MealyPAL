import { supabase } from '../lib/supabaseClient';
import { UserProfile, UserGoals } from '../types';

export interface UserProfile {
  id?: string;
  user_id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  bmr: number;
  tdee: number;
  created_at?: string;
  updated_at?: string;
}

export class UserProfileService {
  static calculateBMR(age: number, gender: string, height: number, weight: number): number {
    // Mifflin-St Jeor Equation
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
  }

  static calculateTDEE(bmr: number, activityLevel: string): number {
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      lightly_active: 1.375, // Light exercise/sports 1-3 days/week
      moderately_active: 1.55, // Moderate exercise/sports 3-5 days/week
      very_active: 1.725,  // Hard exercise/sports 6-7 days/week
      extra_active: 1.9    // Very hard exercise/sports & physical job or training twice per day
    };

    return Math.round(bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2));
  }

  static getActivityMultiplier(activityLevel: string): number {
    switch (activityLevel.toLowerCase()) {
      case 'sedentary':
        return 1.2;
      case 'light':
        return 1.375;
      case 'moderate':
        return 1.55;
      case 'very':
        return 1.725;
      case 'extra':
        return 1.9;
      default:
        return 1.2;
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Profile data:', profileData);

      // Ensure all numeric values are properly converted
      const processedData = {
        user_id: userId,
        age: Number(profileData.age),
        height: Number(profileData.height),
        weight: Number(profileData.weight),
        gender: profileData.gender,
        activity_level: profileData.activity_level,
        bmr: Number(profileData.bmr),
        tdee: Number(profileData.tdee),
        updated_at: new Date().toISOString()
      };

      console.log('Processed data:', processedData);

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(processedData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return null;
    }
  }

  static async createUserProfile(userId: string, profileData: Omit<UserProfile, 'user_id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data;
  }

  static async hasCompletedBMRCalculation(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('bmr, tdee')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error checking BMR completion:', error);
      return false;
    }

    return !!data && data.bmr > 0 && data.tdee > 0;
  }

  static async setUserGoals(
    userId: string,
    data: {
      goal_type: string;
      target_weight?: number;
      target_calories?: number;
      target_protein?: number;
      target_carbs?: number;
      target_fat?: number;
    }
  ): Promise<UserGoals> {
    const { data: goals, error } = await supabase
      .from('user_goals')
      .upsert({
        user_id: userId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return goals;
  }

  static async getUserGoals(userId: string): Promise<UserGoals> {
    const { data: goals, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return goals;
  }
} 