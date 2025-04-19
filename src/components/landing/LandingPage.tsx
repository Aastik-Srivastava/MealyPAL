import { Link } from 'react-router-dom';
import { Leaf, Heart, Brain, Clock, Star, ChevronDown, Salad, Apple, Carrot, Zap, ChevronRight, Check } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Abstract shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#51B73B] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#51B73B] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#51B73B] rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-[#51B73B] sm:text-5xl md:text-6xl">
            <span className="block">Your Personal</span>
            <span className="block text-[#51B73B]">Meal Planning Assistant</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-secondary-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Plan your meals, track your nutrition, and achieve your health goals with our AI-powered meal planning assistant.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#51B73B] hover:bg-[#3F8F2F] md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/signin"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#51B73B] bg-white hover:bg-[#F0F9EE] md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#51B73B] sm:text-4xl">
              Why Choose MealyPAL?
            </h2>
            <p className="mt-4 text-lg text-secondary-600">
              We make meal planning simple, efficient, and personalized to your needs.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#51B73B]">Personalized Plans</h3>
                <p className="mt-2 text-base text-secondary-600">
                  Get meal plans tailored to your dietary preferences, allergies, and health goals.
                </p>
              </div>

              <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#51B73B]">Nutrition Tracking</h3>
                <p className="mt-2 text-base text-secondary-600">
                  Monitor your daily nutrition intake and stay on track with your health goals.
                </p>
              </div>

              <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#51B73B] text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#51B73B]">Time-Saving</h3>
                <p className="mt-2 text-base text-secondary-600">
                  Save hours of meal planning and grocery shopping with our efficient tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-16 bg-[#F0F9EE]">
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
                  <p className="mt-2 text-base text-secondary-600">
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
                  <p className="mt-2 text-base text-secondary-600">
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
                  <p className="mt-2 text-base text-secondary-600">
                    "The personalized recommendations have made meal planning effortless and effective."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#51B73B] sm:text-4xl">
              Still Curious?
            </h2>
            <p className="mt-4 text-lg text-secondary-600">
              Here are answers to some common questions
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">How does the AI suggest meals?</h3>
              <p className="mt-2 text-base text-secondary-600">
                Our AI analyzes your fitness goals, dietary preferences, and nutritional needs to generate personalized meal suggestions. It considers factors like your BMR, activity level, and target macros to create balanced meal plans.
              </p>
            </div>

            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">Can I change my goal?</h3>
              <p className="mt-2 text-base text-secondary-600">
                Yes! You can update your fitness goal anytime. Whether you want to bulk up, cut weight, or maintain your current physique, our system will adjust your meal recommendations accordingly.
              </p>
            </div>

            <div className="bg-[#F0F9EE] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium text-[#51B73B]">What if I skip a meal?</h3>
              <p className="mt-2 text-base text-secondary-600">
                No worries! The system is flexible and will adjust your remaining meal suggestions to help you meet your daily nutritional goals. You can also log skipped meals to keep track of your progress.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 bg-[#51B73B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Transform Your Meal Planning?
            </h2>
            <p className="mt-4 text-lg text-white">
              Join thousands of users who have already improved their health and nutrition.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#51B73B] bg-white hover:bg-[#F0F9EE] transition-colors duration-200"
              >
                Get Started Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#51B73B]">
            <p>&copy; 2024 MealyPAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 