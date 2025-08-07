
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kzzlfntrzpaugtgezxxr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6emxmbnRyenBhdWd0Z2V6eHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzY0MjYsImV4cCI6MjA2OTkxMjQyNn0.l1HFO_faIOpmLn4nNs4eO8YQSAVbo5KF2hE0Kj8xUyI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authService = {
  // Sign up user (client or cleaner)
  async signUp(email, password, userType, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...userData
        }
      }
    })
    return { data, error }
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  async getUserProfile(userId, userType) {
    const table = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles'
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  }
}
