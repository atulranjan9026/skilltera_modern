import { useState, useEffect } from "react";
import { companyService } from "../../../../services/companyService";
import { Spinner } from "../../ui/Spinner";
import { EmptyState } from "../../ui/EmptyState";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800",
  notified: "bg-sky-100 text-sky-800",
  applied: "bg-indigo-100 text-indigo-800",
  shortlisted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export function ReferralDashboard() {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [refRes, statsRes] = await Promise.all([
        companyService.getRecruiterReferrals(),
        companyService.getRecruiterReferralStats(),
      ]);
      setReferrals(refRes?.data?.referrals || refRes?.referrals || []);
      setStats(statsRes?.data?.statistics || statsRes?.statistics || null);
    } catch {
      setReferrals([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReferrals = referrals.filter((ref) => {
    if (statusFilter !== "all" && ref.status !== statusFilter) return false;
    if (jobFilter !== "all") {
      const jid = ref.jobId?._id || ref.jobId;
      if (jid?.toString() !== jobFilter) return false;
    }
    return true;
  });

  const jobsForFilter = [...new Map(
    referrals
      .map((r) => {
        const j = r.jobId;
        const id = j?._id || j;
        return id ? [id.toString(), { id, title: j?.title || j?.jobTitle || "Job" }] : null;
      })
      .filter(Boolean)
  ).values()];

  const exportToCSV = () => {
    const headers = ["Candidate Name", "Email", "Job", "Status", "Referred Date"];
    const rows = filteredReferrals.map((r) => [
      r.candidateName,
      r.candidateEmail,
      r.jobId?.title || r.jobId?.jobTitle || "N/A",
      r.status,
      new Date(r.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referrals-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Total</p>
            <p className="text-xl font-bold text-slate-900">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Pending</p>
            <p className="text-xl font-bold text-amber-600">{stats.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Notified</p>
            <p className="text-xl font-bold text-sky-600">{stats.notified || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Applied</p>
            <p className="text-xl font-bold text-indigo-600">{stats.applied || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Shortlisted</p>
            <p className="text-xl font-bold text-emerald-600">{stats.shortlisted || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Rejected</p>
            <p className="text-xl font-bold text-rose-600">{stats.rejected || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="notified">Notified</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Job</label>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
            >
              <option value="all">All Jobs</option>
              {jobsForFilter.map((j) => (
                <option key={j.id} value={j.id.toString()}>{j.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={exportToCSV}
            className="ml-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {filteredReferrals.length === 0 ? (
            <div className="p-12">
              <EmptyState icon="📭" message="No referrals yet" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Candidate</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Email</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Job</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Referred</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((ref) => (
                  <tr key={ref._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-slate-800 font-medium">{ref.candidateName}</td>
                    <td className="px-6 py-3 text-slate-600">{ref.candidateEmail}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {ref.jobId?.title || ref.jobId?.jobTitle || "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[ref.status] || "bg-slate-100 text-slate-700"}`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
