/**
 * JWT Authentication utilities for bypassing login
 */
import { authService } from '../services/authService';

// Your JWT token
const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN;
/**
 * Initialize app with JWT token (call this on app startup)
 */
export const initializeWithJWT = () => {
  authService.initWithJWT(JWT_TOKEN);
};

/**
 * Set JWT token manually
 */
export const setJWT = (token) => {
  authService.setJWTToken(token);
};

/**
 * Clear JWT token
 */
export const clearJWT = () => {
  authService.clearJWTToken();
};

/**
 * Check if JWT token is set
 */
export const hasJWT = () => {
  return !!localStorage.getItem('token');
};

// Auto-initialize with the hardcoded JWT token
// Comment this out if you want to set it manually
// initializeWithJWT();
