import { api } from './api';

/**
 * Company service - handles company/client-related API calls
 */
export const companyService = {
  /**
   * Get company profile
   */
  getProfile: async (companyId) => {
    return api.get(`/companies/${companyId}`);
  },

  /**
   * Update company profile
   */
  updateProfile: async (companyId, profileData) => {
    return api.put(`/companies/${companyId}`, profileData);
  },

  /**
   * Get company's posted jobs
   */
  getJobs: async (companyId) => {
    return api.get(`/companies/${companyId}/jobs`);
  },

  /**
   * Post a new job
   */
  postJob: async (companyId, jobData) => {
    return api.post(`/companies/${companyId}/jobs`, jobData);
  },

  /**
   * Update a job posting
   */
  updateJob: async (companyId, jobId, jobData) => {
    return api.put(`/companies/${companyId}/jobs/${jobId}`, jobData);
  },

  /**
   * Delete a job posting
   */
  deleteJob: async (companyId, jobId) => {
    return api.delete(`/companies/${companyId}/jobs/${jobId}`);
  },

  /**
   * Get applications for a job
   */
  getJobApplications: async (companyId, jobId) => {
    return api.get(`/companies/${companyId}/jobs/${jobId}/applications`);
  },

  /**
   * Get all applications for company
   */
  getAllApplications: async (companyId) => {
    return api.get(`/companies/${companyId}/applications`);
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (companyId, applicationId, status) => {
    return api.put(`/companies/${companyId}/applications/${applicationId}`, { status });
  },

  /**
   * Get company's employees/team members
   */
  getTeamMembers: async (companyId) => {
    return api.get(`/companies/${companyId}/team`);
  },

  /**
   * Add team member
   */
  addTeamMember: async (companyId, memberData) => {
    return api.post(`/companies/${companyId}/team`, memberData);
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (companyId, memberId) => {
    return api.delete(`/companies/${companyId}/team/${memberId}`);
  },
};
