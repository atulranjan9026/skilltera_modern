// components/company/ui.jsx
// Shared presentational components used across all Company pages.
// Import what you need:
//   import { StatusBadge, Spinner, EmptyState, PaginationBar } from "./ui";

// ─── STATUS CONFIGS ────────────────────────────────────────────────────────────

export const STATUS_CFG = {
  applied:     { label: "Applied",     bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  shortlisted: { label: "Shortlisted", bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500" },
  interviewed: { label: "Interview",   bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500" },
  selected:    { label: "Hired",       bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected:    { label: "Rejected",    bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500" },
};

export const JOB_STATUS_CFG = {
  APPROVED: { label: "Approved", bg: "bg-emerald-100", text: "text-emerald-700" },
  PENDING:  { label: "Pending",  bg: "bg-amber-100",   text: "text-amber-700" },
  REJECTED: { label: "Rejected", bg: "bg-rose-100",    text: "text-rose-700" },
};

// ─── BADGES ────────────────────────────────────────────────────────────────────

export function StatusBadge({ status }) {
  const c = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function JobStatusBadge({ status, active }) {
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

export function JobTypePill({ type }) {
  const map = {
    "Full Time": "bg-sky-50 text-sky-700",
    "full-time": "bg-sky-50 text-sky-700",
    Fulltime:    "bg-sky-50 text-sky-700",
    "Part Time": "bg-purple-50 text-purple-700",
    "part-time": "bg-purple-50 text-purple-700",
    Contract:    "bg-orange-50 text-orange-700",
    Internship:  "bg-teal-50 text-teal-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${map[type] || "bg-slate-100 text-slate-600"}`}>
      {type}
    </span>
  );
}

// ─── AVATAR ────────────────────────────────────────────────────────────────────

export function Avatar({ name = "?" }) {
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

// ─── STAT CARD ─────────────────────────────────────────────────────────────────

export function StatCard({ icon, label, value, sub, color }) {
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

// ─── FEEDBACK ──────────────────────────────────────────────────────────────────

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ icon = "📭", message = "No data found", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-slate-400">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-medium text-slate-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-medium">
      <span>⚠️</span> {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-auto font-bold underline">
          Retry
        </button>
      )}
    </div>
  );
}

// ─── PAGINATION ────────────────────────────────────────────────────────────────

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = "items",
  onPrev,
  onNext,
  loading,
}) {
  const hasPrev  = currentPage > 1;
  const hasNext  = currentPage < totalPages;
  const pageCount = Math.max(totalPages, 1);

  // Hide only when we are on the sole page AND there are no items at all
  if (totalPages <= 1 && totalItems <= 0 && currentPage <= 1) return null;

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
            if (pageCount <= 5)              page = i + 1;
            else if (currentPage <= 3)       page = i + 1;
            else if (currentPage >= pageCount - 2) page = pageCount - 4 + i;
            else                             page = currentPage - 2 + i;
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