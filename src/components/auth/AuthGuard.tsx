import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUserProfile } from '../../hooks/useUserProfile'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  console.log('AuthGuard: Component rendering');
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, hasCompletedBMR } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const isChecking = useRef(false)
  const lastPath = useRef(location.pathname)

  useEffect(() => {
    console.log('AuthGuard: State changed', {
      user,
      profile,
      authLoading,
      profileLoading,
      hasCompletedBMR,
      path: location.pathname
    });

    // Don't proceed if still loading
    if (authLoading || profileLoading) {
      console.log('AuthGuard: Still loading auth or profile');
      return;
    }

    // Prevent multiple checks
    if (isChecking.current) {
      console.log('AuthGuard: Already checking, skipping');
      return;
    }

    // Prevent unnecessary redirects
    if (lastPath.current === location.pathname) {
      console.log('AuthGuard: Path unchanged, skipping');
      return;
    }

    isChecking.current = true;
    lastPath.current = location.pathname;

    // No user, redirect to sign in
    if (!user) {
      console.log('AuthGuard: No user, redirecting to sign-in');
      navigate('/signin', { replace: true });
      isChecking.current = false;
      return;
    }

    // Don't redirect if on public routes
    if (['/', '/signin', '/signup'].includes(location.pathname)) {
      console.log('AuthGuard: On public route, no redirect needed');
      isChecking.current = false;
      return;
    }

    // Don't redirect if already on BMR calculator
    if (location.pathname === '/bmr-calculator') {
      console.log('AuthGuard: On BMR calculator, no redirect needed');
      isChecking.current = false;
      return;
    }

    // For protected routes, check BMR completion
    if (!hasCompletedBMR) {
      console.log('AuthGuard: BMR not completed, redirecting to calculator');
      navigate('/bmr-calculator', { replace: true });
      isChecking.current = false;
      return;
    }

    isChecking.current = false;
  }, [user, profile, authLoading, profileLoading, hasCompletedBMR, location.pathname, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#51B73B]"></div>
      </div>
    );
  }

  return <>{children}</>;
} 