import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerkAuth = publishableKey ? useClerkAuth() : null;
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 1, public_settings: {} });

  useEffect(() => {
    checkAppState();
  }, [clerkAuth]);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // Mock app state check
      setAppPublicSettings({ id: 1, public_settings: {} });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('App state check failed:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'Failed to load app'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    if (!publishableKey) {
      // Clerk not configured, set default state
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    if (clerkAuth.isLoaded) {
      setIsAuthenticated(clerkAuth.isSignedIn);
      if (clerkAuth.user) {
        setUser({
          id: clerkAuth.user.id,
          email: clerkAuth.user.emailAddresses[0]?.emailAddress,
          firstName: clerkAuth.user.firstName,
          lastName: clerkAuth.user.lastName,
          role: clerkAuth.user.publicMetadata?.role || 'Customer',
        });
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [clerkAuth, publishableKey]);

  const logout = (shouldRedirect = true) => {
    if (clerkAuth) {
      clerkAuth.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const roleHierarchy = {
      'Customer': 0,
      'Employee': 1,
      'Admin': 2,
      'SuperAdmin': 3,
    };
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkAppState,
      hasRole,
      clerkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
