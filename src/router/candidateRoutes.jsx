import { Navigate } from 'react-router-dom';
import CandidateDashboardLayout from '../layouts/CandidateDashboardLayout';
import CandidateDashboard from '../features/candidates/pages/CandidateDashboard';

/**
 * Candidate-specific routes
 * Protected routes that require candidate authentication
 */
const candidateRoutes = {
  path: 'candidate',
  element: <CandidateDashboardLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <CandidateDashboard />,
    },
    {
      path: 'profile',
      element: <div>Candidate Profile (Coming Soon)</div>,
    },
    {
      path: 'applications',
      element: <div>My Applications (Coming Soon)</div>,
    },
    {
      path: 'saved-jobs',
      element: <div>Saved Jobs (Coming Soon)</div>,
    },
    {
      path: '*',
      element: <Navigate to="/candidate/dashboard" replace />,
    },
  ],
};

export default candidateRoutes;
