import { useState, useRef, useEffect } from "react";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBanner } from "../ui/ErrorBanner";
import { JobStatusBadge } from "../ui/JobStatusBadge";
import { JobTypePill } from "../ui/JobTypePill";
import { PaginationBar } from "../ui/PaginationBar";
import { fmtShort, daysLeft } from "../helpers";
import { getCompanyUser } from "../../../utils/auth";

/* ── default filter state ── */
const DEFAULT_FILTERS = {
    jobType: [],          // ["Full Time", "Part Time", …]
    status: [],           // ["APPROVED", "Pending", "Closed", "Draft"]
    experience: "",       // "0-2" | "3-5" | "6-10" | "10+"
    deadlineWithin: "",   // "7" | "14" | "30" days
    state: "",            // free-text state filter
};

const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
const STATUSES = ["APPROVED", "Pending", "Closed", "Draft"];
const EXP_RANGES = [
    { label: "0 – 2 yrs", value: "0-2" },
    { label: "3 – 5 yrs", value: "3-5" },
    { label: "6 – 10 yrs", value: "6-10" },
    { label: "10+ yrs", value: "10+" },
];
const DEADLINE_OPTIONS = [
    { label: "Within 7 days", value: "7" },
    { label: "Within 14 days", value: "14" },
    { label: "Within 30 days", value: "30" },
];

function normalizeJob(job) {
    const title = job?.jobTitle ?? job?.title ?? "";
    const location = job?.location ?? {};
    const city = job?.city ?? location.city ?? "";
    const state = job?.state ?? location.state ?? "";
    const postedOn = job?.postedOn ?? job?.postedDate ?? null;
    const lastDate = job?.lastDate ?? job?.applicationDeadline ?? null;
    const active = job?.active ?? job?.isActive ?? false;
    const workExperience =
        job?.workExperience ??
        (typeof job?.minExperience === "number" ? job.minExperience : undefined) ??
        0;

    return {
        ...job,
        jobTitle: title,
        city,
        state,
        postedOn,
        lastDate,
        active,
        workExperience,
        jobType: job?.jobType ?? "",
        status: job?.status ?? "",
    };
}

function countActive(f) {
    return (
        f.jobType.length +
        f.status.length +
        (f.experience ? 1 : 0) +
        (f.deadlineWithin ? 1 : 0) +
        (f.state ? 1 : 0)
    );
}

function applyFilters(jobs, search, filters) {
    console.log("jobs", jobs);
    // console.log("filters", filters);
    return jobs.map(normalizeJob).filter((job) => {
        if (search) {
            const q = search.toLowerCase();
            if (!job.jobTitle?.toLowerCase().includes(q) && !job.city?.toLowerCase().includes(q))
                return false;
        }
        if (filters.jobType.length && !filters.jobType.includes(job.jobType)) return false;
        if (filters.status.length && !filters.status.includes(job.status)) return false;
        if (filters.experience) {
            const exp = Number(job.workExperience ?? 0);
            if (filters.experience === "0-2" && (exp < 0 || exp > 2)) return false;
            if (filters.experience === "3-5" && (exp < 3 || exp > 5)) return false;
            if (filters.experience === "6-10" && (exp < 6 || exp > 10)) return false;
            if (filters.experience === "10+" && exp < 10) return false;
        }
        if (filters.deadlineWithin) {
            const dl = daysLeft(job.lastDate);
            if (dl === null || dl < 0 || dl > Number(filters.deadlineWithin)) return false;
        }
        if (filters.state && !job.state?.toLowerCase().includes(filters.state.toLowerCase()))
            return false;
        return true;
    });
}

