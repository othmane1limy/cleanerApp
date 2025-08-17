import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, authService } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Initial session found for user:', session.user.id);
          console.log('User metadata:', session.user.user_metadata);
          
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.id);
          setUser(session.user);
          
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error('Profile loading failed:', error);
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated:', session.user.id);
          setUser(session.user);
          await loadUserProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second
    
    try {
      console.log(`Loading profile for user: ${user.id} (attempt ${retryCount + 1})`);
      const userType = user.user_metadata?.user_type;
      console.log('User type from metadata:', userType);
      
      if (!userType) {
        console.log('No user type found in metadata');
        setProfile(null);
        return;
      }

      const tableName = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles';
      console.log('Fetching profile from table:', tableName);
      
      const { data, error } = await authService.getUserProfile(user.id, userType);
      
      if (error) {
        console.error('Error loading user profile:', error);
        
        // If profile not found and we haven't exceeded retry limit, retry
        if (error.code === 'PGRST116' && retryCount < MAX_RETRIES) {
          console.log(`Profile not found, retrying in ${RETRY_DELAY}ms... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            loadUserProfile(user, retryCount + 1);
          }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setProfile(null);
      } else if (data) {
        console.log('Profile loaded successfully:', data);
        setProfile(data);
        setLoading(false);
      } else {
        console.log('No profile data returned');
        
        // If no data and we haven't exceeded retry limit, retry
        if (retryCount < MAX_RETRIES) {
          console.log(`No profile data, retrying in ${RETRY_DELAY}ms... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            loadUserProfile(user, retryCount + 1);
          }, RETRY_DELAY * (retryCount + 1));
          return;
        }
        
        setProfile(null);
      }
    } catch (error) {
      console.error('Exception loading user profile:', error);
      
      // Retry on exception as well
      if (retryCount < MAX_RETRIES) {
        console.log(`Exception occurred, retrying in ${RETRY_DELAY}ms... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          loadUserProfile(user, retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1));
        return;
      }
      
      setProfile(null);
      
    }
  };

  const checkUserProfile = async () => {
    try {
      console.log('Checking user profile...');
      const { hasProfile, user: currentUser, profile: currentProfile } = await authService.checkUserProfile();
      
      console.log('Profile check result:', { hasProfile, userId: currentUser?.id, profileExists: !!currentProfile });
      
      if (hasProfile && currentUser && currentProfile) {
        // Force update profile state if it's not already set
        if (!profile || profile.user_id !== currentUser.id) {
          console.log('Updating profile state from check');
          setProfile(currentProfile);
        }
      }
      
      return { hasProfile, user: currentUser, profile: currentProfile };
    } catch (error) {
      console.error('Error checking user profile:', error);
      return { hasProfile: false, user: null, profile: null };
    }
  };

  // Enhanced sign in with better error handling
  const enhancedSignIn = async (email, password) => {
    try {
      console.log('Starting sign in process...');
      setLoading(true);
      
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        return result;
      }
      
      if (result.data?.user) {
        console.log('Sign in successful, setting user state');
        setUser(result.data.user);
        
        // Load profile with retry logic
        await loadUserProfile(result.data.user);
      }
      
      return result;
    } catch (error) {
      console.error('Sign in exception:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sign up with better profile creation handling
  const enhancedSignUp = async (email, password, userType, userData) => {
    try {
      console.log('Starting sign up process...');
      setLoading(true);
      
      const result = await authService.signUp(email, password, userType, userData);
      
      if (result.error) {
        console.error('Sign up error:', result.error);
        return result;
      }
      
      if (result.data?.user) {
        console.log('Sign up successful, setting user state');
        setUser(result.data.user);
        
        // Wait a bit longer for database trigger to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Load profile with retry logic
        await loadUserProfile(result.data.user);
      }
      
      return result;
    } catch (error) {
      console.error('Sign up exception:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const result = await authService.signOut();
    // The onAuthStateChange listener will handle clearing user/profile
    return result;
  };

  const value = {
    user,
    profile,
    loading,
    checkUserProfile,
    signIn: enhancedSignIn,
    signUp: enhancedSignUp,
    signOut,
    getUserProfile: authService.getUserProfile,
    refreshProfile: () => user ? loadUserProfile(user) : Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};