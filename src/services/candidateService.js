import { get, post, put, del, clearCache, api } from './api';

/**
 * Candidate service - handles candidate-related API calls
 * Refactored to use modular services
 */
import { profileService } from './candidate/profileService';
import { skillService } from './candidate/skillService';
import { jobService } from './candidate/jobService';
import { experienceService } from './candidate/experienceService';
import { educationService } from './candidate/educationService';
import { certificateService } from './candidate/certificateService';

export const candidateService = {
  // Profile
  ...profileService,

  // Skills
  ...skillService,

  // Jobs
  ...jobService,

  // Experience
  ...experienceService,

  // Education
  ...educationService,

  // Certificates
  ...certificateService
};
