// components/RequireCompanyAuth.jsx
// Wrap any route element with this to redirect unauthenticated users to /company/login.
//
// Usage in companyRoutes.js:
//   element: <RequireCompanyAuth><CompanyDashboard /></RequireCompanyAuth>
//   element: <RequireCompanyAuth requireEnterprise><EnterpriseLayout /></RequireCompanyAuth>

import { Navigate, useLocation } from "react-router-dom";
import { isCompanyAuthenticated, getCompanyUser } from "../utils/auth";
import { canAccessEnterprise } from "../features/company/constants";

export default function RequireCompanyAuth({ children, requireEnterprise = false }) {
  const location = useLocation();

  if (!isCompanyAuthenticated()) {
    return <Navigate to="/company/login" state={{ from: location }} replace />;
  }

  if (requireEnterprise && !canAccessEnterprise(getCompanyUser())) {
    return <Navigate to="/company/dashboard" replace />;
  }

  return children;
}