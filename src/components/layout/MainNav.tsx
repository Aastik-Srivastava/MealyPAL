import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'About', path: '/#about', id: 'about' },
    { name: 'Why MealyPAL?', path: '/#why', id: 'why' },
    { name: 'Testimonials', path: '/#testimonials', id: 'testimonials' },
    { name: 'FAQ', path: '/#faq', id: 'faq' },
  ];

  // Shrink and blur nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      // Scrollspy logic
      const sectionOffsets = navItems.map(item => {
        const el = document.getElementById(item.id);
        return el ? el.offsetTop : 0;
      });
      const scrollPos = window.scrollY + 80;
      let current = 'home';
      for (let i = 0; i < sectionOffsets.length; i++) {
        if (scrollPos >= sectionOffsets[i]) {
          current = navItems[i].id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Glassmorphism nav: dark translucent bg, blur, rounded, shadow
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-lg bg-[#0f1117]/80 shadow-2xl h-14 rounded-b-2xl border-b border-primary-900/30' : 'bg-[#0f1117]/60 h-20 rounded-b-2xl'} border-b`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full transition-all duration-300">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className={`text-primary-600 mr-2 transition-all duration-300 ${scrolled ? 'w-6 h-6' : 'w-8 h-8'}`} size={scrolled ? 24 : 32} />
              <span className={`font-bold text-primary-100 transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>MealyPAL</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  activeSection === item.id
                    ? 'text-primary-400 font-bold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-primary-400 before:to-primary-600 before:rounded-full before:opacity-80'
                    : 'text-secondary-300 hover:text-primary-400'
                }`}
              >
                {item.name}
              </a>
            ))}
            <motion.a
              href="/signin"
              whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(81,255,59,0.18)' }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-md"
            >
              Sign In
            </motion.a>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-300 hover:text-primary-400 hover:bg-primary-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#0f1117]/90 backdrop-blur-lg shadow-2xl border-b border-primary-900/30 rounded-b-2xl"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-900/30 text-primary-400 font-bold' : 'text-secondary-300 hover:bg-primary-900/20 hover:text-primary-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <motion.a
              href="/signin"
              whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(81,255,59,0.18)' }}
              whileTap={{ scale: 0.96 }}
              className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-primary-700 transition-colors shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </motion.a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
} 