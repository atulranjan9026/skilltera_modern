import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../features/auth/pages/Login';
import CandidateSignup from '../features/auth/pages/candidateSignup';

/**
 * Authentication routes - shared for all users
 */
const authRoutes = {
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'signup',
      element: <CandidateSignup />,
    },
    {
      path: '*',
      element: <Navigate to="/auth/login" replace />,
    },
  ],
};

export default authRoutes;
