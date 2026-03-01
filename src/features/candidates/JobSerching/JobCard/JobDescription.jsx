import React from 'react';
import { Link } from 'react-router-dom';
import {
  X, MapPin, Clock, DollarSign, Building, Users,
  Calendar, Share2, Bookmark, ExternalLink, ChevronLeft,
  Briefcase, CheckCircle, Gift,
} from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

/**
 * JobDescription Component - Shows detailed job information
 */
export default function JobDescription({ job, onClose, onApply, onSave, isSaved, assessmentCompleted = true }) {
  if (!job) return null;

  return (
    <div className="h-full flex flex-col bg-white animate-slide-in-right">

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="p-5 pb-4">

          {/* Top bar: back + actions */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-slate-500
                hover:text-slate-800 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100 -ml-2"
              aria-label="Close"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
                title={isSaved ? 'Remove from saved' : 'Save job'}
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all duration-150 border
                  ${isSaved
                    ? 'bg-red-50 text-red-500 border-red-100'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-red-50 hover:text-red-400 hover:border-red-100'}
                `}
              >
                <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-white text-slate-400 border border-slate-200
                  hover:bg-slate-50 hover:text-slate-600 transition-colors"
                title="Share"
              >
                <Share2 size={17} />
              </button>
              <button
                onClick={onClose}
                className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center
                  bg-white text-slate-400 border border-slate-200
                  hover:bg-slate-50 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Company logo + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200
              border border-slate-200 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              {job.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 leading-tight mb-0.5">{job.title}</h2>
              <p className="text-sm text-slate-500 font-medium mb-2">{job.company}</p>
              <div className="flex flex-wrap gap-1.5">
                {job.jobType && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5
                    rounded-md bg-primary-50 text-primary-600 border border-primary-100">
                    {job.jobType}
                  </span>
                )}
                {job.experience && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5
                    rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                    {job.experience}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5
                  rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Actively Hiring
                </span>
              </div>
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { icon: MapPin,     value: job.location },
              { icon: DollarSign, value: job.salary,   className: 'font-semibold text-emerald-600' },
              { icon: Clock,      value: job.postedTime },
              { icon: Users,      value: `${job.applicants || '50+'} applicants` },
            ].map(({ icon: Icon, value, className = '' }, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                <Icon size={13} className="text-slate-400 shrink-0" />
                <span className={`text-xs text-slate-700 truncate ${className}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            {assessmentCompleted ? (
              <button
                onClick={() => onApply(job.id)}
                className={`flex-1 ${THEME_CLASSES.buttons.primary} py-2.5 rounded-xl font-semibold text-sm
                  transition-all duration-200 hover:shadow-lg hover:shadow-primary-200/50`}
              >
                Apply Now
              </button>
            ) : (
              <Link
                to="/assessments"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
                  bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors"
              >
                Complete assessment to apply
              </Link>
            )}
            <button
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600
                rounded-xl font-medium text-sm transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <ExternalLink size={14} /> Company
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200
        scrollbar-track-transparent hover:scrollbar-thumb-slate-300">
        <div className="p-5 space-y-7">

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <section>
              <SectionHeading icon={Briefcase} title="Required Skills" />
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <div key={i}
                    className="flex flex-col gap-1.5 bg-white border border-slate-200
                      rounded-xl px-3 py-2.5 shadow-sm hover:border-primary-200 hover:bg-primary-50/30
                      transition-colors duration-150">
                    <span className="text-sm font-semibold text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <div key={j}
                            className={`w-1.5 h-1.5 rounded-full transition-colors
                              ${j < (skill.rating || 0) ? 'bg-primary-500' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      {skill.experience && (
                        <span className="text-[10px] font-medium text-slate-400">{skill.experience}y</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Job Description */}
          <section>
            <SectionHeading icon={Building} title="Job Description" />
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed job-description-content"
              dangerouslySetInnerHTML={{
                __html: job.description ||
                  `<p>We are seeking a talented <strong>${job.title}</strong> to join our dynamic team at ${job.company}.
                  This is an excellent opportunity for someone passionate about technology and innovation.</p>`
              }}
            />
          </section>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <SectionHeading icon={CheckCircle} title="Key Responsibilities" />
              <ul className="space-y-2.5">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section>
              <SectionHeading icon={CheckCircle} title="Requirements" />
              <ul className="space-y-2.5">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <section>
              <SectionHeading icon={Gift} title="Benefits & Perks" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((benefit, i) => (
                  <div key={i}
                    className="flex items-center gap-2.5 text-sm text-slate-700
                      bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* About Company */}
          <section>
            <SectionHeading icon={Building} title={`About ${job.company}`} />
            <p className="text-sm text-slate-600 leading-relaxed">
              {job.companyDescription ||
                `${job.company} is a leading technology company dedicated to innovation and excellence.
                We pride ourselves on creating a collaborative work environment where talented individuals
                can thrive and make a meaningful impact.`}
            </p>
          </section>

          {/* Deadline */}
          {job.deadline && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200
              rounded-xl px-4 py-3">
              <Calendar size={16} className="text-amber-500 shrink-0" />
              <span className="text-sm font-semibold text-amber-800">
                Application Deadline: {job.deadline}
              </span>
            </div>
          )}

          {/* Bottom padding so content clears sticky footer */}
          <div className="h-2" />
        </div>
      </div>

      {/* ── Sticky Footer ─────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 p-4">
        <div className="flex gap-2">
          {assessmentCompleted ? (
            <button
              onClick={() => onApply(job.id)}
              className={`flex-1 ${THEME_CLASSES.buttons.primary} py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 hover:shadow-lg hover:shadow-primary-200/50`}
            >
              Apply for this Position
            </button>
          ) : (
            <Link
              to="/assessments"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors"
            >
              Complete assessment to apply
            </Link>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
            className={`
              px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border
              ${isSaved
                ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}
            `}
          >
            {isSaved ? 'Saved ♥' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section heading atom ───────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
      <span className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100
        flex items-center justify-center shrink-0">
        <Icon size={14} className="text-primary-500" />
      </span>
      {title}
    </h3>
  );
}