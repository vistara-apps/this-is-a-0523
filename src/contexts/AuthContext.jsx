import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, createUserProfile, getUserProfile } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      let profile = await getUserProfile(userId);
      
      // Create profile if it doesn't exist
      if (!profile && user) {
        profile = await createUserProfile(userId, user.email);
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;
  };

  const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  // Mock authentication for development (when Supabase is not configured)
  const mockSignIn = async (email) => {
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      created_at: new Date().toISOString()
    };
    
    const mockProfile = {
      user_id: mockUser.id,
      email: email,
      subscription_status: 'free',
      created_at: new Date().toISOString()
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    
    // Store in localStorage for persistence
    localStorage.setItem('jobmatch-mock-user', JSON.stringify(mockUser));
    localStorage.setItem('jobmatch-mock-profile', JSON.stringify(mockProfile));
    
    return { user: mockUser };
  };

  const mockSignOut = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('jobmatch-mock-user');
    localStorage.removeItem('jobmatch-mock-profile');
  };

  // Load mock user on mount if no real auth is configured
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL && !user) {
      const mockUser = localStorage.getItem('jobmatch-mock-user');
      const mockProfile = localStorage.getItem('jobmatch-mock-profile');
      
      if (mockUser && mockProfile) {
        setUser(JSON.parse(mockUser));
        setUserProfile(JSON.parse(mockProfile));
      }
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    mockSignIn,
    mockSignOut,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
