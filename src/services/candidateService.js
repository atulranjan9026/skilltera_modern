import { get, post, put, del, clearCache } from './api';

/**
 * Candidate service - handles candidate-related API calls
 */
export const candidateService = {
  /**
   * Get candidate profile (cached for 5 minutes)
   */
  getProfile: async (candidateId) => {
    return get(`/candidates/${candidateId}`, true, 300000);
  },

  /**
   * Update candidate profile
   */
  updateProfile: async (candidateId, profileData) => {
    return put(`/candidates/${candidateId}`, profileData);
  },

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
    // Clear applications cache after applying
    clearCache(`GET:/candidates/${candidateId}/applications`);
    return post(`/candidates/${candidateId}/applications/${jobId}`, applicationData);
  },

  /**
   * Get saved jobs (cached for 5 minutes)
   */
  getSavedJobs: async (candidateId) => {
    return get(`/candidates/${candidateId}/saved-jobs`, true, 300000);
  },

  /**
   * Save a job
   */
  saveJob: async (candidateId, jobId) => {
    // Clear saved jobs cache after saving
    clearCache(`GET:/candidates/${candidateId}/saved-jobs`);
    return post(`/candidates/${candidateId}/saved-jobs`, { jobId });
  },

  /**
   * Unsave a job
   */
  unsaveJob: async (candidateId, jobId) => {
    // Clear saved jobs cache after unsaving
    clearCache(`GET:/candidates/${candidateId}/saved-jobs`);
    return del(`/candidates/${candidateId}/saved-jobs/${jobId}`);
  },

  /**
   * Get candidate's resume/CV (cached for 10 minutes)
   */
  getResume: async (candidateId) => {
    return get(`/candidates/${candidateId}/resume`, true, 600000);
  },

  /**
   * Upload resume
   */
  uploadResume: async (candidateId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    // Clear resume cache after upload
    clearCache(`GET:/candidates/${candidateId}/resume`);
    // For file uploads, we need to use the raw axios instance
    return post(`/candidates/${candidateId}/resume`, formData);
  },
  /**
   * Get ranked jobs for candidate with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10, max: 50)
   * @param {string} options.location - Filter by city
   * @param {string} options.jobType - Filter by job type (full-time, part-time, contract, internship, freelance)
   * @param {string} options.experienceLevel - Filter by experience level (entry, mid, senior, lead, executive)
   * @param {number} options.minSalary - Minimum salary filter
   * @param {number} options.maxSalary - Maximum salary filter
   * @param {boolean} options.isRemote - Filter remote jobs
   * @returns {Promise} Jobs with pagination metadata
   */
  getRankingJobs: async (options = {}) => {
    // Build query string from options
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

    // Cache for 5 minutes (300000ms)
    return get(endpoint, true, 300000);
  },

  /**
   * Get autocomplete suggestions for job title/company
   */
  getJobSuggestions: async (query, limit = 8) => {
    const params = new URLSearchParams({ q: query, limit });
    const endpoint = `/candidate/job/suggestions?${params.toString()}`;

    return get(endpoint, false, 0);
  },

  /**
   * Get autocomplete suggestions for location
   */
  getLocationSuggestions: async (query, limit = 8) => {
    const params = new URLSearchParams({ q: query, limit });
    const endpoint = `/candidate/job/location-suggestions?${params.toString()}`;

    return get(endpoint, false, 0);
  },

  /**
   * Get candidate's skills
   * @returns {Promise} Candidate's skills
   */
  getAllActiveSkills: async (search) => {
    let endpoint = '/candidate/skillList/allActiveSkills';
    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }
    // Don't cache search requests to ensure fresh results
    return get(endpoint, false, 0);
  },

  /**
   * Add a skill to candidate's profile
   * @param {Object} skillData - Skill data {name, experienceYears, rating, category}
   * @returns {Promise} Created skill
   */
  addSkill: async (skillData) => {
    clearCache('GET:/candidates/profile/skills');
    return post('/candidates/profile/skills', skillData);
  },

};
