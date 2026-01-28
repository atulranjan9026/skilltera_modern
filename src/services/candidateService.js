import { api } from './api';

/**
 * Candidate service - handles candidate-related API calls
 */
export const candidateService = {
  /**
   * Get candidate profile
   */
  getProfile: async (candidateId) => {
    return api.get(`/candidates/${candidateId}`);
  },

  /**
   * Update candidate profile
   */
  updateProfile: async (candidateId, profileData) => {
    return api.put(`/candidates/${candidateId}`, profileData);
  },

  /**
   * Get candidate's applications
   */
  getApplications: async (candidateId) => {
    return api.get(`/candidates/${candidateId}/applications`);
  },

  /**
   * Apply for a job
   */
  applyForJob: async (candidateId, jobId, applicationData) => {
    return api.post(`/candidates/${candidateId}/applications/${jobId}`, applicationData);
  },

  /**
   * Get saved jobs
   */
  getSavedJobs: async (candidateId) => {
    return api.get(`/candidates/${candidateId}/saved-jobs`);
  },

  /**
   * Save a job
   */
  saveJob: async (candidateId, jobId) => {
    return api.post(`/candidates/${candidateId}/saved-jobs`, { jobId });
  },

  /**
   * Unsave a job
   */
  unsaveJob: async (candidateId, jobId) => {
    return api.delete(`/candidates/${candidateId}/saved-jobs/${jobId}`);
  },

  /**
   * Get candidate's resume/CV
   */
  getResume: async (candidateId) => {
    return api.get(`/candidates/${candidateId}/resume`);
  },

  /**
   * Upload resume
   */
  uploadResume: async (candidateId, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    // Handle file upload with FormData
    return api.post(`/candidates/${candidateId}/resume`, formData);
  },
};
