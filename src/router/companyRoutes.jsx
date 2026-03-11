// router/companyRoutes.jsx
import { Navigate } from "react-router-dom";
import CompanyLogin from "../features/company/CompanyAuth/CompanyLogin";
import CompanyDashboard from "../features/company/pages/CompanyDashboard";
import ReferCandidatePage from "../features/company/pages/ReferCandidatePage";

import AuthLayout from "../layouts/AuthLayout";
import RequireCompanyAuth from "../components/RequireCompanyAuth";

import EnterpriseLayout from "../features/company/pages/enterprise/EnterpriseLayout";
import EnterpriseIndex from "../features/company/pages/enterprise/EnterpriseIndex";
import LOBPage from "../features/company/pages/enterprise/LOBPage";
import HiringManagersPage from "../features/company/pages/enterprise/HiringManagersPage";
import HiringManagerFormPage from "../features/company/pages/enterprise/HiringManagerFormPage";
import HiringManagersBulkPage from "../features/company/pages/enterprise/HiringManagersBulkPage";
import BackupHMsPage from "../features/company/pages/enterprise/BackupHMsPage";
import BackupHMFormPage from "../features/company/pages/enterprise/BackupHMFormPage";
import RecruitersPage from "../features/company/pages/enterprise/RecruitersPage";
import RecruiterFormPage from "../features/company/pages/enterprise/RecruiterFormPage";
import RecruitersBulkPage from "../features/company/pages/enterprise/RecruitersBulkPage";

const guarded = (element) => <RequireCompanyAuth>{element}</RequireCompanyAuth>;
const guardedEnterprise = (element) => <RequireCompanyAuth requireEnterprise>{element}</RequireCompanyAuth>;

const companyRoutes = {
  path: "company",
  children: [
    {
      path: "login",
      element: <AuthLayout />,
      children: [{ index: true, element: <CompanyLogin /> }],
    },

    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },

    {
      path: "dashboard",
      element: guarded(<CompanyDashboard />),
    },
    {
      path: "refer",
      element: guarded(<ReferCandidatePage />),
    },

    // ── Enterprise Management (multipage) ───────────────────────────────────
    {
      path: "enterprise",
      element: guardedEnterprise(<EnterpriseLayout />),
      children: [
        { index: true, element: <EnterpriseIndex /> },
        { path: "lob", element: <LOBPage /> },
        { path: "hiring-managers", element: <HiringManagersPage /> },
        { path: "hiring-managers/new", element: <HiringManagerFormPage /> },
        { path: "hiring-managers/bulk", element: <HiringManagersBulkPage /> },
        { path: "hiring-managers/:id/edit", element: <HiringManagerFormPage /> },
        { path: "backup-hms", element: <BackupHMsPage /> },
        { path: "backup-hms/new", element: <BackupHMFormPage /> },
        { path: "backup-hms/:id/edit", element: <BackupHMFormPage /> },
        { path: "recruiters", element: <RecruitersPage /> },
        { path: "recruiters/new", element: <RecruiterFormPage /> },
        { path: "recruiters/bulk", element: <RecruitersBulkPage /> },
        { path: "recruiters/:id/edit", element: <RecruiterFormPage /> },
      ],
    },

    {
      path: "*",
      element: <Navigate to="/company/dashboard" replace />,
    },
  ],
};

export default companyRoutes;
