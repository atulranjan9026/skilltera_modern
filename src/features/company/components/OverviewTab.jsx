import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import { ErrorBanner } from "../ui/ErrorBanner";
import { StatCard } from "../ui/StatCard";
import { StatusBadge } from "../ui/StatusBadge";
import { JobTypePill } from "../ui/JobTypePill";
import { Avatar } from "../ui/Avatar";
import { daysLeft } from "../helpers";

export function OverviewTab({
    companyUser,
    jobsLoading, appsLoading, jobsError, appsError,
    totalJobs, activeJobs, pendingJobs,
    totalApps, applied, shortlisted, interviews, selected, rejected,
    funnelData, jobs, applications,
    onRetry, goTo,
}) {
    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Good morning, {companyUser?.companyName || "there"} 👋
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Here's your hiring overview at a glance.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                    📅 {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </span>
            </div>

            {(jobsError || appsError) && <ErrorBanner message={jobsError || appsError} onRetry={onRetry} />}

            {jobsLoading || appsLoading ? (
                <Spinner />
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon="💼" label="Total Jobs" value={totalJobs} sub={`${activeJobs} active · ${pendingJobs} pending`} color="bg-indigo-50" />
                        <StatCard icon="👥" label="Total Applications" value={totalApps} sub={`${applied} new · ${shortlisted} shortlisted`} color="bg-sky-50" />
                        <StatCard icon="📅" label="In Interview" value={interviews} sub={`${shortlisted} shortlisted`} color="bg-amber-50" />
                        <StatCard icon="✅" label="Hired" value={selected} sub={`${rejected} rejected`} color="bg-emerald-50" />
                    </div>

                    {/* Hiring funnel */}
                    {funnelData.some((f) => f.value > 0) && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4">Hiring Funnel</h3>
                            <div className="flex items-end gap-3">
                                {funnelData.map((stage, i) => {
                                    const max = Math.max(...funnelData.map((f) => f.value), 1);
                                    const pct = Math.round((stage.value / max) * 100);
                                    return (
                                        <div key={i} className="flex-1 text-center">
                                            <div className="text-xs font-bold text-slate-700 mb-1">{stage.value}</div>
                                            <div className="rounded-xl mx-auto" style={{ height: `${Math.max(pct * 0.85, 10)}px`, background: stage.color }} />
                                            <div className="text-[10px] text-slate-500 mt-1.5 font-medium">{stage.name}</div>
                                            <div className="text-[10px] text-slate-400">{pct}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Recent lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Applications */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800">Recent Applications</h3>
                                <button onClick={() => goTo("Applications")} className="text-indigo-600 text-xs font-semibold hover:underline">View all →</button>
                            </div>
                            {applications.length === 0 ? (
                                <EmptyState icon="📭" message="No applications yet" />
                            ) : (
                                <div className="space-y-1.5">
                                    {applications.slice(0, 5).map((app) => (
                                        <div key={app._id} className="row-hover flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer">
                                            <Avatar name={app.candidate?.name || "?"} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{app.candidate?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{app.job?.jobTitle || "—"}</p>
                                            </div>
                                            <StatusBadge status={app.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Job Postings */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800">Recent Job Postings</h3>
                                <button onClick={() => goTo("Jobs")} className="text-indigo-600 text-xs font-semibold hover:underline">View all →</button>
                            </div>
                            {jobs.length === 0 ? (
                                <EmptyState icon="💼" message="No jobs posted yet" />
                            ) : (
                                <div className="space-y-1.5">
                                    {jobs.map((job) => {
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
    );
}
