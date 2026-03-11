import { JobStatusBadge } from "../../ui/JobStatusBadge";
import { JobTypePill } from "../../ui/JobTypePill";
import { fmtShort, daysLeft } from "../../helpers";

/**
 * JobDetailPage
 *
 * Props:
 *  job      – the full job object
 *  onBack   – () => void   go back to the list
 *  onEdit   – (job) => void  switch to edit form
 */
export function JobDetailPage({ job, onBack, onEdit }) {
    if (!job) return null;

    const dl = daysLeft(job.lastDate);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* ── Top bar ── */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                    ← Back to Jobs
                </button>
                {onEdit && (
                    <button
                        onClick={() => onEdit(job)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                        ✏️ Edit Job
                    </button>
                )}
            </div>

            {/* ── Header card ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        💼
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-slate-900">{job.jobTitle}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {job.city}, {job.state}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <JobTypePill type={job.jobType} />
                        <JobStatusBadge status={job.status} active={job.active} />
                    </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
                    <Stat label="Experience" value={`${job.workExperience}+ yrs`} />
                    <Stat label="Posted On" value={fmtShort(job.postedOn)} />
                    <Stat
                        label="Deadline"
                        value={fmtShort(job.lastDate)}
                        sub={
                            dl !== null && dl > 0
                                ? `${dl} days left`
                                : dl !== null && dl <= 0
                                ? "Expired"
                                : null
                        }
                        subColor={
                            dl !== null && dl <= 3
                                ? "text-rose-500"
                                : dl !== null && dl <= 7
                                ? "text-amber-500"
                                : "text-slate-400"
                        }
                    />
                    <Stat label="Job ID" value={job.jobId || job._id?.slice(-8).toUpperCase()} mono />
                </div>
            </div>

            {/* ── Description ── */}
            {job.jobDescription && (
                <Section title="Job Description">
                    <div 
                        className="text-sm text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                    />
                </Section>
            )}

            {/* ── Skills Required ── */}
            {job.skillRequired && job.skillRequired.length > 0 && (
                <Section title="Skills Required">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.skillRequired.map((skill, index) => (
                            <div key={skill._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700">
                                    Skill ID: {skill.skillId}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {skill.requiredExperience}+ yrs
                                    </span>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                        Level {skill.rating}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* ── Additional Info ── */}
            <Section title="Additional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Country</p>
                        <p className="text-sm text-slate-600">{job.country}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Travel Required</p>
                        <p className="text-sm text-slate-600">{job.travelRequired ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Applications</p>
                        <p className="text-sm text-slate-600">{job.applicationsCount || 0} applications</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Status</p>
                        <p className="text-sm text-slate-600">{job.status}</p>
                    </div>
                </div>
            </Section>
        </div>
    );
}

/* ── helpers ── */
function Stat({ label, value, sub, subColor = "text-slate-400", mono }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
            <p className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</p>
            {sub && <p className={`text-[10px] mt-0.5 font-medium ${subColor}`}>{sub}</p>}
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
            {children}
        </div>
    );
}