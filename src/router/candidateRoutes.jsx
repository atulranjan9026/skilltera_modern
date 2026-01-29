import { Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import LandingPage from '../features/candidates/LandingPage';
import JobSearchPage from '../features/candidates/JobSearchPage';
import UserDashboard from '../features/candidates/UserDashboard';
import ProfilePage from '../features/candidates/ProfilePage';

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
  ],
};

export default jobRoutes;
