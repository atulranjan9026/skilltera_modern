import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { companyService } from '../../../services/companyService';

function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem('companyUser')) || {};
  } catch {
    return {};
  }
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const TRAVEL_OPTIONS = ['Yes', 'No', 'Occasional'];

export default function PostJob() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const navigate = useNavigate();

  const companyUser = getCompanyUser();
  const companyId = companyUser._id || companyUser.id;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      travelRequired: 'No',
      experienceLevel: 'mid',
      currency: 'USD',
      salaryPeriod: 'yearly',
      openings: 1
    },
    mode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  // Fetch skills and roles on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // These would come from your API - adjust endpoints as needed
        // For now, we'll use mock data or fetch from existing endpoints
        const mockSkills = [
          { _id: '1', skillName: 'JavaScript' },
          { _id: '2', skillName: 'React' },
          { _id: '3', skillName: 'Node.js' },
          { _id: '4', skillName: 'Python' },
          { _id: '5', skillName: 'Java' },
          { _id: '6', skillName: 'SQL' },
          { _id: '7', skillName: 'MongoDB' },
          { _id: '8', skillName: 'TypeScript' },
          { _id: '9', skillName: 'AWS' },
          { _id: '10', skillName: 'Docker' },
        ];
        
        const mockRoles = [
          { _id: '1', role: 'Frontend Developer' },
          { _id: '2', role: 'Backend Developer' },
          { _id: '3', role: 'Full Stack Developer' },
          { _id: '4', role: 'DevOps Engineer' },
          { _id: '5', role: 'Data Scientist' },
          { _id: '6', role: 'QA Engineer' },
          { _id: '7', role: 'Product Manager' },
          { _id: '8', role: 'Solutions Architect' },
        ];
        
        setAllSkills(mockSkills);
        setRoles(mockRoles);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  const handleAddSkill = (skill) => {
    if (!skills.find(s => s._id === skill._id)) {
      setSkills([...skills, skill]);
      setSkillInput('');
      setShowSkillDropdown(false);
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSkills(skills.filter(s => s._id !== skillId));
  };

  const filteredSkills = allSkills.filter(skill =>
    skill.skillName.toLowerCase().includes(skillInput.toLowerCase()) &&
    !skills.find(s => s._id === skill._id)
  );

  const onSubmit = async (data) => {
    if (!companyId) {
      setApiError('Company ID not found. Please log in again.');
      return;
    }

    if (skills.length === 0) {
      setApiError('Please add at least one required skill.');
      return;
    }

    try {
      setSubmitting(true);
      setApiError(null);

      const jobData = {
        title: data.jobTitle.trim(),
        description: data.jobDescription.trim(),
        jobType: data.jobType.toLowerCase().replace(' ', '-'),
        experienceLevel: data.experienceLevel || 'mid',
        minExperience: parseInt(data.workExperience) || 0,
        maxExperience: parseInt(data.maxExperience) || parseInt(data.workExperience) + 5 || 5,
        location: {
          city: data.city?.trim() || '',
          state: data.state?.trim() || '',
          country: data.country?.trim() || '',
          isRemote: data.isRemote || false,
          remoteType: data.isRemote ? (data.remoteType || 'fully-remote') : 'on-site'
        },
        salary: data.salaryMin ? {
          min: parseFloat(data.salaryMin),
          max: parseFloat(data.salaryMax) || parseFloat(data.salaryMin),
          currency: data.currency || 'USD',
          period: data.salaryPeriod || 'yearly'
        } : undefined,
        applicationDeadline: data.deadline ? new Date(data.deadline) : null,
        openings: parseInt(data.openings) || 1,
        benefits: data.benefits ? data.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        responsibilities: data.responsibilities ? data.responsibilities.split(',').map(r => r.trim()).filter(r => r) : [],
        qualifications: data.qualifications ? data.qualifications.split(',').map(q => q.trim()).filter(q => q) : [],
        requiredSkills: skills.map(skill => ({
          skillId: skill._id,
          skillName: skill.skillName,
          experience: parseInt(data[`experience_${skill._id}`]) || 1,
          rating: parseInt(data[`rating_${skill._id}`]) || 3,
          isMandatory: true
        })),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        category: data.category?.trim() || ''
      };

      const res = await companyService.postJob(jobData);
      setSuccess(true);
      reset();
      setSkills([]);
      setTimeout(() => navigate('/company/jobs'), 2000);
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to create job. Please try again.');
      console.error('Job creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create a New Job</h1>
        <p className="text-slate-500 mt-1">Fill in all required fields to post a job opening.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Job created successfully! Redirecting...
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Job Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 border-b pb-3">Basic Information</h2>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('jobTitle', { required: 'Job title is required' })}
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('jobDescription', { required: 'Job description is required' })}
              rows={6}
              placeholder="Describe the role, responsibilities, requirements, and company culture..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>}
          </div>

          {/* Job Type and Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('jobType', { required: 'Job type is required' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register('jobRole', { required: 'Job role is required' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.role}
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