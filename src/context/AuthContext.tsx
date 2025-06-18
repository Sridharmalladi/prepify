import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false) // Changed to false for frontend-only mode

  useEffect(() => {
    // Mock session for frontend development
    const mockUser = {
      id: 'mock-user-id',
      email: 'demo@example.com',
      user_metadata: {
        full_name: 'Demo User'
      }
    } as User

    // Simulate loading delay for realistic experience
    setTimeout(() => {
      setUser(mockUser)
      setSession({ user: mockUser } as Session)
      setLoading(false)
    }, 1000)

    // Mock auth state changes
    const subscription = {
      unsubscribe: () => {}
    }

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser = {
        id: 'mock-user-id',
        email: 'demo@example.com',
        user_metadata: {
          full_name: 'Demo User'
        }
      } as User

      setUser(mockUser)
      setSession({ user: mockUser } as Session)
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          full_name: 'Demo User'
        }
      } as User

      setUser(mockUser)
      setSession({ user: mockUser } as Session)
    } catch (error) {
      console.error('Error signing in with email:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          full_name: 'Demo User'
        }
      } as User

      setUser(mockUser)
      setSession({ user: mockUser } as Session)
    } catch (error) {
      console.error('Error signing up with email:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}