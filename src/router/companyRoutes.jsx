import { Navigate } from 'react-router-dom';
import CompanyLogin from '../features/company/CompanyAuth/CompanyLogin';

/**
 * Company/Client-specific routes
 * Protected routes that require company authentication
 */
const companyRoutes = {
  path: 'company',
  // element: <CompanyDashboardLayout />, // Uncomment when layout is created
  children: [
    // Company Login
    {
      path: 'login',
      element: <CompanyLogin />,
    },
    // Refer Candidate
    {
      path: 'refer',
      element: <div>Refer Candidate (Coming Soon)</div>,
    },
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <div>Company Dashboard (Coming Soon)</div>,
    },
    {
      path: 'profile',
      element: <div>Company Profile (Coming Soon)</div>,
    },
    {
      path: 'jobs',
      element: <div>Manage Jobs (Coming Soon)</div>,
    },
    {
      path: 'jobs/new',
      element: <div>Post New Job (Coming Soon)</div>,
    },
    {
      path: 'applications',
      element: <div>Applications (Coming Soon)</div>,
    },
    {
      path: 'team',
      element: <div>Team Members (Coming Soon)</div>,
    },
    {
      path: '*',
      element: <Navigate to="/company/dashboard" replace />,
    },
  ],
};

export default companyRoutes;
