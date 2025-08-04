import { Link } from 'react-router-dom';
import { Leaf, CheckCircle, Smartphone, Shield, Brain, Star, Upload, Target, Users, Zap, TrendingUp, MessageSquare } from 'lucide-react';
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
            className="px-4 py-3 bg-[#51B73B] text-white rounded-md hover:bg-[#3F8F2F] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2f1a] via-[#2a4a2a] via-40% to-[#1e3a1e] to-90%">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] p-4 rounded-full border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)]">
                <Leaf className="text-[#7cfb8b]" size={48} />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
              Mealypal
            </h1>
            <h2 className="text-2xl font-bold text-[#7cfb8b] sm:text-3xl md:text-4xl mb-4">
              AI-Powered Nutrition for Fixed Menus
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-lg text-gray-300 sm:text-xl md:mt-5 md:text-2xl">
              Simplify fitness and nutrition tracking for people eating fixed, repetitive menus — like in hostels, PGs, and corporate messes.
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-[#1a2f1a] bg-[#7cfb8b] hover:bg-[#6adc7a] transition-colors md:py-5 md:text-xl md:px-12"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Only ₹30/month after free trial
            </p>
          </div>
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="py-16 bg-[rgba(255,255,255,0.05)] backdrop-blur-[18px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* The Problem */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-500/20 p-3 rounded-full mr-4">
                  <MessageSquare className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Problem</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                College students and working professionals eating in messes or canteens often lack awareness of the nutritional content of their meals. Manual logging is tedious, and generic fitness apps don't align with fixed menu-based eating.
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#7cfb8b]/20 p-3 rounded-full mr-4">
                  <Target className="h-8 w-8 text-[#7cfb8b]" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Solution</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Mealypal is an AI-powered web app that simplifies fitness and nutrition tracking for people eating fixed, repetitive menus. We automate calorie and macro tracking, offer fitness-aligned insights, and make meal planning effortless with just one weekly menu upload.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From menu upload to personalized guidance — all automated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <Upload className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Upload Weekly Menu</h3>
              <p className="text-gray-300 text-center">
                Users or mess admins upload their weekly menu (image or text)
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <Brain className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">AI Parses & Calculates</h3>
              <p className="text-gray-300 text-center">
                Mealypal parses the menu and calculates macros per item using our AI engine
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <Target className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Select Fitness Goal</h3>
              <p className="text-gray-300 text-center">
                During onboarding, users select their fitness goal — bulk, cut, or maintain
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Smart Macro Allocation</h3>
              <p className="text-gray-300 text-center">
                Based on their BMR & TDEE, the system allocates macros across meals
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <Users className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Personalized Guidance</h3>
              <p className="text-gray-300 text-center">
                Users receive personalized daily meal guidance — no manual input required
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7cfb8b]/20 mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-[#7cfb8b]" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Clean Web Interface</h3>
              <p className="text-gray-300 text-center">
                All of this happens in a clean, self-serve web interface
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 bg-[rgba(255,255,255,0.05)] backdrop-blur-[18px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <Brain className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">AI Meal Guidance</h3>
              <p className="text-gray-300 text-center text-sm">
                Based on mess menus with personalized recommendations
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Automatic Macro Tracking</h3>
              <p className="text-gray-300 text-center text-sm">
                No manual logging required
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <Zap className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Daily Nudges & Reminders</h3>
              <p className="text-gray-300 text-center text-sm">
                GPT-powered fitness insights
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <Upload className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Image-based Menu OCR</h3>
              <p className="text-gray-300 text-center text-sm">
                Coming soon
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <Users className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Gamified Referral System</h3>
              <p className="text-gray-300 text-center text-sm">
                Boost organic growth
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7cfb8b]/20 mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-[#7cfb8b]" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Self-serve Dashboard</h3>
              <p className="text-gray-300 text-center text-sm">
                Clean, intuitive interface
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Streams Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Revenue Streams
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Premium Subscription */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#7cfb8b]/20 p-3 rounded-full mr-4">
                  <Star className="h-8 w-8 text-[#7cfb8b]" />
                </div>
                <h3 className="text-2xl font-bold text-white">₹30/month Premium</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                  <span>AI-based goal tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Personalized macro distribution</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                  <span>GPT insights & reminders</span>
                </li>
              </ul>
            </div>

            {/* White-labeled Platform */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#7cfb8b]/20 p-3 rounded-full mr-4">
                  <Users className="h-8 w-8 text-[#7cfb8b]" />
                </div>
                <h3 className="text-2xl font-bold text-white">White-labeled Platform</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Gyms (custom-branded fitness meals & plans)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Dieticians (client-facing nutrition automation)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Activities Section */}
      <div className="py-16 bg-[rgba(255,255,255,0.05)] backdrop-blur-[18px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Key Activities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">Weekly menu parsing & macro engine maintenance</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">GPT logic for fitness goal alignment & reminders</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">Customer success + content refreshes</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">Onboarding funnel optimization</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">Marketing: college activations, gamified referrals</h3>
            </div>

            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] p-6">
              <h3 className="text-lg font-medium text-white mb-3">Building and supporting self-serve dashboard</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Start with our free tier and upgrade when you're ready for more
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {/* Free Tier */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/40 shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-[#7cfb8b]">Free Tier</h3>
                <p className="mt-4 text-4xl font-extrabold text-white">
                  ₹0
                  <span className="text-base font-medium text-gray-400">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">View meal menu & macros</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">Get notifications for upcoming meals</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-[#1a2f1a] bg-[#7cfb8b] hover:bg-[#6adc7a] transition-colors"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[18px] rounded-2xl border-2 border-[#7cfb8b] shadow-[0_2px_16px_0_rgba(124,251,139,0.15)] overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#7cfb8b]">Pro Tier</h3>
                  <span className="px-3 py-1 text-sm font-semibold text-[#7cfb8b] bg-[#7cfb8b]/20 rounded-full">
                    Popular
                  </span>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-white">
                  ₹30
                  <span className="text-base font-medium text-gray-400">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">AI-powered health recommendations</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">Calorie, BMR, and TDEE tracker</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">Macro breakdowns (protein, carbs, fats)</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#7cfb8b] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">Personalized guidance for bulking, cutting, or maintaining</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-[#1a2f1a] bg-[#7cfb8b] hover:bg-[#6adc7a] transition-colors"
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
      <div className="bg-[rgba(124,251,139,0.1)] backdrop-blur-[18px] border-t border-[#7cfb8b]/40">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your meal planning?</span>
            <span className="block text-[#7cfb8b]">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#1a2f1a] bg-[#7cfb8b] hover:bg-[#6adc7a] transition-colors"
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