import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { BMRCalculator } from './components/auth/BMRCalculator';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuthGuard } from './components/auth/AuthGuard';
import { LandingPage } from './components/landing/LandingPage';
import { CursorParticles } from './components/landing/CursorParticles';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" replace /> : <>
            <CursorParticles />
            <LandingPage />
          </>
        }
      />
      <Route
        path="/signin"
        element={
          user ? <Navigate to="/dashboard" replace /> : <SignIn />
        }
      />
      <Route
        path="/signup"
        element={
          user ? <Navigate to="/dashboard" replace /> : <SignUp />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/bmr-calculator"
        element={
          user ? (
            <BMRCalculator />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
