import React, { useState, useEffect } from 'react';
import SearchBar from './JobSerching/Search/SearchBar';
import JobListings from './JobSerching/JobCard/JobListings';
import EmptyState from '../../components/common/EmptyState';
import { candidateService } from '../../services/candidateService';
import { useAuthContext } from '../../store/context/AuthContext';
import { useTestCompletion } from '../assessment/hooks/useTestCompletion';
import { toast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';

/**
 * Job Search Page - Browse and filter jobs
 */
export default function JobSearchPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { completed: assessmentCompleted } = useTestCompletion(user?._id);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: '',
    datePosted: '',
    remote: false,
  });
  const [searchQuery, setSearchQuery] = useState({
    jobTitle: '',
    location: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(9);

  useEffect(() => {
    fetchActiveJobs();
    fetchSavedJobs();
  }, [currentPage, searchQuery, filters]);

  const fetchSavedJobs = async () => {
    try {
      const response = await candidateService.getSavedJobs(user._id);
      if (response?.success) {
        setSavedJobs(response.data?.jobs?.map(job => job._id || job.id) || []);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };


  /**
   * Transform backend job data to frontend format
   */
  const transformJobData = (backendJobs) => {
    return backendJobs.map(job => ({
      id: job._id || job.jobId,
      title: job.jobTitle,
      company: job.companyName || 'Unknown Company',
      logo: '🏢',
      location: [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Location not specified',
      salary: job.salary ? `${job.salary.currency} ${job.salary.min?.toLocaleString() || 'N/A'} - ${job.salary.max?.toLocaleString() || 'N/A'} ${job.salary.period || ''}`.trim() : 'Competitive',
      jobType: job.jobType === 'Full Time' ? 'Full Time' : job.jobType || 'Full Time',
      experience: job.workExperience !== undefined ? `${job.workExperience} years` : 'Not specified',
      postedTime: job.postedOn ? new Date(job.postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      jobDescription: job.jobDescription || '',
      skills: job.skillDetails?.map(s => ({
        name: s.skill || 'Unknown Skill',
        rating: s.rating || 0,
        experience: s.experience || 0
      })) || [],
      // Match score fields from ranking algorithm
      matchScore: job.matchScore,
      matchPercentage: job.matchPercentage,
      skillMatchCount: job.skillMatchCount,
      totalRequiredSkills: job.totalRequiredSkills,
      // Additional fields
      benefits: [], // Not in projection
      responsibilities: [], // Not in projection
      qualifications: [], // Not in projection
      applicationDeadline: job.lastDate,
      openings: job.openings,
      applicationsCount: job.applicationsCount,
      isFeatured: job.isFeatured,
      _original: job
    }));
  };

  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: jobsPerPage,
        jobTitle: searchQuery.jobTitle || '',
        location: searchQuery.location || '',
      };

      if (filters.jobType && filters.jobType.length > 0) {
        params.jobType = Array.isArray(filters.jobType) ? filters.jobType[0] : filters.jobType;
      }

      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        const experienceLevels = filters.experienceLevel.map(exp => {
          if (typeof exp === 'string') {
            if (exp.toLowerCase().includes('entry')) return 'entry';
            if (exp.toLowerCase().includes('mid')) return 'mid';
            if (exp.toLowerCase().includes('senior')) return 'senior';
            if (exp.toLowerCase().includes('lead')) return 'lead';
            if (exp.toLowerCase().includes('director') || exp.toLowerCase().includes('executive')) return 'executive';
          }
          const expYears = parseInt(exp) || 0;
          if (expYears === 0) return 'entry';
          if (expYears <= 3) return 'mid';
          if (expYears <= 7) return 'senior';
          return 'lead';
        });
        params.experienceLevel = experienceLevels;
      }

      if (filters.salaryRange) {
        const salaryMatch = filters.salaryRange.match(/\$(\d+)k-(\d+)k/);
        if (salaryMatch) {
          params.minSalary = parseInt(salaryMatch[1]) * 1000;
          params.maxSalary = parseInt(salaryMatch[2]) * 1000;
        } else if (filters.salaryRange.includes('+')) {
          const salaryMatch = filters.salaryRange.match(/\$(\d+)k\+/);
          if (salaryMatch) {
            params.minSalary = parseInt(salaryMatch[1]) * 1000;
          }
        }
      }

      if (filters.datePosted && filters.datePosted !== 'any') {
        const dateMap = { '24h': 1, '3d': 3, '7d': 7, '14d': 14, '30d': 30 };
        params.postedWithin = dateMap[filters.datePosted] || undefined;
      }

      if (filters.remote) {
        params.isRemote = true;
      }
      const response = await candidateService.getRankingJobs(params);

      if (response?.success && response.data) {
        const transformedJobs = transformJobData(response.data.jobs || []);
        setJobs(transformedJobs);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalJobs(response.data.pagination.totalJobs || 0);
        } else {
          setTotalPages(1);
          setTotalJobs(transformedJobs.length);
        }
      } else {
        setJobs([]);
        setTotalPages(1);
        setTotalJobs(0);
      }

    } catch (err) {
      console.error('Error fetching active jobs:', err);
      // Don't show error on 404 (No jobs found), just empty list
      if (err.response && err.response.status === 404) {
        setJobs([]);
        setTotalPages(0);
        setTotalJobs(0);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch active jobs');
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs;

  const handleSearch = (query) => {
    // Update search query state immediately
    const newSearchQuery = {
      jobTitle: query.jobTitle || '',
      location: query.location || ''
    };

    const newFilters = {
      jobType: query.jobType || [],
      experienceLevel: query.experience || [],
      salaryRange: query.salaryRange || '',
      datePosted: query.datePosted || '',
      remote: query.remote || false,
      companyType: query.companyType || []
    };

    setSearchQuery(newSearchQuery);
    setFilters({ ...newFilters });
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Unsave the job
        await candidateService.unsaveJob(user._id, jobId);
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        toast.success('Job removed from saved list');
      } else {
        // Save the job
        await candidateService.saveJob(user._id, jobId);
        setSavedJobs((prev) => [...prev, jobId]);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!user?._id) {
      toast.error('Please log in to apply for jobs');
      return;
    }
    if (!assessmentCompleted) {
      toast.error('Complete assessment to apply for jobs');
      return;
    }

    try {
      const applicationData = {}; // Backend uses jobId from URL params

      const response = await candidateService.applyForJob(user._id, jobId, applicationData);

      if (response?.success) {
        toast.success('Job application submitted successfully!');
      } else {
        throw new Error(response?.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to apply for job. Please try again.');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar - Sticky */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-20 py-4">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} onChatClick={() => navigate('/chat')} />
        </div>
      </div>

      {/* Results Counter */}
      {!loading && !error && totalJobs > 0 && (
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="container mx-auto px-4">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{indexOfFirstJob + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(indexOfLastJob, totalJobs)}</span> of{' '}
              <span className="font-semibold">{totalJobs}</span> jobs
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-slate-600">Loading jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading jobs</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchActiveJobs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <div className="flex gap-8">
            {/* Job Listings - Left Side */}
            <div className="flex-1">
              <JobListings
                jobs={jobs}
                savedJobs={savedJobs}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                assessmentCompleted={assessmentCompleted}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                      }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${currentPage === pageNumber
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2 text-slate-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            jobDescription="Try adjusting your search or filters to find more jobs"
          />
        )}
      </div>
    </div>
  );
}
