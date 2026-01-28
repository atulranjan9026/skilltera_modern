import React, { useState } from 'react';
import SearchBar from '../../../components/jobs/SearchBar';
import FilterDropdown from '../../../components/jobs/FilterDropdown';
import JobCard from '../../../components/jobs/JobCard';
import EmptyState from '../../../components/common/EmptyState';
import { MOCK_JOBS, JOB_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES } from '../../../data/mockData';

/**
 * Job Search Page - Browse and filter jobs
 */
export default function JobSearchPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobTypes: [],
    experience: [],
    salaryRange: '',
  });
  const [searchQuery, setSearchQuery] = useState({
    jobTitle: '',
    location: '',
  });

  // Filter and search jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title
      .toLowerCase()
      .includes(searchQuery.jobTitle.toLowerCase());
    const matchesLocation = searchQuery.location
      ? job.location.toLowerCase().includes(searchQuery.location.toLowerCase())
      : true;
    const matchesJobType =
      filters.jobTypes.length === 0 || filters.jobTypes.includes(job.jobType);
    const matchesExperience =
      filters.experience.length === 0 || filters.experience.includes(job.experience);

    return matchesTitle && matchesLocation && matchesJobType && matchesExperience;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
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
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar - Sticky */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-20 py-4">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} />

          {/* Filter Pills Row */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Job Type"
              options={JOB_TYPES}
              value={filters.jobTypes}
              onChange={(val) => setFilters({ ...filters, jobTypes: val })}
              isMulti={true}
            />
            <FilterDropdown
              label="Experience"
              options={EXPERIENCE_LEVELS}
              value={filters.experience}
              onChange={(val) => setFilters({ ...filters, experience: val })}
              isMulti={true}
            />
            <FilterDropdown
              label="Salary"
              options={SALARY_RANGES.map(r => r.label)}
              value={filters.salaryRange}
              onChange={(val) => setFilters({ ...filters, salaryRange: val })}
            />

            {(filters.jobTypes.length > 0 || filters.experience.length > 0 || filters.salaryRange) && (
              <button
                onClick={() => setFilters({ jobTypes: [], experience: [], salaryRange: '' })}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 ml-2 px-2 py-1"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                isSaved={savedJobs.includes(job.id)}
              />
            ))}
          </div>
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
