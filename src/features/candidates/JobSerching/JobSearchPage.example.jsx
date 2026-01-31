// Example: How to use the updated candidateService in JobSearchPage.jsx

import React, { useState, useEffect } from 'react';
import { candidateService } from '../../../services/candidateService';

export default function JobSearchPage() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalJobs: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        jobType: '',
        experienceLevel: '',
        minSalary: '',
        maxSalary: '',
        isRemote: undefined
    });

    // Fetch jobs with pagination and filters
    const fetchJobs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await candidateService.getRankingJobs({
                page,
                limit: 10,
                ...filters
            });

            if (response.success) {
                setJobs(response.data.jobs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchJobs(1);
    }, []);

    // Reload when filters change
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchJobs(1); // Reset to page 1 when filters change
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            fetchJobs(pagination.currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination.hasPrevPage) {
            fetchJobs(pagination.currentPage - 1);
        }
    };

    const handlePageChange = (page) => {
        fetchJobs(page);
    };

    // Search jobs by text
    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await candidateService.searchJobs(searchQuery, {
                page: 1,
                limit: 10
            });

            if (response.success) {
                setJobs(response.data.jobs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error searching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get job details
    const handleViewJob = async (jobId) => {
        try {
            const response = await candidateService.getJobById(jobId);
            if (response.success) {
                // Show job details in modal or navigate to details page
                console.log('Job details:', response.data);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    return (
        <div className="job-search-page">
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Filters */}
            <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Job Listings */}
            {loading ? (
                <div>Loading jobs...</div>
            ) : (
                <>
                    <div className="jobs-list">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onViewDetails={() => handleViewJob(job._id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalJobs={pagination.totalJobs}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}

// Example Filter Panel Component
function FilterPanel({ filters, onFilterChange }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
    };

    return (
        <div className="filter-panel">
            <input
                type="text"
                placeholder="Location (e.g., Bangalore)"
                value={localFilters.location}
                onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
            />

            <select
                value={localFilters.jobType}
                onChange={(e) => setLocalFilters({ ...localFilters, jobType: e.target.value })}
            >
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
            </select>

            <select
                value={localFilters.experienceLevel}
                onChange={(e) => setLocalFilters({ ...localFilters, experienceLevel: e.target.value })}
            >
                <option value="">All Experience Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
            </select>

            <input
                type="number"
                placeholder="Min Salary"
                value={localFilters.minSalary}
                onChange={(e) => setLocalFilters({ ...localFilters, minSalary: e.target.value })}
            />

            <input
                type="number"
                placeholder="Max Salary"
                value={localFilters.maxSalary}
                onChange={(e) => setLocalFilters({ ...localFilters, maxSalary: e.target.value })}
            />

            <label>
                <input
                    type="checkbox"
                    checked={localFilters.isRemote === true}
                    onChange={(e) => setLocalFilters({
                        ...localFilters,
                        isRemote: e.target.checked ? true : undefined
                    })}
                />
                Remote Only
            </label>

            <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>
    );
}

// Example Pagination Component
function Pagination({
    currentPage,
    totalPages,
    totalJobs,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onPageChange
}) {
    return (
        <div className="pagination">
            <div className="pagination-info">
                Showing page {currentPage} of {totalPages} ({totalJobs} total jobs)
            </div>

            <div className="pagination-controls">
                <button
                    onClick={onPrevPage}
                    disabled={!hasPrevPage}
                >
                    Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={onNextPage}
                    disabled={!hasNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// Example Job Card Component
function JobCard({ job, onViewDetails }) {
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p className="company">{job.companyName}</p>
            <p className="location">
                {job.location.city}, {job.location.country}
                {job.location.isRemote && ' (Remote)'}
            </p>

            {/* Match Score */}
            <div className="match-score">
                <span>Match: {job.matchPercentage?.toFixed(0)}%</span>
                <span>Score: {job.matchScore?.toFixed(1)}</span>
            </div>

            {/* Skills */}
            <div className="skills">
                {job.requiredSkills?.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                        {skill.skillName}
                    </span>
                ))}
            </div>

            {/* Salary */}
            {job.salary && (
                <p className="salary">
                    {job.salary.currency} {job.salary.min?.toLocaleString()} - {job.salary.max?.toLocaleString()}
                </p>
            )}

            <button onClick={onViewDetails}>View Details</button>
        </div>
    );
}
