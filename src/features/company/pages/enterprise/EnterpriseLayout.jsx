import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getCompanyUser } from "../../../../utils/auth";
import { DashboardSidebar } from "../../components/DashboardSidebar";
import { DashboardHeader } from "../../components/DashboardHeader";

const ENTERPRISE_NAV = [
  { path: "lob", label: "LOBs", icon: "▦" },
  { path: "hiring-managers", label: "Hiring Managers", icon: "👤" },
  { path: "backup-hms", label: "Backup HMs", icon: "👥" },
  { path: "recruiters", label: "Recruiters", icon: "🎯" },
];

export default function EnterpriseLayout() {
  const companyUser = getCompanyUser();
  const navigate = useNavigate();

  const goTo = (tab) => {
    if (tab === "Overview") navigate("/company/dashboard");
    else if (tab === "EnterpriseManagement") navigate("/company/enterprise");
    else navigate(`/company/dashboard?tab=${tab}`);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar
        companyUser={companyUser}
        activeTab="EnterpriseManagement"
        showCreate={false}
        goTo={goTo}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader companyUser={companyUser} />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-200 pb-4">
              <NavLink
                to="/company/enterprise"
                end
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`
                }
              >
                Overview
              </NavLink>
              {ENTERPRISE_NAV.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/company/enterprise/${item.path}`}
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
