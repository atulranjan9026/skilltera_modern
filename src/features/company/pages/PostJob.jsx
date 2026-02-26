import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];

export default function PostJob() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!companyId) {
      setApiError('Company ID not found. Please log in again.');
      return;
    }
    try {
      setSubmitting(true);
      setApiError(null);
      const jobData = {
        ...data,
        skills: data.skills
          ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        salary: data.salaryMin || data.salaryMax
          ? { min: data.salaryMin, max: data.salaryMax, currency: data.currency || 'USD' }
          : undefined,
      };
      delete jobData.salaryMin;
      delete jobData.salaryMax;
      delete jobData.currency;

      await companyService.postJob(companyId, jobData);
      setSuccess(true);
      reset();
      setTimeout(() => navigate('/company/jobs'), 2000);
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-slate-500 mt-1">Create and publish a new job opening.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Job posted successfully! Redirecting to jobs list...
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 border-b pb-3">Job Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Job title is required' })}
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={5}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Type & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Job type is required' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                {...register('experienceLevel')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level</option>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              {...register('location')}
              type="text"
              placeholder="e.g. New York, NY or Remote"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Required Skills
            </label>
            <input
              {...register('skills')}
              type="text"
              placeholder="e.g. React, Node.js, MongoDB (comma separated)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  {...register('salaryMin')}
                  type="number"
                  placeholder="Min"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  {...register('salaryMax')}
                  type="number"
                  placeholder="Max"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  {...register('currency')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Application Deadline
            </label>
            <input
              {...register('deadline')}
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/company/jobs')}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}