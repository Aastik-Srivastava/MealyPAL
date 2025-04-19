import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfileService } from '../services/userProfileService';
import { useAuth } from './useAuth';

export function useUserProfile() {
  console.log('useUserProfile: Hook initializing');
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedBMR, setHasCompletedBMR] = useState(false);
  const isMounted = useRef(true);
  const lastUserId = useRef<string | undefined>();
  const isLoadingRef = useRef(false);

  useEffect(() => {
    console.log('useUserProfile: Component mounted');
    isMounted.current = true;
    return () => {
      console.log('useUserProfile: Component unmounting');
      isMounted.current = false;
    };
  }, []);

  const loadProfile = useCallback(async () => {
    console.log('useUserProfile: Loading profile for user:', user?.id);
    
    if (!user?.id) {
      console.log('useUserProfile: No user ID, resetting state');
      if (isMounted.current) {
        setLoading(false);
        setHasCompletedBMR(false);
        setProfile(null);
      }
      return;
    }

    // Skip if we're already loading for this user
    if (lastUserId.current === user.id && isLoadingRef.current) {
      console.log('useUserProfile: Already loading for this user, skipping');
      return;
    }

    lastUserId.current = user.id;
    isLoadingRef.current = true;

    try {
      setLoading(true);
      console.log('useUserProfile: Fetching profile data');
      const profileData = await UserProfileService.getUserProfile(user.id);
      
      if (!isMounted.current) {
        console.log('useUserProfile: Component unmounted during fetch');
        return;
      }

      if (profileData) {
        console.log('useUserProfile: Profile data received', profileData);
        setProfile(profileData);
        const hasBMR = !!profileData?.bmr;
        console.log('useUserProfile: Setting hasCompletedBMR to', hasBMR);
        setHasCompletedBMR(hasBMR);
      } else {
        console.log('useUserProfile: No profile data found');
        setProfile(null);
        setHasCompletedBMR(false);
      }
    } catch (err) {
      console.error('useUserProfile: Error loading profile', err);
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setProfile(null);
      setHasCompletedBMR(false);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    }
  }, [user]);

  useEffect(() => {
    console.log('useUserProfile: User changed, loading profile');
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (data: any) => {
    console.log('useUserProfile: Updating profile with data', data);
    
    if (!user?.id) {
      console.error('useUserProfile: No user ID for update');
      throw new Error('No user found');
    }

    try {
      setLoading(true);
      isLoadingRef.current = true;
      console.log('useUserProfile: Calling update service');
      const updatedProfile = await UserProfileService.updateUserProfile(user.id, data);
      
      if (!isMounted.current) {
        console.log('useUserProfile: Component unmounted during update');
        return null;
      }

      if (updatedProfile) {
        console.log('useUserProfile: Profile updated successfully', updatedProfile);
        setProfile(updatedProfile);
        const hasBMR = !!updatedProfile?.bmr;
        console.log('useUserProfile: Setting hasCompletedBMR to', hasBMR);
        setHasCompletedBMR(hasBMR);
        return updatedProfile;
      } else {
        console.error('useUserProfile: Update returned no profile');
        setHasCompletedBMR(false);
        return null;
      }
    } catch (err) {
      console.error('useUserProfile: Error updating profile', err);
      if (!isMounted.current) return null;
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setHasCompletedBMR(false);
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    }
  }, [user]);

  const refresh = useCallback(async () => {
    console.log('useUserProfile: Refreshing profile');
    if (user?.id) {
      await loadProfile();
    }
  }, [user, loadProfile]);

  return {
    profile,
    loading,
    error,
    hasCompletedBMR,
    updateProfile,
    refresh
  };
} 