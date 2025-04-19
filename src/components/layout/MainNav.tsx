import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Why MealyPAL?', path: '/#why' },
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="text-primary-600 mr-2" size={24} />
              <span className="text-2xl font-bold text-primary-800">MealyPAL</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/signin"
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/signin"
              className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-primary-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 