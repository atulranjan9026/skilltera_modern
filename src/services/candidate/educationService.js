import { post, put, del, clearCache } from '../api';

export const educationService = {
    /**
     * Add education
     */
    addEducation: async (educationData) => {
        clearCache('GET:/candidates/profile');
        return post('/candidates/profile/education', educationData);
    },

    /**
     * Update education
     */
    updateEducation: async (educationId, educationData) => {
        clearCache('GET:/candidates/profile');
        return put(`/candidates/profile/education/${educationId}`, educationData);
    },

    /**
     * Delete education
     */
    deleteEducation: async (educationId) => {
        clearCache('GET:/candidates/profile');
        return del(`/candidates/profile/education/${educationId}`);
    }
};
