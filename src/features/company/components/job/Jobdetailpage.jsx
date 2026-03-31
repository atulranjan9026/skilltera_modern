import { useMemo } from "react";
import { JobStatusBadge } from "../../ui/JobStatusBadge";
import { JobTypePill } from "../../ui/JobTypePill";
import { fmtShort, daysLeft } from "../../helpers";

function normalizeJob(job) {
    const location = job?.location ?? {};
    return {
        ...job,
        jobTitle: job?.jobTitle ?? job?.title ?? "—",
        descriptionHtml: job?.jobDescription ?? job?.jobDescription ?? "",
        city: job?.city ?? location.city ?? "",
        state: job?.state ?? location.state ?? "",
        country: job?.country ?? location.country ?? "",
        postedOn: job?.postedOn ?? job?.postedDate ?? null,
        lastDate: job?.lastDate ?? job?.applicationDeadline ?? null,
        active: job?.active ?? job?.isActive ?? false,
        workExperience:
            job?.workExperience ??
            (typeof job?.minExperience === "number" ? job.minExperience : undefined) ??
            0,
        requiredSkills: job?.requiredSkills ?? [],
        applicationsCount: job?.applicationsCount ?? 0,
    };
}

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

    const j = normalizeJob(job);
    const dl = daysLeft(j.lastDate);
    const canEditJobs = useMemo(() => {
        if (typeof window === "undefined") return false;
        try {
            const u = JSON.parse(localStorage.getItem("companyUser")) || {};
            return u.role === "company";
        } catch {
            return false;
        }
    }, []);

    return (
        <div className="w-full space-y-8 pb-12">
            {/* ── Top bar ── */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                    onClick={onBack}
                    className="group text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Jobs
                </button>
                {canEditJobs && (
                    <button
                        onClick={() => onEdit(job)}
                        className="bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                        <span>✏️</span> Edit Job Info
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* ── Main Content (Left Column) ── */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* ── Header card ── */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                                        💼
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                            {j.jobTitle}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                                            <p className="text-base text-slate-500 font-medium flex items-center gap-1.5">
                                                <span className="text-indigo-400">📍</span>
                                                {j.city}{j.city && j.state ? ", " : ""}{j.state}
                                            </p>
                                            <span className="hidden md:inline h-1 w-1 rounded-full bg-slate-300" />
                                            <p className="text-sm text-slate-400">
                                                ID: <span className="font-mono font-medium">{j.jobId || j._id?.slice(-8).toUpperCase()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <JobTypePill type={j.jobType} />
                                    <JobStatusBadge status={j.status} active={j.active} />
                                </div>
                            </div>

                            {/* Meta grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-50/80">
                                <Stat label="Experience" value={`${j.workExperience}+ yrs`} icon="⏳" />
                                <Stat label="Posted On" value={fmtShort(j.postedOn)} icon="📅" />
                                <Stat
                                    label="Deadline"
                                    icon="⏰"
                                    value={fmtShort(j.lastDate)}
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
                                <Stat label="Openings" value={j.openings || 1} icon="👥" />
                            </div>
                        </div>
                    </div>

                    {/* ── Description ── */}
                    {j.descriptionHtml && (
                        <Section title="Job Description" icon="📝">
                            <div 
                                className="text-base text-slate-600 leading-relaxed font-normal prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: j.descriptionHtml }}
                            />
                        </Section>
                    )}

                    {/* ── Skills Required ── */}
                    {j.requiredSkills && j.requiredSkills.length > 0 && (
                        <Section title="Required Expertise" icon="✨">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {j.requiredSkills.map((skill, index) => (
                                    <div key={skill._id || index} className="group relative flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-white hover:shadow-md hover:border-indigo-100">
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-sm font-bold text-slate-800 truncate">
                                                {skill.skillName || `Skill ID: ${skill.skillId}`}
                                            </span>
                                            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">
                                                Professional Skill
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="text-right">
                                                <span className="block text-xs font-bold text-indigo-600">
                                                    {(skill.experience ?? skill.experience ?? 0)}+ yrs
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">Experience</span>
                                            </div>
                                            <div className="h-8 w-[1px] bg-slate-200" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-black text-slate-700 leading-none">{skill.rating ?? "—"}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">LVL</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                {/* ── Right Column (Sidebar/Info) ── */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Review candidates and manage the status of this job posting.
                            </p>
                            <div className="h-px bg-indigo-500/30 my-4" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium opacity-80">Total Applications</span>
                                <span className="text-xl font-black">{j.applicationsCount || 0}</span>
                            </div>
                        </div>
                    </div>

                    <Section title="Employment Details" icon="ℹ️">
                        <div className="space-y-6">
                            <SidebarStat label="Country" value={j.country || "—"} />
                            <SidebarStat label="Work Mode" value={j.location?.isRemote ? "Remote" : "On-site"} />
                            <SidebarStat label="Work Location" value={j.location?.remoteType || (j.location?.isRemote ? "Fully Remote" : "On-site")} />
                            <SidebarStat label="Current Status" value={j.status} status />
                        </div>
                    </Section>

                    {/* Mini card for Salary if exists */}
                    {j.salary?.min && (
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Salary</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">
                                    {j.salary.currency || "$"} {j.salary.min.toLocaleString()}
                                </span>
                                {j.salary.max > j.salary.min && (
                                    <span className="text-lg font-bold text-slate-400">
                                        - {j.salary.max.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium capitalize">
                                per {j.salary.period || "year"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── helpers ── */
function Stat({ label, value, sub, subColor = "text-slate-400", mono, icon }) {
    return (
        <div className="flex items-start gap-3">
            {icon && <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{icon}</span>}
            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{label}</p>
                <p className={`text-base font-bold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</p>
                {sub && <p className={`text-[10px] mt-1 font-bold px-2 py-0.5 rounded-md bg-slate-50 inline-block ${subColor}`}>{sub}</p>}
            </div>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3">
                {icon && <span className="text-xl">{icon}</span>}
                <h2 className="text-lg font-black text-slate-800 tracking-tight">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function SidebarStat({ label, value, status }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-bold ${status ? "text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block" : "text-slate-700"}`}>
                {value}
            </p>
        </div>
    );
}