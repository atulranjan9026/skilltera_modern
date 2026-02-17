import { get, post, patch, del, clearCache } from '../api';

export const profileService = {
    /**
     * Get candidate profile (cached for 5 minutes)
     */
    getProfile: async () => {
        const response = await get('/candidates/profile', true, 300000);
        // Backend returns { success: true, data: profile, message: ... }
        return response;
    },

    /**
     * Update candidate profile
     */
    updateProfile: async (profileData) => {
        clearCache('GET:/candidates/profile');
        return patch('/candidates/profile', profileData);
    },

    /**
     * Upload profile avatar
     */
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        clearCache('GET:/api/candidate'); // Legacy cache key just in case
        clearCache('GET:/candidates/profile');
        return post('/candidates/profile/avatar', formData);
    },

    /**
     * Upload resume
     */
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        clearCache('GET:/candidates/profile');
        return post('/candidates/profile/resume', formData);
    },

    /**
     * Delete resume
     */
    deleteResume: async () => {
        clearCache('GET:/candidates/profile');
        return del('/candidates/profile/resume');
    }
};
