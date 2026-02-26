import { Navigate } from 'react-router-dom';
import CompanyLogin from '../features/company/CompanyAuth/CompanyLogin';
import CompanyDashboard from '../features/company/pages/CompanyDashboard';
import CompanyProfile from '../features/company/pages/CompanyProfile';
import ManageJobs from '../features/company/pages/ManageJobs';
import PostJob from '../features/company/pages/PostJob';
import Applications from '../features/company/pages/Applications';
import TeamMembers from '../features/company/pages/TeamMembers';
import AuthLayout from '../layouts/AuthLayout';

const companyRoutes = {
  path: 'company',
  children: [
    {
      path: 'login',
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <CompanyLogin />,
        },
      ],
    },
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
      element: <CompanyDashboard />,
    },
    {
      path: 'profile',
      element: <CompanyProfile />,
    },
    {
      path: 'jobs',
      element: <ManageJobs />,
    },
    {
      path: 'jobs/new',
      element: <PostJob />,
    },
    {
      path: 'applications',
      element: <Applications />,
    },
    {
      path: 'team',
      element: <TeamMembers />,
    },
    {
      path: '*',
      element: <Navigate to="/company/dashboard" replace />,
    },
  ],
};

export default companyRoutes;