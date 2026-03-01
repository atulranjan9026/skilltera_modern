/**
 * Test Service - API calls for candidate assessment
 * Base path: /api/v1/candidates/test
 */
import { get, post, patch } from '../../../services/api';

const BASE = '/candidates/test';

export const testService = {
  getTestPlan: (config) => get(`${BASE}/latest`, false),
  createUpdateTest: (config) => patch(BASE, config),
  generateProblem: (config, opts = {}) =>
    post(`${BASE}/get-prompt`, { flag: 'generateProblem', config }, { timeout: opts.timeout || 120000 }),
  storeProblem: (problem, practiceMode) =>
    post(`${BASE}/store-problem`, { problem, timestamp: new Date().toISOString(), practiceMode }),
  getProblem: () => get(`${BASE}/get-problem`, false),
  uploadSelfIntro: (data, practiceMode) => {
    if (data instanceof FormData) {
      if (practiceMode) data.append('practiceMode', 'true');
      return patch(`${BASE}/upload-selfintro`, data);
    }
    return patch(`${BASE}/upload-selfintro`, { ...data, practiceMode });
  },
  uploadSolution: (file, problemTitle, practiceMode) => {
    const formData = new FormData();
    formData.append('solution', file);
    if (problemTitle) formData.append('problemTitle', problemTitle);
    if (practiceMode) formData.append('practiceMode', 'true');
    return post(`${BASE}/upload-solution`, formData);
  },
  uploadEvaluation: (data, practiceMode) =>
    post(`${BASE}/upload-evaluation`, { ...data, practiceMode }),
  uploadEnvScan: (data, practiceMode) =>
    patch(`${BASE}/upload-envscan`, { ...data, practiceMode }),
  storeViolation: (data) => post(`${BASE}/alert`, { violationData: data }),
  getTestResults: () => get(`${BASE}/results`, false),
  checkTestCompletion: (candidateId) => get(`${BASE}/completion/${candidateId || 'me'}`, false),
  getPrompt: (flag, config) => post(`${BASE}/get-prompt`, { flag, config }),
  generateTestPlan: (config) => post(`${BASE}/get-prompt`, { flag: 'generateTestPlan', config }, { timeout: 120000 }),
  evaluateCode: (config) => post(`${BASE}/get-prompt`, { flag: 'evaluateCode', config }, { timeout: 120000 }),
  evaluateNonTechnical: (config) => post(`${BASE}/get-prompt`, { flag: 'evaluateNonTechnicalCode', config }, { timeout: 120000 }),
};

// Session upload (S3 multipart)
export const sessionUploadService = {
  initiate: (body) => post(`${BASE}/session-upload/initiate`, body),
  sign: (params) => get(`${BASE}/session-upload/sign?${new URLSearchParams(params)}`, false),
  parts: (params) => get(`${BASE}/session-upload/parts?${new URLSearchParams(params)}`, false),
  complete: (body) => post(`${BASE}/session-upload/complete`, body),
  abort: (body) => post(`${BASE}/session-upload/abort`, body),
};
