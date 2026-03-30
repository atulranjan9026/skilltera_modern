// utils/auth.js
// Shared authentication utilities for the application

// ─── COMPANY USER HELPERS ─────────────────────────────────────────────────────

/**
 * Get the current company user from localStorage
 * @returns {Object} Company user object or empty object
 */
export function getCompanyUser() {
  try {
    return JSON.parse(localStorage.getItem("companyUser")) || {};
  } catch {
    return {};
  }
}

/**
 * Get the company ID from the current company user
 * @returns {string} Company ID or empty string
 */
export function getCompanyId() {
  const user = getCompanyUser();
  if (user.role === 'company') {
    return user._id || user.id || "";
  }
  // For sub-roles like hiring_manager or interviewer, 
  // the company reference is in the companyId field.
  if (user.companyId) {
    return typeof user.companyId === 'object' ? user.companyId._id : user.companyId;
  }
  return user._id || user.id || "";
}

/**
 * Save company user data to localStorage
 * @param {Object} userData - Company user data to save
 */
export function saveCompanyUser(userData) {
  try {
    const currentUser = getCompanyUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("companyUser", JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return getCompanyUser();
  }
}

/**
 * Check if a company user is logged in
 * @returns {boolean} True if company user is logged in
 */
export function isCompanyLoggedIn() {
  const user = getCompanyUser();
  return !!(user._id || user.id);
}

/**
 * Check if a company user is logged in (alias for isCompanyLoggedIn)
 * @returns {boolean} True if company user is logged in
 */
export function isCompanyAuthenticated() {
  return isCompanyLoggedIn();
}

// ─── CANDIDATE USER HELPERS ───────────────────────────────────────────────────

/**
 * Get the current candidate user from localStorage
 * @returns {Object} Candidate user object or empty object
 */
export function getCandidateUser() {
  try {
    return JSON.parse(localStorage.getItem("candidateUser")) || {};
  } catch {
    return {};
  }
}

/**
 * Get the candidate ID from the current candidate user
 * @returns {string} Candidate ID or empty string
 */
export function getCandidateId() {
  const user = getCandidateUser();
  return user._id || user.id || "";
}

/**
 * Save candidate user data to localStorage
 * @param {Object} userData - Candidate user data to save
 */
export function saveCandidateUser(userData) {
  try {
    const currentUser = getCandidateUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("candidateUser", JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return getCandidateUser();
  }
}

/**
 * Check if a candidate user is logged in
 * @returns {boolean} True if candidate user is logged in
 */
export function isCandidateLoggedIn() {
  const user = getCandidateUser();
  return !!(user._id || user.id);
}

// ─── GENERAL AUTH HELPERS ────────────────────────────────────────────────────

/**
 * Get the current user type (company or candidate)
 * @returns {string} 'company' | 'candidate' | null
 */
export function getUserType() {
  const isCompany = isCompanyLoggedIn();
  const isCandidate = isCandidateLoggedIn();
  
  if (isCompany) return "company";
  if (isCandidate) return "candidate";
  
  console.log('[auth.js] getUserType - No user logged in:', {
    isCompanyLoggedIn: isCompany,
    isCandidateLoggedIn: isCandidate,
    candidateData: getCandidateUser(),
    companyData: getCompanyUser()
  });
  
  return null;
}

/**
 * Get the current user (company or candidate)
 * @returns {Object} Current user object or empty object
 */
export function getCurrentUser() {
  const userType = getUserType();
  const user = userType === "company" ? getCompanyUser() : getCandidateUser();
  
  if (!user?._id && !user?.id) {
    console.log('[auth.js] getCurrentUser - Empty user object:', {
      userType,
      isEmpty: true,
      candidateUserStorage: localStorage.getItem('candidateUser') ? 'exists' : 'missing',
      companyUserStorage: localStorage.getItem('companyUser') ? 'exists' : 'missing'
    });
  }
  
  return user;
}

/**
 * Get the current user ID
 * @returns {string} Current user ID or empty string
 */
export function getCurrentUserId() {
  const userType = getUserType();
  return userType === "company" ? getCompanyId() : getCandidateId();
}

/**
 * Clear all authentication data from localStorage and sessionStorage
 * This ensures complete session cleanup to prevent role conflicts
 */
export function clearAuthData() {
  try {
    // Clear localStorage
    localStorage.removeItem("companyUser");
    localStorage.removeItem("candidateUser");
    localStorage.removeItem("companyToken");
    localStorage.removeItem("candidateToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear sessionStorage (for any session-based auth data)
    sessionStorage.clear();
    
    // Clear any additional auth-related keys that might exist
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('token') || 
        key.includes('auth') || 
        key.includes('user') || 
        key.includes('session')
      )) {
        keysToRemove.push(key);
      }
    }
    
  } catch (error) {
    // Continue even if some cleanup fails
  }
}

/**
 * Check if any user is logged in
 * @returns {boolean} True if any user is logged in
 */
export function isLoggedIn() {
  return isCompanyLoggedIn() || isCandidateLoggedIn();
}
