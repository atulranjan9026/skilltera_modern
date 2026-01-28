import React, { useState } from 'react';
import SearchBar from '../../../components/jobs/SearchBar';
import JobCard from '../../../components/jobs/JobCard';
import JobDescription from '../../../components/jobs/JobDescription';
import EmptyState from '../../../components/common/EmptyState';
import { MOCK_JOBS, JOB_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES } from '../../../data/mockData';

/**
 * Job Search Page - Browse and filter jobs
 */
export default function JobSearchPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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

  const handleViewDescription = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const handleCloseDescription = () => {
    setSelectedJob(null);
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
        </div>
      </div>

      {/* Results Counter */}
      {/* <div className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-4">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
          </p>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {filteredJobs.length > 0 ? (
          <div className="flex gap-6">
            {/* Job Listings */}
            <div className={`transition-all duration-300 ease-out ${
              selectedJob 
                ? 'w-full lg:w-2/5 xl:w-1/3' 
                : 'w-full'
            }`}>
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    onViewDescription={handleViewDescription}
                    isSaved={savedJobs.includes(job.id)}
                  />
                ))}
              </div>
            </div>

            {/* Job Description Panel */}
            {selectedJob && (
              <div className="hidden lg:block lg:w-3/5 xl:w-2/3 transition-all duration-300 ease-out animate-slide-in">
                <JobDescription
                  job={selectedJob}
                  isSaved={savedJobs.includes(selectedJob.id)}
                  onSave={handleSaveJob}
                  onClose={handleCloseDescription}
                />
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            description="Try adjusting your search or filters to find more jobs"
          />
        )}

        {/* Mobile Job Description Overlay */}
        {selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
              <JobDescription
                job={selectedJob}
                isSaved={savedJobs.includes(selectedJob.id)}
                onSave={handleSaveJob}
                onClose={handleCloseDescription}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}
