import { AssessmentLayout, AssessmentPage } from '../features/assessment';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Assessment routes - Protected, full-screen layout, no sidebar
 */
const assessmentRoutes = {
  path: 'assessment',
  element: <ProtectedRoute />,
  children: [
    {
      element: <AssessmentLayout />,
      children: [
        {
          index: true,
          element: <AssessmentPage />,
        },
      ],
    },
  ],
};

export default assessmentRoutes;
