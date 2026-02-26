import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, MessageSquare, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, appsRes] = await Promise.allSettled([
          companyService.getJobs(companyId),
          companyService.getAllApplications(companyId),
        ]);

        if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value?.data?.jobs || []);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value?.data?.applications || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const activeJobs = jobs.filter((j) => j.status === 'active' || !j.status).length;
  const shortlisted = applications.filter(
    (a) => a.status === 'shortlisted' || a.status === 'interview'
  ).length;

  const stats = [
    {
      label: 'Active Jobs',
      value: loading ? '-' : activeJobs,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/company/jobs',
    },
    {
      label: 'Total Applications',
      value: loading ? '-' : applications.length,
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      link: '/company/applications',
    },
    {
      label: 'Shortlisted',
      value: loading ? '-' : shortlisted,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      link: '/company/applications',
    },
    {
      label: 'Total Jobs Posted',
      value: loading ? '-' : jobs.length,
      icon: MessageSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/company/jobs',
    },
  ];

  const recentApplications = applications.slice(0, 5);
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {companyUser.companyName || 'Company'}
          </p>
        </div>
        <Link
          to="/company/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              to={stat.link}
              key={i}
              className={`${stat.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <Icon className={`${stat.color} w-8 h-8`} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Job Postings</h2>
            <Link to="/company/jobs" className="text-blue-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : recentJobs.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">
              No jobs posted yet.{' '}
              <Link to="/company/jobs/new" className="text-blue-600 hover:underline">
                Post your first job
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job, i) => (
                <div
                  key={job._id || i}
                  className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{job.title || job.jobTitle}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {job.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      )}
                      {job.createdAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      job.status === 'closed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {job.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <Link to="/company/applications" className="text-blue-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : recentApplications.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No applications received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app, i) => (
                <div
                  key={app._id || i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {app.candidateName || app.candidate?.name || 'Candidate'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.jobTitle || app.job?.title || 'Position'}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      app.status === 'shortlisted' || app.status === 'interview'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {app.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}