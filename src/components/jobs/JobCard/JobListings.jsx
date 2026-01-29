import React from 'react';
import JobCard from './JobCard';
import JobDescription from './JobDescription';

/**
 * JobListings Component - Manages split-view layout
 */
export default function JobListings({ jobs, savedJobs, onSave, onApply }) {
  const [selectedJob, setSelectedJob] = React.useState(null);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="flex gap-6 ">
      {/* Left Side - Job Cards List */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          selectedJob 
            ? 'w-full lg:w-2/5 xl:w-1/3' 
            : 'w-full'
        }`}
      >
        <div className={`${
          selectedJob 
            ? 'h-full overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 p-2'
            : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={handleViewDetails}
              onSave={onSave}
              isSaved={savedJobs.includes(job.id)}
              isActive={selectedJob?.id === job.id}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Job Details Panel */}
      {selectedJob && (
        <div 
          className={`
            fixed lg:relative inset-0 lg:inset-auto
            w-full lg:w-3/5 xl:w-2/3
            bg-white lg:bg-transparent
            z-50 lg:z-auto
            transition-all duration-500 ease-in-out
            ${selectedJob ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full overflow-hidden border-l border-slate-200 rounded-lg shadow-xl">
            <JobDescription
              job={selectedJob}
              onClose={handleCloseDetails}
              onApply={onApply}
              onSave={onSave}
              isSaved={savedJobs.includes(selectedJob.id)}
            />
          </div>
        </div>
      )}

      
    </div>
  );
}
