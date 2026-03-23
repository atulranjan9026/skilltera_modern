// Enterprise Management API Constants
export const ENTERPRISE_API = {
  // LOB endpoints
  LOB_GET_ALL: '/company/lobs',
  LOB_CREATE: '/company/lobs',
  LOB_UPDATE: '/company/lobs/',
  LOB_DELETE: '/company/lobs/',
  LOB_BULK_CREATE: '/company/lobs/bulk',

  // Hiring Manager endpoints
  HIRING_MANAGER_GET_ALL: '/company/hiring-managers',
  HIRING_MANAGER_CREATE: '/company/hiring-managers',
  HIRING_MANAGER_UPDATE: '/company/hiring-managers/',
  HIRING_MANAGER_DELETE: '/company/hiring-managers/',
  HIRING_MANAGER_BULK_CREATE: '/company/hiring-managers/bulk',

  // Backup Hiring Manager endpoints
  BACKUP_HIRING_MANAGER_GET_ALL: '/company/backup-hiring-managers',
  BACKUP_HIRING_MANAGER_CREATE: '/company/backup-hiring-managers',
  BACKUP_HIRING_MANAGER_UPDATE: '/company/backup-hiring-managers/',
  BACKUP_HIRING_MANAGER_DELETE: '/company/backup-hiring-managers/',

  // Recruiter endpoints
  RECRUITER_GET_ALL: '/company/recruiters',
  RECRUITER_CREATE: '/company/recruiters',
  RECRUITER_UPDATE: '/company/recruiters/',
  RECRUITER_DELETE: '/company/recruiters/',
  RECRUITER_BULK_CREATE: '/company/recruiters/bulk',
  
  // Interviewer endpoints
  INTERVIEWER_GET_ALL: '/company/interviewers',
  INTERVIEWER_CREATE: '/company/interviewers',
  INTERVIEWER_UPDATE: '/company/interviewers/',
  INTERVIEWER_DELETE: '/company/interviewers/',
  INTERVIEWER_BULK_CREATE: '/company/interviewers/bulk',
};

// Enterprise Management Messages
export const ENTERPRISE_MESSAGES = {
  LOB: {
    CREATE_SUCCESS: 'LOB created successfully',
    UPDATE_SUCCESS: 'LOB updated successfully',
    DELETE_SUCCESS: 'LOB deleted successfully',
    BULK_CREATE_SUCCESS: 'LOBs created successfully',
  },
  HIRING_MANAGER: {
    CREATE_SUCCESS: 'Hiring Manager created successfully',
    UPDATE_SUCCESS: 'Hiring Manager updated successfully',
    DELETE_SUCCESS: 'Hiring Manager deleted successfully',
    BULK_CREATE_SUCCESS: 'Hiring Managers created successfully',
  },
  BACKUP_HIRING_MANAGER: {
    CREATE_SUCCESS: 'Backup Hiring Manager created successfully',
    UPDATE_SUCCESS: 'Backup Hiring Manager updated successfully',
    DELETE_SUCCESS: 'Backup Hiring Manager deleted successfully',
  },
  RECRUITER: {
    CREATE_SUCCESS: 'Recruiter created successfully',
    UPDATE_SUCCESS: 'Recruiter updated successfully',
    DELETE_SUCCESS: 'Recruiter deleted successfully',
    BULK_CREATE_SUCCESS: 'Recruiters created successfully',
    INVITATION_SENT: 'Invitation sent to existing recruiter',
  },
  INTERVIEWER: {
    CREATE_SUCCESS: 'Interviewer created successfully',
    UPDATE_SUCCESS: 'Interviewer updated successfully',
    DELETE_SUCCESS: 'Interviewer deleted successfully',
    BULK_CREATE_SUCCESS: 'Interviewers created successfully',
  },
  VALIDATION: {
    NAME_REQUIRED: 'Name is required',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Valid email is required',
    NAME_MIN_LENGTH: 'Name must be at least 3 characters',
  },
};
