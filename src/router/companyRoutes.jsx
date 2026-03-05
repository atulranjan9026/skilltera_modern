// routes/companyRoutes.js
import { Navigate } from "react-router-dom";
import CompanyLogin from "../features/company/CompanyAuth/CompanyLogin";
import CompanyDashboard from "../features/company/pages/CompanyDashboard";

import AuthLayout from "../layouts/AuthLayout";
import RequireCompanyAuth from "../components/RequireCompanyAuth";

// ─── Tiny helper so we don't repeat <RequireCompanyAuth> on every route ───────
const guarded = (element) => <RequireCompanyAuth>{element}</RequireCompanyAuth>;

const companyRoutes = {
  path: "company",
  children: [
    // ── Public ──────────────────────────────────────────────────────────────
    {
      path: "login",
      element: <AuthLayout />,
      children: [{ index: true, element: <CompanyLogin /> }],
    },

    // ── Default redirect ─────────────────────────────────────────────────
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },

    // ── Protected ────────────────────────────────────────────────────────
    {
      path: "dashboard",
      element: guarded(<CompanyDashboard />),
    },
    // {
    //   path: "profile",
    //   element: guarded(<CompanyProfile />),
    // },
    // {
    //   path: "jobs",
    //   element: guarded(<ManageJobs />),
    // },
    // {
    //   path: "jobs/new",
    //   element: guarded(<CreateJob />),
    // },
    // {
    //   path: "applications",
    //   element: guarded(<Applications />),
    // },
    // {
    //   path: "team",
    //   element: guarded(<TeamMembers />),
    // },
    {
      path: "refer",
      // Placeholder – replace with a real component when ready
      element: guarded(<div className="p-8 text-slate-500">Refer Candidate – Coming Soon</div>),
    },

    // ── Catch-all ────────────────────────────────────────────────────────
    {
      path: "*",
      element: <Navigate to="/company/dashboard" replace />,
    },
  ],
};

export default companyRoutes;