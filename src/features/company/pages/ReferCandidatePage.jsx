import { useState } from "react";
import { Link } from "react-router-dom";
import { ReferCandidateForm } from "../components/referral/ReferCandidateForm";
import { ReferralDashboard } from "../components/referral/ReferralDashboard";
import { getCompanyUser } from "../../../utils/auth";
import { canPostJob, getRoleBadge } from "../constants";

export default function ReferCandidatePage() {
  const [activeTab, setActiveTab] = useState("form");
  const [successMessage, setSuccessMessage] = useState(null);
  const companyUser = getCompanyUser();
  const canRefer = canPostJob(companyUser) || getRoleBadge(companyUser) === "Recruiter";

  return (
    <div
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="min-h-screen bg-slate-50"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/company/dashboard"
              className="text-slate-500 hover:text-slate-800 text-sm font-medium"
            >
              ← Dashboard
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Refer Candidate</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {(companyUser?.name || companyUser?.companyName || "C")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!canRefer ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800">
            <p className="font-medium">You don't have permission to refer candidates.</p>
            <p className="text-sm mt-1">Contact your administrator to get assigned to jobs.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setActiveTab("form"); setSuccessMessage(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === "form" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Refer Candidate
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === "dashboard" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                My Referrals
              </button>
            </div>

            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            {activeTab === "form" ? (
              <ReferCandidateForm
                onSuccess={(msg) => {
                  setSuccessMessage(msg);
                  setTimeout(() => setSuccessMessage(null), 5000);
                }}
              />
            ) : (
              <ReferralDashboard />
            )}
          </>
        )}
      </main>
    </div>
  );
}
