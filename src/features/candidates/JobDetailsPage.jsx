import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bookmark, BookmarkCheck, MapPin, DollarSign, Clock,
  Briefcase, Building2, Share2, AlertCircle, CheckCircle, FileText,
  Loader
} from 'lucide-react';
import { useAuthContext } from '../../store/context/AuthContext';
import { candidateService } from '../../services/candidateService';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Fetch job details and application status
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get from applications first
        const res = await candidateService.getApplications(user?._id);
        if (res?.success) {
          const applications = res.data?.applications || [];
          const application = applications.find(app => app.job?._id === jobId);
          
          if (application) {
            setJob(application.job);
            setIsApplied(true);
            setApplicationStatus(application.status);
          } else {
            // Try to get from saved jobs
            const savedRes = await candidateService.getSavedJobs(user?._id);
            if (savedRes?.success) {
              const savedJobs = savedRes.data?.jobs || [];
              const savedJob = savedJobs.find(j => j._id === jobId);
              if (savedJob) {
                setJob(savedJob);
                setIsSaved(true);
              }
            }
          }
        }

        if (!job) {
          setError('Job not found');
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchJobDetails();
    }
  }, [jobId, user?._id]);

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await candidateService.unsaveJob(user?._id, jobId);
        setIsSaved(false);
      } else {
        await candidateService.saveJob(user?._id, jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const handleApply = async () => {
    try {
      await candidateService.applyForJob(user?._id, jobId, {});
      setIsApplied(true);
      setApplicationStatus('applied');
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-primary-600 mx-auto mb-3" />
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Job Not Found</h2>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formattedSalary = job.salary?.min && job.salary?.max
    ? `$${job.salary.min.toLocaleString()} – $${job.salary.max.toLocaleString()}`
    : job.salary?.min
    ? `$${job.salary.min.toLocaleString()}+`
    : null;

  const location = [job.city, job.state, job.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-[#f8f9fb] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm mb-6">
          {/* Top section */}
          <div className="flex gap-4 items-start mb-6">
            {/* Company Avatar */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100 flex items-center justify-center shrink-0">
              <Building2 size={28} className="text-primary-400" />
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-1">
                {job.jobTitle || job.title}
              </h1>
              {job.companyId?.companyName && (
                <p className="text-lg text-slate-600 font-medium">{job.companyId.companyName}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveToggle}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Unsave job' : 'Save job'}
              >
                {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
              <button
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                title="Share job"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-slate-100">
            {location && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                <MapPin size={14} /> {location}
              </span>
            )}
            {formattedSalary && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                <DollarSign size={14} /> {formattedSalary}
              </span>
            )}
            {job.jobType && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                <Briefcase size={14} /> {job.jobType}
              </span>
            )}
            {job.workExperience != null && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                <Clock size={14} /> {job.workExperience}+ years
              </span>
            )}
          </div>

          {/* Application status */}
          {isApplied && applicationStatus && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <CheckCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Application Status</p>
                <p className="text-sm text-blue-700">
                  You applied for this position with status: <span className="font-semibold capitalize">{applicationStatus}</span>
                </p>
              </div>
            </div>
          )}

          {/* Job description */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">About the Job</h2>
            <div className="prose prose-sm max-w-none text-slate-600">
              {job.description ? (
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                <p className="text-slate-400">No description provided</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Requirements</h2>
              <div className="prose prose-sm max-w-none text-slate-600">
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            </div>
          )}

          {/* About company */}
          {job.companyId?.description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">About the Company</h2>
              <p className="text-slate-600 leading-relaxed">{job.companyId.description}</p>
            </div>
          )}

          {/* Action CTA */}
          {!isApplied && (
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleApply}
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FileText size={16} className="inline mr-2" />
                Apply Now
              </button>
              <button
                onClick={handleSaveToggle}
                className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-slate-300 transition-colors"
              >
                {isSaved ? 'Remove Save' : 'Save Job'}
              </button>
            </div>
          )}
        </div>

        {/* Posted info */}
        <div className="text-center text-sm text-slate-500">
          {job.postedOn && (
            <p>
              Posted on {new Date(job.postedOn).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
