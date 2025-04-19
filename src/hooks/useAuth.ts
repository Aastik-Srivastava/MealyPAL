import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { AuthState, AuthUser } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
} 