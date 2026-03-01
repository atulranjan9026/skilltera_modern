import { Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import LandingPage from '../features/candidates/LandingPage';
import JobSearchPage from '../features/candidates/JobSearchPage';
import UserDashboard from '../features/candidates/UserDashboard';
import ProfilePage from '../features/candidates/ProfilePage';
import SettingsPage from '../features/candidates/SettingsPage';
import JobDetailsPage from '../features/candidates/JobDetailsPage';
import AssessmentHubPage from '../features/assessment/AssessmentHubPage';
import TestResultsPage from '../features/assessment/components/TestResultsPage';

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
      path: '/jobs-search',
      element: <JobSearchPage />,
    },
    {
      path: '/dashboard',
      element: <UserDashboard />,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '/settings',
      element: <SettingsPage />,
    },
    {
      path: '/job/:jobId',
      element: <JobDetailsPage />,
    },
    {
      path: '/assessments',
      element: <AssessmentHubPage />,
    },
    {
      path: '/test-results',
      element: <TestResultsPage />,
    },
  ],
};

export default jobRoutes;
