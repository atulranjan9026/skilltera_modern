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
    if (params.search)          qs.set("search",          params.search);
    if (params.status)          qs.set("status",          params.status);
    if (params.jobType)         qs.set("jobType",         params.jobType);
    if (params.experience)      qs.set("experience",      params.experience);
    if (params.deadlineWithin)  qs.set("deadlineWithin",  params.deadlineWithin);
    if (params.state)           qs.set("state",           params.state);
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

  deleteApplication: async (companyId, applicationId) => {
    clearCache(`GET:/company/${companyId}/applications`);
    clearCache(`GET:/company/${companyId}/jobs`);
    return del(`/company/${companyId}/applications/${applicationId}`);
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

  // ─── Enterprise Management ────────────────────────────────────────────────────

  // LOB Management
  getLOBs: async () => {
    return get("/company/lobs", false);
  },

  createLOB: async (lobData) => {
    clearCache("GET:/company/lobs");
    return post("/company/lobs", lobData);
  },

  updateLOB: async (lobId, lobData) => {
    clearCache("GET:/company/lobs");
    return put(`/company/lobs/${lobId}`, lobData);
  },

  deleteLOB: async (lobId) => {
    clearCache("GET:/company/lobs");
    return del(`/company/lobs/${lobId}`);
  },

  bulkCreateLOBs: async (lobData) => {
    clearCache("GET:/company/lobs");
    return post("/company/lobs/bulk", lobData);
  },

  // Hiring Manager Management
  getHiringManagers: async () => {
    return get("/company/hiring-managers", false);
  },

  createHiringManager: async (hmData) => {
    clearCache("GET:/company/hiring-managers");
    return post("/company/hiring-managers", hmData);
  },

  updateHiringManager: async (hmId, hmData) => {
    clearCache("GET:/company/hiring-managers");
    return put(`/company/hiring-managers/${hmId}`, hmData);
  },

  deleteHiringManager: async (hmId) => {
    clearCache("GET:/company/hiring-managers");
    return del(`/company/hiring-managers/${hmId}`);
  },

  bulkCreateHiringManagers: async (hmData) => {
    clearCache("GET:/company/hiring-managers");
    return post("/company/hiring-managers/bulk", hmData);
  },

  // Backup Hiring Manager Management
  getBackupHiringManagers: async () => {
    return get("/company/backup-hiring-managers", false);
  },

  createBackupHiringManager: async (bhmData) => {
    clearCache("GET:/company/backup-hiring-managers");
    return post("/company/backup-hiring-managers", bhmData);
  },

  updateBackupHiringManager: async (bhmId, bhmData) => {
    clearCache("GET:/company/backup-hiring-managers");
    return put(`/company/backup-hiring-managers/${bhmId}`, bhmData);
  },

  deleteBackupHiringManager: async (bhmId) => {
    clearCache("GET:/company/backup-hiring-managers");
    return del(`/company/backup-hiring-managers/${bhmId}`);
  },

  // Recruiter Management
  getRecruiters: async () => {
    return get("/company/recruiters", false);
  },

  createRecruiter: async (recruiterData) => {
    clearCache("GET:/company/recruiters");
    return post("/company/recruiters", recruiterData);
  },

  updateRecruiter: async (recruiterId, recruiterData) => {
    clearCache("GET:/company/recruiters");
    return put(`/company/recruiters/${recruiterId}`, recruiterData);
  },

  deleteRecruiter: async (recruiterId) => {
    clearCache("GET:/company/recruiters");
    return del(`/company/recruiters/${recruiterId}`);
  },

  bulkCreateRecruiters: async (recruiterData) => {
    clearCache("GET:/company/recruiters");
    return post("/company/recruiters/bulk", recruiterData);
  },

  // Interviewer Management
  getInterviewers: async () => {
    return get("/company/interviewers", false);
  },

  createInterviewer: async (interviewerData) => {
    clearCache("GET:/company/interviewers");
    return post("/company/interviewers", interviewerData);
  },

  updateInterviewer: async (interviewerId, interviewerData) => {
    clearCache("GET:/company/interviewers");
    return put(`/company/interviewers/${interviewerId}`, interviewerData);
  },

  deleteInterviewer: async (interviewerId) => {
    clearCache("GET:/company/interviewers");
    return del(`/company/interviewers/${interviewerId}`);
  },

  bulkCreateInterviewers: async (interviewerData) => {
    clearCache("GET:/company/interviewers");
    return post("/company/interviewers/bulk", interviewerData);
  },

  assignInterviewers: async (assignmentData) => {
    // assignmentData: { applicationId: string, interviewerIds: string[] }
    return post("/company/interviewers/assign", assignmentData);
  },

  getAssignedCandidates: async () => {
    return get("/company/interviewer/assigned-candidates", false);
  },

  submitFeedback: async (feedbackData) => {
    // feedbackData: { applicationId: string, feedback: string, rating: number, decision: string }
    return post("/company/interviewer/feedback", feedbackData);
  },

  getFeedbackForApplication: async (applicationId) => {
    return get(`/company/interviewer/feedback/${applicationId}`, false);
  },

  // ─── Test Results ───────────────────────────────────────────────────────

  getCandidateTestResults: async (companyId, candidateId) => {
    return get(`/company/${companyId}/test-results/${candidateId}`, false, 60_000);
  },
};