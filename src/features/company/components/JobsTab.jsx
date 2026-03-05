import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBanner } from "../ui/ErrorBanner";
import { JobStatusBadge } from "../ui/JobStatusBadge";
import { JobTypePill } from "../ui/JobTypePill";
import { PaginationBar } from "../ui/PaginationBar";
import { fmtShort, daysLeft } from "../helpers";

export function JobsTab({
    totalJobs, activeJobs, pendingJobs,
    jobSearch, setJobSearch,
    jobsLoading, jobsError, jobs,
    jobsPage, jobsTotalPages,
    onPostNew, onRetry,
    handleJobsPage,
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Job Postings</h2>
                    <p className="text-sm text-slate-500">{totalJobs} total · {activeJobs} active · {pendingJobs} pending approval</p>
                </div>
                <button
                    onClick={onPostNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    + Post New Job
                </button>
            </div>

            {jobsError && <ErrorBanner message={jobsError} onRetry={onRetry} />}

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

            {jobsLoading ? (
                <Spinner />
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState icon="💼" message="No jobs found" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Job Title", "Location", "Type", "Posted", "Deadline", "Status", ""].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {jobs.map((job) => {
                                const dl = daysLeft(job.lastDate);
                                return (
                                    <tr key={job._id} className="row-hover transition-colors">
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
                                        <td className="px-5 py-3.5"><JobStatusBadge status={job.status} active={job.active} /></td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold">View →</button>
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
                        loading={jobsLoading}
                    />
                </div>
            )}
        </div>
    );
}