/* ═══════════════════════════════════════════════════════════ */
export function JobsTab({
    totalJobs, activeJobs, pendingJobs,
    jobSearch, setJobSearch,
    jobsLoading, jobsError, jobs,
    jobsPage, jobsTotalPages,
    onPostNew, onRetry,
    handleJobsPage,
    onViewJob,
    onEditJob,
    onDeleteJob,
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const panelRef = useRef(null);
    const role = getCompanyUser()?.role;
    const canEditJobs = role === "company";

    /* close panel on outside click */
    useEffect(() => {
        function handler(e) {
            if (panelRef.current && !panelRef.current.contains(e.target))
                setShowFilters(false);
        }
        if (showFilters) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showFilters]);

    const activeCount = countActive(filters);
    const filteredJobs = applyFilters(jobs, jobSearch, filters);

    function toggleArr(field, val) {
        setFilters((prev) => ({
            ...prev,
            [field]: prev[field].includes(val)
                ? prev[field].filter((v) => v !== val)
                : [...prev[field], val],
        }));
    }
    function setField(field, val) {
        setFilters((prev) => ({ ...prev, [field]: prev[field] === val ? "" : val }));
    }
    function clearAll() { setFilters(DEFAULT_FILTERS); }

    return (
        <div className="space-y-5">
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Job Postings</h2>
                    <p className="text-sm text-slate-500">
                        {totalJobs} total · {activeJobs} active · {pendingJobs} pending approval
                    </p>
                </div>
                {getCompanyUser()?.role !== "hiring_manager" && (
                    <button
                        onClick={onPostNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                        + Post New Job
                    </button>
                )}
            </div>

            {jobsError && <ErrorBanner message={jobsError} onRetry={onRetry} />}

            {/* ── Search + Filter row ── */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative w-72">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    <input
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Search by title or city…"
                        className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
                    />
                </div>

                {/* Filter button + dropdown panel */}
                <div className="relative" ref={panelRef}>
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`flex items-center gap-2 border text-xs font-semibold px-4 py-2 rounded-xl transition-all
                            ${activeCount > 0
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                            }`}
                    >
                        {/* funnel icon */}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                        </svg>
                        Filters
                        {activeCount > 0 && (
                            <span className="bg-white text-indigo-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    {/* ── Filter Panel ── */}
                    {showFilters && (
                        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Advanced Filters
                                </span>
                                {activeCount > 0 && (
                                    <button onClick={clearAll} className="text-[10px] font-semibold text-rose-500 hover:text-rose-700">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Job Type */}
                            <FilterSection label="Job Type">
                                <div className="flex flex-wrap gap-1.5">
                                    {JOB_TYPES.map((t) => (
                                        <Chip key={t} label={t} active={filters.jobType.includes(t)} onClick={() => toggleArr("jobType", t)} />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Status */}
                            <FilterSection label="Status">
                                <div className="flex flex-wrap gap-1.5">
                                    {STATUSES.map((s) => (
                                        <Chip
                                            key={s}
                                            label={s.charAt(0).toUpperCase() + s.slice(1)}
                                            active={filters.status.includes(s)}
                                            onClick={() => toggleArr("status", s)}
                                        />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Experience */}
                            <FilterSection label="Experience Range">
                                <div className="flex flex-wrap gap-1.5">
                                    {EXP_RANGES.map(({ label, value }) => (
                                        <Chip key={value} label={label} active={filters.experience === value} onClick={() => setField("experience", value)} />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Deadline */}
                            <FilterSection label="Deadline">
                                <div className="flex flex-wrap gap-1.5">
                                    {DEADLINE_OPTIONS.map(({ label, value }) => (
                                        <Chip key={value} label={label} active={filters.deadlineWithin === value} onClick={() => setField("deadlineWithin", value)} />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* State */}
                            <FilterSection label="State">
                                <input
                                    value={filters.state}
                                    onChange={(e) => setFilters((p) => ({ ...p, state: e.target.value }))}
                                    placeholder="e.g. Maharashtra"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </FilterSection>

                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Active filter pills */}
                {activeCount > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {filters.jobType.map((t) => (
                            <ActivePill key={t} label={t} onRemove={() => toggleArr("jobType", t)} />
                        ))}
                        {filters.status.map((s) => (
                            <ActivePill key={s} label={s} onRemove={() => toggleArr("status", s)} />
                        ))}
                        {filters.experience && (
                            <ActivePill
                                label={EXP_RANGES.find((r) => r.value === filters.experience)?.label}
                                onRemove={() => setFilters((p) => ({ ...p, experience: "" }))}
                            />
                        )}
                        {filters.deadlineWithin && (
                            <ActivePill
                                label={DEADLINE_OPTIONS.find((d) => d.value === filters.deadlineWithin)?.label}
                                onRemove={() => setFilters((p) => ({ ...p, deadlineWithin: "" }))}
                            />
                        )}
                        {filters.state && (
                            <ActivePill label={filters.state} onRemove={() => setFilters((p) => ({ ...p, state: "" }))} />
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ── */}
            {jobsLoading ? (
                <Spinner />
            ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState icon="💼" message="No jobs match your filters" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {activeCount > 0 && (
                        <div className="px-5 py-2 bg-indigo-50 border-b border-indigo-100 text-xs text-indigo-700 font-medium">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                        </div>
                    )}
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Job Title", "Location", "Type", "Posted", "Deadline", "Status", "Actions"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredJobs.map((job) => {
                                const dl = daysLeft(job.lastDate);
                                return (
                                    <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">💼</div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{job.jobTitle}</p>
                                                    <p className="text-[10px] text-slate-400">{job.workExperience}+ yrs exp</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{job.city}, {job.state}</td>
                                        <td className="px-5 py-3.5"><JobTypePill type={job.jobType} /></td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500">{fmtShort(job.postedOn)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-medium ${dl !== null && dl <= 3 ? "text-rose-500 font-semibold" : dl !== null && dl <= 7 ? "text-amber-500 font-semibold" : "text-slate-500"}`}>
                                                {fmtShort(job.lastDate)}
                                                {dl !== null && dl > 0 && <span className="text-[10px] ml-1 text-slate-400">({dl}d)</span>}
                                                {dl !== null && dl <= 0 && <span className="text-[10px] ml-1 text-rose-400">(expired)</span>}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5"><JobStatusBadge status={job.status} /></td>
                                        {/* <td className="px-5 py-3.5">{job.status }</td> */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onViewJob?.(job)} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold whitespace-nowrap">
                                                    View →
                                                </button>
                                                {canEditJobs && (
                                                    <>
                                                        <span className="text-slate-200">|</span>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to delete this job?")) {
                                                                    onDeleteJob?.(job);
                                                                }
                                                            }}
                                                            className="text-rose-500 hover:text-rose-700 text-xs font-semibold whitespace-nowrap"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <PaginationBar
                        currentPage={jobsPage} totalPages={jobsTotalPages} totalItems={totalJobs}
                        itemLabel="jobs"
                        onPrev={() => handleJobsPage(jobsPage - 1)}
                        onNext={() => handleJobsPage(jobsPage + 1)}
                        onPageClick={handleJobsPage}
                        loading={jobsLoading}
                    />
                </div>
            )}
        </div>
    );
}

/* ── helpers ── */
function FilterSection({ label, children }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            {children}
        </div>
    );
}

function Chip({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all
                ${active
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                }`}
        >
            {label}
        </button>
    );
}

function ActivePill({ label, onRemove }) {
    return (
        <span className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {label}
            <button onClick={onRemove} className="text-indigo-400 hover:text-indigo-700 leading-none text-sm">×</button>
        </span>
    );
}