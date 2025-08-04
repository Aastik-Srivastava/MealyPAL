import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Heart, Clock, Star, ChevronRight, Check, BrainCircuit, SlidersHorizontal, Zap, Upload, Target, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { CursorParticles } from './CursorParticles';
import { ThreeLeafLogo } from './ThreeLeafLogo';
import './hero-shimmer.css'; // Add this import for custom shimmer/inner-shadow styles
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

// --- Section Reveal Animation Variant ---
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// --- Hover Animation for Cards/Buttons ---
const hoverEffect = {
  scale: 1.04,
  y: -4,
  boxShadow: "0 0 24px rgba(168, 255, 186, 0.8)",
  borderColor: "rgb(168, 255, 186)",
};

export function LandingPage() {
  const problemRef = useRef(null);
  const problemInView = useInView(problemRef, { once: true, amount: 0.2 });
  const howItWorksRef = useRef(null);
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.2 });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  // Vanta background setup
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xA8FFBA,
        backgroundColor: 0x10151a,
        points: 18.0, // sharper net
        maxDistance: 18.0, // less spread
        spacing: 16.0, // denser
        showDots: false,
        // You can tweak these for more/less subtlety
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#10151a] via-[#19391a] via-40% to-[#0c1a13] to-90% bg-[#10151a] font-sans text-gray-300">
      {/* Fluid, magnetic, water-like blob cursor trail */}
      <CursorParticles />

      {/* Hero Section */}
      <section id="home" className="relative flex items-center justify-center min-h-[80vh] pt-32 pb-16 overflow-hidden">
        {/* Linear/Angular Gradient Overlay (background, behind net) */}
        <div
          className="pointer-events-none absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(120deg, #19391a 0%, #10151a 60%, #0c1a13 100%)',
            opacity: 0.92,
            maskImage: 'linear-gradient(to bottom, white 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 80%, transparent 100%)',
          }}
        />
        <div
          ref={vantaRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{
            pointerEvents: 'none',
            filter: 'blur(4px) saturate(1.1)', // reduced blur for sharper net
            maskImage: 'linear-gradient(to bottom, white 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 80%, transparent 100%)',
          }}
        />
        <motion.div
          className="relative z-10 max-w-2xl w-full mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#A8FFBA]/30 p-8 md:p-14 flex flex-col items-center hero-inner-shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated gradient shimmer text for hero heading */}
          <motion.h1
            className="font-bold font-display text-4xl md:text-6xl text-white tracking-tight leading-tight mb-4 text-center bg-gradient-to-r from-[#A8FFBA] via-white to-[#A8FFBA] bg-clip-text text-transparent hero-shimmer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
              <div className="flex items-center justify-center gap-4 mb-4">
                <ThreeLeafLogo size={64} className="drop-shadow-lg" />
                <span className="text-[#A8FFBA] font-bold text-5xl md:text-7xl">MealyPal</span>
              </div>
              <span className="hero-shimmer-gradient text-3xl md:text-4xl">Your Personal Meal Planning Assistant</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-8 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
          >
            Simplify fitness and nutrition tracking for people eating fixed, repetitive menus — like in hostels, PGs, and corporate messes.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <motion.div whileHover={hoverEffect} className="transition-transform">
              <Button asChild size="lg" className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg bg-[#A8FFBA] text-[#10151a] shadow-lg border border-transparent">
                <Link to="/signup" className="flex items-center gap-2">
                  Get Started Free <ChevronRight />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={hoverEffect} className="transition-transform">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg bg-white/10 text-[#A8FFBA] border border-[#A8FFBA]/30 shadow-lg backdrop-blur-xl">
                <Link to="/signin">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            className="text-sm text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Only ₹30/month after free trial
          </motion.p>
        </motion.div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem" ref={problemRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={problemInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* The Problem */}
            <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
              <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="bg-red-500/20 p-3 rounded-full mr-4">
                    <MessageSquare className="h-8 w-8 text-red-400" />
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">The Problem</CardTitle>
                </div>
                <CardDescription className="text-gray-300 text-lg leading-relaxed">
                  College students and working professionals eating in messes or canteens often lack awareness of the nutritional content of their meals. Manual logging is tedious, and generic fitness apps don't align with fixed menu-based eating.
                </CardDescription>
              </Card>
            </motion.div>

            {/* The Solution */}
            <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
              <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="bg-[#A8FFBA]/20 p-3 rounded-full mr-4">
                    <Target className="h-8 w-8 text-[#A8FFBA]" />
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">The Solution</CardTitle>
                </div>
                <CardDescription className="text-gray-300 text-lg leading-relaxed">
                  Mealypal is an AI-powered web app that simplifies fitness and nutrition tracking for people eating fixed, repetitive menus. We automate calorie and macro tracking, offer fitness-aligned insights, and make meal planning effortless with just one weekly menu upload.
                </CardDescription>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
            From menu upload to personalized guidance — all automated
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-8 w-8 text-[#A8FFBA]" />,
                title: "Upload Weekly Menu",
                desc: "Users or mess admins upload their weekly menu (image or text)"
              },
              {
                icon: <BrainCircuit className="h-8 w-8 text-[#A8FFBA]" />,
                title: "AI Parses & Calculates",
                desc: "Mealypal parses the menu and calculates macros per item using our AI engine"
              },
              {
                icon: <Target className="h-8 w-8 text-[#A8FFBA]" />,
                title: "Select Fitness Goal",
                desc: "During onboarding, users select their fitness goal — bulk, cut, or maintain"
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-[#A8FFBA]" />,
                title: "Smart Macro Allocation",
                desc: "Based on their BMR & TDEE, the system allocates macros across meals"
              },
              {
                icon: <Users className="h-8 w-8 text-[#A8FFBA]" />,
                title: "Personalized Guidance",
                desc: "Users receive personalized daily meal guidance — no manual input required"
              },
              {
                icon: <SlidersHorizontal className="h-8 w-8 text-[#A8FFBA]" />,
                title: "Clean Web Interface",
                desc: "All of this happens in a clean, self-serve web interface"
              }
            ].map((step, index) => (
              <motion.div whileHover={{ scale: 1.01 }} className="transition-transform" key={index}>
                <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-6 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#A8FFBA]/20 mx-auto mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="text-white text-xl font-bold text-center mb-3">{step.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-center">{step.desc}</CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <section id="features" ref={featuresRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="h-6 w-6 text-[#A8FFBA]" />,
                title: "AI Meal Guidance",
                desc: "Based on mess menus with personalized recommendations"
              },
              {
                icon: <Check className="h-6 w-6 text-[#A8FFBA]" />,
                title: "Automatic Macro Tracking",
                desc: "No manual logging required"
              },
              {
                icon: <Zap className="h-6 w-6 text-[#A8FFBA]" />,
                title: "Daily Nudges & Reminders",
                desc: "GPT-powered fitness insights"
              },
              {
                icon: <Upload className="h-6 w-6 text-[#A8FFBA]" />,
                title: "Image-based Menu OCR",
                desc: "Coming soon"
              },
              {
                icon: <Users className="h-6 w-6 text-[#A8FFBA]" />,
                title: "Gamified Referral System",
                desc: "Boost organic growth"
              },
              {
                icon: <SlidersHorizontal className="h-6 w-6 text-[#A8FFBA]" />,
                title: "Self-serve Dashboard",
                desc: "Clean, intuitive interface"
              }
            ].map((feature, index) => (
              <motion.div whileHover={{ scale: 1.01 }} className="transition-transform" key={index}>
                <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-6 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#A8FFBA]/20 mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-lg font-medium text-center mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-center text-sm">{feature.desc}</CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial="hidden"
          animate={pricingInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Start with our free tier and upgrade when you're ready for more
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
              <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                <CardTitle className="text-white text-xl font-bold mb-2">Free Tier</CardTitle>
                <p className="text-4xl font-extrabold text-[#A8FFBA] mb-4">₹0 <span className="text-base font-medium text-gray-400">/month</span></p>
                <ul className="space-y-2 mb-6">
                  <li>View meal menu & macros</li>
                  <li>Get notifications for upcoming meals</li>
                </ul>
                <Button asChild className="w-full bg-[#A8FFBA] text-[#10151a] font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-[0_0_10px_#A8FFBA] transition-all">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </Card>
            </motion.div>
            {/* Pro Tier */}
            <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
              <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border-2 border-[#A8FFBA] text-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-white text-xl font-bold">Pro Tier</CardTitle>
                  <span className="px-3 py-1 text-sm font-semibold text-[#A8FFBA] bg-[#A8FFBA]/20 rounded-full">
                    Popular
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-[#A8FFBA] mb-4">₹30 <span className="text-base font-medium text-gray-400">/month</span></p>
                <ul className="space-y-2 mb-6">
                  <li>AI-powered health recommendations</li>
                  <li>Calorie, BMR, and TDEE tracker</li>
                  <li>Macro breakdowns (protein, carbs, fats)</li>
                  <li>Personalized guidance for bulking, cutting, or maintaining</li>
                </ul>
                <Button asChild className="w-full bg-[#A8FFBA] text-[#10151a] font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-[0_0_10px_#A8FFBA] transition-all">
                  <Link to="/signup">Upgrade to Pro</Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="cta" ref={ctaRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-4xl mx-auto px-4 text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
            <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-12 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-8">
                Ready to transform your meal planning?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start your journey today with AI-powered nutrition tracking for fixed menus.
              </p>
              <Button asChild size="lg" className="px-8 py-4 rounded-xl font-bold text-lg bg-[#A8FFBA] text-[#10151a] shadow-lg hover:scale-105 hover:shadow-[0_0_10px_#A8FFBA] transition-all">
                <Link to="/signup" className="flex items-center gap-2">
                  Get Started Free <ChevronRight />
                </Link>
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#10151a]/80 backdrop-blur-md border-t border-[#A8FFBA]/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} MealyPAL. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 