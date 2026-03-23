import { Spinner } from "../ui/Spinner";
import { StatusBadge } from "../ui/StatusBadge";
import { Avatar } from "../ui/Avatar";
import { STATUS_CFG } from "../constants";
import { fmtDate } from "../helpers";

export function InterviewsTab({ appsLoading, interviewApps, handleStatusChange, onViewFeedback, goTo }) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Interview Pipeline</h2>
                <p className="text-sm text-slate-500">
                    {interviewApps.length} candidate{interviewApps.length !== 1 ? "s" : ""} in interview stage
                </p>
            </div>

            {appsLoading ? (
                <Spinner />
            ) : interviewApps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                    <p className="text-4xl mb-3">📅</p>
                    <p className="text-sm font-semibold text-slate-700 mb-1">No candidates in interview stage yet</p>
                    <p className="text-xs text-slate-400 mb-4">Move candidates from the Applications tab.</p>
                    <button
                        onClick={() => goTo("Applications")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                        Go to Applications →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {interviewApps.map((app) => (
                        <div key={app._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
                            {/* Candidate header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={app.candidate?.name || "?"} />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{app.candidate?.name || "—"}</p>
                                        <p className="text-xs text-slate-400">{app.job?.jobTitle || "—"}</p>
                                    </div>
                                </div>
                                <StatusBadge status="interviewed" />
                            </div>

                            {/* Details */}
                            <div className="bg-slate-50 rounded-xl p-3 space-y-2 mb-4">
                                {[
                                    ["Email", app.candidate?.email],
                                    ["Phone", app.candidate?.phone],
                                    ["Job Type", app.job?.jobType],
                                    ["Applied", fmtDate(app.appliedAt)],
                                ].map(([label, val]) =>
                                    val ? (
                                        <div key={label} className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{label}</span>
                                            <span className="text-[10px] font-semibold text-slate-700 truncate text-right">{val}</span>
                                        </div>
                                    ) : null
                                )}
                            </div>

                            {/* Resume link */}
                            <div className="flex items-center justify-between mb-4">
                                {app.resume?.url && (
                                    <a href={app.resume.url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline">
                                        📄 View Resume
                                    </a>
                                )}
                                <button
                                    onClick={() => onViewFeedback(app)}
                                    className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                                >
                                    💬 View Feedback
                                </button>
                            </div>

                            {/* Status history */}
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

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button onClick={() => handleStatusChange(app._id, "selected")}
                                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-2 rounded-xl transition-colors">
                                    Hire ✓
                                </button>
                                <button onClick={() => handleStatusChange(app._id, "rejected")}
                                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2 rounded-xl transition-colors">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
