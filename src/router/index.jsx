import { createBrowserRouter, Navigate } from 'react-router-dom';
// import RootLayout from '../layouts/RootLayout';

// Import modular routes
import authRoutes from './authRoutes';
import jobRoutes from './candidateRoutes';
// import companyRoutes from './companyRoutes';

// Import pages
import NotFound from '../pages/NotFound';

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
        authRoutes,
        jobRoutes,
        // companyRoutes,
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  { future: { v7_startTransition: true } }
);
