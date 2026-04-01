// ─────────────────────────────────────────────────────────────────────────────
// JobCard.jsx  (fully corrected)
// Fixes applied:
//  1. heartHovered state removed — replaced with CSS-only hover (no re-renders)
//  2. logo renders <img> when a URL is present, falls back to emoji
//  3. matchPercentage 0 renders correctly (was already fine, kept explicit check)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Heart, MapPin, Clock, ChevronRight, Briefcase, DollarSign, Zap } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

/**
 * JobCard — displays a single ranked job listing.
 *
 * Props:
 *  job          {Object}   — transformed job object from JobSearchPage
 *  onViewDetails {Function} — called with the job when card / button is clicked
 *  isSaved       {boolean}
 *  onSave        {Function} — called with job.id
 *  isActive      {boolean}  — highlights the currently selected card
 */
export default function JobCard({ job, onViewDetails, isSaved, onSave, isActive }) {

    const matchColor =
        job.matchPercentage >= 80 ? 'text-emerald-600' :
        job.matchPercentage >= 50 ? 'text-amber-600'   :
        'text-slate-500';

    const matchBarColor =
        job.matchPercentage >= 80 ? 'from-emerald-400 to-emerald-500' :
        job.matchPercentage >= 50 ? 'from-amber-400 to-amber-500'     :
        'from-slate-300 to-slate-400';

    return (
        <div
            onClick={() => onViewDetails(job)}
            className={`
                group relative bg-white rounded-2xl border transition-all duration-200
                cursor-pointer overflow-hidden
                ${isActive
                    ? 'border-primary-300 shadow-md shadow-primary-100/60 ring-1 ring-primary-300'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 shadow-sm'
                }
            `}
        >
            {/* Active accent bar */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-l-2xl" />
            )}

            <div className="p-5">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-3 mb-4">

                    {/* Logo + title */}
                    <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200
                            flex items-center justify-center shrink-0 border border-slate-200 shadow-sm overflow-hidden">
                            {/* FIX 2: render real logo when available */}
                            {job.logo ? (
                                <img
                                    src={job.logo}
                                    alt={`${job.company} logo`}
                                    className="w-full h-full object-contain"
                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                            ) : null}
                            {/* Fallback emoji (always rendered, hidden when img loads) */}
                            <span
                                className="text-xl"
                                style={{ display: job.logo ? 'none' : 'flex' }}
                            >
                                🏢
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-[15px] leading-snug truncate
                                group-hover:text-primary-600 transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium truncate mt-0.5">
                                {job.company}
                            </p>
                        </div>
                    </div>

                    {/* Save button
                        FIX 1: removed heartHovered state + mouse handlers.
                        Heart fill is driven purely by isSaved + CSS group-hover.
                        Zero re-renders on hover. */}
                    <button
                        onClick={e => { e.stopPropagation(); onSave(job.id); }}
                        title={isSaved ? 'Remove from saved' : 'Save job'}
                        className={`
                            save-btn group/heart
                            w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                            transition-all duration-150
                            ${isSaved
                                ? 'bg-red-50 text-red-500 border border-red-100'
                                : 'bg-slate-50 text-slate-300 border border-slate-100 hover:bg-red-50 hover:text-red-400 hover:border-red-100'
                            }
                        `}
                    >
                        <Heart
                            size={16}
                            fill={isSaved ? 'currentColor' : 'none'}
                            className="transition-all duration-150 group-hover/heart:fill-current"
                        />
                    </button>
                </div>

                {/* ── Meta row ────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                        <MapPin size={11} className="shrink-0" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={11} className="shrink-0" />
                        {job.postedTime}
                    </span>
                </div>

                {/* ── Match Score ──────────────────────────────────────── */}
                {/* FIX 3: != null so matchPercentage=0 still renders */}
                {job.matchPercentage != null && (
                    <div className="mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                <Zap size={11} className="text-primary-500" />
                                Match Score
                            </span>
                            <span className={`text-sm font-bold tabular-nums ${matchColor}`}>
                                {job.matchPercentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div
                                className={`bg-gradient-to-r ${matchBarColor} h-1.5 rounded-full transition-all duration-700`}
                                style={{ width: `${job.matchPercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{job.skillMatchCount ?? 0}/{job.totalRequiredSkills ?? 0} skills matched</span>
                            <span className="font-semibold text-slate-500">
                                Score: {job.matchScore?.toFixed(1) ?? '—'}
                            </span>
                        </div>
                    </div>
                )}

                {/* ── Salary + Tags ────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-3 gap-2">
                    <p className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                        <DollarSign size={13} className="shrink-0" />
                        {job.salary}
                    </p>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                        {job.jobType && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider
                                px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 border border-primary-100">
                                {job.jobType}
                            </span>
                        )}
                        {job.experience && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider
                                px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                                <Briefcase size={9} />
                                {job.experience}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Skills ──────────────────────────────────────────── */}
                {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-medium border border-slate-200"
                            >
                                {skill.name}
                            </span>
                        ))}
                        {job.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-lg text-[11px] font-medium border border-slate-200">
                                +{job.skills.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* ── CTA ─────────────────────────────────────────────── */}
                <button
                    onClick={e => { e.stopPropagation(); onViewDetails(job); }}
                    className={`
                        w-full flex items-center justify-center gap-2
                        py-2.5 rounded-xl font-semibold text-sm
                        transition-all duration-200 group/btn
                        ${isActive
                            ? `${THEME_CLASSES.buttons.primary} shadow-sm`
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
                        }
                    `}
                >
                    View Details
                    <ChevronRight
                        size={15}
                        className="group-hover/btn:translate-x-0.5 transition-transform duration-200"
                    />
                </button>
            </div>
        </div>
    );
}