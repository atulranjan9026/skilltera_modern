import React from 'react';
import { Heart, Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

/**
 * JobCard Component - Displays a single job listing
 */
export default function JobCard({ job, onViewDetails, isSaved, onSave, isActive }) {

  return (
    <div
      className={`${THEME_CLASSES.cards} p-5 transition-all duration-200 cursor-pointer max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 ${isActive ? 'ring-2 ring-primary-500 bg-primary-50/50' : 'hover:shadow-lg'
        }`}
      onClick={() => onViewDetails(job)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 flex-1">
          <div className="text-2xl">{job.logo}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-base hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600">{job.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(job.id);
          }}
          className={`p-2 rounded-lg transition-colors ${isSaved
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

      {/* Match Score - NEW */}
      {job.matchPercentage !== undefined && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary-700">Match Score</span>
            <span className="text-lg font-bold text-primary-600">{job.matchPercentage?.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${job.matchPercentage || 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>{job.skillMatchCount || 0}/{job.totalRequiredSkills || 0} skills match</span>
            <span className="font-medium text-primary-600">Score: {job.matchScore?.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Salary and Tags */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-primary-600 text-sm">{job.salary}</p>
        <div className="flex gap-2">
          <span className={`${THEME_CLASSES.badges.primary}`}>{job.jobType}</span>
          <span className={`${THEME_CLASSES.badges.info}`}>{job.experience}</span>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
            >
              {skill.name}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(job);
        }}
        className={`w-full ${THEME_CLASSES.buttons.primary} py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group`}
      >
        View Details
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
}
