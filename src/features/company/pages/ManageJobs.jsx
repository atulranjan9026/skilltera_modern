import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  Trash2,
  Edit,
  Plus,
  Loader2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  const fetchJobs = async () => {
    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await companyService.getJobs(companyId);
      setJobs(res?.data || []);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      setDeletingId(jobId);
      await companyService.deleteJob(companyId, jobId);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
    } catch {
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = jobs.filter((job) => {
    const title = (job.title || job.jobTitle || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const q = search.toLowerCase();
    return title.includes(q) || location.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Jobs</h1>
          <p className="text-slate-500 mt-1">View, edit and manage all your job postings.</p>
        </div>
        <Link
          to="/company/jobs/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {search ? 'No jobs match your search.' : 'No jobs posted yet.'}
          </p>
          {!search && (
            <Link
              to="/company/jobs/new"
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Post your first job
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Job Title</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Location</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Type</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Posted</th>
                <th className="text-right px-6 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((job) => {
                const id = job._id || job.id;
                return (
                  <tr key={id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-slate-900">
                          {job.title || job.jobTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {job.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{job.type || job.jobType || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'closed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {job.createdAt ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/company/jobs/${id}/edit`)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-slate-500">
            Showing {filtered.length} of {jobs.length} jobs
          </div>
        </div>
      )}
    </div>
  );
}
