// ─────────────────────────────────────────────────────────────────────────────
// JobSearchPage.jsx  (fully corrected)
// Fixes applied:
//  1. fetchSavedJobs separated into its own effect (runs once on mount only)
//  2. JSON.stringify used in useEffect deps to avoid infinite re-fetch from
//     new object references on every render
//  3. companyLogo used from API response instead of hardcoded '🏢'
//  4. window.scrollTo replaced with a ref on the results container
//  5. salary transform uses null-safe check (not truthy) so salary=0 works
//  6. benefits / responsibilities / qualifications correctly mapped from API
//  7. Early return added when response has no data
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from './JobSerching/Search/SearchBar';
import JobListings from './JobSerching/JobCard/JobListings';
import EmptyState from '../../components/common/EmptyState';
import { candidateService } from '../../services/candidateService';
import { chatService } from '../../services/chatService';
import { notificationsService } from '../../services/notificationsService';
import { useAuthContext } from '../../store/context/AuthContext';
import { useTestCompletion } from '../assessment/hooks/useTestCompletion';
import { toast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';

/**
 * Job Search Page — Browse and filter ranked jobs
 */
export default function JobSearchPage() {
    const { user }     = useAuthContext();
    const navigate     = useNavigate();
    const resultsRef   = useRef(null); // FIX: replaces window.scrollTo
    const { completed: assessmentCompleted } = useTestCompletion(user?._id);

    const [jobs,       setJobs]       = useState([]);
    const [savedJobs,  setSavedJobs]  = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs,  setTotalJobs]  = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(9);

    const [unreadMessages, setUnreadMessages] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const [filters, setFilters] = useState({
        jobType:         [],
        experienceLevel: [],
        salaryRange:     '',
        datePosted:      '',
        remote:          false,
    });

    const [searchQuery, setSearchQuery] = useState({
        jobTitle:  '',
        location:  '',
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Data fetchers - Define BEFORE useEffect hooks
    // ─────────────────────────────────────────────────────────────────────────

    const fetchSavedJobs = async () => {
        try {
            const response = await candidateService.getSavedJobs(user._id);
            if (response?.success) {
                setSavedJobs(
                    (response.data?.jobs || []).map(job => job._id || job.id)
                );
            }
        } catch (err) {
            console.error('[JobSearchPage] fetchSavedJobs error:', err);
        }
    };

    const fetchActiveJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            // ── Build API params ──────────────────────────────────────
            const params = {
                page:     currentPage,
                limit:    jobsPerPage,
                jobTitle: searchQuery.jobTitle || undefined,
                location: searchQuery.location || undefined,
            };

            if (filters.jobType?.length > 0) {
                // Backend accepts a single jobType string
                params.jobType = Array.isArray(filters.jobType)
                    ? filters.jobType[0]
                    : filters.jobType;
            }

            if (filters.experienceLevel?.length > 0) {
                params.experienceLevel = filters.experienceLevel.map(exp => {
                    if (typeof exp === 'string') {
                        const e = exp.toLowerCase();
                        if (e.includes('entry'))                            return 'entry';
                        if (e.includes('mid'))                              return 'mid';
                        if (e.includes('senior'))                           return 'senior';
                        if (e.includes('lead'))                             return 'lead';
                        if (e.includes('director') || e.includes('executive')) return 'executive';
                    }
                    const yrs = parseInt(exp) || 0;
                    if (yrs === 0)  return 'entry';
                    if (yrs <= 3)   return 'mid';
                    if (yrs <= 7)   return 'senior';
                    return 'lead';
                });
            }

            if (filters.salaryRange) {
                const rangeMatch = filters.salaryRange.match(/\$(\d+)k-(\d+)k/);
                const plusMatch  = filters.salaryRange.match(/\$(\d+)k\+/);
                if (rangeMatch) {
                    params.minSalary = parseInt(rangeMatch[1]) * 1000;
                    params.maxSalary = parseInt(rangeMatch[2]) * 1000;
                } else if (plusMatch) {
                    params.minSalary = parseInt(plusMatch[1]) * 1000;
                }
            }

            if (filters.datePosted && filters.datePosted !== 'any') {
                const dateMap = { '24h': 1, '3d': 3, '7d': 7, '14d': 14, '30d': 30 };
                params.postedWithin = dateMap[filters.datePosted];
            }

            if (filters.remote) {
                params.isRemote = 'true';
            }

            // ── Call API ──────────────────────────────────────────────
            const response = await candidateService.getRankingJobs(params);

            if (response?.success && response.data) {
                setJobs(transformJobData(response.data.jobs || []));

                const pg = response.data.pagination;
                setTotalPages(pg?.totalPages || 1);
                setTotalJobs(pg?.totalJobs   || response.data.jobs?.length || 0);
            } else {
                setJobs([]);
                setTotalPages(1);
                setTotalJobs(0);
            }

        } catch (err) {
            console.error('[JobSearchPage] fetchActiveJobs error:', err);
            if (err.response?.status === 404) {
                setJobs([]);
                setTotalPages(0);
                setTotalJobs(0);
            } else {
                setError(err.response?.data?.message || 'Failed to fetch jobs');
                setJobs([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Transform backend → frontend shape
    // ─────────────────────────────────────────────────────────────────────────

    const transformJobData = (backendJobs) => {
        return backendJobs.map(job => ({
            id:      job._id  || job.jobId,
            title:   job.jobTitle,
            company: job.companyName || 'Unknown Company',

            // FIX 3: Use real logo URL from API, fall back to null (JobCard handles null)
            logo: job.companyLogo || null,

            location: [job.city, job.state, job.country].filter(Boolean).join(', ')
                      || 'Location not specified',

            // FIX 5: null-safe salary — avoids falsy-zero edge case
            salary: job.salary?.min != null
                ? [
                    job.salary.currency,
                    job.salary.min?.toLocaleString(),
                    '-',
                    job.salary.max?.toLocaleString() || 'N/A',
                    job.salary.period || ''
                  ].filter(Boolean).join(' ').trim()
                : 'Competitive',

            jobType:    job.jobType || 'Full Time',
            experience: job.workExperience != null
                ? `${job.workExperience} years`
                : 'Not specified',

            postedTime: job.postedOn
                ? new Date(job.postedOn).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })
                : 'Recently',

            jobDescription: job.jobDescription || '',

            skills: (job.requiredSkills || []).map(s => ({
                name:       s.skillName   || 'Unknown Skill',
                rating:     s.rating      || 0,
                experience: s.experience  || 0,
            })),

            // Match scores
            matchScore:          job.matchScore,
            matchPercentage:     job.matchPercentage,
            skillMatchCount:     job.skillMatchCount,
            totalRequiredSkills: job.totalRequiredSkills,
            experienceMatch:     job.experienceMatch,

            // FIX 6: Actually map these from the API response
            benefits:         job.benefits         || [],
            responsibilities: job.responsibilities || [],
            qualifications:   job.qualifications   || [],

            applicationDeadline: job.lastDate,
            openings:            job.openings,
            applicationsCount:   job.applicationsCount,
            isFeatured:          job.isFeatured,

            _original: job,
        }));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Event handlers
    // ─────────────────────────────────────────────────────────────────────────

    const handleSearch = useCallback((query) => {
        setSearchQuery({
            jobTitle:  query.jobTitle  || '',
            location:  query.location  || '',
        });
        setFilters({
            jobType:         query.jobType         || [],
            experienceLevel: query.experience       || [],
            salaryRange:     query.salaryRange      || '',
            datePosted:      query.datePosted       || '',
            remote:          query.remote           || false,
            companyType:     query.companyType      || [],
        });
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        // FIX 4: scroll to results container via ref instead of window.scrollTo
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleSaveJob = async (jobId) => {
        try {
            if (savedJobs.includes(jobId)) {
                await candidateService.unsaveJob(user._id, jobId);
                setSavedJobs(prev => prev.filter(id => id !== jobId));
                toast.success('Job removed from saved list');
            } else {
                await candidateService.saveJob(user._id, jobId);
                setSavedJobs(prev => [...prev, jobId]);
                toast.success('Job saved successfully');
            }
        } catch (err) {
            console.error('[JobSearchPage] handleSaveJob error:', err);
            toast.error(err.response?.data?.message || 'Failed to save job');
        }
    };

    const handleApplyJob = async (jobId) => {
        if (!user?._id) {
            toast.error('Please log in to apply for jobs');
            return;
        }
        if (!assessmentCompleted) {
            toast.error('Complete your assessment to apply for jobs');
            return;
        }
        try {
            const response = await candidateService.applyForJob(user._id, jobId, {});
            if (response?.success) {
                toast.success('Application submitted successfully!');
            } else {
                throw new Error(response?.message || 'Failed to apply');
            }
        } catch (err) {
            console.error('[JobSearchPage] handleApplyJob error:', err);
            toast.error(err.response?.data?.message || err.message || 'Failed to apply. Please try again.');
        }
    };

    const fetchUnreadMessages = async () => {
        try {
            const response = await chatService.getUserConversations();
            if (response?.success) {
                const conversations = response.conversations || [];
                console.log('Fetched conversations for unread count:', conversations);
                const totalUnread = conversations.reduce((sum, conv) => sum + (conv.candidateUnread || 0), 0);
                console.log('Total unread messages:', totalUnread);
                setUnreadMessages(totalUnread);
            }
        } catch (err) {
            console.error('Failed to fetch unread messages:', err);
            setUnreadMessages(0);
        }
    };

    const fetchUnreadNotifications = async () => {
        try {
            const response = await notificationsService.getUnreadCount(user._id);
            if (response?.success) {
                setUnreadNotifications(response.count || 0);
            } else {
                setUnreadNotifications(0);
            }
        } catch (err) {
            console.error('Failed to fetch unread notifications:', err);
            setUnreadNotifications(0);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Effects - Run after function definitions
    // ─────────────────────────────────────────────────────────────────────────

    // ── FIX 1: Fetch saved jobs ONCE on mount (when user is ready) ──
    useEffect(() => {
        if (user?._id) {
            fetchSavedJobs();
        }
    }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── FIX 2: JSON.stringify prevents infinite loops from new object refs ──
    useEffect(() => {
        fetchActiveJobs();
    }, [currentPage, JSON.stringify(searchQuery), JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch unread messages and notifications count
    useEffect(() => {
        if (user?._id) {
            fetchUnreadMessages();
            fetchUnreadNotifications();
        }
    }, [user?._id]);

    // ─────────────────────────────────────────────────────────────────────────
    // Derived values
    // ─────────────────────────────────────────────────────────────────────────

    const indexOfFirstJob = (currentPage - 1) * jobsPerPage;
    const indexOfLastJob  = indexOfFirstJob + jobsPerPage;

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Search Bar — Sticky */}
            <div className="sticky top-0 bg-white border-b border-slate-200 z-20 py-4">
                <div className="container mx-auto px-4">
                    <SearchBar
                        onSearch={handleSearch}
                        onNotificationsClick={() => navigate('/notifications')}
                        onChatClick={() => navigate('/chat')}
                        unreadNotifications={unreadNotifications}
                        unreadMessages={unreadMessages}
                    />
                </div>
            </div>

            {/* Results Counter */}
            {!loading && !error && totalJobs > 0 && (
                <div className="bg-white border-b border-slate-200 py-3">
                    <div className="container mx-auto px-4">
                        <p className="text-sm text-slate-600">
                            Showing{' '}
                            <span className="font-semibold">{indexOfFirstJob + 1}</span>
                            {' '}to{' '}
                            <span className="font-semibold">{Math.min(indexOfLastJob, totalJobs)}</span>
                            {' '}of{' '}
                            <span className="font-semibold">{totalJobs}</span>
                            {' '}jobs
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {/* FIX 4: ref attached here for scroll target */}
            <div ref={resultsRef} className="container mx-auto px-4 py-8 min-h-screen">

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
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
                        <div className="flex-1">
                            <JobListings
                                jobs={jobs}
                                savedJobs={savedJobs}
                                onSave={handleSaveJob}
                                onApply={handleApplyJob}
                                assessmentCompleted={assessmentCompleted}
                            />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                            currentPage === 1
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            const isNear = pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1;
                                            const isEdge = pageNumber === 1 || pageNumber === totalPages;

                                            if (isEdge || isNear) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                                                            currentPage === pageNumber
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            }
                                            if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                                return <span key={pageNumber} className="px-2 text-slate-400">…</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                            currentPage === totalPages
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
                        description="Try adjusting your search or filters to find more jobs"
                    />
                )}
            </div>
        </div>
    );
}