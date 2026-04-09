import { createBrowserRouter, Navigate } from 'react-router-dom';

// Import modular routes
import authRoutes from './authRoutes';
import candidateRoutes from './candidateRoutes';
import companyRoutes from './companyRoutes';
import assessmentRoutes from './assessmentRoutes';
import NotFound from '../pages/NotFound';
import VerifyEmail from '../features/candidates/CandidatesAuth/VerifyEmail';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/jobs-search" replace />,
        },
        { path: 'verify-email', element: <VerifyEmail /> },
        authRoutes,
        candidateRoutes,
        assessmentRoutes,
        companyRoutes,
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  { future: { v7_startTransition: true } }
);
