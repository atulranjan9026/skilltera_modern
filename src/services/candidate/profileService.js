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
     * Upload profile avatar via backend session upload
     */
    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            // Using plural as main endpoint (now correctly joined in api.js)
            const response = await post('/candidates/profile/avatar', formData);
            
            return {
                success: true,
                data: response.data,
                message: 'Avatar uploaded successfully',
            };
        } catch (error) {
            console.error('Avatar upload error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Upload resume via backend (handles S3/Cloudinary internally)
     */
    uploadResume: async (file) => {
        try {
            const formData = new FormData();
            formData.append('resume', file);

            // Using plural as main endpoint (now correctly joined in api.js)
            const response = await post('/candidates/profile/resume', formData);
            
            return {
                success: true,
                data: response.data,
                message: 'Resume uploaded successfully',
            };
        } catch (error) {
            console.error('Resume upload error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Delete resume via backend
     */
    deleteResume: async (currentResume) => {
        try {
            // Use DELETE endpoint as defined in backend routes
            clearCache('GET:/candidates/profile');
            const response = await del('/candidates/profile/resume');
            
            return {
                success: true,
                message: 'Resume deleted successfully',
            };
        } catch (error) {
            console.error('Resume deletion error:', error.response?.data || error.message);
            throw error;
        }
    },
};
