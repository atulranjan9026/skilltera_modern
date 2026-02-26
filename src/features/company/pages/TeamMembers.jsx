import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users,
  UserPlus,
  Trash2,
  Loader2,
  AlertCircle,
  Mail,
  X,
  CheckCircle,
} from 'lucide-react';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

const ROLE_OPTIONS = ['Hiring Manager', 'Recruiter', 'Interviewer', 'HR', 'Admin', 'Other'];

function AddMemberModal({ onClose, onAdd, companyId }) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setApiError(null);
      const res = await companyService.addTeamMember(companyId, data);
      onAdd(res?.data);
      onClose();
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to add member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold text-slate-900">Add Team Member</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {apiError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
              type="email"
              placeholder="john@company.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              {...register('role')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  useEffect(() => {
    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await companyService.getTeamMembers(companyId);
        setMembers(res?.data || []);
      } catch {
        setError('Failed to load team members.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [companyId]);

  const handleRemove = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the team?`)) return;
    try {
      setRemovingId(memberId);
      await companyService.removeTeamMember(companyId, memberId);
      setMembers((prev) => prev.filter((m) => (m._id || m.id) !== memberId));
      setSuccessMsg(`${memberName} removed from the team.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      alert('Failed to remove member. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleMemberAdded = (newMember) => {
    if (newMember) {
      setMembers((prev) => [...prev, newMember]);
    }
    setSuccessMsg('Team member added successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const AVATAR_COLORS = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500',
    'bg-amber-500', 'bg-red-500', 'bg-teal-500',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-500 mt-1">Manage your hiring team and their access.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {successMsg}
        </div>
      )}

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
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No team members yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Add your first team member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, i) => {
            const id = member._id || member.id;
            const name = member.name || member.fullName || 'Unknown';
            const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={id}
                className="bg-white rounded-lg border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`${colorClass} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                >
                  {getInitials(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{name}</p>
                  {(member.email) && (
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      {member.email}
                    </p>
                  )}
                  {member.role && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                      {member.role}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(id, name)}
                  disabled={removingId === id}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 disabled:opacity-50"
                  title="Remove member"
                >
                  {removingId === id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddMemberModal
          companyId={companyId}
          onClose={() => setShowModal(false)}
          onAdd={handleMemberAdded}
        />
      )}
    </div>
  );
}
