import { Link } from "react-router-dom";
import { Building2, Users, UserPlus, UserCheck } from "lucide-react";

const CARDS = [
  { path: "lob", label: "LOBs", desc: "Manage Lines of Business", icon: Building2 },
  { path: "hiring-managers", label: "Hiring Managers", desc: "Create and manage hiring managers", icon: Users },
  { path: "backup-hms", label: "Backup HMs", desc: "Manage backup hiring managers", icon: UserPlus },
  { path: "recruiters", label: "Recruiters", desc: "Manage recruiters and referrals", icon: UserCheck },
];

export default function EnterpriseIndex() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Enterprise Management</h1>
      <p className="text-slate-500 mt-1 mb-8">Manage your company's organizational structure</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ path, label, desc, icon: Icon }) => (
          <Link
            key={path}
            to={`/company/enterprise/${path}`}
            className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{label}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
