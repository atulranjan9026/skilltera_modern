import { get, post, put, del, clearCache } from './api';

/**
 * Company service - handles company/client-related API calls
 */
export const companyService = {
  /**
   * Get company profile (cached for 5 minutes)
   */
  getProfile: async (companyId) => {
    return get(`/companies/${companyId}`, true, 300000);
  },

  /**
   * Update company profile
   */
  updateProfile: async (companyId, profileData) => {
    return put(`/companies/${companyId}`, profileData);
  },

  /**
   * Get company's posted jobs (cached for 2 minutes)
   */
  getJobs: async (companyId) => {
    return get(`/companies/${companyId}/jobs`, true, 120000);
  },

  /**
   * Post a new job
   */
  postJob: async (companyId, jobData) => {
    // Clear jobs cache after posting
    clearCache(`GET:/companies/${companyId}/jobs`);
    return post(`/companies/${companyId}/jobs`, jobData);
  },

  /**
   * Update a job posting
   */
  updateJob: async (companyId, jobId, jobData) => {
    // Clear jobs cache after updating
    clearCache(`GET:/companies/${companyId}/jobs`);
    return put(`/companies/${companyId}/jobs/${jobId}`, jobData);
  },

  /**
   * Delete a job posting
   */
  deleteJob: async (companyId, jobId) => {
    // Clear jobs cache after deleting
    clearCache(`GET:/companies/${companyId}/jobs`);
    return del(`/companies/${companyId}/jobs/${jobId}`);
  },

  /**
   * Get applications for a job (cached for 1 minute)
   */
  getJobApplications: async (companyId, jobId) => {
    return get(`/companies/${companyId}/jobs/${jobId}/applications`, true, 60000);
  },

  /**
   * Get all applications for company (cached for 1 minute)
   */
  getAllApplications: async (companyId) => {
    return get(`/companies/${companyId}/applications`, true, 60000);
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (companyId, applicationId, status) => {
    // Clear applications cache after updating
    clearCache(`GET:/companies/${companyId}/applications`);
    clearCache(`GET:/companies/${companyId}/jobs`);
    return put(`/companies/${companyId}/applications/${applicationId}`, { status });
  },

  /**
   * Get company's employees/team members (cached for 10 minutes)
   */
  getTeamMembers: async (companyId) => {
    return get(`/companies/${companyId}/team`, true, 600000);
  },

  /**
   * Add team member
   */
  addTeamMember: async (companyId, memberData) => {
    // Clear team cache after adding
    clearCache(`GET:/companies/${companyId}/team`);
    return post(`/companies/${companyId}/team`, memberData);
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (companyId, memberId) => {
    // Clear team cache after removing
    clearCache(`GET:/companies/${companyId}/team`);
    return del(`/companies/${companyId}/team/${memberId}`);
  },
};
