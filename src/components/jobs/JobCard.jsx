import React from 'react';
import { Heart, Briefcase, MapPin, Clock } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';

/**
 * JobCard Component - Displays a single job listing
 */
export default function JobCard({ job, onSave, onApply, isSaved }) {
  return (
    <div className={`${THEME_CLASSES.cards} p-5 transition-all duration-200`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 flex-1">
          <div className="text-2xl">{job.logo}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-base hover:text-primary-600 cursor-pointer">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600">{job.company}</p>
          </div>
        </div>
        <button
          onClick={() => onSave(job.id)}
          className={`p-2 rounded-lg transition-colors ${
            isSaved
              ? 'bg-primary-100 text-primary-600'
              : 'hover:bg-slate-100 text-slate-400'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="flex-shrink-0" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={16} className="flex-shrink-0" />
          {job.postedTime}
        </div>
      </div>

      {/* Salary and Tags */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-primary-600 text-sm">{job.salary}</p>
        <div className="flex gap-2">
          <span className={`${THEME_CLASSES.badges.primary}`}>{job.jobType}</span>
          <span className={`${THEME_CLASSES.badges.info}`}>{job.experience}</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onApply(job.id)}
        className={`w-full ${THEME_CLASSES.buttons.primary} py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md`}
      >
        Apply Now
      </button>
    </div>
  );
}
