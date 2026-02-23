import { createBrowserRouter, Navigate } from 'react-router-dom';

import authRoutes from './authRoutes';
import jobRoutes from './candidateRoutes';
import companyRoutes from './companyRoutes';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter(
  [
    // ── Auth pages — rendered in RootLayout (WITH navbar) ──────────────────
    // Users see: Company Login, Refer Candidate buttons in navbar
    authRoutes,

    // ── App pages — rendered WITHOUT navbar after login ─────────────────────
    {
      path: '/',
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/jobs-search" replace />,
        },
        jobRoutes,
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