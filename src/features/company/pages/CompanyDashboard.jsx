import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../../services/companyService";
import { getCompanyUser, getCompanyId } from "../../../utils/auth";
import { STATUS_CFG, FUNNEL_COLORS, NAV_ITEMS } from "../constants";

// Layout
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";

// Feature components
import { CreateJobForm } from "../components/CreateJobForm";
import { OverviewTab } from "../components/OverviewTab";
import { JobsSection } from "../components/job/Jobssection";
import { ApplicationsTab } from "../components/ApplicationsTab";
import { InterviewsTab } from "../components/InterviewsTab";
import { AnalyticsTab } from "../components/AnalyticsTab";
import { CompanyProfile } from "../components/CompanyProfile";
import EnterpriseManagement from "../components/EnterpriseManagement";
import AssignInterviewerModal from "../components/AssignInterviewerModal";
import FeedbackReviewModal from "../components/FeedbackReviewModal";
import CreateInterviewerModal from "../components/CreateInterviewerModal";
import ChatPage from "../../chat/pages/ChatPage";


// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function CompanyDashboard() {
  const navigate = useNavigate();
  const companyUser = getCompanyUser();
  const companyId = getCompanyId();

  // ── Role Redirect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (companyUser?.role === "interviewer") {
      navigate("/company/interviewer-dashboard", { replace: true });
    }
  }, [companyUser, navigate]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // ── Jobs state ────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [jobSearch, setJobSearch] = useState("");
  const jobSearchMounted = useRef(false);

  // ── Applications state ────────────────────────────────────────────────────
  const [applications, setApplications] = useState([]);
  const [appsPage, setAppsPage] = useState(1);
  const [appsTotalPages, setAppsTotalPages] = useState(1);
  const [totalApps, setTotalApps] = useState(0);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [appSearch, setAppSearch] = useState("");
  const appFilterMounted = useRef(false);

  // ── Assignment & Review Modal state ──────────────────────────────────────
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningApp, setAssigningApp] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingApp, setReviewingApp] = useState(null);

  // ── Create Interviewer Modal state ───────────────────────────────────────────
  const [showCreateInterviewerModal, setShowCreateInterviewerModal] = useState(false);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async (page = 1, search = "") => {
    if (!companyId) return;
    setJobsLoading(true);
    setJobsError(null);
    try {
      const res = await companyService.getJobs(companyId, page, { search });
      const d = res?.data;
      setJobs(d?.jobs || []);
      const pg = d?.pagination || {};
      setTotalJobs(Number(pg.totalJobs) || d?.jobs?.length || 0);
      setJobsTotalPages(Number(pg.totalPages) || 1);
      setJobsPage(Number(pg.currentPage) || page);
    } catch {
      setJobsError("Failed to load jobs. Please try again.");
    } finally {
      setJobsLoading(false);
    }
  }, [companyId]);

  const fetchApplications = useCallback(async (page = 1, search = "", status = "all") => {
    if (!companyId) return;
    setAppsLoading(true);
    setAppsError(null);
    try {
      const res = await companyService.getAllApplications(companyId, page, {
        search,
        status: status === "all" ? undefined : status,
      });
      const d = res?.data;
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

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => { fetchJobs(1, ""); }, [fetchJobs]);
  useEffect(() => { fetchApplications(1, "", "all"); }, [fetchApplications]);

  // ── Debounced search re-fetch ─────────────────────────────────────────────
  useEffect(() => {
    if (!jobSearchMounted.current) { jobSearchMounted.current = true; return; }
    const t = setTimeout(() => { setJobsPage(1); fetchJobs(1, jobSearch); }, 350);
    return () => clearTimeout(t);
  }, [jobSearch]); // eslint-disable-line

  useEffect(() => {
    if (!appFilterMounted.current) { appFilterMounted.current = true; return; }
    const t = setTimeout(() => { setAppsPage(1); fetchApplications(1, appSearch, statusFilter); }, 350);
    return () => clearTimeout(t);
  }, [appSearch, statusFilter]); // eslint-disable-line

  // ── Pagination handlers ───────────────────────────────────────────────────
  const handleJobsPage = (next) => {
    const p = Math.max(1, Math.min(next, jobsTotalPages));
    setJobsPage(p); fetchJobs(p, jobSearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAppsPage = (next) => {
    const p = Math.max(1, Math.min(next, appsTotalPages));
    setAppsPage(p); fetchApplications(p, appSearch, statusFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateInterviewer = () => {
    setShowCreateInterviewerModal(true);
  };

  const handleInterviewerCreated = () => {
    // Refresh data or show success message as needed
    refreshAll();
  };

  // ── Application status update ──────────────────────────────────────────────
  const handleStatusChange = async (applicationId, newStatus) => {
    if (newStatus === "interviewed") {
      const app = applications.find((a) => a._id === applicationId);
      if (app) {
        setAssigningApp(app);
        setShowAssignModal(true);
        return;
      }
    }

    try {
      await companyService.updateApplicationStatus(companyId, applicationId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
      );
    } catch {
      alert("Failed to update status. Please try again.");
    }
  };

  const refreshAll = () => {
    fetchJobs(jobsPage, jobSearch);
    fetchApplications(appsPage, appSearch, statusFilter);
  };

  const handleAssignSuccess = (interviewerIds) => {
    if (!assigningApp) return;
    setApplications((prev) =>
      prev.map((a) =>
        a._id === assigningApp._id
          ? { ...a, status: "interviewed", assignedInterviewers: interviewerIds }
          : a
      )
    );
    setAssigningApp(null);
  };
  // ── Derived / memoised stats ──────────────────────────────────────────────
  const activeJobs = useMemo(() => jobs.filter((j) => j.status === 'APPROVED').length, [jobs]);
  const pendingJobs = useMemo(() => jobs.filter((j) => j.status === "Pending").length, [jobs]);
  const byStatus = useCallback((s) => applications.filter((a) => a.status === s).length, [applications]);

  const { applied, shortlisted, interviews, selected, rejected } = useMemo(() => ({
    applied: byStatus("applied"),
    shortlisted: byStatus("shortlisted"),
    interviews: byStatus("interviewed"),
    selected: byStatus("selected"),
    rejected: byStatus("rejected"),
  }), [byStatus]);

  const funnelData = useMemo(() =>
    Object.entries({ applied, shortlisted, interviewed: interviews, selected, rejected }).map(([key, value]) => ({
      name: STATUS_CFG[key]?.label || key,
      value,
      color: FUNNEL_COLORS[key],
    })),
    [applied, shortlisted, interviews, selected, rejected]);

  const weeklyTrend = useMemo(() => {
    const buckets = {};
    [...applications]
      .sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt))
      .forEach((app) => {
        const d = new Date(app.appliedAt);
        const key = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString("default", { month: "short" })}`;
        if (!buckets[key]) buckets[key] = { week: key, applied: 0, shortlisted: 0, selected: 0 };
        buckets[key].applied++;
        if (app.status === "shortlisted") buckets[key].shortlisted++;
        if (app.status === "selected") buckets[key].selected++;
      });
    return Object.values(buckets).slice(-6);
  }, [applications]);

  const appsPerJob = useMemo(() =>
    jobs.slice(0, 8).map((job) => ({
      name: (job.jobTitle || "").length > 14 ? job.jobTitle.slice(0, 13) + "…" : job.jobTitle,
      applications: applications.filter((a) => a.job?._id === job._id).length,
    })),
    [jobs, applications]);

  const interviewApps = useMemo(
    () => applications.filter((a) => a.status === "interviewed"),
    [applications]
  );


  // ── Navigation helper ─────────────────────────────────────────────────────
  const goTo = (tab) => { setActiveTab(tab); setShowCreate(false); };

  // ── Sidebar nav badges ────────────────────────────────────────────────────
  // Derive dynamic badge counts from NAV_ITEMS — no need to maintain a parallel list
  const BADGE_MAP = { Jobs: pendingJobs, Applications: totalApps, Interviews: interviews };
  const navWithBadges = NAV_ITEMS.map(({ tab }) => ({ tab, badge: BADGE_MAP[tab] || null }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        .row-hover:hover{background:#f8fafc}
        .nav-item:hover{background:rgba(255,255,255,0.08)}
      `}</style>

      {/* Sidebar */}
      {sidebarOpen && (
        <DashboardSidebar
          companyUser={companyUser}
          activeTab={activeTab}
          showCreate={showCreate}
          goTo={goTo}
          navBadges={navWithBadges}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          activeTab={activeTab}
          showCreate={showCreate}
          companyUser={companyUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onRefresh={refreshAll}
          onPostJob={() => { setActiveTab("Jobs"); setShowCreate(true); }}
          setShowCreate={setShowCreate}
          onCreateInterviewer={handleCreateInterviewer}
          goTo={goTo}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Create Job form */}
          {showCreate && (
            <CreateJobForm
              companyId={companyId}
              onSuccess={() => { setShowCreate(false); setActiveTab("Jobs"); fetchJobs(1, ""); }}
              onCancel={() => setShowCreate(false)}
            />
          )}

          {/* Overview */}
          {!showCreate && activeTab === "Overview" && (
            <OverviewTab
              companyUser={companyUser}
              jobsLoading={jobsLoading} appsLoading={appsLoading}
              jobsError={jobsError} appsError={appsError}
              totalJobs={totalJobs} activeJobs={activeJobs} pendingJobs={pendingJobs}
              totalApps={totalApps} applied={applied} shortlisted={shortlisted}
              interviews={interviews} selected={selected} rejected={rejected}
              funnelData={funnelData} jobs={jobs} applications={applications}
              onRetry={refreshAll} goTo={goTo}
            />
          )}

          {/* Job Postings */}
          {!showCreate && activeTab === "Jobs" && (
            <JobsSection
              totalJobs={totalJobs} activeJobs={activeJobs} pendingJobs={pendingJobs}
              jobSearch={jobSearch} setJobSearch={setJobSearch}
              jobsLoading={jobsLoading} jobsError={jobsError} jobs={jobs}
              jobsPage={jobsPage} jobsTotalPages={jobsTotalPages}
              onPostNew={() => setShowCreate(true)}
              onRetry={() => fetchJobs(jobsPage, jobSearch)}
              handleJobsPage={handleJobsPage}
            />
          )}

          {/* Applications */}
          {!showCreate && activeTab === "Applications" && (
            <ApplicationsTab
              totalApps={totalApps} appsPage={appsPage} appsTotalPages={appsTotalPages}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              appSearch={appSearch} setAppSearch={setAppSearch}
              appsLoading={appsLoading} appsError={appsError} applications={applications}
              onRetry={() => fetchApplications(appsPage, appSearch, statusFilter)}
              handleAppsPage={handleAppsPage}
              handleStatusChange={handleStatusChange}
            />
          )}

          {/* Interviews */}
          {!showCreate && activeTab === "Interviews" && (
            <InterviewsTab
              appsLoading={appsLoading}
              interviewApps={interviewApps}
              handleStatusChange={handleStatusChange}
              onViewFeedback={(app) => {
                setReviewingApp(app);
                setShowReviewModal(true);
              }}
              goTo={goTo}
            />
          )}

          {/* Analytics */}
          {!showCreate && activeTab === "Analytics" && (
            <AnalyticsTab
              jobsLoading={jobsLoading} appsLoading={appsLoading}
              totalApps={totalApps} shortlisted={shortlisted}
              selected={selected} rejected={rejected}
              applications={applications} funnelData={funnelData}
              weeklyTrend={weeklyTrend} appsPerJob={appsPerJob}
            />
          )}

          {/* CompanyProfile */}
          {!showCreate && activeTab === "CompanyProfile" && companyUser?.role === "company" && (
            <CompanyProfile
              companyUser={companyUser}
              companyId={companyId}
              onRetry={refreshAll}
            />
          )}

          {/* EnterpriseManagement */}
          {!showCreate && activeTab === "EnterpriseManagement" && companyUser?.role === "company" && (
            <EnterpriseManagement />
          )}

          {/* Messages */}
          {!showCreate && activeTab === "messages" && (
            <div className="h-full flex flex-col -mt-6 -mx-6 relative">
              <div className="flex-1 overflow-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <ChatPage />
              </div>
            </div>
          )}

          {/* Assignment Modal */}
          {showAssignModal && (
            <AssignInterviewerModal
              isOpen={showAssignModal}
              onClose={() => {
                setShowAssignModal(false);
                setAssigningApp(null);
              }}
              application={assigningApp}
              onAssign={handleAssignSuccess}
            />
          )}

          {/* Feedback Review Modal */}
          {showReviewModal && (
            <FeedbackReviewModal
              isOpen={showReviewModal}
              onClose={() => {
                setShowReviewModal(false);
                setReviewingApp(null);
              }}
              application={reviewingApp}
              onAction={handleStatusChange}
            />
          )}

          {/* Create Interviewer Modal */}
          {showCreateInterviewerModal && (
            <CreateInterviewerModal
              open={showCreateInterviewerModal}
              onClose={() => setShowCreateInterviewerModal(false)}
              onSuccess={handleInterviewerCreated}
            />
          )}

        </main>
      </div>
    </div>
  );
}