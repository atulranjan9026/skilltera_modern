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
};
