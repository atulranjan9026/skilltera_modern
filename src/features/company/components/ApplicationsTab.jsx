import { useState, useMemo } from "react";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBanner } from "../ui/ErrorBanner";
import { StatusBadge } from "../ui/StatusBadge";
import { Avatar } from "../ui/Avatar";
import { PaginationBar } from "../ui/PaginationBar";
import { STATUS_CFG } from "../constants";
import { fmtDate } from "../helpers";
import { CandidateDetailsView } from "./CandidateDetailsView";

const STATUS_FILTERS = ["all", "applied", "shortlisted", "interviewed", "selected", "rejected"];

export function ApplicationsTab({
    totalApps, appsPage, appsTotalPages,
    statusFilter, setStatusFilter,
    appSearch, setAppSearch,
    appsLoading, appsError, applications,
    onRetry, handleAppsPage, handleStatusChange,
}) {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [advancedFilters, setAdvancedFilters] = useState({
        status: [],
        jobType: [],
        appliedDateRange: null,
        sortBy: "recent",
    });

    // Memoized filtered results - prevents unnecessary recalculations
    const filteredApplications = useMemo(() => {
        let result = applications;

        // Search filter
        if (appSearch) {
            const query = appSearch.toLowerCase();
            result = result.filter((app) =>
                app.candidate?.name?.toLowerCase().includes(query) ||
                app.candidate?.email?.toLowerCase().includes(query) ||
                app.job?.jobTitle?.toLowerCase().includes(query)
            );
        }

        // Status filter from quick buttons
        if (statusFilter !== "all") {
            result = result.filter((app) => app.status === statusFilter);
        }

        // Advanced status filter
        if (advancedFilters.status.length > 0) {
            result = result.filter((app) => advancedFilters.status.includes(app.status));
        }

        // Job type filter
        if (advancedFilters.jobType.length > 0) {
            result = result.filter((app) => advancedFilters.jobType.includes(app.job?.jobType));
        }

        // Date range filter
        if (advancedFilters.appliedDateRange) {
            const { start, end } = advancedFilters.appliedDateRange;
            result = result.filter((app) => {
                const appDate = new Date(app.appliedAt);
                if (start && appDate < start) return false;
                // Add one day to end date to include the whole day
                if (end) {
                    const nextDay = new Date(end);
                    nextDay.setDate(nextDay.getDate() + 1);
                    if (appDate >= nextDay) return false;
                }
                return true;
            });
        }

        // Sorting logic
        switch (advancedFilters.sortBy) {
            case "recent":
                result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
                break;
            case "name-asc":
                result.sort((a, b) =>
                    (a.candidate?.name || "").localeCompare(b.candidate?.name || "")
                );
                break;
            case "name-desc":
                result.sort((a, b) =>
                    (b.candidate?.name || "").localeCompare(a.candidate?.name || "")
                );
                break;
            default:
                break;
        }

        return result;
    }, [applications, appSearch, statusFilter, advancedFilters]);

    // Unique job types for dropdown
    const uniqueJobTypes = useMemo(() => {
        return [...new Set(applications.map((app) => app.job?.jobType).filter(Boolean))];
    }, [applications]);

    const handleOpenDetails = (app) => {
        setSelectedCandidate(app);
        // Scroll to top of the tab
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCloseDetails = () => {
        setSelectedCandidate(null);
    };

    const handleResetFilters = () => {
        setStatusFilter("all");
        setAppSearch("");
        setAdvancedFilters({
            status: [],
            jobType: [],
            appliedDateRange: null,
            sortBy: "recent",
        });
    };

    // Check if any filters are active
    const hasActiveFilters =
        statusFilter !== "all" ||
        appSearch !== "" ||
        advancedFilters.status.length > 0 ||
        advancedFilters.jobType.length > 0 ||
        advancedFilters.appliedDateRange !== null ||
        advancedFilters.sortBy !== "recent";

    if (selectedCandidate) {
        return (
            <div className="h-full">
                <CandidateDetailsView
                    application={selectedCandidate}
                    onBack={handleCloseDetails}
                    onStatusChange={(status) => {
                        handleStatusChange(selectedCandidate._id, status);
                        // Update the selected candidate's status in the view immediately
                        setSelectedCandidate(prev => ({ ...prev, status }));
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header with filter reset */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Applications</h2>
                    <p className="text-sm text-slate-500">
                        {filteredApplications.length} of {totalApps} total
                        {statusFilter !== "all" && ` · ${statusFilter}`}
                    </p>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleResetFilters}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                    >
                        Clear all filters
                    </button>
                )}
            </div>

            {appsError && <ErrorBanner message={appsError} onRetry={onRetry} />}

            {/* Filters Section */}
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

            {/* Applications Table */}
            {appsLoading ? (
                <Spinner />
            ) : filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState icon="📭" message="No applications match your filters" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 align-top">
                                    {/* Candidate */}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                            <span>Candidate</span>
                                            <select
                                                value={advancedFilters.sortBy.startsWith("name") ? advancedFilters.sortBy : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val) setAdvancedFilters(prev => ({ ...prev, sortBy: val }));
                                                }}
                                                className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-600 outline-none focus:border-indigo-400 font-normal w-full"
                                            >
                                                <option value="" disabled>Sort by name</option>
                                                <option value="name-asc">A to Z</option>
                                                <option value="name-desc">Z to A</option>
                                            </select>
                                        </div>
                                    </th>

                                    {/* Position */}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                            <span>Position</span>
                                            <select
                                                value={advancedFilters.jobType.length > 0 ? advancedFilters.jobType[0] : ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setAdvancedFilters(prev => ({
                                                        ...prev,
                                                        jobType: val ? [val] : []
                                                    }));
                                                }}
                                                className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-600 outline-none focus:border-indigo-400 font-normal w-full"
                                            >
                                                <option value="">All Types</option>
                                                {uniqueJobTypes.map(jt => (
                                                    <option key={jt} value={jt}>{jt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>

                                    {/* Applied On */}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <span>Applied On</span>
                                                <select
                                                    value={["recent", "oldest"].includes(advancedFilters.sortBy) ? advancedFilters.sortBy : "recent"}
                                                    onChange={(e) => setAdvancedFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                                    className="text-[9px] bg-white border border-slate-200 rounded px-1 py-0.5 text-slate-600 outline-none focus:border-indigo-400 font-normal"
                                                >
                                                    <option value="recent">Recent First</option>
                                                    <option value="oldest">Oldest First</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="date"
                                                    value={advancedFilters.appliedDateRange?.start?.toISOString().split("T")[0] || ""}
                                                    onChange={(e) => {
                                                        const end = advancedFilters.appliedDateRange?.end;
                                                        const start = e.target.value ? new Date(e.target.value) : null;
                                                        setAdvancedFilters(prev => ({
                                                            ...prev,
                                                            appliedDateRange: (start || end) ? { start, end } : null
                                                        }));
                                                    }}
                                                    className="text-[9px] px-1 py-1 rounded border border-slate-200 focus:outline-none focus:border-indigo-400 font-normal w-[90px]"
                                                />
                                                <span className="text-[9px] text-slate-400">to</span>
                                                <input
                                                    type="date"
                                                    value={advancedFilters.appliedDateRange?.end?.toISOString().split("T")[0] || ""}
                                                    onChange={(e) => {
                                                        const start = advancedFilters.appliedDateRange?.start;
                                                        const end = e.target.value ? new Date(e.target.value) : null;
                                                        setAdvancedFilters(prev => ({
                                                            ...prev,
                                                            appliedDateRange: (start || end) ? { start, end } : null
                                                        }));
                                                    }}
                                                    className="text-[9px] px-1 py-1 rounded border border-slate-200 focus:outline-none focus:border-indigo-400 font-normal w-[90px]"
                                                />
                                            </div>
                                        </div>
                                    </th>

                                    {/* Status */}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                            <span>Status</span>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => {
                                                    setStatusFilter(e.target.value);
                                                    handleAppsPage(1);
                                                }}
                                                className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-600 outline-none focus:border-indigo-400 font-normal w-full capitalize"
                                            >
                                                {STATUS_FILTERS.map(s => (
                                                    <option key={s} value={s}>{s === "all" ? "All Statuses" : STATUS_CFG[s]?.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>

                                    {/* Resume */}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 align-top">
                                        <span className="inline-block mt-[2px]">Resume</span>
                                    </th>

                                    {/* Actions */}
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 align-top">
                                        <span className="inline-block mt-[2px]">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredApplications.map((app) => (
                                    <tr 
                                        key={app._id} 
                                        className="hover:bg-indigo-50/50 transition-colors cursor-pointer group"
                                        onClick={() => handleOpenDetails(app)}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={app.candidate?.name || "?"} />
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

                                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                                            {fmtDate(app.appliedAt)}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={app.status} />
                                        </td>

                                        <td className="px-5 py-3.5">
                                            {app.resume?.url ? (
                                                <a
                                                    href={app.resume.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline max-w-[140px]"
                                                >
                                                    <span>📄</span>
                                                    <span className="truncate">{app.resume.filename || "Resume"}</span>
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">No resume</span>
                                            )}
                                        </td>

                                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleStatusChange(app._id, "shortlisted")}
                                                    disabled={app.status === "shortlisted"}
                                                    className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40"
                                                >
                                                    Shortlist
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(app._id, "interviewed")}
                                                    disabled={app.status === "interviewed"}
                                                    className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40"
                                                >
                                                    Interview
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(app._id, "rejected")}
                                                    disabled={app.status === "rejected"}
                                                    className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <PaginationBar
                        currentPage={appsPage}
                        totalPages={appsTotalPages}
                        totalItems={filteredApplications.length}
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