import { get, post, put, del, setAuthToken, clearAuthToken } from './api';

/**
 * Authentication service - handles all auth-related API calls
 */
export const authService = {
  /**
   * Set JWT token directly (bypass login)
   */
  setJWTToken: (token) => {
    setAuthToken(token);
  },

  /**
   * Clear JWT token
   */
  clearJWTToken: () => {
    clearAuthToken();
  },

  /**
   * Initialize with JWT token (for bypassing login)
   */
  initWithJWT: (token) => {
    setAuthToken(token);
    console.log('JWT token set successfully');
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await post('/auth/login', { email, password });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Register candidate
   */
  registerCandidate: async (candidateData) => {
    return post('/auth/candidate/signup', candidateData);
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
    const response = await post('/auth/logout', {});
    clearAuthToken();
    return response;
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
    return post('/auth/refresh', {});
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return post('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    return post('/auth/reset-password', { token, newPassword });
  },
};
