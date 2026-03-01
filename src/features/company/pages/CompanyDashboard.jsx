import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { companyService } from "../../../services/companyService";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getCompanyUser() {
  try { return JSON.parse(localStorage.getItem("companyUser")) || {}; }
  catch { return {}; }
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function fmtShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function daysLeft(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / 86400000);
}

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  applied:     { label: "Applied",     bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  shortlisted: { label: "Shortlisted", bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500" },
  interviewed: { label: "Interview",   bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500" },
  selected:    { label: "Hired",       bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected:    { label: "Rejected",    bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500" },
};

const JOB_STATUS_CFG = {
  APPROVED: { label: "Approved", bg: "bg-emerald-100", text: "text-emerald-700" },
  PENDING:  { label: "Pending",  bg: "bg-amber-100",   text: "text-amber-700" },
  REJECTED: { label: "Rejected", bg: "bg-rose-100",    text: "text-rose-700" },
};

const FUNNEL_COLORS = {
  applied:     "#6366f1",
  shortlisted: "#0ea5e9",
  interviewed: "#f59e0b",
  selected:    "#10b981",
  rejected:    "#f43f5e",
};

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const c = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function JobStatusBadge({ status, active }) {
  if (status === "APPROVED" && !active) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
        Closed
      </span>
    );
  }
  const c = JOB_STATUS_CFG[status] || JOB_STATUS_CFG.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function JobTypePill({ type }) {
  const map = {
    "Full Time": "bg-sky-50 text-sky-700",
    Fulltime:    "bg-sky-50 text-sky-700",
    "Part Time": "bg-purple-50 text-purple-700",
    Contract:    "bg-orange-50 text-orange-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${map[type] || "bg-slate-100 text-slate-600"}`}>
      {type}
    </span>
  );
}

function Avatar({ name = "?" }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const palette = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${palette[name.charCodeAt(0) % palette.length]}`}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>{icon}</div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ icon = "📭", message = "No data found", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-slate-400">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-medium text-slate-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function PaginationBar({ currentPage, totalPages, totalItems, itemLabel = "items", onPrev, onNext, loading }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // FIX: Was `totalPages <= 1 && totalItems === 0` — this hid the bar when
  // totalItems was 0 (e.g. API returned count but service didn't map it).
  // Now we only hide if there's genuinely 1 or fewer pages AND no items at all.
  // Also always show if we're past page 1 so the user can navigate back.
  if (totalPages <= 1 && totalItems <= 0 && currentPage <= 1) return null;

  const pageCount = Math.max(totalPages, 1);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-700">{pageCount}</span>
        {totalItems > 0 && (
          <span className="ml-1.5 text-slate-400">· {totalItems} total {itemLabel}</span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev || loading}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${hasPrev && !loading
              ? "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
              : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
            }`}
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
            let page;
            if (pageCount <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= pageCount - 2) {
              page = pageCount - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return (
              <span
                key={page}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all
                  ${page === currentPage
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-500"
                  }`}
              >
                {page}
              </span>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext || loading}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${hasNext && !loading
              ? "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
              : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function CompanyDashboard() {
  const companyUser = getCompanyUser();
  const companyId   = companyUser._id || companyUser.id;

  // ── Jobs state ───────────────────────────────────────────────────────────
  const [jobs,           setJobs]           = useState([]);
  const [jobsPage,       setJobsPage]       = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [totalJobs,      setTotalJobs]      = useState(0);
  const [jobsLoading,    setJobsLoading]    = useState(true);
  const [jobsError,      setJobsError]      = useState(null);

  // ── Applications state ───────────────────────────────────────────────────
  const [applications,   setApplications]   = useState([]);
  const [appsPage,       setAppsPage]       = useState(1);
  const [appsTotalPages, setAppsTotalPages] = useState(1);
  const [totalApps,      setTotalApps]      = useState(0);
  const [appsLoading,    setAppsLoading]    = useState(true);
  const [appsError,      setAppsError]      = useState(null);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState("Overview");
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobSearch,    setJobSearch]    = useState("");
  const [appSearch,    setAppSearch]    = useState("");

  // ── Fetch jobs ────────────────────────────────────────────────────────────
  // FIX: fetchJobs now accepts both page AND search so it always fetches the
  // right combination. Never relies on stale closure values.
  const fetchJobs = useCallback(async (page = 1, search = "") => {
    if (!companyId) return;
    setJobsLoading(true);
    setJobsError(null);
    try {
      // FIX: Pass page AND search to the service. Update companyService.getJobs
      // to accept (companyId, page, { search }) and forward as query params:
      //   GET /api/v1/company/:id/jobs?page=2&search=engineer
      const res = await companyService.getJobs(companyId, page, { search });
      const d   = res?.data;
      setJobs(d?.jobs || []);

      // FIX: Safely parse pagination values — backend sends integers now,
      // but guard anyway in case the service layer wraps/transforms them.
      const pg = d?.pagination || {};
      setTotalJobs(Number(pg.totalJobs)   || d?.jobs?.length || 0);
      setJobsTotalPages(Number(pg.totalPages) || 1);

      // FIX: Sync local page state to what the backend actually used.
      // This prevents mismatch if the backend clamps the page.
      setJobsPage(Number(pg.currentPage) || page);
    } catch {
      setJobsError("Failed to load job postings. Please try again.");
    } finally {
      setJobsLoading(false);
    }
  }, [companyId]);

  // ── Fetch applications ────────────────────────────────────────────────────
  const fetchApplications = useCallback(async (page = 1, search = "", status = "all") => {
    if (!companyId) return;
    setAppsLoading(true);
    setAppsError(null);
    try {
      const res = await companyService.getAllApplications(companyId, page, {
        search,
        status: status === "all" ? undefined : status,
      });
      const d  = res?.data;
      setApplications(d?.applications || []);

      const pg = d?.pagination || {};
      setTotalApps(Number(pg.totalApplications) || d?.applications?.length || 0);
      setAppsTotalPages(Number(pg.totalPages) || 1);
      setAppsPage(Number(pg.currentPage) || page);
    } catch {
      setAppsError("Failed to load applications. Please try again.");
    } finally {
      setAppsLoading(false);
    }
  }, [companyId]);

  // ── Initial load on mount ─────────────────────────────────────────────────
  // FIX: Separate mount effect so initial fetch always runs regardless of
  // search state. Previously the jobSearch useEffect was doing double-duty
  // as the mount trigger, which is fragile.
  useEffect(() => {
    fetchJobs(1, "");
  }, [fetchJobs]); // fetchJobs is stable (memoized on companyId)

  useEffect(() => {
    fetchApplications(1, "", "all");
  }, [fetchApplications]);

  // ── Re-fetch when search/filter changes (debounced) ───────────────────────
  // FIX: Use a debounce so we don't fire an API call on every keystroke.
  useEffect(() => {
    // Skip the very first render — initial load effect above handles that.
    const timer = setTimeout(() => {
      setJobsPage(1);
      fetchJobs(1, jobSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [jobSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppsPage(1);
      fetchApplications(1, appSearch, statusFilter);
    }, 350);
    return () => clearTimeout(timer);
  }, [appSearch, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Page change handlers ──────────────────────────────────────────────────
  // FIX: Pass current search term along with new page so we don't lose the
  // filter when navigating pages.
  const handleJobsPage = (next) => {
    const p = Math.max(1, Math.min(next, jobsTotalPages));
    setJobsPage(p);
    fetchJobs(p, jobSearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAppsPage = (next) => {
    const p = Math.max(1, Math.min(next, appsTotalPages));
    setAppsPage(p);
    fetchApplications(p, appSearch, statusFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Refresh both ──────────────────────────────────────────────────────────
  const refreshAll = () => {
    fetchJobs(jobsPage, jobSearch);
    fetchApplications(appsPage, appSearch, statusFilter);
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const activeJobs  = jobs.filter(j => j.active === true).length;
  const pendingJobs = jobs.filter(j => j.status === "PENDING").length;

  const byStatus    = (s) => applications.filter(a => a.status === s).length;
  const applied     = byStatus("applied");
  const shortlisted = byStatus("shortlisted");
  const interviews  = byStatus("interviewed");
  const selected    = byStatus("selected");
  const rejected    = byStatus("rejected");

  const funnelData = Object.entries({ applied, shortlisted, interviewed: interviews, selected, rejected })
    .map(([key, value]) => ({
      name:  STATUS_CFG[key]?.label || key,
      value,
      color: FUNNEL_COLORS[key],
    }));

  const weeklyTrend = (() => {
    const buckets = {};
    [...applications]
      .sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt))
      .forEach(app => {
        const d   = new Date(app.appliedAt);
        const key = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString("default", { month: "short" })}`;
        if (!buckets[key]) buckets[key] = { week: key, applied: 0, shortlisted: 0, selected: 0 };
        buckets[key].applied++;
        if (app.status === "shortlisted") buckets[key].shortlisted++;
        if (app.status === "selected")    buckets[key].selected++;
      });
    return Object.values(buckets).slice(-6);
  })();

  const appsPerJob = jobs.slice(0, 8).map(job => ({
    name:         (job.jobTitle || "").length > 14 ? job.jobTitle.slice(0, 13) + "…" : job.jobTitle,
    applications: applications.filter(a => a.job?._id === job._id).length,
  }));

  // FIX: No more client-side filtering for jobs — search is now server-side.
  // filteredJobs is just the jobs array returned by the API for the current page.
  const filteredJobs = jobs;

  // Apps filtering remains client-side for status (fast) but search is server-side.
  const filteredApps = applications;

  const interviewApps = applications.filter(a => a.status === "interviewed");

  const NAV = [
    { icon: "⬛", label: "Overview",     tab: "Overview" },
    { icon: "💼", label: "Job Postings", tab: "Jobs",         badge: pendingJobs || null },
    { icon: "👥", label: "Applications", tab: "Applications", badge: totalApps   || null },
    { icon: "📅", label: "Interviews",   tab: "Interviews",   badge: interviews  || null },
    { icon: "📊", label: "Analytics",    tab: "Analytics" },
  ];

  const overviewLoading = jobsLoading || appsLoading;
  const overviewError   = jobsError   || appsError;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="flex h-screen bg-slate-50 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .row-hover:hover { background: #f8fafc; }
        .nav-hover:hover { background: rgba(255,255,255,0.08); }
      `}</style>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0 h-full">
          <div className="px-5 py-5 border-b border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-black">S</div>
              <span className="font-bold text-white text-sm tracking-wide">SkillTera</span>
              <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">PRO</span>
            </div>
          </div>

          <div className="px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm">
                {(companyUser.companyName || "C")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{companyUser.companyName || "Your Company"}</p>
                <p className="text-slate-400 text-[10px] truncate">{companyUser.email || ""}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV.map(item => (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                className={`nav-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left
                  ${activeTab === item.tab
                    ? "bg-white/15 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-slate-700/50">
            <button className="nav-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-all">
              <span>⚙️</span><span>Settings</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors">
            ☰
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              {NAV.find(n => n.tab === activeTab)?.label || activeTab}
            </h1>
            <p className="text-xs text-slate-400">Company Dashboard · {companyUser.companyName || "Company"}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={refreshAll} title="Refresh data"
              className="text-slate-400 hover:text-indigo-600 transition-colors text-base font-bold">
              ↻
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              + Post Job
            </button>
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(companyUser.companyName || "C")[0].toUpperCase()}
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Good morning, {companyUser.companyName || "there"} 👋
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">Here's your hiring overview at a glance.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  📅 {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              {overviewError && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-medium">
                  <span>⚠️</span> {overviewError}
                  <button onClick={refreshAll} className="ml-auto font-bold underline">Retry</button>
                </div>
              )}

              {overviewLoading ? <Spinner /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="💼" label="Total Jobs Posted"  value={totalJobs}  sub={`${activeJobs} active · ${pendingJobs} pending`} color="bg-indigo-50" />
                    <StatCard icon="👥" label="Total Applications" value={totalApps}  sub={`${applied} new · ${shortlisted} shortlisted`}   color="bg-sky-50" />
                    <StatCard icon="📅" label="In Interview Stage" value={interviews} sub={`${shortlisted} shortlisted`}                     color="bg-amber-50" />
                    <StatCard icon="✅" label="Hired"              value={selected}   sub={`${rejected} rejected`}                           color="bg-emerald-50" />
                  </div>

                  {funnelData.some(f => f.value > 0) && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Hiring Funnel</h3>
                      <div className="flex items-end gap-3">
                        {funnelData.map((stage, i) => {
                          const max = Math.max(...funnelData.map(f => f.value), 1);
                          const pct = Math.round((stage.value / max) * 100);
                          return (
                            <div key={i} className="flex-1 text-center">
                              <div className="text-xs font-bold text-slate-700 mb-1">{stage.value}</div>
                              <div className="rounded-xl mx-auto transition-all"
                                style={{ height: `${Math.max(pct * 0.85, 10)}px`, background: stage.color }} />
                              <div className="text-[10px] text-slate-500 mt-1.5 font-medium">{stage.name}</div>
                              <div className="text-[10px] text-slate-400">{pct}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Recent Applications</h3>
                        <button onClick={() => setActiveTab("Applications")} className="text-indigo-600 text-xs font-semibold hover:underline">View all →</button>
                      </div>
                      {applications.length === 0 ? (
                        <EmptyState icon="📭" message="No applications received yet" />
                      ) : (
                        <div className="space-y-1.5">
                          {applications.slice(0, 5).map(app => (
                            <div key={app._id} className="row-hover flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer">
                              <Avatar name={app.candidate?.name} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{app.candidate?.name || "Unknown"}</p>
                                <p className="text-[10px] text-slate-400 truncate">{app.job?.jobTitle || "Unknown Position"}</p>
                              </div>
                              <StatusBadge status={app.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Recent Job Postings</h3>
                        <button onClick={() => setActiveTab("Jobs")} className="text-indigo-600 text-xs font-semibold hover:underline">View all →</button>
                      </div>
                      {jobs.length === 0 ? (
                        <EmptyState icon="💼" message="No jobs posted yet" />
                      ) : (
                        <div className="space-y-1.5">
                          {jobs.slice(0, 5).map(job => {
                            const dl = daysLeft(job.lastDate);
                            return (
                              <div key={job._id} className="row-hover flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">💼</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-800 truncate">{job.jobTitle}</p>
                                  <p className="text-[10px] truncate">
                                    <span className="text-slate-400">{job.city}, {job.state}</span>
                                    {dl !== null && (
                                      <span className={`ml-1.5 font-semibold ${dl <= 3 ? "text-rose-500" : dl <= 7 ? "text-amber-500" : "text-slate-400"}`}>
                                        · {dl > 0 ? `${dl}d left` : "Expired"}
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <JobTypePill type={job.jobType} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── JOB POSTINGS ─────────────────────────────────────────────────── */}
          {activeTab === "Jobs" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Job Postings</h2>
                  <p className="text-sm text-slate-500">
                    {totalJobs} total · {activeJobs} active · {pendingJobs} pending approval
                  </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                  + Post New Job
                </button>
              </div>

              {jobsError && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-medium">
                  <span>⚠️</span> {jobsError}
                  <button onClick={() => fetchJobs(jobsPage, jobSearch)} className="ml-auto font-bold underline">Retry</button>
                </div>
              )}

              <div className="relative w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                <input value={jobSearch} onChange={e => setJobSearch(e.target.value)}
                  placeholder="Search by title or city…"
                  className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full" />
              </div>

              {jobsLoading ? <Spinner /> : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <EmptyState icon="💼" message="No jobs match your search" />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Job Title</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Location</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Type</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Posted</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Deadline</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredJobs.map(job => {
                        const dl = daysLeft(job.lastDate);
                        return (
                          <tr key={job._id} className="row-hover transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">💼</div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{job.jobTitle}</p>
                                  <p className="text-[10px] text-slate-400">
                                    {job.workExperience}+ yrs exp
                                    {job.travelRequired && " · Travel required"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{job.city}, {job.state}</td>
                            <td className="px-5 py-3.5"><JobTypePill type={job.jobType} /></td>
                            <td className="px-5 py-3.5 text-xs text-slate-500">{fmtShort(job.postedOn)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs font-medium ${dl !== null && dl <= 3 ? "text-rose-500 font-semibold" : dl !== null && dl <= 7 ? "text-amber-500 font-semibold" : "text-slate-500"}`}>
                                {fmtShort(job.lastDate)}
                                {dl !== null && dl > 0  && <span className="text-[10px] ml-1 text-slate-400">({dl}d)</span>}
                                {dl !== null && dl <= 0 && <span className="text-[10px] ml-1 text-rose-400">(expired)</span>}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <JobStatusBadge status={job.status} active={job.active} />
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold">View →</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <PaginationBar
                    currentPage={jobsPage}
                    totalPages={jobsTotalPages}
                    totalItems={totalJobs}
                    itemLabel="jobs"
                    onPrev={() => handleJobsPage(jobsPage - 1)}
                    onNext={() => handleJobsPage(jobsPage + 1)}
                    loading={jobsLoading}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── APPLICATIONS ─────────────────────────────────────────────────── */}
          {activeTab === "Applications" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Applications</h2>
                <p className="text-sm text-slate-500">
                  {totalApps} total applications · page {appsPage} of {appsTotalPages}
                </p>
              </div>

              {appsError && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-medium">
                  <span>⚠️</span> {appsError}
                  <button onClick={() => fetchApplications(appsPage, appSearch, statusFilter)} className="ml-auto font-bold underline">Retry</button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1.5 flex-wrap">
                  {["all", "applied", "shortlisted", "interviewed", "selected", "rejected"].map(s => {
                    const count = s === "all"
                      ? totalApps
                      : applications.filter(a => a.status === s).length;
                    return (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border
                          ${statusFilter === s
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
                        {s === "all" ? "All" : STATUS_CFG[s]?.label} ({count})
                      </button>
                    );
                  })}
                </div>
                <div className="relative ml-auto">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                  <input value={appSearch} onChange={e => setAppSearch(e.target.value)}
                    placeholder="Search by name, email, or position…"
                    className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64" />
                </div>
              </div>

              {appsLoading ? <Spinner /> : filteredApps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <EmptyState icon="📭" message="No applications match your filters" />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Candidate</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Position</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Applied On</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Resume</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredApps.map(app => (
                        <tr key={app._id} className="row-hover transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar name={app.candidate?.name} />
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{app.candidate?.name || "—"}</p>
                                <p className="text-[10px] text-slate-400">{app.candidate?.email || ""}</p>
                                {app.candidate?.phone && (
                                  <p className="text-[10px] text-slate-400">{app.candidate.phone}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-medium text-slate-700">{app.job?.jobTitle || "—"}</p>
                            <p className="text-[10px] text-slate-400">{app.job?.jobType || ""}</p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(app.appliedAt)}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                          <td className="px-5 py-3.5">
                            {app.resume?.url ? (
                              <a href={app.resume.url} target="_blank" rel="noreferrer"
                                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline max-w-[140px]">
                                <span>📄</span>
                                <span className="truncate">{app.resume.filename || "View Resume"}</span>
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">No resume</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold transition-colors">Shortlist</button>
                              <button className="text-[10px] bg-amber-50  hover:bg-amber-100  text-amber-700  px-2 py-1 rounded-lg font-semibold transition-colors">Interview</button>
                              <button className="text-[10px] bg-rose-50   hover:bg-rose-100   text-rose-700   px-2 py-1 rounded-lg font-semibold transition-colors">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <PaginationBar
                    currentPage={appsPage}
                    totalPages={appsTotalPages}
                    totalItems={totalApps}
                    itemLabel="applications"
                    onPrev={() => handleAppsPage(appsPage - 1)}
                    onNext={() => handleAppsPage(appsPage + 1)}
                    loading={appsLoading}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── INTERVIEWS ───────────────────────────────────────────────────── */}
          {activeTab === "Interviews" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Interview Pipeline</h2>
                  <p className="text-sm text-slate-500">
                    {interviewApps.length} candidate{interviewApps.length !== 1 ? "s" : ""} in the interview stage
                  </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                  + Schedule Interview
                </button>
              </div>

              {appsLoading ? <Spinner /> : interviewApps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                  <p className="text-4xl mb-3">📅</p>
                  <p className="text-sm font-semibold text-slate-700 mb-1">No candidates in the interview stage yet</p>
                  <p className="text-xs text-slate-400 mb-4">
                    Move candidates to the "Interview" status from the Applications tab.
                  </p>
                  <button onClick={() => setActiveTab("Applications")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                    Go to Applications →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interviewApps.map(app => (
                    <div key={app._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={app.candidate?.name} />
                          <div>
                            <p className="text-sm font-bold text-slate-800">{app.candidate?.name || "—"}</p>
                            <p className="text-xs text-slate-400">{app.job?.jobTitle || "—"}</p>
                          </div>
                        </div>
                        <StatusBadge status="interviewed" />
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 space-y-2 mb-4">
                        {[
                          ["Email",    app.candidate?.email],
                          ["Phone",    app.candidate?.phone],
                          ["Job Type", app.job?.jobType],
                          ["Applied",  fmtDate(app.appliedAt)],
                        ].map(([label, val]) => val ? (
                          <div key={label} className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{label}</span>
                            <span className="text-[10px] font-semibold text-slate-700 truncate text-right">{val}</span>
                          </div>
                        ) : null)}
                      </div>

                      {app.resume?.url && (
                        <a href={app.resume.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline mb-4">
                          📄 View Resume
                        </a>
                      )}

                      {app.statusHistory?.length > 1 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Stage History</p>
                          <div className="flex gap-1 flex-wrap">
                            {app.statusHistory.map((h, i) => (
                              <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${STATUS_CFG[h.status]?.bg || "bg-slate-100"} ${STATUS_CFG[h.status]?.text || "text-slate-600"}`}>
                                {h.status}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-2 rounded-xl transition-colors">Hire ✓</button>
                        <button className="flex-1 bg-rose-50   hover:bg-rose-100   text-rose-700   text-xs font-semibold py-2 rounded-xl transition-colors">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS ────────────────────────────────────────────────────── */}
          {activeTab === "Analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hiring Analytics</h2>
                <p className="text-sm text-slate-500">Computed from your live API data</p>
              </div>

              {(jobsLoading || appsLoading) ? <Spinner /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="📬" label="Total Applications" value={totalApps}
                      sub="From API pagination" color="bg-indigo-50" />
                    <StatCard icon="🎯" label="Shortlist Rate"
                      value={applications.length > 0 ? `${Math.round((shortlisted / applications.length) * 100)}%` : "—"}
                      sub={`${shortlisted} of ${applications.length}`} color="bg-sky-50" />
                    <StatCard icon="✅" label="Hire Rate"
                      value={applications.length > 0 ? `${Math.round((selected / applications.length) * 100)}%` : "—"}
                      sub={`${selected} of ${applications.length}`} color="bg-emerald-50" />
                    <StatCard icon="❌" label="Rejection Rate"
                      value={applications.length > 0 ? `${Math.round((rejected / applications.length) * 100)}%` : "—"}
                      sub={`${rejected} of ${applications.length}`} color="bg-rose-50" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Application Activity by Week</h3>
                      {weeklyTrend.length === 0 ? (
                        <EmptyState icon="📈" message="No application data to display" />
                      ) : (
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={weeklyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week"  tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <YAxis                 tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="applied"     stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="Applied" />
                            <Line type="monotone" dataKey="shortlisted" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} name="Shortlisted" />
                            <Line type="monotone" dataKey="selected"    stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Hired" />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Status Distribution</h3>
                      {funnelData.every(f => f.value === 0) ? (
                        <EmptyState icon="🥧" message="No application data yet" />
                      ) : (
                        <div className="flex items-center gap-4">
                          <ResponsiveContainer width="55%" height={200}>
                            <PieChart>
                              <Pie data={funnelData.filter(f => f.value > 0)}
                                cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                {funnelData.filter(f => f.value > 0).map((e, i) => <Cell key={i} fill={e.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex-1 space-y-2.5">
                            {funnelData.map((d, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                  <span className="text-xs text-slate-600">{d.name}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-bold text-slate-800">{d.value}</span>
                                  <span className="text-[10px] text-slate-400 ml-1">
                                    ({applications.length > 0 ? Math.round((d.value / applications.length) * 100) : 0}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Applications per Job (Current Page)</h3>
                    <p className="text-[10px] text-slate-400 mb-4">Matched by job ID across fetched applications</p>
                    {appsPerJob.every(j => j.applications === 0) ? (
                      <EmptyState icon="📊" message="No matching application data on this page" />
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={appsPerJob} margin={{ left: 0, right: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={0} angle={-15} textAnchor="end" height={50} />
                          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                          <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} name="Applications" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}