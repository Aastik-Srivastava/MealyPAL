import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function BMRCalculator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state with pre-filled data if available
  const [formData, setFormData] = useState({
    age: location.state?.preFilledData?.age || '',
    gender: location.state?.preFilledData?.gender || 'male',
    height: location.state?.preFilledData?.height || '',
    weight: location.state?.preFilledData?.weight || '',
    activity_level: location.state?.preFilledData?.activity_level || 'sedentary'
  });

  useEffect(() => {
    console.log('BMRCalculator: Component mounted');
    console.log('BMRCalculator: Pre-filled data:', location.state?.preFilledData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('BMRCalculator: Form submitted with data:', formData);
    
    if (!user) {
      console.error('BMRCalculator: No user found');
      setError('No user found');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bmr = calculateBMR(formData);
      const tdee = calculateTDEE(bmr, formData.activity_level);
      
      console.log('BMRCalculator: Calculated values:', { bmr, tdee });

      await updateProfile({
        ...formData,
        bmr,
        tdee,
        has_completed_bmr: true
      });

      console.log('BMRCalculator: Profile updated successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('BMRCalculator: Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profileLoading && !profile) {
    console.log('BMRCalculator: Loading state active');
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10151a] via-[#19391a] to-[#0c1a13] font-sans text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#A8FFBA]/30 p-8 md:p-14">
        <h2 className="text-2xl font-bold mb-6 text-white font-display tracking-tight leading-tight text-center">Calculate Your BMR</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              required
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-300">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              required
              min="1"
              max="300"
              value={formData.height}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-300">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              required
              min="1"
              max="500"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="activity_level" className="block text-sm font-medium text-gray-300">
              Activity Level
            </label>
            <select
              id="activity_level"
              name="activity_level"
              required
              value={formData.activity_level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-700 bg-white/5 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-[#A8FFBA] focus:border-[#A8FFBA] focus:z-10 sm:text-sm"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week)</option>
              <option value="very_active">Very Active (6-7 days/week)</option>
              <option value="extra_active">Extra Active (very active & physical job)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-[#A8FFBA] hover:bg-[#51B73B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A8FFBA] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Calculating...' : 'Calculate BMR'}
          </button>
        </form>
      </div>
    </div>
  );
}

function calculateBMR(data: { age: number; gender: string; height: number; weight: number }) {
  if (data.gender === 'male') {
    return 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
  } else {
    return 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
  }
}

function calculateTDEE(bmr: number, activityLevel: string) {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
} 