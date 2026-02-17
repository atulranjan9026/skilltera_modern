import { get, post, del, clearCache } from '../api';

export const jobService = {
    /**
     * Get candidate's applications (cached for 2 minutes)
     */
    getApplications: async (candidateId) => {
        return get(`/candidates/${candidateId}/applications`, true, 120000);
    },

    /**
     * Apply for a job
     */
    applyForJob: async (candidateId, jobId, applicationData) => {
        clearCache(`GET:/candidates/${candidateId}/applications`);
        return post(`/candidates/job/apply/${jobId}`, applicationData);
    },

    /**
     * Get saved jobs (cached for 5 minutes)
     */
    getSavedJobs: async (candidateId) => {
        return get(`/candidates/saved`, true, 300000);
    },

    /**
     * Save a job
     */
    saveJob: async (candidateId, jobId) => {
        clearCache(`GET:/candidates/saved`);
        return post(`/candidates/job/save`, { jobId });
    },

    /**
     * Unsave a job
     */
    unsaveJob: async (candidateId, jobId) => {
        clearCache(`GET:/candidates/saved`);
        return del(`/candidates/job/unsave/${jobId}`);
    },

    /**
     * Get ranked jobs
     */
    getRankingJobs: async (options = {}) => {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.location) params.append('location', options.location);
        if (options.jobTitle) params.append('jobTitle', options.jobTitle);
        if (options.jobType) params.append('jobType', options.jobType);
        if (options.experienceLevel) params.append('experienceLevel', options.experienceLevel);
        if (options.minSalary) params.append('minSalary', options.minSalary);
        if (options.maxSalary) params.append('maxSalary', options.maxSalary);
        if (options.isRemote !== undefined) params.append('isRemote', options.isRemote);
        if (options.postedWithin) params.append('postedWithin', options.postedWithin);

        const queryString = params.toString();
        const endpoint = `/candidate/job/ranking${queryString ? `?${queryString}` : ''}`;
        return get(endpoint, true, 300000);
    },

    /**
     * Get job suggestions
     */
    getJobSuggestions: async (query, limit = 8) => {
        const params = new URLSearchParams({ q: query, limit });
        return get(`/candidate/job/suggestions?${params.toString()}`, false, 0);
    },

    /**
     * Get location suggestions
     */
    getLocationSuggestions: async (query, limit = 8) => {
        const params = new URLSearchParams({ q: query, limit });
        return get(`/candidate/job/location-suggestions?${params.toString()}`, false, 0);
    }
};
