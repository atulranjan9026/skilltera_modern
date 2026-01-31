import { authService } from '../services/authService';

/**
 * Development utility to initialize JWT token from environment variables
 * This is useful for development/testing when you want to bypass the login flow
 * 
 * Usage:
 * 1. Add VITE_JWT_TOKEN to your .env file
 * 2. Call initDevAuth() in your App.jsx or main.jsx
 */
// export const initDevAuth = () => {
//     const devToken = import.meta.env.VITE_JWT_TOKEN;

//     if (devToken) {
//         console.log('🔐 Initializing development authentication...');
//         authService.setJWTToken(devToken);
//         console.log('✅ Development token set successfully');
//     } else {
//         console.log('ℹ️ No development token found in environment variables');
//     }
// };

/**
 * Check if user is authenticated (has token in localStorage)
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Get current token
 */
export const getToken = () => {
    return localStorage.getItem('token');
};
