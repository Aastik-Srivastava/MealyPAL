import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { Leaf, Loader2, Calculator } from 'lucide-react'

interface UserProfile {
  age: number
  gender: string
  height: number
  weight: number
  activity_level: string
  bmr: number
  tdee: number
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Leaf className="text-primary-600" size={24} />
                </div>
                <h1 className="ml-4 text-2xl font-bold text-primary-900">Your Profile</h1>
              </div>
              <button
                onClick={() => navigate('/bmr-calculator')}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Calculator className="mr-2" size={20} />
                Recalculate BMR
              </button>
            </div>

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-primary-900 mb-4">Health Metrics</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-secondary-600">Age</p>
                      <p className="text-lg font-medium text-primary-900">{profile.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Gender</p>
                      <p className="text-lg font-medium text-primary-900 capitalize">{profile.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Height</p>
                      <p className="text-lg font-medium text-primary-900">{profile.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Weight</p>
                      <p className="text-lg font-medium text-primary-900">{profile.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Activity Level</p>
                      <p className="text-lg font-medium text-primary-900 capitalize">{profile.activity_level.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-primary-900 mb-4">Caloric Needs</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-secondary-600">Basal Metabolic Rate (BMR)</p>
                      <p className="text-lg font-medium text-primary-900">{Math.round(profile.bmr)} kcal/day</p>
                      <p className="text-sm text-secondary-600">Calories burned at rest</p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Total Daily Energy Expenditure (TDEE)</p>
                      <p className="text-lg font-medium text-primary-900">{Math.round(profile.tdee)} kcal/day</p>
                      <p className="text-sm text-secondary-600">Calories needed to maintain current weight</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 