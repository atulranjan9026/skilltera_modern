// router/companyRoutes.jsx
import { Navigate } from "react-router-dom";
import CompanyLogin from "../features/company/CompanyAuth/CompanyLogin";
import CompanyForgotPassword from "../features/company/CompanyAuth/CompanyForgotPassword";
import CompanyResetPassword from "../features/company/CompanyAuth/CompanyResetPassword";
import CompanyDashboard from "../features/company/pages/CompanyDashboard";
import InterviewerDashboard from "../features/company/pages/InterviewerDashboard";
import ChatPage from "../features/chat/pages/ChatPage";

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
    {
      path: "forgot-password",
      element: <AuthLayout />,
      children: [{ index: true, element: <CompanyForgotPassword /> }],
    },
    {
      path: "reset-password",
      element: <AuthLayout />,
      children: [{ index: true, element: <CompanyResetPassword /> }],
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
    {
      path: "interviewer-dashboard",
      element: guarded(<InterviewerDashboard />),
    },
    {
      path: "refer",
      // Placeholder – replace with a real component when ready
      element: guarded(<div className="p-8 text-slate-500">Refer Candidate – Coming Soon</div>),
    },
    {
      path: "chat",
      element: guarded(<ChatPage />),
    },

    // ── Catch-all ────────────────────────────────────────────────────────
    {
      path: "*",
      element: <Navigate to="/company/dashboard" replace />,
    },
  ],
};

export default companyRoutes;
