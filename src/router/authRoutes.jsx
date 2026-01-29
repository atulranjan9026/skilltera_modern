import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../features/candidates/CondidatesAuth.js/CandidateLogin';
import CandidateSignup from '../features/candidates/CondidatesAuth.js/CandidateSignup';

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
