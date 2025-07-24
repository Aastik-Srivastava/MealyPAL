import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Heart, Clock, Star, ChevronRight, Check, BrainCircuit, SlidersHorizontal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { CursorParticles } from './CursorParticles';
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
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });
  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.2 });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });
  const edgeRef = useRef(null);
  const edgeInView = useInView(edgeRef, { once: true, amount: 0.2 });

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
            Your Personal
            <br className="hidden md:block" />
            <span className="hero-shimmer-gradient">Meal Planning Assistant</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-8 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
          >
            Plan your meals, track your nutrition, and achieve your health goals with our AI-powered meal planning assistant.
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
                  Get Started <ChevronRight />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={hoverEffect} className="transition-transform">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg bg-white/10 text-[#A8FFBA] border border-[#A8FFBA]/30 shadow-lg backdrop-blur-xl">
                <Link to="/signin">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* New "Our Edge" Section */}
      <section id="edge" ref={edgeRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={edgeInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            Our Edge
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "AI-Powered Precision",
                desc: "Our smart AI analyzes your goals to create perfectly tailored meal plans, optimizing your nutrition.",
              },
              {
                icon: <SlidersHorizontal className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "Fully Customizable",
                desc: "Easily swap meals, adjust macros, and customize your plan to fit your lifestyle and preferences.",
              },
              {
                icon: <Zap className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "Seamless Experience",
                desc: "From planning to tracking, our intuitive interface makes managing your nutrition effortless.",
              },
            ].map((f) => (
              <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
                <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                  <div className="flex items-center justify-center mb-4">{f.icon}</div>
                  <CardTitle className="text-white text-lg font-bold text-center">{f.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-center">{f.desc}</CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="why" ref={featuresRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            Why Choose MealyPAL?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "Personalized Plans",
                desc: "Get meal plans tailored to your dietary preferences, allergies, and health goals.",
              },
              {
                icon: <Heart className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "Nutrition Tracking",
                desc: "Monitor your daily nutrition intake and stay on track with your health goals.",
              },
              {
                icon: <Clock className="h-8 w-8 text-[#A8FFBA] bg-white/10 rounded-full p-1" />,
                title: "Time-Saving",
                desc: "Save hours of meal planning and grocery shopping with our efficient tools.",
              },
            ].map((f) => (
              <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
                <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                  <div className="flex items-center justify-center mb-4">{f.icon}</div>
                  <CardTitle className="text-white text-lg font-bold text-center">{f.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-center">{f.desc}</CardDescription>
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
              <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                <CardTitle className="text-white text-xl font-bold mb-2">Pro Tier</CardTitle>
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

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 md:py-24">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={sectionVariant}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex K.",
                quote: "Helped me stay consistent and simplified my diet! The AI suggestions are spot on.",
              },
              {
                name: "Priya M.",
                quote: "It's like having a personal nutrition coach on my phone. The meal plans are so convenient!",
              },
              {
                name: "Rahul S.",
                quote: "The personalized recommendations have made meal planning effortless and effective.",
              },
            ].map((t) => (
              <motion.div whileHover={{ scale: 1.01 }} className="transition-transform">
                <Card className="bg-white/10 hover:bg-transparent backdrop-blur-md rounded-2xl overflow-hidden p-8 shadow-xl border border-[#A8FFBA]/20 text-gray-300 transition-colors">
                  <div className="flex items-center mb-4">
                    <Star className="h-6 w-6 text-[#A8FFBA] bg-white/10 rounded-full p-1" />
                    <span className="ml-3 text-lg font-bold text-white">{t.name}</span>
                  </div>
                  <CardDescription className="text-gray-300">{t.quote}</CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
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