// ─── Job Form Constants ────────────────────────────────────────────────────────
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
export const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Executive"];
export const REMOTE_TYPES = ["On-site", "Hybrid", "Fully-remote"];
export const SALARY_PERIODS = ["Hourly", "Monthly", "Yearly"];
export const CURRENCIES = ["USD", "EUR", "GBP", "INR"];

// ─── Application Status Config ────────────────────────────────────────────────
export const STATUS_CFG = {
    applied: { label: "Applied", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    shortlisted: { label: "Shortlisted", bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
    interviewed: { label: "Interview", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    selected: { label: "Hired", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    rejected: { label: "Rejected", bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
};

export const FUNNEL_COLORS = {
    applied: "#6366f1",
    shortlisted: "#0ea5e9",
    interviewed: "#f59e0b",
    selected: "#10b981",
    rejected: "#f43f5e",
};

// ─── Dashboard Navigation ─────────────────────────────────────────────────────
// Full admin nav (company_admin, company)
export const NAV_ITEMS = [
    { icon: "▦", label: "Overview", tab: "Overview" },
    { icon: "💼", label: "Job Postings", tab: "Jobs" },
    { icon: "👥", label: "Applications", tab: "Applications" },
    { icon: "📅", label: "Interviews", tab: "Interviews" },
    { icon: "📊", label: "Analytics", tab: "Analytics" },
    { icon: "🏢", label: "Enterprise", tab: "EnterpriseManagement" },
];

// Hiring manager: no Enterprise, no Company Profile
export const HIRING_MANAGER_NAV_ITEMS = [
    { icon: "▦", label: "Overview", tab: "Overview" },
    { icon: "💼", label: "Job Postings", tab: "Jobs" },
    { icon: "👥", label: "Applications", tab: "Applications" },
    { icon: "📅", label: "Interviews", tab: "Interviews" },
    { icon: "📊", label: "Analytics", tab: "Analytics" },
];

// Recruiter sees limited nav: jobs assigned to them, refer candidates, their referrals
export const RECRUITER_NAV_ITEMS = [
    { icon: "▦", label: "Overview", tab: "Overview" },
    { icon: "💼", label: "Assigned Jobs", tab: "Jobs" },
    { icon: "👥", label: "Applications", tab: "Applications" },
    { icon: "➕", label: "Refer Candidate", tab: "ReferCandidate" },
];

// Interviewer sees: overview, jobs (view only), applications, interviews
export const INTERVIEWER_NAV_ITEMS = [
    { icon: "▦", label: "Overview", tab: "Overview" },
    { icon: "💼", label: "Jobs", tab: "Jobs" },
    { icon: "👥", label: "Applications", tab: "Applications" },
    { icon: "📅", label: "Interviews", tab: "Interviews" },
];

// ─── Role-based permissions (company_admin, hiring_manager, interviewer, recruiter, company) ───
const ROLES_WITH_POST_JOB = ["company_admin", "company", "hiring_manager"];
const ROLES_WITH_EDIT_JOB = ["company_admin", "company", "hiring_manager"];
const ROLES_WITH_COMPANY_PROFILE = ["company_admin", "company"];
const ROLES_WITH_ENTERPRISE = ["company_admin", "company"];

const getUserRoles = (companyUser) => {
    const roles = companyUser?.roles || [];
    const role = companyUser?.role;
    const primary = role || (roles.includes("company_admin") ? "company_admin" : roles[0]);
    return { roles, role: primary, all: [...new Set([primary, ...roles])] };
};

export const canPostJob = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    return ROLES_WITH_POST_JOB.some((r) => all.includes(r));
};

export const canEditJob = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    return ROLES_WITH_EDIT_JOB.some((r) => all.includes(r));
};

export const canManageCompanyProfile = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    return ROLES_WITH_COMPANY_PROFILE.some((r) => all.includes(r));
};

export const canAccessEnterprise = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    return ROLES_WITH_ENTERPRISE.some((r) => all.includes(r));
};

export const getNavItems = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    if (all.includes("recruiter")) return RECRUITER_NAV_ITEMS;
    if (all.includes("interviewer") && !all.includes("company_admin") && !all.includes("company") && !all.includes("hiring_manager")) {
        return INTERVIEWER_NAV_ITEMS;
    }
    if (all.includes("hiring_manager") && !all.includes("company_admin") && !all.includes("company")) {
        return HIRING_MANAGER_NAV_ITEMS;
    }
    return NAV_ITEMS;
};

export const getDashboardLabel = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    if (all.includes("recruiter")) return "Recruiter Dashboard";
    if (all.includes("interviewer") && !all.includes("company_admin") && !all.includes("company") && !all.includes("hiring_manager")) {
        return "Interviewer Dashboard";
    }
    if (all.includes("hiring_manager")) return "Hiring Manager Dashboard";
    return "Company Dashboard";
};

export const getRoleBadge = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    if (all.includes("recruiter")) return "Recruiter";
    if (all.includes("interviewer") && !all.includes("company_admin") && !all.includes("company") && !all.includes("hiring_manager")) {
        return "Interviewer";
    }
    if (all.includes("hiring_manager")) return "Hiring Manager";
    return null;
};

export const getDisplayName = (companyUser) => {
    const { all } = getUserRoles(companyUser);
    if (all.includes("recruiter") || (all.includes("interviewer") && !all.includes("company_admin") && !all.includes("company") && !all.includes("hiring_manager"))) {
        return companyUser?.name || "User";
    }
    return companyUser?.companyName || companyUser?.name || "Company";
};

export const isRecruiterRole = (companyUser) => {
    const roles = companyUser?.roles || [];
    const role = companyUser?.role;
    return roles.includes("recruiter") || role === "recruiter";
};
