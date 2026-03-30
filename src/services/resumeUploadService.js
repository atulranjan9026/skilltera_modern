import { post, get, del, api } from './api';

/**
 * Resume Upload Service
 * Handles AWS S3-based resume upload functionality
 */
class ResumeUploadService {
    constructor() {
        this.baseEndpoint = '/candidates/resume';
    }

    /**
     * Upload resume with progress tracking
     * @param {File} file - Resume file to upload
     * @param {Function} onProgress - Progress callback function
     * @returns {Promise<Object>} Upload result
     */
    async uploadResume(file, onProgress = null) {
        // Validate file
        const validation = this.validateResumeFile(file);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await this.makeRequestWithProgress(
                `${this.baseEndpoint}/upload`,
                {
                    method: 'POST',
                    body: formData,
                    onProgress
                }
            );

            return response;
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Resume upload failed: ${error.message}`);
        }
    }

    /**
     * Get current resume information
     * @returns {Promise<Object|null>} Current resume data or null
     */
    async getCurrentResume() {
        try {
            const response = await get(`${this.baseEndpoint}/current`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error(`Failed to get current resume: ${error.message}`);
        }
    }

    /**
     * Get resume history
     * @returns {Promise<Array>} Array of resume history
     */
    async getResumeHistory() {
        try {
            const response = await get(`${this.baseEndpoint}/history`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get resume history: ${error.message}`);
        }
    }

    /**
     * Get pre-signed URL for resume download
     * @param {string} resumeId - Resume ID
     * @returns {Promise<string>} Pre-signed URL
     */
    async getResumeUrl(resumeId) {
        try {
            const response = await get(`${this.baseEndpoint}/${resumeId}/url`);
            return response.data.url;
        } catch (error) {
            throw new Error(`Failed to get resume URL: ${error.message}`);
        }
    }

    /**
     * Delete current resume
     * @returns {Promise<Object>} Deletion result
     */
    async deleteResume() {
        try {
            const response = await del(this.baseEndpoint);
            return response;
        } catch (error) {
            throw new Error(`Resume deletion failed: ${error.message}`);
        }
    }

    /**
     * Generate share token for resume
     * @param {string} resumeId - Resume ID
     * @param {number} expiresInHours - Expiration time in hours (default: 24)
     * @returns {Promise<Object>} Share token data
     */
    async generateShareToken(resumeId, expiresInHours = 24) {
        try {
            const response = await post(`${this.baseEndpoint}/${resumeId}/share`, {
                expiresInHours
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to generate share token: ${error.message}`);
        }
    }

    /**
     * Access shared resume (public endpoint)
     * @param {string} resumeId - Resume ID
     * @param {string} token - Share token
     * @returns {Promise<Object>} Shared resume data
     */
    async accessSharedResume(resumeId, token) {
        try {
            const response = await fetch(`/api${this.baseEndpoint}/${resumeId}/shared/${token}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to access shared resume');
            }
            
            return data.data;
        } catch (error) {
            throw new Error(`Failed to access shared resume: ${error.message}`);
        }
    }

    /**
     * Validate resume file
     * @param {File} file - File to validate
     * @returns {Object} Validation result
     */
    validateResumeFile(file) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        const maxSizeMB = 2;

        const errors = [];

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed. Only PDF, DOC, and DOCX files are allowed.`);
        }

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            errors.push(`File size exceeds ${maxSizeMB}MB limit. Current size: ${this.formatFileSize(file.size)}`);
        }

        // Check file name
        if (!file.name || file.name.trim() === '') {
            errors.push('File name is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Make HTTP request with progress tracking
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async makeRequestWithProgress(endpoint, options = {}) {
        const { method = 'GET', body = null, onProgress = null } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            // Load complete
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            resolve(response);
                        } else {
                            reject(new Error(response.message));
                        }
                    } catch (e) {
                        reject(new Error('Invalid response from server'));
                    }
                } else {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        reject(new Error(errorResponse.message));
                    } catch {
                        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                    }
                }
            });

            // Error handling
            xhr.addEventListener('error', () => {
                reject(new Error('Network error occurred'));
            });

            xhr.addEventListener('timeout', () => {
                reject(new Error('Request timeout'));
            });

            // Configure and send
            xhr.timeout = 300000; // 5 minutes timeout
            xhr.open(method, `${api.defaults.baseURL}${endpoint}`);
            
            // Add auth token
            const token = localStorage.getItem('token');
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            if (body && !(body instanceof FormData)) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.send(body);
        });
    }

    /**
     * Format file size in human-readable format
     * @param {number} bytes - File size in bytes
     * @param {number} decimal - Decimal places
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes, decimal = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i];
    }

    /**
     * Get file type display name
     * @param {string} mimeType - MIME type
     * @returns {string} Display name
     */
    getFileTypeDisplayName(mimeType) {
        switch (mimeType) {
            case 'application/pdf':
                return 'PDF';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'DOCX';
            case 'application/msword':
                return 'DOC';
            default:
                return 'Unknown';
        }
    }

    /**
     * Download resume from URL
     * @param {string} url - Download URL
     * @param {string} filename - Filename for download
     * @returns {Promise<void>}
     */
    async downloadResume(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            throw new Error(`Failed to download resume: ${error.message}`);
        }
    }

    /**
     * Preview resume in new tab
     * @param {string} url - Resume URL
     * @returns {void}
     */
    previewResume(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Export singleton instance
const resumeUploadService = new ResumeUploadService();
export default resumeUploadService;
