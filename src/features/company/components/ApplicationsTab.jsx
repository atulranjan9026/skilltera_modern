import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBanner } from "../ui/ErrorBanner";
import { StatusBadge } from "../ui/StatusBadge";
import { Avatar } from "../ui/Avatar";
import { PaginationBar } from "../ui/PaginationBar";
import { STATUS_CFG } from "../constants";
import { fmtDate } from "../helpers";

const STATUS_FILTERS = ["all", "applied", "shortlisted", "interviewed", "selected", "rejected"];

export function ApplicationsTab({
    totalApps, appsPage, appsTotalPages,
    statusFilter, setStatusFilter,
    appSearch, setAppSearch,
    appsLoading, appsError, applications,
    onRetry, handleAppsPage, handleStatusChange,
}) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Applications</h2>
                <p className="text-sm text-slate-500">{totalApps} total · page {appsPage} of {appsTotalPages}</p>
            </div>

            {appsError && <ErrorBanner message={appsError} onRetry={onRetry} />}

            {/* Filters + search */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1.5 flex-wrap">
                    {STATUS_FILTERS.map((s) => {
                        const count = s === "all" ? totalApps : applications.filter((a) => a.status === s).length;
                        return (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${statusFilter === s
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                                    }`}>
                                {s === "all" ? "All" : STATUS_CFG[s]?.label} ({count})
                            </button>
                        );
                    })}
                </div>
                <div className="relative ml-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    <input
                        value={appSearch} onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search by name or position…"
                        className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
                    />
                </div>
            </div>

            {appsLoading ? (
                <Spinner />
            ) : applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState icon="📭" message="No applications match your filters" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Candidate", "Position", "Applied On", "Status", "Resume", "Actions"].map((h) => (
                                    <th key={h} className={`text-left px-5 py-3 text-xs font-semibold text-slate-500 ${h === "Actions" ? "text-center" : ""}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applications.map((app) => (
                                <tr key={app._id} className="row-hover transition-colors">
                                    {/* Candidate */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={app.candidate?.name || "?"} />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{app.candidate?.name || "—"}</p>
                                                <p className="text-[10px] text-slate-400">{app.candidate?.email || ""}</p>
                                                {app.candidate?.phone && <p className="text-[10px] text-slate-400">{app.candidate.phone}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    {/* Position */}
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-slate-700">{app.job?.jobTitle || "—"}</p>
                                        <p className="text-[10px] text-slate-400">{app.job?.jobType || ""}</p>
                                    </td>
                                    {/* Applied On */}
                                    <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(app.appliedAt)}</td>
                                    {/* Status */}
                                    <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                                    {/* Resume */}
                                    <td className="px-5 py-3.5">
                                        {app.resume?.url ? (
                                            <a href={app.resume.url} target="_blank" rel="noreferrer"
                                                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline max-w-[140px]">
                                                <span>📄</span><span className="truncate">{app.resume.filename || "Resume"}</span>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400">No resume</span>
                                        )}
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => handleStatusChange(app._id, "shortlisted")} disabled={app.status === "shortlisted"}
                                                className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40">
                                                Shortlist
                                            </button>
                                            <button onClick={() => handleStatusChange(app._id, "interviewed")} disabled={app.status === "interviewed"}
                                                className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40">
                                                Interview
                                            </button>
                                            <button onClick={() => handleStatusChange(app._id, "rejected")} disabled={app.status === "rejected"}
                                                className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40">
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationBar
                        currentPage={appsPage} totalPages={appsTotalPages} totalItems={totalApps}
                        itemLabel="applications"
                        onPrev={() => handleAppsPage(appsPage - 1)}
                        onNext={() => handleAppsPage(appsPage + 1)}
                        loading={appsLoading}
                    />
                </div>
            )}
        </div>
    );
}
