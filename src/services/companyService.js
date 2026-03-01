import { get, post, put, del, clearCache } from './api';

export const companyService = {
  getProfile: async (companyId) => {
    return get(`/company/${companyId}`, true, 300000);
  },

  updateProfile: async (companyId, profileData) => {
    return put(`/company/${companyId}`, profileData);
  },

  // ✅ FIX: Was using raw `axios` with hardcoded `/api/v1/` prefix — inconsistent
  // with every other method which uses the `get` helper (which already has the
  // base URL baked in). Also was NOT caching, unlike other GET calls.
  // Now uses `get` helper with cache disabled (0) so pagination stays fresh.
  getJobs: async (companyId, page = 1, params = {}) => {
    const queryParams = new URLSearchParams({ page, limit: 10 });
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    return get(`/company/${companyId}/jobs?${queryParams}`, false);
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

  // ✅ FIX: Same issue as getJobs — was using raw `axios` instead of `get` helper.
  getAllApplications: async (companyId, page = 1, params = {}) => {
    const queryParams = new URLSearchParams({ page, limit: 10 });
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    return get(`/company/${companyId}/applications?${queryParams}`, false);
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