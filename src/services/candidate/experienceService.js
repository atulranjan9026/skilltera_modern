import { post, put, del, clearCache } from '../api';

export const experienceService = {
    /**
     * Add experience
     */
    addExperience: async (experienceData) => {
        clearCache('GET:/candidates/profile');
        return post('/candidates/profile/experience', experienceData);
    },

    /**
     * Update experience
     */
    updateExperience: async (experienceId, experienceData) => {
        clearCache('GET:/candidates/profile');
        return put(`/candidates/profile/experience/${experienceId}`, experienceData);
    },

    /**
     * Delete experience
     */
    deleteExperience: async (experienceId) => {
        clearCache('GET:/candidates/profile');
        return del(`/candidates/profile/experience/${experienceId}`);
    }
};
