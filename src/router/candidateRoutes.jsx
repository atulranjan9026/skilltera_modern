import { Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import LandingPage from '../features/jobs/pages/LandingPage';
import JobSearchPage from '../features/jobs/pages/JobSearchPage';
import UserDashboard from '../features/jobs/pages/UserDashboard';
import ProfilePage from '../features/jobs/pages/ProfilePage';
import CandidateDashboard from '../features/candidates/pages/CandidateDashboard';

/**
 * Job/User routes - Main user-facing pages after login
 * All routes use UserLayout which includes Sidebar and Footer
 */
const jobRoutes = {
  element: <UserLayout />,
  children: [
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: 'jobs-search',
      element: <JobSearchPage />,
    },
    {
      path: 'dashboard',
      element: <UserDashboard />,
    },
    {
      path: 'profile',
      element: <ProfilePage />,
    },
    {
      path: 'candidate',
      element: <CandidateDashboard />,
    },
  ],
};

export default jobRoutes;
