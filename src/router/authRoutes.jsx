import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import CandidateLogin from '../features/candidates/CandidatesAuth/CandidateLogin';
import CandidateSignup from '../features/candidates/CandidatesAuth/CandidateSignup';
// import CompanyLogin from '../features/company/CompanyAuth/CompanyLogin';

/**
 * Authentication routes - rendered in AuthLayout WITH navbar
 * Users can see Company Login, Refer Candidate links from navbar
 * AuthLayout includes both navbar and left-side branding panel
 */
const authRoutes = {
  path: 'auth',
  element: <AuthLayout />,
  children: [
    { index: true, element: <Navigate to="/auth/login" replace /> },
    { path: 'login', element: <CandidateLogin /> },
    { path: 'signup', element: <CandidateSignup /> },
    // { path: 'company-login', element: <CompanyLogin /> },
    { path: '*', element: <Navigate to="/auth/login" replace /> },
  ],
};

export default authRoutes;
