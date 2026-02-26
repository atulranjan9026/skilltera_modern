import { get, post, put, del, clearCache } from './api';

export const companyService = {
  getProfile: async (companyId) => {
    return get(`/company/${companyId}`, true, 300000);
  },

  updateProfile: async (companyId, profileData) => {
    return put(`/company/${companyId}`, profileData);
  },

  getJobs: async (companyId) => {
    return get(`/company/${companyId}/jobs`, true, 120000);
  },

  postJob: async (companyId, jobData) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return post(`/company/${companyId}/jobs`, jobData);
  },

  updateJob: async (companyId, jobId, jobData) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return put(`/company/${companyId}/jobs/${jobId}`, jobData);
  },

  deleteJob: async (companyId, jobId) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return del(`/company/${companyId}/jobs/${jobId}`);
  },

  getJobApplications: async (companyId, jobId) => {
    return get(`/company/${companyId}/jobs/${jobId}/applications`, true, 60000);
  },

  getAllApplications: async (companyId) => {
    return get(`/company/${companyId}/applications`, true, 60000);
  },

  updateApplicationStatus: async (companyId, applicationId, status) => {
    clearCache(`GET:/company/${companyId}/applications`);
    clearCache(`GET:/company/${companyId}/jobs`);
    return put(`/company/${companyId}/applications/${applicationId}`, { status });
  },

  getTeamMembers: async (companyId) => {
    return get(`/company/${companyId}/team`, true, 600000);
  },

  addTeamMember: async (companyId, memberData) => {
    clearCache(`GET:/company/${companyId}/team`);
    return post(`/company/${companyId}/team`, memberData);
  },

  removeTeamMember: async (companyId, memberId) => {
    clearCache(`GET:/company/${companyId}/team`);
    return del(`/company/${companyId}/team/${memberId}`);
  },
};