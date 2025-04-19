import { Link } from 'react-router-dom';
import { Leaf, CheckCircle, Smartphone, Shield, Brain, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setError('Connection error. Please try refreshing the page.');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again later.');
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Leaf className="text-[#51B73B]" size={48} />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Smarter Meal Planning for Your Fitness Goals
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your AI-powered meal planning assistant. Get personalized meal suggestions, track your nutrition, and achieve your health goals effortlessly.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#51B73B] hover:bg-[#3F8F2F] md:py-4 md:text-lg md:px-10"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Only ₹25/month after free trial
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose MealyPAL?
            </h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Track Daily Meals</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Easily log and track your daily meals with our intuitive interface
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white mx-auto">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Personalized Macros</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Get detailed macro information tailored to your goals
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white mx-auto">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">GPT-Based Suggestions</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Get smart meal suggestions powered by advanced AI
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white mx-auto">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Mobile Ready</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Access your meal plans anywhere, anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-[#F0F9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#51B73B] sm:text-4xl">
              What Our Users Say
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[#51B73B]">Alex K.</h3>
                  <p className="mt-2 text-base text-gray-600">
                    "Helped me stay consistent and simplified my diet! The AI suggestions are spot on."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[#51B73B]">Priya M.</h3>
                  <p className="mt-2 text-base text-gray-600">
                    "It's like having a personal nutrition coach on my phone. The meal plans are so convenient!"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[#51B73B]">Rahul S.</h3>
                  <p className="mt-2 text-base text-gray-600">
                    "The personalized recommendations have made meal planning effortless and effective."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#51B73B] sm:text-4xl">
              Still Curious?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Here are answers to some common questions
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">How does the AI suggest meals?</h3>
              <p className="mt-2 text-base text-gray-600">
                Our AI analyzes your fitness goals, dietary preferences, and nutritional needs to generate personalized meal suggestions. It considers factors like your BMR, activity level, and target macros to create balanced meal plans.
              </p>
            </div>

            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">Can I change my goal?</h3>
              <p className="mt-2 text-base text-gray-600">
                Yes! You can update your fitness goal anytime. Whether you want to bulk up, cut weight, or maintain your current physique, our system will adjust your meal recommendations accordingly.
              </p>
            </div>

            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">What if I skip a meal?</h3>
              <p className="mt-2 text-base text-gray-600">
                No worries! The system is flexible and will adjust your remaining meal suggestions to help you meet your daily nutritional goals. You can also log skipped meals to keep track of your progress.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-[#F0F9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#51B73B] sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start with our free tier and upgrade when you're ready for more
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-[#51B73B]">Free Tier</h3>
                <p className="mt-4 text-4xl font-extrabold text-gray-900">
                  ₹0
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">View meal menu & macros</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Get notifications for upcoming meals</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#51B73B] hover:bg-[#3F8F2F]"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#51B73B]">
              <div className="px-6 py-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#51B73B]">Pro Tier</h3>
                  <span className="px-3 py-1 text-sm font-semibold text-[#51B73B] bg-[#F0F9EE] rounded-full">
                    Popular
                  </span>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-gray-900">
                  ₹25
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">AI-powered health recommendations</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Calorie, BMR, and TDEE tracker</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Macro breakdowns (protein, carbs, fats)</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#51B73B]" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Personalized guidance for bulking, cutting, or maintaining</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#51B73B] hover:bg-[#3F8F2F]"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#51B73B]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your meal planning?</span>
            <span className="block text-[#3F8F2F]">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#51B73B] bg-white hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 