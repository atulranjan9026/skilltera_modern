import { StatusBadge } from "../ui/StatusBadge";
import { fmtDate } from "../helpers";

export function CandidateDetailsView({ application, onBack, onStatusChange }) {
    const { candidate, job, resume, appliedAt, status, notes } = application;

    const statusOptions = ["applied", "shortlisted", "interviewed", "selected", "rejected"];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100 p-6 flex flex-col md:flex-row items-start justify-between gap-4 rounded-t-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 hover:bg-white text-indigo-700 shadow-sm transition-all shadow-indigo-100/50 hover:-translate-x-1"
                        title="Back to Applications"
                    >
                        ←
                    </button>
                    <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
                        {candidate?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{candidate?.name || "Unknown"}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-600 mt-1">
                            <span className="flex items-center gap-1">✉️ {candidate?.email || "—"}</span>
                            {candidate?.phone && <span className="flex items-center gap-1">📞 {candidate.phone}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Content Body - properly scrollable if inside a flex layout container */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Job & Application info */}
                    <div className="space-y-8">
                        {/* Job Information */}
                        <div className="border border-slate-100 rounded-xl p-5 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span>🏢</span> Job Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Position</span>
                                    <span className="text-sm font-semibold text-slate-900">{job?.jobTitle || "—"}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Type</span>
                                        <span className="text-sm font-semibold text-slate-900">{job?.jobType || "—"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Department</span>
                                        <span className="text-sm font-semibold text-slate-900">{job?.department || "—"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Details */}
                        <div className="border border-slate-100 rounded-xl p-5 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span>📋</span> Application Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Applied On</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {fmtDate(appliedAt)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Resume</span>
                                    {resume?.url ? (
                                        <a
                                            href={resume.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                        >
                                            <span>📄</span>
                                            {resume.filename || "View Resume"}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-slate-400 italic">No resume provided</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Actions */}
                    <div className="space-y-8">
                        {/* Candidate Information */}
                        <div className="border border-slate-100 rounded-xl p-5 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span>👤</span> Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Email</span>
                                    <a href={`mailto:${candidate?.email}`} className="text-sm font-semibold text-indigo-600 hover:underline break-words block">
                                        {candidate?.email || "—"}
                                    </a>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 mb-1">Phone</span>
                                    {candidate?.phone ? (
                                        <a href={`tel:${candidate.phone}`} className="text-sm font-semibold text-indigo-600 hover:underline">
                                            {candidate.phone}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-slate-900">—</span>
                                    )}
                                </div>
                                {candidate?.linkedIn && (
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">LinkedIn</span>
                                        <a
                                            href={candidate.linkedIn}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-semibold text-indigo-600 hover:underline block truncate"
                                        >
                                            {candidate.linkedIn}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Change Actions */}
                        <div className="border border-slate-100 rounded-xl p-5 bg-blue-50 ring-1 ring-blue-100">
                            <h3 className="text-xs font-semibold text-blue-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span>⚡</span> Update Application Status
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {statusOptions.map((option) => {
                                    const isCurrent = status === option;
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => onStatusChange(option)}
                                            disabled={isCurrent}
                                            className={`px-3 py-2.5 rounded-lg text-xs font-bold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${
                                                isCurrent
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                    : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-100/50 hover:border-blue-300"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Notes - placed below actions if they exist */}
                        {notes && (
                            <div className="border border-slate-100 rounded-xl p-5 bg-amber-50">
                                <h3 className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <span>📝</span> Internal Notes
                                </h3>
                                <p className="text-sm text-amber-900 leading-relaxed">{notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
