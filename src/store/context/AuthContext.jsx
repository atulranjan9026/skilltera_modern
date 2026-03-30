import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { clearAuthData, saveCandidateUser } from '../../utils/auth';

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
        const storedCandidateUser = localStorage.getItem('candidateUser');

        if (token && (storedUser || storedCandidateUser)) {
          try {
            // Restore user from localStorage (prefer candidateUser if available)
            const parsedUser = storedCandidateUser 
              ? JSON.parse(storedCandidateUser) 
              : JSON.parse(storedUser);
            setUser(parsedUser);

            // Verify token and get fresh user data
            const response = await authService.getCurrentUser();

            if (response.data) {
              setUser(response.data);
              // Store to BOTH keys for compatibility
              localStorage.setItem('user', JSON.stringify(response.data));
              localStorage.setItem('candidateUser', JSON.stringify(response.data));
            }
          } catch (e) {
            console.error('Failed to refresh user data', e);
            // Clear invalid session
            clearAuthData();
            setUser(null);
          }
        } else {
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid session
        clearAuthData();
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

      if (response.data?.candidate) {
        const { candidate } = response.data;
        setUser(candidate);
        // Store to BOTH keys for compatibility with auth.js utilities
        localStorage.setItem('user', JSON.stringify(candidate));
        saveCandidateUser(candidate);
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
        // Store to BOTH keys for compatibility with auth.js utilities
        localStorage.setItem('user', JSON.stringify(candidate));
        saveCandidateUser(candidate);
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
        // Store to BOTH keys for compatibility
        localStorage.setItem('user', JSON.stringify(response.data));
        saveCandidateUser(response.data);
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
      // Always clear ALL auth data and state
      clearAuthData(); // Use enhanced clear function
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


