import React from 'react';
import { 
  X, MapPin, Briefcase, Clock, DollarSign, Building, Users, 
  Calendar, Share2, Bookmark, ExternalLink, ChevronLeft 
} from 'lucide-react';
import { THEME_CLASSES } from '../../../theme';
import './job.css';

/**
 * JobDescription Component - Shows detailed job information
 */
export default function JobDescription({ job, onClose, onApply, onSave, isSaved }) {
  if (!job) return null;

  return (
    <div className="h-full flex flex-col bg-white animate-slide-in-right">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors -ml-2"
              aria-label="Close details"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="text-4xl bg-slate-100 p-3 rounded-xl">{job.logo}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
                  <p className="text-lg text-slate-700 font-medium mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`${THEME_CLASSES.badges.primary} text-xs`}>{job.jobType}</span>
                    <span className={`${THEME_CLASSES.badges.info} text-xs`}>{job.experience}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Actively Hiring
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(job.id);
                }}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isSaved
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-slate-100 text-slate-400'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                title="Share job"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="hidden lg:block p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-700">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-700 font-semibold">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-700">{job.postedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-700">{job.applicants || '50+'} applicants</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onApply(job.id)}
              className={`flex-1 ${THEME_CLASSES.buttons.primary} py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg`}
            >
              Apply Now
            </button>
            <button
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Company Page
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Job Description */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase size={20} className="text-primary-600" />
              Job Description
            </h3>
            <div className="prose prose-sm max-w-none text-slate-700 space-y-3">
              <p>
                {job.description || 
                  `We are seeking a talented ${job.title} to join our dynamic team at ${job.company}. 
                  This is an excellent opportunity for someone passionate about technology and innovation.`}
              </p>
              <p>
                As a {job.title}, you will be responsible for developing and maintaining high-quality 
                applications, collaborating with cross-functional teams, and contributing to the overall 
                success of our projects.
              </p>
            </div>
          </section>

          {/* Key Responsibilities */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
            <ul className="space-y-2 text-slate-700">
              {(job.responsibilities || [
                'Design, develop, and maintain scalable web applications',
                'Collaborate with product managers and designers to implement new features',
                'Write clean, maintainable, and well-documented code',
                'Participate in code reviews and provide constructive feedback',
                'Debug and resolve technical issues in a timely manner',
                'Stay updated with the latest industry trends and technologies'
              ]).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1.5">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements</h3>
            <ul className="space-y-2 text-slate-700">
              {(job.requirements || [
                `${job.experience} experience in relevant field`,
                'Strong problem-solving and analytical skills',
                'Excellent communication and teamwork abilities',
                'Bachelor\'s degree in Computer Science or related field',
                'Proficiency in modern development tools and frameworks',
                'Experience with version control systems (Git)'
              ]).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1.5">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Benefits & Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(job.benefits || [
                'Competitive salary package',
                'Health insurance coverage',
                'Flexible work arrangements',
                'Professional development opportunities',
                'Paid time off and holidays',
                'Modern office environment',
                'Team building activities',
                'Performance bonuses'
              ]).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* About Company */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building size={20} className="text-primary-600" />
              About {job.company}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {job.companyDescription || 
                `${job.company} is a leading technology company dedicated to innovation and excellence. 
                We pride ourselves on creating a collaborative work environment where talented individuals 
                can thrive and make a meaningful impact. Join our team and be part of something extraordinary.`}
            </p>
          </section>

          {/* Application Deadline */}
          {job.deadline && (
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Calendar size={18} />
                <span className="font-medium">Application Deadline: {job.deadline}</span>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      {/* <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
        <div className="flex gap-3">
          <button
            onClick={() => onApply(job.id)}
            className={`flex-1 ${THEME_CLASSES.buttons.primary} py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg`}
          >
            Apply for this Position
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(job.id);
            }}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              isSaved
                ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
        </div>
      </div> */}
    </div>
  );
}
