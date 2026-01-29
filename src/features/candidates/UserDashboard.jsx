import React, { useState } from 'react';
import { Bookmark, CheckCircle } from 'lucide-react';
import { MOCK_USER, MOCK_JOBS } from '../../data/mockData';
import { THEME_CLASSES } from '../../theme';

/**
 * User Dashboard - View saved and applied jobs
 */
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'applied'
  const [savedJobIds, setSavedJobIds] = useState([1, 3]); // Mock saved jobs
  const [appliedJobIds, setAppliedJobIds] = useState([2, 4]); // Mock applied jobs

  const savedJobs = MOCK_JOBS.filter((job) => savedJobIds.includes(job.id));
  const appliedJobs = MOCK_JOBS.filter((job) => appliedJobIds.includes(job.id));

  const JobItem = ({ job, isApplied }) => (
    <div className={`${THEME_CLASSES.cards} p-6 flex justify-between items-start`}>
      <div className="flex gap-4 flex-1">
        <div className="text-2xl">{job.logo}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-600 mb-2">{job.company}</p>
          <p className="text-sm text-slate-600">{job.location}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary-600 mb-2">{job.salary}</p>
        {isApplied ? (
          <span className="inline-flex items-center gap-1 text-sm text-green-600">
            <CheckCircle size={16} />
            Applied
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm text-slate-600">
            <Bookmark size={16} />
            Saved
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome, {MOCK_USER.name}!
          </h1>
          <p className="text-slate-600">Manage your job applications and saved jobs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className={`${THEME_CLASSES.cards} p-6 text-center`}>
            <p className="text-3xl font-bold text-primary-600 mb-1">
              {savedJobs.length}
            </p>
            <p className="text-sm text-slate-600">Saved Jobs</p>
          </div>
          <div className={`${THEME_CLASSES.cards} p-6 text-center`}>
            <p className="text-3xl font-bold text-primary-600 mb-1">
              {appliedJobs.length}
            </p>
            <p className="text-sm text-slate-600">Applied Jobs</p>
          </div>
          <div className={`${THEME_CLASSES.cards} p-6 text-center col-span-2 md:col-span-1`}>
            <p className="text-3xl font-bold text-primary-600 mb-1">
              {Math.round((appliedJobs.length / (savedJobs.length + appliedJobs.length)) * 100) || 0}%
            </p>
            <p className="text-sm text-slate-600">Apply Rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${THEME_CLASSES.cards} mb-6`}>
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 px-6 font-medium text-center border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`flex-1 py-4 px-6 font-medium text-center border-b-2 transition-colors ${
                activeTab === 'applied'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Applied Jobs ({appliedJobs.length})
            </button>
          </div>
        </div>

        {/* Job Lists */}
        <div className="space-y-4">
          {activeTab === 'saved' ? (
            savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <JobItem key={job.id} job={job} isApplied={false} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No saved jobs yet</p>
                <p className="text-slate-500">Start saving jobs to view them here</p>
              </div>
            )
          ) : appliedJobs.length > 0 ? (
            appliedJobs.map((job) => (
              <JobItem key={job.id} job={job} isApplied={true} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No applied jobs yet</p>
              <p className="text-slate-500">Apply to jobs to track your applications here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
