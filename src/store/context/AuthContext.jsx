import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';

/**
 * Auth Context - Global authentication state
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Restore user from localStorage
            const parsedUser = JSON.parse(storedUser);
            // console.log('Restoring user from storage:', parsedUser);
            setUser(parsedUser);

            // Verify token and get fresh user data
            // console.log('Fetching fresh user data...');
            const response = await authService.getCurrentUser();
            // console.log('Fresh user response:', response);

            if (response.data) {
              // console.log('Updating user with fresh data:', response.data);
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          } catch (e) {
            console.error('Failed to refresh user data', e);
            // Clear invalid session
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          console.log('No stored session found');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);

      // Backend returns: { success, data: { candidate, accessToken }, message }
      if (response.data) {
        const { candidate, accessToken } = response.data;

        // Store token (authService.login already stores it in localStorage)
        // Store user data in state
        setUser(candidate);

        // Also store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(candidate));
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginWithGoogle(credential);

      if (response.data) {
        const { candidate } = response.data;
        setUser(candidate);
        localStorage.setItem('user', JSON.stringify(candidate));
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Google sign-in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registerCandidate(userData);
      // Backend returns: { success, data: { candidate }, message }
      // User needs to verify email before logging in
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    signup,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth Context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
