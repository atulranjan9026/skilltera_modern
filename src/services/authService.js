import { get, post, put, del, setAuthToken, clearAuthToken } from './api';

/**
 * Authentication service - handles all auth-related API calls
 */
export const authService = {
  /**
   * Set JWT token directly (for development/testing)
   */
  // setJWTToken: (token) => {
  //   setAuthToken(token);
  // },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await post('/candidates/auth/login', { email, password });
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response;
  },

  /**
   * Register candidate
   */
  registerCandidate: async (candidateData) => {
    return post('/candidates/auth/signup', candidateData);
  },

  /**
   * Register company
   */
  registerCompany: async (companyData) => {
    return post('/auth/company/signup', companyData);
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      // Send no request body
      const response = await post('/candidates/auth/logout', undefined);
      clearAuthToken();
      return response;
    } catch (error) {
      // Even if backend logout fails, clear local auth
      clearAuthToken();
      throw error;
    }
  },

  /**
   * Verify token
   */
  verifyToken: async (token) => {
    return post('/auth/verify', { token });
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    return post('/candidates/auth/refresh', {});
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return get('/candidates/auth/me');
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return post('/candidates/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    return post('/candidates/auth/reset-password', { token, newPassword });
  },
};
