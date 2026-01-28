import { api } from './api';

/**
 * Authentication service - handles all auth-related API calls
 */
export const authService = {
  /**
   * Login user
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Register candidate
   */
  registerCandidate: async (candidateData) => {
    return api.post('/auth/candidate/signup', candidateData);
  },

  /**
   * Register company
   */
  registerCompany: async (companyData) => {
    return api.post('/auth/company/signup', companyData);
  },

  /**
   * Logout user
   */
  logout: async () => {
    return api.post('/auth/logout', {});
  },

  /**
   * Verify token
   */
  verifyToken: async (token) => {
    return api.post('/auth/verify', { token });
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    return api.post('/auth/refresh', {});
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
};
