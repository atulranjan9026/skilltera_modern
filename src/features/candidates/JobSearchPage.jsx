import React, { useState, useEffect } from 'react';
import SearchBar from './JobSerching/Search/SearchBar';
import JobListings from './JobSerching/JobCard/JobListings';
import EmptyState from '../../components/common/EmptyState';
import { candidateService } from '../../services/candidateService';

/**
 * Job Search Page - Browse and filter jobs
 */
export default function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState({
    jobTypes: [],
    experience: [],
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
  }, [currentPage, searchQuery, filters]);

  /**
   * Transform backend job data to frontend format
   */
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
      salary: 'Competitive',
      jobType: job.jobType || 'Full-time',
      experience: job.workExperience ? `${job.workExperience} years` : 'Not specified',
      postedTime: job.postedOn ? new Date(job.postedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      description: job.jobDescription || '',
      skills: job.skillDetails?.map(s => ({
        name: s.name || s.skill || 'Unknown Skill',
        rating: 0,
        experience: 0
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
      isFeatured: false, // Not in projection
      // Keep original data for reference
      _original: job
    }));
  };

  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct params for backend API
      const params = {
        page: currentPage,
        limit: jobsPerPage,
      };

      // Location filter (maps to city regex in backend)
      if (searchQuery.jobTitle) {
        params.jobTitle = searchQuery.jobTitle;
      }

      if (searchQuery.location) {
        params.location = searchQuery.location;
      }

      // Job type filter
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        params.jobType = filters.jobTypes[0];
      }

      // Experience level filter
      // Backend uses 'experienceLevel' in query, but filters by 'workExperience' in aggregation
      // We'll send experienceLevel if mapped
      if (filters.experience && filters.experience.length > 0) {
        const expYears = parseInt(filters.experience[0]) || 0;
        if (expYears === 0) params.experienceLevel = 'entry';
        else if (expYears <= 3) params.experienceLevel = 'mid';
        else if (expYears <= 7) params.experienceLevel = 'senior';
        else params.experienceLevel = 'lead';
      }

      // Salary and Remote filters are currently disabled in backend

      // Call the service method
      const response = await candidateService.getRankingJobs(params);
      console.log('Backend response:', response);

      // Handle standardized API response structure
      if (response && response.success && response.data) {
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
    // Separate search query and filters
    setSearchQuery({
      jobTitle: query.jobTitle || '',
      location: query.location || ''
    });

    setFilters({
      jobTypes: query.jobType || [], // Map jobType (singular from SearchBar) to jobTypes (plural in state)
      experience: query.experience || [],
      salaryRange: query.salaryRange || '',
      datePosted: query.datePosted || '',
      remote: query.remote || false,
      companyType: query.companyType || []
    });

    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId) => {
    alert(`Applied for job ID: ${jobId}`);
    // In real app, this would call an API
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
          <SearchBar onSearch={handleSearch} />
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
      <div className="container mx-auto px-4 py-8">
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
          <>
            <JobListings
              jobs={jobs}
              savedJobs={savedJobs}
              onSave={handleSaveJob}
              onApply={handleApplyJob}
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
          </>
        ) : (
          <EmptyState
            title="No jobs found"
            description="Try adjusting your search or filters to find more jobs"
          />
        )}
      </div>
    </div>
  );
}
