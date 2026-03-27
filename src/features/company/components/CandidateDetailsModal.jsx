import { StatusBadge } from "../ui/StatusBadge";
import { fmtDate } from "../helpers";

export function CandidateDetailsModal({ application, onClose, onStatusChange }) {
    const { candidate, job, resume, appliedAt, status, notes } = application;

    const statusOptions = ["applied", "shortlisted", "interviewed", "selected", "rejected"];

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100 p-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                                {candidate?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{candidate?.name || "Unknown"}</h2>
                                <p className="text-sm text-slate-600">{candidate?.email || "—"}</p>
                                {candidate?.phone && <p className="text-sm text-slate-600">{candidate.phone}</p>}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Job Information */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                                Job Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-600">Position</span>
                                    <span className="text-sm font-semibold text-slate-900">{job?.jobTitle || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-600">Type</span>
                                    <span className="text-sm font-semibold text-slate-900">{job?.jobType || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-600">Department</span>
                                    <span className="text-sm font-semibold text-slate-900">{job?.department || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Application Details */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                                Application Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Status</span>
                                    <StatusBadge status={status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-slate-600">Applied On</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {fmtDate(appliedAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-slate-600">Resume</span>
                                    {resume?.url ? (
                                        <a
                                            href={resume.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                        >
                                            <span>📄</span>
                                            {resume.filename || "Download"}
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400">No resume</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Candidate Information */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                            <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                                Contact Information
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-slate-600">Email</span>
                                    <p className="text-sm font-semibold text-slate-900 break-words">
                                        {candidate?.email || "—"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-600">Phone</span>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {candidate?.phone || "—"}
                                    </p>
                                </div>
                                {candidate?.linkedIn && (
                                    <div>
                                        <span className="text-xs text-slate-600">LinkedIn</span>
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

                        {/* Notes */}
                        {notes && (
                            <div className="border border-slate-100 rounded-xl p-4 bg-amber-50">
                                <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                                    Notes
                                </h3>
                                <p className="text-sm text-slate-700">{notes}</p>
                            </div>
                        )}

                        {/* Status Change Actions */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-blue-50">
                            <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                                Update Status
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => onStatusChange(option)}
                                        disabled={status === option}
                                        className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                                            status === option
                                                ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                                                : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}