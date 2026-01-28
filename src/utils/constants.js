/**
 * Common constants used throughout the application
 */

export const USER_ROLES = {
  CANDIDATE: 'candidate',
  COMPANY: 'company',
  ADMIN: 'admin',
};

export const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  DRAFT: 'draft',
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  CANDIDATE: {
    DASHBOARD: '/candidate/dashboard',
    PROFILE: '/candidate/profile',
    APPLICATIONS: '/candidate/applications',
    SAVED_JOBS: '/candidate/saved-jobs',
  },
  COMPANY: {
    DASHBOARD: '/company/dashboard',
    PROFILE: '/company/profile',
    JOBS: '/company/jobs',
    POST_JOB: '/company/jobs/new',
    APPLICATIONS: '/company/applications',
    TEAM: '/company/team',
  },
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  CANDIDATES: '/candidates',
  COMPANIES: '/companies',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
};
