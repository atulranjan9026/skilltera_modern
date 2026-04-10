import { useState } from 'react';
import { Spinner }        from '../ui/Spinner';
import { EmptyState }     from '../ui/EmptyState';
import { ErrorBanner }    from '../ui/ErrorBanner';
import { JobStatusBadge } from '../ui/JobStatusBadge';
import { JobTypePill }    from '../ui/JobTypePill';
import { PaginationBar }  from '../ui/PaginationBar';
import { normalizeJob, fmtShort, daysLeft } from '../../../utils/normalizeJob';
import { getCompanyUser } from '../../../utils/auth';

// ── Default filter state ────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
    jobType:         [],   // ["Full Time", "Part Time", …]
    status:          [],   // ["APPROVED", "Pending", "Closed", "Draft"]
    experience:      '',   // "0-2" | "3-5" | "6-10" | "10+"
    deadlineWithin:  '',   // "7" | "14" | "30" days
};

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];
const STATUSES  = ['APPROVED', 'Pending', 'Closed', 'Draft'];
const EXP_RANGES = [
    { label: '0 – 2 yrs', value: '0-2'  },
    { label: '3 – 5 yrs', value: '3-5'  },
    { label: '6 – 10 yrs', value: '6-10' },
    { label: '10+ yrs',   value: '10+'  },
];
const DEADLINE_OPTIONS = [
    { label: 'Within 7 days',  value: '7'  },
    { label: 'Within 14 days', value: '14' },
    { label: 'Within 30 days', value: '30' },
];

function countActive(f) {
    return (
        f.jobType.length +
        f.status.length  +
        (f.experience     ? 1 : 0) +
        (f.deadlineWithin ? 1 : 0)
    );
}

