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
export const NAV_ITEMS = [
    { icon: "▦", label: "Overview", tab: "Overview" },
    { icon: "💼", label: "Job Postings", tab: "Jobs" },
    { icon: "👥", label: "Applications", tab: "Applications" },
    { icon: "📅", label: "Interviews", tab: "Interviews" },
    { icon: "📊", label: "Analytics", tab: "Analytics" },
    { icon: "🏢", label: "Enterprise", tab: "EnterpriseManagement" },
    // Interviewer specific
    { icon: "📅", label: "Interviews", tab: "candidates" },

    { icon: "💬", label: "Messages", tab: "messages" },
];

