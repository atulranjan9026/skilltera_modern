// services/companyService.js
import { get, post, put, del, clearCache } from "./api";

export const companyService = {
  // ─── Profile ──────────────────────────────────────────────────────────────

  getProfile: async (companyId) => {
    return get(`/company/${companyId}`, true, 300_000);
  },

  updateProfile: async (companyId, profileData) => {
    // Invalidate the cached profile so the next getProfile call is fresh
    clearCache(`GET:/company/${companyId}`);
    return put(`/company/${companyId}`, profileData);
  },

  // ─── Jobs ─────────────────────────────────────────────────────────────────

  getJobs: async (companyId, page = 1, params = {}) => {
    const qs = new URLSearchParams({ page, limit: 10 });
    if (params.search)  qs.set("search",  params.search);
    if (params.status)  qs.set("status",  params.status);
    if (params.jobType) qs.set("jobType", params.jobType);
    return get(`/company/${companyId}/jobs?${qs}`, false);
  },

  // FIX: removed hardcoded company ID — caller must supply companyId
  postJob: async (companyId, jobData) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return post(`/company/${companyId}/jobs`, jobData);
  },

  // FIX: scoped all job mutation endpoints under /company/:companyId/jobs/:jobId
  updateJob: async (companyId, jobId, jobData) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return put(`/company/${companyId}/jobs/${jobId}`, jobData);
  },

  deleteJob: async (companyId, jobId) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return del(`/company/${companyId}/jobs/${jobId}`);
  },

  getJobById: async (companyId, jobId) => {
    return get(`/company/${companyId}/jobs/${jobId}`, false);
  },

  toggleJobStatus: async (companyId, jobId) => {
    clearCache(`GET:/company/${companyId}/jobs`);
    return post(`/company/${companyId}/jobs/${jobId}/toggle-status`);
  },

  // FIX: scoped under companyId so the backend can authorise the request
  getJobStats: async (companyId) => {
    return get(`/company/${companyId}/jobs/stats`, false);
  },

  getJobApplications: async (companyId, jobId) => {
    return get(`/company/${companyId}/jobs/${jobId}/applications`, true, 60_000);
  },

  // ─── Applications ─────────────────────────────────────────────────────────

  getAllApplications: async (companyId, page = 1, params = {}) => {
    const qs = new URLSearchParams({ page, limit: 10 });
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    return get(`/company/${companyId}/applications?${qs}`, false);
  },

  updateApplicationStatus: async (companyId, applicationId, status) => {
    clearCache(`GET:/company/${companyId}/applications`);
    clearCache(`GET:/company/${companyId}/jobs`);
    return put(`/company/${companyId}/applications/${applicationId}`, { status });
  },

  // ─── Skills ───────────────────────────────────────────────────────────────

  // FIX: only append ?search= when the search string is non-empty
  getAllActiveSkills: async (search = "") => {
    const endpoint = search.trim()
      ? `/company/profile/allActiveSkills?search=${encodeURIComponent(search.trim())}`
      : "/company/profile/allActiveSkills";
    const response = await get(endpoint, false, 0);
    return response?.data || [];
  },

  // ─── Team ─────────────────────────────────────────────────────────────────

  getTeamMembers: async (companyId) => {
    return get(`/company/${companyId}/team`, true, 600_000);
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