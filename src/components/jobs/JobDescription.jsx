import React from 'react';
import { Heart, Briefcase, MapPin, Clock, DollarSign, Building, Users, Calendar, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { THEME_CLASSES } from '../../theme';

/**
 * JobDescription Component - Displays detailed job information
 */
export default function JobDescription({ job, isSaved, onSave, onClose }) {
  return (
    <div className="h-full bg-white border-l border-slate-200 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to list</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Share job"
            >
              <Share2 size={18} className="text-slate-600" />
            </button>
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
        </div>

        {/* Job Title and Company */}
        <div className="flex gap-4 mb-4">
          <div className="text-3xl flex-shrink-0">{job.logo}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
            <p className="text-lg text-slate-700 font-medium">{job.company}</p>
          </div>
        </div>

        {/* Key Info */}
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="flex-shrink-0" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="flex-shrink-0" />
            {job.jobType}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="flex-shrink-0" />
            {job.postedTime}
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="flex-shrink-0" />
            {job.salary}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* About the Job */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">About the Job</h2>
          <div className="prose prose-sm max-w-none text-slate-600">
            <p>{job.description || 'We are looking for a talented and motivated individual to join our dynamic team. This role offers an excellent opportunity to grow your career while working on exciting projects with cutting-edge technologies.'}</p>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Responsibilities</h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Develop and maintain high-quality software solutions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Collaborate with cross-functional teams to design and implement new features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Participate in code reviews and ensure best practices are followed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Troubleshoot and resolve technical issues</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Stay up-to-date with emerging technologies and industry trends</span>
            </li>
          </ul>
        </section>

        {/* Requirements */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Requirements & Qualifications</h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Bachelor's degree in Computer Science or related field</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>{job.experience || '3+ years'} of experience in software development</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Proficiency in modern programming languages and frameworks</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Strong problem-solving and analytical skills</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Excellent communication and teamwork abilities</span>
            </li>
          </ul>
        </section>

        {/* Benefits */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Heart size={18} className="text-primary-600" />
              <span className="text-sm text-slate-700">Comprehensive health insurance</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar size={18} className="text-primary-600" />
              <span className="text-sm text-slate-700">Flexible work schedule</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <DollarSign size={18} className="text-primary-600" />
              <span className="text-sm text-slate-700">Competitive salary & bonuses</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Users size={18} className="text-primary-600" />
              <span className="text-sm text-slate-700">Professional development opportunities</span>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">About the Company</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              {job.logo}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{job.company}</h3>
              <p className="text-sm text-slate-600 mb-3">
                {job.companyDescription || 'A leading technology company focused on innovation and excellence. We believe in creating products that make a difference in people\'s lives.'}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Building size={14} />
                  <span>{job.companySize || '100-500 employees'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{job.companyLocation || 'San Francisco, CA'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-3">
          <button
            className={`flex-1 ${THEME_CLASSES.buttons.primary} py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md`}
          >
            Apply Now
          </button>
          <button
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors duration-200 flex items-center gap-2"
          >
            <ExternalLink size={16} />
            <span>Apply on Company Site</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
