import React, { useEffect, useState } from 'react';
import { Users, Loader2, AlertCircle, Search, Filter, ChevronDown } from 'lucide-react';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

const STATUS_OPTIONS = ['all', 'pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'];

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  interview: 'bg-indigo-100 text-indigo-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-green-100 text-green-700',
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await companyService.getAllApplications(companyId);
        setApplications(res?.data || []);
      } catch {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [companyId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      await companyService.updateApplicationStatus(companyId, applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          (app._id || app.id) === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((app) => {
    const name = (app.candidateName || app.candidate?.name || '').toLowerCase();
    const jobTitle = (app.jobTitle || app.job?.title || '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || jobTitle.includes(q);
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = s === 'all' ? applications.length : applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-1">Review and manage all candidate applications.</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by candidate name or job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No applications found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Candidate</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Job</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Applied</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-slate-600">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => {
                const id = app._id || app.id;
                const status = app.status || 'pending';
                return (
                  <tr key={id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {app.candidateName || app.candidate?.name || 'Unknown'}
                        </p>
                        {(app.candidateEmail || app.candidate?.email) && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {app.candidateEmail || app.candidate?.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {app.jobTitle || app.job?.title || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        {updatingId === id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                          >
                            {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                              <option key={s} value={s} className="capitalize">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-gray-100 text-sm text-slate-500">
            Showing {filtered.length} of {applications.length} applications
          </div>
        </div>
      )}
    </div>
  );
}
