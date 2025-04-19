import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUserProfile } from '../../hooks/useUserProfile'
import { Loader2 } from 'lucide-react'

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
      navigate('/sign-in');
      isChecking.current = false;
      return;
    }

    // Don't redirect if on public routes
    if (['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
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
      navigate('/bmr-calculator');
      isChecking.current = false;
      return;
    }

    console.log('AuthGuard: All checks passed');
    isChecking.current = false;
  }, [user, profile, authLoading, profileLoading, hasCompletedBMR, navigate, location.pathname])

  // Show loading state while checking auth or loading data
  if (authLoading || profileLoading) {
    console.log('AuthGuard: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#51B73B]" />
      </div>
    )
  }

  return <>{children}</>
} 