// components/RequireCompanyAuth.jsx
// Wrap any route element with this to redirect unauthenticated users to /company/login.
//
// Usage in companyRoutes.js:
//   element: <RequireCompanyAuth><CompanyDashboard /></RequireCompanyAuth>

import { Navigate, useLocation } from "react-router-dom";
import { isCompanyAuthenticated } from "../utils/auth";

export default function RequireCompanyAuth({ children }) {
  const location = useLocation();

  if (!isCompanyAuthenticated()) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/company/login" state={{ from: location }} replace />;
  }

  return children;
}