// ═══════════════════════════════════════════════════════════════════════════
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
    // NEW: filters are lifted to parent so they can trigger server fetches
    filters,
    setFilters,
}) {
    const [jobToDelete, setJobToDelete] = useState(null);
    const role = getCompanyUser()?.role;
    const canEditJobs = role === 'company';

    const activeCount = countActive(filters);

    function toggleArr(field, val) {
        setFilters(prev => ({
            ...prev,
            [field]: prev[field].includes(val)
                ? prev[field].filter(v => v !== val)
                : [...prev[field], val],
        }));
    }

    function setField(field, val) {
        setFilters(prev => ({ ...prev, [field]: prev[field] === val ? '' : val }));
    }

    function clearAll() { setFilters(DEFAULT_FILTERS); }

    // Normalize for display — jobs are already server-filtered
    const displayJobs = jobs.map(normalizeJob);

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
                {getCompanyUser()?.role !== 'hiring_manager' && (
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
                        onChange={e => setJobSearch(e.target.value)}
                        placeholder="Search by title or city…"
                        className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-700
                            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
                    />
                </div>

                {/* Individual Filter Dropdowns */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Job Type Filter */}
                    <div className="relative">
                        <select
                            value=""
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    toggleArr('jobType', value);
                                }
                            }}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <option value="">Job Type</option>
                            {JOB_TYPES.map(t => (
                                <option key={t} value={t} disabled={filters.jobType.includes(t)}>
                                    {t} {filters.jobType.includes(t) ? '✓' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value=""
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    toggleArr('status', value);
                                }
                            }}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <option value="">Status</option>
                            {STATUSES.map(s => (
                                <option key={s} value={s} disabled={filters.status.includes(s)}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)} {filters.status.includes(s) ? '✓' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Experience Range Filter */}
                    <div className="relative">
                        <select
                            value={filters.experience}
                            onChange={(e) => setField('experience', e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <option value="">Experience</option>
                            {EXP_RANGES.map(({ label, value }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Deadline Filter */}
                    <div className="relative">
                        <select
                            value={filters.deadlineWithin}
                            onChange={(e) => setField('deadlineWithin', e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <option value="">Deadline</option>
                            {DEADLINE_OPTIONS.map(({ label, value }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Clear All Button */}
                    {activeCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 px-2 py-1 rounded ml-2"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Active filter pills */}
                {activeCount > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {filters.jobType.map(t => (
                            <ActivePill key={t} label={t} onRemove={() => toggleArr('jobType', t)} />
                        ))}
                        {filters.status.map(s => (
                            <ActivePill key={s} label={s} onRemove={() => toggleArr('status', s)} />
                        ))}
                        {filters.experience && (
                            <ActivePill
                                label={EXP_RANGES.find(r => r.value === filters.experience)?.label}
                                onRemove={() => setFilters(p => ({ ...p, experience: '' }))}
                            />
                        )}
                        {filters.deadlineWithin && (
                            <ActivePill
                                label={DEADLINE_OPTIONS.find(d => d.value === filters.deadlineWithin)?.label}
                                onRemove={() => setFilters(p => ({ ...p, deadlineWithin: '' }))}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ── */}
            {jobsLoading ? (
                <Spinner />
            ) : displayJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState icon="💼" message="No jobs match your filters" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {['Job Title', 'Location', 'Type', 'Posted', 'Deadline', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayJobs.map(job => {
                                const dl = daysLeft(job.lastDate);
                                return (
                                    <tr
                                        key={job._id}
                                        onClick={() => onViewJob?.(job)}
                                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                                                    💼
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{job.jobTitle}</p>
                                                    <p className="text-[10px] text-slate-400">{job.workExperience}+ yrs exp</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                                            {job.city}{job.city && job.state ? ', ' : ''}{job.state}
                                        </td>
                                        <td className="px-5 py-3.5"><JobTypePill type={job.jobType} /></td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500">{fmtShort(job.postedOn)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-medium ${
                                                dl !== null && dl <= 3 ? 'text-rose-500 font-semibold'  :
                                                dl !== null && dl <= 7 ? 'text-amber-500 font-semibold' :
                                                'text-slate-500'
                                            }`}>
                                                {fmtShort(job.lastDate)}
                                                {dl !== null && dl > 0  && <span className="text-[10px] ml-1 text-slate-400">({dl}d)</span>}
                                                {dl !== null && dl <= 0 && <span className="text-[10px] ml-1 text-rose-400">(expired)</span>}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5"><JobStatusBadge status={job.status} /></td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={e => { e.stopPropagation(); onViewJob?.(job); }}
                                                    className="text-indigo-600 group-hover:text-indigo-800 text-xs font-semibold whitespace-nowrap transition-colors"
                                                >
                                                    View →
                                                </button>
                                                {canEditJobs && (
                                                    <>
                                                        <span className="text-slate-200">|</span>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); onEditJob?.(job); }}
                                                            className="text-slate-500 hover:text-slate-800 text-xs font-semibold whitespace-nowrap transition-colors"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <span className="text-slate-200">|</span>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setJobToDelete(job); }}
                                                            className="text-rose-500 hover:text-rose-700 text-xs font-semibold whitespace-nowrap transition-colors"
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
                        currentPage={jobsPage}
                        totalPages={jobsTotalPages}
                        totalItems={totalJobs}
                        itemLabel="jobs"
                        onPrev={() => handleJobsPage(jobsPage - 1)}
                        onNext={() => handleJobsPage(jobsPage + 1)}
                        onPageClick={handleJobsPage}
                        loading={jobsLoading}
                    />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                job={jobToDelete}
                onClose={() => setJobToDelete(null)}
                onConfirm={job => {
                    onDeleteJob?.(job);
                    setJobToDelete(null);
                }}
            />
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
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

function DeleteConfirmModal({ job, onClose, onConfirm }) {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Job Posting</h3>
                    <p className="text-sm text-slate-500 leading-relaxed px-2">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-slate-700">"{job.jobTitle}"</span>?
                        This action cannot be undone.
                    </p>
                </div>
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 sm:px-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(job)}
                        className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-200"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}